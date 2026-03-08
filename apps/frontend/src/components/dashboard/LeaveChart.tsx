import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material'
import { PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer, Legend } from 'recharts'
import type { LeaveStat } from '@/types'

interface Props {
  data: LeaveStat
  loading?: boolean
}

const STATUS_DATA = (stat: LeaveStat) => [
  { name: 'Approved', value: stat.totalApproved, color: '#4ADE80' },
  { name: 'Pending', value: stat.totalPending, color: '#FACC15' },
  { name: 'Rejected', value: stat.totalRejected, color: '#F87171' },
]

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string } }[] }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <Box
      sx={{
        background: '#1E293B', border: '1px solid rgba(148,163,184,0.15)',
        borderRadius: 2, p: 1.5,
      }}
    >
      <Typography variant="caption" sx={{ color: d.payload.color, fontWeight: 600 }}>
        {d.name}: {d.value}
      </Typography>
    </Box>
  )
}

const CustomLegend = ({ payload }: { payload?: { value: string; color: string }[] }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
    {payload?.map((entry) => (
      <Box key={entry.value} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
          {entry.value}
        </Typography>
      </Box>
    ))}
  </Box>
)

export default function LeaveChart({ data, loading }: Props) {
  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton height={260} variant="rectangular" sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
    )
  }

  const chartData = STATUS_DATA(data)
  const total = chartData.reduce((s, d) => s + d.value, 0)

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.95rem' }}>
            Leave Overview
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            This cycle — {total} total requests
          </Typography>
        </Box>
        <Box sx={{ position: 'relative' }}>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <ReTooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
          <Box
            sx={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -60%)',
              textAlign: 'center', pointerEvents: 'none',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', lineHeight: 1 }}>
              {total}
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.65rem' }}>
              TOTAL
            </Typography>
          </Box>
        </Box>

        {/* By Type */}
        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {data.byType.map((t) => (
            <Box
              key={t.type}
              sx={{
                px: 1.5, py: 0.5, borderRadius: 1.5,
                background: 'rgba(148,163,184,0.06)',
                border: '1px solid rgba(148,163,184,0.1)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
                {t.type} <Box component="span" sx={{ color: '#F1F5F9', fontWeight: 700 }}>{t.count}</Box>
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
