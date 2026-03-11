import { useState } from 'react'
import {
  Box, Typography, IconButton, Badge, Tooltip, Breadcrumbs, Link, alpha,
  Menu, MenuItem, Divider, ListItemIcon, Avatar,
} from '@mui/material'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import { useLocation, Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

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
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const crumbs = getBreadcrumbs(location.pathname)
  const currentLabel = crumbs[crumbs.length - 1]?.label || 'Dashboard'

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleLogout = () => {
    setAnchorEl(null)
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user
    ? `${user.username.charAt(0).toUpperCase()}`
    : 'A'

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

        {/* User avatar / menu */}
        <Tooltip title={user?.email ?? 'Account'} arrow>
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              ml: 0.5,
              p: 0,
              '&:hover': { opacity: 0.85 },
            }}
          >
            <Avatar
              sx={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, #6C8EFF 0%, #4A6AE8 100%)',
                fontSize: '0.8rem',
                fontWeight: 700,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                boxShadow: '0 0 0 2px rgba(108,142,255,0.3)',
              }}
            >
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              background: '#0D1525',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              borderRadius: 2,
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {user && (
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                {user.username}
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                {user.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#6C8EFF', fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.65rem', display: 'block', mt: 0.3,
                }}
              >
                {user.role}
              </Typography>
            </Box>
          )}
          <Divider sx={{ borderColor: 'rgba(148,163,184,0.1)', my: 0.5 }} />
          <MenuItem
            sx={{
              fontSize: '0.875rem', color: '#94A3B8', py: 1,
              '&:hover': { background: alpha('#F1F5F9', 0.04), color: '#F1F5F9' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <PersonOutlineRoundedIcon sx={{ fontSize: 16, color: 'inherit' }} />
            </ListItemIcon>
            Profile
          </MenuItem>
          <Divider sx={{ borderColor: 'rgba(148,163,184,0.08)', my: 0.5 }} />
          <MenuItem
            onClick={handleLogout}
            sx={{
              fontSize: '0.875rem', color: '#F87171', py: 1,
              '&:hover': { background: alpha('#F87171', 0.08) },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <LogoutRoundedIcon sx={{ fontSize: 16, color: 'inherit' }} />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}
