# Spacing System - 8-Point Grid

## Base Unit: 8px

All spacing in the design system is a **multiple of 8 pixels**. This creates visual harmony, consistency, and makes development easier.

---

## Spacing Tokens

| Token | Value | MUI Units | Usage |
|-------|-------|-----------|-------|
| `xs`  | 8px   | 1         | Tight gaps, chip padding, icon spacing |
| `sm`  | 16px  | 2         | Text spacing, small padding, inline gaps |
| `md`  | 24px  | 3         | Grid gaps, card spacing, section items |
| `lg`  | 32px  | 4         | Component margins, heading spacing |
| `xl`  | 64px  | 8         | Section padding, large whitespace |
| `xxl` | 128px | 16        | Hero sections, page spacing |

---

## Implementation

### In Code
```typescript
import { minimalSpacing } from '@/theme/minimal-theme';

// Using with MUI (divide by 8 for MUI spacing units)
<Box sx={{
  mb: minimalSpacing.lg / 8,    // 32px = 4 units
  py: minimalSpacing.xl / 8,    // 64px = 8 units
  gap: minimalSpacing.md / 8,   // 24px = 3 units
}} />

// Direct pixel values
<Box sx={{
  marginBottom: `${minimalSpacing.lg}px`,  // 32px
  paddingTop: `${minimalSpacing.xl}px`,    // 64px
}} />
```

### MUI Spacing Conversion
```typescript
// MUI uses 8px as base unit
spacing={1}  = 8px   = xs
spacing={2}  = 16px  = sm
spacing={3}  = 24px  = md
spacing={4}  = 32px  = lg
spacing={8}  = 64px  = xl
spacing={16} = 128px = xxl
```

---

## Vertical Spacing (Y-axis)

### Page Structure
```
┌─────────────────────────┐
│ Header (80px)           │
├─────────────────────────┤
│                         │
│ 128px (xxl)            │ ← Hero top padding
│                         │
│ [Hero Content]          │
│                         │
│ 128px (xxl)            │ ← Hero bottom padding
│                         │
├─────────────────────────┤
│                         │
│ 64px (xl)              │ ← Section top padding
│                         │
│ [Section Title]         │
│                         │
│ 32px (lg)              │ ← Title to content
│                         │
│ [Grid Content]          │
│                         │
│ 64px (xl)              │ ← Section bottom padding
│                         │
├─────────────────────────┤
│                         │
│ 128px (xxl)            │ ← Before footer
│                         │
├─────────────────────────┤
│ Footer                  │
└─────────────────────────┘
```

### Component Spacing
```
Large Sections:     128px (xxl) - Between major page sections
Medium Sections:    64px (xl)   - Between content sections
Components:         32px (lg)   - Between related components
Elements:           24px (md)   - Between grid items
Text Blocks:        16px (sm)   - Between paragraphs
Inline Items:       8px (xs)    - Between chips, tags
```

---

## Horizontal Spacing (X-axis)

### Container Padding
```typescript
{
  xs: '16px',  // Mobile (< 600px)
  sm: '24px',  // Tablet (600px - 960px)
  md: '32px',  // Desktop (> 960px)
  lg: '32px',  // Large (> 1280px)
  xl: '32px',  // XL (> 1920px)
}
```

### Grid Gaps
```typescript
// Standard grid spacing
<Grid container spacing={3}>  // 24px gaps
  <Grid size={{ xs: 6, md: 3 }}>
    ...
  </Grid>
</Grid>
```

### Navigation Spacing
```
Logo [32px] Nav Item [32px] Nav Item [32px] Button
```

---

## Component-Specific Spacing

### Buttons
```
Padding: 16px (top/bottom) × 32px (left/right)
Gap between buttons: 16px (sm)
```

### Cards
```
Internal padding: 24px (md)
Grid gaps: 24px (md)
Title margin-top: 16px (sm)
```

### Forms
```
Label margin-bottom: 8px (xs)
Input margin-bottom: 24px (md)
Submit button margin-top: 32px (lg)
```

