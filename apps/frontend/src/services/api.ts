import axios from 'axios'
import type {
  Employee, EmployeeFilters, PaginatedResult,
  Project, Task, LeaveRequest, SummaryReport, AuditLog,
} from '@/types'
import {
  EMPLOYEES, PROJECTS, TASKS, LEAVE_REQUESTS,
  SUMMARY_REPORT, AUDIT_LOGS,
} from './mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5270/api/v1',
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('wf_auth')
    if (raw) {
      const parsed = JSON.parse(raw) as { accessToken?: string }
      if (parsed.accessToken) {
        config.headers.Authorization = `Bearer ${parsed.accessToken}`
      }
    }
  } catch { /* ignore */ }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wf_auth')
      window.location.href = '/login'
    }
    console.error('[API Error]', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// ─── Auth ─────────────────────────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  tokenType: string
  user: {
    id: number
    username: string
    email: string
    role: string
    employeeId: number | null
  }
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post<{ success: boolean; message: string; data: LoginResponse }>(
      '/auth/login',
      { email, password }
    )
    if (!data.success) throw new Error(data.message)
    return data.data
  },
}

// ─── Dashboard ────────────────────────────────────────────────────────────

export const dashboardApi = {
  getSummaryReport: async (): Promise<SummaryReport> => {
    if (USE_MOCK) { await delay(); return SUMMARY_REPORT }
    const { data } = await apiClient.get('/reports/summary')
    return data.data ?? data
  },
  getAuditLogs: async (limit = 20): Promise<AuditLog[]> => {
    if (USE_MOCK) { await delay(200); return AUDIT_LOGS.slice(0, limit) }
    const { data } = await apiClient.get('/audit-logs', { params: { limit } })
    return data.data ?? data
  },
}

// ── Real API response shapes ──────────────────────────────────────────────

interface RealApiEmployee {
  id: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  isActive: boolean
  salary: number
  joiningDate: string
  phone: string
  address: string | null
  city: string
  country: string
  avatarUrl: string | null
  skills: string[]
  departmentId: number
  departmentName: string
  designationId: number
  designationTitle: string
  createdAt: string
  updatedAt: string
}

interface RealApiPagination {
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

interface RealApiListResponse {
  success: boolean
  message: string
  data: RealApiEmployee[]
  pagination: RealApiPagination
}

function mapRealEmployee(e: RealApiEmployee): Employee {
  return {
    id: e.id,
    firstName: e.firstName,
    lastName: e.lastName,
    fullName: e.fullName,
    email: e.email,
    isActive: e.isActive,
    salary: e.salary,
    joiningDate: e.joiningDate,
    phone: e.phone,
    address: e.address ?? undefined,
    city: e.city,
    country: e.country,
    avatarUrl: e.avatarUrl ?? undefined,
    skills: e.skills,
    departmentId: e.departmentId,
    department: { id: e.departmentId, name: e.departmentName, headCount: 0 },
    designationId: e.designationId,
    designation: { id: e.designationId, name: e.designationTitle, level: 0 },
  }
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

    const params: Record<string, unknown> = {
      Page: filters.page,
      PageSize: filters.pageSize,
    }
    if (filters.search)                  params.Search       = filters.search
    if (filters.departmentId)            params.DepartmentId = filters.departmentId
    if (filters.isActive !== undefined)  params.IsActive     = filters.isActive
    if (filters.sortBy)                  params.SortBy       = filters.sortBy
    if (filters.sortOrder)               params.SortDesc     = filters.sortOrder === 'desc'

    const { data } = await apiClient.get<RealApiListResponse>('/employees', { params })
    const employees = (data.data ?? []).map(mapRealEmployee)
    const pagination = data.pagination ?? {} as RealApiPagination

    return {
      items: employees,
      total: pagination.totalCount ?? employees.length,
      page: pagination.page ?? filters.page,
      pageSize: pagination.pageSize ?? filters.pageSize,
      totalPages: pagination.totalPages ?? 1,
    }
  },

  search: async (q: string): Promise<Employee[]> => {
    if (USE_MOCK) {
      await delay(300)
      const query = q.toLowerCase()
      return EMPLOYEES.filter((e) =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(query) ||
        e.email.toLowerCase().includes(query)
      )
    }
    const { data } = await apiClient.get<{ success: boolean; data: RealApiEmployee[] }>(
      '/employees/search',
      { params: { q } }
    )
    return (data.data ?? []).map(mapRealEmployee)
  },

  getById: async (id: number): Promise<Employee> => {
    if (USE_MOCK) { await delay(); return EMPLOYEES.find((e) => e.id === id) ?? EMPLOYEES[0] }
    const { data } = await apiClient.get<{ success: boolean; data: RealApiEmployee }>(`/employees/${id}`)
    return mapRealEmployee(data.data)
  },

