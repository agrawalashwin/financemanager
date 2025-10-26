/**
 * Navigation Configuration
 * Centralized navigation structure for the application
 */

import {
  Dashboard as DashboardIcon,
  SwapHoriz as TransactionsIcon,
  PieChart as BudgetsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  shortcut?: string;
  keywords?: string;
  section?: string;
  module?: string; // Module name for permission checking
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: DashboardIcon,
    shortcut: 'd',
    keywords: 'home dashboard overview',
    section: 'Navigation',
    module: 'dashboard',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    path: '/transactions',
    icon: TransactionsIcon,
    shortcut: 't',
    keywords: 'transactions list view',
    section: 'Navigation',
    module: 'transactions',
  },
  {
    id: 'budgets',
    label: 'Budgets',
    path: '/budgets',
    icon: BudgetsIcon,
    shortcut: 'b',
    keywords: 'budgets spending limits',
    section: 'Navigation',
    module: 'budgets',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
    shortcut: 's',
    keywords: 'settings preferences configuration',
    section: 'Navigation',
    module: 'settings',
  },
];

export const ACTION_ITEMS: NavItem[] = [
  {
    id: 'add-transaction',
    label: 'Add Transaction',
    path: '/add-transaction',
    icon: TransactionsIcon,
    shortcut: 'a',
    keywords: 'add new transaction create',
    section: 'Actions',
  },
  {
    id: 'import',
    label: 'Import CSV',
    path: '/import',
    icon: TransactionsIcon,
    shortcut: 'i',
    keywords: 'import csv upload bulk',
    section: 'Actions',
  },
];

export const HELP_ITEMS: NavItem[] = [
  {
    id: 'help',
    label: 'Keyboard Shortcuts',
    path: '#',
    icon: DashboardIcon,
    shortcut: '?',
    keywords: 'help shortcuts keyboard',
    section: 'Help',
  },
];

export const ALL_NAV_ITEMS = [...MAIN_NAV_ITEMS, ...ACTION_ITEMS, ...HELP_ITEMS];

/**
 * Get navigation item by ID
 */
export const getNavItemById = (id: string): NavItem | undefined => {
  return ALL_NAV_ITEMS.find(item => item.id === id);
};

/**
 * Get navigation item by path
 */
export const getNavItemByPath = (path: string): NavItem | undefined => {
  return ALL_NAV_ITEMS.find(item => item.path === path);
};

/**
 * Get all navigation items for command palette
 */
export const getCommandPaletteItems = () => {
  return ALL_NAV_ITEMS.filter(item => item.path !== '#');
};

/**
 * Drawer Configuration
 */
export const DRAWER_CONFIG = {
  WIDTH: 200,
  BREAKPOINT: 'md',
};

