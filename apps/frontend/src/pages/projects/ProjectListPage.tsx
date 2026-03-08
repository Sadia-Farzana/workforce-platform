import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, InputAdornment,
  Chip, Snackbar, Alert, alpha,
} from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectFormDialog from '@/components/projects/ProjectFormDialog'
import { projectApi } from '@/services/api'
import type { ProjectStatus } from '@/types'

const STATUS_FILTERS: { value: ProjectStatus | ''; label: string }[] = [
  { value: '',           label: 'All Statuses' },
  { value: 'Active',     label: 'Active' },
  { value: 'Planning',   label: 'Planning' },
  { value: 'OnHold',     label: 'On Hold' },
  { value: 'Completed',  label: 'Completed' },
]

export default function ProjectListPage() {
  const navigate      = useNavigate()
  const queryClient   = useQueryClient()
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState<ProjectStatus | ''>('')
  const [createOpen, setCreateOpen] = useState(false)
  const [snackbar, setSnackbar]     = useState({ open: false, msg: '', severity: 'success' as const })

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setCreateOpen(false)
      setSnackbar({ open: true, msg: 'Project created!', severity: 'success' })
    },
    onError: () => setSnackbar({ open: true, msg: 'Failed to create project', severity: 'success' }),
  })

  const filtered = projects.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchStatus
  })

  // Summary counts
  const counts = {
    Active:    projects.filter((p) => p.status === 'Active').length,
    Planning:  projects.filter((p) => p.status === 'Planning').length,
    OnHold:    projects.filter((p) => p.status === 'OnHold').length,
    Completed: projects.filter((p) => p.status === 'Completed').length,
  }

  const STATUS_BADGE_COLORS: Record<string, string> = {
    Active: '#4ADE80', Planning: '#38BDF8', OnHold: '#FACC15', Completed: '#6C8EFF',
  }

  return (
    <Box>
      {/* Summary row */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {Object.entries(counts).map(([status, count]) => (
          <Grid item xs={6} sm={3} key={status}>
            <Card
              onClick={() => setStatus(status === statusFilter ? '' : status as ProjectStatus)}
              sx={{
                cursor: 'pointer',
                border: `1px solid ${statusFilter === status ? alpha(STATUS_BADGE_COLORS[status], 0.4) : 'rgba(148,163,184,0.08)'}`,
                background: statusFilter === status ? alpha(STATUS_BADGE_COLORS[status], 0.06) : undefined,
                '&:hover': { borderColor: alpha(STATUS_BADGE_COLORS[status], 0.3) },
                transition: 'all 0.15s',
              }}
            >
              <CardContent sx={{ p: 1.8, '&:last-child': { pb: 1.8 } }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: STATUS_BADGE_COLORS[status], lineHeight: 1, mb: 0.3, fontFamily: '"JetBrains Mono",monospace' }}>
                  {count}
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem' }}>
                  {status === 'OnHold' ? 'On Hold' : status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Toolbar */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              size="small"
              sx={{ flex: '1 1 200px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ fontSize: 18, color: '#475569' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatus(e.target.value as ProjectStatus | '')}>
                {STATUS_FILTERS.map((f) => (
                  <MenuItem key={f.value} value={f.value}><em>{f.label}</em></MenuItem>
                ))}
              </Select>
            </FormControl>
            {(search || statusFilter) && (
              <Chip
                label="Clear filters"
                size="small"
                onDelete={() => { setSearch(''); setStatus('') }}
                sx={{ height: 28, color: '#64748B', background: 'rgba(148,163,184,0.06)' }}
              />
            )}
            <Box sx={{ flex: 1 }} />
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={() => setCreateOpen(true)}
              size="small"
            >
              New Project
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Grid */}
      {isLoading ? (
        <Grid container spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={i}>
              <Card sx={{ height: 220 }} />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ color: '#334155' }}>No projects match your filters.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((project) => (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={project.id}>
              <ProjectCard
                project={project}
                onClick={() => navigate(`/projects/${project.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ProjectFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        loading={createMutation.isPending}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ background: '#1E293B', color: '#F1F5F9', border: '1px solid rgba(148,163,184,0.15)' }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
