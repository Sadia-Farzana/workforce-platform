import { createTheme, alpha } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary']
  }
}

const BASE_FONT = '"Plus Jakarta Sans", sans-serif'
const MONO_FONT = '"JetBrains Mono", monospace'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C8EFF',
      light: '#8FA4FF',
      dark: '#4A6AE8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF8C6B',
      light: '#FFA88A',
      dark: '#E06A48',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4ADE80',
      light: '#86EFAC',
      dark: '#16A34A',
    },
    warning: {
      main: '#FACC15',
      light: '#FDE68A',
      dark: '#CA8A04',
    },
    error: {
      main: '#F87171',
      light: '#FCA5A5',
      dark: '#DC2626',
    },
    info: {
      main: '#38BDF8',
      light: '#7DD3FC',
      dark: '#0284C7',
    },
    neutral: {
      main: '#94A3B8',
      light: '#CBD5E1',
      dark: '#64748B',
    },
    background: {
      default: '#080C14',
      paper: '#0D1525',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    divider: 'rgba(148, 163, 184, 0.12)',
  },
  typography: {
    fontFamily: BASE_FONT,
    h1: { fontFamily: BASE_FONT, fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontFamily: BASE_FONT, fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: BASE_FONT, fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontFamily: BASE_FONT, fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontFamily: BASE_FONT, fontWeight: 600 },
    h6: { fontFamily: BASE_FONT, fontWeight: 600 },
    subtitle1: { fontFamily: BASE_FONT, fontWeight: 500 },
    subtitle2: { fontFamily: BASE_FONT, fontWeight: 500 },
    body1: { fontFamily: BASE_FONT, fontWeight: 400 },
    body2: { fontFamily: BASE_FONT, fontWeight: 400 },
    caption: { fontFamily: MONO_FONT, fontSize: '0.72rem', letterSpacing: '0.04em' },
    overline: { fontFamily: MONO_FONT, letterSpacing: '0.12em' },
    button: { fontFamily: BASE_FONT, fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          scrollbarWidth: 'thin',
          scrollbarColor: '#334155 transparent',
        },
        '*::-webkit-scrollbar': { width: '6px', height: '6px' },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': {
          background: '#334155',
          borderRadius: '3px',
        },
        body: {
          background: '#080C14',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#0D1525',
          border: '1px solid rgba(148, 163, 184, 0.08)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#0D1525',
          border: '1px solid rgba(148, 163, 184, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 16px rgba(108, 142, 255, 0.35)' },
        },
        outlined: {
          borderColor: 'rgba(148, 163, 184, 0.2)',
          '&:hover': { borderColor: 'rgba(108, 142, 255, 0.6)', background: alpha('#6C8EFF', 0.08) },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: BASE_FONT,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontFamily: MONO_FONT,
          fontSize: '0.7rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#64748B',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          background: '#080C14',
        },
        body: {
          borderBottom: '1px solid rgba(148, 163, 184, 0.06)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, background: 'rgba(148, 163, 184, 0.1)' },
        bar: { borderRadius: 4 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: BASE_FONT,
          fontSize: '0.75rem',
          background: '#1E293B',
          border: '1px solid rgba(148, 163, 184, 0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(108, 142, 255, 0.5)' },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(148, 163, 184, 0.1)' },
      },
    },
  },
})
