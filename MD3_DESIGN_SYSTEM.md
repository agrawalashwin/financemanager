# Material Design 3 Implementation Guide

## Overview

Your Personal P&L Dashboard now implements **Material Design 3 (MD3)** design system with a focus on beauty through restraint, speed, clarity, and accessibility.

---

## 1. Color Palette (MD3 Tonal System)

### Primary Colors
- **Primary:** `#6750A4` (Indigo 600)
- **Secondary:** `#625B71` (Gray)
- **Tertiary:** `#7D5260` (Rose)
- **Neutral:** `#5C5B5F` (Charcoal)

### Semantic Colors
- **Success:** `#1E8E3E` (Green) - Revenue, positive trends
- **Warning:** `#F9AB00` (Amber) - Caution, forecasts
- **Error:** `#D93025` (Red) - Expenses, negative trends
- **Info:** `#1A73E8` (Blue) - Net income, information

### Tonal Palette
Each color has a full tonal range (0-100) for:
- Backgrounds (tonal variants)
- Surfaces (elevated states)
- Overlays (transparency effects)

**File:** `frontend/src/theme.ts`

---

## 2. Typography System

### Scale (MD3 Standard)
- **Display Large:** 57px / 64px line height
- **Display Medium:** 45px / 52px line height
- **Headline Large:** 32px / 40px line height
- **Headline Medium:** 28px / 36px line height
- **Title Large:** 22px / 28px line height
- **Title Medium:** 16px / 24px line height (used for card titles)
- **Body Large:** 16px / 24px line height
- **Body Medium:** 14px / 20px line height
- **Label Medium:** 12px / 16px line height (used for KPI labels)

### Font
- **Primary:** Inter or Roboto Flex
- **Numeric:** Tabular lining for ledger numbers (monospace alignment)

---

## 3. Shape & Elevation

### Border Radius
- **Cards:** 16px (xl)
- **Inputs/Buttons:** 8px (md)
- **Chips:** 8px (md)

### Elevation (Shadows)
- **Level 1:** Subtle shadow for cards (default)
- **Level 2:** Medium shadow on hover
- **Level 3:** Deep shadow for modals/dialogs
- **No skeuomorphism:** Elevation via color and contrast, not depth

---

## 4. Component Library

### KPI Cards (`KPICard.jsx`)
Beautiful metric cards with:
- Icon + title + value layout
- Tonal background variants
- Trend indicators (up/down)
- Hover animations (translateY -2px)
- Responsive sizing

**Usage:**
```jsx
<KPICard
  title="Total Revenue"
  value="$5,000.00"
  subtitle="This month"
  icon={AttachMoneyIcon}
  color="success"
  variant="tonal"
  trend="up"
  trendValue="12%"
/>
```

### D3 Chart Primitives

#### `useChartDimensions` Hook
Responsive SVG sizing with ResizeObserver:
```jsx
const { ref, width, height, margin, boundedWidth, boundedHeight } = 
  useChartDimensions({ minHeight: 300, minWidth: 400 });
```

#### `Axis` Component
Styled D3 axes with MD3 colors:
```jsx
<Axis 
  scale={xScale} 
  position="bottom" 
  tickFormat={formatMonth}
  tickCount={12}
/>
```

#### `Grid` Component
Subtle grid lines (8% opacity) for readability:
```jsx
<Grid 
  xScale={xScale} 
  yScale={yScale} 
  width={width} 
  height={height}
  direction="both"
/>
```

#### `ChartTooltip` Component
Accessible, keyboard-navigable tooltips:
```jsx
<ChartTooltip
  visible={showTooltip}
  x={mouseX}
  y={mouseY}
  data={[
    { label: 'Revenue', value: '$5,000', color: '#1E8E3E' },
    { label: 'Expenses', value: '$2,000', color: '#D93025' }
  ]}
  title="October 2025"
/>
```

---

## 5. Dashboard Layout

