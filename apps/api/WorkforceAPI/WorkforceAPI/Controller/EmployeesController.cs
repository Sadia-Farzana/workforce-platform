using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkforceAPI.src.Application.Common;
using WorkforceAPI.src.Application.DTOs;
using WorkforceAPI.src.Application.Interfaces;
using WorkforceAPI.src.Domain.Entities;

namespace WorkforceAPI.Controller
{
    [ApiController]
    [Route("api/v1/employees")]
    [Produces("application/json")]
    [Authorize]                             // every endpoint requires a valid JWE token
    public class EmployeesController(IEmployeeService service) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] GetEmployeesRequest request, CancellationToken ct)
            => Ok(await service.GetAllAsync(request, ct));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
            => Ok(await service.GetByIdAsync(id, ct));

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q, CancellationToken ct)
            => Ok(await service.SearchAsync(q, ct));

        [HttpPost]
        [Authorize(Policy = "HROrAdmin")]   // only HR and Admin
        public async Task<IActionResult> Create(
            [FromBody] CreateEmployeeRequest request, CancellationToken ct)
        {
            var result = await service.CreateAsync(request, ct);
            return StatusCode(201, result);
        }

        [HttpPut("{id:int}")]
        [Authorize(Policy = "HROrAdmin")]
        public async Task<IActionResult> Update(
            int id, [FromBody] UpdateEmployeeRequest request, CancellationToken ct)
            => Ok(await service.UpdateAsync(id, request, ct));

        [HttpDelete("{id:int}")]
        [Authorize(Policy = "AdminOnly")]   // only Admin
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
            => Ok(await service.DeleteAsync(id, ct));
    }


}

