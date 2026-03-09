import axios from 'axios'
import type {
  Employee, EmployeeFilters, PaginatedResult,
  Project, Task, LeaveRequest, SummaryReport, AuditLog,
} from '@/types'
import {
  EMPLOYEES, PROJECTS, TASKS, LEAVE_REQUESTS,
  SUMMARY_REPORT, AUDIT_LOGS,
} from './mockData'

// 1. Configuration from your OpenAPI spec
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7192/api/v1' // Default port from spec

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// 2. Auth Interceptor: Automatically attach Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    console.error('[API Error]', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// ─── Authentication (Auth Tag) ───────────────────────────────────────────

export const authApi = {
  login: async (credentials: any) => {
    const { data } = await apiClient.post('/auth/login', credentials) // Maps to /api/v1/auth/login
    return data
  },
  register: async (payload: any) => {
    const { data } = await apiClient.post('/auth/register', payload) // Maps to /api/v1/auth/register
    return data
  },
  refresh: async (refreshToken: string) => {
    const { data } = await apiClient.post('/auth/refresh', { refreshToken }) // Maps to /api/v1/auth/refresh
    return data
  },
  logout: async (refreshToken: string) => {
    const { data } = await apiClient.post('/auth/logout', { refreshToken }) // Maps to /api/v1/auth/logout
    return data
  },
  getMe: async () => {
    const { data } = await apiClient.get('/auth/me') // Maps to /api/v1/auth/me
    return data
  },
}

// ─── Dashboard ────────────────────────────────────────────────────────────

export const dashboardApi = {
  getSummaryReport: async (): Promise<SummaryReport> => {
    if (USE_MOCK) { await delay(); return SUMMARY_REPORT }
    const { data } = await apiClient.get('/dashboard') // Maps to /api/v1/dashboard
    return data.data || data
  },
}

// ─── Employees ────────────────────────────────────────────────────────────

export const employeeApi = {
  getAll: async (filters: EmployeeFilters): Promise<PaginatedResult<Employee>> => {
    if (USE_MOCK) {
      await delay()
      // ... keep existing mock logic ...
      return { items: EMPLOYEES, total: EMPLOYEES.length, page: 1, pageSize: 10, totalPages: 1 }
    }
    const { data } = await apiClient.get('/employees', { params: filters }) // Maps to /api/v1/employees
    return data.data || data
  },
  getById: async (id: number): Promise<Employee> => {
    if (USE_MOCK) { await delay(); return EMPLOYEES.find((e) => e.id === id) ?? EMPLOYEES[0] }
    const { data } = await apiClient.get(`/employees/${id}`) // Maps to /api/v1/employees/{id}
    return data.data || data
  },
  create: async (payload: any): Promise<Employee> => {
    const { data } = await apiClient.post('/employees', payload) // Maps to /api/v1/employees
    return data.data || data
  },
  update: async (id: number, payload: any): Promise<Employee> => {
    const { data } = await apiClient.put(`/employees/${id}`, payload) // Maps to /api/v1/employees/{id}
    return data.data || data
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/employees/${id}`) // Maps to /api/v1/employees/{id}
  },
  search: async (q: string) => {
    const { data } = await apiClient.get('/employees/search', { params: { q } }) // Maps to /api/v1/employees/search
    return data.data || data
  }
}

// ─── Leave Requests ───────────────────────────────────────────────────────

export const leaveApi = {
  getAll: async (params?: any): Promise<LeaveRequest[]> => {
    if (USE_MOCK) { await delay(); return LEAVE_REQUESTS }
    const { data } = await apiClient.get('/leave-requests', { params }) // Maps to /api/v1/leave-requests
    return data.data || data
  },
  getById: async (id: string): Promise<LeaveRequest> => {
    const { data } = await apiClient.get(`/leave-requests/${id}`) // Maps to /api/v1/leave-requests/{id}
    return data.data || data
  },
  create: async (payload: any): Promise<LeaveRequest> => {
    const { data } = await apiClient.post('/leave-requests', payload) // Maps to /api/v1/leave-requests
    return data.data || data
  },
  review: async (id: string, payload: { action: string, reviewedBy: string, comment?: string }) => {
    const { data } = await apiClient.patch(`/leave-requests/${id}/review`, payload) // Maps to /api/v1/leave-requests/{id}/review
    return data.data || data
  }
}

// ─── Tasks ────────────────────────────────────────────────────────────────

export const taskApi = {
  getByProject: async (projectId: number): Promise<Task[]> => {
    if (USE_MOCK) { await delay(); return TASKS.filter(t => t.projectId === projectId) }
    const { data } = await apiClient.get(`/projects/${projectId}/tasks`) // Maps to /api/v1/projects/{projectId}/tasks
    return data.data || data
  },
  create: async (projectId: number, payload: any): Promise<Task> => {
    const { data } = await apiClient.post(`/projects/${projectId}/tasks`, payload) // Maps to /api/v1/projects/{projectId}/tasks
    return data.data || data
  },
  update: async (projectId: number, taskId: number, payload: any): Promise<Task> => {
    const { data } = await apiClient.put(`/projects/${projectId}/tasks/${taskId}`, payload) // Maps to /api/v1/projects/{projectId}/tasks/{taskId}
    return data.data || data
  },
  delete: async (projectId: number, taskId: number): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`) // Maps to /api/v1/projects/{projectId}/tasks/{taskId}
  }
}

// ─── Audit Logs ───────────────────────────────────────────────────────────

export const auditApi = {
  getAll: async (params?: any): Promise<AuditLog[]> => {
    if (USE_MOCK) { await delay(); return AUDIT_LOGS }
    const { data } = await apiClient.get('/audit-logs', { params }) // Maps to /api/v1/audit-logs
    return data.data || data
  },
  getByEntity: async (entityType: string, entityId: string) => {
    const { data } = await apiClient.get(`/audit-logs/entity/${entityType}/${entityId}`) // Maps to /api/v1/audit-logs/entity/{entityType}/{entityId}
    return data.data || data
  }
}