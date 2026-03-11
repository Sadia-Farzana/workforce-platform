import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
  InputAdornment, IconButton, alpha,
} from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type LoginFormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    control, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null)
    try {
      const res = await authApi.login(data.email, data.password)
      login(res.accessToken, res.user)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please check your credentials.'
      setApiError(msg)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#080C14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
      }}
    >
      {/* Animated background glows */}
      <Box sx={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <Box sx={{
          position: 'absolute',
          width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,142,255,0.12) 0%, transparent 70%)',
          top: '-200px', left: '-150px',
          animation: 'pulse1 8s ease-in-out infinite',
          '@keyframes pulse1': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.7 },
            '50%': { transform: 'scale(1.15)', opacity: 1 },
          },
        }} />
        <Box sx={{
          position: 'absolute',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,107,0.08) 0%, transparent 70%)',
          bottom: '-100px', right: '-100px',
          animation: 'pulse2 10s ease-in-out infinite',
          '@keyframes pulse2': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
            '50%': { transform: 'scale(1.2)', opacity: 1 },
          },
        }} />
        {/* Grid pattern overlay */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(108,142,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,142,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />
      </Box>

      {/* Login card */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          background: 'rgba(13, 21, 37, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: 4,
          p: { xs: 3, sm: 4.5 },
          boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,142,255,0.08)',
          animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          '@keyframes slideUp': {
            from: { opacity: 0, transform: 'translateY(24px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        {/* Logo & branding */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56, height: 56,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #6C8EFF 0%, #4A6AE8 100%)',
              boxShadow: '0 8px 24px rgba(108,142,255,0.4)',
              mb: 2.5,
            }}
          >
            <PeopleAltRoundedIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: '#F1F5F9',
              letterSpacing: '-0.03em',
              mb: 0.5,
            }}
          >
            Workforce
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
            Sign in to your admin account
          </Typography>
        </Box>

        {/* Error alert */}
        {apiError && (
          <Alert
            severity="error"
            sx={{
              mb: 3, borderRadius: 2,
              background: alpha('#F87171', 0.08),
              border: '1px solid rgba(248,113,113,0.2)',
              color: '#FCA5A5',
              '& .MuiAlert-icon': { color: '#F87171' },
            }}
          >
            {apiError}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email address"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ fontSize: 18, color: '#475569' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.03)',
                    transition: 'all 0.2s',
                    '&.Mui-focused': {
                      background: alpha('#6C8EFF', 0.05),
                      '& fieldset': { borderColor: '#6C8EFF !important' },
                    },
                  },
                }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ fontSize: 18, color: '#475569' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        sx={{ color: '#475569', '&:hover': { color: '#94A3B8' } }}
                      >
                        {showPassword
                          ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                          : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.03)',
                    transition: 'all 0.2s',
                    '&.Mui-focused': {
                      background: alpha('#6C8EFF', 0.05),
                      '& fieldset': { borderColor: '#6C8EFF !important' },
                    },
                  },
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              height: 48,
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6C8EFF 0%, #4A6AE8 100%)',
              boxShadow: '0 8px 24px rgba(108,142,255,0.35)',
              borderRadius: 2.5,
              transition: 'all 0.2s',
              '&:hover': {
                background: 'linear-gradient(135deg, #8FA4FF 0%, #6C8EFF 100%)',
                boxShadow: '0 12px 32px rgba(108,142,255,0.5)',
                transform: 'translateY(-1px)',
              },
              '&:active': { transform: 'translateY(0)' },
              '&:disabled': {
                background: alpha('#6C8EFF', 0.3),
                boxShadow: 'none',
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        {/* Footer hint */}
        <Box sx={{ mt: 3.5, pt: 3, borderTop: '1px solid rgba(148,163,184,0.08)', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#334155', fontFamily: '"JetBrains Mono", monospace' }}>
            Workforce Management Platform · v2.0
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
