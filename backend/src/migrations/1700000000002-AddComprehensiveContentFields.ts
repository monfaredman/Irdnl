import { MigrationInterface, QueryRunner } from "typeorm";

export class AddComprehensiveContentFields1700000000002 implements MigrationInterface {
    name = 'AddComprehensiveContentFields1700000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to content table
        await queryRunner.query(`
            ALTER TABLE "content" 
            ADD COLUMN IF NOT EXISTS "original_title" VARCHAR,
            ADD COLUMN IF NOT EXISTS "tagline" VARCHAR,
            ADD COLUMN IF NOT EXISTS "short_description" TEXT,
            ADD COLUMN IF NOT EXISTS "duration" INTEGER,
            ADD COLUMN IF NOT EXISTS "genres" JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS "tags" JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS "languages" JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS "original_language" VARCHAR,
            ADD COLUMN IF NOT EXISTS "age_rating" VARCHAR,
            ADD COLUMN IF NOT EXISTS "content_warnings" JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS "cast" JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS "crew" JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS "director" VARCHAR,
            ADD COLUMN IF NOT EXISTS "writer" VARCHAR,
            ADD COLUMN IF NOT EXISTS "producer" VARCHAR,
            ADD COLUMN IF NOT EXISTS "production_company" VARCHAR,
            ADD COLUMN IF NOT EXISTS "country" VARCHAR,
            ADD COLUMN IF NOT EXISTS "imdb_id" VARCHAR,
            ADD COLUMN IF NOT EXISTS "tmdb_id" VARCHAR,
            ADD COLUMN IF NOT EXISTS "thumbnail_url" VARCHAR,
            ADD COLUMN IF NOT EXISTS "backdrop_url" VARCHAR,
            ADD COLUMN IF NOT EXISTS "logo_url" VARCHAR,
            ADD COLUMN IF NOT EXISTS "video_qualities" JSONB DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS "audio_tracks" JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS "subtitles" JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS "trailers" JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS "technical_specs" JSONB DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS "drm_settings" JSONB DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS "publish_date" TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "availability_start" TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "availability_end" TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "geo_restrictions" JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS "device_restrictions" JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS "monetization" JSONB DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS "rights_info" JSONB DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS "featured" BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS "priority" INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "localized_content" JSONB DEFAULT '{}'
        `);

        // Add indexes for frequently queried fields
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_content_genres" ON "content" USING GIN (genres);
            CREATE INDEX IF NOT EXISTS "IDX_content_tags" ON "content" USING GIN (tags);
            CREATE INDEX IF NOT EXISTS "IDX_content_featured" ON "content" (featured);
            CREATE INDEX IF NOT EXISTS "IDX_content_priority" ON "content" (priority);
            CREATE INDEX IF NOT EXISTS "IDX_content_publish_date" ON "content" (publish_date);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_content_publish_date"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_content_priority"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_content_featured"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_content_tags"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_content_genres"`);

        // Drop columns
        await queryRunner.query(`
            ALTER TABLE "content"
            DROP COLUMN IF EXISTS "localized_content",
            DROP COLUMN IF EXISTS "priority",
            DROP COLUMN IF EXISTS "featured",
            DROP COLUMN IF EXISTS "rights_info",
            DROP COLUMN IF EXISTS "monetization",
            DROP COLUMN IF EXISTS "device_restrictions",
            DROP COLUMN IF EXISTS "geo_restrictions",
            DROP COLUMN IF EXISTS "availability_end",
            DROP COLUMN IF EXISTS "availability_start",
            DROP COLUMN IF EXISTS "publish_date",
            DROP COLUMN IF EXISTS "drm_settings",
            DROP COLUMN IF EXISTS "technical_specs",
            DROP COLUMN IF EXISTS "trailers",
            DROP COLUMN IF EXISTS "subtitles",
            DROP COLUMN IF EXISTS "audio_tracks",
            DROP COLUMN IF EXISTS "video_qualities",
            DROP COLUMN IF EXISTS "logo_url",
            DROP COLUMN IF EXISTS "backdrop_url",
            DROP COLUMN IF EXISTS "thumbnail_url",
            DROP COLUMN IF EXISTS "tmdb_id",
            DROP COLUMN IF EXISTS "imdb_id",
            DROP COLUMN IF EXISTS "country",
            DROP COLUMN IF EXISTS "production_company",
            DROP COLUMN IF EXISTS "producer",
            DROP COLUMN IF EXISTS "writer",
            DROP COLUMN IF EXISTS "director",
            DROP COLUMN IF EXISTS "crew",
            DROP COLUMN IF EXISTS "cast",
            DROP COLUMN IF EXISTS "content_warnings",
            DROP COLUMN IF EXISTS "age_rating",
            DROP COLUMN IF EXISTS "original_language",
            DROP COLUMN IF EXISTS "languages",
            DROP COLUMN IF EXISTS "tags",
            DROP COLUMN IF EXISTS "genres",
            DROP COLUMN IF EXISTS "duration",
            DROP COLUMN IF EXISTS "short_description",
            DROP COLUMN IF EXISTS "tagline",
            DROP COLUMN IF EXISTS "original_title"
        `);
    }
}
