using AuditWorker.src.Domain;
using MassTransit;
using AuditWorker.src.Infrastructure;
using Microsoft.Extensions.Logging;


namespace AuditWorker.src.Infrastructure.Messaging
{
    public class EmployeeCreatedConsumer(
     IAuditLogRepository repo,
     ILogger<EmployeeCreatedConsumer> logger) : IConsumer<EmployeeCreatedEvent>
    {
        public async Task Consume(ConsumeContext<EmployeeCreatedEvent> context)
        {
            var e = context.Message;
            logger.LogInformation("Audit: Employee created — {FullName} ({Id})", e.FullName, e.EmployeeId);

            await repo.SaveAsync(new AuditLog
            {
                EventType = "EmployeeCreated",
                EntityType = "Employee",
                EntityId = e.EmployeeId.ToString(),
                Actor = e.Actor,
                Timestamp = e.OccurredAt,
                Description = $"Employee '{e.FullName}' was created",
                After = new { e.EmployeeId, e.FullName, e.Email, e.DepartmentId },
                CorrelationId = e.EventId.ToString()
            }, context.CancellationToken);
        }
    }

    public class EmployeeUpdatedConsumer(
        IAuditLogRepository repo,
        ILogger<EmployeeUpdatedConsumer> logger) : IConsumer<EmployeeUpdatedEvent>
    {
        public async Task Consume(ConsumeContext<EmployeeUpdatedEvent> context)
        {
            var e = context.Message;
            logger.LogInformation("Audit: Employee updated — {FullName} ({Id})", e.FullName, e.EmployeeId);

            await repo.SaveAsync(new AuditLog
            {
                EventType = "EmployeeUpdated",
                EntityType = "Employee",
                EntityId = e.EmployeeId.ToString(),
                Actor = e.Actor,
                Timestamp = e.OccurredAt,
                Description = $"Employee '{e.FullName}' was updated",
                Before = e.Before,
                After = e.After,
                CorrelationId = e.EventId.ToString()
            }, context.CancellationToken);
        }
    }

    public class EmployeeDeletedConsumer(
        IAuditLogRepository repo,
        ILogger<EmployeeDeletedConsumer> logger) : IConsumer<EmployeeDeletedEvent>
    {
        public async Task Consume(ConsumeContext<EmployeeDeletedEvent> context)
        {
            var e = context.Message;
            logger.LogInformation("Audit: Employee deleted — {FullName} ({Id})", e.FullName, e.EmployeeId);

            await repo.SaveAsync(new AuditLog
            {
                EventType = "EmployeeDeleted",
                EntityType = "Employee",
                EntityId = e.EmployeeId.ToString(),
                Actor = e.Actor,
                Timestamp = e.OccurredAt,
                Description = $"Employee '{e.FullName}' was deleted",
                Before = new { e.EmployeeId, e.FullName },
                CorrelationId = e.EventId.ToString()
            }, context.CancellationToken);
        }
    }

    // =============================================================
    // PROJECT CONSUMERS
    // =============================================================

    public class ProjectCreatedConsumer(
        IAuditLogRepository repo,
        ILogger<ProjectCreatedConsumer> logger) : IConsumer<ProjectCreatedEvent>
    {
        public async Task Consume(ConsumeContext<ProjectCreatedEvent> context)
        {
            var e = context.Message;
            logger.LogInformation("Audit: Project created — {Name} ({Id})", e.ProjectName, e.ProjectId);

            await repo.SaveAsync(new AuditLog
            {
                EventType = "ProjectCreated",
                EntityType = "Project",
                EntityId = e.ProjectId.ToString(),
                Actor = e.Actor,
                Timestamp = e.OccurredAt,
                Description = $"Project '{e.ProjectName}' was created",
                After = new { e.ProjectId, e.ProjectName },
                CorrelationId = e.EventId.ToString()
            }, context.CancellationToken);
        }
    }

    public class ProjectUpdatedConsumer(
        IAuditLogRepository repo,
        ILogger<ProjectUpdatedConsumer> logger) : IConsumer<ProjectUpdatedEvent>
    {
        public async Task Consume(ConsumeContext<ProjectUpdatedEvent> context)
        {
            var e = context.Message;
            logger.LogInformation("Audit: Project updated — {Name} ({Id})", e.ProjectName, e.ProjectId);

            await repo.SaveAsync(new AuditLog
            {
                EventType = "ProjectUpdated",
                EntityType = "Project",
                EntityId = e.ProjectId.ToString(),
                Actor = e.Actor,
                Timestamp = e.OccurredAt,
                Description = $"Project '{e.ProjectName}' was updated",
                Before = e.Before,
                After = e.After,
                CorrelationId = e.EventId.ToString()
            }, context.CancellationToken);
        }
    }

    public class ProjectStatusChangedConsumer(
        IAuditLogRepository repo,
        ILogger<ProjectStatusChangedConsumer> logger) : IConsumer<ProjectStatusChangedEvent>
    {
        public async Task Consume(ConsumeContext<ProjectStatusChangedEvent> context)
        {
            var e = context.Message;
            logger.LogInformation("Audit: Project status changed — {Name} {Old}→{New}",
                e.ProjectName, e.OldStatus, e.NewStatus);

            await repo.SaveAsync(new AuditLog
            {
                EventType = "ProjectStatusChanged",
                EntityType = "Project",
                EntityId = e.ProjectId.ToString(),
                Actor = e.Actor,
                Timestamp = e.OccurredAt,
                Description = $"Project '{e.ProjectName}' status changed from '{e.OldStatus}' to '{e.NewStatus}'",
                Before = new { Status = e.OldStatus },
                After = new { Status = e.NewStatus },
                CorrelationId = e.EventId.ToString()
            }, context.CancellationToken);
        }
    }

