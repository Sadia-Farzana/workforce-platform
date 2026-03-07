namespace WorkforceAPI.src.Domain.Entities
{
    // ── Base event ────────────────────────────────────────────────
    public abstract record DomainEvent
    {
        public Guid EventId { get; init; } = Guid.NewGuid();
        public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
        public string Actor { get; init; } = "system";
    }

    // ── Employee Events ───────────────────────────────────────────
    public record EmployeeCreatedEvent(
        int EmployeeId,
        string FullName,
        string Email,
        int DepartmentId) : DomainEvent;

    public record EmployeeUpdatedEvent(
        int EmployeeId,
        string FullName,
        object Before,
        object After) : DomainEvent;

    public record EmployeeDeletedEvent(
        int EmployeeId,
        string FullName) : DomainEvent;

    // ── Project Events ────────────────────────────────────────────
    public record ProjectCreatedEvent(
        int ProjectId,
        string Name) : DomainEvent;

    public record ProjectUpdatedEvent(
        int ProjectId,
        string Name,
        object Before,
        object After) : DomainEvent;

    public record ProjectStatusChangedEvent(
        int ProjectId,
        string Name,
        string OldStatus,
        string NewStatus) : DomainEvent;

    public record ProjectMemberAddedEvent(
        int ProjectId,
        int EmployeeId,
        string EmployeeName) : DomainEvent;

    // ── Task Events ───────────────────────────────────────────────
    public record TaskCreatedEvent(
        int TaskId,
        string Title,
        int ProjectId) : DomainEvent;

    public record TaskStatusChangedEvent(
        int TaskId,
        string Title,
        string OldStatus,
        string NewStatus,
        int ProjectId) : DomainEvent;

    public record TaskAssignedEvent(
        int TaskId,
        string Title,
        int EmployeeId,
        string EmployeeName) : DomainEvent;

    // ── Leave Events ──────────────────────────────────────────────
    public record LeaveRequestSubmittedEvent(
        string LeaveId,
        int EmployeeId,
        string EmployeeName,
        string LeaveType,
        DateTime StartDate,
        DateTime EndDate) : DomainEvent;

    public record LeaveStatusChangedEvent(
        string LeaveId,
        int EmployeeId,
        string EmployeeName,
        string OldStatus,
        string NewStatus,
        string? Comment) : DomainEvent;
}
