# Backend-Frontend Data Synchronization Implementation

## Overview
This document summarizes the implementation of dynamic data fetching from backend to ensure all frontend pages (categories, genres, sliders, offers, casts) are synchronized with the panel/admin data.

## ✅ Completed Components

### 1. Backend Public API (`/backend/src/modules/public/`)

Created a new **PublicModule** with public endpoints that don't require authentication:

#### **PublicController** (`public.controller.ts`)
- `GET /public/categories` - List all active categories
- `GET /public/categories/:slug` - Get category by slug
- `GET /public/genres` - List all active genres (optional `categorySlug` filter)
- `GET /public/genres/:slug` - Get genre by slug
- `GET /public/sliders` - List active sliders (optional `section` filter)
- `GET /public/offers` - List active offers
- `GET /public/pins` - List active pins (optional `section` filter)

#### **PublicService** (`public.service.ts`)
Features:
- Returns only `isActive: true` items
- Filters sliders/offers by date range (`startDate`/`endDate`)
- Supports category filtering for genres using JSON contains query
- Includes content relations where applicable
- Proper error handling with `NotFoundException`

#### **Module Registration**
- Added `PublicModule` to `AppModule`
- Uses TypeORM entities from `content` module
- No authentication guards (public access)

---

### 2. Frontend Public API Client (`/frontend/src/lib/api/public.ts`)

Created a dedicated API client for public data fetching:

#### **TypeScript Interfaces**
```typescript
- Category: Full category data with gradient colors, TMDB params, etc.
- Genre: Genre data with category slugs association
- Slider: Slider data with content relations
- Offer: Offer data with discount info
- Pin: Pin data for featured content
- ListResponse<T>: Generic list response with data array and total count
```

#### **API Methods**
```typescript
categoriesApi.list() → ListResponse<Category>
categoriesApi.getBySlug(slug) → Category

genresApi.list(categorySlug?) → ListResponse<Genre>
genresApi.getBySlug(slug) → Genre

slidersApi.list(section?) → ListResponse<Slider>
offersApi.list() → ListResponse<Offer>
pinsApi.list(section?) → ListResponse<Pin>
```

---

### 3. Dynamic Navigation Menu (`/frontend/src/components/layout/PremiumLiquidGlassHeader.tsx`)

#### **Key Changes**
1. **Removed Hardcoded `navItems`** - Now built dynamically from backend
2. **Added State Management**:
   ```typescript
   const [navItems, setNavItems] = useState<NavItem[]>([]);
   const [navLoading, setNavLoading] = useState(true);
   ```

3. **Dynamic Fetching on Mount**:
   - Fetches categories and genres in parallel
   - Builds navigation structure from backend data
   - Maps categories to nav items with proper icons (Movie, Tv, Category)
   - Creates submenus from genre associations
   - Falls back to minimal navigation on error

4. **Icon Selection Logic**:
   ```typescript
   if (category.contentType === "movie") icon = <Movie />;
   else if (category.contentType === "series") icon = <Tv />;
   else icon = <Category />;
   ```

5. **Submenu Generation**:
   - Filters genres by `category.slug` in `genre.categorySlugs`
   - Creates href pattern: `/${category.slug}/${genre.slug}`
   - Only shows submenu if genres exist

---

## 🔄 In Progress / Next Steps

### 4. Add 404 Handling for Missing Categories/Genres

**Goal**: Update category/genre pages to verify data exists in backend before rendering

**Files to Update**:
- `/frontend/src/app/[category]/page.tsx` (dynamic category pages)
- `/frontend/src/app/[category]/[genre]/page.tsx` (dynamic genre pages)

**Implementation Plan**:
```typescript
// Example for category page
export default async function CategoryPage({ params }: { params: { category: string } }) {
  try {
    const category = await categoriesApi.getBySlug(params.category);
    // Render page with category data
  } catch (error) {
    notFound(); // Next.js 404 page
  }
}
```

---

### 5. Update Home Page to Fetch Sliders/Offers

**Files to Update**:
- `/frontend/src/app/page.tsx` (home page)
- Any components using hardcoded slider/offer data

