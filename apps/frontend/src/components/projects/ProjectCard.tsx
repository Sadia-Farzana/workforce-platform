import {
  Card, CardContent, Box, Typography, Chip, LinearProgress,
  AvatarGroup, Avatar, Tooltip, alpha,
} from '@mui/material'
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import type { Project } from '@/types'
import { format, differenceInDays, isPast } from 'date-fns'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

const STATUS_CFG = {
  Active:    { color: '#4ADE80', label: 'Active' },
  Completed: { color: '#6C8EFF', label: 'Completed' },
  OnHold:    { color: '#FACC15', label: 'On Hold' },
  Planning:  { color: '#38BDF8', label: 'Planning' },
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const cfg = STATUS_CFG[project.status] ?? STATUS_CFG.Active
  const progress = project.taskCount > 0
    ? Math.round((project.completedTaskCount / project.taskCount) * 100)
    : 0

  const daysLeft = project.endDate
    ? differenceInDays(new Date(project.endDate), new Date())
    : null
  const isOverdue = daysLeft !== null && daysLeft < 0 && project.status !== 'Completed'

  const avatarColors = ['#6C8EFF', '#FF8C6B', '#4ADE80', '#FACC15', '#38BDF8', '#C084FC']

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${alpha(cfg.color, 0.25)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box
            sx={{
              width: 38, height: 38, borderRadius: 2, flexShrink: 0,
              background: alpha(cfg.color, 0.1),
              border: `1px solid ${alpha(cfg.color, 0.2)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: cfg.color,
            }}
          >
            <FolderSpecialRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Chip
            label={cfg.label}
            size="small"
            sx={{
              height: 22, fontSize: '0.68rem', fontWeight: 700,
              background: alpha(cfg.color, 0.12), color: cfg.color,
              border: `1px solid ${alpha(cfg.color, 0.25)}`,
              '& .MuiChip-label': { px: 1 },
            }}
          />
        </Box>

        {/* Title + Description */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.95rem', mb: 0.5, lineHeight: 1.3 }}>
          {project.name}
        </Typography>
        {project.description && (
          <Typography
            variant="caption"
            sx={{
              color: '#475569', fontSize: '0.78rem', mb: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {project.description}
          </Typography>
        )}

        {/* Progress */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem' }}>
              {project.completedTaskCount} / {project.taskCount} tasks
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700, fontSize: '0.75rem',
                color: progress === 100 ? '#4ADE80' : cfg.color,
              }}
            >
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 5,
              '& .MuiLinearProgress-bar': {
                background: progress === 100
                  ? 'linear-gradient(90deg, #4ADE80, #22C55E)'
                  : `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})`,
              },
            }}
          />
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
          {/* Team avatars */}
          <AvatarGroup
            max={4}
            sx={{
              '& .MuiAvatar-root': { width: 26, height: 26, fontSize: '0.65rem', fontWeight: 700, border: '2px solid #0D1525' },
              '& .MuiAvatarGroup-avatar': { background: '#1E293B', color: '#64748B', fontSize: '0.62rem' },
            }}
          >
            {project.teamMembers.map((m, i) => (
              <Tooltip key={m.id} title={`${m.firstName} ${m.lastName}`} arrow>
                <Avatar
                  src={m.avatarUrl}
                  sx={{ background: alpha(avatarColors[i % avatarColors.length], 0.15), color: avatarColors[i % avatarColors.length] }}
                >
                  {m.firstName[0]}{m.lastName[0]}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>

          {/* Date / Overdue */}
          {project.endDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayRoundedIcon sx={{ fontSize: 12, color: isOverdue ? '#F87171' : '#334155' }} />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.68rem',
                  color: isOverdue ? '#F87171' : '#475569',
                  fontWeight: isOverdue ? 700 : 400,
                }}
              >
                {isOverdue
                  ? `${Math.abs(daysLeft!)}d overdue`
                  : daysLeft === 0 ? 'Due today'
                  : daysLeft !== null && daysLeft <= 7 ? `${daysLeft}d left`
                  : format(new Date(project.endDate), 'MMM d, yyyy')}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
