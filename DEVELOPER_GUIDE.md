# Developer Guide - Personal P&L Application

## Quick Start

### Project Structure
```
frontend/src/
├── components/
│   ├── form/              # Reusable form components
│   ├── charts/            # D3 chart components
│   ├── common/            # Common UI components
│   ├── AppShell.jsx       # Main layout
│   ├── Dashboard.jsx      # Dashboard page
│   ├── TransactionForm.jsx
│   ├── TransactionGrid.jsx
│   ├── TransactionList.jsx
│   ├── CSVImport.jsx
│   ├── KPICard.jsx
│   └── CommandPalette.jsx
├── config/                # Configuration files
│   ├── constants.ts       # App constants
│   └── navigation.ts      # Navigation config
├── hooks/                 # Custom hooks
│   ├── useTransactions.ts
│   ├── useDateCalculations.ts
│   └── useChartDimensions.ts
├── pages/                 # Page components
│   ├── Budgets.jsx
│   ├── Reports.jsx
│   ├── Settings.jsx
│   └── ThemeShowcase.jsx
├── schemas/               # Validation schemas
├── store/                 # State management
├── theme/                 # Theme configuration
├── utils/                 # Utility functions
└── App.jsx               # Root component
```

---

## Using Form Components

### FormField (Text Input)
```typescript
import { FormField } from './components/form';

<FormField
  control={control}
  name="description"
  label="Description"
  required
  helperText="Enter a description"
/>
```

### SelectField (Dropdown)
```typescript
import { SelectField } from './components/form';
import { CATEGORIES } from './config/constants';

<SelectField
  control={control}
  name="category"
  label="Category"
  options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
  required
/>
```

### DateField (Date Picker)
```typescript
import { DateField } from './components/form';

<DateField
  control={control}
  name="startDate"
  label="Start Date"
  required
  minDate="2024-01-01"
/>
```

---

## Using Custom Hooks

### Transaction Hooks
```typescript
import { 
  useTransactions, 
  useSummary,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction 
} from './hooks/useTransactions';

// Fetch transactions
const { data: transactions, isLoading } = useTransactions(userId);

// Fetch summary
const { data: summary } = useSummary(userId);

// Create transaction
const { mutate: createTx } = useCreateTransaction();
createTx({ userId, type: 'expense', ... });

// Update transaction
const { mutate: updateTx } = useUpdateTransaction();
updateTx({ id: '123', data: { amount: 100 } });

// Delete transaction
const { mutate: deleteTx } = useDeleteTransaction();
deleteTx('123');
```

### Date Calculation Hooks
```typescript
import {
  useMonthRange,
  useCurrentMonthKey,
  useOccurrencesInMonth,
  useFormatMonth,
  useIsMonthInPast
} from './hooks/useDateCalculations';

// Get month range
const months = useMonthRange(6, 12); // 6 months back, 12 months forward

// Get current month
const currentMonth = useCurrentMonthKey(); // "2024-10"

// Calculate occurrences
const occurrences = useOccurrencesInMonth(transaction, '2024-10');

// Format month
const formatted = useFormatMonth('2024-10'); // "Oct 24"

// Check if past
const isPast = useIsMonthInPast('2024-10');
```

---

## Using Constants

### Categories
```typescript
import { CATEGORIES, Category } from './config/constants';

// CATEGORIES = ['Mobius', 'Personal', 'Investment', 'Other']
CATEGORIES.forEach(cat => console.log(cat));
```

### Transaction Types
```typescript
import { TRANSACTION_TYPES, TransactionType } from './config/constants';

// TRANSACTION_TYPES = ['expense', 'revenue']
```

### Frequencies
```typescript
import { FREQUENCIES, FREQUENCY_LABELS, FREQUENCY_MULTIPLIERS } from './config/constants';

// FREQUENCIES = ['one-time', 'daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'annual']
// FREQUENCY_LABELS = { 'monthly': 'Monthly', ... }
// FREQUENCY_MULTIPLIERS = { 'monthly': 1, 'weekly': 4.3, ... }
```

