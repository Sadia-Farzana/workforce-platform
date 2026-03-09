using AuditWorker.src.Infrastructure;
using AuditWorker.src.Infrastructure.Messaging;
using AuditWorker.src.Infrastructure.MongoDB;
using AuditWorker.src.Worker;
using AuditWorker.src.Domain;
using MassTransit;
using Serilog;

// ── Serilog ───────────────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console(outputTemplate:
        "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting Audit Worker...");

    var host = Host.CreateDefaultBuilder(args)
        .UseSerilog((ctx, cfg) =>
            cfg.ReadFrom.Configuration(ctx.Configuration)
               .WriteTo.Console(outputTemplate:
                   "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}"))
        .ConfigureServices((ctx, services) =>
        {
            var config = ctx.Configuration;

            // ── MongoDB ───────────────────────────────────────
            services.AddSingleton<AuditMongoContext>();
            services.AddScoped<IAuditLogRepository, AuditLogRepository>();

            // ── MassTransit + RabbitMQ ────────────────────────
            services.AddMassTransit(x =>
            {
                // Register all consumers
                x.AddConsumer<EmployeeCreatedConsumer>();
                x.AddConsumer<EmployeeUpdatedConsumer>();
                x.AddConsumer<EmployeeDeletedConsumer>();
                x.AddConsumer<ProjectCreatedConsumer>();
                x.AddConsumer<ProjectUpdatedConsumer>();
                x.AddConsumer<ProjectStatusChangedConsumer>();
                x.AddConsumer<ProjectMemberAddedConsumer>();
                x.AddConsumer<TaskCreatedConsumer>();
                x.AddConsumer<TaskStatusChangedConsumer>();
                x.AddConsumer<LeaveRequestSubmittedConsumer>();
                x.AddConsumer<LeaveStatusChangedConsumer>();

                x.UsingRabbitMq((ctx, cfg) =>
                {
                    var rmq = config.GetSection("RabbitMQ");

                    cfg.Host(rmq["Host"] ?? "localhost", rmq["VirtualHost"] ?? "/", h =>
                    {
                        h.Username(rmq["Username"] ?? "guest");
                        h.Password(rmq["Password"] ?? "guest");
                    });

                    // Retry policy — retry 3 times with 5s delay before dead-letter
                    cfg.UseMessageRetry(r => r.Intervals(
                        TimeSpan.FromSeconds(5),
                        TimeSpan.FromSeconds(15),
                        TimeSpan.FromSeconds(30)));

                    cfg.ConfigureEndpoints(ctx);
                });
            });

            // ── Background Service ────────────────────────────
            services.AddHostedService<AuditWorkerService>();
        })
        .Build();

    await host.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Audit Worker terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}