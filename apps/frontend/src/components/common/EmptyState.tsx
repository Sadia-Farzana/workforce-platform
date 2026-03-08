import { Box, Typography, Button, alpha } from '@mui/material'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  color?: string
}

export default function EmptyState({
  icon, title, description, action, color = '#6C8EFF',
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        py: 8, textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 64, height: 64, borderRadius: 4, mb: 2.5,
          background: alpha(color, 0.08),
          border: `1px solid ${alpha(color, 0.2)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color, '& .MuiSvgIcon-root': { fontSize: 28 },
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#E2E8F0', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#475569', maxWidth: 320, mb: action ? 3 : 0 }}>
        {description}
      </Typography>
      {action && (
        <Button variant="contained" onClick={action.onClick} size="small">
          {action.label}
        </Button>
      )}
    </Box>
  )
}
