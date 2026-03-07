
namespace WorkforceAPI.src.Application.DTOs;

// ── Employee ──────────────────────────────────────────────────
public record EmployeeDto(
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

public record EmployeeDetailDto(
    EmployeeDto Employee,
    IEnumerable<LeaveRequestDto> LeaveHistory,
    IEnumerable<AuditLogDto> AuditTrail);

public record CreateEmployeeDto(
    string FirstName,
    string LastName,
    string Email,
    int DepartmentId,
    int DesignationId,
    decimal Salary,
    DateTime JoiningDate,
    string? Phone,
    string? Address,
    string? City,
    string? Country,
    string? AvatarUrl,
    List<string>? Skills);

public record UpdateEmployeeDto(
    string? FirstName,
    string? LastName,
    string? Email,
    int? DepartmentId,
    int? DesignationId,
    decimal? Salary,
    string? Phone,
    string? Address,
    string? City,
    string? Country,
    string? AvatarUrl,
    List<string>? Skills,
    bool? IsActive);

// ── Department & Designation ──────────────────────────────────
public record DepartmentDto(
    int Id,
    string Name,
    string? Description,
    string? HeadOf,
    int EmployeeCount);

public record CreateDepartmentDto(
    string Name,
    string? Description,
    string? HeadOf);

public record DesignationDto(
    int Id,
    string Title,
    string? Level,
    int EmployeeCount);

// ── Project ───────────────────────────────────────────────────
public record ProjectDto(
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

public record ProjectDetailDto(
    int Id,
    string Name,
    string? Description,
    string Status,
    DateTime StartDate,
    DateTime? EndDate,
    List<ProjectMemberDto> Members,
    List<TaskDto> Tasks,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record ProjectMemberDto(
    int EmployeeId,
    string FullName,
    string? AvatarUrl,
    string Designation,
    string Role,
    DateTime AssignedAt);

public record CreateProjectDto(
    string Name,
    string? Description,
    DateTime StartDate,
    DateTime? EndDate,
    List<int>? MemberIds);

public record UpdateProjectDto(
    string? Name,
    string? Description,
    string? Status,
    DateTime? EndDate);

public record AddMemberDto(
    int EmployeeId,
    string? Role);

// ── Task ──────────────────────────────────────────────────────
public record TaskDto(
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

public record CreateTaskDto(
    string Title,
    string? Description,
    string Priority,
    DateTime? DueDate,
    int? AssignedToId);

public record UpdateTaskDto(
    string? Title,
    string? Description,
    string? Status,
    string? Priority,
    DateTime? DueDate,
    int? AssignedToId);

// ── Leave ─────────────────────────────────────────────────────
public record LeaveRequestDto(
    string Id,
    int EmployeeId,
    string EmployeeName,
    string LeaveType,
    DateTime StartDate,
    DateTime EndDate,
    int TotalDays,
    string Status,
    string? Reason,
    List<ApprovalHistoryDto> ApprovalHistory,
    DateTime CreatedAt);

public record ApprovalHistoryDto(
    string Status,
    string ChangedBy,
    DateTime ChangedAt,
    string? Comment);

public record CreateLeaveRequestDto(
    int EmployeeId,
    string LeaveType,
    DateTime StartDate,
    DateTime EndDate,
    string? Reason);

public record ReviewLeaveDto(
    string Action,
    string ReviewedBy,
    string? Comment);

// ── Audit ─────────────────────────────────────────────────────
public record AuditLogDto(
    string Id,
    string EventType,
    string EntityType,
    string EntityId,
    string Actor,
    DateTime Timestamp,
    string? Description,
    object? Before,
    object? After);

// ── Dashboard ─────────────────────────────────────────────────
public record DashboardDto(
    HeadcountDto Headcount,
    ProjectStatsDto Projects,
    LeaveStatsDto Leaves,
    List<RecentActivityDto> RecentActivity,
    DateTime GeneratedAt);

public record HeadcountDto(
    int Total,
    int Active,
    List<DeptCountDto> ByDepartment);

public record DeptCountDto(string Department, int Count);

public record ProjectStatsDto(
    int Total,
    int Active,
    int Completed,
    int OnHold,
    int TotalTasks,
    int CompletedTasks);

public record LeaveStatsDto(
    int Pending,
    int Approved,
    int Rejected,
    List<LeaveTypeCountDto> ByType);

public record LeaveTypeCountDto(string LeaveType, int Count);

public record RecentActivityDto(
    string Description,
    DateTime Timestamp,
    string EntityType);
