import type {
  Department,
  Designation,
  Employee,
  Project,
  Task,
  LeaveRequest,
  AuditLog,
  SummaryReport,
} from '@/types'

export const DEPARTMENTS: Department[] = [
  { id: 1, name: 'Engineering', headCount: 18 },
  { id: 2, name: 'Product', headCount: 7 },
  { id: 3, name: 'Design', headCount: 5 },
  { id: 4, name: 'Marketing', headCount: 6 },
  { id: 5, name: 'Finance', headCount: 4 },
  { id: 6, name: 'HR', headCount: 3 },
  { id: 7, name: 'Operations', headCount: 7 },
]

export const DESIGNATIONS: Designation[] = [
  { id: 1, name: 'Intern', level: 1 },
  { id: 2, name: 'Junior Engineer', level: 2 },
  { id: 3, name: 'Software Engineer', level: 3 },
  { id: 4, name: 'Senior Engineer', level: 4 },
  { id: 5, name: 'Staff Engineer', level: 5 },
  { id: 6, name: 'Engineering Manager', level: 6 },
  { id: 7, name: 'Product Manager', level: 4 },
  { id: 8, name: 'Senior PM', level: 5 },
  { id: 9, name: 'Designer', level: 3 },
  { id: 10, name: 'Senior Designer', level: 4 },
  { id: 11, name: 'Marketing Analyst', level: 2 },
  { id: 12, name: 'Finance Analyst', level: 3 },
  { id: 13, name: 'HR Specialist', level: 3 },
  { id: 14, name: 'Director', level: 7 },
]

const dept = (id: number) => DEPARTMENTS.find((d) => d.id === id)!
const desig = (id: number) => DESIGNATIONS.find((d) => d.id === id)!

export const EMPLOYEES: Employee[] = [
  {
    id: 1, firstName: 'Aiden', lastName: 'Clarke', email: 'aiden.clarke@company.com',
    isActive: true, departmentId: 1, department: dept(1), designationId: 4, designation: desig(4),
    salary: 9200, joiningDate: '2021-03-15', phone: '+1 555 0101', city: 'San Francisco', country: 'USA',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aiden',
  },
  {
    id: 2, firstName: 'Sophia', lastName: 'Nguyen', email: 'sophia.nguyen@company.com',
    isActive: true, departmentId: 1, department: dept(1), designationId: 5, designation: desig(5),
    salary: 12500, joiningDate: '2019-07-01', phone: '+1 555 0102', city: 'New York', country: 'USA',
    skills: ['.NET', 'C#', 'Azure', 'Kubernetes', 'Docker'],
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sophia',
  },
  {
    id: 3, firstName: 'Marcus', lastName: 'Osei', email: 'marcus.osei@company.com',
    isActive: true, departmentId: 2, department: dept(2), designationId: 7, designation: desig(7),
    salary: 10800, joiningDate: '2020-11-10', city: 'Austin', country: 'USA',
    skills: ['Product Strategy', 'Agile', 'SQL', 'Figma'],
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus',
  },
  {
    id: 4, firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@company.com',
    isActive: true, departmentId: 3, department: dept(3), designationId: 10, designation: desig(10),
    salary: 8700, joiningDate: '2022-01-20', city: 'Seattle', country: 'USA',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems'],
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya',
  },
  {
    id: 5, firstName: 'Daniel', lastName: 'Kim', email: 'daniel.kim@company.com',
    isActive: true, departmentId: 1, department: dept(1), designationId: 3, designation: desig(3),
    salary: 7400, joiningDate: '2023-02-01', city: 'Los Angeles', country: 'USA',
    skills: ['Python', 'FastAPI', 'MongoDB', 'Redis'],
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Daniel',
  },
  {
    id: 6, firstName: 'Elena', lastName: 'Volkov', email: 'elena.volkov@company.com',
    isActive: false, departmentId: 1, department: dept(1), designationId: 3, designation: desig(3),
    salary: 7100, joiningDate: '2022-06-15', city: 'Boston', country: 'USA',
    skills: ['Vue.js', 'GraphQL', 'CSS'],
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Elena',
  },
  {
    id: 7, firstName: 'James', lastName: 'Okafor', email: 'james.okafor@company.com',
    isActive: true, departmentId: 4, department: dept(4), designationId: 11, designation: desig(11),
    salary: 6200, joiningDate: '2023-05-10', city: 'Chicago', country: 'USA',
    skills: ['SEO', 'Content Strategy', 'Analytics', 'HubSpot'],
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=James',
  },
  {
    id: 8, firstName: 'Yuki', lastName: 'Tanaka', email: 'yuki.tanaka@company.com',
    isActive: true, departmentId: 1, department: dept(1), designationId: 6, designation: desig(6),
    salary: 15000, joiningDate: '2018-04-01', city: 'San Francisco', country: 'USA',
    skills: ['Architecture', 'Leadership', 'Go', 'Microservices'],
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Yuki',
  },
  {
    id: 9, firstName: 'Amara', lastName: 'Diallo', email: 'amara.diallo@company.com',
    isActive: true, departmentId: 5, department: dept(5), designationId: 12, designation: desig(12),
    salary: 7800, joiningDate: '2021-09-01', city: 'Miami', country: 'USA',
    skills: ['Financial Modeling', 'Excel', 'SQL', 'Tableau'],
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Amara',
  },
  {
    id: 10, firstName: 'Lucas', lastName: 'Ferreira', email: 'lucas.ferreira@company.com',
    isActive: true, departmentId: 1, department: dept(1), designationId: 4, designation: desig(4),
    salary: 9500, joiningDate: '2020-08-15', city: 'Austin', country: 'USA',
    skills: ['React', '.NET', 'SQL Server', 'Azure DevOps'],
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Lucas',
  },
]

