using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkforceAPI.src.Application.Common;
using WorkforceAPI.src.Application.Interfaces;

namespace WorkforceAPI.Controller
{
  
        [ApiController]
        [Route("api/v1/departments")]
        [Produces("application/json")]
        [Authorize]
        public class DepartmentsController(IDepartmentService service) : ControllerBase
        {
            [HttpGet]
            public async Task<IActionResult> GetAll(CancellationToken ct)
                => Ok(await service.GetAllAsync(ct));

            [HttpPost]
            [Authorize(Policy = "HROrAdmin")]
            public async Task<IActionResult> Create(
                [FromBody] CreateDepartmentRequest request, CancellationToken ct)
            {
                var result = await service.CreateAsync(request, ct);
                return StatusCode(201, result);
            }
        }
    
}
