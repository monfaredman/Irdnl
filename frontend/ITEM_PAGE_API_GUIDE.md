# Item Page API Integration - Quick Guide

## ✅ What I Fixed

### Issue
- You were accessing `/item/114868` (TMDB numeric ID)
- Backend API was returning 404 at `/api/content/114868`

### Root Causes
1. API endpoint mismatch: Page was calling `/api/content/[id]` which didn't exist
2. ID format mismatch: Backend uses **UUIDs**, not TMDB numeric IDs
3. Data structure mismatch: Backend response didn't match `Movie | Series` types

### Solutions Implemented
1. ✅ Created `/api/content/[id]/route.ts` API endpoint
2. ✅ Added data transformation to convert backend format → `Movie | Series`
3. ✅ Fallback logic: Mock data first, then backend API

---

## 🎯 How to Use

### Option 1: Mock Data (Recommended for Testing)
Navigate to these URLs to use mock data:

```
Movies:
/item/movie-1
/item/movie-2
/item/movie-3
...up to movie-10

Series:
/item/series-1
/item/series-2
/item/series-3
```

### Option 2: Backend API (Real Data)
Navigate to these UUIDs from your backend:

```
Series:
/item/b42dad12-39d2-4ae0-ac77-78b28c064d22  (Shadows of Isfahan)

Movies:
/item/25b1357e-b515-45f5-b8b6-ce5024a3e8f7  (The Last Caravan)
/item/6884ab6a-6832-4863-8f1c-7e1d317b20f6  (Persian Dreams)
/item/7c5b8a81-ac2c-43bb-932d-4d6060597b13  (Tehran Nights)
/item/0e6f6d77-cca9-43dc-960e-19a342913cad  (Midnight Silk)
/item/d8279c6e-2d92-4900-89c5-2356d376e296  (Desert Sonata)
```

---

## 📊 Backend Content Available

Run this to see all available content:
```bash
curl -s http://localhost:3001/api/content | jq '.items[] | {id, title, type}'
```

Output:
```json
{
  "id": "b42dad12-39d2-4ae0-ac77-78b28c064d22",
  "title": "Shadows of Isfahan",
  "type": "series"
}
{
  "id": "25b1357e-b515-45f5-b8b6-ce5024a3e8f7",
  "title": "The Last Caravan",
  "type": "movie"
}
...
```

---

## 🔄 Data Flow

### Mock Data Flow
```
User visits /item/movie-1
  ↓
Page loads
  ↓
fetchItem() checks movies array
  ↓
Found! Sets data and renders
```

### Backend API Flow
```
User visits /item/b42dad12-39d2-4ae0-ac77-78b28c064d22
  ↓
Page loads
  ↓
fetchItem() checks mock arrays (not found)
  ↓
Calls /api/content/b42dad12-39d2-4ae0-ac77-78b28c064d22
  ↓
API route calls backend at localhost:3001/api/content/:id
  ↓
Transforms backend response to Movie/Series format
  ↓
Returns to page, sets data and renders
```

---

## 🛠️ Transformation Logic

### Backend Response
```json
{
  "id": "d8279c6e-2d92-4900-89c5-2356d376e296",
  "title": "Desert Sonata",
  "type": "movie",
  "year": 2023,
  "description": "A captivating story...",
  "posterUrl": "/images/movies/desert-sonata.svg",
  "bannerUrl": "/images/movies/desert-sonata-wide.svg",
  "rating": "8.5",
  "videoAssets": [...]
}
```

### Transformed to Movie
```typescript
{
  id: "d8279c6e-2d92-4900-89c5-2356d376e296",
  slug: "d8279c6e-2d92-4900-89c5-2356d376e296",
  title: "Desert Sonata",
  description: "A captivating story...",
  year: 2023,
  poster: "/images/movies/desert-sonata.svg",
  backdrop: "/images/movies/desert-sonata-wide.svg",
  rating: 8.5,
  genres: [],
  languages: ["fa"],
  cast: [],
  tags: [],
  origin: "iranian",
  duration: 3600, // from videoAssets[0].duration
  sources: [],
  downloads: [],
  subtitles: [],
  featured: false
}
```

---

## ⚠️ Known Limitations

### Current Backend Data Gaps
1. **No genres** - Backend doesn't return genre information yet
2. **No cast** - Cast/crew data not included in backend response
3. **No seasons/episodes** - Series endpoint doesn't include full season structure
4. **No similar content** - Similar recommendations not available
5. **No comments** - Comments system not integrated

### Workarounds in Place
- Empty arrays for missing fields
- Components handle empty arrays gracefully
- Mock data used for "similar content" section
- Mock comments generated client-side

---

## 🚀 Testing Checklist

- [ ] Test with mock movie: `/item/movie-1`
- [ ] Test with mock series: `/item/series-1`
- [ ] Test with backend UUID: `/item/b42dad12-39d2-4ae0-ac77-78b28c064d22`
- [ ] Verify all 5 sections render
- [ ] Check responsive behavior on mobile
- [ ] Verify RTL layout for Persian content
- [ ] Test error handling with invalid ID: `/item/invalid-id-12345`

---

## 📝 Next Steps

### Short-term
1. Add genre mapping from backend
2. Add cast/crew data to backend response
3. Implement seasons/episodes endpoint for series
4. Add error boundary for better error UX

### Long-term
1. Implement similar content recommendation algorithm
2. Build real comments system with backend
3. Add user authentication for likes/bookmarks
4. Implement video player integration
5. Add download manager

---

## 🐛 Troubleshooting

### Error: "Content not found: 404"
**Cause**: Invalid ID or backend doesn't have that content  
**Solution**: Use one of the valid IDs listed above

### Error: "Failed to fetch content"
**Cause**: Backend is not running  
**Solution**: 
```bash
cd backend
npm run dev
```

### Error: Blank page or missing sections
**Cause**: Data transformation issue  
**Solution**: Check browser console for errors, verify backend response structure

### Genres/Cast showing empty
**Cause**: Backend doesn't provide this data yet  
**Status**: Expected limitation, will be fixed when backend adds these fields

---

## 📚 Related Files

### Frontend
- `/src/app/item/[id]/page.tsx` - Main item detail page
- `/src/app/api/content/[id]/route.ts` - API proxy with transformation
- `/src/components/media/*` - UI components
- `/src/data/mockContent.ts` - Mock data for development
- `/src/types/media.ts` - TypeScript types

### Backend
- `/backend/src/modules/content/content.controller.ts` - Content endpoints
- `/backend/src/modules/content/content.service.ts` - Business logic

---

**Last Updated**: December 18, 2025  
**Status**: ✅ Working (with mock data) | ⚠️ Partial (with backend API)
