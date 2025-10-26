/**
 * Application Constants
 * Centralized configuration for the entire application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  ENDPOINTS: {
    TRANSACTIONS: '/transactions',
    SUMMARY: '/summary',
    BUDGETS: '/budgets',
  },
} as const;

// Categories (must match database constraints)
export const CATEGORIES = ['business', 'personal', 'investment'] as const;
export type Category = typeof CATEGORIES[number];

// Subcategories
export const SUBCATEGORIES = ['Contractors', 'Software', 'AI and Infra', 'Other'] as const;
export type Subcategory = typeof SUBCATEGORIES[number];

// Transaction Types
export const TRANSACTION_TYPES = ['expense', 'revenue'] as const;
export type TransactionType = typeof TRANSACTION_TYPES[number];

// Frequencies
export const FREQUENCIES = [
  'one-time',
  'daily',
  'weekly',
  'bi-weekly',
  'monthly',
  'quarterly',
  'annual',
] as const;
export type Frequency = typeof FREQUENCIES[number];

// Frequency Display Names
export const FREQUENCY_LABELS: Record<Frequency, string> = {
  'one-time': 'One-time',
  'daily': 'Daily',
  'weekly': 'Weekly',
  'bi-weekly': 'Bi-weekly',
  'monthly': 'Monthly',
  'quarterly': 'Quarterly',
  'annual': 'Annual',
} as const;

// Frequency to Monthly Multiplier
export const FREQUENCY_MULTIPLIERS: Record<Frequency, number> = {
  'one-time': 1,
  'daily': 30,
  'weekly': 4.3,
  'bi-weekly': 2.15,
  'monthly': 1,
  'quarterly': 0.33,
  'annual': 0.083,
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  MONTHS_HISTORY: 6,
  MONTHS_FORECAST: 12,
  COLORS: {
    REVENUE: '#2D5016',
    EXPENSE: '#5C2E2E',
    NET: '#1A3A52',
    FORECAST: '#4A3F5C',
    GRID_LINE: '#E0E0E0',
    AXIS_TEXT: '#666666',
    DARK_GREY: '#333333',
    WHITE: '#FFFFFF',
  },
} as const;

// Drawer Configuration
export const DRAWER_CONFIG = {
  WIDTH: 280,
  BREAKPOINT: 'md',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  AMOUNT_MIN: 0.01,
  AMOUNT_MAX: 999999.99,
  DESCRIPTION_MIN: 1,
  DESCRIPTION_MAX: 255,
  NOTES_MAX: 500,
} as const;

// Default Values
export const DEFAULT_VALUES = {
  TRANSACTION: {
    type: 'expense' as TransactionType,
    category: 'business' as Category,
    frequency: 'monthly' as Frequency,
    amount: 0,
    description: '',
    vendor: '',
    subcategory: '',
    notes: '',
  },
  BUDGET: {
    threshold: 80,
  },
} as const;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  COMMAND_PALETTE: 'Cmd/Ctrl+K',
  DASHBOARD: 'D',
  TRANSACTIONS: 'T',
  ADD_TRANSACTION: 'A',
  IMPORT_CSV: 'I',
  BUDGETS: 'B',
  SETTINGS: 'S',
  HELP: '?',
} as const;

// Messages
export const MESSAGES = {
  SUCCESS: {
    TRANSACTION_ADDED: 'Transaction added successfully!',
    TRANSACTION_UPDATED: 'Transaction updated successfully!',
    TRANSACTION_DELETED: 'Transaction deleted successfully!',
    BUDGET_ADDED: 'Budget added successfully!',
    BUDGET_UPDATED: 'Budget updated successfully!',
    BUDGET_DELETED: 'Budget deleted successfully!',
  },
  ERROR: {
    TRANSACTION_FAILED: 'Failed to add transaction',
    FETCH_FAILED: 'Failed to fetch data',
    INVALID_INPUT: 'Invalid input',
  },
} as const;

// Responsive Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1280,
  XL: 1920,
} as const;

// Spacing
export const SPACING = {
  XS: 0.5,
  SM: 1,
  MD: 2,
  LG: 3,
  XL: 4,
} as const;

