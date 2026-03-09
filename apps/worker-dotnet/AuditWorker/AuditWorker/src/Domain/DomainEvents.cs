using System;
using System.Collections.Generic;
using System.Text;

namespace AuditWorker.src.Domain
{
   


public abstract class DomainEvent
{
    public Guid EventId { get; init; } = Guid.NewGuid();
    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
    public string Actor { get; set; } = "system";
    public string? CorrelationId { get; init; }
}

// ── Employee Events ───────────────────────────────────────────
public class EmployeeCreatedEvent : DomainEvent
{
    public int EmployeeId { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public int DepartmentId { get; init; }
}

public class EmployeeUpdatedEvent : DomainEvent
{
    public int EmployeeId { get; init; }
    public string FullName { get; init; } = string.Empty;
    public object? Before { get; init; }
    public object? After { get; init; }
}

public class EmployeeDeletedEvent : DomainEvent
{
    public int EmployeeId { get; init; }
    public string FullName { get; init; } = string.Empty;
}

// ── Project Events ────────────────────────────────────────────
public class ProjectCreatedEvent : DomainEvent
{
    public int ProjectId { get; init; }
    public string ProjectName { get; init; } = string.Empty;
}

public class ProjectUpdatedEvent : DomainEvent
{
    public int ProjectId { get; init; }
    public string ProjectName { get; init; } = string.Empty;
    public object? Before { get; init; }
    public object? After { get; init; }
}

public class ProjectStatusChangedEvent : DomainEvent
{
    public int ProjectId { get; init; }
    public string ProjectName { get; init; } = string.Empty;
    public string OldStatus { get; init; } = string.Empty;
    public string NewStatus { get; init; } = string.Empty;
}

public class ProjectMemberAddedEvent : DomainEvent
{
    public int ProjectId { get; init; }
    public int EmployeeId { get; init; }
    public string EmployeeName { get; init; } = string.Empty;
}

// ── Task Events ───────────────────────────────────────────────
public class TaskCreatedEvent : DomainEvent
{
    public int TaskId { get; init; }
    public string Title { get; init; } = string.Empty;
    public int ProjectId { get; init; }
}

public class TaskStatusChangedEvent : DomainEvent
{
    public int TaskId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string OldStatus { get; init; } = string.Empty;
    public string NewStatus { get; init; } = string.Empty;
    public int ProjectId { get; init; }
}

// ── Leave Events ──────────────────────────────────────────────
public class LeaveRequestSubmittedEvent : DomainEvent
{
    public string LeaveRequestId { get; init; } = string.Empty;
    public int EmployeeId { get; init; }
    public string EmployeeName { get; init; } = string.Empty;
    public string LeaveType { get; init; } = string.Empty;
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
}

public class LeaveStatusChangedEvent : DomainEvent
{
    public string LeaveRequestId { get; init; } = string.Empty;
    public int EmployeeId { get; init; }
    public string EmployeeName { get; init; } = string.Empty;
    public string OldStatus { get; init; } = string.Empty;
    public string NewStatus { get; init; } = string.Empty;
    public string? Comment { get; init; }
}
}