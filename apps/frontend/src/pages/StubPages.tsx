import { Box, Typography, Button, alpha } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded'

interface ComingSoonProps {
  title: string
  description: string
  color?: string
}

export function ComingSoonPage({ title, description, color = '#6C8EFF' }: ComingSoonProps) {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 72, height: 72, borderRadius: 4, mb: 3,
          background: alpha(color, 0.1),
          border: `1px solid ${alpha(color, 0.2)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
        }}
      >
        <ConstructionRoundedIcon sx={{ fontSize: 32 }} />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: '#475569', mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>
      <Button variant="outlined" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </Button>
    </Box>
  )
}

export function ProjectsPage() {
  return (
    <ComingSoonPage
      title="Projects & Tasks"
      description="Project overview with Kanban task boards and team management."
      color="#FF8C6B"
    />
  )
}

export function AuditPage() {
  return (
    <ComingSoonPage
      title="Audit Log"
      description="Full system-wide audit trail with filtering and entity drill-down."
      color="#4ADE80"
    />
  )
}

export function NotFoundPage() {
  return (
    <ComingSoonPage
      title="404 — Not Found"
      description="This page doesn't exist."
      color="#F87171"
    />
  )
}
