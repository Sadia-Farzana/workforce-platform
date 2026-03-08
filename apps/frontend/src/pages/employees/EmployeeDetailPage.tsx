import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip, Divider,
  Tabs, Tab, Skeleton, IconButton, Tooltip, alpha,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import EmployeeAvatar from '@/components/employees/EmployeeAvatar'
import LeaveHistoryPanel from '@/components/employees/LeaveHistoryPanel'
import AuditTrailPanel from '@/components/employees/AuditTrailPanel'
import StatusChip from '@/components/common/StatusChip'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { employeeApi, leaveApi } from '@/services/api'
import { AUDIT_LOGS, PROJECTS } from '@/services/mockData'
import { format, differenceInMonths } from 'date-fns'

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.8 }}>
      <Box sx={{ color: '#334155', display: 'flex', '& .MuiSvgIcon-root': { fontSize: 16 } }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.65rem', display: 'block', lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  )
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState(0)
  const [showDelete, setShowDelete] = useState(false)

  const empId = Number(id)

  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', empId],
    queryFn: () => employeeApi.getById(empId),
    enabled: !!id,
  })

  const { data: leaveRequests = [] } = useQuery({
    queryKey: ['leave', 'employee', empId],
    queryFn: () => leaveApi.getByEmployee(empId),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => employeeApi.delete(empId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      navigate('/employees')
    },
  })

  if (isLoading) {
    return (
      <Box>
        <Skeleton height={200} sx={{ borderRadius: 3, mb: 2 }} />
        <Skeleton height={400} sx={{ borderRadius: 3 }} />
      </Box>
    )
  }

  if (!employee) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography sx={{ color: '#475569' }}>Employee not found.</Typography>
        <Button onClick={() => navigate('/employees')} sx={{ mt: 2 }}>Back to Employees</Button>
      </Box>
    )
  }

  const tenure = differenceInMonths(new Date(), new Date(employee.joiningDate))
  const tenureLabel = tenure >= 12
    ? `${Math.floor(tenure / 12)}y ${tenure % 12}m`
    : `${tenure}mo`

  // Filter audit logs to this employee
  const auditLogs = AUDIT_LOGS.filter((l) => l.entityType === 'Employee' && l.entityId === String(empId))

  // Projects with this employee
  const assignedProjects = PROJECTS.filter((p) =>
    p.teamMembers.some((m) => m.id === empId)
  )

  const colors = ['#6C8EFF','#FF8C6B','#4ADE80','#FACC15','#38BDF8','#C084FC']
  const color = colors[(employee.firstName.charCodeAt(0) + employee.lastName.charCodeAt(0)) % colors.length]

  return (
    <Box>
      {/* Back */}
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate('/employees')}
        variant="text"
        size="small"
        sx={{ color: '#475569', mb: 2, '&:hover': { color: '#94A3B8' } }}
      >
        All Employees
      </Button>

      <Grid container spacing={2.5}>
        {/* ── Left Column: Profile Card ── */}
        <Grid item xs={12} md={4} lg={3}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent sx={{ p: 2.5 }}>
              {/* Hero */}
              <Box
                sx={{
                  mb: 2.5, p: 2.5, borderRadius: 2.5, textAlign: 'center',
                  background: `linear-gradient(135deg, ${alpha(color, 0.08)}, ${alpha(color, 0.03)})`,
                  border: `1px solid ${alpha(color, 0.12)}`,
                  position: 'relative',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, gap: 0.5 }}>
                  <Tooltip title="Edit" arrow>
                    <IconButton size="small" onClick={() => navigate(`/employees/${id}/edit`)} sx={{ color: '#475569', '&:hover': { color: '#FACC15' } }}>
                      <EditRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton size="small" onClick={() => setShowDelete(true)} sx={{ color: '#475569', '&:hover': { color: '#F87171' } }}>
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <EmployeeAvatar
                  firstName={employee.firstName}
                  lastName={employee.lastName}
                  email={employee.email}
                  avatarUrl={employee.avatarUrl}
                  size="lg"
                />
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', lineHeight: 1.2 }}>
                    {employee.firstName} {employee.lastName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>
                    {employee.designation.name}
                  </Typography>
                  <StatusChip status={employee.isActive ? 'active' : 'inactive'} />
                </Box>
              </Box>

              {/* Tenure badge */}
              <Box
                sx={{
                  display: 'flex', justifyContent: 'space-between',
                  p: 1.5, borderRadius: 2, mb: 2,
                  background: 'rgba(148,163,184,0.04)',
                  border: '1px solid rgba(148,163,184,0.08)',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 700, color: '#F1F5F9', fontSize: '1rem', lineHeight: 1 }}>
                    {tenureLabel}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.62rem' }}>Tenure</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 700, color: '#4ADE80', fontSize: '1rem', lineHeight: 1 }}>
                    ${employee.salary.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.62rem' }}>/month</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 700, color: '#6C8EFF', fontSize: '1rem', lineHeight: 1 }}>
                    {assignedProjects.length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.62rem' }}>Projects</Typography>
                </Box>
              </Box>

              {/* Meta */}
              <Divider sx={{ mb: 1.5 }} />
              <MetaRow icon={<EmailRoundedIcon />} label="Email" value={employee.email} />
              {employee.phone && <MetaRow icon={<PhoneRoundedIcon />} label="Phone" value={employee.phone} />}
              {employee.city && <MetaRow icon={<LocationOnRoundedIcon />} label="Location" value={`${employee.city}, ${employee.country}`} />}
              <MetaRow icon={<CalendarTodayRoundedIcon />} label="Joined" value={format(new Date(employee.joiningDate), 'MMMM d, yyyy')} />

              <Divider sx={{ my: 1.5 }} />

              {/* Dept */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.7rem' }}>Department</Typography>
                <Chip
                  label={employee.department.name}
                  size="small"
                  sx={{
                    height: 20, fontSize: '0.68rem', fontWeight: 600,
                    background: alpha('#FF8C6B', 0.1), color: '#FF8C6B',
                    border: '1px solid rgba(255,140,107,0.2)',
                    '& .MuiChip-label': { px: 0.8 },
                  }}
                />
              </Box>

              {/* Skills */}
              {employee.skills.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.8 }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {employee.skills.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        sx={{
                          height: 20, fontSize: '0.68rem', fontWeight: 600,
                          background: alpha('#6C8EFF', 0.08), color: '#6C8EFF',
                          border: '1px solid rgba(108,142,255,0.15)',
                          '& .MuiChip-label': { px: 0.8 },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right Column: Tabbed detail ── */}
        <Grid item xs={12} md={8} lg={9}>
          <Card>
            <Box sx={{ borderBottom: '1px solid rgba(148,163,184,0.08)', px: 2 }}>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '0.82rem', fontWeight: 600, color: '#475569',
                    textTransform: 'none', minHeight: 48,
                    '&.Mui-selected': { color: '#6C8EFF' },
                  },
                  '& .MuiTabs-indicator': { background: '#6C8EFF', height: 2 },
                }}
              >
                <Tab label={`Projects (${assignedProjects.length})`} />
                <Tab label={`Leave History (${leaveRequests.length})`} />
                <Tab label={`Audit Trail (${auditLogs.length})`} />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 2.5, minHeight: 400 }}>
              {/* ── Projects Tab ── */}
              {tab === 0 && (
                <Box>
                  {assignedProjects.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                      <FolderSpecialRoundedIcon sx={{ fontSize: 32, color: '#1E293B', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: '#334155' }}>
                        Not assigned to any projects
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={1.5}>
                      {assignedProjects.map((proj) => {
                        const pColors: Record<string, string> = { Active: '#4ADE80', Completed: '#6C8EFF', OnHold: '#FACC15', Planning: '#38BDF8' }
                        const pColor = pColors[proj.status] ?? '#94A3B8'
                        const progress = Math.round((proj.completedTaskCount / (proj.taskCount || 1)) * 100)
                        return (
                          <Grid item xs={12} sm={6} key={proj.id}>
                            <Box
                              sx={{
                                p: 2, borderRadius: 2,
                                border: `1px solid ${alpha(pColor, 0.15)}`,
                                background: alpha(pColor, 0.03),
                                cursor: 'pointer',
                                '&:hover': { borderColor: alpha(pColor, 0.3) },
                              }}
                              onClick={() => navigate(`/projects/${proj.id}`)}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#E2E8F0', fontSize: '0.85rem' }}>
                                  {proj.name}
                                </Typography>
                                <Chip
                                  label={proj.status}
                                  size="small"
                                  sx={{
                                    height: 18, fontSize: '0.62rem', fontWeight: 700,
                                    background: alpha(pColor, 0.1), color: pColor,
                                    '& .MuiChip-label': { px: 0.7 },
                                  }}
                                />
                              </Box>
                              <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem' }}>
                                {proj.completedTaskCount}/{proj.taskCount} tasks · {progress}% complete
                              </Typography>
                            </Box>
                          </Grid>
                        )
                      })}
                    </Grid>
                  )}
                </Box>
              )}

              {/* ── Leave History Tab ── */}
              {tab === 1 && <LeaveHistoryPanel leaveRequests={leaveRequests} />}

              {/* ── Audit Trail Tab ── */}
              {tab === 2 && <AuditTrailPanel logs={auditLogs} />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={showDelete}
        title="Delete Employee"
        description={`Are you sure you want to soft-delete ${employee.firstName} ${employee.lastName}? Their records will be retained but they will be marked inactive.`}
        confirmLabel="Delete Employee"
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setShowDelete(false)}
        loading={deleteMutation.isPending}
      />
    </Box>
  )
}
