using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkforceAPI.src.Application.Common;
using WorkforceAPI.src.Application.Interfaces;

namespace WorkforceAPI.Controller
{
    [ApiController]
    [Route("api/v1/audit-logs")]
    [Produces("application/json")]
    [Authorize(Policy = "HROrAdmin")]
    public class AuditController(IAuditService service) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] GetAuditLogsRequest request, CancellationToken ct)
            => Ok(await service.GetAllAsync(request, ct));

        [HttpGet("entity/{entityType}/{entityId}")]
        public async Task<IActionResult> GetByEntity(
            string entityType, string entityId, CancellationToken ct)
            => Ok(await service.GetByEntityAsync(entityType, entityId, ct));
    }

}
