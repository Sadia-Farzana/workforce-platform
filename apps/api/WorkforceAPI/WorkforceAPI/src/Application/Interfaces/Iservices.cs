using WorkforceAPI.src.Application.Common;
using WorkforceAPI.src.Application.DTOs;

namespace WorkforceAPI.src.Application.Interfaces
{
    public interface IEmployeeService
    {
        Task<PagedResponse<EmployeeResponse>> GetAllAsync(GetEmployeesRequest request, CancellationToken ct = default);
        Task<ApiResponse<EmployeeDetailResponse>> GetByIdAsync(int id, CancellationToken ct = default);
        Task<ApiResponse<EmployeeResponse>> CreateAsync(CreateEmployeeRequest request, CancellationToken ct = default);
        Task<ApiResponse<EmployeeResponse>> UpdateAsync(int id, UpdateEmployeeRequest request, CancellationToken ct = default);
        Task<ApiResponse> DeleteAsync(int id, CancellationToken ct = default);
        Task<ApiResponse<IEnumerable<EmployeeResponse>>> SearchAsync(string query, CancellationToken ct = default);
    }

    // ── Project Service ───────────────────────────────────────────
    public interface IProjectService
    {
        Task<PagedResponse<ProjectResponse>> GetAllAsync(GetProjectsRequest request, CancellationToken ct = default);
        Task<ApiResponse<ProjectDetailResponse>> GetByIdAsync(int id, CancellationToken ct = default);
        Task<ApiResponse<ProjectResponse>> CreateAsync(CreateProjectRequest request, CancellationToken ct = default);
        Task<ApiResponse<ProjectResponse>> UpdateAsync(int id, UpdateProjectRequest request, CancellationToken ct = default);
        Task<ApiResponse> DeleteAsync(int id, CancellationToken ct = default);
        Task<ApiResponse> AddMemberAsync(int projectId, AddMemberRequest request, CancellationToken ct = default);
        Task<ApiResponse> RemoveMemberAsync(int projectId, int employeeId, CancellationToken ct = default);
    }

    // ── Task Service ──────────────────────────────────────────────
    public interface ITaskService
    {
        Task<ApiResponse<IEnumerable<TaskResponse>>> GetByProjectAsync(int projectId, CancellationToken ct = default);
        Task<ApiResponse<TaskResponse>> CreateAsync(int projectId, CreateTaskRequest request, CancellationToken ct = default);
        Task<ApiResponse<TaskResponse>> UpdateAsync(int projectId, int taskId, UpdateTaskRequest request, CancellationToken ct = default);
        Task<ApiResponse> DeleteAsync(int projectId, int taskId, CancellationToken ct = default);
    }

    // ── Leave Service ─────────────────────────────────────────────
    public interface ILeaveService
    {
        Task<PagedResponse<LeaveResponse>> GetAllAsync(GetLeavesRequest request, CancellationToken ct = default);
        Task<ApiResponse<LeaveResponse>> GetByIdAsync(string id, CancellationToken ct = default);
        Task<ApiResponse<LeaveResponse>> CreateAsync(CreateLeaveRequest request, CancellationToken ct = default);
        Task<ApiResponse<LeaveResponse>> ReviewAsync(string id, ReviewLeaveRequest request, CancellationToken ct = default);
    }

    // ── Department Service ────────────────────────────────────────
    public interface IDepartmentService
    {
        Task<ApiResponse<IEnumerable<DepartmentResponse>>> GetAllAsync(CancellationToken ct = default);
        Task<ApiResponse<DepartmentResponse>> CreateAsync(CreateDepartmentRequest request, CancellationToken ct = default);
    }

    // ── Designation Service ───────────────────────────────────────
    public interface IDesignationService
    {
        Task<ApiResponse<IEnumerable<DesignationResponse>>> GetAllAsync(CancellationToken ct = default);
    }

    // ── Audit Service ─────────────────────────────────────────────
    public interface IAuditService
    {
        Task<PagedResponse<AuditResponse>> GetAllAsync(GetAuditLogsRequest request, CancellationToken ct = default);
        Task<ApiResponse<IEnumerable<AuditResponse>>> GetByEntityAsync(string entityType, string entityId, CancellationToken ct = default);
    }

    // ── Dashboard Service ─────────────────────────────────────────
    public interface IDashboardService
    {
        Task<ApiResponse<DashboardResponse>> GetDashboardAsync(CancellationToken ct = default);
    }
}
