// Modern Finance Theme - Personal P&L
// Based on Monarch/Copilot aesthetic with MUI v7

import { createTheme, alpha } from '@mui/material/styles';

// Design Tokens - Colors
const primary = '#4F46E5';   // Indigo 600
const accent  = '#0EA5E9';   // Sky 500
const success = '#16A34A';   // Green 600
const warning = '#F59E0B';   // Amber 500
const danger  = '#EF4444';   // Red 500

const bg       = '#FFFFFF';
const surface  = '#FFFFFF';
const surface2 = '#F8FAFC';  // subtle container

const text       = '#0B1020';
const textMuted  = '#475569';
const border     = '#E2E8F0';
const gridline   = '#F1F5F9';

// Chart tokens
export const CHART_TOKENS = {
  font: '12px Inter, ui-sans-serif',
  tick: '#64748B',
  axis: '#E2E8F0',
  grid: '#F1F5F9',
  radius: 4,
  palette: [primary, success, warning, accent, '#F97316', danger, '#94A3B8'],
  tooltip: {
    bg: '#FFF',
    border: '#E2E8F0',
    shadow: '0 8px 28px rgba(2,6,23,.08)',
    r: 12,
    p: 10
  }
};

export const modernFinanceTheme = createTheme({
  cssVariables: true, // MUI v7 CSS variables support
  
  palette: {
    mode: 'light',
    primary: { 
      main: primary,
      light: alpha(primary, 0.1),
      dark: '#3730A3',
    },
    secondary: { 
      main: accent,
      light: alpha(accent, 0.1),
    },
    success: { 
      main: success,
      light: '#BBF7D0',
      dark: '#15803D',
      contrastText: '#FFFFFF',
    },
    warning: { 
      main: warning,
      light: '#FEF3C7',
      dark: '#D97706',
    },
    error: { 
      main: danger,
      light: '#FEE2E2',
      dark: '#DC2626',
      contrastText: '#FFFFFF',
    },
    text: { 
      primary: text, 
      secondary: textMuted,
      disabled: alpha(textMuted, 0.5),
    },
    divider: border,
    background: { 
      default: bg, 
      paper: surface,
    },
    grey: {
      50: surface2,
      100: gridline,
      200: border,
      300: '#CBD5E1',
      400: '#94A3B8',
      500: textMuted,
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: text,
    }
  },

  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    
    // Display
    h1: { 
      fontSize: 36, 
      lineHeight: 1.22,
      fontWeight: 700, 
      letterSpacing: '-0.01em',
      color: text,
    },
    
    // H1
    h2: { 
      fontSize: 28, 
      lineHeight: 1.29,
      fontWeight: 700, 
      letterSpacing: '-0.01em',
      color: text,
    },
    
    // H2
    h3: { 
      fontSize: 22, 
      lineHeight: 1.36,
      fontWeight: 700, 
      letterSpacing: '-0.01em',
      color: text,
    },
    
    // H3
    h4: { 
      fontSize: 16, 
      lineHeight: 1.5,
      fontWeight: 600,
      color: text,
    },
    
    // Body
    body1: { 
      fontSize: 14, 
      lineHeight: 1.57,
      fontWeight: 500,
      color: text,
    },
    
    body2: { 
      fontSize: 14, 
      lineHeight: 1.57,
      fontWeight: 400,
      color: textMuted,
    },
    
    // Small
    caption: { 
      fontSize: 12, 
      lineHeight: 1.5,
      fontWeight: 500,
      color: textMuted,
    },
    
    button: {
      fontSize: 14,
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: 0,
    },
    
    subtitle1: {
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: text,
    },
    
    subtitle2: {
      fontSize: 13,
      fontWeight: 600,
      color: textMuted,
    },
  },

  shape: { 
    borderRadius: 16, // lg default
  },

  shadows: [
    'none',
    // card shadow
    '0 1px 0 rgba(15,23,42,0.06), 0 8px 28px rgba(2,6,23,0.08)',
    // popover shadow
    '0 10px 38px rgba(2,6,23,0.18), 0 10px 10px rgba(2,6,23,0.08)',
    // Repeat card shadow for other elevations
    ...Array(22).fill('0 1px 0 rgba(15,23,42,0.06), 0 8px 28px rgba(2,6,23,0.08)')
  ] as any,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': { 
          '--ring': alpha(primary, 0.35),
          '--radius-sm': '8px',
          '--radius-md': '12px',
          '--radius-lg': '16px',
          '--radius-xl': '20px',
        },
        body: { 
          backgroundColor: surface, 
          color: text,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '*:focus-visible': { 
          outline: 'none', 
          boxShadow: `0 0 0 3px ${alpha(primary, 0.35)}`,
          borderRadius: '12px',
        },
        // Scrollbar styling
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: gridline,
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: border,
          borderRadius: '4px',
          '&:hover': {
            background: textMuted,
          }
        }
      }
    },

    MuiButton: {
      defaultProps: { 
        disableElevation: true, 
        variant: 'contained', 
        size: 'medium',
      },
      styleOverrides: {
        root: { 
          textTransform: 'none', 
          borderRadius: 12,
          fontWeight: 600,
          transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
        },
        sizeLarge: {
          height: 44,
          paddingLeft: 16,
          paddingRight: 16,
        },
        sizeMedium: {
          height: 40,
          paddingLeft: 14,
          paddingRight: 14,
        },
        sizeSmall: {
          height: 32,
          paddingLeft: 10,
          paddingRight: 10,
        },
        containedPrimary: { 
          ':hover': { 
            filter: 'brightness(1.05)',
            transform: 'translateY(-1px)',
          }, 
          ':active': { 
            filter: 'brightness(0.95)',
            transform: 'translateY(0)',
          } 
        },
        outlined: { 
          borderColor: border, 
          backgroundColor: surface2,
          ':hover': {
            backgroundColor: alpha(primary, 0.05),
            borderColor: primary,
          }
        },
        text: {
          ':hover': {
            backgroundColor: alpha(primary, 0.05),
          }
        }
      }
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 120ms cubic-bezier(0.22,1,0.36,1)',
          ':hover': {
            backgroundColor: alpha(primary, 0.05),
          }
        },
        sizeSmall: {
          width: 32,
          height: 32,
        },
        sizeMedium: {
          width: 40,
          height: 40,
        }
      }
    },

    MuiTextField: {
      defaultProps: { 
        size: 'small', 
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: surface,
            transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
            '& fieldset': { 
              borderColor: border,
              transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
            },
            '&:hover fieldset': { 
              borderColor: alpha(primary, 0.5),
            },
            '&.Mui-focused fieldset': { 
              borderColor: primary, 
              borderWidth: '2px',
              boxShadow: `0 0 0 3px ${alpha(primary, 0.2)}`,
            },
            '&.Mui-error fieldset': {
              borderColor: danger,
            },
            '&.Mui-disabled': {
              opacity: 0.6,
              cursor: 'not-allowed',
            }
          },
          '& .MuiInputBase-input': {
            fontSize: 14,
            fontWeight: 500,
            color: text,
            '&::placeholder': {
              color: alpha(textMuted, 0.6),
              opacity: 1,
            }
          },
          '& .MuiFormHelperText-root': {
            marginTop: 4,
            fontSize: 12,
            color: textMuted,
            '&.Mui-error': {
              color: danger,
            }
          }
        }
      }
    },

    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 12,
        }
      }
    },

    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          border: `1px solid ${border}`,
          boxShadow: '0 10px 38px rgba(2,6,23,0.18), 0 10px 10px rgba(2,6,23,0.08)',
          marginTop: 4,
        },
        listbox: {
          padding: 4,
          '& .MuiAutocomplete-option': {
            borderRadius: 8,
            minHeight: 36,
            padding: '8px 12px',
            fontSize: 14,
            '&:hover': {
              backgroundColor: alpha(primary, 0.05),
            },
            '&[aria-selected="true"]': {
              backgroundColor: alpha(primary, 0.1),
              color: primary,
              fontWeight: 600,
            }
          }
        }
      }
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${border}`,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 0 rgba(15,23,42,0.06), 0 8px 28px rgba(2,6,23,0.08)',
        },
        elevation2: {
          boxShadow: '0 10px 38px rgba(2,6,23,0.18), 0 10px 10px rgba(2,6,23,0.08)',
        }
      }
    },

    MuiCard: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${border}`,
          boxShadow: '0 1px 0 rgba(15,23,42,0.06), 0 8px 28px rgba(2,6,23,0.08)',
          borderRadius: 20,
          transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(2,6,23,.08)',
            transform: 'translateY(-1px)',
          }
        }
      }
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          '&:last-child': {
            paddingBottom: 20,
          }
        }
      }
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontSize: 12,
          height: 24,
          fontWeight: 500,
        },
        outlined: {
          borderWidth: 1,
        },
        colorError: {
          backgroundColor: '#FEE2E2',
          borderColor: '#FECACA',
          color: '#991B1B',
        },
        colorSuccess: {
          backgroundColor: '#D1FAE5',
          borderColor: '#A7F3D0',
          color: '#065F46',
        },
        colorWarning: {
          backgroundColor: '#FEF3C7',
          borderColor: '#FDE68A',
          color: '#92400E',
        }
      }
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${border}`,
        }
      }
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: surface2,
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: textMuted,
            borderBottom: `1px solid ${border}`,
          }
        }
      }
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: 'background-color 120ms cubic-bezier(0.22,1,0.36,1)',
            '&:hover': {
              backgroundColor: alpha(primary, 0.02),
            },
            '&:nth-of-type(even)': {
              backgroundColor: alpha(surface2, 0.4),
            }
          }
        }
      }
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: 14,
          padding: '12px 16px',
          borderBottom: `1px solid ${gridline}`,
        }
      }
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 12,
          border: `1px solid ${border}`,
          boxShadow: '0 8px 28px rgba(2,6,23,0.08)',
          backgroundColor: surface,
          color: text,
          fontSize: 12,
          padding: '8px 12px',
        },
        arrow: {
          color: surface,
          '&::before': {
            border: `1px solid ${border}`,
          }
        }
      }
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 10px 38px rgba(2,6,23,0.18), 0 10px 10px rgba(2,6,23,0.08)',
        }
      }
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: 18,
          fontWeight: 700,
          padding: '20px 24px 16px',
        }
      }
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '0 24px 20px',
        }
      }
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 20px',
        }
      }
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          borderRadius: 2,
          backgroundColor: primary,
        },
        root: {
          minHeight: 44,
        }
      }
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: 14,
          fontWeight: 600,
          minHeight: 44,
          color: textMuted,
          transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
          '&.Mui-selected': {
            color: primary,
          },
          '&:hover': {
            color: primary,
            backgroundColor: alpha(primary, 0.05),
          }
        }
      }
    },

    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: gridline,
          padding: 4,
          borderRadius: 999,
          border: 'none',
        }
      }
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: 999,
          textTransform: 'none',
          fontSize: 14,
          fontWeight: 600,
          padding: '6px 16px',
          color: textMuted,
          transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
          '&.Mui-selected': {
            backgroundColor: surface,
            color: primary,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: surface,
            }
          },
          '&:hover': {
            backgroundColor: alpha(surface, 0.5),
          }
        }
      }
    },

    MuiPagination: {
      styleOverrides: {
        ul: {
          gap: 4,
        }
      }
    },

    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          '&.Mui-selected': {
            backgroundColor: primary,
            color: '#fff',
            '&:hover': {
              backgroundColor: primary,
              filter: 'brightness(1.05)',
            }
          }
        }
      }
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${border}`,
          backdropFilter: 'saturate(180%) blur(8px)',
          backgroundColor: alpha(surface, 0.7),
        }
      }
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
          '@media (min-width: 600px)': {
            minHeight: 64,
          }
        }
      }
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${border}`,
          backgroundColor: surface,
          width: 260,
        }
      }
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '2px 12px',
          padding: '10px 12px',
          transition: 'all 120ms cubic-bezier(0.22,1,0.36,1)',
          '&:hover': {
            backgroundColor: alpha(primary, 0.05),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(primary, 0.1),
            color: primary,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: alpha(primary, 0.15),
            }
          }
        }
      }
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: 'inherit',
        }
      }
    },

    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: 500,
        }
      }
    },

    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 12,
            boxShadow: '0 8px 28px rgba(2,6,23,0.08)',
          }
        }
      }
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: '#D1FAE5',
          color: '#065F46',
          border: `1px solid #A7F3D0`,
        },
        standardError: {
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          border: `1px solid #FECACA`,
        },
        standardWarning: {
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          border: `1px solid #FDE68A`,
        },
        standardInfo: {
          backgroundColor: '#DBEAFE',
          color: '#1E40AF',
          border: `1px solid #BFDBFE`,
        }
      }
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 999,
          backgroundColor: gridline,
        },
        bar: {
          borderRadius: 999,
        }
      }
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: border,
        }
      }
    },
  }
});

// Utility functions for currency formatting
export const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(n);

export const fmtCompact = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(n);
