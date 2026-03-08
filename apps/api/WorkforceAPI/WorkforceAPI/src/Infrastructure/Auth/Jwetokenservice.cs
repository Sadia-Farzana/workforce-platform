using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WorkforceAPI.src.Application.Interfaces;
using WorkforceAPI.src.Domain.Entities;

namespace WorkforceAPI.src.Infrastructure.Auth
{
    public class JwtSettings
    {
        public string Secret { get; init; } = string.Empty;
        public string EncryptionSecret { get; init; } = string.Empty;  // separate key for encryption
        public string Issuer { get; init; } = string.Empty;
        public string Audience { get; init; } = string.Empty;
        public int AccessTokenMins { get; init; } = 60;
        public int RefreshTokenDays { get; init; } = 7;
    }

    // =============================================================
    // JWE TOKEN SERVICE
    //
    // JWE (JSON Web Encryption) wraps the signed JWT inside an
    // encrypted envelope. Even if someone intercepts the token they
    // cannot read the claims — only the server can decrypt it.
    //
    // Algorithm choices:
    //   Key-wrap   : AES-256-KW      (wraps the content encryption key)
    //   Content-enc: AES-256-CBC-HMAC-SHA512  (encrypts the payload)
    //   Signing    : HMAC-SHA256     (inner signature)
    //
    // Token structure (JWE Compact):
    //   BASE64URL(header) . BASE64URL(encrypted-key) .
    //   BASE64URL(iv) . BASE64URL(ciphertext) . BASE64URL(tag)
    // =============================================================
    public class JweTokenService(IOptions<JwtSettings> opts) : ITokenService
    {
        private readonly JwtSettings _cfg = opts.Value;

        // ── Signing key (HMAC-SHA256) — verifies inner JWT ────────
        private SymmetricSecurityKey SigningKey =>
            new(Encoding.UTF8.GetBytes(_cfg.Secret));

        // ── Encryption key (AES-256) — encrypts entire payload ───
        // Must be exactly 256 bits (32 bytes) — we SHA256-hash the secret
        private SymmetricSecurityKey EncryptionKey =>
            new(SHA256.HashData(
                Encoding.UTF8.GetBytes(_cfg.EncryptionSecret)));

        // ─────────────────────────────────────────────────────────
        // Generate Access Token  →  JWE compact serialization
        // ─────────────────────────────────────────────────────────
        public string GenerateAccessToken(AppUser user)
        {
            var claims = BuildClaims(user);

            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Issuer = _cfg.Issuer,
                Audience = _cfg.Audience,
                Expires = GetAccessTokenExpiry(),

                // Inner signature — HMAC-SHA256
                SigningCredentials = new SigningCredentials(
                    SigningKey,
                    SecurityAlgorithms.HmacSha256),

                // Outer encryption — AES-256
                EncryptingCredentials = new EncryptingCredentials(
                    EncryptionKey,
                    SecurityAlgorithms.Aes256KW,
                    SecurityAlgorithms.Aes256CbcHmacSha512)
            };

            var handler = new JwtSecurityTokenHandler();
            return handler.CreateEncodedJwt(descriptor);
        }

        // ─────────────────────────────────────────────────────────
        // Generate Refresh Token — opaque 64-byte random string
        // URL-safe Base64, stored in DB, never exposed to client
        // ─────────────────────────────────────────────────────────
        public string GenerateRefreshToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(64);
            return Convert.ToBase64String(bytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .TrimEnd('=');
        }

        // ─────────────────────────────────────────────────────────
        // Validate Access Token
        // Decrypts the JWE envelope, verifies the inner signature,
        // then returns the userId (sub claim) or null if invalid.
        // ─────────────────────────────────────────────────────────
        public int? ValidateAccessToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token)) return null;

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var parameters = BuildValidationParameters();

                var principal = handler.ValidateToken(token, parameters, out _);

                var sub = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                       ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);

                return int.TryParse(sub, out var id) ? id : null;
            }
            catch
            {
                return null;
            }
        }

        public DateTime GetAccessTokenExpiry()
            => DateTime.UtcNow.AddMinutes(_cfg.AccessTokenMins);

        // ── Private helpers ───────────────────────────────────────

        private static Claim[] BuildClaims(AppUser user) =>
        [
            new(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
        new(JwtRegisteredClaimNames.Email, user.Email),
        new(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
        new(JwtRegisteredClaimNames.Iat,
            DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
            ClaimValueTypes.Integer64),
        new(ClaimTypes.NameIdentifier,     user.Id.ToString()),
        new(ClaimTypes.Role,               user.Role),
        new("username",                    user.Username),
        new("employeeId",                  user.EmployeeId?.ToString() ?? string.Empty)
        ];

        private TokenValidationParameters BuildValidationParameters() => new()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _cfg.Issuer,
            ValidAudience = _cfg.Audience,
            IssuerSigningKey = SigningKey,
            TokenDecryptionKey = EncryptionKey,   // decrypt JWE envelope
            ClockSkew = TimeSpan.Zero     // strict expiry
        };
    }

}
