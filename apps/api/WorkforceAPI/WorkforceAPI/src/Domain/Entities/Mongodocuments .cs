using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WorkforceAPI.src.Domain.Entities
{
    public class LeaveRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string LeaveType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = "Pending";
        public string? Reason { get; set; }
        public List<ApprovalHistoryEntry> ApprovalHistory { get; set; } = [];
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Computed
        public int TotalDays => (EndDate - StartDate).Days + 1;
    }

    public class ApprovalHistoryEntry
    {
        public string Status { get; set; } = string.Empty;
        public string ChangedBy { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
        public string? Comment { get; set; }
    }

    // ── Audit Log ─────────────────────────────────────────────────
    public class AuditLog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public string EventType { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public string Actor { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public object? Before { get; set; }
        public object? After { get; set; }
        public string? Description { get; set; }
        public Guid SourceEventId { get; set; }
    }

    // ── Summary Report ────────────────────────────────────────────
    public class SummaryReport
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public string ReportType { get; set; } = "periodic";

        public HeadcountStats Headcount { get; set; } = new();
        public ProjectStats Projects { get; set; } = new();
        public LeaveStats Leaves { get; set; } = new();
        public List<RecentActivity> RecentActivity { get; set; } = [];
    }

    public class HeadcountStats
    {
        public int Total { get; set; }
        public int Active { get; set; }
        public List<DepartmentCount> ByDepartment { get; set; } = [];
    }

    public class DepartmentCount
    {
        public string Department { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class ProjectStats
    {
        public int Total { get; set; }
        public int Active { get; set; }
        public int Completed { get; set; }
        public int OnHold { get; set; }
        public int TotalTasks { get; set; }
        public int CompletedTasks { get; set; }
    }

    public class LeaveStats
    {
        public int Pending { get; set; }
        public int Approved { get; set; }
        public int Rejected { get; set; }
        public List<LeaveTypeCount> ByType { get; set; } = [];
    }

    public class LeaveTypeCount
    {
        public string LeaveType { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class RecentActivity
    {
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string EntityType { get; set; } = string.Empty;
    }

}
