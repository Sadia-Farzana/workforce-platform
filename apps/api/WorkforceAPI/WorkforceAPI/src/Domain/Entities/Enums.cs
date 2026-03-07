namespace WorkforceAPI.src.Domain.Entities
{
    public enum ProjectStatus
    {
        Active,
        OnHold,
        Completed,
        Cancelled
    }

    public enum TaskStatus
    {
        Backlog,
        Todo,
        InProgress,
        InReview,
        Done
    }

    public enum TaskPriority
    {
        Low,
        Medium,
        High,
        Critical
    }

    public enum LeaveType
    {
        Annual,
        Sick,
        Casual,
        Unpaid,
        Maternity,
        Paternity
    }

    public enum LeaveStatus
    {
        Pending,
        Approved,
        Rejected,
        Cancelled
    }

}
