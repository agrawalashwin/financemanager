import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';

interface UIState {
  // Theme
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  // Currency
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;

  // Modals
  addTransactionOpen: boolean;
  setAddTransactionOpen: (open: boolean) => void;

  editTransactionOpen: boolean;
  setEditTransactionOpen: (open: boolean) => void;

  // Filters
  dateRangeStart: string | null;
  dateRangeEnd: string | null;
  setDateRange: (start: string | null, end: string | null) => void;

  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;

  selectedAccount: string | null;
  setSelectedAccount: (account: string | null) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Density
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  themeMode: 'system' as ThemeMode,
  currency: 'USD' as CurrencyCode,
  addTransactionOpen: false,
  editTransactionOpen: false,
  dateRangeStart: null,
  dateRangeEnd: null,
  selectedCategory: null,
  selectedAccount: null,
  sidebarOpen: true,
  compactMode: false,
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      ...initialState,

      setThemeMode: (mode) => set({ themeMode: mode }),
      setCurrency: (code) => set({ currency: code }),

      setAddTransactionOpen: (open) => set({ addTransactionOpen: open }),
      setEditTransactionOpen: (open) => set({ editTransactionOpen: open }),

      setDateRange: (start, end) => set({ dateRangeStart: start, dateRangeEnd: end }),
      setSelectedCategory: (category) => {
        // Validate category against allowed values
        const validCategories = ['business', 'personal', 'investment', 'all', null];
        const validCategory = validCategories.includes(category) ? category : null;
        set({ selectedCategory: validCategory });
      },
      setSelectedAccount: (account) => set({ selectedAccount: account }),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCompactMode: (compact) => set({ compactMode: compact }),

      reset: () => set(initialState),
    }),
    {
      name: 'ui-store',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        // Migration from v1 to v2: fix invalid category values
        if (version === 1) {
          const validCategories = ['business', 'personal', 'investment', 'all', null];
          if (persistedState.selectedCategory && !validCategories.includes(persistedState.selectedCategory)) {
            persistedState.selectedCategory = null;
          }
        }
        return persistedState;
      },
    }
  )
);

