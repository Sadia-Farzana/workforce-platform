using MongoDB.Driver;
using WorkforceAPI.src.Domain.Entities;

namespace WorkforceAPI.src.Infrastructure.MongoDB
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _db;

        public MongoDbContext(IConfiguration config)
        {
            var connStr = config.GetConnectionString("MongoDB")!;
            var client = new MongoClient(connStr);
            var dbName = MongoUrl.Create(connStr).DatabaseName ?? "workforce";
            _db = client.GetDatabase(dbName);
            EnsureIndexes();
        }

        // Collections
        public IMongoCollection<LeaveRequest> LeaveRequests => _db.GetCollection<LeaveRequest>("leave_requests");
        public IMongoCollection<AuditLog> AuditLogs => _db.GetCollection<AuditLog>("audit_logs");
        public IMongoCollection<SummaryReport> Reports => _db.GetCollection<SummaryReport>("summary_reports");

        private void EnsureIndexes()
        {
            // Leave request indexes
            LeaveRequests.Indexes.CreateMany([
                new CreateIndexModel<LeaveRequest>(
                Builders<LeaveRequest>.IndexKeys.Ascending(x => x.EmployeeId)),
            new CreateIndexModel<LeaveRequest>(
                Builders<LeaveRequest>.IndexKeys.Ascending(x => x.Status)),
            new CreateIndexModel<LeaveRequest>(
                Builders<LeaveRequest>.IndexKeys.Descending(x => x.CreatedAt))
            ]);

            // Audit log indexes
            AuditLogs.Indexes.CreateMany([
                new CreateIndexModel<AuditLog>(
                Builders<AuditLog>.IndexKeys
                    .Ascending(x => x.EntityType)
                    .Ascending(x => x.EntityId)),
            new CreateIndexModel<AuditLog>(
                Builders<AuditLog>.IndexKeys.Descending(x => x.Timestamp)),
            new CreateIndexModel<AuditLog>(
                Builders<AuditLog>.IndexKeys.Ascending(x => x.SourceEventId),
                new CreateIndexOptions { Unique = true })
            ]);
        }
    }

}
