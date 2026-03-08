import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import type { DepartmentStat } from '@/types'

interface Props {
  data: DepartmentStat[]
  loading?: boolean
}

const COLORS = ['#6C8EFF', '#FF8C6B', '#4ADE80', '#FACC15', '#38BDF8', '#C084FC', '#FB7185']

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: DepartmentStat }[] }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <Box
      sx={{
        background: '#1E293B',
        border: '1px solid rgba(148,163,184,0.15)',
        borderRadius: 2,
        p: 1.5,
        minWidth: 140,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9', mb: 0.5 }}>
        {d.departmentName}
      </Typography>
      <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
        👥 {d.headCount} employees
      </Typography>
      <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
        📁 {d.activeProjects} active projects
      </Typography>
      <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
        💰 ${d.avgSalary.toLocaleString()} avg salary
      </Typography>
    </Box>
  )
}

export default function DepartmentChart({ data, loading }: Props) {
  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton height={300} variant="rectangular" sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.95rem' }}>
            Headcount by Department
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            Active employee distribution
          </Typography>
        </Box>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="departmentName"
              tick={{ fill: '#475569', fontSize: 11, fontFamily: '"JetBrains Mono", monospace' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.slice(0, 3).toUpperCase()}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 11, fontFamily: '"JetBrains Mono", monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <ReTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="headCount" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
