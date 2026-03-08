import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, TextField, Select, MenuItem, FormControl, InputLabel,
  FormHelperText, Button, Typography, alpha,
} from '@mui/material'
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded'
import type { Project, ProjectStatus } from '@/types'

const schema = z.object({
  name:        z.string().min(1, 'Project name is required').max(100),
  description: z.string().optional(),
  status:      z.enum(['Active', 'Completed', 'OnHold', 'Planning']),
  startDate:   z.string().min(1, 'Start date is required'),
  endDate:     z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface ProjectFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: FormData) => void
  initialData?: Project
  loading?: boolean
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'Planning',  label: 'Planning' },
  { value: 'Active',    label: 'Active' },
  { value: 'OnHold',    label: 'On Hold' },
  { value: 'Completed', label: 'Completed' },
]

export default function ProjectFormDialog({
  open, onClose, onSubmit, initialData, loading,
}: ProjectFormDialogProps) {
  const isEdit = !!initialData
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:        initialData?.name ?? '',
      description: initialData?.description ?? '',
      status:      initialData?.status ?? 'Planning',
      startDate:   initialData?.startDate?.slice(0, 10) ?? '',
      endDate:     initialData?.endDate?.slice(0, 10) ?? '',
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
          minWidth: 480,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 2,
            background: alpha('#6C8EFF', 0.1),
            border: '1px solid rgba(108,142,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6C8EFF',
          }}>
            <FolderSpecialRoundedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '1rem' }}>
              {isEdit ? 'Edit Project' : 'New Project'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569' }}>
              {isEdit ? 'Update project details' : 'Create a new project'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Controller name="name" control={control} render={({ field }) => (
            <TextField {...field} label="Project Name" required fullWidth size="small"
              error={!!errors.name} helperText={errors.name?.message} />
          )} />

          <Controller name="description" control={control} render={({ field }) => (
            <TextField {...field} label="Description" fullWidth size="small" multiline rows={2}
              placeholder="Brief description of the project's goals…" />
          )} />

          <Controller name="status" control={control} render={({ field }) => (
            <FormControl fullWidth size="small" required>
              <InputLabel>Status</InputLabel>
              <Select {...field} label="Status">
                {STATUS_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Controller name="startDate" control={control} render={({ field }) => (
              <TextField {...field} label="Start Date" type="date" required size="small"
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDate} helperText={errors.startDate?.message} />
            )} />
            <Controller name="endDate" control={control} render={({ field }) => (
              <TextField {...field} label="End Date (optional)" type="date" size="small"
                InputLabelProps={{ shrink: true }} />
            )} />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading} size="small">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={loading} size="small">
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Project'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
