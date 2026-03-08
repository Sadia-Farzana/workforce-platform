import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, TextField, Select, MenuItem, FormControl,
  InputLabel, Button, Typography, alpha, FormHelperText,
} from '@mui/material'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import type { Task, TaskStatus, TaskPriority, Employee } from '@/types'

const schema = z.object({
  title:              z.string().min(1, 'Title is required').max(120),
  description:        z.string().optional(),
  status:             z.enum(['Todo','InProgress','InReview','Done','Blocked']),
  priority:           z.enum(['Low','Medium','High','Critical']),
  dueDate:            z.string().optional(),
  assignedEmployeeId: z.number().optional(),
})

type FormData = z.infer<typeof schema>

interface TaskFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: FormData) => void
  initialData?: Task
  teamMembers: Employee[]
  defaultStatus?: TaskStatus
  loading?: boolean
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'Todo',       label: 'To Do' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'InReview',   label: 'In Review' },
  { value: 'Done',       label: 'Done' },
  { value: 'Blocked',    label: 'Blocked' },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'Low',      label: 'Low',      color: '#4ADE80' },
  { value: 'Medium',   label: 'Medium',   color: '#FACC15' },
  { value: 'High',     label: 'High',     color: '#FF8C6B' },
  { value: 'Critical', label: 'Critical', color: '#F87171' },
]

export default function TaskFormDialog({
  open, onClose, onSubmit, initialData, teamMembers, defaultStatus, loading,
}: TaskFormDialogProps) {
  const isEdit = !!initialData

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:              initialData?.title ?? '',
      description:        initialData?.description ?? '',
      status:             initialData?.status ?? defaultStatus ?? 'Todo',
      priority:           initialData?.priority ?? 'Medium',
      dueDate:            initialData?.dueDate?.slice(0, 10) ?? '',
      assignedEmployeeId: initialData?.assignedEmployeeId ?? undefined,
    },
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#0D1525',
          border: '1px solid rgba(148,163,184,0.1)',
          borderRadius: 3,
          minWidth: 460,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 2,
            background: alpha('#C084FC', 0.1),
            border: '1px solid rgba(192,132,252,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C084FC',
          }}>
            <AssignmentRoundedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '1rem' }}>
              {isEdit ? 'Edit Task' : 'New Task'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569' }}>
              {isEdit ? 'Update task details' : 'Add a task to this project'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Controller name="title" control={control} render={({ field }) => (
            <TextField {...field} label="Task Title" required fullWidth size="small"
              error={!!errors.title} helperText={errors.title?.message} />
          )} />

          <Controller name="description" control={control} render={({ field }) => (
            <TextField {...field} label="Description" fullWidth size="small" multiline rows={2}
              placeholder="What needs to be done?" />
          )} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Controller name="status" control={control} render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select {...field} label="Status">
                  {STATUS_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )} />

            <Controller name="priority" control={control} render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select {...field} label="Priority">
                  {PRIORITY_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: o.color, flexShrink: 0 }} />
                        {o.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )} />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Controller name="dueDate" control={control} render={({ field }) => (
              <TextField {...field} label="Due Date" type="date" size="small"
                InputLabelProps={{ shrink: true }} />
            )} />

            <Controller name="assignedEmployeeId" control={control} render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Assign To</InputLabel>
                <Select
                  {...field}
                  label="Assign To"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                >
                  <MenuItem value=""><em>Unassigned</em></MenuItem>
                  {teamMembers.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.firstName} {m.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )} />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading} size="small">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={loading} size="small"
          sx={{ background: '#C084FC', '&:hover': { background: '#A855F7', boxShadow: '0 4px 16px rgba(192,132,252,0.35)' } }}>
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
