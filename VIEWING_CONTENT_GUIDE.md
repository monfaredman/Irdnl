# 🎬 Viewing Content on IrDnl Website

## Quick Access URLs

### Public Pages (No Login Required)

| Page | URL | Description |
|------|-----|-------------|
| **Homepage** | http://localhost:3000 | Browse all content in carousels |
| **Movies** | http://localhost:3000/movies | All movies listing |
| **Series** | http://localhost:3000/series | All series listing |
| **Search** | http://localhost:3000/search | Search for content |
| **Genres** | http://localhost:3000/genres | Browse by genre |

### View Specific Content

To view a specific movie or series, use the item detail page:
```
http://localhost:3000/item/{CONTENT_ID}
```

**Examples from your database**:
- Series: http://localhost:3000/item/b42dad12-39d2-4ae0-ac77-78b28c064d22
- Movie: http://localhost:3000/item/25b1357e-b515-45f5-b8b6-ce5024a3e8f7
- New Test Movie: http://localhost:3000/item/3900541e-36cb-45d6-b811-0125c4c2ba6c

---

## Admin Panel (Content Management)

### Login
```
URL: http://localhost:3000/admin/login
Email: admin@irdnl.local
Password: Passw0rd!
```

### Admin Pages

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | http://localhost:3000/admin/dashboard | Overview & stats |
| **Content List** | http://localhost:3000/admin/content | View/edit all content |
| **Upload Video** | http://localhost:3000/admin/videos | Upload video files |
| **Users** | http://localhost:3000/admin/users | Manage users |

---

## Complete Workflow: Create & View Content

### Option 1: Via Admin UI (Recommended for new content)

1. **Login to Admin Panel**
   ```
   http://localhost:3000/admin/login
   ```

2. **Go to Content Page**
   ```
   http://localhost:3000/admin/content
   ```

3. **Click "Add Content"** - Multi-step wizard will guide you through:
   - Basic Info (title, type, year, description)
   - Media Assets (poster, banner images)
   - Metadata (rating, genres, cast)
   - Localization (Persian translations)
   - Technical Specs (video quality, audio tracks)
   - SEO settings
   - Review & Publish

4. **Upload Video** (for the content you just created)
   - Go to: http://localhost:3000/admin/content/{CONTENT_ID}
   - Click "Upload Video" button
   - Select file and quality
   - Submit

5. **View on Frontend**
   ```
   http://localhost:3000/item/{CONTENT_ID}
   ```

### Option 2: Via API (For bulk/automated uploads)

#### Step 1: Login and Get Token
```bash
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@irdnl.local","password":"Passw0rd!"}' | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
```

#### Step 2: Create Content
```bash
CONTENT_ID=$(curl -s -X POST http://localhost:3001/api/admin/content \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Movie Title",
    "type": "movie",
    "year": 2024,
    "description": "Movie description here",
    "status": "published",
    "posterUrl": "https://image.tmdb.org/t/p/w500/poster.jpg",
    "bannerUrl": "https://image.tmdb.org/t/p/original/banner.jpg",
    "rating": 8.5,
    "duration": 7200,
    "genres": ["action", "drama"]
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")

echo "Content ID: $CONTENT_ID"
```

#### Step 3: Upload Video
```bash
curl -X POST http://localhost:3001/api/admin/videos/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/your/video.mp4" \
  -F "contentId=$CONTENT_ID" \
  -F "quality=1080p"
```

#### Step 4: View on Website
```
http://localhost:3000/item/$CONTENT_ID
```

---

## For Series (Seasons & Episodes)

### Create Series with Episodes

1. **Create Series Content** (type: "series")
2. **Add Season**
   ```bash
   curl -X POST http://localhost:3001/api/admin/seasons \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "seriesId": "SERIES_CONTENT_ID",
       "number": 1,
       "title": "Season 1"
     }'
   ```

3. **Add Episodes**
   ```bash
   curl -X POST http://localhost:3001/api/admin/episodes \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "seasonId": "SEASON_ID",
       "number": 1,
       "title": "Episode 1",
       "description": "First episode"
     }'
   ```

4. **Upload Episode Video** (with auto-linking)
   ```bash
   curl -X POST http://localhost:3001/api/admin/videos/upload \
     -H "Authorization: Bearer $TOKEN" \
     -F "file=@episode1.mp4" \
     -F "contentId=SERIES_CONTENT_ID" \
     -F "episodeId=EPISODE_ID" \
     -F "quality=1080p"
   ```

5. **View Series**
   ```
   http://localhost:3000/item/{SERIES_CONTENT_ID}
   ```
   The page will show seasons, episodes, and play buttons!

---

## Checking What Content Exists

### Via API
```bash
# List all content
curl -s "http://localhost:3001/api/content?page=1&limit=20" | python3 -m json.tool

# Get specific content
curl -s "http://localhost:3001/api/content/{CONTENT_ID}" | python3 -m json.tool

# Search content
curl -s "http://localhost:3001/api/content/search?q=movie" | python3 -m json.tool
```

### Via Database
```bash
PGPASSWORD='MonfaredMan@2024' psql -U monfaredman_user -d irdnl_db -h localhost \
  -c "SELECT id, title, type, status FROM content ORDER BY created_at DESC LIMIT 10;"
```

---

## Troubleshooting

### Content Not Showing on Frontend?

1. **Check Status**: Content must have `status: "published"` to appear
   ```bash
   curl -s "http://localhost:3001/api/content/{ID}" | grep status
   ```

2. **Update Status**:
   ```bash
   curl -X PUT http://localhost:3001/api/admin/content/{ID} \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"status": "published"}'
   ```

3. **Clear Cache**: Restart backend or wait a few minutes for cache invalidation

### Video Not Playing?

1. Check if video asset was created:
   ```bash
   curl -s "http://localhost:3001/api/admin/videos?contentId={ID}" \
     -H "Authorization: Bearer $TOKEN"
   ```

2. Check transcoding status (should be "ready" for playback)

### Admin Panel Not Loading?

1. Check if backend is running:
   ```bash
   curl http://localhost:3001/api/health
   ```

2. Check if frontend is running:
   ```bash
   curl http://localhost:3000
   ```

---

## Next Steps

1. ✅ **Created test movie** - ID: `3900541e-36cb-45d6-b811-0125c4c2ba6c`
2. 🎥 **Upload video** for the test movie using the curl command above
3. 🌐 **View it** at: http://localhost:3000/item/3900541e-36cb-45d6-b811-0125c4c2ba6c
4. 🎬 **Create more content** via admin panel: http://localhost:3000/admin/content

---

**Quick Test**: Open http://localhost:3000 right now to see the existing content on your homepage! 🚀
