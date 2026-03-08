import { Box, Chip, Typography, alpha } from '@mui/material'
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import CoffeeRoundedIcon from '@mui/icons-material/CoffeeRounded'
import MoneyOffRoundedIcon from '@mui/icons-material/MoneyOffRounded'
import ChildCareRoundedIcon from '@mui/icons-material/ChildCareRounded'
import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded'
import type { LeaveType } from '@/types'
import { differenceInDays } from 'date-fns'

interface LeaveTypeBadgeProps {
  type: LeaveType
  startDate?: string
  endDate?: string
  showDuration?: boolean
  size?: 'small' | 'medium'
}

export const LEAVE_TYPE_CFG: Record<LeaveType, { color: string; icon: React.ReactNode; label: string }> = {
  Annual:    { color: '#6C8EFF', icon: <BeachAccessRoundedIcon />,      label: 'Annual' },
  Sick:      { color: '#F87171', icon: <LocalHospitalRoundedIcon />,    label: 'Sick' },
  Casual:    { color: '#38BDF8', icon: <CoffeeRoundedIcon />,           label: 'Casual' },
  Unpaid:    { color: '#94A3B8', icon: <MoneyOffRoundedIcon />,         label: 'Unpaid' },
  Maternity: { color: '#C084FC', icon: <ChildCareRoundedIcon />,        label: 'Maternity' },
  Paternity: { color: '#4ADE80', icon: <FamilyRestroomRoundedIcon />,   label: 'Paternity' },
}

export default function LeaveTypeBadge({ type, startDate, endDate, showDuration, size = 'small' }: LeaveTypeBadgeProps) {
  const cfg = LEAVE_TYPE_CFG[type] ?? LEAVE_TYPE_CFG.Casual
  const h = size === 'small' ? 22 : 28

  const days = startDate && endDate
    ? differenceInDays(new Date(endDate), new Date(startDate)) + 1
    : null

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
      <Chip
        icon={<Box sx={{ color: `${cfg.color} !important`, display: 'flex', '& .MuiSvgIcon-root': { fontSize: size === 'small' ? 13 : 16 } }}>{cfg.icon}</Box>}
        label={cfg.label}
        size="small"
        sx={{
          height: h,
          fontSize: size === 'small' ? '0.68rem' : '0.78rem',
          fontWeight: 700,
          background: alpha(cfg.color, 0.12),
          color: cfg.color,
          border: `1px solid ${alpha(cfg.color, 0.25)}`,
          '& .MuiChip-icon': { ml: 0.8 },
          '& .MuiChip-label': { pl: 0.6, pr: size === 'small' ? 0.8 : 1 },
        }}
      />
      {showDuration && days !== null && (
        <Typography
          variant="caption"
          sx={{
            color: '#64748B',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.68rem',
          }}
        >
          {days}d
        </Typography>
      )}
    </Box>
  )
}
