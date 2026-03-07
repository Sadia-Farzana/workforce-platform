using MongoDB.Driver;
using WorkforceAPI.src.Application.Interfaces;
using WorkforceAPI.src.Domain.Entities;
using MongoDB.Bson;

namespace WorkforceAPI.src.Infrastructure.MongoDB
{
    public class LeaveRepository(MongoDbContext ctx) : ILeaveRepository
    {
        public async Task<PagedResult<LeaveRequest>> GetPagedAsync(
            PagedQuery query,
            string? status = null,
            string? leaveType = null,
            int? employeeId = null,
            CancellationToken ct = default)
        {
            var filter = Builders<LeaveRequest>.Filter.Empty;

            if (!string.IsNullOrWhiteSpace(status))
                filter &= Builders<LeaveRequest>.Filter.Eq(x => x.Status, status);

            if (!string.IsNullOrWhiteSpace(leaveType))
                filter &= Builders<LeaveRequest>.Filter.Eq(x => x.LeaveType, leaveType);

            if (employeeId.HasValue)
                filter &= Builders<LeaveRequest>.Filter.Eq(x => x.EmployeeId, employeeId);

            if (!string.IsNullOrWhiteSpace(query.Search))
                filter &= Builders<LeaveRequest>.Filter.Regex(
                    x => x.EmployeeName,
                    new BsonRegularExpression(query.Search, "i"));

            var total = (int)await ctx.LeaveRequests.CountDocumentsAsync(filter, cancellationToken: ct);
            var items = await ctx.LeaveRequests
                .Find(filter)
                .SortByDescending(x => x.CreatedAt)
                .Skip((query.Page - 1) * query.PageSize)
                .Limit(query.PageSize)
                .ToListAsync(ct);

            return new PagedResult<LeaveRequest>(items, total, query.Page, query.PageSize);
        }

        public async Task<LeaveRequest?> GetByIdAsync(string id, CancellationToken ct = default)
            => await ctx.LeaveRequests.Find(x => x.Id == id).FirstOrDefaultAsync(ct);

        public async Task<LeaveRequest> CreateAsync(LeaveRequest request, CancellationToken ct = default)
        {
            await ctx.LeaveRequests.InsertOneAsync(request, cancellationToken: ct);
            return request;
        }

        public async Task<LeaveRequest> UpdateAsync(LeaveRequest request, CancellationToken ct = default)
        {
            request.UpdatedAt = DateTime.UtcNow;
            await ctx.LeaveRequests.ReplaceOneAsync(x => x.Id == request.Id, request, cancellationToken: ct);
            return request;
        }

        public async Task<List<LeaveRequest>> GetByEmployeeAsync(int employeeId, CancellationToken ct = default)
            => await ctx.LeaveRequests
                .Find(x => x.EmployeeId == employeeId)
                .SortByDescending(x => x.CreatedAt)
                .ToListAsync(ct);
    }

    // ── Audit Repository ──────────────────────────────────────────
    public class AuditRepository(MongoDbContext ctx) : IAuditRepository
    {
        public async Task<PagedResult<AuditLog>> GetPagedAsync(
            PagedQuery query,
            string? entityType = null,
            string? entityId = null,
            CancellationToken ct = default)
        {
            var filter = Builders<AuditLog>.Filter.Empty;

            if (!string.IsNullOrWhiteSpace(entityType))
                filter &= Builders<AuditLog>.Filter.Eq(x => x.EntityType, entityType);

            if (!string.IsNullOrWhiteSpace(entityId))
                filter &= Builders<AuditLog>.Filter.Eq(x => x.EntityId, entityId);

            if (!string.IsNullOrWhiteSpace(query.Search))
                filter &= Builders<AuditLog>.Filter.Regex(
                    x => x.Description,
                    new BsonRegularExpression(query.Search, "i"));

            var total = (int)await ctx.AuditLogs.CountDocumentsAsync(filter, cancellationToken: ct);
            var items = await ctx.AuditLogs
                .Find(filter)
                .SortByDescending(x => x.Timestamp)
                .Skip((query.Page - 1) * query.PageSize)
                .Limit(query.PageSize)
                .ToListAsync(ct);

            return new PagedResult<AuditLog>(items, total, query.Page, query.PageSize);
        }

        public async Task<List<AuditLog>> GetByEntityAsync(string entityType, string entityId, CancellationToken ct = default)
            => await ctx.AuditLogs
                .Find(x => x.EntityType == entityType && x.EntityId == entityId)
                .SortByDescending(x => x.Timestamp)
                .ToListAsync(ct);

        public async Task CreateAsync(AuditLog log, CancellationToken ct = default)
            => await ctx.AuditLogs.InsertOneAsync(log, cancellationToken: ct);
    }

    // ── Report Repository ─────────────────────────────────────────
    public class ReportRepository(MongoDbContext ctx) : IReportRepository
    {
        public async Task<SummaryReport?> GetLatestAsync(CancellationToken ct = default)
            => await ctx.Reports
                .Find(_ => true)
                .SortByDescending(x => x.GeneratedAt)
                .FirstOrDefaultAsync(ct);

        public async Task UpsertAsync(SummaryReport report, CancellationToken ct = default)
        {
            if (string.IsNullOrEmpty(report.Id))
                await ctx.Reports.InsertOneAsync(report, cancellationToken: ct);
            else
                await ctx.Reports.ReplaceOneAsync(
                    x => x.Id == report.Id,
                    report,
                    new ReplaceOptions { IsUpsert = true },
                    ct);
        }
    }
}
