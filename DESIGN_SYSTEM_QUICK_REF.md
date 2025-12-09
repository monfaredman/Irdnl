# 🎨 Liquid Glass Design System - Quick Reference

## 📦 **Import**

```typescript
import {
  glassColors,
  glassStyles,
  glassAnimations,
  sliderStyles,
  createGlassGradient,
  createGoldGlow,
} from '@/theme/glass-design-system';
```

---

## 🎨 **Colors**

| Color | Value | Usage |
|-------|-------|-------|
| `glassColors.persianGold` | #F59E0B | Accent/Active states |
| `glassColors.text.primary` | #FFFFFF | Main text |
| `glassColors.text.secondary` | rgba(255,255,255,0.7) | Secondary text |
| `glassColors.glass.border` | rgba(255,255,255,0.1) | Borders |

---

## 🧩 **Ready-to-Use Styles**

### **Containers**
```tsx
<Box sx={glassStyles.card}>...</Box>
<Box sx={glassStyles.cardHover}>...</Box>
```

### **Buttons**
```tsx
<Box sx={glassStyles.pillButton()}>Regular</Box>
<Box sx={glassStyles.pillButton(true)}>Active</Box>
<IconButton sx={glassStyles.iconButton}>...</IconButton>
```

### **Links**
```tsx
<Box sx={glassStyles.link}>Footer Link</Box>
```

### **Inputs**
```tsx
<InputBase sx={glassStyles.input} />
```

### **Header**
```tsx
<AppBar sx={glassStyles.header(scrolled)}>...</AppBar>
```

### **Logo**
```tsx
<Box sx={glassStyles.logo}>P</Box>
```

---

## 🎬 **Slider Styles**

```tsx
<Box sx={sliderStyles.container}>
  <Box sx={sliderStyles.slide(isActive)}>...</Box>
  <IconButton sx={sliderStyles.arrow}>...</IconButton>
  <Box sx={sliderStyles.dot(isActive)} />
  <Box sx={sliderStyles.overlay}>...</Box>
</Box>
```

---

## ⚡ **Animations**

```tsx
sx={{
  transition: glassAnimations.transition.spring,
  '&:hover': { transform: 'translateY(-4px)' }
}}
```

---

## 📐 **Spacing (8px Grid)**

```tsx
sx={{ 
  p: `${glassSpacing.md}px`,  // 24px
  mb: `${glassSpacing.lg}px`  // 32px
}}
```

| Token | Value |
|-------|-------|
| `xs` | 8px |
| `sm` | 16px |
| `md` | 24px |
| `lg` | 32px |
| `xl` | 64px |

---

## 🛠️ **Utility Functions**

```tsx
// Custom glass gradient
background: createGlassGradient('135deg', 0.08, 0.05)

// Persian Gold gradient
background: createGoldGradient('90deg', 0.4, 0.2)

// Glass shadow
boxShadow: createGlassShadow(32, -4, 0.3)

// Gold glow
boxShadow: createGoldGlow(24, -4, 0.3)
```

---

## ✅ **Best Practices**

1. ✅ Use `transform` and `opacity` for animations
2. ✅ Apply `backdropFilter` conditionally
3. ✅ Use design system colors, not hardcoded values
4. ✅ Follow 8px spacing grid
5. ✅ Add spring animations to all interactions
6. ✅ Include ARIA labels on buttons
7. ✅ Test responsive breakpoints

---

## 🎯 **Common Patterns**

### **Glass Card with Hover**
```tsx
<Box sx={{
  ...glassStyles.card,
  p: `${glassSpacing.md}px`,
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: glassColors.gold.light,
  }
}}>
  Content
</Box>
```

### **Active Navigation Pill**
```tsx
<Box 
  component="button"
  sx={glassStyles.pillButton(pathname === href)}
>
  {label}
</Box>
```

### **Social Icon Button**
```tsx
<IconButton 
  sx={glassStyles.iconButton}
  aria-label="Instagram"
>
  <InstagramIcon />
</IconButton>
```

---

## 📖 **Full Documentation**

See `DESIGN_SYSTEM_GUIDE.md` for complete documentation with examples and best practices.

---

**Quick Tip:** Import the design system at the top of every component file for consistent styling!
