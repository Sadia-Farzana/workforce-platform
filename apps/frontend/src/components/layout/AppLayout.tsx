import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#080C14' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />
        <Box
          component="main"
          sx={{ flex: 1, p: 3, overflowY: 'auto' }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
