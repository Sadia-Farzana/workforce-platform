using AuditWorker.src.Domain;
using AuditWorker.src.Infrastructure.MongoDB;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuditWorker.src.Infrastructure
{
    public interface IAuditLogRepository
    {
        Task SaveAsync(AuditLog log, CancellationToken ct = default);
        Task<bool> ExistsAsync(string correlationId, CancellationToken ct = default);
    }

    public class AuditLogRepository(AuditMongoContext context) : IAuditLogRepository
    {
        // Idempotent save — skips if same correlationId already saved
        public async Task SaveAsync(AuditLog log, CancellationToken ct = default)
        {
            if (!string.IsNullOrEmpty(log.CorrelationId))
            {
                var exists = await ExistsAsync(log.CorrelationId, ct);
                if (exists) return;
            }

            await context.AuditLogs.InsertOneAsync(log, cancellationToken: ct);
        }

        public async Task<bool> ExistsAsync(string correlationId, CancellationToken ct = default)
        {
            var filter = Builders<AuditLog>.Filter.Eq(x => x.CorrelationId, correlationId);
            return await context.AuditLogs.Find(filter).AnyAsync(ct);
        }
    }
}
