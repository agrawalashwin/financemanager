/**
 * Main Theme Export
 * Uses Nestly-style minimalist theme with token-driven design
 * Supports light/dark mode with executive-grade aesthetic
 */
import { nestlyLightTheme } from './theme/nestlyTheme';

// Export the Nestly theme as the main theme
export const theme = nestlyLightTheme;

// Re-export tokens for use in components
export { tokens } from './theme/tokens';
export { nestlyLightTheme, nestlyDarkTheme } from './theme/nestlyTheme';

