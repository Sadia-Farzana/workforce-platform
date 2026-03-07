namespace WorkforceAPI.src.Application.Common
{

    // =============================================================
    // COMMON API RESPONSE WRAPPER
    // All API responses are wrapped in this — consistent contract
    // =============================================================

    public class ApiResponse<T>
    {
        public bool Success { get; init; }
        public string Message { get; init; } = string.Empty;
        public T? Data { get; init; }
        public ApiError? Error { get; init; }
        public DateTime Timestamp { get; init; } = DateTime.UtcNow;

        // ── Static factories ──────────────────────────────────────

        public static ApiResponse<T> Ok(T data, string message = "Success") => new()
        {
            Success = true,
            Message = message,
            Data = data
        };

        public static ApiResponse<T> Fail(string message, string? code = null) => new()
        {
            Success = false,
            Message = message,
            Error = new ApiError(code ?? "ERROR", message)
        };

        public static ApiResponse<T> Fail(ApiError error) => new()
        {
            Success = false,
            Message = error.Message,
            Error = error
        };
    }

    // Non-generic version for responses with no data (e.g. DELETE)
    public class ApiResponse
    {
        public bool Success { get; init; }
        public string Message { get; init; } = string.Empty;
        public ApiError? Error { get; init; }
        public DateTime Timestamp { get; init; } = DateTime.UtcNow;

        public static ApiResponse Ok(string message = "Success") => new()
        {
            Success = true,
            Message = message
        };

        public static ApiResponse Fail(string message, string? code = null) => new()
        {
            Success = false,
            Message = message,
            Error = new ApiError(code ?? "ERROR", message)
        };
    }

    // =============================================================
    // ERROR MODEL
    // =============================================================

    public record ApiError(
        string Code,
        string Message,
        IEnumerable<FieldError>? Fields = null);

    public record FieldError(
        string Field,
        string Message);

    // =============================================================
    // PAGED RESPONSE
    // Wraps paginated results with metadata
    // =============================================================

    public class PagedResponse<T>
    {
        public bool Success { get; init; } = true;
        public string Message { get; init; } = "Success";
        public IReadOnlyList<T> Data { get; init; } = [];
        public PaginationMeta Pagination { get; init; } = new();
        public DateTime Timestamp { get; init; } = DateTime.UtcNow;

        public static PagedResponse<T> Ok(
            IReadOnlyList<T> items,
            int totalCount,
            int page,
            int pageSize,
            string message = "Success") => new()
            {
                Success = true,
                Message = message,
                Data = items,
                Pagination = new PaginationMeta
                {
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    HasNext = page < (int)Math.Ceiling(totalCount / (double)pageSize),
                    HasPrevious = page > 1
                }
            };
    }

    public class PaginationMeta
    {
        public int TotalCount { get; init; }
        public int Page { get; init; }
        public int PageSize { get; init; }
        public int TotalPages { get; init; }
        public bool HasNext { get; init; }
        public bool HasPrevious { get; init; }
    }
}
