using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkforceAPI.src.Application.Common;
using WorkforceAPI.src.Application.Interfaces;

namespace WorkforceAPI.Controller
{
    [ApiController]
    [Route("api/v1/projects/{projectId:int}/tasks")]
    [Produces("application/json")]
    [Authorize]
    public class TasksController(ITaskService service) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetByProject(int projectId, CancellationToken ct)
            => Ok(await service.GetByProjectAsync(projectId, ct));

        [HttpPost]
        [Authorize(Policy = "ManagerUp")]
        public async Task<IActionResult> Create(
            int projectId, [FromBody] CreateTaskRequest request, CancellationToken ct)
        {
            var result = await service.CreateAsync(projectId, request, ct);
            return StatusCode(201, result);
        }

        [HttpPut("{taskId:int}")]
        [Authorize(Policy = "ManagerUp")]
        public async Task<IActionResult> Update(
            int projectId, int taskId, [FromBody] UpdateTaskRequest request, CancellationToken ct)
            => Ok(await service.UpdateAsync(projectId, taskId, request, ct));

        [HttpDelete("{taskId:int}")]
        [Authorize(Policy = "ManagerUp")]
        public async Task<IActionResult> Delete(int projectId, int taskId, CancellationToken ct)
            => Ok(await service.DeleteAsync(projectId, taskId, ct));
    }
}
