using WorkforceAPI.src.Infrastructure.MongoDB;
using Microsoft.EntityFrameworkCore;
using WorkforceAPI.src.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace WorkforceAPI.src.Infrastructure.Persistence
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var db = services.GetRequiredService<AppDbContext>();
            var mongo = services.GetRequiredService<MongoDbContext>();

            // Seed default admin user
            if (!await db.Users.AnyAsync())
            {
                var hasher = new PasswordHasher<AppUser>();
                var admin = new AppUser
                {
                    Username = "admin",
                    Email = "admin@workforce.com",
                    Role = "Admin",
                    IsActive = true
                };
                admin.PasswordHash = hasher.HashPassword(admin, "Admin@123");
                db.Users.Add(admin);
                await db.SaveChangesAsync();
            }
            // Already seeded — skip
            if (await db.Departments.AnyAsync()) return;

            // ── Departments ───────────────────────────────────────
            var departments = new List<Department>
        {
            new() { Name = "Engineering",      Description = "Software development",         HeadOf = "Alice Chen"    },
            new() { Name = "Product",          Description = "Product management",           HeadOf = "Bob Martinez"  },
            new() { Name = "Design",           Description = "UX/UI design",                HeadOf = "Carol White"   },
            new() { Name = "Marketing",        Description = "Growth and marketing",         HeadOf = "David Kim"     },
            new() { Name = "Sales",            Description = "Enterprise sales",             HeadOf = "Emma Johnson"  },
            new() { Name = "HR",               Description = "Human resources",              HeadOf = "Frank Lee"     },
            new() { Name = "Finance",          Description = "Finance and accounting",       HeadOf = "Grace Park"    },
            new() { Name = "Operations",       Description = "Business operations",          HeadOf = "Henry Brown"   },
            new() { Name = "Customer Success", Description = "Customer support",             HeadOf = "Iris Davis"    },
            new() { Name = "Data",             Description = "Data science and analytics",   HeadOf = "Jack Wilson"   },
        };
            db.Departments.AddRange(departments);
            await db.SaveChangesAsync();

            // ── Designations ──────────────────────────────────────
            var designations = new List<Designation>
        {
            new() { Title = "Junior Engineer",     Level = "L1" },
            new() { Title = "Software Engineer",   Level = "L2" },
            new() { Title = "Senior Engineer",     Level = "L3" },
            new() { Title = "Staff Engineer",      Level = "L4" },
            new() { Title = "Engineering Manager", Level = "M1" },
            new() { Title = "Product Manager",     Level = "L3" },
            new() { Title = "Senior PM",           Level = "L4" },
            new() { Title = "UX Designer",         Level = "L2" },
            new() { Title = "Senior Designer",     Level = "L3" },
            new() { Title = "Marketing Manager",   Level = "L3" },
            new() { Title = "Sales Executive",     Level = "L2" },
            new() { Title = "HR Specialist",       Level = "L2" },
            new() { Title = "Data Analyst",        Level = "L2" },
            new() { Title = "Data Scientist",      Level = "L3" },
            new() { Title = "Account Manager",     Level = "L3" },
        };
            db.Designations.AddRange(designations);
            await db.SaveChangesAsync();

            // ── Employees ─────────────────────────────────────────
            var rng = new Random(42);
            var firstNames = new[] {
            "Alice","Bob","Carol","David","Emma","Frank","Grace","Henry","Iris","Jack",
            "Karen","Liam","Mia","Noah","Olivia","Peter","Quinn","Rachel","Sam","Tina",
            "Uma","Victor","Wendy","Xavier","Yara","Zach","Amy","Ben","Chloe","Dan",
            "Eva","Felix","Gina","Hugo","Isla","Jake","Kira","Leo","Maya","Nate",
            "Opal","Paul","Rosa","Seth","Tara","Ursula","Vince","Willa","Xander","Zoe",
            "Aaron","Bella","Chris","Diana","Ethan","Fiona","George","Hannah","Ivan","Julia"
        };
            var lastNames = new[] {
            "Chen","Martinez","White","Kim","Johnson","Lee","Park","Brown","Davis","Wilson",
            "Taylor","Anderson","Thomas","Jackson","Harris","Martin","Garcia","Jones","Rodriguez","Lewis",
            "Walker","Hall","Allen","Young","King","Wright","Scott","Green","Baker","Adams",
            "Nelson","Carter","Mitchell","Perez","Roberts","Turner","Phillips","Campbell","Parker","Evans",
            "Edwards","Collins","Stewart","Sanchez","Morris","Rogers","Reed","Cook","Morgan","Bell"
        };
            var cities = new[] { "New York", "San Francisco", "Austin", "Seattle", "Chicago", "Boston", "Denver" };

            var skillMap = new Dictionary<int, List<string>>
            {
                [departments[0].Id] = ["C#", ".NET", "Docker", "PostgreSQL", "React", "TypeScript"],
                [departments[1].Id] = ["Roadmapping", "Agile", "Figma", "SQL", "Analytics"],
                [departments[2].Id] = ["Figma", "Adobe XD", "Sketch", "User Research", "Prototyping"],
                [departments[3].Id] = ["SEO", "Google Ads", "HubSpot", "Content Marketing"],
                [departments[4].Id] = ["Salesforce", "Negotiation", "B2B Sales", "CRM"],
                [departments[5].Id] = ["Recruiting", "HRIS", "Performance Management"],
                [departments[6].Id] = ["Excel", "Financial Modeling", "Budgeting", "Forecasting"],
                [departments[7].Id] = ["Process Improvement", "Project Management", "Lean"],
                [departments[8].Id] = ["Zendesk", "Account Management", "Onboarding", "NPS"],
                [departments[9].Id] = ["Python", "SQL", "Tableau", "Machine Learning"],
            };

            var deptPool = new[] {
            departments[0],departments[0],departments[0],departments[0],departments[0],
            departments[0],departments[0],departments[0],departments[0],departments[0],
            departments[1],departments[1],departments[1],departments[2],departments[2],
            departments[3],departments[3],departments[4],departments[4],departments[4],
            departments[5],departments[5],departments[6],departments[6],departments[7],
            departments[7],departments[8],departments[8],departments[9],departments[9],
            departments[0],departments[0],departments[0],departments[0],departments[0],
            departments[1],departments[2],departments[3],departments[4],departments[5],
            departments[9],departments[9],departments[0],departments[0],departments[0],
            departments[1],departments[2],departments[4],departments[7],departments[8],
            departments[0],departments[0],departments[0],departments[1],departments[2],
            departments[3],departments[4],departments[5],departments[9],departments[9],
        };

            var desigPool = new[] {
            designations[2],designations[1],designations[0],designations[3],designations[2],
            designations[1],designations[0],designations[4],designations[5],designations[6],
            designations[5],designations[7],designations[8],designations[9],designations[9],
            designations[10],designations[10],designations[10],designations[11],designations[11],
            designations[12],designations[13],designations[14],designations[14],designations[1],
            designations[2],designations[10],designations[11],designations[12],designations[13],
            designations[2],designations[1],designations[0],designations[3],designations[2],
            designations[5],designations[7],designations[9],designations[10],designations[11],
            designations[12],designations[13],designations[1],designations[2],designations[0],
            designations[5],designations[7],designations[10],designations[14],designations[10],
            designations[3],designations[2],designations[1],designations[6],designations[8],
            designations[9],designations[10],designations[11],designations[12],designations[13],
        };

            var employees = new List<Employee>();
            for (int i = 0; i < 60; i++)
            {
                var dept = deptPool[i];
                var desig = desigPool[i];
                var skills = skillMap.TryGetValue(dept.Id, out var sk)
                    ? sk.OrderBy(_ => rng.Next()).Take(rng.Next(3, 6)).ToList()
                    : new List<string>();

                employees.Add(new Employee
                {
                    FirstName = firstNames[i],
                    LastName = lastNames[i % lastNames.Length],
                    Email = $"{firstNames[i].ToLower()}.{lastNames[i % lastNames.Length].ToLower()}@workforce.com",
                    DepartmentId = dept.Id,
                    DesignationId = desig.Id,
                    Salary = Math.Round((decimal)(50000 + rng.NextDouble() * 100000), 2),
                    JoiningDate = DateTime.UtcNow.AddDays(-rng.Next(30, 1500)),
                    Phone = $"+1-555-{rng.Next(1000, 9999)}",
                    City = cities[rng.Next(cities.Length)],
                    Country = "USA",
                    IsActive = rng.Next(10) > 1,
                    Skills = skills
                });
            }
            db.Employees.AddRange(employees);
            await db.SaveChangesAsync();

            // ── Projects ──────────────────────────────────────────
            var projects = new List<Project>
        {
            new() { Name = "Platform Rewrite",  Description = "Migrate monolith to microservices",   Status = ProjectStatus.Active,    StartDate = DateTime.UtcNow.AddDays(-120) },
            new() { Name = "Mobile App v2",      Description = "New React Native mobile application", Status = ProjectStatus.Active,    StartDate = DateTime.UtcNow.AddDays(-60)  },
            new() { Name = "Data Pipeline",      Description = "Real-time analytics pipeline",        Status = ProjectStatus.Active,    StartDate = DateTime.UtcNow.AddDays(-90)  },
            new() { Name = "Website Redesign",   Description = "Full marketing website overhaul",     Status = ProjectStatus.Completed, StartDate = DateTime.UtcNow.AddDays(-200), EndDate = DateTime.UtcNow.AddDays(-30) },
            new() { Name = "CRM Integration",    Description = "Salesforce and HubSpot integration",  Status = ProjectStatus.OnHold,    StartDate = DateTime.UtcNow.AddDays(-45)  },
            new() { Name = "Security Audit",     Description = "Annual security review",              Status = ProjectStatus.Active,    StartDate = DateTime.UtcNow.AddDays(-15)  },
            new() { Name = "HR Portal",          Description = "Self-service HR portal",              Status = ProjectStatus.Active,    StartDate = DateTime.UtcNow.AddDays(-30)  },
            new() { Name = "AI Features",        Description = "ML-powered recommendations",          Status = ProjectStatus.Active,    StartDate = DateTime.UtcNow.AddDays(-20)  },
        };
            db.Projects.AddRange(projects);
            await db.SaveChangesAsync();

            // Assign team members
            var engEmps = employees.Where(e => e.DepartmentId == departments[0].Id).Take(10).ToList();
            var datEmps = employees.Where(e => e.DepartmentId == departments[9].Id).ToList();
            var desEmps = employees.Where(e => e.DepartmentId == departments[2].Id).ToList();
            var mktEmps = employees.Where(e => e.DepartmentId == departments[3].Id).ToList();
            var hrEmps = employees.Where(e => e.DepartmentId == departments[5].Id).ToList();

            var assignments = new List<(Project, List<Employee>)>
        {
            (projects[0], engEmps.Take(5).ToList()),
            (projects[1], engEmps.Skip(2).Take(4).ToList()),
            (projects[2], datEmps.Concat(engEmps.Take(2)).ToList()),
            (projects[3], desEmps.Concat(mktEmps.Take(2)).ToList()),
            (projects[5], engEmps.Take(3).ToList()),
            (projects[6], hrEmps.Concat(engEmps.Take(2)).ToList()),
            (projects[7], engEmps.Take(3).Concat(datEmps.Take(2)).ToList()),
        };

            foreach (var (proj, members) in assignments)
                foreach (var (emp, idx) in members.Select((e, i) => (e, i)))
                    db.ProjectEmployees.Add(new ProjectEmployee
                    {
                        ProjectId = proj.Id,
                        EmployeeId = emp.Id,
                        Role = idx == 0 ? "Lead" : "Member"
                    });

            await db.SaveChangesAsync();

            // ── Tasks ─────────────────────────────────────────────
            var taskTitles = new[] {
            "Set up CI/CD pipeline","Write unit tests","Implement authentication",
            "Design database schema","Create API endpoints","Build frontend components",
            "Code review","Performance optimization","Security review","Documentation",
            "Bug fix: login flow","Feature: export to CSV","Refactor data layer",
            "Deploy to staging","Integration testing","Update dependencies"
        };

            var taskStatuses = Enum.GetValues<Domain.Entities.TaskStatus>();
            var taskPriorities = Enum.GetValues<TaskPriority>();

            foreach (var project in projects.Take(6))
            {
                var memberIds = await db.ProjectEmployees
                    .Where(pe => pe.ProjectId == project.Id)
                    .Select(pe => pe.EmployeeId)
                    .ToListAsync();

                for (int i = 0; i < rng.Next(5, 12); i++)
                {
                    db.Tasks.Add(new TaskItem
                    {
                        Title = taskTitles[rng.Next(taskTitles.Length)],
                        Description = "Task description and acceptance criteria.",
                        ProjectId = project.Id,
                        Status = taskStatuses[rng.Next(taskStatuses.Length)],
                        Priority = taskPriorities[rng.Next(taskPriorities.Length)],
                        DueDate = DateTime.UtcNow.AddDays(rng.Next(-10, 30)),
                        AssignedToId = memberIds.Count > 0 ? memberIds[rng.Next(memberIds.Count)] : null
                    });
                }
            }
            await db.SaveChangesAsync();

            // ── MongoDB: Leave Requests ───────────────────────────
            var leaveTypes = new[] { "Annual", "Sick", "Casual", "Unpaid", "Maternity" };
            var statuses = new[] { "Pending", "Approved", "Rejected", "Cancelled" };
            var leaveList = new List<LeaveRequest>();

            foreach (var emp in employees.Take(50))
            {
                for (int i = 0; i < rng.Next(1, 4); i++)
                {
                    var start = DateTime.UtcNow.AddDays(-rng.Next(5, 180));
                    var days = rng.Next(1, 10);
                    var status = statuses[rng.Next(statuses.Length)];

                    var history = new List<ApprovalHistoryEntry>
                {
                    new() { Status = "Pending", ChangedBy = emp.FullName, ChangedAt = start.AddDays(-1), Comment = "Leave request submitted" }
                };

                    if (status != "Pending")
                        history.Add(new ApprovalHistoryEntry
                        {
                            Status = status,
                            ChangedBy = "HR Manager",
                            ChangedAt = start,
                            Comment = status == "Approved" ? "Approved. Enjoy your leave!" : "Rejected due to project deadline."
                        });

                    leaveList.Add(new LeaveRequest
                    {
                        EmployeeId = emp.Id,
                        EmployeeName = emp.FullName,
                        LeaveType = leaveTypes[rng.Next(leaveTypes.Length)],
                        StartDate = start,
                        EndDate = start.AddDays(days),
                        Status = status,
                        Reason = "Personal reasons",
                        ApprovalHistory = history,
                        CreatedAt = start.AddDays(-1)
                    });
                }
            }

            await mongo.LeaveRequests.InsertManyAsync(leaveList);
        }
    }
}
