# Backend-Frontend Integration Guide

This guide explains how the Next.js frontend connects to the NestJS backend and integrates with TMDB API for content data.

## Architecture Overview

```
Frontend (Next.js) → Backend API (NestJS) → TMDB API
```

The frontend no longer calls TMDB directly. Instead:
1. Frontend makes requests to the NestJS backend
2. Backend fetches data from TMDB API
3. Backend transforms and caches the data
4. Backend returns formatted data to frontend

## Setup Instructions

### 1. Backend Environment Variables

Add the following to your backend `.env` file (or `.env.local`):

```env
# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Backend API Configuration
PORT=3001
API_PREFIX=api
FRONTEND_URL=http://localhost:3000
```

**To get a TMDB API key:**
1. Visit [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account or sign in
3. Go to **Settings** → **API**
4. Request an API key (choose "Developer" option)
5. Copy your **API Key (v3 auth)**

### 2. Frontend Environment Variables

Add the following to your frontend `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Note:** The frontend no longer needs `NEXT_PUBLIC_TMDB_API_KEY` since TMDB is accessed through the backend.

### 3. Start the Services

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The backend should be running on `http://localhost:3001` and the frontend on `http://localhost:3000`.

## API Endpoints

### Backend Content Endpoints

#### Database Content (from your database)
- `GET /api/content` - List content with pagination and filters
- `GET /api/content/:id` - Get content by ID
- `GET /api/content/trending` - Get trending content
- `GET /api/content/:id/episodes` - Get episodes for a series
- `GET /api/content/:id/stream` - Get streaming info

#### TMDB Content (via backend)
- `GET /api/content/tmdb/popular/movies?language=en&page=1` - Popular movies
- `GET /api/content/tmdb/trending/movies?language=en` - Trending movies
- `GET /api/content/tmdb/popular/tv?language=en&page=1` - Popular TV shows
- `GET /api/content/tmdb/search/movies?q=query&language=en` - Search movies
- `GET /api/content/tmdb/search/tv?q=query&language=en` - Search TV shows

## Frontend Usage

### Using the Hooks

The frontend provides React hooks that fetch data from the backend:

```tsx
import { 
  useBackendPopularMovies,
  useBackendTrendingMovies,
  useBackendPopularTVShows,
  useBackendCombinedContent 
} from "@/hooks/useBackendContent";
import { useLanguage } from "@/providers/language-provider";

function HomePage() {
  const { language } = useLanguage();
  
  const { data: movies, loading, error } = useBackendPopularMovies({ language });
  const { data: trending } = useBackendTrendingMovies({ language });
  const { data: series } = useBackendPopularTVShows({ language });
  const { data: combined } = useBackendCombinedContent({ language });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Render your content */}
    </div>
  );
}
```

### Available Hooks

- `useBackendPopularMovies(options)` - Popular movies from TMDB
- `useBackendTrendingMovies(options)` - Trending movies from TMDB
- `useBackendPopularTVShows(options)` - Popular TV shows from TMDB
- `useBackendSearchMovies(query, options)` - Search movies
- `useBackendSearchTVShows(query, options)` - Search TV shows
- `useBackendCombinedContent(options)` - Combined movies + TV shows
- `useBackendTrendingContent(options)` - Trending content from database

### Direct API Calls

You can also use the API client directly:

```tsx
import { contentApi } from "@/lib/api/content";

// Get popular movies
const movies = await contentApi.getPopularMovies('en', 1);

// Search movies
const results = await contentApi.searchMovies('batman', 'en');

// Get content from database
const content = await contentApi.getContent({ type: 'movie', page: 1 });
```

## Features

### Backend Benefits

1. **Security**: TMDB API key is stored server-side only
2. **Caching**: Backend caches TMDB responses (1 hour default)
3. **Rate Limiting**: Backend handles TMDB rate limits
4. **Data Transformation**: Backend transforms TMDB data to your format
5. **Error Handling**: Centralized error handling

### Frontend Benefits

1. **Type Safety**: Full TypeScript support
2. **Automatic Loading States**: Hooks manage loading/error states
3. **Language Support**: Built-in multi-language support (en/fa)
4. **Easy Integration**: Simple hook-based API

## Caching

The backend caches TMDB responses:
- **Popular/Trending content**: 1 hour (3600 seconds)
- **Search results**: 30 minutes (1800 seconds)
- Cache is stored in Redis (if available) or in-memory

## Error Handling

The backend handles:
- TMDB API errors (429 rate limits, 401 unauthorized, etc.)
- Network errors
- Missing API key configuration

Errors are returned to the frontend with appropriate HTTP status codes.

## Migration from Direct TMDB

If you were previously using direct TMDB hooks (`useTMDB*`), you can migrate by:

1. Replace `useTMDB*` hooks with `useBackend*` hooks
2. Remove `NEXT_PUBLIC_TMDB_API_KEY` from frontend `.env.local`
3. Add `TMDB_API_KEY` to backend `.env`
4. Add `NEXT_PUBLIC_API_URL` to frontend `.env.local`

The old TMDB hooks are still available but deprecated. The main page (`src/app/page.tsx`) has been updated to use the new backend hooks.

## Troubleshooting

### Backend not responding
- Check backend is running on port 3001
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check CORS settings in `backend/src/main.ts`

### TMDB errors
- Verify `TMDB_API_KEY` is set in backend `.env`
- Check API key is valid at [TMDB](https://www.themoviedb.org/settings/api)
- Check backend logs for detailed error messages

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check `app.enableCors()` configuration in `backend/src/main.ts`

## Next Steps

1. **Genre Mapping**: Map TMDB genre IDs to readable genre names
2. **Content Sync**: Sync TMDB content to your database
3. **Advanced Caching**: Implement more sophisticated caching strategies
4. **Rate Limiting**: Add rate limiting for frontend requests
5. **Authentication**: Add authentication for protected endpoints

