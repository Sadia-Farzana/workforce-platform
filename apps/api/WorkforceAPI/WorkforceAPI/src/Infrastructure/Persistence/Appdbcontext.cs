using Microsoft.EntityFrameworkCore;
using WorkforceAPI.src.Domain.Entities;

namespace WorkforceAPI.src.Infrastructure.Persistence
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<Department> Departments => Set<Department>();
        public DbSet<Designation> Designations => Set<Designation>();
        public DbSet<Project> Projects => Set<Project>();
        public DbSet<ProjectEmployee> ProjectEmployees => Set<ProjectEmployee>();
        public DbSet<TaskItem> Tasks => Set<TaskItem>();

        protected override void OnModelCreating(ModelBuilder mb)
        {
            base.OnModelCreating(mb);

            // ── Employee ──────────────────────────────────────────
            mb.Entity<Employee>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Email).IsRequired().HasMaxLength(255);
                e.HasIndex(x => x.Email).IsUnique();
                e.Property(x => x.FirstName).IsRequired().HasMaxLength(100);
                e.Property(x => x.LastName).IsRequired().HasMaxLength(100);
                e.Property(x => x.Salary).HasColumnType("decimal(18,2)");
                e.Property(x => x.Skills).HasColumnType("jsonb");

                e.HasOne(x => x.Department)
                 .WithMany(d => d.Employees)
                 .HasForeignKey(x => x.DepartmentId)
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.Designation)
                 .WithMany(d => d.Employees)
                 .HasForeignKey(x => x.DesignationId)
                 .OnDelete(DeleteBehavior.Restrict);

                // Ignore computed property
                e.Ignore(x => x.FullName);
            });

            // ── Department ────────────────────────────────────────
            mb.Entity<Department>(d =>
            {
                d.HasKey(x => x.Id);
                d.Property(x => x.Name).IsRequired().HasMaxLength(100);
            });

            // ── Designation ───────────────────────────────────────
            mb.Entity<Designation>(d =>
            {
                d.HasKey(x => x.Id);
                d.Property(x => x.Title).IsRequired().HasMaxLength(100);
            });

            // ── Project ───────────────────────────────────────────
            mb.Entity<Project>(p =>
            {
                p.HasKey(x => x.Id);
                p.Property(x => x.Name).IsRequired().HasMaxLength(200);
                p.Property(x => x.Status).HasConversion<string>();

                // Ignore computed properties
                p.Ignore(x => x.TeamSize);
                p.Ignore(x => x.CompletedTasks);
                p.Ignore(x => x.TotalTasks);
                p.Ignore(x => x.Progress);
            });

            // ── ProjectEmployee (M2M) ─────────────────────────────
            mb.Entity<ProjectEmployee>(pe =>
            {
                pe.HasKey(x => new { x.ProjectId, x.EmployeeId });

                pe.HasOne(x => x.Project)
                  .WithMany(p => p.ProjectEmployees)
                  .HasForeignKey(x => x.ProjectId);

                pe.HasOne(x => x.Employee)
                  .WithMany(e => e.ProjectEmployees)
                  .HasForeignKey(x => x.EmployeeId);
            });

            // ── TaskItem ──────────────────────────────────────────
            mb.Entity<TaskItem>(t =>
            {
                t.HasKey(x => x.Id);
                t.Property(x => x.Title).IsRequired().HasMaxLength(300);
                t.Property(x => x.Status).HasConversion<string>();
                t.Property(x => x.Priority).HasConversion<string>();

                t.HasOne(x => x.Project)
                 .WithMany(p => p.Tasks)
                 .HasForeignKey(x => x.ProjectId)
                 .OnDelete(DeleteBehavior.Cascade);

                t.HasOne(x => x.AssignedTo)
                 .WithMany(e => e.AssignedTasks)
                 .HasForeignKey(x => x.AssignedToId)
                 .IsRequired(false)
                 .OnDelete(DeleteBehavior.SetNull);
            });
        }
    }
}