
using WorkforceAPI.src.Domain.Entities;

namespace WorkforceAPI.src.Application.Interfaces;

// ── Shared pagination models ──────────────────────────────────
public record PagedResult<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int Page,
    int PageSize)
{
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

public record PagedQuery(
    int Page = 1,
    int PageSize = 20,
    string? Search = null,
    string? SortBy = null,
    bool SortDesc = false);

// ── Employee ──────────────────────────────────────────────────
public interface IEmployeeRepository
{
    Task<PagedResult<Employee>> GetPagedAsync(
        PagedQuery query,
        int? departmentId = null,
        bool? isActive = null,
        CancellationToken ct = default);

    Task<Employee?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Employee?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<Employee> CreateAsync(Employee employee, CancellationToken ct = default);
    Task<Employee> UpdateAsync(Employee employee, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
    Task<List<Employee>> GetByDepartmentAsync(int departmentId, CancellationToken ct = default);
    Task<List<Employee>> SearchAsync(string query, CancellationToken ct = default);
}

// ── Department ────────────────────────────────────────────────
public interface IDepartmentRepository
{
    Task<List<Department>> GetAllAsync(CancellationToken ct = default);
    Task<Department?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Department> CreateAsync(Department department, CancellationToken ct = default);
    Task<Department> UpdateAsync(Department department, CancellationToken ct = default);
}

// ── Designation ───────────────────────────────────────────────
public interface IDesignationRepository
{
    Task<List<Designation>> GetAllAsync(CancellationToken ct = default);
    Task<Designation?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Designation> CreateAsync(Designation designation, CancellationToken ct = default);
}

// ── Project ───────────────────────────────────────────────────
public interface IProjectRepository
{
    Task<PagedResult<Project>> GetPagedAsync(
        PagedQuery query,
        string? status = null,
        CancellationToken ct = default);

    Task<Project?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Project> CreateAsync(Project project, CancellationToken ct = default);
    Task<Project> UpdateAsync(Project project, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
    Task AddMemberAsync(int projectId, int employeeId, string role = "Member", CancellationToken ct = default);
    Task RemoveMemberAsync(int projectId, int employeeId, CancellationToken ct = default);
    Task<List<Project>> GetByEmployeeAsync(int employeeId, CancellationToken ct = default);
}

// ── Task ──────────────────────────────────────────────────────
public interface ITaskRepository
{
    Task<List<TaskItem>> GetByProjectAsync(int projectId, CancellationToken ct = default);
    Task<TaskItem?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<TaskItem> CreateAsync(TaskItem task, CancellationToken ct = default);
    Task<TaskItem> UpdateAsync(TaskItem task, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
    Task<List<TaskItem>> GetByAssigneeAsync(int employeeId, CancellationToken ct = default);
}

// ── Leave ─────────────────────────────────────────────────────
public interface ILeaveRepository
{
    Task<PagedResult<LeaveRequest>> GetPagedAsync(
        PagedQuery query,
        string? status = null,
        string? leaveType = null,
        int? employeeId = null,
        CancellationToken ct = default);

    Task<LeaveRequest?> GetByIdAsync(string id, CancellationToken ct = default);
    Task<LeaveRequest> CreateAsync(LeaveRequest request, CancellationToken ct = default);
    Task<LeaveRequest> UpdateAsync(LeaveRequest request, CancellationToken ct = default);
    Task<List<LeaveRequest>> GetByEmployeeAsync(int employeeId, CancellationToken ct = default);
}

// ── Audit ─────────────────────────────────────────────────────
public interface IAuditRepository
{
    Task<PagedResult<AuditLog>> GetPagedAsync(
        PagedQuery query,
        string? entityType = null,
        string? entityId = null,
        CancellationToken ct = default);

    Task<List<AuditLog>> GetByEntityAsync(string entityType, string entityId, CancellationToken ct = default);
    Task CreateAsync(AuditLog log, CancellationToken ct = default);
}

// ── Report ────────────────────────────────────────────────────
public interface IReportRepository
{
    Task<SummaryReport?> GetLatestAsync(CancellationToken ct = default);
    Task UpsertAsync(SummaryReport report, CancellationToken ct = default);
}

// ── Event Publisher ───────────────────────────────────────────
public interface IEventPublisher
{
    Task PublishAsync<T>(T domainEvent, CancellationToken ct = default) where T : class;
}