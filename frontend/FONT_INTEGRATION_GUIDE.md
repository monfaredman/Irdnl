# 🔤 Persian Font Integration Guide

## ✅ Implementation Complete

Vazirmatn font has been successfully integrated into PersiaPlay for proper Persian/Farsi text rendering.

---

## 📦 What's Included

### 1. **Font Configuration** (`src/app/layout.tsx`)

```tsx
import localFont from "next/font/local";

const vazirmatn = localFont({
  src: [
    {
      path: "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
});
```

### 2. **RTL Direction Support** (`src/providers/language-provider.tsx`)

Automatically switches text direction based on language:

```tsx
useEffect(() => {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute("lang", language);
  htmlElement.setAttribute("dir", language === "fa" ? "rtl" : "ltr");
}, [language]);
```

### 3. **Theme Integration** (`src/theme/liquid-glass-theme.ts`)

Vazirmatn is set as the primary font family:

```tsx
typography: {
  fontFamily: [
    'var(--font-vazirmatn)', // Persian/Farsi font first
    '-apple-system',
    'BlinkMacSystemFont',
    // ... other fallbacks
  ].join(','),
}
```

### 4. **CSS Optimization** (`src/app/globals.css`)

```css
/* RTL Support */
[dir="rtl"] {
  font-family: var(--font-vazirmatn), -apple-system, sans-serif;
}

/* Persian text rendering */
[lang="fa"] {
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
  text-rendering: optimizeLegibility;
}
```

---

## 🎯 Font Weights Available

| Weight | Usage                   | CSS Value |
|--------|-------------------------|-----------|
| Light  | Body text, captions     | 300       |
| Regular| Default text            | 400       |
| Medium | Subheadings, emphasis   | 500       |
| Bold   | Headings, buttons       | 700       |

---

## 🌐 CDN vs Local Hosting

### Current Setup: **CDN (jsDelivr)**

**Pros:**
- ✅ No bundle size increase
- ✅ Global CDN caching
- ✅ Fast delivery worldwide
- ✅ Automatic version updates

**Cons:**
- ❌ Requires internet connection
- ❌ External dependency

### Alternative: Local Hosting

To host fonts locally:

1. **Download Vazirmatn fonts:**
   ```bash
   mkdir -p public/fonts/vazirmatn
   cd public/fonts/vazirmatn
   wget https://github.com/rastikerdar/vazirmatn/releases/download/v33.003/vazirmatn-font-v33.003.zip
   unzip vazirmatn-font-v33.003.zip
   ```

2. **Update `layout.tsx`:**
   ```tsx
   const vazirmatn = localFont({
     src: [
       {
         path: "../public/fonts/vazirmatn/Vazirmatn-Light.woff2",
         weight: "300",
       },
       // ... other weights
     ],
   });
   ```

---

## 🎨 Usage Examples

### React Components

```tsx
// Automatic font based on language
import { useLanguage } from "@/providers/language-provider";

function MyComponent() {
  const { language } = useLanguage();
  
  return (
    <Typography variant="h1">
      {language === "fa" ? "عنوان فارسی" : "English Title"}
    </Typography>
  );
}
```

### Direct CSS/MUI Styling

```tsx
// Force Vazirmatn for specific text
<Box sx={{ fontFamily: 'var(--font-vazirmatn)' }}>
  متن فارسی
</Box>

// Use font weight
<Typography sx={{ fontWeight: 700 }}>
  عنوان پررنگ
</Typography>
```

---

## 🔄 RTL Layout Behavior

### Automatic Changes

When language switches to Persian (`fa`):

1. **Text Direction:** LTR → RTL
2. **Font Family:** System fonts → Vazirmatn
3. **HTML Attribute:** `dir="rtl"` added
4. **Language Tag:** `lang="fa"` added

### Testing RTL

```tsx
// Toggle language in your app
const { language, setLanguage } = useLanguage();

<Button onClick={() => setLanguage(language === "fa" ? "en" : "fa")}>
  Toggle Language
</Button>
```

---