### Headers
```
Height: 80px (10 units)
Padding: 16px (sm) left/right
Logo to nav: 32px (lg)
Nav to CTA: 32px (lg)
```

### Footer
```
Padding top/bottom: 64px (xl)
Column gaps: 32px (lg)
Link spacing: 8px (xs)
Copyright margin-top: 32px (lg)
Copyright padding-top: 32px (lg)
```

---

## Visual Rhythm Examples

### Example 1: Hero Section
```
[128px padding top]
  H1 Headline (48px)
  [32px spacing]
  Body text (16px)
  [64px spacing]
  CTA Button
[128px padding bottom]

Total height: ~456px
```

### Example 2: Content Section
```
[64px padding top]
  Section Title (24px)
  [32px spacing]
  Grid Container
    Card [24px gap] Card [24px gap] Card
    [24px gap]
    Card [24px gap] Card [24px gap] Card
[64px padding bottom]

Total height: ~600px (with cards)
```

### Example 3: Card Component
```
┌─────────────────────┐
│                     │
│   [Image 2:3]       │
│                     │
├─────────────────────┤
│ [16px margin-top]   │
│ Title (14px)        │
│ [16px margin-bottom]│
└─────────────────────┘
```

---

## Responsive Spacing

### Mobile (< 600px)
```typescript
{
  hero: 64px,      // Reduced from 128px
  section: 48px,   // Reduced from 64px
  component: 24px, // Reduced from 32px
  container: 16px, // Side padding
}
```

### Desktop (> 960px)
```typescript
{
  hero: 128px,     // Full xxl spacing
  section: 64px,   // Full xl spacing
  component: 32px, // Full lg spacing
  container: 32px, // Side padding
}
```

---

## Grid Alignment

Every element aligns to the 8px baseline grid:

```
0px  ─────────  ← Baseline
8px  ─────────
16px ─────────
24px ─────────
32px ─────────
40px ─────────
48px ─────────
56px ─────────
64px ─────────
...
```

### Examples
```
✓ margin: 24px    (3 × 8px)
✓ padding: 32px   (4 × 8px)
✓ gap: 16px       (2 × 8px)

✗ margin: 20px    (NOT divisible by 8)
✗ padding: 30px   (NOT divisible by 8)
✗ gap: 12px       (NOT divisible by 8)
```

---

## Spacing Rules

### ✅ DO
- Always use spacing tokens (xs, sm, md, lg, xl, xxl)
- Align all spacing to 8px grid
- Use larger spacing for major sections
- Use consistent spacing for similar elements
- Maintain vertical rhythm

### ❌ DON'T
- No arbitrary spacing values (e.g., 15px, 37px)
- No spacing < 8px (except 0)
- No odd numbers (must be divisible by 8)
- No inconsistent spacing between similar elements
- No tight spacing (let content breathe)

---

## Whitespace Philosophy

**More is more** in minimal design:

1. **Generous spacing** - Don't be afraid of empty space
2. **Breathing room** - Content needs space to be appreciated
3. **Clear hierarchy** - Spacing defines relationships
4. **Focus** - Whitespace draws attention to content
5. **Elegance** - More space = more sophisticated

### Comparison
```
❌ Cramped (Traditional)
[16px] Content [16px] Content [16px]

✓ Minimal (Generous)
[64px] Content [64px] Content [64px]
```

---

## Testing Spacing

### Visual Grid Overlay
```typescript
// Add to development environment
<Box sx={{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,0,0.1) 0px, transparent 1px, transparent 8px)',
  pointerEvents: 'none',
  zIndex: 9999,
}} />
```

### Browser DevTools
- Inspect element
- Check computed spacing values
- Verify all values are multiples of 8

---

## Quick Reference

| Element | Spacing |
|---------|---------|
| Page margins | 128px (xxl) |
| Section padding | 64px (xl) |
| Component margins | 32px (lg) |
| Grid gaps | 24px (md) |
| Text spacing | 16px (sm) |
| Inline items | 8px (xs) |
| Button padding | 16px × 32px |
| Container padding | 32px (desktop) |
| Card padding | 24px |
| Header height | 80px |
| Footer padding | 64px |