export const PROJECTS: Project[] = [
  {
    id: 1, name: 'Workforce Portal v2', description: 'Next-gen HR platform with AI-assisted features',
    status: 'Active', startDate: '2024-01-10', endDate: '2024-12-31',
    teamMembers: [EMPLOYEES[0], EMPLOYEES[1], EMPLOYEES[3]],
    taskCount: 24, completedTaskCount: 17,
  },
  {
    id: 2, name: 'Analytics Dashboard', description: 'Real-time business intelligence dashboard',
    status: 'Active', startDate: '2024-03-01',
    teamMembers: [EMPLOYEES[1], EMPLOYEES[4], EMPLOYEES[7]],
    taskCount: 18, completedTaskCount: 9,
  },
  {
    id: 3, name: 'Mobile App Redesign', description: 'Full UX overhaul for iOS and Android apps',
    status: 'Planning', startDate: '2024-06-01', endDate: '2025-03-31',
    teamMembers: [EMPLOYEES[2], EMPLOYEES[3]],
    taskCount: 12, completedTaskCount: 2,
  },
  {
    id: 4, name: 'Data Migration Pipeline', description: 'Legacy system data migration to cloud',
    status: 'Completed', startDate: '2023-09-01', endDate: '2024-02-28',
    teamMembers: [EMPLOYEES[1], EMPLOYEES[4], EMPLOYEES[9]],
    taskCount: 31, completedTaskCount: 31,
  },
  {
    id: 5, name: 'Customer Portal', description: 'Self-service portal for enterprise customers',
    status: 'OnHold', startDate: '2024-02-15', endDate: '2024-10-15',
    teamMembers: [EMPLOYEES[0], EMPLOYEES[7]],
    taskCount: 20, completedTaskCount: 7,
  },
]

