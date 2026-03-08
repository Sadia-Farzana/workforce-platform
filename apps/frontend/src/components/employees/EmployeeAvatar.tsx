import { Box, Avatar, Typography, alpha } from '@mui/material'

interface EmployeeAvatarProps {
  firstName: string
  lastName: string
  email: string
  avatarUrl?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = { sm: 32, md: 40, lg: 52 }

export default function EmployeeAvatar({
  firstName, lastName, email, avatarUrl, size = 'md',
}: EmployeeAvatarProps) {
  const px = SIZE_MAP[size]
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()

  // Deterministic color from name
  const colors = ['#6C8EFF', '#FF8C6B', '#4ADE80', '#FACC15', '#38BDF8', '#C084FC', '#FB7185']
  const colorIndex = (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % colors.length
  const color = colors[colorIndex]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar
        src={avatarUrl}
        sx={{
          width: px, height: px,
          border: `2px solid ${alpha(color, 0.3)}`,
          background: alpha(color, 0.15),
          color,
          fontSize: size === 'lg' ? '1.1rem' : size === 'md' ? '0.85rem' : '0.72rem',
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initials}
      </Avatar>
      {size !== 'sm' && (
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: '#E2E8F0',
              fontSize: size === 'lg' ? '1rem' : '0.85rem',
              lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {firstName} {lastName}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#475569',
              fontSize: '0.72rem',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block',
            }}
          >
            {email}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
