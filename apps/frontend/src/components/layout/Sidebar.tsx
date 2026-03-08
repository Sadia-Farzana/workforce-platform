import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Tooltip, IconButton, Avatar, Chip, alpha,
} from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded'
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded'
import ManageHistoryRoundedIcon from '@mui/icons-material/ManageHistoryRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import HexagonRoundedIcon from '@mui/icons-material/HexagonRounded'

const DRAWER_WIDTH = 240
const DRAWER_COLLAPSED = 68

interface NavItem {
  label: string
  icon: React.ReactNode
  path: string
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/' },
  { label: 'Employees', icon: <PeopleAltRoundedIcon />, path: '/employees' },
  { label: 'Projects', icon: <FolderSpecialRoundedIcon />, path: '/projects' },
  { label: 'Leave', icon: <BeachAccessRoundedIcon />, path: '/leave', badge: 2 },
  { label: 'Audit Log', icon: <ManageHistoryRoundedIcon />, path: '/audit' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const width = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        transition: 'width 0.2s ease',
        '& .MuiDrawer-paper': {
          width,
          transition: 'width 0.2s ease',
          overflowX: 'hidden',
          background: '#0A1020',
          borderRight: '1px solid rgba(148, 163, 184, 0.06)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          px: collapsed ? 1.5 : 2.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 2,
            background: 'linear-gradient(135deg, #6C8EFF 0%, #FF8C6B 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <HexagonRoundedIcon sx={{ fontSize: 20, color: '#fff' }} />
        </Box>
        {!collapsed && (
          <Box>
            <Typography
              variant="h6"
              sx={{ lineHeight: 1, fontWeight: 800, fontSize: '0.95rem', color: '#F1F5F9' }}
            >
              WorkForce
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#475569', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Platform
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.06)' }} />

      {/* Nav Items */}
      <List sx={{ px: 1, py: 1.5, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path)

          return (
            <Tooltip
              key={item.path}
              title={collapsed ? item.label : ''}
              placement="right"
              arrow
            >
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: collapsed ? 1.5 : 1.5,
                  py: 1.1,
                  minHeight: 44,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: isActive
                    ? alpha('#6C8EFF', 0.15)
                    : 'transparent',
                  color: isActive ? '#6C8EFF' : '#64748B',
                  border: isActive
                    ? '1px solid rgba(108, 142, 255, 0.2)'
                    : '1px solid transparent',
                  '&:hover': {
                    background: isActive
                      ? alpha('#6C8EFF', 0.2)
                      : alpha('#F1F5F9', 0.04),
                    color: isActive ? '#6C8EFF' : '#94A3B8',
                  },
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 'auto' : 36,
                    color: 'inherit',
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 500,
                        color: 'inherit',
                      }}
                    />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 18, fontSize: '0.65rem', fontWeight: 700,
                          background: '#FF8C6B', color: '#fff',
                          '& .MuiChip-label': { px: 0.7 },
                        }}
                      />
                    )}
                  </>
                )}
              </ListItemButton>
            </Tooltip>
          )
        })}
      </List>

      {/* User + Collapse */}
      <Box sx={{ px: 1, pb: 2 }}>
        <Divider sx={{ mb: 1.5, borderColor: 'rgba(148, 163, 184, 0.06)' }} />
        {!collapsed && (
          <Box sx={{ px: 1.5, py: 1, mb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=Admin"
              sx={{ width: 32, height: 32, border: '2px solid rgba(108, 142, 255, 0.3)' }}
            />
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#E2E8F0', lineHeight: 1.2 }}>
                HR Admin
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.65rem' }}>
                admin@company.com
              </Typography>
            </Box>
          </Box>
        )}
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right" arrow>
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            size="small"
            sx={{
              width: '100%', borderRadius: 2, py: 0.8,
              color: '#475569', border: '1px solid rgba(148, 163, 184, 0.08)',
              '&:hover': { background: alpha('#F1F5F9', 0.05), color: '#94A3B8' },
            }}
          >
            {collapsed
              ? <ChevronRightRoundedIcon fontSize="small" />
              : <ChevronLeftRoundedIcon fontSize="small" />
            }
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  )
}
