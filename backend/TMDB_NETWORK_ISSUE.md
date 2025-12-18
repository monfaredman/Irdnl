# TMDB Network Connectivity Issue

## Problem
TMDB (themoviedb.org) is blocked or unreachable from your network. Images show as broken because:
- `api.themoviedb.org` - Cannot connect (timeout)
- `image.tmdb.org` - Cannot connect (timeout)

## Solutions

### Solution 1: VPN (Recommended) ⭐
Use a VPN that can access TMDB:
```bash
# Start VPN
# Then restart backend
cd backend
npm run start:dev
```

### Solution 2: HTTP Proxy
If you have access to an HTTP proxy:

Add to `backend/.env.local`:
```bash
HTTP_PROXY=http://your-proxy:port
HTTPS_PROXY=http://your-proxy:port
NO_PROXY=localhost,127.0.0.1
```

Then restart:
```bash
cd backend
npm run start:dev
```

### Solution 3: Cloudflare Worker Proxy (Advanced)
Create a Cloudflare Worker to proxy TMDB requests:

1. Create a Cloudflare Worker with this code:
```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const tmdbUrl = 'https://api.themoviedb.org' + url.pathname + url.search;
    
    return fetch(tmdbUrl, {
      headers: request.headers
    });
  }
}
```

2. Update `backend/.env.local`:
```bash
TMDB_BASE_URL=https://your-worker.workers.dev
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p  # Images may still be blocked
```

### Solution 4: Use Cached/Local Images
Modify backend to:
1. Download images once
2. Store in local `/public/tmdb-cache/`
3. Serve from your own domain

## Testing Connectivity

```bash
# Test TMDB API
curl -I https://api.themoviedb.org/3/movie/popular

# Test TMDB Images
curl -I https://image.tmdb.org/t/p/w500/dKL78O9zxczVgjtNcQ9UkbYLzqX.jpg

# If both timeout, TMDB is blocked
```

## Current Status
✅ Backend code is correct
✅ Image URLs are being generated properly
❌ Network cannot reach TMDB servers
