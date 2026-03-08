import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, TextField, Button, alpha,
} from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import type { LeaveRequest, LeaveStatus } from '@/types'
import LeaveTypeBadge from './LeaveTypeBadge'
import StatusChip from '@/components/common/StatusChip'
import { format, differenceInDays } from 'date-fns'

interface ApprovalDialogProps {
  open: boolean
  request: LeaveRequest | null
  action: 'Approved' | 'Rejected' | null
  onConfirm: (status: LeaveStatus, comment: string) => void
  onCancel: () => void
  loading?: boolean
}

export default function ApprovalDialog({
  open, request, action, onConfirm, onCancel, loading,
}: ApprovalDialogProps) {
  const [comment, setComment] = useState('')

  if (!request || !action) return null

  const isApprove = action === 'Approved'
  const color = isApprove ? '#4ADE80' : '#F87171'
  const days = differenceInDays(new Date(request.endDate), new Date(request.startDate)) + 1

  const handleConfirm = () => {
    onConfirm(action as LeaveStatus, comment)
    setComment('')
  }

  const handleCancel = () => {
    setComment('')
    onCancel()
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      PaperProps={{
        sx: {
          background: '#0D1525',
          border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: 3,
          minWidth: 440,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: 2,
            background: alpha(color, 0.1),
            border: `1px solid ${alpha(color, 0.25)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color,
          }}>
            {isApprove
              ? <CheckCircleRoundedIcon sx={{ fontSize: 20 }} />
              : <CancelRoundedIcon sx={{ fontSize: 20 }} />
            }
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '1rem' }}>
              {isApprove ? 'Approve Leave Request' : 'Reject Leave Request'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569' }}>
              Review the request below before confirming
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        {/* Request summary */}
        <Box
          sx={{
            p: 2, mb: 2, borderRadius: 2,
            background: 'rgba(148,163,184,0.04)',
            border: '1px solid rgba(148,163,184,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#F1F5F9', mb: 0.3 }}>
                {request.employeeName}
              </Typography>
              <LeaveTypeBadge
                type={request.leaveType}
                startDate={request.startDate}
                endDate={request.endDate}
                showDuration
              />
            </Box>
            <StatusChip status={request.status} />
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.65rem', display: 'block' }}>From</Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', fontFamily: '"JetBrains Mono",monospace', fontSize: '0.8rem', fontWeight: 600 }}>
                {format(new Date(request.startDate), 'MMM d, yyyy')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.65rem', display: 'block' }}>To</Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', fontFamily: '"JetBrains Mono",monospace', fontSize: '0.8rem', fontWeight: 600 }}>
                {format(new Date(request.endDate), 'MMM d, yyyy')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.65rem', display: 'block' }}>Duration</Typography>
              <Typography variant="body2" sx={{ color, fontFamily: '"JetBrains Mono",monospace', fontSize: '0.8rem', fontWeight: 700 }}>
                {days} day{days !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>

          {request.reason && (
            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(148,163,184,0.08)' }}>
              <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.65rem', display: 'block', mb: 0.3 }}>
                Employee's reason
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontStyle: 'italic' }}>
                "{request.reason}"
              </Typography>
            </Box>
          )}
        </Box>

        {/* Comment */}
        <TextField
          label={`Comment ${isApprove ? '(optional)' : '(recommended)'}`}
          placeholder={isApprove
            ? 'Add a note for the employee…'
            : 'Please provide a reason for rejection…'}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={3}
          fullWidth
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: alpha(color, 0.2) },
              '&:hover fieldset': { borderColor: alpha(color, 0.4) },
              '&.Mui-focused fieldset': { borderColor: color },
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={handleCancel} disabled={loading} size="small">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={loading}
          size="small"
          sx={{
            background: color,
            color: '#0D1525',
            fontWeight: 700,
            '&:hover': {
              background: isApprove ? '#22C55E' : '#DC2626',
              boxShadow: `0 4px 16px ${alpha(color, 0.4)}`,
            },
          }}
        >
          {loading ? 'Processing…' : isApprove ? '✓ Approve' : '✕ Reject'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
