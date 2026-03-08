using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorkforceAPI.src.Application.Common;
using WorkforceAPI.src.Application.Interfaces;

namespace WorkforceAPI.Controller
{
    [ApiController]
    [Route("api/v1/auth")]
    [Produces("application/json")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        // POST /api/v1/auth/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(
            [FromBody] LoginRequest request, CancellationToken ct)
            => Ok(await authService.LoginAsync(request, ct));

        // POST /api/v1/auth/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(
            [FromBody] RegisterRequest request, CancellationToken ct)
        {
            var result = await authService.RegisterAsync(request, ct);
            return StatusCode(201, result);
        }

        // POST /api/v1/auth/refresh
        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh(
            [FromBody] RefreshTokenRequest request, CancellationToken ct)
            => Ok(await authService.RefreshTokenAsync(request, ct));

        // POST /api/v1/auth/logout
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout(
            [FromBody] RefreshTokenRequest request, CancellationToken ct)
            => Ok(await authService.LogoutAsync(request.RefreshToken, ct));

        // POST /api/v1/auth/change-password
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(
            [FromBody] ChangePasswordRequest request, CancellationToken ct)
            => Ok(await authService.ChangePasswordAsync(CurrentUserId(), request, ct));

        // GET /api/v1/auth/me
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me(CancellationToken ct)
            => Ok(await authService.MeAsync(CurrentUserId(), ct));

        private int CurrentUserId()
        {
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue("userId");

            return int.TryParse(value, out var id) ? id
                : throw new UnauthorizedAccessException("User identity not found in token");
        }
    }

}
