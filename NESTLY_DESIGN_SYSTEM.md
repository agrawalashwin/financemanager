# Nestly Design System - Executive-Grade Minimalist Theme

**Version:** 1.0.0
**Status:** Production-Ready
**Aesthetic:** Low-noise UI, crisp typography, generous whitespace, monochrome + accent

---

## 🎨 Design Philosophy

The Nestly design system embodies executive-grade minimalism:
- **No emojis** - Icons only from Material Symbols Rounded
- **Monochrome base** - 11-step grey ramp for hierarchy
- **Single accent** - Google Blue (#1A73E8) for primary actions
- **Generous whitespace** - Breathing room between elements
- **Shallow elevation** - Subtle shadows, not deep
- **Smooth motion** - 150-350ms transitions

---

## 🎯 Design Tokens

### Border Radius (Soft, not sharp)
```typescript
radius: {
  xs: 6,      // Small buttons, inputs
  sm: 10,     // Medium components
  md: 14,     // Cards, dialogs
  lg: 20,     // Large sections
}
```

### Spacing Grid (8px base)
```typescript
spacing: {
  base: 4,    // 4px grid unit
  // Use: 1 = 4px, 2 = 8px, 3 = 12px, etc.
}
```

### Grey Ramp (Nestly Neutral)
```typescript
grey: {
  25:  '#FCFCFD',  // Lightest background
  50:  '#F5F7FA',  // Hover states
  100: '#EEF1F5',  // Subtle dividers
  200: '#E4E8EF',  // Borders
  300: '#D6DCE5',  // Disabled states
  400: '#BAC3D0',  // Secondary text
  500: '#8E9AAF',  // Tertiary text
  600: '#6B7386',  // Secondary labels
  700: '#4D5363',  // Body text
  800: '#2F3442',  // Headings
  900: '#171A21',  // Primary text
}
```

### Semantic Colors
```typescript
semantic: {
  success: '#1E8E3E',    // Revenue, positive
  warning: '#F9AB00',    // Caution, alerts
  error: '#D93025',      // Expenses, negative
  info: '#1A73E8',       // Information
}
```

### Shadows (Shallow Elevation)
```typescript
shadow: {
  1: '0 2px 8px rgba(0,0,0,0.06)',      // Subtle
  2: '0 6px 16px rgba(0,0,0,0.08)',     // Medium
  3: '0 12px 24px rgba(0,0,0,0.10)',    // Prominent
}
```

### Motion (Smooth Transitions)
```typescript
motion: {
  micro: '150ms ease-in-out',    // Micro interactions
  medium: '250ms ease-in-out',   // Page transitions
  macro: '350ms ease-in-out',    // Large animations
}
```

---

## 📐 Layout & Spacing Rules

### Grid System
- **Base unit:** 4px (8px grid)
- **Section padding:** 6-10 units (24-40px)
- **Card gutters:** 16-24px
- **Card radius:** 14-20px

### Container Max-Widths
```typescript
container: {
  xs: 640,    // Mobile
  sm: 768,    // Tablet
  md: 1024,   // Small desktop
  lg: 1200,   // Desktop (default)
  xl: 1440,   // Large desktop
}
```

### Responsive Breakpoints
- **xs:** < 600px (mobile)
- **sm:** ≥ 600px (tablet)
- **md:** ≥ 900px (small desktop)
- **lg:** ≥ 1200px (desktop)
- **xl:** ≥ 1536px (large desktop)

---

## 🧩 Component Catalog

### KPI Card
Displays a metric with optional trend indicator
```typescript
<KPICard
  label="Total Revenue"
  value="$45,230"
  delta={{ value: "+12.5%", isPositive: true }}
  icon={<TrendingUpIcon />}
  tone="success"
  variant="default"
/>
```

### FAQ Accordion
Collapsible Q&A sections
```typescript
<FAQAccordion
  title="Frequently Asked Questions"
  items={[
    { question: "How do I add a transaction?", answer: "..." },
    { question: "Can I edit past transactions?", answer: "..." },
  ]}
/>
```

### Hero Section
Large headline with CTAs
```typescript
<HeroSection
  title="Manage Your Finances"
  subtitle="Dashboard"
  description="Track income, expenses, and budgets in one place"
  primaryCTA={{ label: "Get Started", onClick: () => {} }}
  secondaryCTA={{ label: "Learn More", onClick: () => {} }}
/>
```

### Sparkline
Minimal inline D3 chart
```typescript
<Sparkline
  data={[10, 15, 12, 18, 22, 20]}
  width={120}
  height={36}
  color={tokens.brand.primary}
  showArea={false}
/>
```

---

## 🎭 Typography Scale

| Variant | Size | Weight | Use Case |
|---------|------|--------|----------|
| h1 | 56px | 800 | Page titles |
| h2 | 44px | 800 | Section headers |
| h3 | 32px | 700 | Subsections |
| h4 | 24px | 700 | Card titles |
| h5 | 20px | 600 | Labels |
| h6 | 16px | 600 | Subheaders |
| body1 | 16px | 400 | Body text |
| body2 | 14px | 400 | Secondary text |
| button | 14px | 600 | Button labels |
| caption | 12px | 500 | Hints, captions |

---

## 🎨 Color Usage

### Primary (Google Blue)
- Main CTAs
- Active states
- Links
- Focus indicators

### Success (Green)
- Revenue
- Positive deltas
- Confirmations
- Progress (complete)

### Warning (Amber)
- Caution alerts
- Budget thresholds
- Progress (warning)

### Error (Red)
- Expenses
- Negative deltas
- Errors
- Destructive actions

### Grey (Monochrome)
- Text hierarchy
- Backgrounds
- Borders
- Disabled states

---

## 🔤 Typography Rules

- **Font family:** Inter, Roboto Flex, system-ui
- **Monospace:** Roboto Mono (for numbers)
- **Line height:** 1.2-1.7 depending on size
- **Letter spacing:** Negative for headlines, normal for body
- **Tabular numerals:** Always for numbers (fontVariantNumeric: 'tabular-nums')

---

## 🎬 Motion Guidelines

### Micro Interactions (150ms)
- Button hover
- Input focus
- Icon changes
- Tooltip appear

### Medium Transitions (250ms)
- Page navigation
- Modal open/close
- Drawer slide
- Expand/collapse

### Macro Animations (350ms)
- Page load
- Large section transitions
- Complex interactions

---

## 📊 D3 Chart Styling

### Visual Language
- **Stroke width:** 2px (1.5px for dense)
- **Bar radius:** 4px
- **Grid opacity:** 8%
- **Grid lines:** Y-axis only
- **Tooltip radius:** 10px
- **Tooltip padding:** 12px

### Colors
- **Base:** Monochrome grey
- **Accent:** Single semantic color
- **Highlight:** Primary brand color

---

## ✅ Quality Checklist

- [ ] No emojis (icons only)
- [ ] Monochrome base + 1 accent
- [ ] Contrast >= WCAG AA (4.5:1)
- [ ] Generous whitespace
- [ ] Consistent grid rhythm
- [ ] Shallow shadows only
- [ ] Smooth transitions (150-350ms)
- [ ] Tabular numerals for numbers
- [ ] All tokens used (no hard-coded values)
- [ ] Responsive on xs-xl breakpoints

---

## 🚀 Implementation

### Using Tokens in Components
```typescript
import { tokens } from '@/theme/tokens';

<Box sx={{
  borderRadius: tokens.radius.md,
  boxShadow: tokens.shadow[1],
  padding: tokens.spacing.base * 3,
  color: tokens.grey[900],
  transition: `all ${tokens.motion.micro}`,
}}>
  Content
</Box>
```

### Using Theme in MUI
```typescript
import { nestlyLightTheme } from '@/theme/nestlyTheme';
import { ThemeProvider } from '@mui/material/styles';

<ThemeProvider theme={nestlyLightTheme}>
  <App />
</ThemeProvider>
```

---

## 📱 Responsive Design

### Mobile-First Approach
```typescript
sx={{
  fontSize: { xs: '14px', sm: '16px', md: '18px' },
  padding: { xs: 2, sm: 3, md: 4 },
  display: { xs: 'block', md: 'grid' },
}}
```

### Breakpoint Usage
- **xs:** Mobile-only styles
- **sm:** Tablet and up
- **md:** Desktop and up
- **lg:** Large desktop and up

---

## 🎓 Best Practices

1. **Always use tokens** - Never hard-code colors/sizes
2. **Consistent spacing** - Use grid multiples
3. **Shallow shadows** - Max shadow-2 for most elements
4. **Smooth motion** - Use predefined motion values
5. **Tabular numerals** - For all numeric displays
6. **Generous whitespace** - Don't crowd elements
7. **Single accent** - Use primary for emphasis
8. **Keyboard accessible** - All interactive elements

---

**Design System Version:** 1.0.0
**Last Updated:** 2025-10-24
**Status:** Production-Ready

