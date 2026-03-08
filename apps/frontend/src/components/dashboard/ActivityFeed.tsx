import {
  Card, CardContent, Typography, Box, Chip, Skeleton, Divider,
} from '@mui/material'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import { formatDistanceToNow } from 'date-fns'
import type { AuditLog } from '@/types'

interface Props {
  data: AuditLog[]
  loading?: boolean
}

const EVENT_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  EMPLOYEE_CREATED: { icon: <PersonAddAltRoundedIcon />, color: '#4ADE80', label: 'New Employee' },
  EMPLOYEE_UPDATED: { icon: <EditNoteRoundedIcon />, color: '#6C8EFF', label: 'Employee Updated' },
  LEAVE_APPROVED: { icon: <CheckCircleOutlineRoundedIcon />, color: '#4ADE80', label: 'Leave Approved' },
  LEAVE_SUBMITTED: { icon: <EventAvailableRoundedIcon />, color: '#38BDF8', label: 'Leave Submitted' },
  PROJECT_STATUS_CHANGED: { icon: <SwapHorizRoundedIcon />, color: '#FACC15', label: 'Project Updated' },
  TASK_COMPLETED: { icon: <AssignmentTurnedInRoundedIcon />, color: '#C084FC', label: 'Task Done' },
}

function getEventConfig(eventType: string) {
  return EVENT_CONFIG[eventType] || { icon: <EditNoteRoundedIcon />, color: '#94A3B8', label: eventType }
}

export default function ActivityFeed({ data, loading }: Props) {
  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Skeleton height={24} width={160} sx={{ mb: 2 }} />
          {[...Array(5)].map((_, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Box sx={{ flex: 1 }}>
                <Skeleton height={16} width="70%" />
                <Skeleton height={12} width="40%" sx={{ mt: 0.5 }} />
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.95rem' }}>
            Recent Activity
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            System-wide audit trail
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {data.map((log, index) => {
            const cfg = getEventConfig(log.eventType)
            const timeAgo = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })
            return (
              <Box key={log._id}>
                <Box sx={{ display: 'flex', gap: 1.5, py: 1.5 }}>
                  <Box
                    sx={{
                      width: 32, height: 32, borderRadius: 2, flexShrink: 0,
                      background: `${cfg.color}15`,
                      border: `1px solid ${cfg.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: cfg.color,
                      '& .MuiSvgIcon-root': { fontSize: 16 },
                    }}
                  >
                    {cfg.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3, flexWrap: 'wrap' }}>
                      <Chip
                        label={cfg.label}
                        size="small"
                        sx={{
                          height: 18, fontSize: '0.62rem', fontWeight: 700,
                          background: `${cfg.color}12`, color: cfg.color,
                          '& .MuiChip-label': { px: 0.7 },
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem', display: 'block', mb: 0.2 }}>
                      by <Box component="span" sx={{ color: '#94A3B8', fontWeight: 500 }}>{log.actor}</Box>
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#334155', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem' }}
                    >
                      {timeAgo}
                    </Typography>
                  </Box>
                </Box>
                {index < data.length - 1 && (
                  <Divider sx={{ borderColor: 'rgba(148,163,184,0.04)', ml: 5.5 }} />
                )}
              </Box>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}
