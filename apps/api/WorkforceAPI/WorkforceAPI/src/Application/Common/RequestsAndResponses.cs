using System.ComponentModel.DataAnnotations;

namespace WorkforceAPI.src.Application.Common
{
    public record PagedRequest
    {
        [Range(1, int.MaxValue, ErrorMessage = "Page must be at least 1")]
        public int Page { get; init; } = 1;

        [Range(1, 100, ErrorMessage = "PageSize must be between 1 and 100")]
        public int PageSize { get; init; } = 20;

        public string? Search { get; init; }
        public string? SortBy { get; init; }
        public bool SortDesc { get; init; } = false;
    }

    // =============================================================
    // EMPLOYEE REQUESTS & RESPONSES
    // =============================================================

    public record CreateEmployeeRequest
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; init; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; init; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; init; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue)]
        public int DepartmentId { get; init; }

        [Required]
        [Range(1, int.MaxValue)]
        public int DesignationId { get; init; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Salary must be positive")]
        public decimal Salary { get; init; }

        [Required]
        public DateTime JoiningDate { get; init; }

        [Phone]
        public string? Phone { get; init; }

        public string? Address { get; init; }
        public string? City { get; init; }
        public string? Country { get; init; }
        public string? AvatarUrl { get; init; }
        public List<string>? Skills { get; init; }
    }

    public record UpdateEmployeeRequest
    {
        [MaxLength(100)]
        public string? FirstName { get; init; }

        [MaxLength(100)]
        public string? LastName { get; init; }

        [EmailAddress]
        public string? Email { get; init; }

        public int? DepartmentId { get; init; }
        public int? DesignationId { get; init; }
        public decimal? Salary { get; init; }
        public bool? IsActive { get; init; }

        [Phone]
        public string? Phone { get; init; }
        public string? Address { get; init; }
        public string? City { get; init; }
        public string? Country { get; init; }
        public string? AvatarUrl { get; init; }
        public List<string>? Skills { get; init; }
    }

    public record GetEmployeesRequest : PagedRequest
    {
        public int? DepartmentId { get; init; }
        public bool? IsActive { get; init; }
    }

    public record EmployeeResponse(
        int Id,
        string FirstName,
        string LastName,
        string FullName,
        string Email,
        bool IsActive,
        decimal Salary,
        DateTime JoiningDate,
        string? Phone,
        string? Address,
        string? City,
        string? Country,
        string? AvatarUrl,
        List<string> Skills,
        int DepartmentId,
        string DepartmentName,
        int DesignationId,
        string DesignationTitle,
        DateTime CreatedAt,
        DateTime UpdatedAt);

    public record EmployeeDetailResponse(
        EmployeeResponse Employee,
        IEnumerable<LeaveResponse> LeaveHistory,
        IEnumerable<AuditResponse> AuditTrail);

    // =============================================================
    // DEPARTMENT REQUESTS & RESPONSES
    // =============================================================

    public record CreateDepartmentRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; init; } = string.Empty;

        public string? Description { get; init; }
        public string? HeadOf { get; init; }
    }

    public record DepartmentResponse(
        int Id,
        string Name,
        string? Description,
        string? HeadOf,
        int EmployeeCount);

    public record DesignationResponse(
        int Id,
        string Title,
        string? Level,
        int EmployeeCount);

    // =============================================================
    // PROJECT REQUESTS & RESPONSES
    // =============================================================

    public record CreateProjectRequest
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; init; } = string.Empty;

        public string? Description { get; init; }

        [Required]
        public DateTime StartDate { get; init; }
        public DateTime? EndDate { get; init; }
        public List<int>? MemberIds { get; init; }
    }

    public record UpdateProjectRequest
    {
        [MaxLength(200)]
        public string? Name { get; init; }
        public string? Description { get; init; }
        public string? Status { get; init; }
        public DateTime? EndDate { get; init; }
    }

    public record AddMemberRequest
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int EmployeeId { get; init; }
        public string? Role { get; init; } = "Member";
    }

    public record GetProjectsRequest : PagedRequest
    {
        public string? Status { get; init; }
    }

    public record ProjectResponse(
        int Id,
        string Name,
        string? Description,
        string Status,
        DateTime StartDate,
        DateTime? EndDate,
        int TeamSize,
        int TotalTasks,
        int CompletedTasks,
        double Progress,
        DateTime CreatedAt);

    public record ProjectDetailResponse(
        int Id,
        string Name,
        string? Description,
        string Status,
        DateTime StartDate,
        DateTime? EndDate,
        List<ProjectMemberResponse> Members,
        List<TaskResponse> Tasks,
        DateTime CreatedAt,
        DateTime UpdatedAt);

    public record ProjectMemberResponse(
        int EmployeeId,
        string FullName,
        string? AvatarUrl,
        string Designation,
        string Role,
        DateTime AssignedAt);

    // =============================================================
    // TASK REQUESTS & RESPONSES
    // =============================================================

    public record CreateTaskRequest
    {
        [Required]
        [MaxLength(300)]
        public string Title { get; init; } = string.Empty;

        public string? Description { get; init; }
        public string Priority { get; init; } = "Medium";
        public DateTime? DueDate { get; init; }
        public int? AssignedToId { get; init; }
    }

    public record UpdateTaskRequest
    {
        [MaxLength(300)]
        public string? Title { get; init; }
        public string? Description { get; init; }
        public string? Status { get; init; }
        public string? Priority { get; init; }
        public DateTime? DueDate { get; init; }
        public int? AssignedToId { get; init; }
    }

    public record TaskResponse(
        int Id,
        string Title,
        string? Description,
        string Status,
        string Priority,
        DateTime? DueDate,
        int ProjectId,
        string ProjectName,
        int? AssignedToId,
        string? AssignedToName,
        DateTime CreatedAt,
        DateTime UpdatedAt);

    // =============================================================
    // LEAVE REQUESTS & RESPONSES
    // =============================================================

    public record CreateLeaveRequest
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int EmployeeId { get; init; }

        [Required]
        public string LeaveType { get; init; } = string.Empty;

        [Required]
        public DateTime StartDate { get; init; }

        [Required]
        public DateTime EndDate { get; init; }

        public string? Reason { get; init; }
    }

    public record ReviewLeaveRequest
    {
        [Required]
        public string Action { get; init; } = string.Empty; // approve | reject | cancel

        [Required]
        public string ReviewedBy { get; init; } = string.Empty;

        public string? Comment { get; init; }
    }

    public record GetLeavesRequest : PagedRequest
    {
        public string? Status { get; init; }
        public string? LeaveType { get; init; }
        public int? EmployeeId { get; init; }
    }

    public record LeaveResponse(
        string Id,
        int EmployeeId,
        string EmployeeName,
        string LeaveType,
        DateTime StartDate,
        DateTime EndDate,
        int TotalDays,
        string Status,
        string? Reason,
        List<ApprovalHistoryResponse> ApprovalHistory,
        DateTime CreatedAt);

    public record ApprovalHistoryResponse(
        string Status,
        string ChangedBy,
        DateTime ChangedAt,
        string? Comment);

    // =============================================================
    // AUDIT REQUESTS & RESPONSES
    // =============================================================

    public record GetAuditLogsRequest : PagedRequest
    {
        public string? EntityType { get; init; }
        public string? EntityId { get; init; }
    }

    public record AuditResponse(
        string Id,
        string EventType,
        string EntityType,
        string EntityId,
        string Actor,
        DateTime Timestamp,
        string? Description,
        object? Before,
        object? After);

    // =============================================================
    // DASHBOARD RESPONSE
    // =============================================================

    public record DashboardResponse(
        HeadcountResponse Headcount,
        ProjectStatsResponse Projects,
        LeaveStatsResponse Leaves,
        List<RecentActivityResponse> RecentActivity,
        DateTime GeneratedAt);

    public record HeadcountResponse(
        int Total,
        int Active,
        List<DeptCountResponse> ByDepartment);

    public record DeptCountResponse(string Department, int Count);

    public record ProjectStatsResponse(
        int Total,
        int Active,
        int Completed,
        int OnHold,
        int TotalTasks,
        int CompletedTasks);

    public record LeaveStatsResponse(
        int Pending,
        int Approved,
        int Rejected,
        List<LeaveTypeCountResponse> ByType);

    public record LeaveTypeCountResponse(string LeaveType, int Count);

    public record RecentActivityResponse(
        string Description,
        DateTime Timestamp,
        string EntityType);
}
