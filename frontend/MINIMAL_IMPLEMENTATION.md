# Minimal Design Implementation Guide

## Overview

This project now includes a **complete minimal design system** following strict minimalism principles. You can switch between the original vibrant design and the new minimal design.

---

## 📁 File Structure

```
irdnl/
├── src/
│   ├── theme/
│   │   ├── theme.ts                  # Original vibrant theme
│   │   └── minimal-theme.ts          # ✨ NEW: Minimal theme
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Original header
│   │   │   ├── Footer.tsx            # Original footer
│   │   │   ├── MinimalHeader.tsx     # ✨ NEW: Minimal header
│   │   │   ├── MinimalFooter.tsx     # ✨ NEW: Minimal footer
│   │   │   └── MinimalLayoutWrapper.tsx  # ✨ NEW
│   │   └── sections/
│   │       ├── PersianHero.tsx       # Original hero
│   │       ├── HorizontalCarousel.tsx # Original carousel
│   │       ├── MinimalHero.tsx       # ✨ NEW: Minimal hero
│   │       └── MinimalGrid.tsx       # ✨ NEW: Minimal grid
│   └── app/
│       ├── page.tsx                  # Original homepage
│       ├── page-minimal.tsx          # ✨ NEW: Minimal homepage
│       └── layout.tsx                # Root layout
├── MINIMAL_DESIGN_SYSTEM.md          # ✨ Complete design system docs
├── MINIMAL_WIREFRAME.md              # ✨ Visual wireframes
├── MINIMAL_COLOR_PALETTE.md          # ✨ Color specifications
├── MINIMAL_TYPOGRAPHY.md             # ✨ Type scale & fonts
├── MINIMAL_SPACING.md                # ✨ 8px grid system
└── MINIMAL_IMPLEMENTATION.md         # This file
```

---

## 🎨 Design System Principles

### 1. **8-Point Grid System**
All spacing in multiples of 8px:
- `xs`: 8px
- `sm`: 16px
- `md`: 24px
- `lg`: 32px
- `xl`: 64px
- `xxl`: 128px

