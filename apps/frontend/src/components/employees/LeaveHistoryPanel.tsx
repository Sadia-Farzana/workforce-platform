import {
  Box, Typography, Card, CardContent, Chip,
  Divider, Collapse, IconButton, Tooltip, alpha,
} from '@mui/material'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { useState } from 'react'
import StatusChip from '@/components/common/StatusChip'
import type { LeaveRequest } from '@/types'
import { format, differenceInDays } from 'date-fns'

interface LeaveHistoryPanelProps {
  leaveRequests: LeaveRequest[]
}

const LEAVE_TYPE_COLORS: Record<string, string> = {
  Annual:    '#6C8EFF',
  Sick:      '#F87171',
  Casual:    '#38BDF8',
  Unpaid:    '#94A3B8',
  Maternity: '#C084FC',
  Paternity: '#4ADE80',
}

function LeaveCard({ leave }: { leave: LeaveRequest }) {
  const [expanded, setExpanded] = useState(false)
  const days = differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1
  const color = LEAVE_TYPE_COLORS[leave.leaveType] ?? '#94A3B8'

  return (
    <Card
      sx={{
        mb: 1.5,
        border: `1px solid ${alpha(color, 0.12)}`,
        background: alpha(color, 0.02),
        boxShadow: 'none',
        transition: 'border-color 0.15s',
        '&:hover': { borderColor: alpha(color, 0.25) },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
              <Chip
                label={leave.leaveType}
                size="small"
                sx={{
                  height: 20, fontSize: '0.68rem', fontWeight: 700,
                  background: alpha(color, 0.12), color,
                  border: `1px solid ${alpha(color, 0.2)}`,
                  '& .MuiChip-label': { px: 0.8 },
                }}
              />
              <StatusChip status={leave.status} />
              <Typography
                variant="caption"
                sx={{ color: '#475569', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.68rem' }}
              >
                {days} day{days !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem' }}>
              {format(new Date(leave.startDate), 'MMM d')} → {format(new Date(leave.endDate), 'MMM d, yyyy')}
            </Typography>
            {leave.reason && (
              <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.3, fontSize: '0.75rem' }}>
                "{leave.reason}"
              </Typography>
            )}
          </Box>

          {leave.approvalHistory.length > 0 && (
            <Tooltip title={expanded ? 'Hide history' : 'View history'} arrow>
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{
                  color: '#475569',
                  transform: expanded ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              >
                <ExpandMoreRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Approval History - embedded array from MongoDB */}
        <Collapse in={expanded}>
          <Divider sx={{ my: 1.5, borderColor: 'rgba(148,163,184,0.06)' }} />
          <Typography
            variant="overline"
            sx={{ color: '#334155', fontSize: '0.6rem', letterSpacing: '0.1em', display: 'block', mb: 1 }}
          >
            Approval History
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {leave.approvalHistory.map((entry, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 6, height: 6, borderRadius: '50%', mt: 0.8, flexShrink: 0,
                    background: entry.status === 'Approved' ? '#4ADE80'
                      : entry.status === 'Rejected' ? '#F87171'
                      : '#FACC15',
                  }}
                />
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <StatusChip status={entry.status} />
                    <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.68rem' }}>
                      by {entry.changedBy}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#334155', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem' }}
                    >
                      {format(new Date(entry.changedAt), 'MMM d, HH:mm')}
                    </Typography>
                  </Box>
                  {entry.comment && (
                    <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.2, fontSize: '0.72rem' }}>
                      {entry.comment}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default function LeaveHistoryPanel({ leaveRequests }: LeaveHistoryPanelProps) {
  if (leaveRequests.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#334155' }}>
          No leave requests found
        </Typography>
      </Box>
    )
  }

  const stats = {
    approved: leaveRequests.filter((l) => l.status === 'Approved').length,
    pending:  leaveRequests.filter((l) => l.status === 'Pending').length,
    total:    leaveRequests.length,
  }

  return (
    <Box>
      {/* Summary chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {[
          { label: `${stats.total} Total`, color: '#94A3B8' },
          { label: `${stats.approved} Approved`, color: '#4ADE80' },
          { label: `${stats.pending} Pending`, color: '#FACC15' },
        ].map((s) => (
          <Chip
            key={s.label}
            label={s.label}
            size="small"
            sx={{
              height: 22, fontSize: '0.7rem', fontWeight: 600,
              background: alpha(s.color, 0.08), color: s.color,
              border: `1px solid ${alpha(s.color, 0.2)}`,
              '& .MuiChip-label': { px: 1 },
            }}
          />
        ))}
      </Box>

      {leaveRequests.map((leave) => (
        <LeaveCard key={leave._id} leave={leave} />
      ))}
    </Box>
  )
}
