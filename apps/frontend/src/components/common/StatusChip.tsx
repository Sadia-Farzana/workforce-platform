import { Chip, alpha } from '@mui/material'

type StatusVariant =
  | 'active' | 'inactive'
  | 'Active' | 'Completed' | 'OnHold' | 'Planning'
  | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
  | 'Todo' | 'InProgress' | 'InReview' | 'Done' | 'Blocked'
  | 'Low' | 'Medium' | 'High' | 'Critical'

interface StatusChipProps {
  status: StatusVariant | string
  size?: 'small' | 'medium'
}

const CONFIG: Record<string, { color: string; label: string }> = {
  active:    { color: '#4ADE80', label: 'Active' },
  inactive:  { color: '#F87171', label: 'Inactive' },
  Active:    { color: '#4ADE80', label: 'Active' },
  Completed: { color: '#6C8EFF', label: 'Completed' },
  OnHold:    { color: '#FACC15', label: 'On Hold' },
  Planning:  { color: '#38BDF8', label: 'Planning' },
  Pending:   { color: '#FACC15', label: 'Pending' },
  Approved:  { color: '#4ADE80', label: 'Approved' },
  Rejected:  { color: '#F87171', label: 'Rejected' },
  Cancelled: { color: '#94A3B8', label: 'Cancelled' },
  Todo:      { color: '#94A3B8', label: 'Todo' },
  InProgress:{ color: '#38BDF8', label: 'In Progress' },
  InReview:  { color: '#C084FC', label: 'In Review' },
  Done:      { color: '#4ADE80', label: 'Done' },
  Blocked:   { color: '#F87171', label: 'Blocked' },
  Low:       { color: '#4ADE80', label: 'Low' },
  Medium:    { color: '#FACC15', label: 'Medium' },
  High:      { color: '#FF8C6B', label: 'High' },
  Critical:  { color: '#F87171', label: 'Critical' },
}

export default function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const cfg = CONFIG[status] ?? { color: '#94A3B8', label: status }

  return (
    <Chip
      label={cfg.label}
      size={size}
      sx={{
        height: size === 'small' ? 22 : 28,
        fontSize: size === 'small' ? '0.68rem' : '0.78rem',
        fontWeight: 700,
        background: alpha(cfg.color, 0.12),
        color: cfg.color,
        border: `1px solid ${alpha(cfg.color, 0.25)}`,
        '& .MuiChip-label': { px: size === 'small' ? 1 : 1.5 },
      }}
    />
  )
}
