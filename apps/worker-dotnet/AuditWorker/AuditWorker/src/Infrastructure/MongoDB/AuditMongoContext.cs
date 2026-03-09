using System;
using System.Collections.Generic;
using System.Text;
using AuditWorker.src.Domain;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;


namespace AuditWorker.src.Infrastructure.MongoDB
{
    public class AuditMongoContext
    {
        private readonly IMongoDatabase _db;

        public AuditMongoContext(IConfiguration config)
        {
            var connStr = config.GetConnectionString("MongoDB")
                ?? "mongodb://wfp:wfp_secret@localhost:27017/workforce?authSource=admin";

            var url = MongoUrl.Create(connStr);
            var client = new MongoClient(url);
            _db = client.GetDatabase(url.DatabaseName ?? "workforce");
        }

        public IMongoCollection<AuditLog> AuditLogs
            => _db.GetCollection<AuditLog>("audit_logs");
    }
}
