# Admin Panel RTL & Comprehensive Upload Implementation

## Summary

This implementation transforms the admin panel to fully support RTL (Right-to-Left) layout with Persian (Farsi) language and adds comprehensive media upload capabilities as requested.

## What Has Been Implemented

### 1. RTL & Persian Language Support ✅

#### Frontend Changes:
- **Translation System**: Created `/frontend/src/i18n/` with:
  - `fa.json` - Complete Persian translations for all admin panel text
  - `index.ts` - Translation helper hook `useTranslation()`

- **RTL Layout**: 
  - `AdminLayout.tsx` - Added `dir="rtl"` to admin panel container
  - `AdminSidebar.tsx` - Updated to use Persian translations, changed border from `border-r` to `border-l` for RTL
  - All menu items now display in Persian

- **Font Support**: 
  - Persian font (Vazirmatn) already configured in `globals.css`
  - Text rendering optimizations for Persian script

### 2. Expanded Backend Data Model ✅

#### New Database Migration:
**File**: `/backend/src/migrations/1700000000002-AddComprehensiveContentFields.ts`

Adds 40+ new fields to support comprehensive media management:

**Basic Information**:
- `original_title` - Original language title
- `tagline` - Marketing tagline
- `short_description` - Brief synopsis
- `duration` - Duration in seconds

**Visual Assets**:
- `thumbnail_url` - Thumbnail image
- `backdrop_url` - Backdrop/landscape image
- `logo_url` - Transparent logo

**Metadata** (JSONB fields):
- `genres` - Array of genre strings
- `tags` - Array of tag/keyword strings
- `languages` - Supported languages array
- `original_language` - Original production language
- `age_rating` - Age/content rating (PG, PG-13, R, etc.)
- `content_warnings` - Array of warnings (violence, language, etc.)

**Cast & Crew** (JSONB fields):
- `cast` - Array of cast members with character/role/image
- `crew` - Array of crew members with role/department
- `director` - Director name
- `writer` - Writer name  
- `producer` - Producer name
- `production_company` - Production company name
- `country` - Production country

**External IDs**:
- `imdb_id` - IMDb identifier
- `tmdb_id` - TMDB identifier

**Media Assets** (JSONB fields):
- `video_qualities` - Multiple quality versions (SD, HD, FHD, 4K, 8K, HDR, Dolby Vision)
- `audio_tracks` - Multiple audio tracks with language/codec/channels
- `subtitles` - Subtitle files with language/format
- `trailers` - Trailer videos with type/quality

**Technical Specifications** (JSONB fields):
- `technical_specs` - Codec, resolution, frame rate, aspect ratio, audio specs
- `drm_settings` - DRM provider, license URLs, encryption settings

**Scheduling & Availability**:
- `publish_date` - Scheduled publish date
- `availability_start` - Content availability start date
- `availability_end` - Content availability end date
- `geo_restrictions` - Array of restricted/allowed countries
- `device_restrictions` - Array of device types

**Monetization** (JSONB field):
- `monetization` - Price, rental fee, subscription tier, ad insertion points

**Rights Management** (JSONB field):
- `rights_info` - Rights holder, license expiration, territories, exclusivity

**SEO & Discovery**:
- `featured` - Boolean flag for featured content
- `priority` - Integer priority for sorting
- `localized_content` - Translations for multiple languages

#### Updated Content Entity:
**File**: `/backend/src/modules/content/entities/content.entity.ts`

Added all new fields with proper TypeScript types and database column decorators.

#### Comprehensive DTOs:
**File**: `/backend/src/modules/admin/dto/create-content.dto.ts`

Created nested DTOs with full validation:
- `CastMemberDto` - Cast validation
- `CrewMemberDto` - Crew validation
- `VideoQualityDto` - Video quality validation
- `AudioTrackDto` - Audio track validation
- `SubtitleDto` - Subtitle validation
- `TrailerDto` - Trailer validation
- `TechnicalSpecsDto` - Technical specs validation
- `DRMSettingsDto` - DRM settings validation
- `MonetizationDto` - Monetization validation
- `RightsInfoDto` - Rights info validation
- `LocalizedContentDto` - Localization validation

All with proper decorators (`@IsString`, `@IsUrl`, `@IsOptional`, `@IsArray`, etc.)

### 3. Multi-Step Upload Wizard ✅

#### Component Structure:
**Base**: `/frontend/src/components/admin/ContentUploadWizard/`

**Main Wizard** (`index.tsx`):
- 7-step progressive form
- Visual progress indicator
- Navigation between steps (Next/Previous/Finish)
- Form state management
- API integration

**Type Definitions** (`types.ts`):
- Complete TypeScript interfaces
- Type-safe form data structure
- Matches backend DTOs

**Step Components** (`steps/`):

1. **BasicInfoStep.tsx**: Title, type, year, description, external player URL, status
2. **MediaAssetsStep.tsx**: Visual asset uploads (poster, banner, thumbnail, logo), video quality URLs
3. **MetadataStep.tsx**: Genres, ratings, cast/crew, production details, external IDs
4. **LocalizationStep.tsx**: Multi-language support (stub for future expansion)
5. **TechnicalStep.tsx**: Codec, resolution, frame rate, aspect ratio specifications
6. **SEOStep.tsx**: Meta title, description, keywords, featured flag, priority
7. **ReviewStep.tsx**: Final review before submission

