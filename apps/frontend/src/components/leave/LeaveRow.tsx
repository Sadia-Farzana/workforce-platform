import { useState } from 'react'
import {
  Box, Typography, IconButton, Tooltip, Button, alpha,
} from '@mui/material'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import { useNavigate } from 'react-router-dom'
import LeaveTypeBadge from './LeaveTypeBadge'
import ApprovalHistory from './ApprovalHistory'
import StatusChip from '@/components/common/StatusChip'
import type { LeaveRequest } from '@/types'
import { format, differenceInDays } from 'date-fns'

interface LeaveRowProps {
  request: LeaveRequest
  onApprove: (request: LeaveRequest) => void
  onReject: (request: LeaveRequest) => void
}

export default function LeaveRow({ request, onApprove, onReject }: LeaveRowProps) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const navigate = useNavigate()

  const days = differenceInDays(new Date(request.endDate), new Date(request.startDate)) + 1
  const isPending = request.status === 'Pending'

  return (
    <Box
      sx={{
        borderBottom: '1px solid rgba(148,163,184,0.06)',
        '&:last-child': { borderBottom: 'none' },
        transition: 'background 0.15s',
        '&:hover': { background: alpha('#6C8EFF', 0.02) },
      }}
    >
      <Box sx={{ px: 2.5, py: 1.8, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>

        {/* Employee */}
        <Box sx={{ minWidth: 150, flex: '0 0 150px' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#E2E8F0', fontSize: '0.85rem', mb: 0.2 }}>
            {request.employeeName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#475569', fontSize: '0.7rem', cursor: 'pointer', '&:hover': { color: '#6C8EFF' } }}
            onClick={() => navigate(`/employees/${request.employeeId}`)}
          >
            View profile →
          </Typography>
        </Box>

        {/* Type */}
        <Box sx={{ flex: '0 0 auto' }}>
          <LeaveTypeBadge type={request.leaveType} startDate={request.startDate} endDate={request.endDate} showDuration />
        </Box>

        {/* Date range */}
        <Box sx={{ flex: '1 1 180px', minWidth: 140 }}>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: '"JetBrains Mono",monospace', fontSize: '0.72rem', display: 'block' }}>
            {format(new Date(request.startDate), 'MMM d')} → {format(new Date(request.endDate), 'MMM d, yyyy')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.68rem' }}>
            {days} day{days !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* Status */}
        <Box sx={{ flex: '0 0 90px' }}>
          <StatusChip status={request.status} />
        </Box>

        {/* Reason preview */}
        {request.reason && (
          <Box sx={{ flex: '1 1 160px', minWidth: 120 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#475569', fontStyle: 'italic', fontSize: '0.72rem',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                display: 'block', maxWidth: 200,
              }}
            >
              "{request.reason}"
            </Typography>
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          {isPending && (
            <>
              <Tooltip title="Approve" arrow>
                <IconButton
                  size="small"
                  onClick={() => onApprove(request)}
                  sx={{
                    color: '#4ADE80', border: '1px solid rgba(74,222,128,0.2)',
                    borderRadius: 1.5, p: 0.6,
                    '&:hover': { background: alpha('#4ADE80', 0.1), borderColor: 'rgba(74,222,128,0.4)' },
                  }}
                >
                  <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject" arrow>
                <IconButton
                  size="small"
                  onClick={() => onReject(request)}
                  sx={{
                    color: '#F87171', border: '1px solid rgba(248,113,113,0.2)',
                    borderRadius: 1.5, p: 0.6,
                    '&:hover': { background: alpha('#F87171', 0.1), borderColor: 'rgba(248,113,113,0.4)' },
                  }}
                >
                  <CancelOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </>
          )}

          {/* History toggle */}
          <Tooltip title={historyOpen ? 'Hide history' : 'Show history'} arrow>
            <IconButton
              size="small"
              onClick={() => setHistoryOpen(!historyOpen)}
              sx={{
                color: historyOpen ? '#6C8EFF' : '#334155',
                transition: 'transform 0.2s, color 0.15s',
                transform: historyOpen ? 'rotate(180deg)' : 'none',
                '&:hover': { color: '#6C8EFF' },
              }}
            >
              <ExpandMoreRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Inline approval history */}
      <Box sx={{ px: 2.5, pb: historyOpen ? 1.5 : 0 }}>
        <ApprovalHistory history={request.approvalHistory} open={historyOpen} />
      </Box>
    </Box>
  )
}
