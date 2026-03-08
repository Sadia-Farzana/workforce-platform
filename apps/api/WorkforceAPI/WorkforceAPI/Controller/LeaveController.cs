using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkforceAPI.src.Application.Common;
using WorkforceAPI.src.Application.Interfaces;

namespace WorkforceAPI.Controller
{
    [ApiController]
    [Route("api/v1/leave-requests")]
    [Produces("application/json")]
    [Authorize]
    public class LeaveController(ILeaveService service) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] GetLeavesRequest request, CancellationToken ct)
            => Ok(await service.GetAllAsync(request, ct));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id, CancellationToken ct)
            => Ok(await service.GetByIdAsync(id, ct));

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateLeaveRequest request, CancellationToken ct)
        {
            var result = await service.CreateAsync(request, ct);
            return StatusCode(201, result);
        }

        [HttpPatch("{id}/review")]
        [Authorize(Policy = "ManagerUp")]   // only Manager/HR/Admin can approve
        public async Task<IActionResult> Review(
            string id, [FromBody] ReviewLeaveRequest request, CancellationToken ct)
            => Ok(await service.ReviewAsync(id, request, ct));
    }
}
