# 🎬 Premium Liquid Glass Item Detail Page - Implementation Guide

## Overview

The item detail page (`/item/[id]`) has been completely refactored to follow the **Premium Liquid Glass** design system with full Persian (RTL) support and modular components.

---

## 📁 File Structure

```
frontend/src/
├── app/item/[id]/
│   └── page.tsx                          # Main page component
├── components/media/
│   ├── ItemHeader.tsx                    # A. Details Header
│   ├── SeasonsEpisodes.tsx              # B. Season & Episodes (Series)
│   ├── SynopsisAbout.tsx                # C. Synopsis & About
│   ├── SimilarContent.tsx               # D. Similar Content Carousel
│   └── Comments.tsx                     # E. Comments Section
```

---

## 🎨 Design System Components

### A. Item Header (`ItemHeader.tsx`)

**Features:**
- **Persian title** (large, RTL, bold)
- **English title/year** badge with glass-morphism
- **Season/episode info** (for series)
- **Genre badges** with interactive hover effects
- **Metadata row**: Year | Age rating | Country | Duration
- **Rating section**:
  - Score display with star icon
  - Circular progress bar for satisfaction percentage
- **Cast & Director** information
- **Action buttons**:
  - Play/Watch Now (gold gradient)
  - Like/Dislike (glass icons)
  - Share (glass icon)
  - Bookmark (glass icon)

**Glass Effects:**
- Gradient background overlay
- Frosted glass badges
- Liquid hover animations on buttons
- Gold glow on interactive elements

---

### B. Seasons & Episodes (`SeasonsEpisodes.tsx`)

**Features:**
- **Glass accordion** for season selection
- Expandable season selector
- **Episode grid** (responsive: 1 col mobile, 2 cols tablet, 3 cols desktop)
- Each episode card includes:
  - Thumbnail with lazy loading
  - Episode number and title
  - Duration
  - Synopsis (truncated)
  - Play overlay on hover with liquid animation
  
**Glass Effects:**
- Frosted glass accordion panels
- Border highlights on expansion
- Smooth liquid transitions
- Play button with gold gradient and scale animation

**Persian Support:**
- RTL text direction
- Persian numbers for episode counts
- Persian labels ("قسمت", "فصل")

---

### C. Synopsis & About (`SynopsisAbout.tsx`)

**Features:**
1. **Synopsis Section** ("داستان سریال/فیلم"):
   - Long text with gradient fade-out
   - "Read more" toggle button
   - Smooth expand/collapse animation

2. **About Section** ("درباره سریال/فیلم"):
   - Production info panel (Year, Country, Genre, Duration)
   - Languages panel with glass chips
   - Extended information (collapsible)

**Glass Effects:**
- Glass-morphism panels
- Gradient text fade
- Smooth transitions on expand/collapse
- Info cards with subtle borders

**Persian Support:**
- Full RTL layout
- Persian labels for all metadata
- Persian language names ("فارسی", "انگلیسی")

---

### D. Similar Content (`SimilarContent.tsx`)

**Features:**
- Horizontal scrollable carousel
- Glass-morphism cards with:
  - Poster image
  - Title (truncated)
  - Rating with star icon
  - Year and genre
  - Quick action play button (appears on hover)

**Glass Effects:**
- Frosted glass cards
- Liquid lift animation on hover
- Gold glow shadow
- Play button with scale animation
- Custom scrollbar with glass styling

**Interactions:**
- Smooth horizontal scroll
- Click to navigate to item
- Hover reveals play button

---

### E. Comments Section (`Comments.tsx`)

**Features:**
- Comment input box with glass styling
- Sorting options (Newest/Top)
- Nested comment threads
- Each comment includes:
  - User avatar with glass border
  - Author name and timestamp
  - Comment content
  - Like button with counter
  - Reply button (top-level only)
  
**Glass Effects:**
- Frosted glass input field
- Glass-bordered avatars
- Nested replies with lighter glass effect
- Like button with color transition

**Persian Support:**
- RTL text alignment
- Persian sorting labels ("جدیدترین", "محبوب‌ترین")
- Persian timestamps
- RTL comment layout

**State Management:**
- Optimistic updates for likes
- Comment submission handling
- Sort state management

---

## 🎯 Main Page Component (`page.tsx`)

### Features

1. **Dynamic Content Type Detection**:
   - Automatically detects Movie vs Series
   - Conditionally renders Series-only sections
   - Falls back to API if not in mock data

2. **Loading States**:
   - Centered loading spinner with gold color
   - Full-page loading overlay

3. **Error Handling**:
   - Glass-styled error alerts
   - Retry button
   - User-friendly error messages

4. **RTL Breadcrumbs**:
   - Persian navigation labels
   - Glass-styled back button

5. **Modular Architecture**:
   - Each section is a separate component
   - Easy to maintain and extend
   - Reusable across the app

### Data Flow

```typescript
1. Fetch from mock data (movies/series) OR API
2. Detect content type (Movie | Series)
3. Render header (all types)
4. Render seasons (series only)
5. Render synopsis/about
6. Fetch & render similar content
7. Render comments
```

---

## 🎨 Design Tokens Used

