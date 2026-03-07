namespace WorkforceAPI.src.Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        // ── SQL Repositories (PostgreSQL via EF Core) ─────────────
        IEmployeeRepository Employees { get; }
        IDepartmentRepository Departments { get; }
        IDesignationRepository Designations { get; }
        IProjectRepository Projects { get; }
        ITaskRepository Tasks { get; }

        // ── MongoDB Repositories ──────────────────────────────────
        ILeaveRepository Leaves { get; }
        IAuditRepository Audits { get; }
        IReportRepository Reports { get; }

        // ── Commit all EF Core changes ────────────────────────────
        Task<int> SaveChangesAsync(CancellationToken ct = default);
    }
}
