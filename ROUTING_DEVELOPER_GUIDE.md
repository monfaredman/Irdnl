# Developer Guide: Routing System Maintenance

## Adding New Routes

### Adding a New Genre

**Example: Adding "Western" genre to foreign movies**

1. **No code changes needed!** The dynamic route handles new genres automatically.

2. **Just add genre data:**
   ```typescript
   // In your content filtering/fetching logic
   const movie = {
     // ... other properties
     genres: ["action", "western"], // Add new genre
   };
   ```

3. **Update genre mapping (optional):**
   ```typescript
   // In src/lib/metadata.ts
   const genreMetadata: Record<string, { en: string; fa: string }> = {
     // ... existing genres
     western: { en: "Western", fa: "وسترن" }, // Add translation
   };
   ```

4. **Add to navigation (if showing in menu):**
   ```typescript
   // In src/components/layout/PremiumLiquidGlassHeader.tsx
   {
     label: "Foreign Movies",
     submenu: [
       // ... existing
       { label: "Western", labelFa: "وسترن", href: "/movies/foreign/western" },
     ],
   }
   ```

### Adding a New Main Category

**Example: Adding "Documentaries" as a main category**

1. **Create the page:**
   ```bash
   mkdir -p src/app/documentaries
   touch src/app/documentaries/page.tsx
   ```

2. **Implement the page component:**
   ```tsx
   // src/app/documentaries/page.tsx
   "use client";
   
   import { Box, Container, Stack, Typography } from "@mui/material";
   import { MediaCard } from "@/components/media/MediaCard";
   import { useLanguage } from "@/providers/language-provider";
   
   export default function DocumentariesPage() {
     const { language } = useLanguage();
     // ... filtering logic
   }
   ```

3. **Add translation keys:**
   ```typescript
   // src/providers/language-provider.tsx
   const dictionary: Dictionary = {
     en: {
       // ... existing
       documentaries: "Documentaries",
     },
     fa: {
       // ... existing
       documentaries: "مستند",
     },
   };
   ```

4. **Add to navigation:**
   ```typescript
   // src/components/layout/PremiumLiquidGlassHeader.tsx
   const navItems: NavItem[] = [
     // ... existing items
     {
       label: "Documentaries",
       labelFa: "مستند",
       href: "/documentaries",
       icon: <MovieIcon />,
     },
   ];
   ```

5. **Add metadata:**
   ```typescript
   // src/lib/metadata.ts
   export const routeMetadata: Record<string, RouteMetadata> = {
     // ... existing
     "/documentaries": {
       title: { en: "Documentaries", fa: "مستند" },
       description: {
         en: "Documentary films and series",
         fa: "فیلم‌ها و سریال‌های مستند",
       },
     },
   };
   ```

6. **Add redirect (if needed):**
   ```typescript
   // next.config.ts
   async redirects() {
     return [
       // ... existing redirects
       {
         source: "/docs", // old URL
         destination: "/documentaries",
         permanent: true,
       },
     ];
   }
   ```

## Modifying Existing Routes

### Changing a Route Path

**Example: Changing `/category/kids` to `/kids-zone`**

1. **Move/rename the directory:**
   ```bash
   mv src/app/category/kids src/app/kids-zone
   ```

2. **Add redirect in next.config.ts:**
   ```typescript
   {
     source: "/category/kids",
     destination: "/kids-zone",
     permanent: true,
   }
   ```

3. **Update all references:**
   - Search for `/category/kids` in codebase
   - Replace with `/kids-zone`
   - Update navigation links
   - Update footer links

4. **Update metadata:**
   ```typescript
   // src/lib/metadata.ts
   "/kids-zone": { // Change key
     title: { en: "Kids Zone", fa: "کودکان" },
     // ...
   },
   ```

### Adding Submenus to Existing Routes

**Example: Add genres to Animation category**

1. **Create dynamic route:**
   ```bash
   mkdir -p src/app/animation/[genre]
   touch src/app/animation/[genre]/page.tsx
   ```

2. **Implement dynamic page:**
   ```tsx
   // src/app/animation/[genre]/page.tsx
   "use client";
   
   import { useParams } from "next/navigation";
   
   export default function AnimationGenrePage() {
     const params = useParams();
     const genre = params.genre as string;
     // ... implementation
   }
   ```

3. **Update navigation:**
   ```typescript
   {
     label: "Animation",
     labelFa: "انیمیشن",
     href: "/animation",
     icon: <Category />,
     submenu: [ // Add submenu
       { label: "3D", labelFa: "سه‌بعدی", href: "/animation/3d" },
       { label: "2D", labelFa: "دوبعدی", href: "/animation/2d" },
     ],
   }
   ```

## Common Patterns

### 1. Filtering Content by Route

```typescript
// In any page component
"use client";

import { useParams, usePathname } from "next/navigation";

export default function GenrePage() {
  const params = useParams();
  const pathname = usePathname();
  
  // Get route segments
  const segments = pathname.split('/').filter(Boolean);
  // e.g., ['movies', 'foreign', 'action']
  
  const origin = segments[1]; // 'foreign' or 'iranian'
  const genre = params.genre as string; // 'action'
  
  // Filter content
  const filtered = content.filter(item => 
    item.origin === origin && 
    item.genres?.some(g => g.toLowerCase() === genre)
  );
}
```

