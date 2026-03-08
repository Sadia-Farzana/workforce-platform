using Microsoft.AspNetCore.Identity;
using WorkforceAPI.src.Application.Common;
using WorkforceAPI.src.Application.Interfaces;
using WorkforceAPI.src.Domain.Entities;

namespace WorkforceAPI.src.Application.Services
{
    public class AuthService(
     IUserRepository userRepo,
     IRefreshTokenRepository refreshRepo,
     ITokenService tokenService) : IAuthService
    {
        // ── Login ─────────────────────────────────────────────────
        public async Task<ApiResponse<LoginResponse>> LoginAsync(
            LoginRequest request, CancellationToken ct = default)
        {
            var user = await userRepo.GetByEmailAsync(request.Email, ct);
            if (user is null)
                throw new UnauthorizedAccessException("Invalid email or password");

            var hasher = new PasswordHasher<AppUser>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

            if (result == PasswordVerificationResult.Failed)
                throw new UnauthorizedAccessException("Invalid email or password");

            if (!user.IsActive)
                throw new UnauthorizedAccessException("Account is deactivated");

            user.LastLoginAt = DateTime.UtcNow;
            await userRepo.UpdateAsync(user, ct);

            var tokens = await IssueTokenPairAsync(user, ct);

            return ApiResponse<LoginResponse>.Ok(tokens, "Login successful");
        }

        // ── Register ──────────────────────────────────────────────
        public async Task<ApiResponse<LoginResponse>> RegisterAsync(
            RegisterRequest request, CancellationToken ct = default)
        {
            if (await userRepo.GetByEmailAsync(request.Email, ct) is not null)
                throw new InvalidOperationException("An account with this email already exists");

            if (!IsValidRole(request.Role))
                throw new ArgumentException($"Invalid role '{request.Role}'. Valid: Admin, HR, Manager, Employee");

            var user = new AppUser
            {
                Username = request.Username,
                Email = request.Email.ToLower().Trim(),
                Role = request.Role,
                EmployeeId = request.EmployeeId
            };

            var hasher = new PasswordHasher<AppUser>();
            user.PasswordHash = hasher.HashPassword(user, request.Password);

            var created = await userRepo.CreateAsync(user, ct);
            var tokens = await IssueTokenPairAsync(created, ct);

            return ApiResponse<LoginResponse>.Ok(tokens, "Account created successfully");
        }

        // ── Refresh Token ─────────────────────────────────────────
        public async Task<ApiResponse<LoginResponse>> RefreshTokenAsync(
            RefreshTokenRequest request, CancellationToken ct = default)
        {
            var stored = await refreshRepo.GetByTokenAsync(request.RefreshToken, ct)
                ?? throw new UnauthorizedAccessException("Invalid or expired refresh token");

            if (!stored.User.IsActive)
                throw new UnauthorizedAccessException("Account is deactivated");

            // Generate new pair
            var newAccessToken = tokenService.GenerateAccessToken(stored.User);
            var newRefreshToken = tokenService.GenerateRefreshToken();
            var expiresAt = tokenService.GetAccessTokenExpiry();

            // Rotate — revoke old, store new (one-time use)
            await refreshRepo.RevokeAsync(stored, replacedBy: newRefreshToken, ct);
            await refreshRepo.CreateAsync(new RefreshToken
            {
                Token = newRefreshToken,
                UserId = stored.UserId,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            }, ct);

            var response = new LoginResponse(
                newAccessToken,
                newRefreshToken,
                expiresAt,
                "Bearer",
                MapUserInfo(stored.User));

            return ApiResponse<LoginResponse>.Ok(response, "Token refreshed successfully");
        }

        // ── Logout ────────────────────────────────────────────────
        public async Task<ApiResponse> LogoutAsync(
            string refreshToken, CancellationToken ct = default)
        {
            var stored = await refreshRepo.GetByTokenAsync(refreshToken, ct)
                ?? throw new KeyNotFoundException("Refresh token not found or already revoked");

            await refreshRepo.RevokeAsync(stored, ct: ct);

            return ApiResponse.Ok("Logged out successfully");
        }

        // ── Change Password ───────────────────────────────────────
        public async Task<ApiResponse> ChangePasswordAsync(
            int userId, ChangePasswordRequest request, CancellationToken ct = default)
        {
            var user = await userRepo.GetByIdAsync(userId, ct)
                ?? throw new KeyNotFoundException("User not found");

            var hasher = new PasswordHasher<AppUser>();

            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);
            if (result == PasswordVerificationResult.Failed)
                throw new UnauthorizedAccessException("Current password is incorrect");

            user.PasswordHash = hasher.HashPassword(user, request.NewPassword);
            await userRepo.UpdateAsync(user, ct);

            // Security: revoke all sessions so user must log in again
            await refreshRepo.RevokeAllForUserAsync(userId, ct);

            return ApiResponse.Ok("Password changed. Please log in with your new password");
        }

        // ── Me ────────────────────────────────────────────────────
        public async Task<ApiResponse<UserInfoResponse>> MeAsync(
            int userId, CancellationToken ct = default)
        {
            var user = await userRepo.GetByIdAsync(userId, ct)
                ?? throw new KeyNotFoundException("User not found");

            return ApiResponse<UserInfoResponse>.Ok(MapUserInfo(user));
        }

        // ── Private helpers ───────────────────────────────────────

        private async Task<LoginResponse> IssueTokenPairAsync(AppUser user, CancellationToken ct)
        {
            var accessToken = tokenService.GenerateAccessToken(user);
            var refreshToken = tokenService.GenerateRefreshToken();
            var expiresAt = tokenService.GetAccessTokenExpiry();

            await refreshRepo.CreateAsync(new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            }, ct);

            return new LoginResponse(accessToken, refreshToken, expiresAt, "Bearer", MapUserInfo(user));
        }

        private static UserInfoResponse MapUserInfo(AppUser u) =>
            new(u.Id, u.Username, u.Email, u.Role, u.EmployeeId);

        private static bool IsValidRole(string role) =>
            role is UserRoles.Admin or UserRoles.HR or UserRoles.Manager or UserRoles.Employee;
    }
}
