import { useState, useRef } from 'react'
import {
  Box, Typography, Button, Chip, alpha,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import TaskCard from './TaskCard'
import TaskFormDialog from './TaskFormDialog'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import type { Task, TaskStatus, Employee } from '@/types'

interface KanbanBoardProps {
  tasks: Task[]
  teamMembers: Employee[]
  onTaskCreate: (status: TaskStatus, data: Partial<Task>) => void
  onTaskUpdate: (id: number, data: Partial<Task>) => void
  onTaskDelete: (id: number) => void
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'Todo',       label: 'To Do',       color: '#94A3B8' },
  { id: 'InProgress', label: 'In Progress', color: '#38BDF8' },
  { id: 'InReview',   label: 'In Review',   color: '#C084FC' },
  { id: 'Done',       label: 'Done',        color: '#4ADE80' },
  { id: 'Blocked',    label: 'Blocked',     color: '#F87171' },
]

type DragState = {
  taskId: number
  fromCol: TaskStatus
} | null

export default function KanbanBoard({
  tasks, teamMembers, onTaskCreate, onTaskUpdate, onTaskDelete,
}: KanbanBoardProps) {
  const [dragState, setDragState]           = useState<DragState>(null)
  const [dragOverCol, setDragOverCol]       = useState<TaskStatus | null>(null)
  const [dragOverTaskId, setDragOverTaskId] = useState<number | null>(null)
  const [createCol, setCreateCol]           = useState<TaskStatus | null>(null)
  const [editTask, setEditTask]             = useState<Task | null>(null)
  const [deleteTaskId, setDeleteTaskId]     = useState<number | null>(null)
  const dragNode = useRef<HTMLDivElement | null>(null)

  // Group tasks by status
  const byStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status)

  // ── Drag handlers ──────────────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDragState({ taskId: task.id, fromCol: task.status })
    e.dataTransfer.effectAllowed = 'move'
    // ghost opacity via timeout
    setTimeout(() => {
      if (dragNode.current) dragNode.current.style.opacity = '0.4'
    }, 0)
  }

  const handleDragEnd = () => {
    setDragState(null)
    setDragOverCol(null)
    setDragOverTaskId(null)
    if (dragNode.current) dragNode.current.style.opacity = '1'
  }

  const handleColDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverCol(colId)
    setDragOverTaskId(null)
  }

  const handleTaskDragOver = (e: React.DragEvent, taskId: number) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverTaskId(taskId)
  }

  const handleDrop = (e: React.DragEvent, toStatus: TaskStatus) => {
    e.preventDefault()
    if (!dragState) return
    if (dragState.fromCol !== toStatus) {
      onTaskUpdate(dragState.taskId, { status: toStatus })
    }
    setDragState(null)
    setDragOverCol(null)
    setDragOverTaskId(null)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        overflowX: 'auto',
        pb: 2,
        scrollbarWidth: 'thin',
        minHeight: 600,
        alignItems: 'flex-start',
      }}
    >
      {COLUMNS.map((col) => {
        const colTasks = byStatus(col.id)
        const isDragOver = dragOverCol === col.id

        return (
          <Box
            key={col.id}
            onDragOver={(e) => handleColDragOver(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            onDragLeave={() => { if (dragOverCol === col.id) setDragOverCol(null) }}
            sx={{
              flexShrink: 0,
              width: 260,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              background: isDragOver ? alpha(col.color, 0.05) : 'rgba(148,163,184,0.03)',
              border: `1px solid ${isDragOver ? alpha(col.color, 0.3) : 'rgba(148,163,184,0.07)'}`,
              transition: 'border-color 0.15s, background 0.15s',
              overflow: 'hidden',
            }}
          >
            {/* Column header */}
            <Box
              sx={{
                px: 2, py: 1.5,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: `1px solid ${alpha(col.color, 0.12)}`,
                background: alpha(col.color, 0.04),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#E2E8F0', fontSize: '0.82rem' }}>
                  {col.label}
                </Typography>
                <Chip
                  label={colTasks.length}
                  size="small"
                  sx={{
                    height: 18, fontSize: '0.62rem', fontWeight: 700,
                    background: alpha(col.color, 0.12), color: col.color,
                    border: `1px solid ${alpha(col.color, 0.2)}`,
                    '& .MuiChip-label': { px: 0.7 },
                  }}
                />
              </Box>
              <Button
                size="small"
                onClick={() => setCreateCol(col.id)}
                sx={{
                  minWidth: 0, p: 0.4, color: '#334155', borderRadius: 1,
                  '&:hover': { color: col.color, background: alpha(col.color, 0.08) },
                }}
              >
                <AddRoundedIcon sx={{ fontSize: 16 }} />
              </Button>
            </Box>

            {/* Task list */}
            <Box
              sx={{
                p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5,
                flex: 1, minHeight: 120,
                overflowY: 'auto',
              }}
            >
              {colTasks.map((task) => (
                <Box
                  key={task.id}
                  ref={dragState?.taskId === task.id ? dragNode : null}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleTaskDragOver(e, task.id)}
                  sx={{
                    outline: dragOverTaskId === task.id
                      ? `2px dashed ${alpha(col.color, 0.5)}`
                      : 'none',
                    borderRadius: 2,
                    transition: 'outline 0.1s',
                  }}
                >
                  <TaskCard
                    task={task}
                    dragging={dragState?.taskId === task.id}
                    onClick={() => setEditTask(task)}
                    onDelete={() => setDeleteTaskId(task.id)}
                  />
                </Box>
              ))}

              {/* Empty state */}
              {colTasks.length === 0 && (
                <Box
                  onClick={() => setCreateCol(col.id)}
                  sx={{
                    border: `1px dashed ${alpha(col.color, 0.15)}`,
                    borderRadius: 2, py: 2.5, textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { background: alpha(col.color, 0.03), borderColor: alpha(col.color, 0.3) },
                    transition: 'all 0.15s',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#2D3F55', fontSize: '0.72rem' }}>
                    + Add task
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )
      })}

      {/* Create task dialog */}
      <TaskFormDialog
        open={!!createCol}
        onClose={() => setCreateCol(null)}
        defaultStatus={createCol ?? 'Todo'}
        teamMembers={teamMembers}
        onSubmit={(data) => {
          if (createCol) onTaskCreate(createCol, data)
          setCreateCol(null)
        }}
      />

      {/* Edit task dialog */}
      {editTask && (
        <TaskFormDialog
          open
          onClose={() => setEditTask(null)}
          initialData={editTask}
          teamMembers={teamMembers}
          onSubmit={(data) => {
            onTaskUpdate(editTask.id, data)
            setEditTask(null)
          }}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteTaskId !== null}
        title="Delete Task"
        description="Are you sure you want to delete this task? This cannot be undone."
        confirmLabel="Delete Task"
        onConfirm={() => { if (deleteTaskId) onTaskDelete(deleteTaskId); setDeleteTaskId(null) }}
        onCancel={() => setDeleteTaskId(null)}
      />
    </Box>
  )
}
