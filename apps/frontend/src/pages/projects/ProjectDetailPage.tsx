import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip,
  LinearProgress, Divider, Avatar, AvatarGroup, Tooltip,
  Skeleton, alpha,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import KanbanBoard from '@/components/projects/KanbanBoard'
import ProjectFormDialog from '@/components/projects/ProjectFormDialog'
import StatusChip from '@/components/common/StatusChip'
import { projectApi, taskApi } from '@/services/api'
import type { Task, TaskStatus } from '@/types'
import { format, differenceInDays } from 'date-fns'

const STATUS_CFG = {
  Active:    { color: '#4ADE80' },
  Completed: { color: '#6C8EFF' },
  OnHold:    { color: '#FACC15' },
  Planning:  { color: '#38BDF8' },
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const projectId = Number(id)
  const [editOpen, setEditOpen] = useState(false)

  const { data: project, isLoading: projLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectApi.getById(projectId),
    enabled: !!id,
  })

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskApi.getByProject(projectId),
    enabled: !!id,
  })

  const updateProjectMutation = useMutation({
    mutationFn: (data: Partial<typeof project>) => projectApi.update(projectId, data!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setEditOpen(false)
    },
  })

  const createTaskMutation = useMutation({
    mutationFn: (payload: Partial<Task>) => taskApi.create(projectId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }),
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) => taskApi.update(id, data),
    onMutate: async ({ id: taskId, data }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] })
      const prev = queryClient.getQueryData<Task[]>(['tasks', projectId])
      queryClient.setQueryData<Task[]>(['tasks', projectId], (old) =>
        old?.map((t) => t.id === taskId ? { ...t, ...data } : t) ?? []
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['tasks', projectId], ctx.prev)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }),
  })

  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }),
  })

  if (projLoading) {
    return (
      <Box>
        <Skeleton height={60} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton height={200} sx={{ mb: 2, borderRadius: 3 }} />
        <Skeleton height={500} sx={{ borderRadius: 3 }} />
      </Box>
    )
  }

  if (!project) {
    return <Box sx={{ py: 8, textAlign: 'center' }}><Typography sx={{ color: '#475569' }}>Project not found.</Typography></Box>
  }

  const cfg = STATUS_CFG[project.status] ?? { color: '#94A3B8' }
  const progress = tasks.length > 0
    ? Math.round((tasks.filter((t) => t.status === 'Done').length / tasks.length) * 100)
    : 0

  const daysLeft = project.endDate
    ? differenceInDays(new Date(project.endDate), new Date())
    : null

  const avatarColors = ['#6C8EFF','#FF8C6B','#4ADE80','#FACC15','#38BDF8','#C084FC']

  const taskCounts = {
    total:      tasks.length,
    done:       tasks.filter((t) => t.status === 'Done').length,
    inProgress: tasks.filter((t) => t.status === 'InProgress').length,
    blocked:    tasks.filter((t) => t.status === 'Blocked').length,
  }

  return (
    <Box>
      {/* Back */}
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate('/projects')}
        variant="text" size="small"
        sx={{ color: '#475569', mb: 2, '&:hover': { color: '#94A3B8' } }}
      >
        All Projects
      </Button>

      {/* Project Header Card */}
      <Card sx={{ mb: 2.5, overflow: 'hidden', position: 'relative' }}>
        <Box sx={{ height: 3, background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }} />
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2.5} alignItems="flex-start">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', fontSize: '1.5rem' }}>
                  {project.name}
                </Typography>
                <StatusChip status={project.status} size="medium" />
                <Button
                  startIcon={<EditRoundedIcon />}
                  size="small"
                  variant="outlined"
                  onClick={() => setEditOpen(true)}
                  sx={{ ml: 'auto', flexShrink: 0 }}
                >
                  Edit
                </Button>
              </Box>
              {project.description && (
                <Typography variant="body2" sx={{ color: '#64748B', mb: 1.5 }}>
                  {project.description}
                </Typography>
              )}

              {/* Date range */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayRoundedIcon sx={{ fontSize: 13, color: '#334155' }} />
                  <Typography variant="caption" sx={{ color: '#475569', fontFamily: '"JetBrains Mono",monospace', fontSize: '0.72rem' }}>
                    {format(new Date(project.startDate), 'MMM d, yyyy')}
                    {project.endDate && ` → ${format(new Date(project.endDate), 'MMM d, yyyy')}`}
                  </Typography>
                </Box>
                {daysLeft !== null && project.status !== 'Completed' && (
                  <Chip
                    label={daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d remaining`}
                    size="small"
                    sx={{
                      height: 20, fontSize: '0.68rem', fontWeight: 700,
                      background: daysLeft < 0 ? alpha('#F87171', 0.12) : daysLeft <= 7 ? alpha('#FACC15', 0.12) : alpha('#4ADE80', 0.08),
                      color: daysLeft < 0 ? '#F87171' : daysLeft <= 7 ? '#FACC15' : '#4ADE80',
                      '& .MuiChip-label': { px: 0.8 },
                    }}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              {/* Progress */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="caption" sx={{ color: '#475569' }}>Overall Progress</Typography>
                  <Typography variant="caption" sx={{ color: cfg.color, fontWeight: 700, fontFamily: '"JetBrains Mono",monospace' }}>
                    {progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8, borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})`,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              {/* Task count stats */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[
                  { label: 'Total', value: taskCounts.total, color: '#94A3B8' },
                  { label: 'Done', value: taskCounts.done, color: '#4ADE80' },
                  { label: 'Active', value: taskCounts.inProgress, color: '#38BDF8' },
                  { label: 'Blocked', value: taskCounts.blocked, color: '#F87171' },
                ].map((s) => (
                  <Box
                    key={s.label}
                    sx={{
                      flex: 1, textAlign: 'center', py: 1, px: 0.5,
                      borderRadius: 2,
                      background: alpha(s.color, 0.06),
                      border: `1px solid ${alpha(s.color, 0.12)}`,
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, color: s.color, fontFamily: '"JetBrains Mono",monospace', fontSize: '1.1rem', lineHeight: 1 }}>
                      {s.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.62rem' }}>
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Team members */}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <GroupRoundedIcon sx={{ fontSize: 16, color: '#334155' }} />
              <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.75rem', fontWeight: 600 }}>
                Team ({project.teamMembers.length})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {project.teamMembers.map((m, i) => (
                <Tooltip key={m.id} title={`${m.firstName} ${m.lastName} — ${m.designation.name}`} arrow>
                  <Box
                    onClick={() => navigate(`/employees/${m.id}`)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer',
                      px: 1, py: 0.4, borderRadius: 2,
                      border: '1px solid rgba(148,163,184,0.08)',
                      '&:hover': { background: alpha(avatarColors[i % avatarColors.length], 0.08), borderColor: alpha(avatarColors[i % avatarColors.length], 0.2) },
                      transition: 'all 0.15s',
                    }}
                  >
                    <Avatar
                      src={m.avatarUrl}
                      sx={{
                        width: 22, height: 22, fontSize: '0.6rem', fontWeight: 700,
                        background: alpha(avatarColors[i % avatarColors.length], 0.15),
                        color: avatarColors[i % avatarColors.length],
                      }}
                    >
                      {m.firstName[0]}{m.lastName[0]}
                    </Avatar>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem', fontWeight: 500 }}>
                      {m.firstName} {m.lastName}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <AssignmentRoundedIcon sx={{ fontSize: 18, color: '#C084FC' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.95rem' }}>
              Task Board
            </Typography>
          </Box>

          {tasksLoading ? (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} width={260} height={400} sx={{ borderRadius: 3, flexShrink: 0 }} />
              ))}
            </Box>
          ) : (
            <KanbanBoard
              tasks={tasks}
              teamMembers={project.teamMembers}
              onTaskCreate={(status, data) => createTaskMutation.mutate({ ...data, status })}
              onTaskUpdate={(taskId, data) => updateTaskMutation.mutate({ id: taskId, data })}
              onTaskDelete={(taskId) => deleteTaskMutation.mutate(taskId)}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit project dialog */}
      <ProjectFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={project}
        onSubmit={(data) => updateProjectMutation.mutate(data)}
        loading={updateProjectMutation.isPending}
      />
    </Box>
  )
}
