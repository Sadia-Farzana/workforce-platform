using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkforceAPI.src.Application.Interfaces;

namespace WorkforceAPI.Controller
{
    [ApiController]
    [Route("api/v1/dashboard")]
    [Produces("application/json")]
    [Authorize]
    public class DashboardController(IDashboardService service) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetDashboard(CancellationToken ct)
            => Ok(await service.GetDashboardAsync(ct));
    }
}