### 2. **Monochrome Color Palette**
Only 3 colors:
- Black (#000000) - Text, buttons, borders
- White (#FFFFFF) - Backgrounds
- Gray (#999999) - Secondary text

### 3. **Limited Typography**
4 sizes only:
- H1: 48px/600
- H3: 24px/600
- Body1: 16px/400
- Body2: 14px/400

### 4. **Flat Design**
- No gradients
- No shadows
- No border-radius (0px)
- No animations
- No glass effects

---

## 🚀 Quick Start

### Option 1: Preview Minimal Design (Recommended)

1. **Update the root layout** to use minimal theme for testing:

```typescript
// src/app/layout.tsx
import MinimalHome from './page-minimal';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MinimalLayoutWrapper>
          <MinimalHome />  {/* Use minimal homepage */}
        </MinimalLayoutWrapper>
      </body>
    </html>
  );
}
```

2. **Run the development server:**
```bash
npm run dev
```

3. **View at:** http://localhost:3000

### Option 2: Replace Original Design

1. **Backup original files:**
```bash
cp src/app/page.tsx src/app/page-original.tsx
cp src/app/layout.tsx src/app/layout-original.tsx
```

2. **Replace homepage:**
```bash
cp src/app/page-minimal.tsx src/app/page.tsx
```

3. **Update layout.tsx:**
```typescript
import { MinimalLayoutWrapper } from '@/components/layout/MinimalLayoutWrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MinimalLayoutWrapper>
          {children}
        </MinimalLayoutWrapper>
      </body>
    </html>
  );
}
```

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [MINIMAL_DESIGN_SYSTEM.md](./MINIMAL_DESIGN_SYSTEM.md) | Complete design system overview |
| [MINIMAL_WIREFRAME.md](./MINIMAL_WIREFRAME.md) | Visual wireframes with measurements |
| [MINIMAL_COLOR_PALETTE.md](./MINIMAL_COLOR_PALETTE.md) | Color specifications & usage |
| [MINIMAL_TYPOGRAPHY.md](./MINIMAL_TYPOGRAPHY.md) | Type scale & font system |
| [MINIMAL_SPACING.md](./MINIMAL_SPACING.md) | 8px grid system details |

---

## 🧩 Components

### Layout Components

#### MinimalHeader
```typescript
import { MinimalHeader } from '@/components/layout/MinimalHeader';

<MinimalHeader />
```
**Features:**
- Simplified navigation
- Wordmark logo (text only)
- Clean border bottom
- No search bar
- Single CTA button

#### MinimalFooter
```typescript
import { MinimalFooter } from '@/components/layout/MinimalFooter';

<MinimalFooter />
```
**Features:**
- Essential links only
- 3-column grid
- Clean borders
- No decorative elements

### Content Components

#### MinimalHero
```typescript
import { MinimalHero } from '@/components/sections/MinimalHero';

<MinimalHero />
```
**Features:**
- Single bold headline
- One CTA button
- Maximum whitespace (128px padding)
- No background images

#### MinimalGrid
```typescript
import { MinimalGrid } from '@/components/sections/MinimalGrid';

<MinimalGrid 
  title="Foreign Movies"
  items={movies}
  type="movie"
  viewAllHref="/movies"
/>
```
**Features:**
- Clean grid layout
- 4-column desktop, 2-column mobile
- 24px gaps
- Shows 8 items maximum
- Simple 1px borders

---

## 🎯 Key Differences

| Feature | Original Design | Minimal Design |
|---------|----------------|----------------|
| **Colors** | Vibrant (cyan, purple, pink) | Monochrome (black/white) |
| **Spacing** | Variable | Strict 8px grid |
| **Borders** | Rounded (16px) | Sharp (0px) |
| **Effects** | Gradients, shadows, glass | None |
| **Typography** | Multiple sizes | 4 sizes only |
| **Animation** | Hover effects, transitions | None |
| **Layout** | Carousels, floating elements | Static grids |
| **Whitespace** | Moderate | Maximum |

---

## 💻 Development

### Using the Theme

```typescript
import { minimalTheme, minimalSpacing, minimalColors } from '@/theme/minimal-theme';

// In components
<Box sx={{
  py: minimalSpacing.xl / 8,      // 64px
  px: minimalSpacing.lg / 8,      // 32px
  color: minimalColors.black,
  backgroundColor: minimalColors.white,
  border: `1px solid ${minimalColors.lightGray}`,
}} />
```

### Creating New Components

Follow these principles:

```typescript
// ✅ DO
<Button 
  variant="contained"
  sx={{
    borderRadius: 0,              // Flat design
    boxShadow: 'none',            // No shadows
    padding: '16px 32px',         // 8px multiples
    '&:hover': {
      boxShadow: 'none',          // No hover shadows
    }
  }}
>
  Click Me
</Button>

// ❌ DON'T
<Button 
  variant="contained"
  sx={{
    borderRadius: 3,              // No rounded corners
    boxShadow: 3,                 // No shadows
    padding: '15px 25px',         // Not 8px multiples
    background: 'linear-gradient(...)', // No gradients
  }}
>
  Click Me
</Button>
```

---

## 🔧 Customization

### Adjusting Spacing

Edit `src/theme/minimal-theme.ts`:

```typescript
const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 64,
  xxl: 128,  // Increase for more whitespace
};
```

### Changing Colors

```typescript
const colors = {
  black: '#000000',
  white: '#FFFFFF',
  offWhite: '#F5F5F5',
  gray: '#999999',
  lightGray: '#E5E5E5',
  // Add accent color if needed (limit to 3 total)
};
```

### Typography Adjustments

```typescript
typography: {
  h1: {
    fontSize: '48px',  // Adjust as needed
    fontWeight: 600,
  },
  // ... other styles
}
```

---

## 📱 Responsive Design

### Breakpoints
```typescript
{
  xs: 0,      // Mobile
  sm: 600,    // Tablet
  md: 960,    // Desktop
  lg: 1280,   // Large desktop
  xl: 1920,   // Extra large
}
```

### Mobile Optimizations
- Hero padding reduced: 128px → 64px
- Grid: 4 columns → 2 columns
- Container padding: 32px → 16px
- Font sizes reduced proportionally

---

## ✅ Testing Checklist

When implementing minimal design:

- [ ] All spacing uses 8px multiples
- [ ] No gradients or shadows present
- [ ] Border radius = 0 on all elements
- [ ] Max 3 colors used
- [ ] Typography uses only 4 sizes
- [ ] No animations or transitions
- [ ] Grid alignment maintained
- [ ] Contrast ratios meet WCAG AAA
- [ ] Mobile responsive
- [ ] Maximum whitespace applied

---

## 🐛 Troubleshooting

### Issue: Spacing doesn't align to grid
**Solution:** Use `minimalSpacing` tokens and divide by 8 for MUI:
```typescript
sx={{ mb: minimalSpacing.lg / 8 }}  // Not mb: 4
```

### Issue: Colors not matching
**Solution:** Import from theme:
```typescript
import { minimalColors } from '@/theme/minimal-theme';
```

### Issue: Rounded corners appearing
**Solution:** Explicitly set borderRadius:
```typescript
sx={{ borderRadius: 0 }}
```

### Issue: Shadows showing on hover
**Solution:** Remove hover effects:
```typescript
sx={{
  '&:hover': {
    boxShadow: 'none',
    transform: 'none',
  }
}}
```

---

## 🔄 Switching Back to Original

To revert to the original vibrant design:

```typescript
// src/app/layout.tsx
import { theme } from '@/theme/theme';  // Original theme
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function RootLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      {children}
      <Footer />
    </ThemeProvider>
  );
}
```

And use `src/app/page.tsx` (original homepage).

---

## 📊 Performance

### Minimal Design Benefits
- ✅ **Faster load** - No complex effects
- ✅ **Smaller CSS** - Fewer styles
- ✅ **Better performance** - No animations
- ✅ **Accessibility** - Higher contrast
- ✅ **Print-friendly** - Clean layout

---

## 🎓 Learning Resources

- [MINIMAL_DESIGN_SYSTEM.md](./MINIMAL_DESIGN_SYSTEM.md) - Start here
- [MINIMAL_WIREFRAME.md](./MINIMAL_WIREFRAME.md) - See visual structure
- [MINIMAL_SPACING.md](./MINIMAL_SPACING.md) - Understand 8px grid

---

## 📝 Notes

- Both designs coexist in the codebase
- Easy to switch between them
- Minimal components prefixed with "Minimal"
- Original components unchanged
- Choose based on brand direction

---

## 🤝 Contributing

When adding new components:

1. Follow 8-point grid system
2. Use only theme colors
3. No custom spacing values
4. Maintain flat design
5. Test on multiple devices
6. Document in component file

---

## 📧 Support

Questions about minimal design implementation?
- Review documentation files
- Check component examples
- Compare with original design

---

**Ready to use minimal design?** Follow the Quick Start guide above! 🚀