  create: async (payload: Partial<Employee>): Promise<Employee> => {
    if (USE_MOCK) { await delay(); return { ...EMPLOYEES[0], ...payload, id: Date.now() } as Employee }

    const body = {
      firstName:     payload.firstName,
      lastName:      payload.lastName,
      email:         payload.email,
      departmentId:  String(payload.departmentId),
      designationId: String(payload.designationId),
      salary:        String(payload.salary),
      joiningDate:   payload.joiningDate,
      phone:         payload.phone ?? '',
      address:       payload.address ?? '',
      city:          payload.city ?? '',
      country:       payload.country ?? '',
      avatarUrl:     payload.avatarUrl ?? '',
      skills:        payload.skills?.length ? payload.skills : null,
    }

    const { data } = await apiClient.post<{ success: boolean; message: string; data: RealApiEmployee }>(
      '/employees',
      body
    )
    if (!data.success) throw new Error(data.message)
    return mapRealEmployee(data.data)
  },

  update: async (id: number, payload: Partial<Employee>): Promise<Employee> => {
    if (USE_MOCK) { await delay(); return { ...EMPLOYEES[0], ...payload, id } as Employee }

    const body = {
      firstName:     payload.firstName,
      lastName:      payload.lastName,
      email:         payload.email,
      departmentId:  payload.departmentId,
      designationId: payload.designationId,
      salary:        payload.salary,
      joiningDate:   payload.joiningDate,
      phone:         payload.phone ?? '',
      address:       payload.address ?? '',
      city:          payload.city ?? '',
      country:       payload.country ?? '',
      avatarUrl:     payload.avatarUrl ?? '',
      skills:        payload.skills ?? [],
    }

    const { data } = await apiClient.put<{ success: boolean; message: string; data: RealApiEmployee }>(
      `/employees/${id}`,
      body
    )
    if (!data.success) throw new Error(data.message)
    return mapRealEmployee(data.data)
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
    return data.data ?? data
  },
  getById: async (id: number): Promise<Project> => {
    if (USE_MOCK) { await delay(); return PROJECTS.find((p) => p.id === id) ?? PROJECTS[0] }
    const { data } = await apiClient.get(`/projects/${id}`)
    return data.data ?? data
  },
  create: async (payload: Partial<Project>): Promise<Project> => {
    if (USE_MOCK) { await delay(); return { ...PROJECTS[0], ...payload, id: Date.now() } as Project }
    const { data } = await apiClient.post('/projects', payload)
    return data.data ?? data
  },
  update: async (id: number, payload: Partial<Project>): Promise<Project> => {
    if (USE_MOCK) { await delay(); return { ...PROJECTS.find(p => p.id === id)!, ...payload } as Project }
    const { data } = await apiClient.put(`/projects/${id}`, payload)
    return data.data ?? data
  },
}

export const taskApi = {
  getByProject: async (projectId: number): Promise<Task[]> => {
    if (USE_MOCK) { await delay(200); return TASKS.filter((t) => t.projectId === projectId) }
    const { data } = await apiClient.get(`/projects/${projectId}/tasks`)
    return data.data ?? data
  },
  create: async (projectId: number, payload: Partial<Task>): Promise<Task> => {
    if (USE_MOCK) { await delay(); return { ...TASKS[0], ...payload, id: Date.now(), projectId } as Task }
    const { data } = await apiClient.post(`/projects/${projectId}/tasks`, payload)
    return data.data ?? data
  },
  update: async (id: number, payload: Partial<Task>): Promise<Task> => {
    if (USE_MOCK) { await delay(); return { ...TASKS.find(t => t.id === id)!, ...payload } as Task }
    const { data } = await apiClient.put(`/tasks/${id}`, payload)
    return data.data ?? data
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
    return data.data ?? data
  },
  getByEmployee: async (employeeId: number): Promise<LeaveRequest[]> => {
    if (USE_MOCK) { await delay(); return LEAVE_REQUESTS.filter((l) => l.employeeId === employeeId) }
    const { data } = await apiClient.get(`/leave-requests?employeeId=${employeeId}`)
    return data.data ?? data
  },
  create: async (payload: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    if (USE_MOCK) { await delay(); return { ...LEAVE_REQUESTS[0], ...payload, _id: `lr${Date.now()}` } as LeaveRequest }
    const { data } = await apiClient.post('/leave-requests', payload)
    return data.data ?? data
  },
  updateStatus: async (id: string, status: string, comment?: string): Promise<LeaveRequest> => {
    if (USE_MOCK) { await delay(); return LEAVE_REQUESTS[0] }
    const { data } = await apiClient.patch(`/leave-requests/${id}/status`, { status, comment })
    return data.data ?? data
  },
}
