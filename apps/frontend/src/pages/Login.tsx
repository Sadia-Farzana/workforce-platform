import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { 
  Box, Card, CardContent, TextField, Button, 
  Typography, Container, InputAdornment, IconButton, Alert, CircularProgress 
} from '@mui/material'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import { authApi } from '@/services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('admin@workforce.com')
  const [password, setPassword] = useState('Admin@123')

  // 1. Setup the Mutation using our updated api.ts
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.success) {
        // Save the Bearer token for the Axios Interceptor
        localStorage.setItem('auth_token', response.data.accessToken)
        // Save user info for the Dashboard Header
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        navigate('/dashboard')
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080C14',
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            background: '#0D1525',
            borderRadius: 4,
            border: '1px solid rgba(108, 142, 255, 0.15)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #F1F5F9 30%, #6C8EFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Sign In
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              {/* 2. Error Feedback */}
              {loginMutation.isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  { (loginMutation.error as any)?.response?.data?.message || 'Invalid credentials' }
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email Address"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginMutation.isPending}
              />
              
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loginMutation.isPending}
                sx={{
                  mt: 4, py: 1.5,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6C8EFF 0%, #4A6AE8 100%)',
                }}
              >
                {/* 3. Loading State */}
                {loginMutation.isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Launch Dashboard'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}