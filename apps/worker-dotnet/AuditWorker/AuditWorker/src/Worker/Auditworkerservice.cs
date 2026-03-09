using System;
using System.Collections.Generic;
using System.Text;

namespace AuditWorker.src.Worker
{
    public class AuditWorkerService(ILogger<AuditWorkerService> logger) : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("Audit Worker started — listening for domain events via RabbitMQ");

            while (!stoppingToken.IsCancellationRequested)
            {
                logger.LogInformation("Audit Worker heartbeat — {Time}", DateTimeOffset.UtcNow);
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }

            logger.LogInformation("Audit Worker stopping");
        }
    }
}
