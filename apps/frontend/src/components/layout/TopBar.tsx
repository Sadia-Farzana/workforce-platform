import { Box, Typography, IconButton, Badge, Tooltip, Breadcrumbs, Link, alpha } from '@mui/material'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useLocation, Link as RouterLink } from 'react-router-dom'

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/employees/new': 'New Employee',
  '/projects': 'Projects',
  '/leave': 'Leave Management',
  '/audit': 'Audit Log',
}

function getBreadcrumbs(pathname: string) {
  const crumbs: { label: string; path: string }[] = []
  const parts = pathname.split('/').filter(Boolean)

  crumbs.push({ label: 'Home', path: '/' })

  let cumulative = ''
  for (const part of parts) {
    cumulative += `/${part}`
    const label = ROUTE_LABELS[cumulative] || part.charAt(0).toUpperCase() + part.slice(1)
    crumbs.push({ label, path: cumulative })
  }

  return crumbs
}

export default function TopBar() {
  const location = useLocation()
  const crumbs = getBreadcrumbs(location.pathname)
  const currentLabel = crumbs[crumbs.length - 1]?.label || 'Dashboard'

  return (
    <Box
      component="header"
      sx={{
        height: 64,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(148, 163, 184, 0.06)',
        background: 'rgba(8, 12, 20, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', lineHeight: 1.2 }}>
          {currentLabel}
        </Typography>
        {crumbs.length > 1 && (
          <Breadcrumbs
            separator="/"
            sx={{
              mt: 0.2,
              '& .MuiBreadcrumbs-separator': { color: '#334155', mx: 0.5 },
            }}
          >
            {crumbs.slice(0, -1).map((crumb) => (
              <Link
                key={crumb.path}
                component={RouterLink}
                to={crumb.path}
                underline="none"
                sx={{
                  fontSize: '0.72rem', color: '#475569',
                  fontFamily: '"JetBrains Mono", monospace',
                  '&:hover': { color: '#6C8EFF' },
                }}
              >
                {crumb.label}
              </Link>
            ))}
            <Typography
              variant="caption"
              sx={{ color: '#6C8EFF', fontFamily: '"JetBrains Mono", monospace' }}
            >
              {crumbs[crumbs.length - 1].label}
            </Typography>
          </Breadcrumbs>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Search (Ctrl+K)" arrow>
          <IconButton
            size="small"
            sx={{
              color: '#475569',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: 2,
              px: 1.5,
              gap: 1,
              '&:hover': { background: alpha('#F1F5F9', 0.05), color: '#94A3B8' },
            }}
          >
            <SearchRoundedIcon fontSize="small" />
            <Typography variant="caption" sx={{ color: 'inherit', fontFamily: '"JetBrains Mono", monospace' }}>
              ⌘K
            </Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="Notifications" arrow>
          <IconButton
            size="small"
            sx={{
              color: '#475569',
              '&:hover': { background: alpha('#F1F5F9', 0.05), color: '#94A3B8' },
            }}
          >
            <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}>
              <NotificationsRoundedIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
