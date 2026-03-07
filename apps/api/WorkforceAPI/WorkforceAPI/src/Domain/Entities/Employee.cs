namespace WorkforceAPI.src.Domain.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public int DepartmentId { get; set; }
        public int DesignationId { get; set; }
        public decimal Salary { get; set; }
        public DateTime JoiningDate { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? AvatarUrl { get; set; }
        public List<string> Skills { get; set; } = [];
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Department Department { get; set; } = null!;
        public Designation Designation { get; set; } = null!;
        public ICollection<ProjectEmployee> ProjectEmployees { get; set; } = [];
        public ICollection<TaskItem> AssignedTasks { get; set; } = [];

        // Computed
        public string FullName => $"{FirstName} {LastName}";
    }
}

