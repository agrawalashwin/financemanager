/**
 * Nestly-Style Design Tokens
 * Executive-grade minimalist aesthetic with token-driven theming
 */

export const tokens = {
  // Border radius scale (soft, not sharp)
  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
  },

  // Spacing grid (8px base)
  spacing: {
    base: 4, // 4px grid unit
  },

  // Container max-widths
  container: {
    xs: 640,
    sm: 768,
    md: 1024,
    lg: 1200,
    xl: 1440,
  },

  // Grey ramp - tuned for "Nestly" neutrality
  grey: {
    25: '#FCFCFD',
    50: '#F5F7FA',
    100: '#EEF1F5',
    200: '#E4E8EF',
    300: '#D6DCE5',
    400: '#BAC3D0',
    500: '#8E9AAF',
    600: '#6B7386',
    700: '#4D5363',
    800: '#2F3442',
    900: '#171A21',
  },

  // Brand colors
  brand: {
    primary: '#1A73E8', // Google blue accent
    primarySoft: 'rgba(26,115,232,0.12)',
    primaryLight: 'rgba(26,115,232,0.08)',
  },

  // Semantic colors
  semantic: {
    success: '#1E8E3E',
    successLight: 'rgba(30,142,62,0.12)',
    warning: '#F9AB00',
    warningLight: 'rgba(249,171,0,0.12)',
    error: '#D93025',
    errorLight: 'rgba(217,48,37,0.12)',
    info: '#1A73E8',
    infoLight: 'rgba(26,115,232,0.12)',
  },

  // Shadows - shallow elevation
  shadow: {
    1: '0 2px 8px rgba(0,0,0,0.06)',
    2: '0 6px 16px rgba(0,0,0,0.08)',
    3: '0 12px 24px rgba(0,0,0,0.10)',
  },

  // Motion/Animation
  motion: {
    micro: '150ms ease-in-out',
    medium: '250ms ease-in-out',
    macro: '350ms ease-in-out',
  },

  // Typography
  typography: {
    fontFamily: 'Inter, Roboto Flex, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
    fontFamilyMono: '"Roboto Mono", "Courier New", monospace',
  },

  // D3 Chart styling
  chart: {
    strokeWidth: 2,
    strokeWidthDense: 1.5,
    barRadius: 4,
    gridOpacity: 0.08,
    gridStroke: 1,
    tooltipRadius: 10,
    tooltipPadding: 12,
  },
};

/**
 * CSS Variables for runtime theming
 * Use in sx prop: `color: 'var(--color-primary)'`
 */
export const cssVariables = {
  light: {
    '--color-primary': tokens.brand.primary,
    '--color-primary-soft': tokens.brand.primarySoft,
    '--color-success': tokens.semantic.success,
    '--color-warning': tokens.semantic.warning,
    '--color-error': tokens.semantic.error,
    '--color-info': tokens.semantic.info,
    '--color-bg-default': tokens.grey[25],
    '--color-bg-paper': '#FFFFFF',
    '--color-text-primary': tokens.grey[900],
    '--color-text-secondary': tokens.grey[600],
    '--color-divider': tokens.grey[200],
    '--color-border': tokens.grey[200],
    '--shadow-1': tokens.shadow[1],
    '--shadow-2': tokens.shadow[2],
    '--shadow-3': tokens.shadow[3],
  },
  dark: {
    '--color-primary': '#8AB4F8',
    '--color-primary-soft': 'rgba(138,180,248,0.12)',
    '--color-success': '#81C995',
    '--color-warning': '#FCC934',
    '--color-error': '#F28482',
    '--color-info': '#8AB4F8',
    '--color-bg-default': '#0C0D10',
    '--color-bg-paper': '#111216',
    '--color-text-primary': '#F4F6FA',
    '--color-text-secondary': tokens.grey[400],
    '--color-divider': 'rgba(255,255,255,0.12)',
    '--color-border': 'rgba(255,255,255,0.12)',
    '--shadow-1': '0 2px 8px rgba(0,0,0,0.3)',
    '--shadow-2': '0 6px 16px rgba(0,0,0,0.4)',
    '--shadow-3': '0 12px 24px rgba(0,0,0,0.5)',
  },
};

/**
 * Utility function to get token value
 */
export const getToken = (path: string, defaultValue?: any) => {
  const keys = path.split('.');
  let value: any = tokens;
  for (const key of keys) {
    value = value?.[key];
  }
  return value ?? defaultValue;
};