**Implementation Plan**:
```typescript
const [sliders, setSliders] = useState<Slider[]>([]);
const [offers, setOffers] = useState<Offer[]>([]);

useEffect(() => {
  const fetchData = async () => {
    const [slidersRes, offersRes] = await Promise.all([
      slidersApi.list('hero'),
      offersApi.list(),
    ]);
    setSliders(slidersRes.data);
    setOffers(offersRes.data);
  };
  fetchData();
}, []);
```

---

## Database Seed Data

The backend already has seed data in migration `1700000000003-AddCategoryGenreSliderOfferPin.ts`:

### Categories (7 active):
1. `movies-foreign` - Foreign Movies (فیلم‌های خارجی)
2. `movies-iranian` - Iranian Movies (فیلم‌های ایرانی)
3. `series-foreign` - Foreign Series (سریال خارجی)
4. `series-iranian` - Iranian Series (سریال‌های ایرانی)
5. `animation` - Animation (انیمیشن)
6. `dubbed` - Persian Dubbed (دوبله فارسی)
7. `anime` - Anime (انیمه)

### Genres (22 active):
- action, comedy, drama, thriller, horror, sci-fi, romance, mystery, fantasy, etc.
- Each genre associated with relevant categories via `categorySlugs` JSON array

---

## Benefits of This Implementation

✅ **Single Source of Truth**: All data managed through admin panel
✅ **Real-time Sync**: Frontend automatically reflects admin changes
✅ **No Code Deployments**: Add/edit categories without touching code
✅ **SEO Friendly**: Can pre-render pages with backend data
✅ **Type Safety**: Full TypeScript support across stack
✅ **Graceful Degradation**: Fallback navigation if API fails
✅ **Performance**: Parallel data fetching, caching support
✅ **Scalability**: Easy to add new data types (casts, collections, etc.)

---

## Testing Checklist

- [x] Backend compiles successfully
- [x] Frontend compiles successfully
- [ ] Categories API returns active items only
- [ ] Genres API filters by category correctly
- [ ] Navigation menu renders with backend data
- [ ] Submenu items show correct genres per category
- [ ] Icons display correctly (Movie/Tv/Category)
- [ ] Persian/English labels show based on language
- [ ] 404 handling for invalid category/genre slugs
- [ ] Sliders filtered by section and date range
- [ ] Offers filtered by date range

---

## API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/public/categories` | GET | No | List active categories |
| `/public/categories/:slug` | GET | No | Get category details |
| `/public/genres` | GET | No | List active genres |
| `/public/genres/:slug` | GET | No | Get genre details |
| `/public/sliders` | GET | No | List active sliders |
| `/public/offers` | GET | No | List active offers |
| `/public/pins` | GET | No | List active pins |

---

## Data Flow

```
Admin Panel (CRUD)
    ↓
Database (categories, genres, sliders, offers, pins)
    ↓
Public API (/public/*)
    ↓
Frontend API Client (lib/api/public.ts)
    ↓
Components (Header, Pages, etc.)
    ↓
User Interface
```

---

## Next Actions

1. **Test Backend APIs** - Use Postman/curl to verify endpoints return correct data
2. **Implement 404 Handling** - Update category/genre pages with API validation
3. **Update Home Page** - Replace hardcoded sliders/offers with API calls
4. **Add Cast Pages** - If casts table exists, create similar public API
5. **Add Caching** - Implement Redis caching for frequently accessed data
6. **Add Error Boundaries** - Graceful error handling in React components

---

## Files Modified/Created

### Backend
- ✅ `/backend/src/modules/public/public.module.ts` (NEW)
- ✅ `/backend/src/modules/public/public.controller.ts` (NEW)
- ✅ `/backend/src/modules/public/public.service.ts` (NEW)
- ✅ `/backend/src/app.module.ts` (MODIFIED - added PublicModule)

### Frontend
- ✅ `/frontend/src/lib/api/public.ts` (NEW)
- ✅ `/frontend/src/components/layout/PremiumLiquidGlassHeader.tsx` (MODIFIED - dynamic navigation)

---

## Environment Variables

No new environment variables required. Uses existing:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

---

**Status**: 🟢 Core implementation complete, testing and integration in progress
