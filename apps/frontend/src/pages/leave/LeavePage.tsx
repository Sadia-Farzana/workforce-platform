import { useState, useMemo } from 'react'
import {
  Box, Card, CardContent, Typography, Button, Grid,
  Select, MenuItem, FormControl, InputLabel, TextField,
  InputAdornment, Chip, Snackbar, Alert, Divider, alpha,
} from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import LeaveRow from '@/components/leave/LeaveRow'
import ApprovalDialog from '@/components/leave/ApprovalDialog'
import SubmitLeaveDialog from '@/components/leave/SubmitLeaveDialog'
import { leaveApi } from '@/services/api'
import { EMPLOYEES } from '@/services/mockData'
import type { LeaveRequest, LeaveStatus, LeaveType } from '@/types'

type ActionState = { request: LeaveRequest; action: 'Approved' | 'Rejected' } | null

const LEAVE_TYPES: LeaveType[] = ['Annual', 'Sick', 'Casual', 'Unpaid', 'Maternity', 'Paternity']

const STAT_CARDS = [
  { key: 'Pending',  label: 'Pending',  color: '#FACC15', icon: <HourglassEmptyRoundedIcon /> },
  { key: 'Approved', label: 'Approved', color: '#4ADE80', icon: <CheckCircleRoundedIcon /> },
  { key: 'Rejected', label: 'Rejected', color: '#F87171', icon: <CancelRoundedIcon /> },
  { key: 'Cancelled',label: 'Cancelled',color: '#94A3B8', icon: <BlockRoundedIcon /> },
]

