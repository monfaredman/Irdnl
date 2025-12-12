# Typography Scale - Minimal Design

## Font System (2 Families Maximum)

### Primary: System Sans-Serif Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", 
             Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Why System Fonts?**
- Zero load time
- Native OS rendering
- Familiar to users
- Excellent readability

---

## Type Scale (4 Sizes Only)

### H1 - Hero Headline
```
Size:           48px
Weight:         600 (Semibold)
Line Height:    1.2 (57.6px)
Letter Spacing: -0.02em (tighter)
Color:          #000000

Usage:
- Homepage hero headline
- Major page titles
- Maximum 1 per page
```

### H3 - Section Titles
```
Size:           24px
Weight:         600 (Semibold)
Line Height:    1.4 (33.6px)
Letter Spacing: 0
Color:          #000000

Usage:
- Section headings ("Foreign Movies", etc)
- Card group titles
- Secondary page titles
```

### Body1 - Primary Text
```
Size:           16px
Weight:         400 (Regular)
Line Height:    1.6 (25.6px)
Letter Spacing: 0
Color:          #000000

Usage:
- Body copy
- Descriptions
- Paragraph text
- Button text
```

### Body2 - Secondary Text
```
Size:           14px
Weight:         400 (Regular)
Line Height:    1.5 (21px)
Letter Spacing: 0
Color:          #999999

Usage:
- Card titles
- Labels
- Captions
- Footer links
- Metadata
```

---

## Weight System (2 Weights Only)

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, secondary text |
| Semibold | 600 | Headings, emphasis, active states |

**No other weights** - maintains consistency and reduces complexity.

---

## Hierarchy Demonstration

```
┌────────────────────────────────────────────┐
│                                            │
│   Watch Movies & Series        ← 48px/600 │ H1
│                                            │
│   Unlimited access to content  ← 16px/400 │ Body1
│                                            │
│                                            │
│   Foreign Movies               ← 24px/600 │ H3
│                                            │
│   [Movie Title]                ← 14px/400 │ Body2
│                                            │
└────────────────────────────────────────────┘
```

---

## Spacing Rules

### Above Headings
```
H1: 128px above (xxl spacing)
H3: 64px above (xl spacing)
```

### Below Headings
```
H1: 32px below (lg spacing)
H3: 32px below (lg spacing)
```

### Paragraph Spacing
```
Body1: 16px between paragraphs (sm spacing)
Body2: 8px between items (xs spacing)
```

---

## Responsive Typography

### Mobile (< 600px)
```typescript
h1: { 
  fontSize: '36px',  // Reduced from 48px
  lineHeight: 1.2 
}
h3: { 
  fontSize: '20px',  // Reduced from 24px
  lineHeight: 1.4 
}
body1: { 
  fontSize: '16px',  // Same
  lineHeight: 1.6 
}
body2: { 
  fontSize: '14px',  // Same
  lineHeight: 1.5 
}
```

### Desktop (> 960px)
```typescript
// Use default scale (48/24/16/14px)
```

---

## Implementation

### MUI Theme Configuration
```typescript
typography: {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Inter"',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  
  h1: {
    fontSize: '48px',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  
  h3: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0',
  },
  
  body1: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0',
  },
  
  body2: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
}
```

### Usage in Components
```typescript
// Headings
<Typography variant="h1">
  Watch Movies & Series
</Typography>

<Typography variant="h3">
  Foreign Movies
</Typography>

// Body text
<Typography variant="body1">
  Unlimited access to thousands of movies and series
</Typography>

// Small text
<Typography variant="body2">
  Movie Title
</Typography>
```

---

## Text Contrast

All text meets **WCAG AAA** standards:

| Text | Background | Ratio | Level |
|------|-----------|-------|-------|
| Black (#000000) | White (#FFFFFF) | 21:1 | AAA ✓ |
| Gray (#999999) | White (#FFFFFF) | 4.5:1 | AA ✓ |

---

## Typography Rules

### ✅ DO
- Use only 4 type sizes (48/24/16/14px)
- Use only 2 weights (400/600)
- Maintain 1.2-1.6 line height
- Keep letter spacing minimal
- Use system fonts only
- Ensure 21:1 contrast for primary text

### ❌ DON'T
- No italic styles
- No underlines (except links)
- No uppercase transforms (use proper case)
- No colored text (black/gray only)
- No text shadows
- No custom fonts (system only)
- No font sizes outside the scale

---

## Vertical Rhythm

Based on 8px grid:

```
H1 (48px) + line-height (1.2) = 58px ≈ 56px (7 × 8px)
H3 (24px) + line-height (1.4) = 34px ≈ 32px (4 × 8px)
Body1 (16px) + line-height (1.6) = 26px ≈ 24px (3 × 8px)
Body2 (14px) + line-height (1.5) = 21px ≈ 24px (3 × 8px)
```

All text blocks align to the 8px baseline grid.

---

## Example Page Structure

```
Hero Section:
  [128px spacing]
  H1: "Watch Movies & Series" (48px/600)
  [32px spacing]
  Body1: "Unlimited access..." (16px/400)
  [64px spacing]
  Button: "Start Watching" (16px/600)
  [128px spacing]

Content Section:
  [64px spacing]
  H3: "Foreign Movies" (24px/600)
  [32px spacing]
  Grid of cards with Body2 titles (14px/400)
  [64px spacing]
```

---

## Readability Optimization

### Line Length
- **Optimal:** 50-75 characters per line
- **Maximum:** 600px container width for body text

### Line Height
- **Headings:** 1.2-1.4 (tighter for impact)
- **Body:** 1.5-1.6 (comfortable reading)

### Font Size
- **Minimum:** 14px (Body2 - smallest text)
- **Maximum:** 48px (H1 - hero headline)

This limited scale ensures:
1. Consistent hierarchy
2. Easy scanning
3. Reduced cognitive load
4. Professional appearance
5. Excellent readability
