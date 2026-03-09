using System;
using System.Collections.Generic;
using System.Text;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace AuditWorker.src.Domain
{
   


    // =============================================================
    // AUDIT LOG DOCUMENT — stored in MongoDB audit_logs collection
    // =============================================================
    public class AuditLog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string EventType { get; set; } = string.Empty;  // EmployeeCreated, etc.
        public string EntityType { get; set; } = string.Empty;  // Employee, Project, etc.
        public string EntityId { get; set; } = string.Empty;
        public string Actor { get; set; } = "system";
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string? Description { get; set; }
        public object? Before { get; set; }
        public object? After { get; set; }

        // Extra metadata
        public string? CorrelationId { get; set; }
        public string? IpAddress { get; set; }
    }
}
