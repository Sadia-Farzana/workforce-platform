import axios from 'axios'
import type {
  Employee, EmployeeFilters, PaginatedResult,
  Project, Task, LeaveRequest, SummaryReport, AuditLog,
} from '@/types'
import {
  EMPLOYEES, PROJECTS, TASKS, LEAVE_REQUESTS,
  SUMMARY_REPORT, AUDIT_LOGS,
} from './mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// ─── Dashboard ────────────────────────────────────────────────────────────

export const dashboardApi = {
  getSummaryReport: async (): Promise<SummaryReport> => {
    if (USE_MOCK) { await delay(); return SUMMARY_REPORT }
    const { data } = await apiClient.get('/reports/summary')
    return data
  },
  getAuditLogs: async (limit = 20): Promise<AuditLog[]> => {
    if (USE_MOCK) { await delay(200); return AUDIT_LOGS.slice(0, limit) }
    const { data } = await apiClient.get('/audit-logs', { params: { limit } })
    return data
  },
}

// ─── Employees ────────────────────────────────────────────────────────────

export const employeeApi = {
  getAll: async (filters: EmployeeFilters): Promise<PaginatedResult<Employee>> => {
    if (USE_MOCK) {
      await delay()
      let results = [...EMPLOYEES]
      if (filters.search) {
        const q = filters.search.toLowerCase()
        results = results.filter((e) =>
          `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q)
        )
      }
      if (filters.departmentId) {
        results = results.filter((e) => e.departmentId === filters.departmentId)
      }
      if (filters.isActive !== undefined) {
        results = results.filter((e) => e.isActive === filters.isActive)
      }
      const total = results.length
      const start = (filters.page - 1) * filters.pageSize
      return {
        items: results.slice(start, start + filters.pageSize),
        total,
        page: filters.page,
        pageSize: filters.pageSize,
        totalPages: Math.ceil(total / filters.pageSize),
      }
    }
    const { data } = await apiClient.get('/employees', { params: filters })
    return data
  },
  getById: async (id: number): Promise<Employee> => {
    if (USE_MOCK) { await delay(); return EMPLOYEES.find((e) => e.id === id) ?? EMPLOYEES[0] }
    const { data } = await apiClient.get(`/employees/${id}`)
    return data
  },
  create: async (payload: Partial<Employee>): Promise<Employee> => {
    if (USE_MOCK) { await delay(); return { ...EMPLOYEES[0], ...payload, id: Date.now() } as Employee }
    const { data } = await apiClient.post('/employees', payload)
    return data
  },
  update: async (id: number, payload: Partial<Employee>): Promise<Employee> => {
    if (USE_MOCK) { await delay(); return { ...EMPLOYEES[0], ...payload, id } as Employee }
    const { data } = await apiClient.put(`/employees/${id}`, payload)
    return data
  },
  delete: async (id: number): Promise<void> => {
    if (USE_MOCK) { await delay(); return }
    await apiClient.delete(`/employees/${id}`)
  },
}

// ─── Projects ─────────────────────────────────────────────────────────────

export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    if (USE_MOCK) { await delay(); return PROJECTS }
    const { data } = await apiClient.get('/projects')
    return data
  },
  getById: async (id: number): Promise<Project> => {
    if (USE_MOCK) { await delay(); return PROJECTS.find((p) => p.id === id) ?? PROJECTS[0] }
    const { data } = await apiClient.get(`/projects/${id}`)
    return data
  },
  create: async (payload: Partial<Project>): Promise<Project> => {
    if (USE_MOCK) { await delay(); return { ...PROJECTS[0], ...payload, id: Date.now() } as Project }
    const { data } = await apiClient.post('/projects', payload)
    return data
  },
  update: async (id: number, payload: Partial<Project>): Promise<Project> => {
    if (USE_MOCK) { await delay(); return { ...PROJECTS.find(p => p.id === id)!, ...payload } as Project }
    const { data } = await apiClient.put(`/projects/${id}`, payload)
    return data
  },
}

export const taskApi = {
  getByProject: async (projectId: number): Promise<Task[]> => {
    if (USE_MOCK) { await delay(200); return TASKS.filter((t) => t.projectId === projectId) }
    const { data } = await apiClient.get(`/projects/${projectId}/tasks`)
    return data
  },
  create: async (projectId: number, payload: Partial<Task>): Promise<Task> => {
    if (USE_MOCK) { await delay(); return { ...TASKS[0], ...payload, id: Date.now(), projectId } as Task }
    const { data } = await apiClient.post(`/projects/${projectId}/tasks`, payload)
    return data
  },
  update: async (id: number, payload: Partial<Task>): Promise<Task> => {
    if (USE_MOCK) { await delay(); return { ...TASKS.find(t => t.id === id)!, ...payload } as Task }
    const { data } = await apiClient.put(`/tasks/${id}`, payload)
    return data
  },
  delete: async (id: number): Promise<void> => {
    if (USE_MOCK) { await delay(); return }
    await apiClient.delete(`/tasks/${id}`)
  },
}

// ─── Leave ────────────────────────────────────────────────────────────────

export const leaveApi = {
  getAll: async (): Promise<LeaveRequest[]> => {
    if (USE_MOCK) { await delay(); return LEAVE_REQUESTS }
    const { data } = await apiClient.get('/leave-requests')
    return data
  },
  getByEmployee: async (employeeId: number): Promise<LeaveRequest[]> => {
    if (USE_MOCK) { await delay(); return LEAVE_REQUESTS.filter((l) => l.employeeId === employeeId) }
    const { data } = await apiClient.get(`/leave-requests?employeeId=${employeeId}`)
    return data
  },
  create: async (payload: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    if (USE_MOCK) { await delay(); return { ...LEAVE_REQUESTS[0], ...payload, _id: `lr${Date.now()}` } as LeaveRequest }
    const { data } = await apiClient.post('/leave-requests', payload)
    return data
  },
  updateStatus: async (id: string, status: string, comment?: string): Promise<LeaveRequest> => {
    if (USE_MOCK) { await delay(); return LEAVE_REQUESTS[0] }
    const { data } = await apiClient.patch(`/leave-requests/${id}/status`, { status, comment })
    return data
  },
}
