import { useNavigate, useParams } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Button, Snackbar, Alert, Skeleton } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import EmployeeForm, { type EmployeeFormData } from '@/components/employees/EmployeeForm'
import { employeeApi } from '@/services/api'
import { DEPARTMENTS, DESIGNATIONS } from '@/services/mockData'

export default function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
    open: false, msg: '', severity: 'success',
  })

  const { data: employee, isLoading: empLoading } = useQuery({
    queryKey: ['employee', Number(id)],
    queryFn: () => employeeApi.getById(Number(id)),
    enabled: isEdit,
  })

  const createMutation = useMutation({
    mutationFn: (data: EmployeeFormData) => employeeApi.create(data),
    onSuccess: (emp) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      setSnackbar({ open: true, msg: 'Employee created successfully!', severity: 'success' })
      setTimeout(() => navigate(`/employees/${emp.id}`), 1200)
    },
    onError: () => setSnackbar({ open: true, msg: 'Failed to create employee', severity: 'error' }),
  })

  const updateMutation = useMutation({
    mutationFn: (data: EmployeeFormData) => employeeApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['employee', Number(id)] })
      setSnackbar({ open: true, msg: 'Changes saved!', severity: 'success' })
      setTimeout(() => navigate(`/employees/${id}`), 1200)
    },
    onError: () => setSnackbar({ open: true, msg: 'Failed to save changes', severity: 'error' }),
  })

  const handleSubmit = (data: EmployeeFormData) => {
    if (isEdit) updateMutation.mutate(data)
    else createMutation.mutate(data)
  }

  const loading = createMutation.isPending || updateMutation.isPending

  return (
    <Box>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate(isEdit ? `/employees/${id}` : '/employees')}
        variant="text"
        size="small"
        sx={{ color: '#475569', mb: 2, '&:hover': { color: '#94A3B8' } }}
      >
        {isEdit ? 'Back to Profile' : 'Back to Employees'}
      </Button>

      <Card sx={{ maxWidth: 860 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#F1F5F9', mb: 0.5 }}>
            {isEdit ? 'Edit Employee' : 'New Employee'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569', mb: 3 }}>
            {isEdit
              ? 'Update the employee record. Changes are logged to the audit trail.'
              : 'Fill in the details below to add a new employee to the platform.'}
          </Typography>

          {isEdit && empLoading ? (
            <Box>
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} height={52} sx={{ borderRadius: 2, mb: 1.5 }} />
              ))}
            </Box>
          ) : (
            <EmployeeForm
              initialData={isEdit ? employee : undefined}
              departments={DEPARTMENTS}
              designations={DESIGNATIONS}
              onSubmit={handleSubmit}
              onCancel={() => navigate(isEdit ? `/employees/${id}` : '/employees')}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ background: '#1E293B', color: '#F1F5F9', border: '1px solid rgba(148,163,184,0.15)' }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
