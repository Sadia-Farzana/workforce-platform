using WorkforceAPI.src.Application.Interfaces;
using WorkforceAPI.src.Infrastructure.MongoDB;

namespace WorkforceAPI.src.Infrastructure.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _db;

        // ── SQL Repositories ──────────────────────────────────────
        private IEmployeeRepository? _employees;
        private IDepartmentRepository? _departments;
        private IDesignationRepository? _designations;
        private IProjectRepository? _projects;
        private ITaskRepository? _tasks;

        // ── MongoDB Repositories ──────────────────────────────────
        private ILeaveRepository? _leaves;
        private IAuditRepository? _audits;
        private IReportRepository? _reports;

        private readonly MongoDbContext _mongo;

        public UnitOfWork(AppDbContext db, MongoDbContext mongo)
        {
            _db = db;
            _mongo = mongo;
        }

        // ── Lazy-initialize each repository ───────────────────────
        // Only created when first accessed — saves memory
        public IEmployeeRepository Employees => _employees ??= new EmployeeRepository(_db);
        public IDepartmentRepository Departments => _departments ??= new DepartmentRepository(_db);
        public IDesignationRepository Designations => _designations ??= new DesignationRepository(_db);
        public IProjectRepository Projects => _projects ??= new ProjectRepository(_db);
        public ITaskRepository Tasks => _tasks ??= new TaskRepository(_db);

        public ILeaveRepository Leaves => _leaves ??= new LeaveRepository(_mongo);
        public IAuditRepository Audits => _audits ??= new AuditRepository(_mongo);
        public IReportRepository Reports => _reports ??= new ReportRepository(_mongo);

        // ── Commit all EF Core pending changes ────────────────────
        public async Task<int> SaveChangesAsync(CancellationToken ct = default)
            => await _db.SaveChangesAsync(ct);

        // ── Cleanup ───────────────────────────────────────────────
        public void Dispose() => _db.Dispose();
    }

}