export default function LeavePage() {
  const queryClient = useQueryClient()

  const [statusFilter, setStatusFilter]   = useState<LeaveStatus | ''>('')
  const [typeFilter, setTypeFilter]       = useState<LeaveType | ''>('')
  const [search, setSearch]               = useState('')
  const [actionState, setActionState]     = useState<ActionState>(null)
  const [submitOpen, setSubmitOpen]       = useState(false)
  const [snackbar, setSnackbar]           = useState({ open: false, msg: '', severity: 'success' as 'success' | 'error' })

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: leaveApi.getAll,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, comment }: { id: string; status: string; comment: string }) =>
      leaveApi.updateStatus(id, status, comment),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      setSnackbar({
        open: true,
        msg: `Request ${vars.status.toLowerCase()} successfully`,
        severity: 'success',
      })
      setActionState(null)
    },
    onError: () => {
      setSnackbar({ open: true, msg: 'Action failed. Please try again.', severity: 'error' })
    },
  })

  const submitMutation = useMutation({
    mutationFn: (data: Partial<LeaveRequest>) => leaveApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      setSnackbar({ open: true, msg: 'Leave request submitted!', severity: 'success' })
      setSubmitOpen(false)
    },
    onError: () => setSnackbar({ open: true, msg: 'Failed to submit request', severity: 'error' }),
  })

  // Counts per status
  const counts = useMemo(() => {
    return {
      Pending:   requests.filter((r) => r.status === 'Pending').length,
      Approved:  requests.filter((r) => r.status === 'Approved').length,
      Rejected:  requests.filter((r) => r.status === 'Rejected').length,
      Cancelled: requests.filter((r) => r.status === 'Cancelled').length,
    }
  }, [requests])

  // Filtered list
  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false
      if (typeFilter   && r.leaveType !== typeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!r.employeeName.toLowerCase().includes(q) && !r.leaveType.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [requests, statusFilter, typeFilter, search])

  const activeFilters = [statusFilter, typeFilter, search].filter(Boolean).length

  return (
    <Box>
      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {STAT_CARDS.map((s) => {
          const count = counts[s.key as LeaveStatus] ?? 0
          const isActive = statusFilter === s.key
          return (
            <Grid item xs={6} sm={3} key={s.key}>
              <Card
                onClick={() => setStatusFilter(isActive ? '' : s.key as LeaveStatus)}
                sx={{
                  cursor: 'pointer',
                  border: `1px solid ${isActive ? alpha(s.color, 0.45) : 'rgba(148,163,184,0.08)'}`,
                  background: isActive ? alpha(s.color, 0.07) : undefined,
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: alpha(s.color, 0.3), background: alpha(s.color, 0.04) },
                  position: 'relative', overflow: 'hidden',
                  '&::before': isActive ? {
                    content: '""', position: 'absolute',
                    top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
                  } : {},
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800, color: s.color,
                        fontFamily: '"JetBrains Mono",monospace',
                        fontSize: '2rem', lineHeight: 1,
                      }}
                    >
                      {count}
                    </Typography>
                    <Box sx={{
                      color: s.color, opacity: 0.4,
                      '& .MuiSvgIcon-root': { fontSize: 20 },
                    }}>
                      {s.icon}
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem' }}>
                    {s.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* ── Main Card ──────────────────────────────────────────────────── */}
      <Card>
        {/* Toolbar */}
        <CardContent sx={{ p: 2.5, pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.95rem' }}>
                Leave Requests
              </Typography>
              <Chip
                label={filtered.length}
                size="small"
                sx={{
                  height: 20, fontSize: '0.68rem', fontWeight: 700,
                  background: alpha('#6C8EFF', 0.12), color: '#6C8EFF',
                  border: '1px solid rgba(108,142,255,0.2)',
                  '& .MuiChip-label': { px: 0.8 },
                }}
              />
              {activeFilters > 0 && (
                <Chip
                  label={`${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`}
                  size="small"
                  onDelete={() => { setStatusFilter(''); setTypeFilter(''); setSearch('') }}
                  sx={{
                    height: 20, fontSize: '0.65rem', color: '#FF8C6B',
                    background: alpha('#FF8C6B', 0.08),
                    border: '1px solid rgba(255,140,107,0.2)',
                    '& .MuiChip-label': { px: 0.8 },
                    '& .MuiChip-deleteIcon': { color: '#FF8C6B', fontSize: 12 },
                  }}
                />
              )}
            </Box>
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={() => setSubmitOpen(true)}
              size="small"
            >
              Submit Request
            </Button>
          </Box>

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by employee or type…"
              size="small"
              sx={{ flex: '1 1 200px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ fontSize: 17, color: '#475569' }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as LeaveStatus | '')}>
                <MenuItem value=""><em>All statuses</em></MenuItem>
                {['Pending','Approved','Rejected','Cancelled'].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Leave Type</InputLabel>
              <Select value={typeFilter} label="Leave Type" onChange={(e) => setTypeFilter(e.target.value as LeaveType | '')}>
                <MenuItem value=""><em>All types</em></MenuItem>
                {LEAVE_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>

        <Divider sx={{ borderColor: 'rgba(148,163,184,0.06)' }} />

        {/* Column headers */}
        <Box
          sx={{
            px: 2.5, py: 1,
            display: 'flex', gap: 2,
            background: '#080C14',
            borderBottom: '1px solid rgba(148,163,184,0.06)',
          }}
        >
          {[
            { label: 'Employee',   w: 150 },
            { label: 'Type',       w: 'auto' },
            { label: 'Dates',      w: 180 },
            { label: 'Status',     w: 90 },
            { label: 'Reason',     w: 'auto' },
          ].map((col) => (
            <Typography
              key={col.label}
              variant="caption"
              sx={{
                color: '#334155',
                fontFamily: '"JetBrains Mono",monospace',
                fontSize: '0.62rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', fontWeight: 500,
                flex: typeof col.w === 'number' ? `0 0 ${col.w}px` : '1 1 auto',
              }}
            >
              {col.label}
            </Typography>
          ))}
          <Box sx={{ width: 100, flexShrink: 0 }} />
        </Box>

        {/* Rows */}
        {isLoading ? (
          <Box sx={{ px: 2.5, py: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#334155' }}>Loading…</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ px: 2.5, py: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#334155', mb: 1 }}>
              No leave requests match your filters.
            </Typography>
            {activeFilters > 0 && (
              <Button
                size="small" variant="text"
                onClick={() => { setStatusFilter(''); setTypeFilter(''); setSearch('') }}
                sx={{ color: '#6C8EFF' }}
              >
                Clear filters
              </Button>
            )}
          </Box>
        ) : (
          filtered.map((request) => (
            <LeaveRow
              key={request._id}
              request={request}
              onApprove={(r) => setActionState({ request: r, action: 'Approved' })}
              onReject={(r)  => setActionState({ request: r, action: 'Rejected' })}
            />
          ))
        )}

        {/* Footer summary */}
        {filtered.length > 0 && (
          <Box
            sx={{
              px: 2.5, py: 1.5,
              borderTop: '1px solid rgba(148,163,184,0.06)',
              display: 'flex', justifyContent: 'flex-end',
            }}
          >
            <Typography variant="caption" sx={{ color: '#334155', fontFamily: '"JetBrains Mono",monospace', fontSize: '0.68rem' }}>
              {filtered.length} request{filtered.length !== 1 ? 's' : ''} shown
              {activeFilters > 0 ? ` (${requests.length} total)` : ''}
            </Typography>
          </Box>
        )}
      </Card>

      {/* ── Dialogs ─────────────────────────────────────────────────────── */}
      <ApprovalDialog
        open={!!actionState}
        request={actionState?.request ?? null}
        action={actionState?.action ?? null}
        loading={updateStatusMutation.isPending}
        onConfirm={(status, comment) => {
          if (actionState) {
            updateStatusMutation.mutate({ id: actionState.request._id, status, comment })
          }
        }}
        onCancel={() => setActionState(null)}
      />

      <SubmitLeaveDialog
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        employees={EMPLOYEES}
        loading={submitMutation.isPending}
        onSubmit={(data) => {
          const emp = EMPLOYEES.find((e) => e.id === data.employeeId)
          submitMutation.mutate({
            ...data,
            employeeName: emp ? `${emp.firstName} ${emp.lastName}` : '',
            status: 'Pending',
            approvalHistory: [{ status: 'Pending', changedBy: 'System', changedAt: new Date().toISOString() }],
          })
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ background: '#1E293B', color: '#F1F5F9', border: '1px solid rgba(148,163,184,0.15)' }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