export const TASKS: Task[] = [
  // Workforce Portal v2 (projectId: 1)
  { id: 1,  projectId: 1, title: 'Set up monorepo structure',       description: 'Initialize Nx workspace with apps and libs',              status: 'Done',       priority: 'High',     dueDate: '2024-02-01', assignedEmployeeId: 1, assignedEmployee: EMPLOYEES[0], createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-20T14:00:00Z' },
  { id: 2,  projectId: 1, title: 'Design system tokens',            description: 'Define color, typography and spacing tokens in Figma',   status: 'Done',       priority: 'Medium',   dueDate: '2024-02-15', assignedEmployeeId: 4, assignedEmployee: EMPLOYEES[3], createdAt: '2024-01-11T09:00:00Z', updatedAt: '2024-01-25T10:00:00Z' },
  { id: 3,  projectId: 1, title: 'Auth service integration',        description: 'Integrate Auth0 for SSO and JWT refresh',                status: 'Done',       priority: 'Critical', dueDate: '2024-03-01', assignedEmployeeId: 2, assignedEmployee: EMPLOYEES[1], createdAt: '2024-01-15T09:00:00Z', updatedAt: '2024-02-28T16:00:00Z' },
  { id: 4,  projectId: 1, title: 'Employee list API',               description: 'Build paginated REST endpoint for employees',            status: 'Done',       priority: 'High',     dueDate: '2024-03-15', assignedEmployeeId: 1, assignedEmployee: EMPLOYEES[0], createdAt: '2024-02-01T09:00:00Z', updatedAt: '2024-03-10T11:00:00Z' },
  { id: 5,  projectId: 1, title: 'Dashboard charts',                description: 'Implement Recharts-based KPI dashboard',                 status: 'Done',       priority: 'Medium',   dueDate: '2024-04-01', assignedEmployeeId: 1, assignedEmployee: EMPLOYEES[0], createdAt: '2024-03-01T09:00:00Z', updatedAt: '2024-03-28T15:00:00Z' },
  { id: 6,  projectId: 1, title: 'Leave approval workflow',         description: 'Build approve/reject flow with embedded history',        status: 'InProgress', priority: 'High',     dueDate: '2024-12-20', assignedEmployeeId: 2, assignedEmployee: EMPLOYEES[1], createdAt: '2024-11-01T09:00:00Z', updatedAt: '2024-12-05T09:00:00Z' },
  { id: 7,  projectId: 1, title: 'Notification system',             description: 'Real-time push notifications for leave events',          status: 'InProgress', priority: 'Medium',   dueDate: '2024-12-25', assignedEmployeeId: 10,assignedEmployee: EMPLOYEES[9], createdAt: '2024-11-15T09:00:00Z', updatedAt: '2024-12-08T09:00:00Z' },
  { id: 8,  projectId: 1, title: 'E2E test suite',                  description: 'Playwright tests for critical user flows',               status: 'InReview',   priority: 'Medium',   dueDate: '2024-12-28', assignedEmployeeId: 1, assignedEmployee: EMPLOYEES[0], createdAt: '2024-11-20T09:00:00Z', updatedAt: '2024-12-10T14:00:00Z' },
  { id: 9,  projectId: 1, title: 'Performance audit',               description: 'Lighthouse audit + bundle size optimization',            status: 'Todo',       priority: 'Low',      dueDate: '2025-01-10', assignedEmployeeId: 10,assignedEmployee: EMPLOYEES[9], createdAt: '2024-12-01T09:00:00Z', updatedAt: '2024-12-01T09:00:00Z' },
  { id: 10, projectId: 1, title: 'Accessibility pass',              description: 'WCAG 2.1 AA audit and remediation',                     status: 'Todo',       priority: 'Medium',   dueDate: '2025-01-15', assignedEmployeeId: 4, assignedEmployee: EMPLOYEES[3], createdAt: '2024-12-01T09:00:00Z', updatedAt: '2024-12-01T09:00:00Z' },
  { id: 11, projectId: 1, title: 'Docker Compose setup',            description: 'Multi-container orchestration with health checks',       status: 'Blocked',    priority: 'Critical', dueDate: '2024-12-15', assignedEmployeeId: 2, assignedEmployee: EMPLOYEES[1], createdAt: '2024-11-25T09:00:00Z', updatedAt: '2024-12-12T09:00:00Z' },

  // Analytics Dashboard (projectId: 2)
  { id: 12, projectId: 2, title: 'Data ingestion pipeline',         description: 'Kafka → ClickHouse streaming pipeline',                 status: 'Done',       priority: 'Critical', dueDate: '2024-04-15', assignedEmployeeId: 2, assignedEmployee: EMPLOYEES[1], createdAt: '2024-03-01T09:00:00Z', updatedAt: '2024-04-10T09:00:00Z' },
  { id: 13, projectId: 2, title: 'Chart component library',         description: 'Reusable D3 + Recharts components',                     status: 'Done',       priority: 'High',     dueDate: '2024-05-01', assignedEmployeeId: 5, assignedEmployee: EMPLOYEES[4], createdAt: '2024-03-15T09:00:00Z', updatedAt: '2024-04-28T09:00:00Z' },
  { id: 14, projectId: 2, title: 'Real-time WebSocket feed',        description: 'Live metric updates via WebSocket',                     status: 'InProgress', priority: 'High',     dueDate: '2024-12-30', assignedEmployeeId: 8, assignedEmployee: EMPLOYEES[7], createdAt: '2024-11-01T09:00:00Z', updatedAt: '2024-12-07T09:00:00Z' },
  { id: 15, projectId: 2, title: 'Custom date range picker',        description: 'Filterable date range for all chart views',             status: 'InReview',   priority: 'Medium',   dueDate: '2024-12-22', assignedEmployeeId: 5, assignedEmployee: EMPLOYEES[4], createdAt: '2024-11-20T09:00:00Z', updatedAt: '2024-12-11T09:00:00Z' },
  { id: 16, projectId: 2, title: 'Export to PDF/CSV',               description: 'Report export functionality',                           status: 'Todo',       priority: 'Low',      dueDate: '2025-01-20', assignedEmployeeId: 2, assignedEmployee: EMPLOYEES[1], createdAt: '2024-12-01T09:00:00Z', updatedAt: '2024-12-01T09:00:00Z' },
  { id: 17, projectId: 2, title: 'Alert threshold config',          description: 'User-configurable metric alert thresholds',             status: 'Todo',       priority: 'Medium',   dueDate: '2025-02-01', assignedEmployeeId: 8, assignedEmployee: EMPLOYEES[7], createdAt: '2024-12-01T09:00:00Z', updatedAt: '2024-12-01T09:00:00Z' },
  { id: 18, projectId: 2, title: 'Mobile responsive layout',        description: 'Adapt dashboard for tablet and mobile viewports',       status: 'Blocked',    priority: 'Medium',   dueDate: '2024-12-20', assignedEmployeeId: 5, assignedEmployee: EMPLOYEES[4], createdAt: '2024-11-15T09:00:00Z', updatedAt: '2024-12-09T09:00:00Z' },

  // Mobile App Redesign (projectId: 3)
  { id: 19, projectId: 3, title: 'User research synthesis',         description: 'Consolidate findings from 20 user interviews',          status: 'Done',       priority: 'High',     dueDate: '2024-07-15', assignedEmployeeId: 3, assignedEmployee: EMPLOYEES[2], createdAt: '2024-06-01T09:00:00Z', updatedAt: '2024-07-12T09:00:00Z' },
  { id: 20, projectId: 3, title: 'Information architecture',        description: 'New IA and navigation structure',                       status: 'Done',       priority: 'High',     dueDate: '2024-08-01', assignedEmployeeId: 4, assignedEmployee: EMPLOYEES[3], createdAt: '2024-07-01T09:00:00Z', updatedAt: '2024-07-30T09:00:00Z' },
  { id: 21, projectId: 3, title: 'Hi-fi wireframes — Onboarding',   description: 'Figma wireframes for new onboarding flow',              status: 'InProgress', priority: 'High',     dueDate: '2024-12-20', assignedEmployeeId: 4, assignedEmployee: EMPLOYEES[3], createdAt: '2024-11-01T09:00:00Z', updatedAt: '2024-12-06T09:00:00Z' },
  { id: 22, projectId: 3, title: 'Component audit',                 description: 'Identify reusable components from old design',          status: 'Todo',       priority: 'Medium',   dueDate: '2025-01-10', assignedEmployeeId: 3, assignedEmployee: EMPLOYEES[2], createdAt: '2024-12-01T09:00:00Z', updatedAt: '2024-12-01T09:00:00Z' },
  { id: 23, projectId: 3, title: 'Prototype testing round 1',       description: 'Usability testing with 10 participants',                status: 'Todo',       priority: 'High',     dueDate: '2025-02-15', assignedEmployeeId: 3, assignedEmployee: EMPLOYEES[2], createdAt: '2024-12-01T09:00:00Z', updatedAt: '2024-12-01T09:00:00Z' },
]

export const LEAVE_REQUESTS: LeaveRequest[] = [
  {
    _id: 'lr001', employeeId: 1, employeeName: 'Aiden Clarke',
    leaveType: 'Annual', startDate: '2024-12-23', endDate: '2024-12-27',
    status: 'Approved', reason: 'Holiday vacation with family',
    approvalHistory: [
      { status: 'Pending',  changedBy: 'System',      changedAt: '2024-12-10T09:00:00Z' },
      { status: 'Approved', changedBy: 'Yuki Tanaka', changedAt: '2024-12-11T14:30:00Z', comment: 'Approved. Enjoy your break!' },
    ],
  },
  {
    _id: 'lr002', employeeId: 3, employeeName: 'Marcus Osei',
    leaveType: 'Sick', startDate: '2024-11-18', endDate: '2024-11-19',
    status: 'Approved', reason: 'Flu and fever',
    approvalHistory: [
      { status: 'Pending',  changedBy: 'System',   changedAt: '2024-11-18T08:00:00Z' },
      { status: 'Approved', changedBy: 'HR Admin', changedAt: '2024-11-18T09:15:00Z', comment: 'Get well soon.' },
    ],
  },
  {
    _id: 'lr003', employeeId: 5, employeeName: 'Daniel Kim',
    leaveType: 'Casual', startDate: '2024-12-30', endDate: '2024-12-31',
    status: 'Pending', reason: 'Personal errands before New Year',
    approvalHistory: [
      { status: 'Pending', changedBy: 'System', changedAt: '2024-12-15T10:00:00Z' },
    ],
  },
  {
    _id: 'lr004', employeeId: 7, employeeName: 'James Okafor',
    leaveType: 'Annual', startDate: '2025-01-06', endDate: '2025-01-10',
    status: 'Pending', reason: 'Family visit — parents from Lagos',
    approvalHistory: [
      { status: 'Pending', changedBy: 'System', changedAt: '2024-12-20T11:00:00Z' },
    ],
  },
  {
    _id: 'lr005', employeeId: 4, employeeName: 'Priya Sharma',
    leaveType: 'Casual', startDate: '2024-11-01', endDate: '2024-11-01',
    status: 'Rejected', reason: 'Personal appointment',
    approvalHistory: [
      { status: 'Pending',  changedBy: 'System',   changedAt: '2024-10-28T09:00:00Z' },
      { status: 'Rejected', changedBy: 'HR Admin', changedAt: '2024-10-29T10:00:00Z', comment: 'Critical sprint week, please reschedule.' },
    ],
  },
  {
    _id: 'lr006', employeeId: 2, employeeName: 'Sophia Nguyen',
    leaveType: 'Maternity', startDate: '2025-02-01', endDate: '2025-04-30',
    status: 'Approved', reason: 'Maternity leave',
    approvalHistory: [
      { status: 'Pending',  changedBy: 'System',      changedAt: '2025-01-05T09:00:00Z' },
      { status: 'Approved', changedBy: 'Yuki Tanaka', changedAt: '2025-01-06T10:00:00Z', comment: 'Congratulations! Approved as per policy.' },
    ],
  },
  {
    _id: 'lr007', employeeId: 8, employeeName: 'Yuki Tanaka',
    leaveType: 'Annual', startDate: '2024-12-28', endDate: '2024-12-29',
    status: 'Pending', reason: 'Year-end personal time',
    approvalHistory: [
      { status: 'Pending', changedBy: 'System', changedAt: '2024-12-18T09:00:00Z' },
    ],
  },
  {
    _id: 'lr008', employeeId: 10, employeeName: 'Lucas Ferreira',
    leaveType: 'Sick', startDate: '2024-12-05', endDate: '2024-12-06',
    status: 'Approved', reason: 'Dental surgery recovery',
    approvalHistory: [
      { status: 'Pending',  changedBy: 'System',   changedAt: '2024-12-04T08:00:00Z' },
      { status: 'Approved', changedBy: 'HR Admin', changedAt: '2024-12-04T09:30:00Z' },
    ],
  },
  {
    _id: 'lr009', employeeId: 9, employeeName: 'Amara Diallo',
    leaveType: 'Unpaid', startDate: '2025-01-15', endDate: '2025-01-17',
    status: 'Pending', reason: 'Attending a family ceremony abroad',
    approvalHistory: [
      { status: 'Pending', changedBy: 'System', changedAt: '2024-12-22T11:00:00Z' },
    ],
  },
  {
    _id: 'lr010', employeeId: 1, employeeName: 'Aiden Clarke',
    leaveType: 'Sick', startDate: '2024-10-14', endDate: '2024-10-14',
    status: 'Approved', reason: 'Migraine',
    approvalHistory: [
      { status: 'Pending',  changedBy: 'System',      changedAt: '2024-10-14T07:30:00Z' },
      { status: 'Approved', changedBy: 'Yuki Tanaka', changedAt: '2024-10-14T08:15:00Z' },
    ],
  },
  {
    _id: 'lr011', employeeId: 6, employeeName: 'Elena Volkov',
    leaveType: 'Casual', startDate: '2024-09-20', endDate: '2024-09-20',
    status: 'Cancelled', reason: 'Moving apartment',
    approvalHistory: [
      { status: 'Pending',   changedBy: 'System',       changedAt: '2024-09-15T09:00:00Z' },
      { status: 'Cancelled', changedBy: 'Elena Volkov', changedAt: '2024-09-18T10:00:00Z', comment: 'No longer needed.' },
    ],
  },
]

export const AUDIT_LOGS: AuditLog[] = [
  {
    _id: 'al001', eventType: 'EMPLOYEE_CREATED', entityType: 'Employee', entityId: '10',
    actor: 'hr.admin@company.com', timestamp: '2024-12-15T09:30:00Z',
    after: { firstName: 'Lucas', lastName: 'Ferreira', email: 'lucas.ferreira@company.com' },
  },
  {
    _id: 'al002', eventType: 'LEAVE_APPROVED', entityType: 'LeaveRequest', entityId: 'lr001',
    actor: 'yuki.tanaka@company.com', timestamp: '2024-12-11T14:30:00Z',
    before: { status: 'Pending' }, after: { status: 'Approved' },
  },
  {
    _id: 'al003', eventType: 'PROJECT_STATUS_CHANGED', entityType: 'Project', entityId: '5',
    actor: 'marcus.osei@company.com', timestamp: '2024-12-10T11:00:00Z',
    before: { status: 'Active' }, after: { status: 'OnHold' },
  },
  {
    _id: 'al004', eventType: 'EMPLOYEE_UPDATED', entityType: 'Employee', entityId: '3',
    actor: 'hr.admin@company.com', timestamp: '2024-12-09T15:45:00Z',
    before: { salary: 10200 }, after: { salary: 10800 },
  },
  {
    _id: 'al005', eventType: 'TASK_COMPLETED', entityType: 'Task', entityId: '42',
    actor: 'aiden.clarke@company.com', timestamp: '2024-12-08T17:00:00Z',
    before: { status: 'InProgress' }, after: { status: 'Done' },
  },
  {
    _id: 'al006', eventType: 'LEAVE_SUBMITTED', entityType: 'LeaveRequest', entityId: 'lr004',
    actor: 'james.okafor@company.com', timestamp: '2024-12-07T10:00:00Z',
    after: { leaveType: 'Annual', startDate: '2025-01-06', endDate: '2025-01-10' },
  },
]

export const SUMMARY_REPORT: SummaryReport = {
  generatedAt: new Date().toISOString(),
  totalEmployees: 50,
  activeEmployees: 47,
  totalProjects: 14,
  activeProjects: 6,
  departmentStats: [
    { departmentId: 1, departmentName: 'Engineering', headCount: 18, activeProjects: 3, avgSalary: 9800 },
    { departmentId: 2, departmentName: 'Product', headCount: 7, activeProjects: 2, avgSalary: 10200 },
    { departmentId: 3, departmentName: 'Design', headCount: 5, activeProjects: 2, avgSalary: 8400 },
    { departmentId: 4, departmentName: 'Marketing', headCount: 6, activeProjects: 1, avgSalary: 6500 },
    { departmentId: 5, departmentName: 'Finance', headCount: 4, activeProjects: 0, avgSalary: 8100 },
    { departmentId: 6, departmentName: 'HR', headCount: 3, activeProjects: 0, avgSalary: 6800 },
    { departmentId: 7, departmentName: 'Operations', headCount: 7, activeProjects: 2, avgSalary: 7200 },
  ],
  projectStats: [
    { projectId: 1, projectName: 'Workforce Portal v2', status: 'Active', progress: 71, teamSize: 3, daysRemaining: 45 },
    { projectId: 2, projectName: 'Analytics Dashboard', status: 'Active', progress: 50, teamSize: 3, daysRemaining: 120 },
    { projectId: 3, projectName: 'Mobile App Redesign', status: 'Planning', progress: 17, teamSize: 2, daysRemaining: 380 },
    { projectId: 4, projectName: 'Data Migration Pipeline', status: 'Completed', progress: 100, teamSize: 3 },
    { projectId: 5, projectName: 'Customer Portal', status: 'OnHold', progress: 35, teamSize: 2 },
  ],
  leaveStats: {
    totalPending: 2,
    totalApproved: 18,
    totalRejected: 3,
    byType: [
      { type: 'Annual', count: 12 },
      { type: 'Sick', count: 6 },
      { type: 'Casual', count: 4 },
      { type: 'Unpaid', count: 1 },
    ],
  },
  recentActivity: AUDIT_LOGS,
}
