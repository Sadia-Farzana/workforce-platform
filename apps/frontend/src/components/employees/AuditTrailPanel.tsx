import { Box, Typography, Divider, Chip, alpha } from '@mui/material'
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import type { AuditLog } from '@/types'
import { format } from 'date-fns'

interface AuditTrailPanelProps {
  logs: AuditLog[]
}

const EVENT_META: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  EMPLOYEE_CREATED: { color: '#4ADE80', icon: <PersonAddAltRoundedIcon />, label: 'Created' },
  EMPLOYEE_UPDATED: { color: '#6C8EFF', icon: <EditNoteRoundedIcon />, label: 'Updated' },
}

function getKey(key: string): string {
  const MAP: Record<string, string> = {
    salary: 'Salary', isActive: 'Status', firstName: 'First Name',
    lastName: 'Last Name', email: 'Email', departmentId: 'Department',
    designationId: 'Designation', phone: 'Phone', city: 'City', country: 'Country',
  }
  return MAP[key] ?? key
}

function formatVal(val: unknown): string {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? 'Active' : 'Inactive'
  if (typeof val === 'number') return val.toLocaleString()
  return String(val)
}

export default function AuditTrailPanel({ logs }: AuditTrailPanelProps) {
  if (logs.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#334155' }}>
          No audit events recorded
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {logs.map((log, index) => {
        const meta = EVENT_META[log.eventType] ?? { color: '#94A3B8', icon: <EditNoteRoundedIcon />, label: log.eventType }
        const changedFields = log.before && log.after
          ? Object.keys(log.after).filter((k) => {
              const before = (log.before as Record<string, unknown>)[k]
              const after = (log.after as Record<string, unknown>)[k]
              return JSON.stringify(before) !== JSON.stringify(after)
            })
          : Object.keys(log.after ?? {})

        return (
          <Box key={log._id}>
            <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
              {/* Timeline dot */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.3 }}>
                <Box
                  sx={{
                    width: 28, height: 28, borderRadius: 1.5, flexShrink: 0,
                    background: alpha(meta.color, 0.1),
                    border: `1px solid ${alpha(meta.color, 0.25)}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: meta.color, '& .MuiSvgIcon-root': { fontSize: 14 },
                  }}
                >
                  {meta.icon}
                </Box>
                {index < logs.length - 1 && (
                  <Box sx={{ width: 1, flex: 1, background: 'rgba(148,163,184,0.08)', mt: 1, minHeight: 20 }} />
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.4, flexWrap: 'wrap' }}>
                  <Chip
                    label={meta.label}
                    size="small"
                    sx={{
                      height: 18, fontSize: '0.62rem', fontWeight: 700,
                      background: alpha(meta.color, 0.1), color: meta.color,
                      border: `1px solid ${alpha(meta.color, 0.2)}`,
                      '& .MuiChip-label': { px: 0.7 },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem' }}>
                    by {log.actor}
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  sx={{ color: '#334155', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem', display: 'block', mb: 0.8 }}
                >
                  {format(new Date(log.timestamp), 'MMM d, yyyy · HH:mm')}
                </Typography>

                {/* Field-level diff */}
                {changedFields.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {changedFields.map((field) => {
                      const before = log.before ? (log.before as Record<string, unknown>)[field] : undefined
                      const after  = log.after  ? (log.after  as Record<string, unknown>)[field] : undefined
                      return (
                        <Box key={field} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem', minWidth: 80 }}>
                            {getKey(field)}
                          </Typography>
                          {before !== undefined && (
                            <>
                              <Box
                                sx={{
                                  px: 0.8, py: 0.2, borderRadius: 1,
                                  background: alpha('#F87171', 0.08),
                                  border: '1px solid rgba(248,113,113,0.2)',
                                  fontFamily: '"JetBrains Mono", monospace',
                                  fontSize: '0.65rem', color: '#F87171',
                                  textDecoration: 'line-through',
                                }}
                              >
                                {formatVal(before)}
                              </Box>
                              <Typography variant="caption" sx={{ color: '#334155' }}>→</Typography>
                            </>
                          )}
                          <Box
                            sx={{
                              px: 0.8, py: 0.2, borderRadius: 1,
                              background: alpha('#4ADE80', 0.08),
                              border: '1px solid rgba(74,222,128,0.2)',
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: '0.65rem', color: '#4ADE80',
                            }}
                          >
                            {formatVal(after)}
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </Box>
            </Box>
            {index < logs.length - 1 && <Divider sx={{ borderColor: 'rgba(148,163,184,0.04)', ml: 5 }} />}
          </Box>
        )
      })}
    </Box>
  )
}
