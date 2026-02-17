# Database Seeds - Categories & Genres

This directory contains scripts to seed your database with categories and genres.

## Files

- **`exported-data.json`** - JSON export of current categories and genres from database
- **`seed-categories-genres.ts`** - Auto-generated TypeScript seed file (can be run to restore data)
- **`seed-categories.ts`** - Original manual category seed file
- **`run-seeds.ts`** - General seed file for users and content

## Usage

### 1. Export Current Data

To save your current categories and genres from the database:

```bash
npm run export:categories-genres
```

This will:
- Connect to your database
- Export all categories (parents + children) and genres
- Save to `exported-data.json`
- Generate `seed-categories-genres.ts` for re-seeding

### 2. Seed Database

To seed/restore categories and genres:

```bash
npm run seed:categories-genres
```

This will:
- Upsert all genres (create new or update existing by slug)
- Upsert all parent categories
- Upsert all child categories with proper parent relationships

## Data Summary

**Last Export:** 2026-02-17T11:00:20.194Z

- **11 Parent Categories:**
  - Foreign Movies (فیلم خارجی)
  - Foreign Movies (فیلم‌های خارجی)
  - Iranian Movies (فیلم ایرانی)
  - Series (سریال)
  - TV Series (سریال‌ها)
  - Animations (انیمیشن‌ها)
  - Animation (انیمیشن)
  - Persian Dubbed (دوبله فارسی)
  - Anime (انیمه)
  - Kids (کودکان)
  - Other (سایر)

- **16 Child Categories** (subcategories of above)

- **22 Genres:**
  - Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Science Fiction, Thriller, War, Western, Anime, Children, Sports

## Workflow

1. **Make changes** to categories/genres in your admin panel
2. **Export** the current state: `npm run export:categories-genres`
3. **Commit** the generated files to version control
4. **On new deployment**, run: `npm run seed:categories-genres`

## Notes

- The seed scripts use **upsert logic** - they will update existing records (matched by slug) or create new ones
- Parent-child relationships are preserved using slug references
- All fields including `tmdbParams`, `gradientColors`, and sort orders are saved
- Genre relationships with categories are stored in the `categorySlugs` JSONB field
