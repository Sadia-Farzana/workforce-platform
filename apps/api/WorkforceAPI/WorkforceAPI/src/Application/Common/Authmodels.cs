using System.ComponentModel.DataAnnotations;

namespace WorkforceAPI.src.Application.Common
{
    public record LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; init; } = string.Empty;

        [Required]
        public string Password { get; init; } = string.Empty;
    }

    public record RegisterRequest
    {
        [Required]
        [MaxLength(100)]
        public string Username { get; init; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; init; } = string.Empty;

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        public string Password { get; init; } = string.Empty;

        public string Role { get; init; } = "Employee";
        public int? EmployeeId { get; init; }
    }

    public record RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; init; } = string.Empty;
    }

    public record ChangePasswordRequest
    {
        [Required]
        public string CurrentPassword { get; init; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string NewPassword { get; init; } = string.Empty;
    }

    // =============================================================
    // RESPONSES
    // =============================================================

    public record LoginResponse(
        string AccessToken,
        string RefreshToken,
        DateTime ExpiresAt,
        string TokenType,
        UserInfoResponse User);

    public record UserInfoResponse(
        int Id,
        string Username,
        string Email,
        string Role,
        int? EmployeeId);
}
