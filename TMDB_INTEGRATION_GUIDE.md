# 🎬 TMDB API Integration Guide

## 📋 Setup Instructions

### 1. Get TMDB API Key

1. Visit [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account or sign in
3. Go to **Settings** → **API**
4. Request an API key (choose "Developer" option)
5. Fill out the API key request form
6. Copy your **API Key (v3 auth)**

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Update the `.env.local` file with your API key:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Cache Configuration (1 hour default)
NEXT_PUBLIC_CACHE_DURATION=3600000

# Rate Limiting (40 requests per 10 seconds)
NEXT_PUBLIC_API_RATE_LIMIT=40
NEXT_PUBLIC_API_RATE_WINDOW=10000
```

### 3. Restart Development Server

```bash
npm run dev
```

---

## 🔧 Usage Examples

### Basic Hook Usage

```tsx
import { useTMDBPopularMovies } from "@/hooks/useTMDB";
import { useLanguage } from "@/providers/language-provider";

function MoviesSection() {
  const { language } = useLanguage();
  const { data: movies, loading, error } = useTMDBPopularMovies({ language });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!movies) return null;

  return (
    <div>
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
```

### Available Hooks

#### 1. **useTMDBPopularMovies**
Fetches popular movies from TMDB.

```tsx
const { data, loading, error, refetch } = useTMDBPopularMovies({
  language: "en", // or "fa" for Persian
  enabled: true,  // Set to false to disable auto-fetch
});
```

#### 2. **useTMDBTrendingMovies**
Fetches trending movies (this week).

```tsx
const { data, loading, error, refetch } = useTMDBTrendingMovies({
  language: "fa",
});
```

#### 3. **useTMDBPopularTVShows**
Fetches popular TV series.

```tsx
const { data, loading, error, refetch } = useTMDBPopularTVShows({
  language: "en",
});
```

#### 4. **useTMDBSearchMovies**
Search for movies with debouncing (500ms).

```tsx
const [query, setQuery] = useState("");
const { data, loading, error } = useTMDBSearchMovies(query, {
  language: "fa",
});
```

#### 5. **useTMDBSearchTVShows**
Search for TV shows with debouncing.

```tsx
const { data, loading, error } = useTMDBSearchTVShows(query);
```

#### 6. **useTMDBCombinedContent**
Fetches mixed movies + TV shows (great for homepage).

```tsx
const { data, loading, error } = useTMDBCombinedContent({
  language: "en",
});
```

---

## 📦 Direct API Client Usage

For advanced use cases, use the client directly:

```tsx
import { tmdbClient } from "@/lib/tmdb-service";

// Get popular movies
const response = await tmdbClient.getPopularMovies("en", 1);

// Search movies
const searchResults = await tmdbClient.searchMovies("inception", "en");

// Get image URL
const posterUrl = tmdbClient.getImageUrl("/path.jpg", "w500");
```

---

## 🎨 Image Sizes

TMDB provides multiple image sizes:

- **w200** - Small thumbnails (200px width)
- **w500** - Medium posters (500px width) ← **Recommended**
- **original** - Full resolution (large files)

```tsx
const posterSmall = tmdbClient.getImageUrl(movie.poster_path, "w200");
const posterMedium = tmdbClient.getImageUrl(movie.poster_path, "w500");
const backdrop = tmdbClient.getImageUrl(movie.backdrop_path, "original");
```

---

## 💾 Caching System

The API client includes automatic caching:

- **Duration:** 1 hour (configurable via env)
- **Storage:** localStorage
- **Automatic:** No manual cache management needed

### Clear Cache Manually

```tsx
import { cache } from "@/lib/tmdb-service";

// Clear all TMDB cache
cache.clear();

// Clear specific cache key
cache.delete("popular_movies_en_1");
```

---

## ⚡ Rate Limiting

Built-in rate limiting prevents API abuse:

- **Default:** 40 requests per 10 seconds
- **Automatic retry:** Exponential backoff on 429 errors
- **Queue system:** Requests wait if limit is reached

---

## 🌍 Multi-Language Support

TMDB supports localized content:

```tsx
// English content
const { data: englishMovies } = useTMDBPopularMovies({ language: "en" });

// Persian/Farsi content
const { data: persianMovies } = useTMDBPopularMovies({ language: "fa" });
```

**Note:** Persian translations may not be available for all content.

---

## 🔄 Data Mapping

TMDB data is automatically mapped to your app's data structure:

```tsx
// TMDB Response
{
  id: 550,
  title: "Fight Club",
  vote_average: 8.4,
  poster_path: "/path.jpg"
}

// Mapped to Your Movie Type
{
  id: "550",
  title: "Fight Club",
  slug: "fight-club",
  rating: 8.4,
  poster: "https://image.tmdb.org/t/p/w500/path.jpg",
  // ... other fields
}
```

---

## 🛡️ Error Handling

All hooks return an `error` object:

```tsx
const { data, loading, error } = useTMDBPopularMovies();

if (error) {
  return (
    <div>
      <p>Failed to load movies: {error.message}</p>
      <button onClick={refetch}>Retry</button>
    </div>
  );
}
```

---

## 🚀 Performance Tips

### 1. **Enable/Disable Fetching**
```tsx
// Only fetch when tab is active
const { data } = useTMDBPopularMovies({
  enabled: isTabActive,
});
```

### 2. **Pagination**
```tsx
const [page, setPage] = useState(1);
const response = await tmdbClient.getPopularMovies("en", page);
```

### 3. **Image Optimization**
```tsx
<Image
  src={tmdbClient.getImageUrl(movie.poster_path, "w500")}
  alt={movie.title}
  loading="lazy"
  width={500}
  height={750}
/>
```

---

## 🔐 Security Notes

- API keys are exposed in client-side code (NEXT_PUBLIC_*)
- TMDB API keys are safe to expose (CORS-protected)
- For production, consider using a backend proxy
- Never commit `.env.local` to version control

---

## 📊 API Limits

TMDB Free Tier:
- **40 requests per 10 seconds** per IP
- **Unlimited daily requests**
- **No cost** for non-commercial use

---

## 🆘 Troubleshooting

### "TMDB API error: 401"
→ Invalid API key. Check your `.env.local` file.

### "TMDB API error: 429"
→ Rate limit exceeded. The client will automatically retry.

### Cache not working
→ Check browser's localStorage is enabled and not full.

### Images not loading
→ Verify `NEXT_PUBLIC_TMDB_IMAGE_BASE_URL` is set correctly.

---

## 📚 Resources

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [TMDB API Reference](https://developers.themoviedb.org/3/getting-started/introduction)
- [TMDB Image CDN](https://developers.themoviedb.org/3/getting-started/images)
- [TMDB Language Codes](https://developers.themoviedb.org/3/configuration/get-primary-translations)

---

## ✅ Quick Checklist

- [ ] TMDB account created
- [ ] API key obtained
- [ ] `.env.local` file created
- [ ] API key added to `.env.local`
- [ ] Development server restarted
- [ ] First API call successful
- [ ] Images loading correctly
- [ ] Multi-language tested
