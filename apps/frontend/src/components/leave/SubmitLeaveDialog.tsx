import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, TextField, Select, MenuItem, FormControl,
  InputLabel, FormHelperText, Button, Typography,
  Alert, alpha,
} from '@mui/material'
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded'
import type { LeaveType } from '@/types'
import { differenceInDays } from 'date-fns'

const schema = z.object({
  employeeId: z.number({ required_error: 'Select an employee' }),
  leaveType:  z.enum(['Annual','Sick','Casual','Unpaid','Maternity','Paternity']),
  startDate:  z.string().min(1, 'Start date required'),
  endDate:    z.string().min(1, 'End date required'),
  reason:     z.string().optional(),
}).refine(
  (data) => !data.startDate || !data.endDate || new Date(data.endDate) >= new Date(data.startDate),
  { message: 'End date must be on or after start date', path: ['endDate'] }
)

type FormData = z.infer<typeof schema>

interface Employee { id: number; firstName: string; lastName: string }

interface SubmitLeaveDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: FormData) => void
  employees: Employee[]
  loading?: boolean
}

const LEAVE_TYPES: LeaveType[] = ['Annual', 'Sick', 'Casual', 'Unpaid', 'Maternity', 'Paternity']

const LEAVE_TYPE_COLORS: Record<string, string> = {
  Annual: '#6C8EFF', Sick: '#F87171', Casual: '#38BDF8',
  Unpaid: '#94A3B8', Maternity: '#C084FC', Paternity: '#4ADE80',
}

export default function SubmitLeaveDialog({
  open, onClose, onSubmit, employees, loading,
}: SubmitLeaveDialogProps) {
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      leaveType: 'Annual',
      startDate: '',
      endDate:   '',
      reason:    '',
    },
  })

  const startDate = watch('startDate')
  const endDate   = watch('endDate')
  const leaveType = watch('leaveType')

  const days = startDate && endDate && new Date(endDate) >= new Date(startDate)
    ? differenceInDays(new Date(endDate), new Date(startDate)) + 1
    : null

  const handleClose = () => { reset(); onClose() }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          background: '#0D1525',
          border: '1px solid rgba(108,142,255,0.15)',
          borderRadius: 3,
          minWidth: 480,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: 2,
            background: alpha('#6C8EFF', 0.1),
            border: '1px solid rgba(108,142,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C8EFF',
          }}>
            <BeachAccessRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '1rem' }}>
              Submit Leave Request
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569' }}>
              A domain event will be published on submission
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Employee select */}
          <Controller name="employeeId" control={control} render={({ field }) => (
            <FormControl fullWidth size="small" required error={!!errors.employeeId}>
              <InputLabel>Employee</InputLabel>
              <Select
                {...field}
                label="Employee"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {employees.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.firstName} {e.lastName}
                  </MenuItem>
                ))}
              </Select>
              {errors.employeeId && <FormHelperText>{errors.employeeId.message}</FormHelperText>}
            </FormControl>
          )} />

          {/* Leave type */}
          <Controller name="leaveType" control={control} render={({ field }) => (
            <FormControl fullWidth size="small" required>
              <InputLabel>Leave Type</InputLabel>
              <Select {...field} label="Leave Type">
                {LEAVE_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: LEAVE_TYPE_COLORS[t], flexShrink: 0 }} />
                      {t}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )} />

          {/* Date range */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Controller name="startDate" control={control} render={({ field }) => (
              <TextField
                {...field} label="Start Date" type="date" size="small" required
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDate} helperText={errors.startDate?.message}
              />
            )} />
            <Controller name="endDate" control={control} render={({ field }) => (
              <TextField
                {...field} label="End Date" type="date" size="small" required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: startDate }}
                error={!!errors.endDate} helperText={errors.endDate?.message}
              />
            )} />
          </Box>

          {/* Duration preview */}
          {days !== null && (
            <Alert
              severity="info"
              sx={{
                background: alpha(LEAVE_TYPE_COLORS[leaveType] ?? '#6C8EFF', 0.07),
                border: `1px solid ${alpha(LEAVE_TYPE_COLORS[leaveType] ?? '#6C8EFF', 0.2)}`,
                color: '#94A3B8',
                '& .MuiAlert-icon': { color: LEAVE_TYPE_COLORS[leaveType] ?? '#6C8EFF' },
                py: 0.8,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {leaveType} leave for <Box component="span" sx={{ color: LEAVE_TYPE_COLORS[leaveType], fontFamily: '"JetBrains Mono",monospace' }}>{days} day{days !== 1 ? 's' : ''}</Box>
              </Typography>
            </Alert>
          )}

          {/* Reason */}
          <Controller name="reason" control={control} render={({ field }) => (
            <TextField
              {...field}
              label="Reason (optional)"
              placeholder="Brief explanation for this request…"
              multiline rows={3} fullWidth size="small"
            />
          )} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={handleClose} disabled={loading} size="small">Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          size="small"
        >
          {loading ? 'Submitting…' : 'Submit Request'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
