# Kids, Coming Soon, Collections & Localization Implementation Summary

## Overview
This document tracks the implementation of new content management features: Kids content flag, Coming Soon flag, Collections grouping, and enhanced Localization step with subtitle upload and dubbed toggle.

## Backend Implementation ✅

### 1. Database Schema Changes
**Migration**: `1708000000000-AddKidsComingSoonCollections.ts`
- **Status**: ✅ Created and successfully executed
- **Changes**:
  - Added 4 columns to `content` table:
    - `is_kids` (boolean, default false)
    - `is_coming_soon` (boolean, default false)
    - `is_dubbed` (boolean, default false)
    - `collection_id` (varchar, nullable, FK to collections)
  - Created new `collections` table with fields:
    - `id` (uuid, primary key)
    - `slug` (varchar, unique)
    - `title`, `title_fa` (varchar)
    - `description`, `description_fa` (text)
    - `poster_url`, `backdrop_url` (varchar)
    - `content_ids` (jsonb array)
    - `is_active` (boolean, default true)
    - `sort_order` (int, default 0)
    - `created_at`, `updated_at` (timestamps)

### 2. Entity Updates
**Files Modified**:
- `/backend/src/modules/content/entities/content.entity.ts`
  - Added: `isKids`, `isComingSoon`, `isDubbed`, `collectionId` fields
- `/backend/src/modules/content/entities/collection.entity.ts` (NEW)
  - Full Collection entity with all relationships
- `/backend/src/modules/content/content.service.spec.ts`
  - Updated mock data to include new fields

### 3. Admin Module Updates
**Files Modified**:
- `/backend/src/config/typeorm.config.ts`
  - Added Collection to imports and ENTITIES array
- `/backend/src/modules/admin/admin.module.ts`
  - Added Collection to TypeOrmModule.forFeature
- `/backend/src/modules/admin/dto/collection.dto.ts` (NEW)
  - CreateCollectionDto with validators
  - UpdateCollectionDto (all fields optional)
- `/backend/src/modules/admin/admin.service.ts`
  - Added Collection repository injection
  - Added 5 CRUD methods:
    - `listCollections(page, limit)` - List with pagination
    - `getCollection(id)` - Get by ID
    - `createCollection(dto)` - Create new
    - `updateCollection(id, dto)` - Update existing
    - `deleteCollection(id)` - Delete by ID
- `/backend/src/modules/admin/admin.controller.ts`
  - Added Collection DTO imports
  - Added 5 REST endpoints:
    - `GET /admin/collections` - List collections
    - `GET /admin/collections/:id` - Get collection
    - `POST /admin/collections` - Create collection
    - `PUT /admin/collections/:id` - Update collection
    - `DELETE /admin/collections/:id` - Delete collection

### 4. Build & Migration
- ✅ Backend built successfully
- ✅ Migration executed successfully
- ✅ Database schema updated

## Frontend Implementation ✅

### 1. API Client
**File**: `/frontend/src/lib/api/admin.ts`
- Added `collectionsApi` object with methods:
  - `list(params)` - List collections with pagination
  - `get(id)` - Get collection by ID
  - `create(data)` - Create new collection
  - `update(id, data)` - Update collection
  - `delete(id)` - Delete collection

### 2. Content Upload Wizard Types
**File**: `/frontend/src/components/admin/ContentUploadWizard/types.ts`
- Added to `ContentFormData` interface:
  - `isKids?: boolean` - Kids content flag
  - `isComingSoon?: boolean` - Coming soon flag
  - `isDubbed?: boolean` - Dubbed content flag
  - `collectionId?: string` - Collection FK

### 3. BasicInfoStep Enhancement
**File**: `/frontend/src/components/admin/ContentUploadWizard/steps/BasicInfoStep.tsx`
- Added MUI imports (Switch, Select, FormControlLabel, etc.)
- Fetch collections on component mount
- Added "Content Flags & Collection" section with:
  - **Kids Toggle**: Switch for `isKids`
  - **Coming Soon Toggle**: Switch for `isComingSoon`
  - **Collection Selector**: Dropdown showing all collections (title_fa or title)