### API Configuration
```typescript
import { API_CONFIG } from './config/constants';

// API_CONFIG.BASE_URL = 'http://localhost:5000/api'
// API_CONFIG.ENDPOINTS.TRANSACTIONS = '/transactions'
// API_CONFIG.ENDPOINTS.SUMMARY = '/summary'

const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`;
```

### Messages
```typescript
import { MESSAGES } from './config/constants';

// MESSAGES.SUCCESS.TRANSACTION_ADDED
// MESSAGES.ERROR.TRANSACTION_FAILED
```

### Chart Configuration
```typescript
import { CHART_CONFIG } from './config/constants';

// CHART_CONFIG.MONTHS_HISTORY = 6
// CHART_CONFIG.MONTHS_FORECAST = 12
// CHART_CONFIG.COLORS.REVENUE = '#2D5016'
// CHART_CONFIG.COLORS.EXPENSE = '#5C2E2E'
```

---

## Using Navigation Config

### Main Navigation Items
```typescript
import { MAIN_NAV_ITEMS } from './config/navigation';

// MAIN_NAV_ITEMS = [
//   { id: 'dashboard', label: 'Dashboard', path: '/', icon: DashboardIcon, ... },
//   { id: 'transactions', label: 'Transactions', path: '/transactions', ... },
//   ...
// ]

MAIN_NAV_ITEMS.forEach(item => {
  console.log(item.label, item.path);
});
```

### Get Navigation Item
```typescript
import { getNavItemById, getNavItemByPath } from './config/navigation';

const item = getNavItemById('dashboard');
const item = getNavItemByPath('/transactions');
```

---

## Adding New Features

### Add New Category
1. Update `CATEGORIES` in `src/config/constants.ts`
2. Update database schema if needed
3. Update validation schema if needed

### Add New Navigation Item
1. Add to `MAIN_NAV_ITEMS` in `src/config/navigation.ts`
2. Create new page component
3. Add route in `App.jsx`

### Add New Form Field
1. Create new field component in `src/components/form/`
2. Export from `src/components/form/index.ts`
3. Use in forms with react-hook-form

### Add New API Endpoint
1. Add to `API_CONFIG.ENDPOINTS` in `src/config/constants.ts`
2. Create custom hook in `src/hooks/`
3. Use hook in components

---

## Best Practices

### ✅ DO
- Use form components for all form fields
- Use custom hooks for data fetching
- Use constants instead of hardcoded values
- Use TypeScript for type safety
- Keep components small and focused
- Extract logic into hooks

### ❌ DON'T
- Hardcode API endpoints
- Hardcode category/type values
- Create duplicate form field code
- Mix data fetching with UI logic
- Use magic numbers or strings
- Create large monolithic components

---

## Testing

### Unit Tests
```typescript
import { renderHook, act } from '@testing-library/react';
import { useTransactions } from './hooks/useTransactions';

test('useTransactions fetches data', async () => {
  const { result } = renderHook(() => useTransactions('user-1'));
  
  await act(async () => {
    // Wait for data
  });
  
  expect(result.current.data).toBeDefined();
});
```

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import { FormField } from './components/form';

test('FormField renders with label', () => {
  render(<FormField control={control} name="test" label="Test" />);
  expect(screen.getByLabelText('Test')).toBeInTheDocument();
});
```

---

## Troubleshooting

### Form not updating
- Check that `control` is passed correctly
- Verify field name matches schema
- Check validation schema

### Data not fetching
- Check API endpoint in `API_CONFIG`
- Verify userId is passed
- Check network tab in DevTools

### Navigation not working
- Check path in `MAIN_NAV_ITEMS`
- Verify route exists in `App.jsx`
- Check Router setup

---

## Resources

- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Material-UI](https://mui.com/)
- [D3.js](https://d3js.org/)
- [TypeScript](https://www.typescriptlang.org/)

---

## Support

For questions or issues, refer to:
1. REFACTORING_SUMMARY.md - Overview of changes
2. Component source code - Well-commented
3. Config files - Self-documenting
4. Type definitions - TypeScript hints

