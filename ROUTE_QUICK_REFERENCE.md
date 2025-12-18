# Quick Route Reference Guide

## 🎬 Movies

### Foreign Movies (`/movies/foreign`)
```
فیلم خارجی | Foreign Movies
├── /movies/foreign/action      → اکشن
├── /movies/foreign/drama       → درام
├── /movies/foreign/comedy      → کمدی
├── /movies/foreign/thriller    → هیجان‌انگیز
├── /movies/foreign/horror      → ترسناک
├── /movies/foreign/scifi       → علمی‌تخیلی
├── /movies/foreign/romance     → عاشقانه
├── /movies/foreign/crime       → جنایی
└── /movies/foreign/fantasy     → فانتزی
```

### Iranian Movies (`/movies/iranian`)
```
فیلم ایرانی | Iranian Movies
├── /movies/iranian/drama       → درام
├── /movies/iranian/comedy      → کمدی
├── /movies/iranian/family      → خانوادگی
└── /movies/iranian/action      → اکشن
```

## 📺 Series

### Foreign Series (`/series/foreign`)
```
سریال خارجی | Foreign Series
├── /series/foreign/action      → اکشن
├── /series/foreign/drama       → درام
├── /series/foreign/comedy      → کمدی
├── /series/foreign/thriller    → هیجان‌انگیز
├── /series/foreign/crime       → جنایی
├── /series/foreign/fantasy     → فانتزی
└── /series/foreign/mystery     → معمایی
```

### Iranian Series (`/series/iranian`)
```
سریال ایرانی | Iranian Series
├── /series/iranian/drama       → درام
├── /series/iranian/comedy      → کمدی
└── /series/iranian/family      → خانوادگی
```

## 🎨 Special Categories

```
/animation  → انیمیشن    | Animation
/dubbed     → دوبله فارسی | Persian Dubbed
/anime      → انیمه       | Anime
```

## 📂 Other Categories

```
/category                       → سایر | Other
├── /category/coming-soon       → به‌زودی | Coming Soon
├── /category/collections       → مجموعه‌ها | Collections
└── /category/kids              → کودکان | Kids Zone
```

## 🔄 URL Migration Examples

### Query Parameters → Path-based Routes

**Before:**
```
/movies?origin=foreign
/movies?origin=iranian
/movies?genre=action
/series?origin=foreign
/genres?type=animation
```

**After:**
```
/movies/foreign
/movies/iranian
/movies/foreign/action
/series/foreign
/animation
```

### Old Paths → New Paths

**Before:**
```
/genres
/coming-soon
/collections
/kids
```

**After:**
```
/category
/category/coming-soon
/category/collections
/category/kids
```

## 🧭 Navigation Structure

```javascript
// Example navigation object
const navigation = {
  foreignMovies: {
    path: '/movies/foreign',
    label: { en: 'Foreign Movies', fa: 'فیلم خارجی' },
    genres: [
      { path: '/movies/foreign/action', label: { en: 'Action', fa: 'اکشن' } },
      { path: '/movies/foreign/drama', label: { en: 'Drama', fa: 'درام' } },
      // ... more genres
    ]
  },
  iranianMovies: {
    path: '/movies/iranian',
    label: { en: 'Iranian Movies', fa: 'فیلم ایرانی' },
    genres: [
      { path: '/movies/iranian/drama', label: { en: 'Drama', fa: 'درام' } },
      // ... more genres
    ]
  },
  // ... more categories
};
```

## 📱 Component Usage

### Link to a Genre Page
```tsx
import Link from 'next/link';

// Foreign action movies
<Link href="/movies/foreign/action">
  اکشن | Action
</Link>

// Iranian comedy movies
<Link href="/movies/iranian/comedy">
  کمدی | Comedy
</Link>
```

### Generate Metadata
```tsx
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata('/movies/foreign/action', 'fa');
// Returns: { title: 'اکشن - فیلم خارجی | IrDnl', description: '...' }
```

### Use in Navigation
```tsx
import { useLanguage } from '@/providers/language-provider';

const { language, t } = useLanguage();

// Get translated label
const label = t('foreignMovies'); // "Foreign Movies" or "فیلم خارجی"
```

## 🎯 Common Use Cases

### 1. Browse Foreign Action Movies
```
URL: /movies/foreign/action
Title: اکشن - فیلم خارجی | IrDnl
```

### 2. Browse Iranian Drama
```
URL: /movies/iranian/drama
Title: درام - فیلم ایرانی | IrDnl
```

### 3. View All Animations
```
URL: /animation
Title: انیمیشن | IrDnl
```

### 4. Coming Soon Content
```
URL: /category/coming-soon
Title: به‌زودی | IrDnl
```

## 💡 Pro Tips

1. **Deep Linking:** All routes support direct access (no redirects needed)
2. **SEO Friendly:** Clean URLs without query parameters
3. **Bilingual:** Every page has both English and Persian metadata
4. **Backward Compatible:** Old URLs automatically redirect
5. **Type Safe:** All routes are TypeScript typed

## 🔍 Search & Discovery

Users can now discover content through:
- **Main Categories:** Movies (Foreign/Iranian), Series (Foreign/Iranian)
- **Genres:** Action, Drama, Comedy, etc. (within each category)
- **Special Collections:** Animation, Anime, Dubbed
- **Other:** Coming Soon, Collections, Kids

Each path is:
- ✅ Bookmarkable
- ✅ Shareable
- ✅ SEO optimized
- ✅ Bilingual
- ✅ Mobile friendly
