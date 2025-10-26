import { createTheme, ThemeOptions } from '@mui/material/styles';
import { tokens } from './tokens';

/**
 * Nestly-Style Minimalist Theme
 * Executive-grade aesthetic: low-noise UI, crisp typography, generous whitespace
 */

const baseTheme: ThemeOptions = {
  shape: {
    borderRadius: tokens.radius.md,
  },
  typography: {
    fontFamily: tokens.typography.fontFamily,
    h1: {
      fontSize: '56px',
      fontWeight: 800,
      letterSpacing: -0.8,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '44px',
      fontWeight: 800,
      letterSpacing: -0.6,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '14px',
    },
    caption: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: `${tokens.container.lg}px !important`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadow[1],
          border: `1px solid ${tokens.grey[100]}`,
          transition: `all ${tokens.motion.micro}`,
          '&:hover': {
            boxShadow: tokens.shadow[2],
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
          fontWeight: 600,
          textTransform: 'none',
          transition: `all ${tokens.motion.micro}`,
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: tokens.shadow[1],
          },
        },
        outlined: {
          borderColor: tokens.grey[200],
          '&:hover': {
            borderColor: tokens.grey[300],
            backgroundColor: tokens.grey[50],
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'transparent',
          color: 'inherit',
          boxShadow: 'none',
          borderBottom: `1px solid ${tokens.grey[100]}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: tokens.grey[200],
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 500,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md,
          boxShadow: 'none',
          border: `1px solid ${tokens.grey[100]}`,
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.radius.sm,
            transition: `all ${tokens.motion.micro}`,
            '&:hover fieldset': {
              borderColor: tokens.grey[300],
            },
            '&.Mui-focused fieldset': {
              borderColor: tokens.brand.primary,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.xs,
          backgroundColor: tokens.grey[100],
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& thead th': {
            fontWeight: 600,
            backgroundColor: tokens.grey[50],
            borderBottom: `2px solid ${tokens.grey[200]}`,
          },
          '& tbody tr': {
            '&:hover': {
              backgroundColor: tokens.grey[25],
            },
          },
          '& tbody td': {
            borderBottom: `1px solid ${tokens.grey[100]}`,
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: tokens.radius.md,
            boxShadow: tokens.shadow[2],
          },
        },
      },
    },
  },
};

export const nestlyLightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: tokens.brand.primary,
      light: tokens.brand.primaryLight,
      dark: '#1557B0',
    },
    secondary: {
      main: tokens.grey[600],
      light: tokens.grey[400],
      dark: tokens.grey[800],
    },
    success: {
      main: tokens.semantic.success,
      light: tokens.semantic.successLight,
    },
    warning: {
      main: tokens.semantic.warning,
      light: tokens.semantic.warningLight,
    },
    error: {
      main: tokens.semantic.error,
      light: tokens.semantic.errorLight,
    },
    info: {
      main: tokens.semantic.info,
      light: tokens.semantic.infoLight,
    },
    background: {
      default: tokens.grey[25],
      paper: '#FFFFFF',
    },
    text: {
      primary: tokens.grey[900],
      secondary: tokens.grey[600],
    },
    divider: tokens.grey[200],
  },
});

export const nestlyDarkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#8AB4F8',
      light: '#A8C8FF',
      dark: '#5A8FD8',
    },
    secondary: {
      main: tokens.grey[400],
      light: tokens.grey[300],
      dark: tokens.grey[500],
    },
    success: {
      main: '#81C995',
      light: 'rgba(129,201,149,0.12)',
    },
    warning: {
      main: '#FCC934',
      light: 'rgba(252,201,52,0.12)',
    },
    error: {
      main: '#F28482',
      light: 'rgba(242,132,130,0.12)',
    },
    info: {
      main: '#8AB4F8',
      light: 'rgba(138,180,248,0.12)',
    },
    background: {
      default: '#0C0D10',
      paper: '#111216',
    },
    text: {
      primary: '#F4F6FA',
      secondary: tokens.grey[400],
    },
    divider: 'rgba(255,255,255,0.12)',
  },
});

export default nestlyLightTheme;

