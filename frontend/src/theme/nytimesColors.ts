/**
 * NY Times Color Palette
 * Professional, sophisticated color scheme inspired by The New York Times
 * Used for financial data visualization
 */

export const nytimesColors = {
  // Primary palette - sophisticated greys and blacks
  black: '#000000',
  darkGrey: '#333333',
  mediumGrey: '#666666',
  lightGrey: '#999999',
  paleGrey: '#CCCCCC',
  offWhite: '#F5F5F5',
  white: '#FFFFFF',

  // Accent colors - muted and sophisticated
  // Revenue/Positive - deep forest green
  revenue: '#2D5016',
  revenueLight: '#4A7C2C',
  revenueLighter: '#6BA547',
  revenueAccent: '#8FBB5F',

  // Expense/Negative - deep burgundy red
  expense: '#5C2E2E',
  expenseLight: '#8B3A3A',
  expenseLighter: '#B84C4C',
  expenseAccent: '#D97070',

  // Net Income - deep navy blue
  net: '#1A3A52',
  netLight: '#2E5F7F',
  netLighter: '#4A8FBF',
  netAccent: '#6BA8D9',

  // Forecast - muted purple
  forecast: '#4A3F5C',
  forecastLight: '#6B5B7F',
  forecastLighter: '#8B7BA3',
  forecastAccent: '#A89BC3',

  // Semantic colors - NY Times style
  success: '#2D5016',      // Deep forest green
  warning: '#8B6914',      // Muted gold
  error: '#5C2E2E',        // Deep burgundy
  info: '#1A3A52',         // Deep navy

  // Gradients for charts
  gradients: {
    revenue: {
      start: '#2D5016',
      end: '#8FBB5F',
    },
    expense: {
      start: '#5C2E2E',
      end: '#D97070',
    },
    net: {
      start: '#1A3A52',
      end: '#6BA8D9',
    },
    forecast: {
      start: '#4A3F5C',
      end: '#A89BC3',
    },
  },

  // Neutral palette for backgrounds and borders
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Chart-specific colors
  chart: {
    gridLine: '#E0E0E0',
    gridLineOpacity: 0.15,
    axisText: '#666666',
    axisLine: '#CCCCCC',
    tooltip: '#FFFFFF',
    tooltipBg: '#333333',
    tooltipBorder: '#CCCCCC',
  },

  // Data visualization palette (for multiple series)
  series: [
    '#2D5016', // Revenue - forest green
    '#5C2E2E', // Expense - burgundy
    '#1A3A52', // Net - navy
    '#4A3F5C', // Forecast - purple
    '#8B6914', // Alternative - gold
    '#2E5F7F', // Alternative - teal
  ],
};

/**
 * Get color with opacity
 */
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Get gradient definition for SVG
 */
export const getGradientDef = (
  id: string,
  startColor: string,
  endColor: string,
  direction: 'vertical' | 'horizontal' = 'vertical'
) => {
  if (direction === 'vertical') {
    return {
      id,
      x1: '0%',
      y1: '0%',
      x2: '0%',
      y2: '100%',
      stops: [
        { offset: '0%', color: startColor, opacity: 0.8 },
        { offset: '100%', color: endColor, opacity: 0.2 },
      ],
    };
  } else {
    return {
      id,
      x1: '0%',
      y1: '0%',
      x2: '100%',
      y2: '0%',
      stops: [
        { offset: '0%', color: startColor, opacity: 0.8 },
        { offset: '100%', color: endColor, opacity: 0.2 },
      ],
    };
  }
};

/**
 * Color scale for categorical data
 */
export const getCategoryColor = (index: number): string => {
  return nytimesColors.series[index % nytimesColors.series.length];
};

/**
 * Get contrasting text color for background
 */
export const getContrastColor = (bgColor: string): string => {
  // Simple luminance calculation
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? nytimesColors.black : nytimesColors.white;
};