    public class ProjectMemberAddedConsumer(
        IAuditLogRepository repo,
        ILogger<ProjectMemberAddedConsumer> logger) : IConsumer<ProjectMemberAddedEvent>
    {
        public async Task Consume(ConsumeContext<ProjectMemberAddedEvent> context)
        {
            var e = context.Message;
            logger.LogInformation("Audit: Member added to project {ProjectId} — {Name}", e.ProjectId, e.EmployeeName);

            await repo.SaveAsync(new AuditLog
            {
                EventType = "ProjectMemberAdded",
                EntityType = "Project",
                EntityId = e.ProjectId.ToString(),
                Actor = e.Actor,
                Timestamp = e.OccurredAt,
                Description = $"'{e.EmployeeName}' was added to project {e.ProjectId}",
                After = new { e.EmployeeId, e.EmployeeName },
                CorrelationId = e.EventId.ToString()
            }, context.CancellationToken);
        }
    }

    // =============================================================
    // TASK CONSUMERS
    // =============================================================

    public class TaskCreatedConsumer(
        IAuditLogRepository repo,
        ILogger<TaskCreatedConsumer> logger) : IConsumer<TaskCreatedEvent>
    {
        public async Task Consume(ConsumeContext<TaskCreatedEvent> context)
        {
            var e = context.Message;
            logger.LogInformation("Audit: Task created — {Title} in project {ProjectId}", e.Title, e.ProjectId);

            await repo.SaveAsync(new AuditLog
            {
                EventType = "TaskCreated",
                EntityType = "Task",
                EntityId = e.TaskId.ToString(),
                Actor = e.Actor,
                Timestamp = e.OccurredAt,
                Description = $"Task '{e.Title}' was created in project {e.ProjectId}",
                After = new { e.TaskId, e.Title, e.ProjectId },
                CorrelationId = e.EventId.ToString()
            }, context.CancellationToken);
        }
    }

    public class TaskStatusChangedConsumer(
        IAuditLogRepository repo,
        ILogger<TaskStatusChangedConsumer> logger) : IConsumer<TaskStatusChangedEvent>
    {
        public async Task Consume(ConsumeContext<TaskStatusChangedEvent> context)
        {
            var e = context.Message;
            logger.LogInformation("Audit: Task status changed — {Title} {Old}→{New}", e.Title, e.OldStatus, e.NewStatus);

            await repo.SaveAsync(new AuditLog
            {
                EventType = "TaskStatusChanged",
                EntityType = "Task",
                EntityId = e.TaskId.ToString(),
                Actor = e.Actor,
                Timestamp = e.OccurredAt,
                Description = $"Task '{e.Title}' status changed from '{e.OldStatus}' to '{e.NewStatus}'",
                Before = new { Status = e.OldStatus },
                After = new { Status = e.NewStatus },
                CorrelationId = e.EventId.ToString()
            }, context.CancellationToken);
        }
    }

    // =============================================================
    // LEAVE CONSUMERS
    // =============================================================

    public class LeaveRequestSubmittedConsumer(
        IAuditLogRepository repo,
        ILogger<LeaveRequestSubmittedConsumer> logger) : IConsumer<LeaveRequestSubmittedEvent>
    {
        public async Task Consume(ConsumeContext<LeaveRequestSubmittedEvent> context)
        {
            var e = context.Message;
            logger.LogInformation("Audit: Leave submitted — {Name} ({Type})", e.EmployeeName, e.LeaveType);

            await repo.SaveAsync(new AuditLog
            {
                EventType = "LeaveRequestSubmitted",
                EntityType = "LeaveRequest",
                EntityId = e.LeaveRequestId,
                Actor = e.Actor,
                Timestamp = e.OccurredAt,
                Description = $"{e.EmployeeName} submitted {e.LeaveType} leave from {e.StartDate:d} to {e.EndDate:d}",
                After = new { e.EmployeeId, e.EmployeeName, e.LeaveType, e.StartDate, e.EndDate },
                CorrelationId = e.EventId.ToString()
            }, context.CancellationToken);
        }
    }

    public class LeaveStatusChangedConsumer(
        IAuditLogRepository repo,
        ILogger<LeaveStatusChangedConsumer> logger) : IConsumer<LeaveStatusChangedEvent>
    {
        public async Task Consume(ConsumeContext<LeaveStatusChangedEvent> context)
        {
            var e = context.Message;
            logger.LogInformation("Audit: Leave status changed — {Name} {Old}→{New}", e.EmployeeName, e.OldStatus, e.NewStatus);

            await repo.SaveAsync(new AuditLog
            {
                EventType = "LeaveStatusChanged",
                EntityType = "LeaveRequest",
                EntityId = e.LeaveRequestId,
                Actor = e.Actor,
                Timestamp = e.OccurredAt,
                Description = $"{e.EmployeeName}'s leave was {e.NewStatus.ToLower()} (was {e.OldStatus})",
                Before = new { Status = e.OldStatus },
                After = new { Status = e.NewStatus, e.Comment },
                CorrelationId = e.EventId.ToString()
            }, context.CancellationToken);
        }
    }
}
