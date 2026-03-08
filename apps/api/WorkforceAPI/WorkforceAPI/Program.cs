using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Serilog;
using System.Security.Cryptography;
using System.Text;
using WorkforceAPI.Middleware;
using WorkforceAPI.src.Application.Interfaces;
using WorkforceAPI.src.Application.Services;
using WorkforceAPI.src.Infrastructure.Auth;
using WorkforceAPI.src.Infrastructure.Messaging;
using WorkforceAPI.src.Infrastructure.MongoDB;
using WorkforceAPI.src.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);
Console.WriteLine(">>> CONN: " + builder.Configuration.GetConnectionString("Postgres"));
// ── Serilog ───────────────────────────────────────────────────
builder.Host.UseSerilog((ctx, cfg) =>
    cfg.ReadFrom.Configuration(ctx.Configuration)
       .WriteTo.Console(outputTemplate:
           "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}"));

// ── Controllers + JSON ────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
        o.JsonSerializerOptions.PropertyNamingPolicy =
            System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

// ── CORS ──────────────────────────────────────────────────────
builder.Services.AddCors(opt =>
    opt.AddPolicy("AllowAll", p =>
        p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

// ── PostgreSQL ────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Postgres"),
        npgsql => npgsql.MigrationsAssembly("WorkforceAPI")));

// ── MongoDB ───────────────────────────────────────────────────
builder.Services.AddSingleton<MongoDbContext>();

// ── JWT Settings ──────────────────────────────────────────────
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt"));

var jwtCfg = builder.Configuration.GetSection("Jwt").Get<JwtSettings>()!;
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtCfg.Secret));
var encryptKey = new SymmetricSecurityKey(
    SHA256.HashData(Encoding.UTF8.GetBytes(jwtCfg.EncryptionSecret)));

// ── ASP.NET Authentication (validates JWE on [Authorize]) ─────
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtCfg.Issuer,
        ValidAudience = jwtCfg.Audience,
        IssuerSigningKey = signingKey,
        TokenDecryptionKey = encryptKey,  // JWE decryption
        ClockSkew = TimeSpan.Zero
    };

    // Return proper JSON on 401/403
    opt.Events = new JwtBearerEvents
    {
        OnChallenge = ctx =>
        {
            ctx.HandleResponse();
            ctx.Response.StatusCode = 401;
            ctx.Response.ContentType = "application/json";
            return ctx.Response.WriteAsync(
                """{"success":false,"message":"Unauthorized — valid Bearer token required","error":{"code":"UNAUTHORIZED"}}""");
        },
        OnForbidden = ctx =>
        {
            ctx.Response.StatusCode = 403;
            ctx.Response.ContentType = "application/json";
            return ctx.Response.WriteAsync(
                """{"success":false,"message":"Forbidden — insufficient permissions","error":{"code":"FORBIDDEN"}}""");
        }
    };
});

// ── Authorization Policies ────────────────────────────────────
builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
    opt.AddPolicy("HROrAdmin", p => p.RequireRole("Admin", "HR"));
    opt.AddPolicy("ManagerUp", p => p.RequireRole("Admin", "HR", "Manager"));
    opt.AddPolicy("AllRoles", p => p.RequireAuthenticatedUser());
});

// ── Infrastructure ────────────────────────────────────────────
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Auth
builder.Services.AddScoped<ITokenService, JweTokenService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

// Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<ILeaveService, LeaveService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IDesignationService, DesignationService>();

// ── MassTransit / RabbitMQ ────────────────────────────────────
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

// ── Health Checks ─────────────────────────────────────────────
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("Postgres")!, name: "postgres");

// ═════════════════════════════════════════════════════════════
var app = builder.Build();
// ═════════════════════════════════════════════════════════════

// ── Middleware pipeline (ORDER MATTERS) ───────────────────────
app.UseGlobalExceptionHandler();   // 1. catch all exceptions first
app.UseSerilogRequestLogging();    // 2. log requests
app.UseCors("AllowAll");           // 3. CORS headers
app.UseAuthentication();           // 4. ASP.NET auth (for [Authorize])
app.UseAuthorization();            // 5. policies
app.UseJwtMiddleware();            // 6. custom JWE middleware (sets HttpContext.User)

app.MapControllers();
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/detail", new HealthCheckOptions
{
    ResponseWriter = async (ctx, report) =>
    {
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                duration = e.Value.Duration.TotalMilliseconds + "ms"
            })
        }));
    }
});

app.MapOpenApi();
app.MapScalarApiReference(opt =>
{
    opt.Title = "Workforce Platform API";
    opt.Theme = ScalarTheme.Saturn;
});

// ── Migrate + seed ────────────────────────────────────────────
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