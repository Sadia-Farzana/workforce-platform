using WorkforceAPI.src.Application.Common;
using WorkforceAPI.src.Application.DTOs;
using WorkforceAPI.src.Domain.Entities;

namespace WorkforceAPI.src.Application.Mappers
{
    public static class EmployeeMapper
    {
        // Entity → DTO
        public static EmployeeDto ToDto(Employee e) => new(
            e.Id,
            e.FirstName,
            e.LastName,
            e.FullName,
            e.Email,
            e.IsActive,
            e.Salary,
            e.JoiningDate,
            e.Phone,
            e.Address,
            e.City,
            e.Country,
            e.AvatarUrl,
            e.Skills,
            e.DepartmentId,
            e.Department?.Name ?? string.Empty,
            e.DesignationId,
            e.Designation?.Title ?? string.Empty,
            e.CreatedAt,
            e.UpdatedAt);

        // DTO → Response
        public static EmployeeResponse ToResponse(EmployeeDto dto) => new(
            dto.Id,
            dto.FirstName,
            dto.LastName,
            dto.FullName,
            dto.Email,
            dto.IsActive,
            dto.Salary,
            dto.JoiningDate,
            dto.Phone,
            dto.Address,
            dto.City,
            dto.Country,
            dto.AvatarUrl,
            dto.Skills,
            dto.DepartmentId,
            dto.DepartmentName,
            dto.DesignationId,
            dto.DesignationTitle,
            dto.CreatedAt,
            dto.UpdatedAt);

        // Entity → Response (shortcut — skips DTO)
        public static EmployeeResponse ToResponse(Employee e) => ToResponse(ToDto(e));

        // CreateRequest → DTO
        public static CreateEmployeeDto ToDto(CreateEmployeeRequest r) => new(
            r.FirstName,
            r.LastName,
            r.Email,
            r.DepartmentId,
            r.DesignationId,
            r.Salary,
            r.JoiningDate,
            r.Phone,
            r.Address,
            r.City,
            r.Country,
            r.AvatarUrl,
            r.Skills);

        // UpdateRequest → DTO
        public static UpdateEmployeeDto ToDto(UpdateEmployeeRequest r) => new(
            r.FirstName,
            r.LastName,
            r.Email,
            r.DepartmentId,
            r.DesignationId,
            r.Salary,
            r.Phone,
            r.Address,
            r.City,
            r.Country,
            r.AvatarUrl,
            r.Skills,
            r.IsActive);

        // CreateDTO → Entity
        public static Employee ToEntity(CreateEmployeeRequest dto) => new()
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            DepartmentId = dto.DepartmentId,
            DesignationId = dto.DesignationId,
            Salary = dto.Salary,
            JoiningDate = dto.JoiningDate,
            Phone = dto.Phone,
            Address = dto.Address,
            City = dto.City,
            Country = dto.Country,
            AvatarUrl = dto.AvatarUrl,
            Skills = dto.Skills ?? []
        };

