// ─── Employee Domain ───────────────────────────────────────────────────────

export interface Department {
  id: number
  name: string
  headCount: number
}

export interface Designation {
  id: number
  name: string
  level: number
}

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  departmentId: number
  department: Department
  designationId: number
  designation: Designation
  salary: number
  joiningDate: string
  phone?: string
  address?: string
  city?: string
  country?: string
  skills: string[]
  avatarUrl?: string
}

export interface EmployeeFilters {
  search?: string
  departmentId?: number
  isActive?: boolean
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ─── Project Domain ────────────────────────────────────────────────────────

export type ProjectStatus = 'Active' | 'Completed' | 'OnHold' | 'Planning'

export interface Project {
  id: number
  name: string
  description?: string
  status: ProjectStatus
  startDate: string
  endDate?: string
  teamMembers: Employee[]
  taskCount: number
  completedTaskCount: number
}

export type TaskStatus = 'Todo' | 'InProgress' | 'InReview' | 'Done' | 'Blocked'
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface Task {
  id: number
  projectId: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  assignedEmployeeId?: number
  assignedEmployee?: Employee
  createdAt: string
  updatedAt: string
}

// ─── Leave Domain ─────────────────────────────────────────────────────────

export type LeaveType = 'Sick' | 'Casual' | 'Annual' | 'Unpaid' | 'Maternity' | 'Paternity'
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'

export interface ApprovalHistoryEntry {
  status: LeaveStatus
  changedBy: string
  changedAt: string
  comment?: string
}

export interface LeaveRequest {
  _id: string
  employeeId: number
  employeeName: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  status: LeaveStatus
  reason?: string
  approvalHistory: ApprovalHistoryEntry[]
}

// ─── Audit & Reports ──────────────────────────────────────────────────────

export interface AuditLog {
  _id: string
  eventType: string
  entityType: 'Employee' | 'Project' | 'Task' | 'LeaveRequest'
  entityId: string
  actor: string
  timestamp: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
}

export interface DepartmentStat {
  departmentId: number
  departmentName: string
  headCount: number
  activeProjects: number
  avgSalary: number
}

export interface ProjectStat {
  projectId: number
  projectName: string
  status: ProjectStatus
  progress: number
  teamSize: number
  daysRemaining?: number
}

export interface LeaveStat {
  totalPending: number
  totalApproved: number
  totalRejected: number
  byType: { type: LeaveType; count: number }[]
}

export interface SummaryReport {
  generatedAt: string
  totalEmployees: number
  activeEmployees: number
  totalProjects: number
  activeProjects: number
  departmentStats: DepartmentStat[]
  projectStats: ProjectStat[]
  leaveStats: LeaveStat[]
  recentActivity: AuditLog[]
}

// ─── UI State ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: string
}
