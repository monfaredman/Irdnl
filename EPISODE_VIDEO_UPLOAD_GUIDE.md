# Episode Video Upload Implementation Guide

## Overview
This guide explains the implementation of direct episode video upload functionality for series content in the admin panel.

## Architecture Changes

### Backend Changes

#### 1. VideoAsset Entity Enhancement
**File**: `backend/src/modules/video-assets/entities/video-asset.entity.ts`

Added support for episode-level video uploads:
```typescript
@Column({ nullable: true })
episodeId?: string;

@ManyToOne(() => Episode, { nullable: true })
@JoinColumn({ name: 'episodeId' })
episode?: Episode;
```

Now VideoAsset can be linked to either:
- **Content** (for movies or series-level videos)
- **Episode** (for individual episode videos)

#### 2. Upload Service Update
**File**: `backend/src/modules/admin/admin.service.ts`

Enhanced `uploadVideo` method signature:
```typescript
async uploadVideo(
  contentId: string,
  file: Express.Multer.File,
  quality: string,
  episodeId?: string,
): Promise<VideoAsset>
```

**Key Features**:
- Validates episode existence if `episodeId` provided
- Creates `VideoAsset` with `episodeId` linkage
- **Auto-links**: Automatically sets `episode.videoAssetId` after upload
- Includes `episodeId` in transcoding job payload

#### 3. Upload Endpoint Update
**File**: `backend/src/modules/admin/admin.controller.ts`

Updated POST `/admin/videos/upload` endpoint:
```typescript
@ApiBody({
  schema: {
    properties: {
      file: { type: 'string', format: 'binary' },
      contentId: { type: 'string', description: 'Content ID' },
      quality: { type: 'string', description: 'Video quality (e.g., 1080p)' },
      episodeId: { type: 'string', description: 'Episode ID (for series episodes)' },
    },
  },
})
```

### Frontend Changes

#### 1. API Client Method
**File**: `frontend/src/lib/api/admin.ts`

New method for episode video upload:
```typescript
uploadForEpisode: async (
  file: File,
  contentId: string,
  episodeId: string,
  quality: string = '1080p',
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('contentId', contentId);
  formData.append('episodeId', episodeId);
  formData.append('quality', quality);
  return api.post('/admin/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
```

#### 2. Content Detail Page UI
**File**: `frontend/src/app/admin/content/[id]/page.tsx`

**Added Components**:
1. **Hidden File Input**: Handles video file selection
2. **Upload Button**: Green upload icon next to Edit/Delete actions
3. **Upload State**: Shows spinner during active upload
4. **Auto-refresh**: Reloads content after successful upload

**Key Handler**:
```typescript
const handleEpisodeVideoUpload = async (episodeId: string, file: File) => {
  setUploadingEpisodeId(episodeId);
  try {
    await videosApi.uploadForEpisode(file, id, episodeId, '1080p');
    showFeedback('success', t('admin.content.episodes.uploadSuccess'));
    await refreshContent();
  } catch (error) {
    showFeedback('error', t('admin.content.episodes.uploadFailed'));
  } finally {
    setUploadingEpisodeId(null);
  }
};
```

#### 3. Persian Translations
**File**: `frontend/src/i18n/fa.json`

Added translations:
```json
"uploadVideo": "آپلود ویدیو",
"uploadSuccess": "ویدیو با موفقیت آپلود شد",
"uploadFailed": "خطا در آپلود ویدیو"
```

## User Workflow

### Before (Manual Process)
1. Go to Videos page → Upload video → Get `videoAssetId`
2. Go to Content detail → Find episode → Click Edit
3. Manually paste `videoAssetId` into episode form
4. Save episode

### After (Direct Upload)
1. Go to Content detail → Find episode
2. Click **Upload** button (green icon)
3. Select video file
4. **Done** - VideoAsset created and auto-linked to episode

## Technical Flow

```
User clicks Upload on episode
    ↓
File picker opens
    ↓
User selects video file
    ↓
Frontend: videosApi.uploadForEpisode(file, contentId, episodeId, quality)
    ↓
Backend: POST /admin/videos/upload with episodeId
    ↓
Backend validates episode exists
    ↓
Backend creates VideoAsset with episodeId
    ↓
Backend auto-sets episode.videoAssetId = videoAsset.id
    ↓
Backend creates transcoding job with episodeId
    ↓
Frontend shows success message & refreshes content
    ↓
Episode card now shows "Internal Video" badge
```

## Key Benefits

1. **Simplified Workflow**: Single-step episode video upload
2. **Automatic Linking**: No manual `videoAssetId` copying
3. **Inline Action**: Upload directly from episode card
4. **Visual Feedback**: Spinner during upload, success/error messages
5. **Dual Support**: Existing content-level uploads still work

## Testing Checklist

- [ ] Create series content
- [ ] Add season with episodes
- [ ] Click upload button on episode card
- [ ] Select video file (MP4)
- [ ] Verify upload spinner appears
- [ ] Verify success message in Persian
- [ ] Verify episode badge changes to "Internal Video"
- [ ] Check database: `video_assets.episodeId` populated
- [ ] Check database: `episodes.videoAssetId` populated
- [ ] Verify transcoding job includes episodeId

## Database Schema

### video_assets table
```sql
- episodeId (varchar, nullable) -- NEW: Links to episodes table
```

### episodes table
```sql
- videoAssetId (varchar, nullable) -- Existing: Auto-populated by upload
```

## API Reference

### Upload Episode Video
**Endpoint**: `POST /admin/videos/upload`

**Body** (multipart/form-data):
```
file: <video file>
contentId: <series content ID>
episodeId: <episode ID>
quality: "1080p"
```

**Response**:
```json
{
  "id": "uuid",
  "contentId": "content-uuid",
  "episodeId": "episode-uuid",
  "quality": "1080p",
  "status": "pending",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

## Notes

- Default quality: 1080p (can be made configurable later)
- Upload button only visible on hover (episode card hover state)
- Supports both episode and content-level uploads
- Maintains backward compatibility with existing upload workflows
