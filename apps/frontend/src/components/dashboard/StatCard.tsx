import { Box, Card, Typography, Skeleton, alpha } from '@mui/material'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'

interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color: string
  trend?: { value: number; label: string }
  loading?: boolean
}

export default function StatCard({ label, value, subtitle, icon, color, trend, loading }: StatCardProps) {
  if (loading) {
    return (
      <Card sx={{ p: 2.5, height: '100%' }}>
        <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
      </Card>
    )
  }

  return (
    <Card
      sx={{
        p: 2.5,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${alpha(color, 0.2)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: alpha(color, 0.05),
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography
          variant="overline"
          sx={{ color: '#475569', fontSize: '0.65rem', letterSpacing: '0.1em', lineHeight: 1 }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 2,
            background: alpha(color, 0.12),
            border: `1px solid ${alpha(color, 0.2)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color,
            '& .MuiSvgIcon-root': { fontSize: 18 },
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography
        variant="h3"
        sx={{ fontWeight: 800, color: '#F1F5F9', lineHeight: 1, mb: 0.5, fontSize: { xs: '1.8rem', md: '2.2rem' } }}
      >
        {value}
      </Typography>

      {subtitle && (
        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.78rem', mb: trend ? 1.5 : 0 }}>
          {subtitle}
        </Typography>
      )}

      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          {trend.value >= 0
            ? <TrendingUpRoundedIcon sx={{ fontSize: 14, color: '#4ADE80' }} />
            : <TrendingDownRoundedIcon sx={{ fontSize: 14, color: '#F87171' }} />
          }
          <Typography
            variant="caption"
            sx={{ color: trend.value >= 0 ? '#4ADE80' : '#F87171', fontWeight: 600 }}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            {trend.label}
          </Typography>
        </Box>
      )}
    </Card>
  )
}