### 2. Breadcrumb Generation

```typescript
// Create a breadcrumb component
export function Breadcrumbs() {
  const pathname = usePathname();
  const { language } = useLanguage();
  
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const label = getSegmentLabel(segment, language);
    return { path, label };
  });
  
  return (
    <nav>
      {breadcrumbs.map((crumb, i) => (
        <Link key={i} href={crumb.path}>{crumb.label}</Link>
      ))}
    </nav>
  );
}
```

### 3. Dynamic Metadata

```typescript
// In any page.tsx
import { generateMetadata as genMeta } from '@/lib/metadata';

export async function generateMetadata({ params }: Props) {
  const path = `/movies/foreign/${params.genre}`;
  return genMeta(path, 'fa');
}
```

## Testing New Routes

### 1. Manual Testing Checklist

```bash
# Test navigation
✓ Click through from header menu
✓ Click through from footer links
✓ Direct URL access
✓ Refresh page (should not 404)

# Test language switching
✓ Switch EN → FA on page
✓ Switch FA → EN on page
✓ Check translations render correctly

# Test responsiveness
✓ Desktop view
✓ Tablet view
✓ Mobile view
✓ Mobile menu/drawer

# Test redirects
✓ Old URL → New URL
✓ Verify redirect type (301/302)
```

### 2. Automated Testing (Example)

```typescript
// __tests__/routes.test.tsx
describe('Route Structure', () => {
  it('should load foreign movies page', async () => {
    const response = await fetch('http://localhost:3000/movies/foreign');
    expect(response.status).toBe(200);
  });
  
  it('should redirect old route', async () => {
    const response = await fetch('http://localhost:3000/movies?origin=foreign', {
      redirect: 'manual'
    });
    expect(response.status).toBe(307); // Temporary redirect
    expect(response.headers.get('location')).toBe('/movies/foreign');
  });
});
```

## Performance Optimization

### 1. Route Prefetching

Next.js automatically prefetches routes, but you can control it:

```tsx
import Link from 'next/link';

// Disable prefetch for low-priority links
<Link href="/category/collections" prefetch={false}>
  Collections
</Link>

// Enable for high-priority
<Link href="/movies/foreign" prefetch={true}>
  Foreign Movies
</Link>
```

### 2. Dynamic Imports

For heavy genre pages:

```typescript
import dynamic from 'next/dynamic';

const MediaCard = dynamic(() => import('@/components/media/MediaCard'), {
  loading: () => <Skeleton />,
});
```

### 3. Data Fetching

Use proper data fetching patterns:

```typescript
// Static generation for genre pages
export async function generateStaticParams() {
  const genres = ['action', 'drama', 'comedy'];
  return genres.map(genre => ({ genre }));
}

// Or use ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour
```

## Debugging

### Common Issues

**1. 404 on New Route**
```bash
# Check file exists
ls src/app/movies/foreign/page.tsx

# Check for typos in folder names
# Clear Next.js cache
rm -rf .next
npm run dev
```

**2. Redirect Loop**
```typescript
// Check next.config.ts for conflicting redirects
// Ensure source and destination are different
{
  source: "/movies",
  destination: "/movies/foreign", // ✓ Different
  permanent: false,
}
```

**3. Translations Not Showing**
```typescript
// Verify translation key exists
const dictionary = {
  en: { foreignMovies: "Foreign Movies" }, // ✓ Key defined
  fa: { foreignMovies: "فیلم خارجی" },    // ✓ Both languages
};

// Use correct key
const { t } = useLanguage();
t('foreignMovies'); // ✓ Correct
```

**4. Genre Filter Not Working**
```typescript
// Check property name (genres vs genre)
movie.genres?.some(g => g === genre) // ✓ Array method
// NOT: movie.genre === genre // ✗ Wrong property
```

## Best Practices

### 1. Route Naming
- ✅ Use lowercase with hyphens: `/coming-soon`
- ✅ Use consistent naming: `/movies/foreign` and `/series/foreign`
- ❌ Avoid: `/ComingSoon`, `/Movies-Foreign`

### 2. Folder Structure
```
src/app/
├── movies/
│   ├── foreign/
│   │   ├── page.tsx        # List page
│   │   └── [genre]/
│   │       └── page.tsx    # Dynamic genre page
│   └── iranian/
│       ├── page.tsx
│       └── [genre]/
│           └── page.tsx
```

### 3. Component Organization
- Keep page components simple
- Extract complex logic to hooks
- Share filtering logic across similar pages
- Use consistent layouts

### 4. SEO
- Always provide metadata
- Use semantic HTML
- Include structured data
- Optimize for Persian search engines

## Monitoring

### Track Route Performance

```typescript
// Add analytics to track popular routes
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function useRouteTracking() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Send to analytics
    trackPageView(pathname);
  }, [pathname]);
}
```

### Monitor Redirects

Check server logs for:
- Redirect frequency
- 404 errors on old routes
- Slow routes that might need caching

## Documentation

### Keep Updated
1. Update this guide when adding routes
2. Document why changes were made
3. Add examples for complex patterns
4. Include migration notes for breaking changes

---

**Last Updated:** December 18, 2025
**Maintainers:** Development Team
**Version:** 1.0
