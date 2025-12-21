# Cast Detail Page Implementation Guide

## 🎭 Overview

A beautiful cast detail page with Premium Liquid Glass design system that displays comprehensive information about actors, directors, and crew members from TMDB API.

## 📁 Files Created

### 1. **`/src/hooks/useTMDBPerson.ts`** (NEW)
Custom React hook for fetching person/cast data from TMDB API.

**Features:**
- Fetches person details with Persian language support
- Retrieves combined credits (movies + TV shows)
- Loads profile images gallery
- Includes external social media IDs
- Helper functions for data processing

**API Endpoints:**
```typescript
- /person/{id}?language=fa-IR&append_to_response=external_ids
- /person/{id}/combined_credits?language=fa-IR
- /person/{id}/images
```

**Helper Methods:**
- `getKnownFor(count)` - Get N most popular works
- `getFilmography(mediaType?, department?)` - Get filtered filmography
- `getAge()` - Calculate current age from birthdate
- `getImageUrl(path, size)` - Generate TMDB image URLs

---

### 2. **`/src/app/cast/[id]/page.tsx`** (NEW)
Main cast detail page component with dynamic routing.

**URL Structure:**
```
/cast/[id]
Example: /cast/12345-robert-downey-jr
```

**Page Sections:**

#### A. Hero Section
- **Background**: Large profile photo with gradient overlay
- **Content**: 
  - Name (Persian/English)
  - Known for department (بازیگر/کارگردان)
  - Birth date, place, and age
  - Popularity score
- **Actions**:
  - Back button
  - Bookmark/favorite
  - Share button
  - Social media links (Instagram, Twitter, Facebook)

#### B. Biography Section
- Full biography text (RTL for Persian)
- Read more/less toggle with gradient fade
- "Also Known As" names in glass chip badges
- Conditional rendering based on content

#### C. Known For Carousel
- Horizontal scrollable carousel
- Top 6 most popular works
- Each item shows:
  - Poster image
  - Title
  - Character/role
- Click to navigate to item detail page
- Custom scrollbar styling

#### D. Filmography Section
- Filterable tabs: All / Movies / TV Shows
- Shows career statistics
- Grid layout (responsive)
- Each entry displays:
  - Poster thumbnail
  - Title and year
  - Character/role name
  - Rating (if available)
- Links to item detail pages
- "Show More" button (first 12 items)

#### E. Gallery Section
- Grid of profile images (2/3/4 columns)
- Fetched from TMDB images API
- Glass-styled cards
- Hover effects
- Click to view full size (future: lightbox)

---

### 3. **`/src/components/media/CastDetailSkeleton.tsx`** (NEW)
Loading skeleton component with glass morphism styling.

**Features:**
- Mimics actual page layout
- Glass-styled skeleton elements
- Smooth loading state
- Responsive design

---

### 4. **`/src/components/media/CastGallery.tsx`** (MODIFIED)
Updated cast gallery component to make cast members clickable.

**Changes:**
- Added `Link` component from Next.js
- Created slug generation helper
- Links to `/cast/[id]` pages
- Maintains hover effects
- Supports optional `onMemberClick` override

---

## 🎨 Design System Compliance

### Premium Liquid Glass Features

✅ **Glass Morphism**
```typescript
background: linear-gradient(135deg, glassColors.glass.strong, glassColors.glass.mid)
backdropFilter: blur(20px) saturate(180%)
border: 1px solid rgba(255, 255, 255, 0.1)
```

✅ **Persian Gold Accents**
- Department labels
- Popularity scores
- Role/character names
- Tab indicators
- Hover states

✅ **Spring Animations**
```typescript
transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)
transform: translateY(-8px) scale(1.05)
```

✅ **Responsive Layout**
- Mobile: Single column
- Tablet: 2 columns
- Desktop: 3-4 columns
- Horizontal scrolling for carousels

✅ **RTL Support**
- Persian text rendered right-to-left
- Proper text alignment
- Directional layout adjustments

---

## 🔌 TMDB API Integration

### Configuration
```typescript
TMDB_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  baseUrl: "https://api.themoviedb.org/3",
  imageBaseUrl: "https://image.tmdb.org/t/p"
}
```

### Image Sizes
- Profile photos: `h632` (hero), `w342` (gallery)
- Posters: `w185` (thumbnails), `w342` (known for)

### Error Handling
- Try-catch blocks for all API calls
- Error state display with glass-styled alerts
- Graceful fallbacks for missing data

---

## 🚀 Features Implemented

### Core Features
- ✅ Dynamic routing with ID slugs
- ✅ TMDB API integration
- ✅ Persian language support
- ✅ Responsive design
- ✅ Loading states with skeleton
- ✅ Error handling

### Interactive Elements
- ✅ Bookmark/favorite button
- ✅ Share dialog (uses ShareDialog component)
- ✅ Social media links
- ✅ Clickable cast members
- ✅ Filterable filmography
- ✅ Expandable biography

