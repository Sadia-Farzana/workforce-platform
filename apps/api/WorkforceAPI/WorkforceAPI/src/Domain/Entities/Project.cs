using WorkforceAPI.src.Domain.Entities;

namespace WorkforceAPI.src.Domain.Entities;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ProjectStatus Status { get; set; } = ProjectStatus.Active;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<ProjectEmployee> ProjectEmployees { get; set; } = [];
    public ICollection<TaskItem> Tasks { get; set; } = [];

    // Computed (ignored by EF)
    public int TeamSize => ProjectEmployees.Count;
    public int CompletedTasks => Tasks.Count(t => t.Status == TaskStatus.Done);
    public int TotalTasks => Tasks.Count;
    public double Progress => TotalTasks == 0 ? 0 : Math.Round((double)CompletedTasks / TotalTasks * 100, 1);
}

public class ProjectEmployee
{
    public int ProjectId { get; set; }
    public int EmployeeId { get; set; }
    public string Role { get; set; } = "Member";
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Project Project { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskStatus Status { get; set; } = TaskStatus.Backlog;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public DateTime? DueDate { get; set; }
    public int ProjectId { get; set; }
    public int? AssignedToId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Project Project { get; set; } = null!;
    public Employee? AssignedTo { get; set; }
}