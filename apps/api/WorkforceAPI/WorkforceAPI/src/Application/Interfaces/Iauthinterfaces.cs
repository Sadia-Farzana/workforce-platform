using WorkforceAPI.src.Application.Common;
using WorkforceAPI.src.Domain.Entities;

namespace WorkforceAPI.src.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(AppUser user);
        string GenerateRefreshToken();
        int? ValidateAccessToken(string token);   // returns userId or null
        DateTime GetAccessTokenExpiry();
    }

    // =============================================================
    // AUTH SERVICE — business logic for all auth operations
    // =============================================================
    public interface IAuthService
    {
        Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken ct = default);
        Task<ApiResponse<LoginResponse>> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
        Task<ApiResponse<LoginResponse>> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken ct = default);
        Task<ApiResponse> LogoutAsync(string refreshToken, CancellationToken ct = default);
        Task<ApiResponse> ChangePasswordAsync(int userId, ChangePasswordRequest request, CancellationToken ct = default);
        Task<ApiResponse<UserInfoResponse>> MeAsync(int userId, CancellationToken ct = default);
    }

    // =============================================================
    // USER REPOSITORY
    // =============================================================
    public interface IUserRepository
    {
        Task<AppUser?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<AppUser?> GetByEmailAsync(string email, CancellationToken ct = default);
        Task<AppUser> CreateAsync(AppUser user, CancellationToken ct = default);
        Task<AppUser> UpdateAsync(AppUser user, CancellationToken ct = default);
    }

    // =============================================================
    // REFRESH TOKEN REPOSITORY
    // =============================================================
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default);
        Task CreateAsync(RefreshToken token, CancellationToken ct = default);
        Task RevokeAsync(RefreshToken token, string? replacedBy = null, CancellationToken ct = default);
        Task RevokeAllForUserAsync(int userId, CancellationToken ct = default);
    }

}