#### Features:
- **Progress Tracking**: Visual step indicator with completed checkmarks
- **Validation**: Per-step validation before advancement
- **Image Upload**: Drag-and-drop style image uploaders with previews
- **Dynamic Fields**: Add/remove genres, tags, cast members
- **RTL Support**: All text in Persian, proper RTL layout
- **Draft Support**: Save as draft or publish immediately

### 4. Updated Admin Content Pages ✅

**Content List** (`/admin/content/page.tsx`):
- Translated to Persian
- RTL layout
- Search functionality
- Delete confirmation in Persian

**New Content** (`/admin/content/new/page.tsx`):
- Simplified to use new `ContentUploadWizard` component
- Removed old form code

## How to Use

### 1. Run Database Migration

```bash
cd backend
npm run migration:run
```

This will add all new columns to the `content` table.

### 2. Start Development Servers

```bash
# Backend
cd backend
npm run start:dev

# Frontend  
cd frontend
npm run dev
```

### 3. Access Admin Panel

1. Navigate to: `http://localhost:3000/admin/login`
2. Login with credentials:
   - Email: `admin@irdnl.local`
   - Password: `Passw0rd!`
3. Go to "محتوا" (Content) section
4. Click "افزودن محتوای جدید" (Add New Content)
5. Complete the 7-step wizard in Persian

## Persian Translations

All admin panel text is now in Persian (Farsi):

- **Menu Items**: داشبورد, محتوا, کاربران, ویدیوها, اعلان‌ها, مالی
- **Form Labels**: عنوان, نوع محتوا, سال تولید, توضیحات, وضعیت
- **Buttons**: ذخیره, انصراف, ثبت, بعدی, قبلی, اتمام
- **Status**: پیش‌نویس, منتشر شده
- **Messages**: عملیات با موفقیت انجام شد, خطایی رخ داد

## Technical Architecture

### Backend Stack:
- NestJS with TypeORM
- PostgreSQL with JSONB for complex fields
- class-validator for DTO validation
- Swagger/OpenAPI documentation

### Frontend Stack:
- Next.js 14+ with App Router
- React with TypeScript
- Custom i18n system
- RTL-aware styling
- Multi-step form wizard pattern

### Database Design:
- Normalized core fields (VARCHAR, INTEGER, TIMESTAMP)
- JSONB for complex/array data (genres, cast, video_qualities)
- Indexes on frequently queried fields (genres, tags, featured, priority)
- Nullable fields for optional data

## Future Enhancements (Not Implemented)

These features are prepared for but not fully implemented:

1. **Video File Upload**: Direct video file upload with transcoding queue
2. **Subtitle Upload**: SRT/VTT file upload and management
3. **Audio Track Upload**: Multiple audio track uploads
4. **Bulk Upload**: CSV/Excel import for multiple content
5. **Content Versioning**: Track changes and revisions
6. **Approval Workflow**: Multi-admin approval process
7. **AI Auto-Tagging**: Automatic genre/tag detection
8. **A/B Testing**: Thumbnail performance testing
9. **Analytics Integration**: View tracking and performance metrics
10. **CDN Integration**: Direct CDN distribution

## File Structure

```
backend/
├── src/
│   ├── migrations/
│   │   └── 1700000000002-AddComprehensiveContentFields.ts
│   └── modules/
│       ├── content/
│       │   └── entities/
│       │       └── content.entity.ts
│       └── admin/
│           └── dto/
│               └── create-content.dto.ts

frontend/
├── src/
│   ├── i18n/
│   │   ├── fa.json
│   │   └── index.ts
│   ├── components/
│   │   └── admin/
│   │       ├── AdminLayout.tsx
│   │       ├── AdminSidebar.tsx
│   │       └── ContentUploadWizard/
│   │           ├── index.tsx
│   │           ├── types.ts
│   │           └── steps/
│   │               ├── BasicInfoStep.tsx
│   │               ├── MediaAssetsStep.tsx
│   │               ├── MetadataStep.tsx
│   │               ├── LocalizationStep.tsx
│   │               ├── TechnicalStep.tsx
│   │               ├── SEOStep.tsx
│   │               └── ReviewStep.tsx
│   └── app/
│       └── admin/
│           └── content/
│               ├── page.tsx
│               └── new/
│                   └── page.tsx
```

## Testing

1. **Test RTL Layout**: Open admin panel and verify all text is in Persian and layout flows right-to-left
2. **Test Upload Wizard**: Create a new movie/series and go through all 7 steps
3. **Test Image Upload**: Upload poster, banner, thumbnail images
4. **Test Validation**: Try submitting without required fields
5. **Test Draft Save**: Save content as draft and edit later
6. **Test Metadata**: Add genres, cast members, technical specs
7. **Test Database**: Verify all fields are properly saved in PostgreSQL

## Notes

- All dates are stored in UTC timestamps
- JSONB fields allow flexible schema evolution
- GIN indexes on JSONB arrays improve query performance
- External player URLs support third-party video hosting
- Full backward compatibility with existing content

## Credits

Implemented as per requirements:
- ✅ RTL layout with Persian language
- ✅ Comprehensive metadata fields
- ✅ Multi-step upload wizard
- ✅ Visual asset uploads
- ✅ Video quality management
- ✅ Technical specifications
- ✅ SEO optimization fields
- ✅ Rights and licensing tracking
- ✅ Scheduling and availability
- ✅ Monetization support
