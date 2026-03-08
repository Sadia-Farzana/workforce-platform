import { Grid, Box, Typography, alpha } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded'
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import StatCard from '@/components/dashboard/StatCard'
import DepartmentChart from '@/components/dashboard/DepartmentChart'
import LeaveChart from '@/components/dashboard/LeaveChart'
import ProjectProgress from '@/components/dashboard/ProjectProgress'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import { dashboardApi } from '@/services/api'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { data: report, isLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardApi.getSummaryReport,
    staleTime: 5 * 60 * 1000,
  })

  const generatedAt = report?.generatedAt
    ? format(new Date(report.generatedAt), 'MMM d, yyyy · HH:mm')
    : null

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800, color: '#F1F5F9',
              background: 'linear-gradient(135deg, #F1F5F9 30%, #6C8EFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Good morning, Admin 👋
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569', mt: 0.3 }}>
            Here's what's happening across your organization today.
          </Typography>
        </Box>
        {generatedAt && (
          <Typography
            variant="caption"
            sx={{
              color: '#334155',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.68rem',
              background: 'rgba(148,163,184,0.05)',
              border: '1px solid rgba(148,163,184,0.1)',
              px: 1.5, py: 0.5, borderRadius: 1.5,
            }}
          >
            Report: {generatedAt}
          </Typography>
        )}
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            label="Total Employees"
            value={report?.totalEmployees ?? '—'}
            subtitle={`${report?.activeEmployees ?? 0} currently active`}
            icon={<PeopleAltRoundedIcon />}
            color="#6C8EFF"
            trend={{ value: 4.5, label: 'vs last quarter' }}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            label="Active Projects"
            value={report?.activeProjects ?? '—'}
            subtitle={`${report?.totalProjects ?? 0} total projects`}
            icon={<FolderSpecialRoundedIcon />}
            color="#FF8C6B"
            trend={{ value: 12, label: 'vs last month' }}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            label="Pending Leaves"
            value={report?.leaveStats.totalPending ?? '—'}
            subtitle="Awaiting approval"
            icon={<BeachAccessRoundedIcon />}
            color="#FACC15"
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            label="Completed Projects"
            value={
              report
                ? report.projectStats.filter((p) => p.status === 'Completed').length
                : '—'
            }
            subtitle="All time"
            icon={<CheckCircleRoundedIcon />}
            color="#4ADE80"
            trend={{ value: 8, label: 'vs last quarter' }}
            loading={isLoading}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={8}>
          <DepartmentChart data={report?.departmentStats ?? []} loading={isLoading} />
        </Grid>
        <Grid item xs={12} md={4}>
          <LeaveChart data={report?.leaveStats ?? { totalPending: 0, totalApproved: 0, totalRejected: 0, byType: [] }} loading={isLoading} />
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <ProjectProgress data={report?.projectStats ?? []} loading={isLoading} />
        </Grid>
        <Grid item xs={12} md={5}>
          <ActivityFeed data={report?.recentActivity ?? []} loading={isLoading} />
        </Grid>
      </Grid>

      {/* Salary Insight Banner */}
      {report && !isLoading && (
        <Box
          sx={{
            mt: 2,
            p: 2.5,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha('#6C8EFF', 0.08)}, ${alpha('#FF8C6B', 0.08)})`,
            border: '1px solid rgba(108, 142, 255, 0.15)',
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Typography variant="overline" sx={{ color: '#475569', fontSize: '0.62rem', letterSpacing: '0.12em' }}>
              Highest Avg Salary Dept
            </Typography>
            <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 700 }}>
              {[...report.departmentStats].sort((a, b) => b.avgSalary - a.avgSalary)[0]?.departmentName}
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ color: '#475569', fontSize: '0.62rem', letterSpacing: '0.12em' }}>
              Largest Department
            </Typography>
            <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 700 }}>
              {[...report.departmentStats].sort((a, b) => b.headCount - a.headCount)[0]?.departmentName}
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ color: '#475569', fontSize: '0.62rem', letterSpacing: '0.12em' }}>
              Total Payroll (Est.)
            </Typography>
            <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 700 }}>
              ${(report.departmentStats.reduce((s, d) => s + d.avgSalary * d.headCount, 0) / 1000).toFixed(0)}K / mo
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ color: '#475569', fontSize: '0.62rem', letterSpacing: '0.12em' }}>
              Leave Approval Rate
            </Typography>
            <Typography variant="h6" sx={{ color: '#4ADE80', fontWeight: 700 }}>
              {Math.round(
                (report.leaveStats.totalApproved /
                  (report.leaveStats.totalApproved + report.leaveStats.totalRejected + report.leaveStats.totalPending)) *
                  100
              )}%
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
