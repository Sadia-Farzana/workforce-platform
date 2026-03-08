import {
  Grid, Card, CardContent, Box, Typography, Chip, IconButton,
  Tooltip, Divider, alpha,
} from '@mui/material'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import EmployeeAvatar from './EmployeeAvatar'
import StatusChip from '@/components/common/StatusChip'
import type { Employee } from '@/types'
import { format } from 'date-fns'

interface EmployeeGridProps {
  employees: Employee[]
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export default function EmployeeGrid({ employees, onView, onEdit, onDelete }: EmployeeGridProps) {
  return (
    <Grid container spacing={2}>
      {employees.map((emp) => {
        const colors = ['#6C8EFF', '#FF8C6B', '#4ADE80', '#FACC15', '#38BDF8', '#C084FC']
        const color = colors[(emp.firstName.charCodeAt(0) + emp.lastName.charCodeAt(0)) % colors.length]

        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={emp.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${alpha(color, 0.2)}`,
                },
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""', position: 'absolute',
                  top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                },
              }}
              onClick={() => onView(emp.id)}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <EmployeeAvatar
                    firstName={emp.firstName}
                    lastName={emp.lastName}
                    email={emp.email}
                    avatarUrl={emp.avatarUrl}
                    size="lg"
                  />
                  <StatusChip status={emp.isActive ? 'active' : 'inactive'} />
                </Box>

                {/* Dept + Role */}
                <Box sx={{ mb: 1.5 }}>
                  <Chip
                    label={emp.department.name}
                    size="small"
                    sx={{
                      height: 20, fontSize: '0.68rem', fontWeight: 600, mr: 0.5,
                      background: alpha('#FF8C6B', 0.1), color: '#FF8C6B',
                      border: '1px solid rgba(255,140,107,0.2)',
                      '& .MuiChip-label': { px: 0.8 },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
                    {emp.designation.name}
                  </Typography>
                </Box>

                {/* Salary */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800, color: '#4ADE80', mb: 1.5,
                    fontFamily: '"JetBrains Mono", monospace', fontSize: '1.1rem',
                  }}
                >
                  ${emp.salary.toLocaleString()}<Typography component="span" variant="caption" sx={{ color: '#334155', fontFamily: 'inherit', fontWeight: 400 }}>/mo</Typography>
                </Typography>

                <Divider sx={{ mb: 1.5, borderColor: 'rgba(148,163,184,0.06)' }} />

                {/* Meta */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                  {emp.city && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnRoundedIcon sx={{ fontSize: 12, color: '#334155' }} />
                      <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem' }}>
                        {emp.city}, {emp.country}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayRoundedIcon sx={{ fontSize: 12, color: '#334155' }} />
                    <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem' }}>
                      Joined {format(new Date(emp.joiningDate), 'MMM yyyy')}
                    </Typography>
                  </Box>
                </Box>

                {/* Skills */}
                {emp.skills.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                    {emp.skills.slice(0, 3).map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        sx={{
                          height: 18, fontSize: '0.62rem', fontWeight: 600,
                          background: alpha('#6C8EFF', 0.08), color: '#6C8EFF',
                          '& .MuiChip-label': { px: 0.6 },
                        }}
                      />
                    ))}
                    {emp.skills.length > 3 && (
                      <Chip
                        label={`+${emp.skills.length - 3}`}
                        size="small"
                        sx={{
                          height: 18, fontSize: '0.62rem',
                          background: 'rgba(148,163,184,0.06)', color: '#475569',
                          '& .MuiChip-label': { px: 0.6 },
                        }}
                      />
                    )}
                  </Box>
                )}

                {/* Actions */}
                <Box
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    display: 'flex', gap: 0.5, justifyContent: 'flex-end',
                    borderTop: '1px solid rgba(148,163,184,0.06)', pt: 1.5, mt: -0.5,
                  }}
                >
                  <Tooltip title="View Details" arrow>
                    <IconButton size="small" onClick={() => onView(emp.id)} sx={{ color: '#475569', '&:hover': { color: '#6C8EFF' } }}>
                      <VisibilityRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit" arrow>
                    <IconButton size="small" onClick={() => onEdit(emp.id)} sx={{ color: '#475569', '&:hover': { color: '#FACC15' } }}>
                      <EditRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton size="small" onClick={() => onDelete(emp.id)} sx={{ color: '#475569', '&:hover': { color: '#F87171' } }}>
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}
