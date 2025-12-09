# 🎨 Liquid Glass Design System

## Complete Design System Documentation for PersiaPlay

---

## 📚 **Table of Contents**

1. [Overview](#overview)
2. [Installation](#installation)
3. [Core Concepts](#core-concepts)
4. [Color System](#color-system)
5. [Animation System](#animation-system)
6. [Spacing & Layout](#spacing--layout)
7. [Component Styles](#component-styles)
8. [Slider Components](#slider-components)
9. [Utility Functions](#utility-functions)
10. [Usage Examples](#usage-examples)
11. [Best Practices](#best-practices)

---

## 📖 **Overview**

The Liquid Glass Design System is a comprehensive, reusable design language for PersiaPlay. It provides:

- **Consistent glass morphism** effects across all components
- **Persian cultural elements** integrated seamlessly
- **Apple-inspired animations** with spring easing
- **Type-safe styles** for TypeScript projects
- **Performance-optimized** GPU-accelerated effects

**Design Philosophy:**
- Frosted glass aesthetic (backdrop blur + low opacity layers)
- Extreme minimalism (70%+ whitespace)
- Persian Gold accent color (#F59E0B)
- Spring animations (Apple-style bounce)
- 8px grid system for spacing

---

## 🚀 **Installation**

### Import the Design System

```typescript
// Import everything
import glassDesignSystem from '@/theme/glass-design-system';

// Or import specific parts
import {
  glassColors,
  glassStyles,
  glassAnimations,
  sliderStyles,
} from '@/theme/glass-design-system';
```

### File Location
```
src/theme/glass-design-system.ts
```

---

## 🎯 **Core Concepts**

### **Three Glass Layers**

```typescript
glassColors.glass.base    // rgba(255, 255, 255, 0.02) - Subtle
glassColors.glass.mid     // rgba(255, 255, 255, 0.05) - Medium
glassColors.glass.strong  // rgba(255, 255, 255, 0.08) - Prominent
glassColors.glass.border  // rgba(255, 255, 255, 0.10) - Borders
```

### **Backdrop Blur Levels**

```typescript
glassBlur.light   // blur(8px) saturate(120%)   - Minimal
glassBlur.medium  // blur(20px) saturate(180%)  - Standard
glassBlur.strong  // blur(40px) saturate(180%)  - Intense
```

### **Spring Animation**

```typescript
glassAnimations.spring // cubic-bezier(0.34, 1.56, 0.64, 1)
```
- Creates Apple-style bounce effect
- Overshoots slightly then settles
- Feels natural and premium

---

## 🎨 **Color System**

### **Base Colors**

```typescript
glassColors.deepMidnight  // #0A0A0A - Primary background
glassColors.black         // #000000 - Pure black
glassColors.white         // #FFFFFF - Pure white
glassColors.persianGold   // #F59E0B - Accent color
```

### **Text Hierarchy**

```typescript
glassColors.text.primary    // #FFFFFF           (100% opacity)
glassColors.text.secondary  // rgba(255,255,255,0.7) (70%)
glassColors.text.tertiary   // rgba(255,255,255,0.5) (50%)
glassColors.text.muted      // rgba(255,255,255,0.3) (30%)
```

### **Persian Gold Variations**

```typescript
glassColors.gold.solid    // #F59E0B     - Full opacity
glassColors.gold.light    // #F59E0B40   - 40% opacity
glassColors.gold.lighter  // #F59E0B20   - 20% opacity
glassColors.gold.glow     // #F59E0B30   - 30% for shadows
```

**Usage Example:**
```tsx
<Box sx={{ color: glassColors.text.secondary }}>
  Secondary text
</Box>
```

---

## ⚡ **Animation System**

### **Easing Functions**

```typescript
glassAnimations.spring  // cubic-bezier(0.34, 1.56, 0.64, 1)
glassAnimations.smooth  // cubic-bezier(0.4, 0, 0.2, 1)
```

### **Duration Presets**

```typescript
glassAnimations.duration.fast    // 0.2s
glassAnimations.duration.normal  // 0.3s
glassAnimations.duration.slow    // 0.4s
glassAnimations.duration.slower  // 0.5s
```

### **Pre-built Transitions**

```typescript
glassAnimations.transition.spring      // all 0.3s spring
glassAnimations.transition.springFast  // all 0.2s spring
glassAnimations.transition.springSlow  // all 0.4s spring
glassAnimations.transition.smooth      // all 0.3s smooth
```

**Usage Example:**
```tsx
<Box sx={{ 
  transition: glassAnimations.transition.spring,
  '&:hover': { transform: 'translateY(-4px)' }
}}>
  Hover me
</Box>
```

---

## 📐 **Spacing & Layout**

### **8px Grid System**

```typescript
glassSpacing.xs   // 8px   (0.5rem)
glassSpacing.sm   // 16px  (1rem)
glassSpacing.md   // 24px  (1.5rem)
glassSpacing.lg   // 32px  (2rem)
glassSpacing.xl   // 64px  (4rem)
glassSpacing.xxl  // 128px (8rem)
```

### **Border Radius**

```typescript
glassBorderRadius.sm     // 8px
glassBorderRadius.md     // 12px
glassBorderRadius.lg     // 16px
glassBorderRadius.xl     // 20px
glassBorderRadius.xxl    // 24px
glassBorderRadius.pill   // 24px (for buttons)
glassBorderRadius.circle // 50% (for avatars)
```

**Usage Example:**
```tsx
<Box sx={{ 
  p: `${glassSpacing.md}px`,
  borderRadius: glassBorderRadius.lg 
}}>
  Content
</Box>
```

---

## 🧩 **Component Styles**

### **1. Glass Card**

Basic glass container with backdrop blur.

```tsx
import { glassStyles } from '@/theme/glass-design-system';

<Box sx={glassStyles.card}>
  Card content
</Box>
```

**Features:**
- Frosted glass background
- 20px backdrop blur
- Subtle border
- Inset highlight

### **2. Glass Card with Hover**

Card that lifts and glows on hover.

```tsx
<Box sx={glassStyles.cardHover}>
  Hoverable card
</Box>
```

**Hover Effects:**
- Lifts 4px + scales 1.02x
- Enhanced shadow
- Persian Gold border

### **3. Pill Button**

Navigation/CTA button with liquid fill animation.

```tsx
// Regular pill
<Box component="button" sx={glassStyles.pillButton()}>
  Click me
</Box>

// Active state
<Box component="button" sx={glassStyles.pillButton(true)}>
  Active
</Box>
```

**Features:**
- Rounded pill shape (24px radius)
- Liquid shimmer on hover
- Lifts on hover
- Active state with gold accent

### **4. Glass Link**

Footer/navigation link with underline animation.

```tsx
<Box component="a" href="/page" sx={glassStyles.link}>
  Link text
</Box>
```

**Features:**
- Gradient underline (0% → 100% width)
- Slides right on hover
- Color transition

### **5. Glass Icon Button**

Social media/action button with liquid fill.

```tsx
<IconButton sx={glassStyles.iconButton}>
  <InstagramIcon />
</IconButton>
```

**Features:**
- 40×40px size
- Liquid fill from bottom (0% → 100% height)
- Lifts + scales on hover
- Gold glow shadow

### **6. Glass Input**

Search/form input field.

```tsx
<InputBase sx={glassStyles.input} placeholder="Search..." />
```

**Features:**
- Frosted glass background
- Focus state with gold border
- Placeholder styling

### **7. Glass Header**

Scroll-aware header that morphs.

```tsx
const [scrolled, setScrolled] = useState(false);

<AppBar sx={glassStyles.header(scrolled)}>
  Header content
</AppBar>
```

**Features:**
- Transparent when at top
- Morphs to glass on scroll
- Border appears on scroll

### **8. Glass Logo**

Brand monogram with glow.

```tsx
<Box sx={glassStyles.logo}>
  P
</Box>
```

**Features:**
- 48×48px square
- Persian Gold gradient
- Glow shadow
- Lift on hover

### **9. Persian Pattern Background**

Decorative background overlay.

```tsx
<Box sx={{ position: 'relative' }}>
  <Box sx={glassStyles.persianPattern} />
  Content here
</Box>
```

**Features:**
- Radial gradient pattern
- 3% opacity
- Non-interactive

---

## 🎬 **Slider Components**

### **Slider Container**

```tsx
<Box sx={sliderStyles.container}>
  {/* Slides here */}
</Box>
```

### **Slide Item**

```tsx
const isActive = currentIndex === index;

<Box sx={sliderStyles.slide(isActive)}>
  Slide content
</Box>
```

**Features:**
- Parallax effect (scale 1.05 when active)
- Opacity transition

### **Navigation Arrows**

```tsx
<IconButton sx={sliderStyles.arrow}>
  <ArrowBackIcon />
</IconButton>
```

**Features:**
- 48×48px circular
- Glass background
- Gold hover effect
- Disabled state styling

### **Dot Indicators**

```tsx
{slides.map((_, index) => (
  <Box sx={sliderStyles.dot(currentIndex === index)} />
))}
```

**Features:**
- 8px height
- Expands to 24px when active
- Gold gradient when active
- Hover state

### **Slide Overlay**

```tsx
<Box sx={sliderStyles.overlay}>
  <Typography>Title</Typography>
  <Button>CTA</Button>
</Box>
```

**Features:**
- Gradient background
- Bottom-aligned
- Backdrop blur

---

## 🛠️ **Utility Functions**

### **1. Create Glass Gradient**

```typescript
createGlassGradient(
  direction?: string,      // Default: '135deg'
  startOpacity?: number,   // Default: 0.08
  endOpacity?: number      // Default: 0.05
) => string
```

**Example:**
```tsx
<Box sx={{ 
  background: createGlassGradient('180deg', 0.1, 0.03) 
}}>
  Custom gradient
</Box>
```

### **2. Create Gold Gradient**

```typescript
createGoldGradient(
  direction?: string,      // Default: '135deg'
  startOpacity?: number,   // Default: 0.4
  endOpacity?: number      // Default: 0.2
) => string
```

**Example:**
```tsx
<Box sx={{ 
  background: createGoldGradient('90deg', 0.5, 0.1) 
}}>
  Gold accent
</Box>
```

### **3. Create Glass Shadow**

```typescript
createGlassShadow(
  blur?: number,    // Default: 32
  spread?: number,  // Default: -4
  opacity?: number  // Default: 0.3
) => string
```

**Example:**
```tsx
<Box sx={{ 
  boxShadow: createGlassShadow(48, -8, 0.4) 
}}>
  Custom shadow
</Box>
```

### **4. Create Gold Glow**

```typescript
createGoldGlow(
  blur?: number,    // Default: 24
  spread?: number,  // Default: -4
  opacity?: number  // Default: 0.3
) => string
```

**Example:**
```tsx
<Box sx={{ 
  boxShadow: createGoldGlow(32, -6, 0.5) 
}}>
  Gold glow
</Box>
```

---

## 💡 **Usage Examples**

### **Example 1: Custom Glass Card**

```tsx
import { Box, Typography } from '@mui/material';
import { glassStyles, glassColors, glassSpacing } from '@/theme/glass-design-system';

function CustomCard() {
  return (
    <Box 
      sx={{
        ...glassStyles.card,
        p: `${glassSpacing.md}px`,
        '&:hover': {
          transform: 'translateY(-8px)',
          borderColor: glassColors.gold.light,
        }
      }}
    >
      <Typography sx={{ color: glassColors.text.primary }}>
        Title
      </Typography>
      <Typography sx={{ color: glassColors.text.secondary }}>
        Description
      </Typography>
    </Box>
  );
}
```

### **Example 2: Custom Navigation**

```tsx
import { Box } from '@mui/material';
import { glassStyles, glassAnimations } from '@/theme/glass-design-system';
import { usePathname } from 'next/navigation';

function Navigation({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {items.map(item => {
        const isActive = pathname === item.href;
        
        return (
          <Box
            key={item.href}
            component="a"
            href={item.href}
            sx={{
              ...glassStyles.pillButton(isActive),
              textDecoration: 'none',
            }}
          >
            {item.label}
          </Box>
        );
      })}
    </Box>
  );
}
```

### **Example 3: Custom Slider**

```tsx
import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { sliderStyles, glassSpacing } from '@/theme/glass-design-system';

function CustomSlider({ items }: { items: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  return (
    <Box sx={sliderStyles.container}>
      {/* Slides */}
      <Box sx={{ display: 'flex' }}>
        {items.map((item, index) => (
          <Box 
            key={index}
            sx={sliderStyles.slide(currentIndex === index)}
          >
            {/* Slide content */}
          </Box>
        ))}
      </Box>
      
      {/* Navigation */}
      <IconButton 
        sx={{ ...sliderStyles.arrow, left: glassSpacing.md }}
        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
      >
        <ArrowBack />
      </IconButton>
      
      {/* Dots */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {items.map((_, index) => (
          <Box 
            key={index}
            sx={sliderStyles.dot(currentIndex === index)}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>
    </Box>
  );
}
```

### **Example 4: Persian Pattern Section**

```tsx
import { Box, Container } from '@mui/material';
import { glassStyles, glassColors } from '@/theme/glass-design-system';

function HeroSection() {
  return (
    <Box sx={{ position: 'relative', py: 8 }}>
      {/* Persian Pattern Background */}
      <Box sx={glassStyles.persianPattern} />
      
      {/* Content */}
      <Container>
        <Typography sx={{ color: glassColors.text.primary }}>
          Welcome to PersiaPlay
        </Typography>
      </Container>
    </Box>
  );
}
```

---

## ✅ **Best Practices**

### **Performance**

1. **Use transform/opacity for animations**
   ```tsx
   // ✅ Good - GPU accelerated
   '&:hover': { transform: 'translateY(-4px)', opacity: 0.9 }
   
   // ❌ Bad - Triggers layout
   '&:hover': { marginTop: '-4px', height: '100px' }
   ```

2. **Apply backdrop-filter conditionally**
   ```tsx
   // ✅ Good - Only when needed
   backdropFilter: isActive ? glassBlur.medium : 'none'
   
   // ❌ Bad - Always on (expensive)
   backdropFilter: glassBlur.medium
   ```

3. **Use passive scroll listeners**
   ```tsx
   // ✅ Good
   window.addEventListener('scroll', handler, { passive: true });
   
   // ❌ Bad
   window.addEventListener('scroll', handler);
   ```

### **Consistency**

1. **Always use design system colors**
   ```tsx
   // ✅ Good
   color: glassColors.text.secondary
   
   // ❌ Bad
   color: 'rgba(255, 255, 255, 0.7)'
   ```

2. **Use spacing tokens**
   ```tsx
   // ✅ Good
   p: `${glassSpacing.md}px`
   
   // ❌ Bad
   p: '24px'
   ```

3. **Use spring animations**
   ```tsx
   // ✅ Good
   transition: glassAnimations.transition.spring
   
   // ❌ Bad
   transition: 'all 0.3s ease'
   ```

### **Accessibility**

1. **Maintain color contrast**
   - Text on glass: Use `text.primary` or `text.secondary`
   - Gold text on dark: Passes WCAG AA (4.5:1)

2. **Add ARIA labels**
   ```tsx
   <IconButton aria-label="Close menu" sx={glassStyles.iconButton}>
     <CloseIcon />
   </IconButton>
   ```

3. **Ensure keyboard navigation**
   - All interactive elements should be focusable
   - Add visible focus indicators

### **Responsive Design**

1. **Use MUI breakpoints**
   ```tsx
   <Box sx={{
     ...glassStyles.card,
     p: { xs: glassSpacing.sm, md: glassSpacing.lg }
   }}>
   ```

2. **Hide/show based on screen size**
   ```tsx
   <Box sx={{ display: { xs: 'none', md: 'block' } }}>
     Desktop only
   </Box>
   ```

---

## 📊 **Component Checklist**

When creating new components, ensure they have:

- [ ] Glass background with backdrop blur
- [ ] Border using `glassColors.glass.border`
- [ ] Spring animations (`glassAnimations.transition.spring`)
- [ ] Hover state with transform
- [ ] Proper spacing using `glassSpacing`
- [ ] Border radius using `glassBorderRadius`
- [ ] Text colors from `glassColors.text`
- [ ] Persian Gold accents where appropriate
- [ ] Responsive behavior
- [ ] Accessibility features (ARIA, keyboard)

---

## 🎓 **Quick Reference**

### **Most Common Imports**

```typescript
import {
  glassColors,        // Color system
  glassStyles,        // Pre-built components
  glassAnimations,    // Transitions
  glassSpacing,       // 8px grid
  glassBorderRadius,  // Border radius
  sliderStyles,       // Slider components
} from '@/theme/glass-design-system';
```

### **Most Used Styles**

```typescript
glassStyles.card          // Basic glass container
glassStyles.cardHover     // Hoverable card
glassStyles.pillButton()  // Navigation button
glassStyles.link          // Footer/nav link
glassStyles.iconButton    // Social/action button
glassStyles.input         // Form input
```

### **Most Used Colors**

```typescript
glassColors.persianGold       // Accent color
glassColors.text.primary      // White text
glassColors.text.secondary    // 70% white
glassColors.glass.border      // Borders
```

---

## 🚀 **Next Steps**

1. **Import the design system** into your components
2. **Replace inline styles** with system styles
3. **Use utility functions** for custom effects
4. **Follow best practices** for consistency
5. **Refer to examples** when building new features

**Happy coding!** 🎨✨

---

**Version:** 1.0.0  
**Last Updated:** December 9, 2025  
**Maintained by:** PersiaPlay Design Team