### Colors
```typescript
glassColors.persianGold     // #F59E0B - Accent
glassColors.text.primary    // #FFFFFF - Main text
glassColors.text.secondary  // rgba(255,255,255,0.7)
glassColors.text.tertiary   // rgba(255,255,255,0.5)
glassColors.text.muted      // rgba(255,255,255,0.3)
glassColors.glass.border    // rgba(255,255,255,0.1)
glassColors.gold.light      // #F59E0B40
glassColors.gold.glow       // #F59E0B30
```

### Border Radius
```typescript
glassBorderRadius.sm   // 8px
glassBorderRadius.md   // 12px
glassBorderRadius.lg   // 16px
glassBorderRadius.pill // 9999px
```

### Animations
```typescript
glassAnimations.transition.smooth      // cubic-bezier(0.4, 0, 0.2, 1)
glassAnimations.transition.spring      // cubic-bezier(0.34, 1.56, 0.64, 1)
glassAnimations.transition.springFast  // cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Glass Effects
```typescript
glassBlur.light   // blur(8px)
glassBlur.medium  // blur(20px)
glassBlur.strong  // blur(40px)
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** (xs): Single column, stacked layout
- **Tablet** (sm): 2-column grids, reduced spacing
- **Desktop** (md+): 3-column grids, full spacing

### Key Responsive Elements
1. Episode grid: 1/2/3 columns
2. Rating cards: Vertical/horizontal stack
3. Action buttons: Wrap on mobile
4. Typography: Smaller sizes on mobile
5. Padding: Reduced on mobile (3/4)

---

## 🔧 API Integration

### Expected API Response

```typescript
// GET /api/content/:id
{
  id: string;
  title: string;
  description: string;
  year: number;
  rating: number;
  poster: string;
  backdrop: string;
  genres: string[];
  languages: string[];
  cast: {
    id: string;
    name: string;
    role: "actor" | "director" | "writer";
  }[];
  origin: "iranian" | "foreign";
  
  // Movie-specific
  duration?: number;
  sources?: StreamSource[];
  downloads?: DownloadLink[];
  subtitles?: SubtitleTrack[];
  
  // Series-specific
  seasons?: {
    id: string;
    title: string;
    seasonNumber: number;
    episodes: {
      id: string;
      title: string;
      synopsis: string;
      duration: number;
      thumbnail: string;
      releaseDate: string;
    }[];
  }[];
  ongoing?: boolean;
}
```

### Fallback Strategy
1. Try mock data first (development)
2. Fall back to `/api/content/:id` if not found
3. Auto-detect type based on response structure
4. Show error if all fail

---

## ✨ Key Features

### 1. **Full RTL Support**
- All text direction: RTL
- Persian number formatting
- Proper text alignment
- Icon positioning for RTL

### 2. **Premium Glass Morphism**
- Backdrop blur effects
- Translucent backgrounds
- Gradient borders
- Layered glass panels

### 3. **Liquid Animations**
- Spring easing functions
- Scale on hover
- Smooth transitions
- Gold glow effects

### 4. **Performance Optimizations**
- Lazy loading for images
- Smooth scrolling
- GPU-accelerated animations
- Optimized re-renders

### 5. **Accessibility**
- ARIA labels
- Keyboard navigation
- Focus states
- Semantic HTML

---

## 🚀 Usage Examples

### Navigate to an item
```typescript
// For movies
<Link href="/item/movie-1">View Movie</Link>

// For series
<Link href="/item/series-1">View Series</Link>
```

### Fetch custom data
```typescript
// In page.tsx, replace mock data with:
const res = await fetch(`/api/content/${id}`);
const data = await res.json();
```

### Customize similar content
```typescript
// In page.tsx, modify the filter:
const similarContent = type === "movie"
  ? movies.filter(m => m.genres.some(g => data.genres.includes(g)))
  : series.filter(s => s.genres.some(g => data.genres.includes(g)));
```

---

## 🎯 Future Enhancements

1. **Video Player Integration**
   - Embed player in header
   - Auto-play on click
   - Progress tracking

2. **User Interactions**
   - Real like/dislike API
   - Bookmark persistence
   - Watch history tracking

3. **Advanced Features**
   - Download manager
   - Subtitle selector
   - Quality switcher
   - Share with timestamp

4. **SEO Optimization**
   - Meta tags
   - Open Graph
   - Structured data
   - Canonical URLs

---

## 📝 Notes

- Mock data uses `/images/` paths - replace with CDN URLs in production
- Comments are mock data - integrate with backend API
- Avatar images need to be added to `public/images/avatars/`
- All Persian text is hardcoded - consider i18n for multi-language

---

## 🐛 Known Issues

None at this time. All components are error-free and follow TypeScript best practices.

---

## 📚 Related Documentation

- [Design System Guide](../DESIGN_SYSTEM_GUIDE.md)
- [Glass Design System](../../theme/glass-design-system.ts)
- [Media Types](../../types/media.ts)
- [Mock Content Data](../../data/mockContent.ts)

---

**Implementation Date**: December 18, 2025
**Design System**: Premium Liquid Glass v1.0
**Persian Support**: Full RTL
**Responsive**: Mobile-first
