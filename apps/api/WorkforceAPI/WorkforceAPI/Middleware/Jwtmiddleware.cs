using System.Security.Claims;
using WorkforceAPI.src.Application.Interfaces;

namespace WorkforceAPI.Middleware
{
    public class JwtMiddleware(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context, ITokenService tokenService)
        {
            var token = ExtractBearerToken(context);

            if (!string.IsNullOrEmpty(token))
            {
                var userId = tokenService.ValidateAccessToken(token);

                if (userId.HasValue)
                    SetContextUser(context, userId.Value);
            }

            await next(context);
        }

        // ── Extract token from "Authorization: Bearer <token>" ───
        private static string? ExtractBearerToken(HttpContext context)
        {
            var header = context.Request.Headers.Authorization.FirstOrDefault();
            return header?.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase) == true
                ? header["Bearer ".Length..].Trim()
                : null;
        }

        // ── Build ClaimsPrincipal and attach to context ───────────
        private static void SetContextUser(HttpContext context, int userId)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim("userId",                  userId.ToString())
        };

            context.User = new ClaimsPrincipal(
                new ClaimsIdentity(claims, authenticationType: "JweBearer"));
        }
    }

    public static class JwtMiddlewareExtensions
    {
        public static IApplicationBuilder UseJwtMiddleware(this IApplicationBuilder app)
            => app.UseMiddleware<JwtMiddleware>();
    }
}
