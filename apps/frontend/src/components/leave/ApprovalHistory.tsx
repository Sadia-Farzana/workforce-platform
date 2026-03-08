import { Box, Typography, Collapse, Divider, alpha } from '@mui/material'
import StatusChip from '@/components/common/StatusChip'
import type { ApprovalHistoryEntry } from '@/types'
import { format } from 'date-fns'

interface ApprovalHistoryProps {
  history: ApprovalHistoryEntry[]
  open: boolean
}

const STATUS_COLORS: Record<string, string> = {
  Pending:   '#FACC15',
  Approved:  '#4ADE80',
  Rejected:  '#F87171',
  Cancelled: '#94A3B8',
}

export default function ApprovalHistory({ history, open }: ApprovalHistoryProps) {
  return (
    <Collapse in={open} timeout={200}>
      <Box
        sx={{
          mx: 0, mt: 1, mb: 0.5, p: 2,
          borderRadius: 2,
          background: 'rgba(148,163,184,0.03)',
          border: '1px solid rgba(148,163,184,0.08)',
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: '#334155', fontSize: '0.6rem', letterSpacing: '0.1em', display: 'block', mb: 1.5 }}
        >
          Approval Timeline
        </Typography>

        {/* Timeline */}
        <Box sx={{ position: 'relative', pl: 2.5 }}>
          {/* Vertical line */}
          {history.length > 1 && (
            <Box
              sx={{
                position: 'absolute', left: 6, top: 10, bottom: 10,
                width: 1, background: 'rgba(148,163,184,0.1)',
              }}
            />
          )}

          {history.map((entry, i) => {
            const color = STATUS_COLORS[entry.status] ?? '#94A3B8'
            return (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: i < history.length - 1 ? 2 : 0, position: 'relative' }}>
                {/* Dot on timeline */}
                <Box
                  sx={{
                    position: 'absolute', left: -18, top: 4,
                    width: 10, height: 10, borderRadius: '50%',
                    background: color,
                    border: `2px solid #0D1525`,
                    boxShadow: `0 0 0 2px ${alpha(color, 0.25)}`,
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.3 }}>
                    <StatusChip status={entry.status} />
                    <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                      by <Box component="span" sx={{ color: '#94A3B8', fontWeight: 600 }}>{entry.changedBy}</Box>
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#334155',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.65rem',
                        ml: 'auto',
                      }}
                    >
                      {format(new Date(entry.changedAt), 'MMM d, yyyy · HH:mm')}
                    </Typography>
                  </Box>
                  {entry.comment && (
                    <Box
                      sx={{
                        mt: 0.5, px: 1.2, py: 0.6, borderRadius: 1.5,
                        background: alpha(color, 0.06),
                        border: `1px solid ${alpha(color, 0.12)}`,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem', fontStyle: 'italic' }}>
                        "{entry.comment}"
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Collapse>
  )
}
