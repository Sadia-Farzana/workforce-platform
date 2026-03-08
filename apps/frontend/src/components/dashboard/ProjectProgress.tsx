import {
  Card, CardContent, Typography, Box, LinearProgress,
  Chip, Skeleton,
} from '@mui/material'
import type { ProjectStat } from '@/types'

interface Props {
  data: ProjectStat[]
  loading?: boolean
}

const STATUS_CONFIG = {
  Active: { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.1)', label: 'Active' },
  Planning: { color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.1)', label: 'Planning' },
  Completed: { color: '#6C8EFF', bg: 'rgba(108, 142, 255, 0.1)', label: 'Done' },
  OnHold: { color: '#FACC15', bg: 'rgba(250, 204, 21, 0.1)', label: 'On Hold' },
}

export default function ProjectProgress({ data, loading }: Props) {
  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={60} sx={{ borderRadius: 2, mb: 1 }} />
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
            Project Progress
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            All projects at a glance
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.map((project) => {
            const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.Active
            return (
              <Box key={project.projectId}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600, color: '#E2E8F0', fontSize: '0.83rem',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}
                    >
                      {project.projectName}
                    </Typography>
                    <Chip
                      label={cfg.label}
                      size="small"
                      sx={{
                        height: 18, fontSize: '0.62rem', fontWeight: 700,
                        background: cfg.bg, color: cfg.color,
                        border: `1px solid ${cfg.color}30`,
                        flexShrink: 0,
                        '& .MuiChip-label': { px: 0.8 },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        color: '#94A3B8', fontSize: '0.72rem',
                      }}
                    >
                      👥 {project.teamSize}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        color: project.progress === 100 ? '#4ADE80' : '#94A3B8',
                        fontWeight: 700, fontSize: '0.75rem',
                      }}
                    >
                      {project.progress}%
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{
                    height: 6,
                    '& .MuiLinearProgress-bar': {
                      background: project.progress === 100
                        ? 'linear-gradient(90deg, #4ADE80, #22C55E)'
                        : `linear-gradient(90deg, ${cfg.color}AA, ${cfg.color})`,
                    },
                  }}
                />
                {project.daysRemaining !== undefined && project.status !== 'Completed' && (
                  <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.68rem', mt: 0.3, display: 'block' }}>
                    {project.daysRemaining} days remaining
                  </Typography>
                )}
              </Box>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}