### KPI Cards Row
- 4 cards in a responsive grid
- Desktop: 4 columns (3 md breakpoint)
- Tablet: 2 columns
- Mobile: 1 column (stacked)

### Chart Section
- 3 full-width charts (Revenue, Expenses, Net Income)
- 18-month view (6 months history + 12 months forecast)
- Visual distinction: past (solid) vs forecast (lighter)
- Rotated month labels for readability

### Responsive Behavior
- **Desktop (lg+):** Full layout with all details
- **Tablet (md):** 2-column grid, charts scale to 100%
- **Mobile (xs-sm):** Single column, horizontal scroll for charts

---

## 6. Color Usage in Charts

### Revenue Chart
- **Color:** `#1E8E3E` (Success Green)
- **Past:** 90% opacity
- **Forecast:** 40% opacity

### Expenses Chart
- **Color:** `#D93025` (Error Red)
- **Past:** 90% opacity
- **Forecast:** 40% opacity

### Net Income Chart
- **Color:** `#6750A4` (Primary Indigo)
- **Past:** 90% opacity
- **Forecast:** 40% opacity
- **Zero line:** Dashed neutral line

---

## 7. Motion & Transitions

### Easing
- **Standard:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Micro interactions:** 150-200ms
- **Medium transitions:** 250-300ms

### Examples
- KPI card hover: translateY(-2px) + shadow elevation
- Chart value tweening: 200ms smooth animation
- Route transitions: 300ms crossfade

---

## 8. Accessibility

### WCAG 2.2 AA Compliance
- ✅ Color contrast ratios ≥ 4.5:1 for text
- ✅ Touch targets ≥ 44×44px
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader support (ARIA labels)
- ✅ Focus indicators (visible outlines)

### Charts
- Offscreen data tables for screen readers
- Focusable data points
- Keyboard navigation (arrow keys)
- Tooltip announcements on focus

---

## 9. Theme Configuration

**File:** `frontend/src/theme.ts`

```typescript
import { createTheme } from '@mui/material/styles';
import { theme } from './theme';

// Use in App
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### Customization
To change colors, edit `MD3_COLORS` object:
```typescript
const MD3_COLORS = {
  primary: '#6750A4',
  secondary: '#625B71',
  // ... etc
};
```

---

## 10. File Structure

```
frontend/src/
├── theme.ts                          # MD3 theme configuration
├── hooks/
│   └── useChartDimensions.ts        # Responsive chart sizing
├── components/
│   ├── KPICard.jsx                  # KPI metric cards
│   ├── Dashboard.jsx                # Main dashboard (updated)
│   ├── charts/
│   │   ├── Axis.tsx                 # D3 axis component
│   │   ├── Grid.tsx                 # D3 grid component
│   │   └── ChartTooltip.tsx         # Tooltip component
│   └── ... (other components)
└── App.jsx                          # Wrapped with ThemeProvider
```

---

## 11. Next Steps

### Remaining Tasks
- [ ] Implement global navigation (left rail + bottom nav)
- [ ] Add more chart types (waterfall, treemap, sankey)
- [ ] Implement budget tracking UI
- [ ] Add category hierarchy management
- [ ] Create reports section with export

### Performance Targets
- Dashboard TTI: < 1.5s (95th percentile)
- CLS: < 0.03 (no layout shifts)
- LCP: < 2.0s
- 60fps animations

---

## 12. Resources

- **Material Design 3:** https://m3.material.io/
- **MUI Documentation:** https://mui.com/
- **D3.js:** https://d3js.org/
- **Accessibility:** https://www.w3.org/WAI/WCAG22/quickref/

---

## Summary

Your dashboard now features:
✅ MD3 color palette with tonal system
✅ Professional typography scale
✅ Beautiful KPI cards with hover effects
✅ Responsive D3 chart primitives
✅ Accessible components (WCAG 2.2 AA)
✅ Consistent motion and transitions
✅ Mobile-first responsive design

The design system is modular and extensible for future features!

