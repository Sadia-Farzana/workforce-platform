import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box, Grid, TextField, Select, MenuItem, FormControl,
  InputLabel, FormHelperText, Button, Typography,
  Divider, Switch, FormControlLabel, alpha,
} from '@mui/material'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import SkillsInput from '@/components/common/SkillsInput'
import EmployeeAvatar from './EmployeeAvatar'
import type { Employee, Department, Designation } from '@/types'

const schema = z.object({
  firstName:     z.string().min(1, 'First name is required').max(50),
  lastName:      z.string().min(1, 'Last name is required').max(50),
  email:         z.string().email('Invalid email address'),
  phone:         z.string().optional(),
  departmentId:  z.number({ required_error: 'Department is required' }).min(1),
  designationId: z.number({ required_error: 'Designation is required' }).min(1),
  salary:        z.number({ required_error: 'Salary is required' }).min(1, 'Must be > 0'),
  joiningDate:   z.string().min(1, 'Joining date is required'),
  isActive:      z.boolean(),
  address:       z.string().optional(),
  city:          z.string().optional(),
  country:       z.string().optional(),
  skills:        z.array(z.string()).default([]),
})

export type EmployeeFormData = z.infer<typeof schema>

interface EmployeeFormProps {
  initialData?: Employee
  departments: Department[]
  designations: Designation[]
  onSubmit: (data: EmployeeFormData) => void
  onCancel: () => void
  loading?: boolean
}

export default function EmployeeForm({
  initialData, departments, designations, onSubmit, onCancel, loading,
}: EmployeeFormProps) {
  const isEdit = !!initialData

  const {
    control, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName:     initialData?.firstName ?? '',
      lastName:      initialData?.lastName ?? '',
      email:         initialData?.email ?? '',
      phone:         initialData?.phone ?? '',
      departmentId:  initialData?.departmentId ?? undefined,
      designationId: initialData?.designationId ?? undefined,
      salary:        initialData?.salary ?? undefined,
      joiningDate:   initialData?.joiningDate?.slice(0, 10) ?? '',
      isActive:      initialData?.isActive ?? true,
      address:       initialData?.address ?? '',
      city:          initialData?.city ?? '',
      country:       initialData?.country ?? '',
      skills:        initialData?.skills ?? [],
    },
  })

  const firstName = watch('firstName')
  const lastName  = watch('lastName')
  const email     = watch('email')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Preview header */}
      <Box
        sx={{
          p: 2.5, mb: 3, borderRadius: 3,
          background: alpha('#6C8EFF', 0.05),
          border: '1px solid rgba(108,142,255,0.12)',
          display: 'flex', alignItems: 'center', gap: 2,
        }}
      >
        <EmployeeAvatar
          firstName={firstName || 'New'}
          lastName={lastName || 'Employee'}
          email={email || 'employee@company.com'}
          size="lg"
        />
        <Box>
          <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 700, lineHeight: 1.2 }}>
            {firstName || lastName ? `${firstName} ${lastName}`.trim() : 'New Employee'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            {isEdit ? 'Editing employee record' : 'Creating new employee record'}
          </Typography>
        </Box>
      </Box>

      {/* ── Personal Information ── */}
      <SectionLabel>Personal Information</SectionLabel>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Controller name="firstName" control={control} render={({ field }) => (
            <TextField {...field} label="First Name" required fullWidth size="small"
              error={!!errors.firstName} helperText={errors.firstName?.message} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="lastName" control={control} render={({ field }) => (
            <TextField {...field} label="Last Name" required fullWidth size="small"
              error={!!errors.lastName} helperText={errors.lastName?.message} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="email" control={control} render={({ field }) => (
            <TextField {...field} label="Email Address" type="email" required fullWidth size="small"
              error={!!errors.email} helperText={errors.email?.message} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="phone" control={control} render={({ field }) => (
            <TextField {...field} label="Phone Number" fullWidth size="small"
              placeholder="+1 555 0100" />
          )} />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* ── Organization ── */}
      <SectionLabel>Organization</SectionLabel>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Controller name="departmentId" control={control} render={({ field }) => (
            <FormControl fullWidth size="small" required error={!!errors.departmentId}>
              <InputLabel>Department</InputLabel>
              <Select {...field} label="Department" value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                {departments.map((d) => (
                  <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                ))}
              </Select>
              {errors.departmentId && <FormHelperText>{errors.departmentId.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="designationId" control={control} render={({ field }) => (
            <FormControl fullWidth size="small" required error={!!errors.designationId}>
              <InputLabel>Designation</InputLabel>
              <Select {...field} label="Designation" value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                {designations.map((d) => (
                  <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                ))}
              </Select>
              {errors.designationId && <FormHelperText>{errors.designationId.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="salary" control={control} render={({ field }) => (
            <TextField
              {...field}
              label="Monthly Salary (USD)"
              type="number"
              required
              fullWidth
              size="small"
              error={!!errors.salary}
              helperText={errors.salary?.message}
              onChange={(e) => field.onChange(Number(e.target.value))}
              InputProps={{ inputProps: { min: 0 } }}
            />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="joiningDate" control={control} render={({ field }) => (
            <TextField {...field} label="Joining Date" type="date" required fullWidth size="small"
              InputLabelProps={{ shrink: true }}
              error={!!errors.joiningDate} helperText={errors.joiningDate?.message} />
          )} />
        </Grid>
        <Grid item xs={12}>
          <Controller name="isActive" control={control} render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#4ADE80' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { background: '#4ADE80' },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                  {watch('isActive') ? 'Employee is Active' : 'Employee is Inactive'}
                </Typography>
              }
            />
          )} />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* ── Location ── */}
      <SectionLabel>Location (Optional)</SectionLabel>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Controller name="address" control={control} render={({ field }) => (
            <TextField {...field} label="Street Address" fullWidth size="small" />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="city" control={control} render={({ field }) => (
            <TextField {...field} label="City" fullWidth size="small" />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="country" control={control} render={({ field }) => (
            <TextField {...field} label="Country" fullWidth size="small" />
          )} />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* ── Skills ── */}
      <SectionLabel>Skills</SectionLabel>
      <Box sx={{ mb: 4 }}>
        <Controller name="skills" control={control} render={({ field }) => (
          <SkillsInput
            value={field.value}
            onChange={field.onChange}
            error={errors.skills?.message}
          />
        )} />
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          disabled={loading}
        >
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Employee'}
        </Button>
      </Box>
    </Box>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{
        display: 'block', mb: 1.5,
        color: '#475569', fontSize: '0.65rem',
        letterSpacing: '0.12em', fontFamily: '"JetBrains Mono", monospace',
      }}
    >
      {children}
    </Typography>
  )
}
