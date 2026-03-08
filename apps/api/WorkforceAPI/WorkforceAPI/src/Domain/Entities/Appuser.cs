namespace WorkforceAPI.src.Domain.Entities
{
    public class AppUser
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = UserRoles.Employee;
        public int? EmployeeId { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }

        public Employee? Employee { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
    }

    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; } = false;
        public string? ReplacedBy { get; set; }   // token rotation tracking

        public AppUser User { get; set; } = null!;
    }

    public static class UserRoles
    {
        public const string Admin = "Admin";
        public const string HR = "HR";
        public const string Manager = "Manager";
        public const string Employee = "Employee";
    }
}