### 4. LocalizationStep Complete Rewrite
**File**: `/frontend/src/components/admin/ContentUploadWizard/steps/LocalizationStep.tsx`
- **Status**: ✅ Fully implemented (was placeholder before)
- **Features**:
  1. **Dubbed Toggle**:
     - MUI Switch for `isDubbed` field
     - Label: "محتوای دوبله شده"
  2. **Subtitle Management**:
     - Add/remove subtitles dynamically
     - Each subtitle has:
       - Language selector (fa, en, ar, tr, fr, de, es)
       - Format selector (srt, vtt, ass)
       - Label input (e.g., "فارسی SDH")
       - URL input for file path
     - Empty state with upload icon
  3. **Localized Content Editor**:
     - Persian section (title + description)
     - English section (title + description)
     - Arabic section (title + description)
     - Each in separate styled containers

## Pending Work ❌

### 1. Collections Admin Page
**File to create**: `/frontend/src/app/admin/collections/page.tsx`
- **Features needed**:
  - Table listing all collections (slug, title, titleFa, isActive, sortOrder)
  - Create/Edit dialog with form fields
  - Content multi-select or drag-drop for contentIds management
  - Delete confirmation
  - Search/filter functionality

### 2. Sidebar Update
**File to modify**: (Find AdminSidebar component)
- Add "Collections" menu item
- Add appropriate icon (Collection/Folder icon)
- Add Persian translation to fa.json

### 3. Content Edit Form
**Consideration**: The content list page (`/frontend/src/app/admin/content/page.tsx`) may need updates to display the new flags and collection info in the table.

### 4. Frontend Display Logic
**Future work**:
- Kids section: Filter content where `isKids = true`
- Coming Soon section: Filter content where `isComingSoon = true`
- Collections page: Display collections with their content items
- Dubbed filter: Add filter option for Persian dubbed content

## API Endpoints Reference

### Collections Endpoints (Admin Only)
```
GET    /api/admin/collections?page=1&limit=20
GET    /api/admin/collections/:id
POST   /api/admin/collections
PUT    /api/admin/collections/:id
DELETE /api/admin/collections/:id
```

### Example Collection Create Request
```json
{
  "slug": "marvel-cinematic-universe",
  "title": "Marvel Cinematic Universe",
  "titleFa": "دنیای سینمایی مارول",
  "description": "All MCU movies and series",
  "descriptionFa": "تمامی فیلم‌ها و سریال‌های دنیای سینمایی مارول",
  "posterUrl": "/images/collections/mcu-poster.jpg",
  "backdropUrl": "/images/collections/mcu-backdrop.jpg",
  "contentIds": ["uuid1", "uuid2", "uuid3"],
  "isActive": true,
  "sortOrder": 1
}
```

## Testing Checklist

### Backend
- [x] Migration runs successfully
- [x] Content table has new columns
- [x] Collections table created
- [ ] Test POST /admin/collections (create)
- [ ] Test GET /admin/collections (list)
- [ ] Test GET /admin/collections/:id (get one)
- [ ] Test PUT /admin/collections/:id (update)
- [ ] Test DELETE /admin/collections/:id (delete)

### Frontend
- [ ] Test BasicInfoStep with new toggles and collection selector
- [ ] Test LocalizationStep subtitle addition/removal
- [ ] Test LocalizationStep dubbed toggle
- [ ] Test LocalizationStep localized content editing
- [ ] Test content creation with new fields
- [ ] Verify new fields are saved to database
- [ ] Create Collections admin page
- [ ] Test collection CRUD operations from UI

## Notes
- All backend changes use idempotent migration patterns (DO $$ blocks)
- Collections use JSONB array for `contentIds` for flexibility
- Subtitle management is fully client-side until form submission
- LocalizedContent uses Record<string, LocalizedContent> structure
- MUI components used for consistency with existing admin UI

## Next Steps Priority
1. ✅ Complete backend Collections CRUD
2. ✅ Add Collections API to frontend
3. ✅ Implement LocalizationStep
4. ✅ Add Kids/ComingSoon/Collection fields to BasicInfoStep
5. ❌ Create Collections admin CRUD page
6. ❌ Update sidebar with Collections link
7. ❌ Test end-to-end workflow
8. ❌ Add frontend sections (Kids, Coming Soon, Collections browse)
