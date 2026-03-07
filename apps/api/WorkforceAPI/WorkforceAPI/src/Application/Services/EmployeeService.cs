using WorkforceAPI.src.Application.Common;
using WorkforceAPI.src.Application.DTOs;
using WorkforceAPI.src.Application.Interfaces;
using WorkforceAPI.src.Application.Mappers;
using WorkforceAPI.src.Domain.Entities;

namespace WorkforceAPI.src.Application.Services
{
    public class EmployeeService(
     IUnitOfWork uow,
     IEventPublisher publisher) : IEmployeeService
    {
        public async Task<PagedResponse<EmployeeResponse>> GetAllAsync(
            GetEmployeesRequest request, CancellationToken ct = default)
        {
            var result = await uow.Employees.GetPagedAsync(
                new PagedQuery(request.Page, request.PageSize, request.Search, request.SortBy, request.SortDesc),
                request.DepartmentId, request.IsActive, ct);

            return PagedResponse<EmployeeResponse>.Ok(
                result.Items.Select(EmployeeMapper.ToResponse).ToList().AsReadOnly(),
                result.TotalCount, result.Page, result.PageSize);
        }

        public async Task<ApiResponse<EmployeeDetailResponse>> GetByIdAsync(
            int id, CancellationToken ct = default)
        {
            var emp = await uow.Employees.GetByIdAsync(id, ct)
                ?? throw new KeyNotFoundException($"Employee {id} not found");

            var leaveHistory = await uow.Leaves.GetByEmployeeAsync(id, ct);
            var auditTrail = await uow.Audits.GetByEntityAsync("Employee", id.ToString(), ct);

            var detail = new EmployeeDetailResponse(
                EmployeeMapper.ToResponse(emp),
                leaveHistory.Select(LeaveMapper.ToResponse),
                auditTrail.Select(AuditMapper.ToResponse));

            return ApiResponse<EmployeeDetailResponse>.Ok(detail);
        }

        public async Task<ApiResponse<EmployeeResponse>> CreateAsync(
            CreateEmployeeRequest request, CancellationToken ct = default)
        {
            var existing = await uow.Employees.GetByEmailAsync(request.Email, ct);
            if (existing is not null)
                throw new InvalidOperationException("An employee with this email already exists");

            var entity = EmployeeMapper.ToEntity(request);
            var created = await uow.Employees.CreateAsync(entity, ct);

            await publisher.PublishAsync(new EmployeeCreatedEvent(
                created.Id, created.FullName, created.Email, created.DepartmentId)
            { Actor = "system" }, ct);

            return ApiResponse<EmployeeResponse>.Ok(
                EmployeeMapper.ToResponse(created), "Employee created successfully");
        }

        public async Task<ApiResponse<EmployeeResponse>> UpdateAsync(
            int id, UpdateEmployeeRequest request, CancellationToken ct = default)
        {
            var entity = await uow.Employees.GetByIdAsync(id, ct)
                ?? throw new KeyNotFoundException($"Employee {id} not found");

            var before = EmployeeMapper.ToResponse(entity);

            EmployeeMapper.ApplyUpdate(entity, request);

            var updated = await uow.Employees.UpdateAsync(entity, ct);

            await publisher.PublishAsync(new EmployeeUpdatedEvent(
                updated.Id, updated.FullName, before, EmployeeMapper.ToResponse(updated))
            { Actor = "system" }, ct);

            return ApiResponse<EmployeeResponse>.Ok(
                EmployeeMapper.ToResponse(updated), "Employee updated successfully");
        }

        public async Task<ApiResponse> DeleteAsync(int id, CancellationToken ct = default)
        {
            var entity = await uow.Employees.GetByIdAsync(id, ct)
                ?? throw new KeyNotFoundException($"Employee {id} not found");

            await uow.Employees.DeleteAsync(id, ct);

            await publisher.PublishAsync(
                new EmployeeDeletedEvent(id, entity.FullName) { Actor = "system" }, ct);

            return ApiResponse.Ok("Employee deactivated successfully");
        }

        public async Task<ApiResponse<IEnumerable<EmployeeResponse>>> SearchAsync(
            string query, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(query))
                throw new ArgumentException("Search query cannot be empty");

            var results = await uow.Employees.SearchAsync(query, ct);

            return ApiResponse<IEnumerable<EmployeeResponse>>.Ok(
                results.Select(EmployeeMapper.ToResponse),
                $"Found results for '{query}'");
        }
    }

    // =============================================================
    // PROJECT SERVICE
    // =============================================================
    public class ProjectService(
        IUnitOfWork uow,
        IEventPublisher publisher) : IProjectService
    {
        public async Task<PagedResponse<ProjectResponse>> GetAllAsync(
            GetProjectsRequest request, CancellationToken ct = default)
        {
            var result = await uow.Projects.GetPagedAsync(
                new PagedQuery(request.Page, request.PageSize, request.Search),
                request.Status, ct);

            return PagedResponse<ProjectResponse>.Ok(
                result.Items.Select(ProjectMapper.ToResponse).ToList().AsReadOnly(),
                result.TotalCount, result.Page, result.PageSize);
        }

        public async Task<ApiResponse<ProjectDetailResponse>> GetByIdAsync(
            int id, CancellationToken ct = default)
        {
            var project = await uow.Projects.GetByIdAsync(id, ct)
                ?? throw new KeyNotFoundException($"Project {id} not found");

            return ApiResponse<ProjectDetailResponse>.Ok(
                ProjectMapper.ToDetailResponse(project));
        }

        public async Task<ApiResponse<ProjectResponse>> CreateAsync(
            CreateProjectRequest request, CancellationToken ct = default)
        {
            var entity = ProjectMapper.ToEntity(request);
            var created = await uow.Projects.CreateAsync(entity, ct);

            if (request.MemberIds is { Count: > 0 })
                foreach (var empId in request.MemberIds)
                    await uow.Projects.AddMemberAsync(created.Id, empId, ct: ct);

            await publisher.PublishAsync(
                new ProjectCreatedEvent(created.Id, created.Name) { Actor = "system" }, ct);

            return ApiResponse<ProjectResponse>.Ok(
                ProjectMapper.ToResponse(created), "Project created successfully");
        }

        public async Task<ApiResponse<ProjectResponse>> UpdateAsync(
            int id, UpdateProjectRequest request, CancellationToken ct = default)
        {
            var entity = await uow.Projects.GetByIdAsync(id, ct)
                ?? throw new KeyNotFoundException($"Project {id} not found");

            var oldStatus = entity.Status.ToString();

            ProjectMapper.ApplyUpdate(entity, request);

            var updated = await uow.Projects.UpdateAsync(entity, ct);

            if (oldStatus != updated.Status.ToString())
                await publisher.PublishAsync(new ProjectStatusChangedEvent(
                    updated.Id, updated.Name, oldStatus, updated.Status.ToString())
                { Actor = "system" }, ct);
            else
                await publisher.PublishAsync(new ProjectUpdatedEvent(
                    updated.Id, updated.Name,
                    new { Status = oldStatus },
                    new { Status = updated.Status.ToString() })
                { Actor = "system" }, ct);

            return ApiResponse<ProjectResponse>.Ok(
                ProjectMapper.ToResponse(updated), "Project updated successfully");
        }

        public async Task<ApiResponse> DeleteAsync(int id, CancellationToken ct = default)
        {
            _ = await uow.Projects.GetByIdAsync(id, ct)
                ?? throw new KeyNotFoundException($"Project {id} not found");

            await uow.Projects.DeleteAsync(id, ct);

            return ApiResponse.Ok("Project deleted successfully");
        }

        public async Task<ApiResponse> AddMemberAsync(
            int projectId, AddMemberRequest request, CancellationToken ct = default)
        {
            var emp = await uow.Employees.GetByIdAsync(request.EmployeeId, ct)
                ?? throw new KeyNotFoundException($"Employee {request.EmployeeId} not found");

            await uow.Projects.AddMemberAsync(projectId, request.EmployeeId, request.Role ?? "Member", ct);

            await publisher.PublishAsync(
                new ProjectMemberAddedEvent(projectId, request.EmployeeId, emp.FullName)
                { Actor = "system" }, ct);

            return ApiResponse.Ok("Member added successfully");
        }

        public async Task<ApiResponse> RemoveMemberAsync(
            int projectId, int employeeId, CancellationToken ct = default)
        {
            await uow.Projects.RemoveMemberAsync(projectId, employeeId, ct);
            return ApiResponse.Ok("Member removed successfully");
        }
    }

    // =============================================================
    // TASK SERVICE
    // =============================================================
    public class TaskService(
        IUnitOfWork uow,
        IEventPublisher publisher) : ITaskService
    {
        public async Task<ApiResponse<IEnumerable<TaskResponse>>> GetByProjectAsync(
            int projectId, CancellationToken ct = default)
        {
            var tasks = await uow.Tasks.GetByProjectAsync(projectId, ct);
            return ApiResponse<IEnumerable<TaskResponse>>.Ok(
                tasks.Select(TaskMapper.ToResponse));
        }

        public async Task<ApiResponse<TaskResponse>> CreateAsync(
            int projectId, CreateTaskRequest request, CancellationToken ct = default)
        {
            var entity = TaskMapper.ToEntity(request, projectId);
            var created = await uow.Tasks.CreateAsync(entity, ct);

            await publisher.PublishAsync(
                new TaskCreatedEvent(created.Id, created.Title, projectId) { Actor = "system" }, ct);

            return ApiResponse<TaskResponse>.Ok(
                TaskMapper.ToResponse(created), "Task created successfully");
        }

        public async Task<ApiResponse<TaskResponse>> UpdateAsync(
            int projectId, int taskId, UpdateTaskRequest request, CancellationToken ct = default)
        {
            var entity = await uow.Tasks.GetByIdAsync(taskId, ct);
            if (entity is null || entity.ProjectId != projectId)
                throw new KeyNotFoundException($"Task {taskId} not found in project {projectId}");

            var oldStatus = entity.Status.ToString();

            TaskMapper.ApplyUpdate(entity, request);

            var updated = await uow.Tasks.UpdateAsync(entity, ct);

            if (oldStatus != updated.Status.ToString())
                await publisher.PublishAsync(new TaskStatusChangedEvent(
                    updated.Id, updated.Title, oldStatus, updated.Status.ToString(), projectId)
                { Actor = "system" }, ct);

            return ApiResponse<TaskResponse>.Ok(
                TaskMapper.ToResponse(updated), "Task updated successfully");
        }

        public async Task<ApiResponse> DeleteAsync(
            int projectId, int taskId, CancellationToken ct = default)
        {
            var entity = await uow.Tasks.GetByIdAsync(taskId, ct);
            if (entity is null || entity.ProjectId != projectId)
                throw new KeyNotFoundException($"Task {taskId} not found in project {projectId}");

            await uow.Tasks.DeleteAsync(taskId, ct);
            return ApiResponse.Ok("Task deleted successfully");
        }
    }

    // =============================================================
    // LEAVE SERVICE
    // =============================================================
    public class LeaveService(
        IUnitOfWork uow,
        IEventPublisher publisher) : ILeaveService
    {
        public async Task<PagedResponse<LeaveResponse>> GetAllAsync(
            GetLeavesRequest request, CancellationToken ct = default)
        {
            var result = await uow.Leaves.GetPagedAsync(
                new PagedQuery(request.Page, request.PageSize, request.Search),
                request.Status, request.LeaveType, request.EmployeeId, ct);

            return PagedResponse<LeaveResponse>.Ok(
                result.Items.Select(LeaveMapper.ToResponse).ToList().AsReadOnly(),
                result.TotalCount, result.Page, result.PageSize);
        }

        public async Task<ApiResponse<LeaveResponse>> GetByIdAsync(
            string id, CancellationToken ct = default)
        {
            var entity = await uow.Leaves.GetByIdAsync(id, ct)
                ?? throw new KeyNotFoundException($"Leave request {id} not found");

            return ApiResponse<LeaveResponse>.Ok(LeaveMapper.ToResponse(entity));
        }

        public async Task<ApiResponse<LeaveResponse>> CreateAsync(
            CreateLeaveRequest request, CancellationToken ct = default)
        {
            if (request.EndDate <= request.StartDate)
                throw new ArgumentException("End date must be after start date");

            var entity = LeaveMapper.ToEntity(request);
            var created = await uow.Leaves.CreateAsync(entity, ct);

            await publisher.PublishAsync(new LeaveRequestSubmittedEvent(
                created.Id, created.EmployeeId, created.EmployeeName,
                created.LeaveType, created.StartDate, created.EndDate)
            { Actor = "system" }, ct);

            return ApiResponse<LeaveResponse>.Ok(
                LeaveMapper.ToResponse(created), "Leave request submitted successfully");
        }

        public async Task<ApiResponse<LeaveResponse>> ReviewAsync(
            string id, ReviewLeaveRequest request, CancellationToken ct = default)
        {
            var entity = await uow.Leaves.GetByIdAsync(id, ct)
                ?? throw new KeyNotFoundException($"Leave request {id} not found");

            var newStatus = request.Action.ToLower() switch
            {
                "approve" => "Approved",
                "reject" => "Rejected",
                "cancel" => "Cancelled",
                _ => throw new ArgumentException(
                    "Invalid action. Valid values: approve, reject, cancel")
            };

            var oldStatus = entity.Status;
            entity.Status = newStatus;
            entity.ApprovalHistory.Add(new ApprovalHistoryEntry
            {
                Status = newStatus,
                ChangedBy = request.ReviewedBy,
                Comment = request.Comment
            });

            await uow.Leaves.UpdateAsync(entity, ct);

            await publisher.PublishAsync(new LeaveStatusChangedEvent(
                id, entity.EmployeeId, entity.EmployeeName,
                oldStatus, newStatus, request.Comment)
            { Actor = request.ReviewedBy }, ct);

            return ApiResponse<LeaveResponse>.Ok(
                LeaveMapper.ToResponse(entity),
                $"Leave request {request.Action}d successfully");
        }
    }

    // =============================================================
    // AUDIT SERVICE
    // =============================================================
    public class AuditService(IUnitOfWork uow) : IAuditService
    {
        public async Task<PagedResponse<AuditResponse>> GetAllAsync(
            GetAuditLogsRequest request, CancellationToken ct = default)
        {
            var result = await uow.Audits.GetPagedAsync(
                new PagedQuery(request.Page, request.PageSize, request.Search),
                request.EntityType, request.EntityId, ct);

            return PagedResponse<AuditResponse>.Ok(
                result.Items.Select(AuditMapper.ToResponse).ToList().AsReadOnly(),
                result.TotalCount, result.Page, result.PageSize);
        }

        public async Task<ApiResponse<IEnumerable<AuditResponse>>> GetByEntityAsync(
            string entityType, string entityId, CancellationToken ct = default)
        {
            var logs = await uow.Audits.GetByEntityAsync(entityType, entityId, ct);
            return ApiResponse<IEnumerable<AuditResponse>>.Ok(
                logs.Select(AuditMapper.ToResponse));
        }
    }

    // =============================================================
    // DASHBOARD SERVICE
    // =============================================================
    public class DashboardService(IUnitOfWork uow) : IDashboardService
    {
        public async Task<ApiResponse<DashboardResponse>> GetDashboardAsync(
            CancellationToken ct = default)
        {
            var report = await uow.Reports.GetLatestAsync(ct);

            if (report is null)
                return ApiResponse<DashboardResponse>.Fail(
                    "Report not yet generated. The worker will compute it shortly.",
                    "REPORT_PENDING");

            var dto = new DTOs.DashboardDto(
                new DTOs.HeadcountDto(
                    report.Headcount.Total,
                    report.Headcount.Active,
                    report.Headcount.ByDepartment
                        .Select(d => new DTOs.DeptCountDto(d.Department, d.Count)).ToList()),
                new DTOs.ProjectStatsDto(
                    report.Projects.Total, report.Projects.Active,
                    report.Projects.Completed, report.Projects.OnHold,
                    report.Projects.TotalTasks, report.Projects.CompletedTasks),
                new DTOs.LeaveStatsDto(
                    report.Leaves.Pending, report.Leaves.Approved, report.Leaves.Rejected,
                    report.Leaves.ByType
                        .Select(t => new DTOs.LeaveTypeCountDto(t.LeaveType, t.Count)).ToList()),
                report.RecentActivity
                    .Select(a => new DTOs.RecentActivityDto(a.Description, a.Timestamp, a.EntityType))
                    .ToList(),
                report.GeneratedAt);

            return ApiResponse<DashboardResponse>.Ok(DashboardMapper.ToResponse(dto));
        }
    }

    // =============================================================
    // DEPARTMENT SERVICE
    // =============================================================
    public class DepartmentService(IUnitOfWork uow) : IDepartmentService
    {
        public async Task<ApiResponse<IEnumerable<DepartmentResponse>>> GetAllAsync(
            CancellationToken ct = default)
        {
            var all = await uow.Departments.GetAllAsync(ct);
            return ApiResponse<IEnumerable<DepartmentResponse>>.Ok(
                all.Select(DepartmentMapper.ToResponse));
        }

        public async Task<ApiResponse<DepartmentResponse>> CreateAsync(
            CreateDepartmentRequest request, CancellationToken ct = default)
        {
            var entity = DepartmentMapper.ToEntity(request);
            var created = await uow.Departments.CreateAsync(entity, ct);
            return ApiResponse<DepartmentResponse>.Ok(
                DepartmentMapper.ToResponse(created), "Department created successfully");
        }
    }

    // =============================================================
    // DESIGNATION SERVICE
    // =============================================================
    public class DesignationService(IUnitOfWork uow) : IDesignationService
    {
        public async Task<ApiResponse<IEnumerable<DesignationResponse>>> GetAllAsync(
            CancellationToken ct = default)
        {
            var all = await uow.Designations.GetAllAsync(ct);
            return ApiResponse<IEnumerable<DesignationResponse>>.Ok(
                all.Select(DesignationMapper.ToResponse));
        }
    }


}