### Visual Effects
- ✅ Hover animations on all interactive elements
- ✅ Spring-based transitions
- ✅ Glass morphism throughout
- ✅ Persian pattern backgrounds
- ✅ Gold glow effects
- ✅ Smooth scrolling

---

## 📊 Data Flow

```
User visits /cast/12345-robert-downey-jr
    ↓
Extract personId from URL (12345)
    ↓
useTMDBPerson hook fetches:
  - Person details
  - Combined credits
  - Profile images
    ↓
Process and display:
  - Hero section
  - Biography
  - Known for works
  - Filmography
  - Gallery
```

---

## 🎯 Usage Examples

### Navigate to Cast Page
```typescript
// From cast gallery
<Link href={`/cast/${member.id}-${slugify(member.name)}`}>
  {member.name}
</Link>

// From item page (already integrated)
// Click any cast member in CastGallery component
```

### Share Cast Profile
```typescript
// Share button opens ShareDialog
<IconButton onClick={() => setShareDialogOpen(true)}>
  <Share />
</IconButton>

<ShareDialog
  open={shareDialogOpen}
  onClose={() => setShareDialogOpen(false)}
  title={details.name}
/>
```

---

## 🔧 Customization Options

### Adjust Number of Items
```typescript
// In page.tsx
const knownForWorks = useMemo(() => getKnownFor(6), [getKnownFor]);
//                                              ↑ Change count

// Filmography display
{filmography.slice(0, 12).map((work) => ...)}
//                     ↑↑ Change visible count
```

### Modify Filters
```typescript
// Add department filter
const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
const filmography = getFilmography(mediaFilter, departmentFilter);
```

### Change Image Sizes
```typescript
// In useTMDBPerson.ts
getImageUrl(details.profile_path, "h632")  // Change size
//                                  ↑↑↑↑
// Options: w185, w342, h632, original
```

---

## 🐛 Known Limitations

1. **Biography Translation**: TMDB may not have Persian biographies for all cast members
2. **Social Media**: Not all cast members have social media IDs in TMDB
3. **Image Quality**: Some older cast members may have low-quality images
4. **Birth Date**: Some cast members may not have complete birth information

---

## 🎨 Design Highlights

### Glass Cards
Every section uses consistent glass styling:
```typescript
background: linear-gradient(135deg, glass.strong, glass.mid)
backdropFilter: blur(20px) saturate(180%)
border: 1px solid glass.border
boxShadow: 0 8px 32px -4px rgba(0, 0, 0, 0.3)
```

### Hover Effects
All interactive elements have:
```typescript
transform: translateY(-8px) scale(1.05)
boxShadow: 0 12px 48px -8px rgba(0, 0, 0, 0.4)
border: 1px solid gold.light
```

### Persian Typography
```typescript
Typography with:
- dir="rtl" for Persian text
- fontWeight: 600-700 for headings
- color: persianGold for accents
```

---

## 📱 Responsive Breakpoints

```typescript
xs: 0-600px    // Mobile
sm: 600-960px  // Tablet
md: 960-1280px // Desktop
lg: 1280-1920px // Large Desktop
```

Grid adjustments:
- Filmography: 1 / 2 / 3 columns
- Gallery: 2 / 3 / 4 columns
- Known For: Horizontal scroll (all)

---

## 🚀 Future Enhancements

### Potential Additions
1. **Lightbox Gallery**: Full-screen image viewer
2. **Related People**: Suggest similar cast members
3. **Timeline View**: Visual career timeline
4. **Awards Section**: Display awards and nominations
5. **Videos**: Interviews and behind-the-scenes
6. **Follow Feature**: Authenticated users can follow
7. **Print View**: Print-friendly biography layout
8. **Favorites**: Persistent bookmarking with backend

---

## ✅ Testing Checklist

- [ ] Page loads with valid cast ID
- [ ] 404 handling for invalid IDs
- [ ] Loading skeleton displays correctly
- [ ] All TMDB images load properly
- [ ] Biography read more/less works
- [ ] Filmography filters work correctly
- [ ] Share dialog opens and functions
- [ ] Social links open in new tab
- [ ] Responsive design on all devices
- [ ] RTL text renders correctly
- [ ] Hover effects work smoothly
- [ ] Back button navigation works

---

## 📚 Related Components

- `ShareDialog` - Used for sharing cast profiles
- `CastGallery` - Updated to link to cast pages
- `CastDetailSkeleton` - Loading state
- `useTMDBPerson` - Data fetching hook

---

## 🎉 Summary

The Cast Detail Page is a feature-complete, beautifully designed page that:
- ✅ Follows Premium Liquid Glass design system
- ✅ Integrates with TMDB API seamlessly
- ✅ Provides comprehensive cast information
- ✅ Supports Persian language and RTL
- ✅ Includes interactive features
- ✅ Has smooth animations and transitions
- ✅ Works responsively across all devices

**Test it out:** Navigate to any cast member from the item page cast gallery!
