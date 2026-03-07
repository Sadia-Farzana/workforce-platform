using WorkforceAPI.src.Application.Interfaces;
using WorkforceAPI.src.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace WorkforceAPI.src.Infrastructure.Persistence
{
    public class EmployeeRepository(AppDbContext db) : IEmployeeRepository
    {
        public async Task<PagedResult<Employee>> GetPagedAsync(
            PagedQuery query, int? departmentId = null, bool? isActive = null, CancellationToken ct = default)
        {
            var q = db.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .AsQueryable();

            if (departmentId.HasValue)
                q = q.Where(e => e.DepartmentId == departmentId);

            if (isActive.HasValue)
                q = q.Where(e => e.IsActive == isActive);

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var s = query.Search.ToLower();
                q = q.Where(e =>
                    e.FirstName.ToLower().Contains(s) ||
                    e.LastName.ToLower().Contains(s) ||
                    e.Email.ToLower().Contains(s));
            }

            q = query.SortBy switch
            {
                "firstName" => query.SortDesc ? q.OrderByDescending(e => e.FirstName) : q.OrderBy(e => e.FirstName),
                "lastName" => query.SortDesc ? q.OrderByDescending(e => e.LastName) : q.OrderBy(e => e.LastName),
                "email" => query.SortDesc ? q.OrderByDescending(e => e.Email) : q.OrderBy(e => e.Email),
                "salary" => query.SortDesc ? q.OrderByDescending(e => e.Salary) : q.OrderBy(e => e.Salary),
                "joiningDate" => query.SortDesc ? q.OrderByDescending(e => e.JoiningDate) : q.OrderBy(e => e.JoiningDate),
                _ => q.OrderBy(e => e.Id)
            };

            var total = await q.CountAsync(ct);
            var items = await q
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync(ct);

            return new PagedResult<Employee>(items, total, query.Page, query.PageSize);
        }

        public async Task<Employee?> GetByIdAsync(int id, CancellationToken ct = default)
            => await db.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .Include(e => e.ProjectEmployees).ThenInclude(pe => pe.Project)
                .FirstOrDefaultAsync(e => e.Id == id, ct);

        public async Task<Employee?> GetByEmailAsync(string email, CancellationToken ct = default)
            => await db.Employees.FirstOrDefaultAsync(e => e.Email == email, ct);

        public async Task<Employee> CreateAsync(Employee employee, CancellationToken ct = default)
        {
            db.Employees.Add(employee);
            await db.SaveChangesAsync(ct);
            return employee;
        }

        public async Task<Employee> UpdateAsync(Employee employee, CancellationToken ct = default)
        {
            employee.UpdatedAt = DateTime.UtcNow;
            db.Employees.Update(employee);
            await db.SaveChangesAsync(ct);
            return employee;
        }

        public async Task DeleteAsync(int id, CancellationToken ct = default)
        {
            var emp = await db.Employees.FindAsync([id], ct);
            if (emp is not null)
            {
                emp.IsActive = false;
                emp.UpdatedAt = DateTime.UtcNow;
                await db.SaveChangesAsync(ct);
            }
        }

        public async Task<List<Employee>> GetByDepartmentAsync(int departmentId, CancellationToken ct = default)
            => await db.Employees
                .Where(e => e.DepartmentId == departmentId && e.IsActive)
                .ToListAsync(ct);

        public async Task<List<Employee>> SearchAsync(string query, CancellationToken ct = default)
        {
            var s = query.ToLower();
            return await db.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .Where(e => e.IsActive && (
                    e.FirstName.ToLower().Contains(s) ||
                    e.LastName.ToLower().Contains(s) ||
                    e.Email.ToLower().Contains(s)))
                .Take(10)
                .ToListAsync(ct);
        }
    }

    // ── Department Repository ─────────────────────────────────────
    public class DepartmentRepository(AppDbContext db) : IDepartmentRepository
    {
        public async Task<List<Department>> GetAllAsync(CancellationToken ct = default)
            => await db.Departments
                .Include(d => d.Employees)
                .OrderBy(d => d.Name)
                .ToListAsync(ct);

        public async Task<Department?> GetByIdAsync(int id, CancellationToken ct = default)
            => await db.Departments
                .Include(d => d.Employees)
                .FirstOrDefaultAsync(d => d.Id == id, ct);

        public async Task<Department> CreateAsync(Department department, CancellationToken ct = default)
        {
            db.Departments.Add(department);
            await db.SaveChangesAsync(ct);
            return department;
        }

        public async Task<Department> UpdateAsync(Department department, CancellationToken ct = default)
        {
            db.Departments.Update(department);
            await db.SaveChangesAsync(ct);
            return department;
        }
    }

    // ── Designation Repository ────────────────────────────────────
    public class DesignationRepository(AppDbContext db) : IDesignationRepository
    {
        public async Task<List<Designation>> GetAllAsync(CancellationToken ct = default)
            => await db.Designations
                .Include(d => d.Employees)
                .OrderBy(d => d.Title)
                .ToListAsync(ct);

        public async Task<Designation?> GetByIdAsync(int id, CancellationToken ct = default)
            => await db.Designations.FindAsync([id], ct);

        public async Task<Designation> CreateAsync(Designation designation, CancellationToken ct = default)
        {
            db.Designations.Add(designation);
            await db.SaveChangesAsync(ct);
            return designation;
        }
    }

    // ── Project Repository ────────────────────────────────────────
    public class ProjectRepository(AppDbContext db) : IProjectRepository
    {
        public async Task<PagedResult<Project>> GetPagedAsync(
            PagedQuery query, string? status = null, CancellationToken ct = default)
        {
            var q = db.Projects
                .Include(p => p.ProjectEmployees)
                .Include(p => p.Tasks)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                q = q.Where(p => p.Status.ToString() == status);

            if (!string.IsNullOrWhiteSpace(query.Search))
                q = q.Where(p => p.Name.ToLower().Contains(query.Search.ToLower()));

            var total = await q.CountAsync(ct);
            var items = await q
                .OrderByDescending(p => p.CreatedAt)
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync(ct);

            return new PagedResult<Project>(items, total, query.Page, query.PageSize);
        }

        public async Task<Project?> GetByIdAsync(int id, CancellationToken ct = default)
            => await db.Projects
                .Include(p => p.ProjectEmployees)
                    .ThenInclude(pe => pe.Employee)
                        .ThenInclude(e => e.Designation)
                .Include(p => p.Tasks)
                    .ThenInclude(t => t.AssignedTo)
                .FirstOrDefaultAsync(p => p.Id == id, ct);

        public async Task<Project> CreateAsync(Project project, CancellationToken ct = default)
        {
            db.Projects.Add(project);
            await db.SaveChangesAsync(ct);
            return project;
        }

        public async Task<Project> UpdateAsync(Project project, CancellationToken ct = default)
        {
            project.UpdatedAt = DateTime.UtcNow;
            db.Projects.Update(project);
            await db.SaveChangesAsync(ct);
            return project;
        }

        public async Task DeleteAsync(int id, CancellationToken ct = default)
        {
            var project = await db.Projects.FindAsync([id], ct);
            if (project is not null)
            {
                db.Projects.Remove(project);
                await db.SaveChangesAsync(ct);
            }
        }

        public async Task AddMemberAsync(int projectId, int employeeId, string role = "Member", CancellationToken ct = default)
        {
            var exists = await db.ProjectEmployees
                .AnyAsync(pe => pe.ProjectId == projectId && pe.EmployeeId == employeeId, ct);

            if (!exists)
            {
                db.ProjectEmployees.Add(new ProjectEmployee
                {
                    ProjectId = projectId,
                    EmployeeId = employeeId,
                    Role = role
                });
                await db.SaveChangesAsync(ct);
            }
        }

        public async Task RemoveMemberAsync(int projectId, int employeeId, CancellationToken ct = default)
        {
            var pe = await db.ProjectEmployees
                .FindAsync([projectId, employeeId], ct);
            if (pe is not null)
            {
                db.ProjectEmployees.Remove(pe);
                await db.SaveChangesAsync(ct);
            }
        }

        public async Task<List<Project>> GetByEmployeeAsync(int employeeId, CancellationToken ct = default)
            => await db.Projects
                .Include(p => p.Tasks)
                .Where(p => p.ProjectEmployees.Any(pe => pe.EmployeeId == employeeId))
                .ToListAsync(ct);
    }

    // ── Task Repository ───────────────────────────────────────────
    public class TaskRepository(AppDbContext db) : ITaskRepository
    {
        public async Task<List<TaskItem>> GetByProjectAsync(int projectId, CancellationToken ct = default)
            => await db.Tasks
                .Include(t => t.AssignedTo)
                .Where(t => t.ProjectId == projectId)
                .OrderBy(t => t.Status)
                .ThenBy(t => t.Priority)
                .ToListAsync(ct);

        public async Task<TaskItem?> GetByIdAsync(int id, CancellationToken ct = default)
            => await db.Tasks
                .Include(t => t.AssignedTo)
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id, ct);

        public async Task<TaskItem> CreateAsync(TaskItem task, CancellationToken ct = default)
        {
            db.Tasks.Add(task);
            await db.SaveChangesAsync(ct);
            return task;
        }

        public async Task<TaskItem> UpdateAsync(TaskItem task, CancellationToken ct = default)
        {
            task.UpdatedAt = DateTime.UtcNow;
            db.Tasks.Update(task);
            await db.SaveChangesAsync(ct);
            return task;
        }

        public async Task DeleteAsync(int id, CancellationToken ct = default)
        {
            var task = await db.Tasks.FindAsync([id], ct);
            if (task is not null)
            {
                db.Tasks.Remove(task);
                await db.SaveChangesAsync(ct);
            }
        }

        public async Task<List<TaskItem>> GetByAssigneeAsync(int employeeId, CancellationToken ct = default)
            => await db.Tasks
                .Include(t => t.Project)
                .Where(t => t.AssignedToId == employeeId)
                .ToListAsync(ct);
    }
}

