# Architecture Guide

## Overview

This document describes the architecture of the Personal P&L application following the Material Design 3 blueprint.

---

## State Management

### Server State (TanStack Query)
Handles all data from the backend API.

```typescript
// Example: Fetching transactions
import { useQuery } from '@tanstack/react-query';

function TransactionList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', { page, filters }],
    queryFn: () => fetch('/api/transactions').then(r => r.json()),
  });
}
```

**Query Keys Pattern:**
- `['transactions', { page, q, filters }]`
- `['budget', month]`
- `['pnl', range, groupBy]`

### UI State (Zustand)
Handles UI-only state (theme, filters, modals).

```typescript
import { useUIStore } from '@/store/uiStore';

function Dashboard() {
  const { themeMode, setThemeMode, currency } = useUIStore();
  
  return (
    <button onClick={() => setThemeMode('dark')}>
      Switch to Dark Mode
    </button>
  );
}
```

**Available State:**
- `themeMode` - 'light' | 'dark' | 'system'
- `currency` - 'USD' | 'EUR' | 'GBP' | 'INR'
- `dateRangeStart/End` - Date filters
- `selectedCategory/Account` - Active filters
- `addTransactionOpen` - Modal state
- `compactMode` - UI density

### Form State (react-hook-form)
Handles form data with validation.

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
});

function TransactionForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
}
```

---

## Routing

### Route Structure
```
/                    → Dashboard
/transactions        → Transactions List
/add-transaction     → Add Transaction Form
/import              → CSV Import
/budgets             → Budgets Page
/reports             → Reports Page
/settings            → Settings Page
```

### Navigation
Use React Router's `useNavigate` hook:

```typescript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/transactions')}>
      View Transactions
    </button>
  );
}
```

---

## Data Formatting

### Currency
Always use minor units (cents) in data layer.

```typescript
import { formatCurrency, minorToMajor } from '@/utils/format';

// Backend returns: { amountMinor: 500000 } (= $5,000.00)
const display = formatCurrency(500000, 'USD');  // "$5,000.00"
const major = minorToMajor(500000);             // 5000
```

### Numbers
```typescript
import { formatNumber, formatPercent } from '@/utils/format';

formatNumber(1234567, 'compact');  // "1.2M"
formatPercent(0.15);               // "15.0%"
```

### Dates
```typescript
import { formatDate, formatMonth, formatRelativeTime } from '@/utils/format';

formatDate('2025-10-24', 'short');      // "Oct 24, 25"
formatMonth('2025-10-24');              // "Oct 2025"
formatRelativeTime('2025-10-24');       // "2 days ago"
```

---

## D3 Charts

### Using Chart Primitives

```typescript
import { useChartDimensions } from '@/hooks/useChartDimensions';
import { Axis } from '@/components/charts/Axis';
import { Grid } from '@/components/charts/Grid';

function MyChart() {
  const { ref, width, height, margin, boundedWidth, boundedHeight } = 
    useChartDimensions({ minHeight: 300 });

  const xScale = d3.scaleBand().domain([...]).range([0, boundedWidth]);
  const yScale = d3.scaleLinear().domain([...]).range([boundedHeight, 0]);

  return (
    <Box ref={ref} sx={{ width: '100%', height: 300 }}>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <Grid xScale={xScale} yScale={yScale} width={boundedWidth} height={boundedHeight} />
          <Axis scale={xScale} position="bottom" />
          <Axis scale={yScale} position="left" />
          {/* Your chart elements */}
        </g>
      </svg>
    </Box>
  );
}
```

### Waterfall Chart
```typescript
import { Waterfall } from '@/components/charts/Waterfall';

<Waterfall
  data={[
    { label: 'Start', value: 10000, type: 'start' },
    { label: 'Revenue', value: 5000, type: 'add' },
    { label: 'Expenses', value: -2000, type: 'subtract' },
    { label: 'End', value: 13000, type: 'end' },
  ]}
  title="Monthly P&L"
/>
```

### Treemap Chart
```typescript
import { Treemap } from '@/components/charts/Treemap';

<Treemap
  data={{
    name: 'Expenses',
    children: [
      { name: 'Housing', value: 2000 },
      { name: 'Food', value: 500 },
      { name: 'Transport', value: 300 },
    ],
  }}
  onNodeClick={(node) => console.log(node)}
/>
```

---

## Responsive Design

### Breakpoints (MUI)
- `xs` < 600px (mobile)
- `sm` ≥ 600px (tablet)
- `md` ≥ 900px (small desktop)
- `lg` ≥ 1200px (desktop)
- `xl` ≥ 1536px (large desktop)

### Using Breakpoints
```typescript
import { useTheme, useMediaQuery } from '@mui/material';

function MyComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
```

### Responsive Spacing
```typescript
<Box sx={{ 
  p: { xs: 2, sm: 3, md: 4 },      // Padding
  display: { xs: 'block', md: 'flex' },
  flexDirection: { xs: 'column', md: 'row' },
}}>
  Content
</Box>
```

---

## Theme & Styling

### Using Theme
```typescript
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Box sx={{
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
    }}>
      Content
    </Box>
  );
}
```

### Emotion sx Prop
```typescript
<Box sx={{
  // Colors
  color: 'primary.main',
  backgroundColor: 'background.paper',
  
  // Spacing
  p: 2,
  m: 1,
  
  // Responsive
  fontSize: { xs: '14px', md: '16px' },
  
  // Pseudo-states
  '&:hover': { backgroundColor: 'primary.light' },
  
  // Transitions
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}}>
  Content
</Box>
```

---

## Performance Tips

1. **Memoize expensive computations**
   ```typescript
   const processedData = useMemo(() => {
     return data.map(transform);
   }, [data]);
   ```

2. **Use React.memo for pure components**
   ```typescript
   const KPICard = React.memo(({ title, value }) => (
     <Card>{title}: {value}</Card>
   ));
   ```

3. **Lazy load routes**
   ```typescript
   const Reports = lazy(() => import('./pages/Reports'));
   ```

4. **Virtualize long lists**
   ```typescript
   import { useVirtualizer } from '@tanstack/react-virtual';
   ```

---

## Accessibility

### ARIA Labels
```typescript
<svg role="img" aria-label="Revenue over time">
  {/* Chart content */}
</svg>
```

### Keyboard Navigation
```typescript
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</button>
```

### Focus Management
```typescript
const ref = useRef<HTMLButtonElement>(null);

useEffect(() => {
  ref.current?.focus();
}, []);

return <button ref={ref}>Focused button</button>;
```

---

## Common Patterns

### Loading State
```typescript
const { data, isLoading } = useQuery({...});

if (isLoading) return <Skeleton />;
return <Content data={data} />;
```

### Error Handling
```typescript
const { data, error } = useQuery({...});

if (error) return <ErrorMessage error={error} />;
return <Content data={data} />;
```

### Optimistic Updates
```typescript
const mutation = useMutation({
  mutationFn: updateTransaction,
  onMutate: async (newData) => {
    // Optimistically update UI
    queryClient.setQueryData(['transactions'], old => [...]);
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['transactions'], context.previous);
  },
});
```

---

**Last Updated:** 2025-10-24

