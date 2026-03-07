using MassTransit;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serilog;
using WorkforceAPI.Middleware;
using WorkforceAPI.src.Application.Interfaces;
using WorkforceAPI.src.Infrastructure.Messaging;
using WorkforceAPI.src.Infrastructure.MongoDB;
using WorkforceAPI.src.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────────────────────
// 1. SERILOG
// ─────────────────────────────────────────────────────────────
builder.Host.UseSerilog((ctx, cfg) =>
    cfg.ReadFrom.Configuration(ctx.Configuration)
       .WriteTo.Console(outputTemplate:
           "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}"));

// ─────────────────────────────────────────────────────────────
// 2. CONTROLLERS + JSON OPTIONS
// ─────────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
        opts.JsonSerializerOptions.PropertyNamingPolicy =
            System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

// ─────────────────────────────────────────────────────────────
// 3. CORS
// ─────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// ─────────────────────────────────────────────────────────────
// 4. POSTGRESQL — EF Core
// ─────────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Postgres"),
        npgsql => npgsql.MigrationsAssembly("WorkforceAPI")
    )
    .EnableSensitiveDataLogging(builder.Environment.IsDevelopment())
);

// ─────────────────────────────────────────────────────────────
// 5. MONGODB
// ─────────────────────────────────────────────────────────────
builder.Services.AddSingleton<MongoDbContext>();

// ─────────────────────────────────────────────────────────────
// 6. REPOSITORIES
// ─────────────────────────────────────────────────────────────
builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ─────────────────────────────────────────────────────────────
// 7. MASSTRANSIT — RabbitMQ
// ─────────────────────────────────────────────────────────────
builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((ctx, cfg) =>
    {
        var rmq = builder.Configuration.GetSection("RabbitMQ");
        cfg.Host(rmq["Host"] ?? "localhost", rmq["VirtualHost"] ?? "/", h =>
        {
            h.Username(rmq["Username"] ?? "guest");
            h.Password(rmq["Password"] ?? "guest");
        });
        cfg.ConfigureEndpoints(ctx);
    });
});

builder.Services.AddScoped<IEventPublisher, MassTransitEventPublisher>();

// ─────────────────────────────────────────────────────────────
// 8. HEALTH CHECKS
// ─────────────────────────────────────────────────────────────
builder.Services.AddHealthChecks()
    .AddNpgSql(
        builder.Configuration.GetConnectionString("Postgres")!,
        name: "postgres")
    .AddMongoDb(
        sp => sp.GetRequiredService<MongoDbContext>().LeaveRequests.Database.Client,
        name: "mongodb");

// ─────────────────────────────────────────────────────────────
// BUILD APP
// ─────────────────────────────────────────────────────────────
var app = builder.Build();

// ─────────────────────────────────────────────────────────────
// 9. MIDDLEWARE PIPELINE
// ─────────────────────────────────────────────────────────────
app.UseSerilogRequestLogging();
app.UseCors("AllowAll");
app.UseRouting();
app.UseAuthorization();

// ─────────────────────────────────────────────────────────────
// 10. ENDPOINTS
// ─────────────────────────────────────────────────────────────
app.MapControllers();
app.MapHealthChecks("/health");

// Detailed health check
app.MapHealthChecks("/health/detail", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var result = System.Text.Json.JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                duration = e.Value.Duration.TotalMilliseconds + "ms"
            })
        });
        await context.Response.WriteAsync(result);
    }
});

// ─────────────────────────────────────────────────────────────
// 11. OPENAPI + SCALAR
// ─────────────────────────────────────────────────────────────
app.MapOpenApi();
app.MapScalarApiReference(opts =>
{
    opts.Title = "Workforce Platform API";
    opts.Theme = ScalarTheme.Saturn;
});
app.UseGlobalExceptionHandler(); // ← add this first
app.UseSerilogRequestLogging();
app.UseCors("AllowAll");
// ... rest of pipeline
// ─────────────────────────────────────────────────────────────
// 12. AUTO MIGRATE + SEED
// ─────────────────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        logger.LogInformation("Applying migrations...");
        await db.Database.MigrateAsync();
        logger.LogInformation("Seeding database...");
        await DatabaseSeeder.SeedAsync(scope.ServiceProvider);
        logger.LogInformation("Database ready.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database init failed — is PostgreSQL running?");
    }
}

app.Logger.LogInformation("API running → Scalar docs at /scalar");
app.Run();