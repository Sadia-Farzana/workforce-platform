import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Snackbar, Alert } from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import EmployeeToolbar, { type ViewMode } from '@/components/employees/EmployeeToolbar'
import EmployeeTable from '@/components/employees/EmployeeTable'
import EmployeeGrid from '@/components/employees/EmployeeGrid'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import { employeeApi } from '@/services/api'
import { DEPARTMENTS } from '@/services/mockData'
import type { EmployeeFilters } from '@/types'

export default function EmployeeListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // ── Filters & Pagination ──────────────────────────────────────────────
  const [search, setSearch]             = useState('')
  const [departmentId, setDepartmentId] = useState<number | ''>('')
  const [isActive, setIsActive]         = useState<boolean | ''>('')
  const [page, setPage]                 = useState(1)
  const [pageSize, setPageSize]         = useState(10)
  const [sortBy, setSortBy]             = useState('name')
  const [sortOrder, setSortOrder]       = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode]         = useState<ViewMode>('table')

  // ── Delete flow ───────────────────────────────────────────────────────
  const [deleteId, setDeleteId]     = useState<number | null>(null)
  const [snackbar, setSnackbar]     = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
    open: false, msg: '', severity: 'success',
  })

  const filters: EmployeeFilters = {
    search:       search || undefined,
    departmentId: departmentId || undefined,
    isActive:     isActive === '' ? undefined : isActive,
    page,
    pageSize,
    sortBy,
    sortOrder,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeeApi.getAll(filters),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      setSnackbar({ open: true, msg: 'Employee deleted successfully', severity: 'success' })
      setDeleteId(null)
    },
    onError: () => {
      setSnackbar({ open: true, msg: 'Failed to delete employee', severity: 'error' })
      setDeleteId(null)
    },
  })

  const handleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }, [sortBy])

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1) }
  const handleDeptChange   = (v: number | '') => { setDepartmentId(v); setPage(1) }
  const handleStatusChange = (v: boolean | '') => { setIsActive(v); setPage(1) }

  const employees = data?.items ?? []
  const total     = data?.total ?? 0

  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <EmployeeToolbar
            search={search}
            onSearchChange={handleSearchChange}
            departmentId={departmentId}
            onDepartmentChange={handleDeptChange}
            isActive={isActive}
            onIsActiveChange={handleStatusChange}
            departments={DEPARTMENTS}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            total={total}
            onAddNew={() => navigate('/employees/new')}
          />
        </CardContent>
      </Card>

      <Box sx={{ mt: 2 }}>
        {!isLoading && employees.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={<PeopleAltRoundedIcon />}
                title="No employees found"
                description="Try adjusting your search or filters, or add a new employee."
                action={{ label: 'Add Employee', onClick: () => navigate('/employees/new') }}
              />
            </CardContent>
          </Card>
        ) : viewMode === 'table' ? (
          <EmployeeTable
            employees={employees}
            total={total}
            page={page}
            pageSize={pageSize}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
            onSort={handleSort}
            onView={(id) => navigate(`/employees/${id}`)}
            onEdit={(id) => navigate(`/employees/${id}/edit`)}
            onDelete={(id) => setDeleteId(id)}
            loading={isLoading}
          />
        ) : (
          <EmployeeGrid
            employees={employees}
            onView={(id) => navigate(`/employees/${id}`)}
            onEdit={(id) => navigate(`/employees/${id}/edit`)}
            onDelete={(id) => setDeleteId(id)}
          />
        )}
      </Box>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Employee"
        description="This will soft-delete the employee and remove them from active assignments. This action is reversible by an admin."
        confirmLabel="Delete Employee"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ background: '#1E293B', color: '#F1F5F9', border: '1px solid rgba(148,163,184,0.15)' }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
