import {
  Box, Typography, Chip, Avatar, Tooltip, IconButton, alpha,
} from '@mui/material'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import type { Task } from '@/types'
import { format, isPast, isToday } from 'date-fns'

interface TaskCardProps {
  task: Task
  onClick: () => void
  onDelete: () => void
  dragging?: boolean
}

const PRIORITY_CFG = {
  Low:      { color: '#4ADE80', dot: '●' },
  Medium:   { color: '#FACC15', dot: '●' },
  High:     { color: '#FF8C6B', dot: '●' },
  Critical: { color: '#F87171', dot: '◆' },
}

export default function TaskCard({ task, onClick, onDelete, dragging }: TaskCardProps) {
  const pCfg = PRIORITY_CFG[task.priority] ?? PRIORITY_CFG.Medium
  const avatarColors = ['#6C8EFF','#FF8C6B','#4ADE80','#FACC15','#38BDF8','#C084FC']
  const emp = task.assignedEmployee
  const aColor = emp
    ? avatarColors[(emp.firstName.charCodeAt(0) + emp.lastName.charCodeAt(0)) % avatarColors.length]
    : '#94A3B8'

  const dueDateOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Done'
  const dueDateToday   = task.dueDate && isToday(new Date(task.dueDate))

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 1.8,
        borderRadius: 2,
        background: dragging ? '#1E2D45' : '#111827',
        border: `1px solid ${dragging ? 'rgba(108,142,255,0.35)' : 'rgba(148,163,184,0.08)'}`,
        cursor: 'grab',
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.1s',
        boxShadow: dragging ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
        transform: dragging ? 'rotate(1.5deg)' : 'none',
        '&:hover': {
          borderColor: 'rgba(108,142,255,0.25)',
          background: '#131c2e',
        },
        '&:hover .task-delete': { opacity: 1 },
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Priority dot + delete */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Typography sx={{ color: pCfg.color, fontSize: '0.6rem', lineHeight: 1 }}>
            {pCfg.dot}
          </Typography>
          <Typography variant="caption" sx={{ color: pCfg.color, fontSize: '0.65rem', fontWeight: 700, fontFamily: '"JetBrains Mono",monospace', textTransform: 'uppercase' }}>
            {task.priority}
          </Typography>
        </Box>
        <IconButton
          className="task-delete"
          size="small"
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          sx={{ opacity: 0, transition: 'opacity 0.15s', color: '#475569', p: 0.3, '&:hover': { color: '#F87171' } }}
        >
          <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Title */}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600, color: '#E2E8F0', fontSize: '0.83rem',
          lineHeight: 1.4, mb: 1.2,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}
      >
        {task.title}
      </Typography>

      {/* Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Due date */}
        {task.dueDate ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <CalendarTodayRoundedIcon sx={{ fontSize: 11, color: dueDateOverdue ? '#F87171' : dueDateToday ? '#FACC15' : '#334155' }} />
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"JetBrains Mono",monospace', fontSize: '0.65rem',
                color: dueDateOverdue ? '#F87171' : dueDateToday ? '#FACC15' : '#475569',
                fontWeight: dueDateOverdue || dueDateToday ? 700 : 400,
              }}
            >
              {dueDateOverdue ? 'Overdue' : format(new Date(task.dueDate), 'MMM d')}
            </Typography>
          </Box>
        ) : <Box />}

        {/* Assignee */}
        {emp && (
          <Tooltip title={`${emp.firstName} ${emp.lastName}`} arrow>
            <Avatar
              src={emp.avatarUrl}
              sx={{
                width: 22, height: 22, fontSize: '0.6rem', fontWeight: 700,
                background: alpha(aColor, 0.15), color: aColor,
                border: `1px solid ${alpha(aColor, 0.3)}`,
              }}
            >
              {emp.firstName[0]}{emp.lastName[0]}
            </Avatar>
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}
