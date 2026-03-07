namespace WorkforceAPI.src.Domain.Entities
{

    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? HeadOf { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Employee> Employees { get; set; } = [];
    }

    public class Designation
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Level { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Employee> Employees { get; set; } = [];
    }
}
