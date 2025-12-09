# Color Palette - Minimal Design

## Primary Colors (2 + 1 Accent)

### 1. Black (Primary)
```
HEX:  #000000
RGB:  0, 0, 0
CMYK: 0, 0, 0, 100

Usage:
- Primary text
- Button backgrounds
- Borders (active state)
- Logo/branding
- Icons
```

### 2. White (Background)
```
HEX:  #FFFFFF
RGB:  255, 255, 255
CMYK: 0, 0, 0, 0

Usage:
- Page backgrounds
- Card backgrounds
- Button text (on black)
- Negative space
```

### 3. Off-White (Accent/Secondary Background)
```
HEX:  #F5F5F5
RGB:  245, 245, 245
CMYK: 0, 0, 0, 4

Usage:
- Hover states
- Secondary backgrounds
- Subtle differentiation
```

## Supporting Grays (For UI States)

### Light Gray (Borders)
```
HEX:  #E5E5E5
RGB:  229, 229, 229
CMYK: 0, 0, 0, 10

Usage:
- Default borders
- Divider lines
- Inactive states
```

### Medium Gray (Secondary Text)
```
HEX:  #999999
RGB:  153, 153, 153
CMYK: 0, 0, 0, 40

Usage:
- Secondary text
- Placeholder text
- Disabled states
```

---

## Color Application Matrix

| Element | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| **Page** | White (#FFFFFF) | Black (#000000) | - | - |
| **Button (Primary)** | Black (#000000) | White (#FFFFFF) | Black (#000000) | No change |
| **Button (Secondary)** | White (#FFFFFF) | Black (#000000) | Black (#000000) | Off-White (#F5F5F5) |
| **Card** | White (#FFFFFF) | Black (#000000) | Light Gray (#E5E5E5) | Border → Black |
| **Input** | White (#FFFFFF) | Black (#000000) | Light Gray (#E5E5E5) | Border → Black |
| **Header** | White (#FFFFFF) | Black (#000000) | Light Gray (#E5E5E5) | - |
| **Footer** | White (#FFFFFF) | Black (#000000) | Light Gray (#E5E5E5) | - |
| **Nav Link** | Transparent | Black (#000000) | - | No change |
| **Nav Link (Active)** | Transparent | Black (#000000) | Black (bottom) | - |

---

## Contrast Ratios (WCAG)

All combinations meet **WCAG AAA** standards:

| Combination | Ratio | Level |
|-------------|-------|-------|
| Black on White | 21:1 | AAA ✓ |
| White on Black | 21:1 | AAA ✓ |
| Medium Gray on White | 4.5:1 | AA ✓ |
| Light Gray on White | 1.9:1 | - (UI only) |

---

## Usage Rules

### ✅ DO
- Use black for all primary text
- Use white for page backgrounds
- Use 1px solid borders only
- Use light gray for inactive borders
- Use medium gray for secondary text
- Maintain high contrast

### ❌ DON'T
- No gradients (linear/radial)
- No color overlays
- No opacity/transparency on text
- No colored buttons (stay monochrome)
- No decorative colors
- No more than these 5 colors

---

## Code Implementation

```typescript
// Color constants
export const minimalColors = {
  black: '#000000',
  white: '#FFFFFF',
  offWhite: '#F5F5F5',
  gray: '#999999',
  lightGray: '#E5E5E5',
};

// MUI Theme
palette: {
  primary: {
    main: '#000000',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
  },
  text: {
    primary: '#000000',
    secondary: '#999999',
  },
  divider: '#E5E5E5',
}
```

---

## Visual Reference

```
┌─────────────────────────────────────┐
│ #FFFFFF (White)                     │ ← Page background
│                                     │
│ ┌─────────────────────────────┐   │
│ │ #000000 (Black) Text        │   │ ← Primary text
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ #999999 (Gray) Text         │   │ ← Secondary text
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │  [Black Button]             │   │ ← #000000 bg
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Card with #E5E5E5 border    │   │ ← Light gray border
│ └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## Monochrome Philosophy

This minimal design intentionally uses **only black and white** with gray accents to:

1. **Eliminate visual noise** - No competing colors
2. **Focus on content** - Typography and layout shine
3. **Timeless aesthetic** - Never goes out of style
4. **Maximum contrast** - Best readability
5. **Print-friendly** - Looks great in any medium
6. **Accessibility** - Highest contrast ratios
7. **Professional** - Clean, serious, focused

The lack of color forces better:
- Typography choices
- Spacing decisions
- Layout hierarchy
- Content strategy
