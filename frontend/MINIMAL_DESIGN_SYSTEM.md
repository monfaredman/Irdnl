# Minimal Design System Documentation

## Overview
This design system follows strict minimalism principles with an 8-point grid system, limited color palette, and flat design aesthetic.

---

## 1. 8-Point Grid System

All spacing values are **multiples of 8px**:

| Token | Value | Usage |
|-------|-------|-------|
| `xs`  | 8px   | Tight spacing, small gaps |
| `sm`  | 16px  | Standard element padding |
| `md`  | 24px  | Section spacing, card gaps |
| `lg`  | 32px  | Component spacing |
| `xl`  | 64px  | Large section padding |
| `xxl` | 128px | Hero sections, page margins |

### Implementation
```typescript
import { minimalSpacing } from '@/theme/minimal-theme';

// Use with MUI spacing (divide by 8)
sx={{ 
  mb: minimalSpacing.lg / 8,  // 32px = 4 MUI units
  py: minimalSpacing.xl / 8,  // 64px = 8 MUI units
}}
```

---

## 2. Color Palette

**Maximum 3 colors** - monochrome with subtle accent:

```typescript
{
  black: '#000000',      // Primary text, borders, buttons
  white: '#FFFFFF',      // Backgrounds, button text
  offWhite: '#F5F5F5',   // Secondary backgrounds
  gray: '#999999',       // Secondary text
  lightGray: '#E5E5E5',  // Dividers, borders
}
```

### Usage Rules
- ✅ Black text on white backgrounds
- ✅ 1px solid borders only
- ✅ Gray for secondary/disabled states
- ❌ No gradients
- ❌ No shadows
- ❌ No transparency/opacity effects

---

## 3. Typography

**2 Font Families Maximum:**
- **Headings:** Inter (system fallback)
- **Body:** System Sans

### Type Scale (4 sizes)

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1      | 48px | 600    | 1.2         | Page headlines |
| H2      | 32px | 600    | 1.3         | Section titles |
| H3      | 24px | 600    | 1.4         | Subsections |
| Body1   | 16px | 400    | 1.6         | Primary text |
| Body2   | 14px | 400    | 1.5         | Secondary text |

### Weight System
- **400** (Regular) - Body text
- **600** (Semibold) - Headings, emphasis

---

## 4. Component System

### Buttons
```typescript
// Primary (Contained)
<Button variant="contained">
  - Background: Black
  - Text: White
  - Border: 1px solid black
  - No rounded corners
  - No hover effects/transitions
  - Padding: 16px 32px

// Secondary (Outlined)
<Button variant="outlined">
  - Background: White
  - Text: Black
  - Border: 1px solid black
  - Hover: Off-white background
```

### Cards
```typescript
<Card>
  - Background: White
  - Border: 1px solid lightGray
  - No border radius
  - No shadows
  - Hover: Border changes to black
```

### Text Fields
```typescript
<TextField>
  - Background: White
  - Border: 1px solid lightGray
  - Focus: Border changes to black (1px only)
  - No border radius
  - No shadows
```

---

## 5. Layout Grid

### Responsive Breakpoints
```typescript
{
  xs: 0px,    // Mobile
  sm: 600px,  // Tablet
  md: 960px,  // Desktop
  lg: 1280px, // Large desktop
  xl: 1920px, // Extra large
}
```

### Content Grid
- **12-column grid system**
- **24px gutters** (3 MUI spacing units)
- **Strict alignment** - all elements align to grid

```typescript
<Grid container spacing={3}>
  <Grid size={{ xs: 6, sm: 4, md: 3 }}>
    // 2 cols mobile, 3 cols tablet, 4 cols desktop
  </Grid>
</Grid>
```

---

## 6. Design Principles

### ✅ DO
1. **Maximum Whitespace** - Let content breathe
2. **Flat Design** - No depth, no 3D effects
3. **Clean Borders** - 1px solid lines only
4. **Grid Alignment** - Everything aligns to 8px grid
5. **Content First** - Remove all non-essential elements
6. **Consistent Spacing** - Use spacing tokens only

### ❌ DON'T
1. ❌ Gradients
2. ❌ Shadows (box-shadow)
3. ❌ Rounded corners (border-radius)
4. ❌ Animations/transitions
5. ❌ Glass/blur effects
6. ❌ Decorative elements
7. ❌ Complex hover states
8. ❌ More than 3 colors

---

## 7. Component Examples

### Hero Section
```typescript
<MinimalHero />
- Centered content
- 128px vertical padding
- Single headline (H1)
- One CTA button
- No background images/videos
```

### Content Grid
```typescript
<MinimalGrid />
- Equal-width cards
- 24px gaps between items
- Simple 1px borders
- No hover effects
- Show 8 items maximum per section
```

### Header
```typescript
<MinimalHeader />
- Sticky position
- 80px height (desktop)
- Wordmark logo (text only)
- Horizontal nav links
- Single CTA button
- 1px bottom border
```

### Footer
```typescript
<MinimalFooter />
- 64px top padding
- Essential links only
- 3-column grid (desktop)
- 1px top border
- Copyright text
```

---

## 8. Spacing System Documentation

### Vertical Rhythm
```
Hero Section:      128px padding
Section Spacing:   64px between sections
Component Margin:  32px between components
Element Gap:       24px between elements
Text Spacing:      16px between paragraphs
Inline Spacing:    8px between inline items
```

### Container Widths
```typescript
{
  sm: 600px,
  md: 960px,
  lg: 1280px,
  xl: 1536px,
}
```

---

## 9. Accessibility

### Contrast Ratios
- Black on White: **21:1** (AAA)
- Gray on White: **4.5:1** (AA)

### Focus States
- **1px solid black border**
- No color change
- No shadows

### Touch Targets
- Minimum **44px × 44px**
- Buttons: **16px padding** (meets minimum)

---

## 10. Implementation Checklist

When creating new components:

- [ ] Uses 8px spacing multiples only
- [ ] No gradients or shadows
- [ ] Border radius = 0
- [ ] Max 3 colors from palette
- [ ] Typography from scale (48/24/16/14px)
- [ ] No animations/transitions
- [ ] Aligned to grid system
- [ ] Passes contrast checks
- [ ] Content-first approach
- [ ] Maximum whitespace

---

## File Structure

```
src/
├── theme/
│   └── minimal-theme.ts          # Core theme configuration
├── components/
│   ├── layout/
│   │   ├── MinimalHeader.tsx     # Simplified header
│   │   ├── MinimalFooter.tsx     # Essential footer
│   │   └── MinimalLayoutWrapper.tsx
│   └── sections/
│       ├── MinimalHero.tsx       # Clean hero section
│       └── MinimalGrid.tsx       # Content grid
└── app/
    └── page-minimal.tsx          # Minimal homepage
```

---

## Usage Example

```typescript
import { ThemeProvider } from "@mui/material";
import { minimalTheme, minimalSpacing } from "@/theme/minimal-theme";

export default function App() {
  return (
    <ThemeProvider theme={minimalTheme}>
      <Box sx={{ 
        py: minimalSpacing.xl / 8,    // 64px
        px: minimalSpacing.lg / 8,    // 32px
      }}>
        <Typography variant="h1">
          Minimal Design
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
```