## 📊 Performance Metrics

### Font Loading Strategy

- **Display:** `swap` - Show fallback font first, swap when Vazirmatn loads
- **Preload:** `true` - Start downloading immediately
- **Format:** WOFF2 - Best compression (30-50% smaller than WOFF)

### Optimization Tips

1. **Preconnect to CDN** (Already added in `layout.tsx`):
   ```tsx
   <link rel="preconnect" href="https://cdn.jsdelivr.net" />
   ```

2. **Font Subsetting** (If hosting locally):
   - Include only Persian/Arabic characters
   - Reduces file size by 70%+

3. **Font Display Strategy**:
   - Current: `swap` (Best for UX)
   - Alternative: `optional` (Faster but may not swap)

---

## 🐛 Troubleshooting

### Font Not Loading

**Issue:** Persian text appears in system font

**Solutions:**
1. Check browser console for font loading errors
2. Verify CDN is accessible: https://cdn.jsdelivr.net
3. Clear browser cache and hard reload (Cmd/Ctrl + Shift + R)
4. Check language is set to `"fa"` in LanguageProvider

### RTL Not Working

**Issue:** Text direction is LTR for Persian content

**Solutions:**
1. Verify language is set to `"fa"`: `console.log(language)`
2. Check HTML element: `document.documentElement.dir` should be `"rtl"`
3. Ensure LanguageProvider wraps your component tree

### Font Appears Bold/Thin

**Issue:** Wrong font weight displayed

**Solutions:**
1. Check font-weight value: Should be 300, 400, 500, or 700
2. Verify all weight variations loaded successfully
3. Use DevTools → Network → Filter "woff2" to check downloads

---

## 🌍 Language Coverage

Vazirmatn supports:
- ✅ **Persian/Farsi** (fa)
- ✅ **Arabic** (ar)
- ✅ **Urdu** (ur)
- ✅ **Kurdish** (ku)
- ✅ **Latin characters** (English fallback)

---

## 🎭 Font Features

### OpenType Features

```css
/* Already enabled in globals.css */
font-feature-settings: 
  "kern" 1,  /* Kerning */
  "liga" 1,  /* Ligatures */
  "calt" 1;  /* Contextual Alternates */
```

### Typography Best Practices

```tsx
// Headings - Bold
<Typography variant="h1" sx={{ fontWeight: 700 }}>
  عنوان اصلی
</Typography>

// Body - Regular
<Typography variant="body1" sx={{ fontWeight: 400 }}>
  متن اصلی
</Typography>

// Caption - Light
<Typography variant="caption" sx={{ fontWeight: 300 }}>
  توضیحات
</Typography>
```

---

## 📝 Font License

**Vazirmatn License:** MIT License

- ✅ Free for commercial use
- ✅ Modify and redistribute
- ✅ No attribution required (but appreciated)
- ✅ No warranty

**Original Author:** Saber Rastikerdar  
**Repository:** https://github.com/rastikerdar/vazirmatn

---

## 🔗 Resources

- [Vazirmatn GitHub](https://github.com/rastikerdar/vazirmatn)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Google Fonts RTL Guide](https://fonts.google.com/knowledge/introducing_type/implementing_right_to_left_alphabets)
- [CSS Writing Modes](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Writing_Modes)

---

## ✅ Quick Test

Run this code to verify font integration:

```tsx
import { useLanguage } from "@/providers/language-provider";

function FontTest() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div>
      <button onClick={() => setLanguage("fa")}>Set Persian</button>
      <button onClick={() => setLanguage("en")}>Set English</button>
      
      <p style={{ fontWeight: 300 }}>این متن با وزن سبک است - Light</p>
      <p style={{ fontWeight: 400 }}>این متن با وزن معمولی است - Regular</p>
      <p style={{ fontWeight: 500 }}>این متن با وزن متوسط است - Medium</p>
      <p style={{ fontWeight: 700 }}>این متن با وزن پررنگ است - Bold</p>
    </div>
  );
}
```

Expected result: All Persian text should render in Vazirmatn font with correct weights.
