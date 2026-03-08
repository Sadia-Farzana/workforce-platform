using System.Net;
using System.Text.Json;
using WorkforceAPI.src.Application.Common;

namespace WorkforceAPI.Middleware
{
    public class GlobalExceptionMiddleware(
       RequestDelegate next,
       ILogger<GlobalExceptionMiddleware> logger)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unhandled exception: {Method} {Path} — {Message}",
                    context.Request.Method,
                    context.Request.Path,
                    ex.Message);

                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";

            var (statusCode, code, message) = ex switch
            {
                KeyNotFoundException => (HttpStatusCode.NotFound, "NOT_FOUND", ex.Message),
                InvalidOperationException => (HttpStatusCode.Conflict, "CONFLICT", ex.Message),
                ArgumentException => (HttpStatusCode.BadRequest, "BAD_REQUEST", ex.Message),
                UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "UNAUTHORIZED", ex.Message),
                _ => (HttpStatusCode.InternalServerError, "INTERNAL_SERVER_ERROR", "An unexpected error occurred")
            };

            context.Response.StatusCode = (int)statusCode;

            var response = ApiResponse.Fail(message, code);

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);
        }
    }

    // Extension method for clean registration in Program.cs
    public static class GlobalExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
            => app.UseMiddleware<GlobalExceptionMiddleware>();
    }
}