        // Apply UpdateDTO changes onto existing entity
        public static void ApplyUpdate(Employee entity, UpdateEmployeeRequest dto)
        {
            if (dto.FirstName is not null) entity.FirstName = dto.FirstName;
            if (dto.LastName is not null) entity.LastName = dto.LastName;
            if (dto.Email is not null) entity.Email = dto.Email;
            if (dto.DepartmentId.HasValue) entity.DepartmentId = dto.DepartmentId.Value;
            if (dto.DesignationId.HasValue) entity.DesignationId = dto.DesignationId.Value;
            if (dto.Salary.HasValue) entity.Salary = dto.Salary.Value;
            if (dto.Phone is not null) entity.Phone = dto.Phone;
            if (dto.Address is not null) entity.Address = dto.Address;
            if (dto.City is not null) entity.City = dto.City;
            if (dto.Country is not null) entity.Country = dto.Country;
            if (dto.AvatarUrl is not null) entity.AvatarUrl = dto.AvatarUrl;
            if (dto.Skills is not null) entity.Skills = dto.Skills;
            if (dto.IsActive.HasValue) entity.IsActive = dto.IsActive.Value;
        }
    }

    // =============================================================
    // DEPARTMENT MAPPER
    // =============================================================
    public static class DepartmentMapper
    {
        public static DepartmentDto ToDto(Department d) => new(
            d.Id,
            d.Name,
            d.Description,
            d.HeadOf,
            d.Employees.Count);

        public static DepartmentResponse ToResponse(DepartmentDto dto) => new(
            dto.Id,
            dto.Name,
            dto.Description,
            dto.HeadOf,
            dto.EmployeeCount);

        public static DepartmentResponse ToResponse(Department d) => ToResponse(ToDto(d));

        public static Department ToEntity(CreateDepartmentRequest dto) => new()
        {
            Name = dto.Name,
            Description = dto.Description,
            HeadOf = dto.HeadOf
        };
    }

    // =============================================================
    // DESIGNATION MAPPER
    // =============================================================
    public static class DesignationMapper
    {
        public static DesignationDto ToDto(Designation d) => new(
            d.Id,
            d.Title,
            d.Level,
            d.Employees.Count);

        public static DesignationResponse ToResponse(DesignationDto dto) => new(
            dto.Id,
            dto.Title,
            dto.Level,
            dto.EmployeeCount);

        public static DesignationResponse ToResponse(Designation d) => ToResponse(ToDto(d));
    }

    // =============================================================
    // PROJECT MAPPER
    // =============================================================
    public static class ProjectMapper
    {
        public static ProjectDto ToDto(Project p) => new(
            p.Id,
            p.Name,
            p.Description,
            p.Status.ToString(),
            p.StartDate,
            p.EndDate,
            p.TeamSize,
            p.TotalTasks,
            p.CompletedTasks,
            p.Progress,
            p.CreatedAt);

        public static ProjectDetailDto ToDetailDto(Project p) => new(
            p.Id,
            p.Name,
            p.Description,
            p.Status.ToString(),
            p.StartDate,
            p.EndDate,
            p.ProjectEmployees.Select(ProjectMemberMapper.ToDto).ToList(),
            p.Tasks.Select(TaskMapper.ToDto).ToList(),
            p.CreatedAt,
            p.UpdatedAt);

        public static ProjectResponse ToResponse(ProjectDto dto) => new(
            dto.Id,
            dto.Name,
            dto.Description,
            dto.Status,
            dto.StartDate,
            dto.EndDate,
            dto.TeamSize,
            dto.TotalTasks,
            dto.CompletedTasks,
            dto.Progress,
            dto.CreatedAt);

         public static ProjectDetailResponse ToDetailResponse(Project p) => new(
           p.Id,
           p.Name,
           p.Description,
           p.Status.ToString(),
           p.StartDate,
           p.EndDate,
           p.ProjectEmployees.Select(pe => ProjectMemberMapper.ToResponse(pe)).ToList(),
           p.Tasks.Select(TaskMapper.ToResponse).ToList(),
           p.CreatedAt,
           p.UpdatedAt);
        public static ProjectResponse ToResponse(Project p) => ToResponse(ToDto(p));

        public static Project ToEntity(CreateProjectRequest dto) => new()
        {
            Name = dto.Name,
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate
        };

        public static void ApplyUpdate(Project entity, UpdateProjectRequest dto)
        {
            if (dto.Name is not null) entity.Name = dto.Name;
            if (dto.Description is not null) entity.Description = dto.Description;
            if (dto.EndDate.HasValue) entity.EndDate = dto.EndDate;
            if (dto.Status is not null && Enum.TryParse<Domain.Entities.ProjectStatus>(dto.Status, out var s))
                entity.Status = s;
        }

        // Request → DTO
        public static CreateProjectDto ToDto(CreateProjectRequest r) => new(
            r.Name, r.Description, r.StartDate, r.EndDate, r.MemberIds);

        public static UpdateProjectDto ToDto(UpdateProjectRequest r) => new(
            r.Name, r.Description, r.Status, r.EndDate);
    }

    // =============================================================
    // PROJECT MEMBER MAPPER
    // =============================================================
    public static class ProjectMemberMapper
    {
        // Entity → DTO
        public static ProjectMemberDto ToDto(ProjectEmployee pe) => new(
            pe.EmployeeId,
            pe.Employee.FullName,
            pe.Employee.AvatarUrl,
            pe.Employee.Designation?.Title ?? string.Empty,
            pe.Role,
            pe.AssignedAt);

        // Entity → Response  
        public static ProjectMemberResponse ToResponse(ProjectEmployee pe) => new(
            pe.EmployeeId,
            pe.Employee.FullName,
            pe.Employee.AvatarUrl,
            pe.Employee.Designation?.Title ?? string.Empty,
            pe.Role,
            pe.AssignedAt);

        // DTO → Response
        public static ProjectMemberResponse ToResponse(ProjectMemberDto dto) => new(
            dto.EmployeeId,
            dto.FullName,
            dto.AvatarUrl,
            dto.Designation,
            dto.Role,
            dto.AssignedAt);
    }
    // =============================================================
    // TASK MAPPER
    // =============================================================
    public static class TaskMapper
    {
        public static TaskDto ToDto(TaskItem t) => new(
            t.Id,
            t.Title,
            t.Description,
            t.Status.ToString(),
            t.Priority.ToString(),
            t.DueDate,
            t.ProjectId,
            t.Project?.Name ?? string.Empty,
            t.AssignedToId,
            t.AssignedTo?.FullName,
            t.CreatedAt,
            t.UpdatedAt);

        public static TaskResponse ToResponse(TaskDto dto) => new(
            dto.Id,
            dto.Title,
            dto.Description,
            dto.Status,
            dto.Priority,
            dto.DueDate,
            dto.ProjectId,
            dto.ProjectName,
            dto.AssignedToId,
            dto.AssignedToName,
            dto.CreatedAt,
            dto.UpdatedAt);

        public static TaskResponse ToResponse(TaskItem t) => ToResponse(ToDto(t));

        public static TaskItem ToEntity(CreateTaskRequest dto, int projectId) => new()
        {
            Title = dto.Title,
            Description = dto.Description,
            ProjectId = projectId,
            Priority = Enum.TryParse<Domain.Entities.TaskPriority>(dto.Priority, out var p)
                             ? p : Domain.Entities.TaskPriority.Medium,
            DueDate = dto.DueDate,
            AssignedToId = dto.AssignedToId
        };

        public static void ApplyUpdate(TaskItem entity, UpdateTaskRequest dto)
        {
            if (dto.Title is not null) entity.Title = dto.Title;
            if (dto.Description is not null) entity.Description = dto.Description;
            if (dto.DueDate.HasValue) entity.DueDate = dto.DueDate;
            if (dto.AssignedToId.HasValue) entity.AssignedToId = dto.AssignedToId;

            if (dto.Status is not null && Enum.TryParse<Domain.Entities.TaskStatus>(dto.Status, out var s))
                entity.Status = s;
            if (dto.Priority is not null && Enum.TryParse<Domain.Entities.TaskPriority>(dto.Priority, out var pr))
                entity.Priority = pr;
        }

        // Request → DTO
        public static CreateTaskDto ToDto(CreateTaskRequest r) => new(
            r.Title, r.Description, r.Priority, r.DueDate, r.AssignedToId);

        public static UpdateTaskDto ToDto(UpdateTaskRequest r) => new(
            r.Title, r.Description, r.Status, r.Priority, r.DueDate, r.AssignedToId);
    }

    // =============================================================
    // LEAVE MAPPER
    // =============================================================
    public static class LeaveMapper
    {
        public static LeaveRequestDto ToDto(LeaveRequest l) => new(
            l.Id,
            l.EmployeeId,
            l.EmployeeName,
            l.LeaveType,
            l.StartDate,
            l.EndDate,
            l.TotalDays,
            l.Status,
            l.Reason,
            l.ApprovalHistory.Select(ApprovalHistoryMapper.ToDto).ToList(),
            l.CreatedAt);

        public static LeaveResponse ToResponse(LeaveRequestDto dto) => new(
            dto.Id,
            dto.EmployeeId,
            dto.EmployeeName,
            dto.LeaveType,
            dto.StartDate,
            dto.EndDate,
            dto.TotalDays,
            dto.Status,
            dto.Reason,
            dto.ApprovalHistory.Select(ApprovalHistoryMapper.ToResponse).ToList(),
            dto.CreatedAt);

        public static LeaveResponse ToResponse(LeaveRequest l) => ToResponse(ToDto(l));

        public static LeaveRequest ToEntity(CreateLeaveRequest dto) => new()
        {
            EmployeeId = dto.EmployeeId,
            EmployeeName = $"Employee {dto.EmployeeId}",
            LeaveType = dto.LeaveType,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Reason = dto.Reason,
            Status = "Pending",
            ApprovalHistory =
            [
                new ApprovalHistoryEntry
            {
                Status    = "Pending",
                ChangedBy = "system",
                Comment   = "Leave request submitted"
            }
            ]
        };

        // Request → DTO
        public static CreateLeaveRequestDto ToDto(CreateLeaveRequest r) => new(
            r.EmployeeId, r.LeaveType, r.StartDate, r.EndDate, r.Reason);

        public static ReviewLeaveDto ToDto(ReviewLeaveRequest r) => new(
            r.Action, r.ReviewedBy, r.Comment);
    }

    // =============================================================
    // APPROVAL HISTORY MAPPER
    // =============================================================
    public static class ApprovalHistoryMapper
    {
        public static ApprovalHistoryDto ToDto(ApprovalHistoryEntry h) => new(
            h.Status,
            h.ChangedBy,
            h.ChangedAt,
            h.Comment);

        public static ApprovalHistoryResponse ToResponse(ApprovalHistoryDto dto) => new(
            dto.Status,
            dto.ChangedBy,
            dto.ChangedAt,
            dto.Comment);
    }

    // =============================================================
    // AUDIT MAPPER
    // =============================================================
    public static class AuditMapper
    {
        public static AuditLogDto ToDto(AuditLog a) => new(
            a.Id,
            a.EventType,
            a.EntityType,
            a.EntityId,
            a.Actor,
            a.Timestamp,
            a.Description,
            a.Before,
            a.After);

        public static AuditResponse ToResponse(AuditLogDto dto) => new(
            dto.Id,
            dto.EventType,
            dto.EntityType,
            dto.EntityId,
            dto.Actor,
            dto.Timestamp,
            dto.Description,
            dto.Before,
            dto.After);

        public static AuditResponse ToResponse(AuditLog a) => ToResponse(ToDto(a));
    }

    // =============================================================
    // DASHBOARD MAPPER
    // =============================================================
    public static class DashboardMapper
    {
        public static DashboardResponse ToResponse(DashboardDto dto) => new(
            new HeadcountResponse(
                dto.Headcount.Total,
                dto.Headcount.Active,
                dto.Headcount.ByDepartment
                    .Select(d => new DeptCountResponse(d.Department, d.Count)).ToList()),
            new ProjectStatsResponse(
                dto.Projects.Total,
                dto.Projects.Active,
                dto.Projects.Completed,
                dto.Projects.OnHold,
                dto.Projects.TotalTasks,
                dto.Projects.CompletedTasks),
            new LeaveStatsResponse(
                dto.Leaves.Pending,
                dto.Leaves.Approved,
                dto.Leaves.Rejected,
                dto.Leaves.ByType
                    .Select(t => new LeaveTypeCountResponse(t.LeaveType, t.Count)).ToList()),
            dto.RecentActivity
                .Select(a => new RecentActivityResponse(a.Description, a.Timestamp, a.EntityType)).ToList(),
            dto.GeneratedAt);
    }
}
