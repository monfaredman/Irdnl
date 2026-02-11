import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKidsComingSoonCollections1708000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Add new fields to content table ──
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "content" ADD COLUMN "is_kids" boolean NOT NULL DEFAULT false;
      EXCEPTION WHEN duplicate_column THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "content" ADD COLUMN "is_coming_soon" boolean NOT NULL DEFAULT false;
      EXCEPTION WHEN duplicate_column THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "content" ADD COLUMN "is_dubbed" boolean NOT NULL DEFAULT false;
      EXCEPTION WHEN duplicate_column THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "content" ADD COLUMN "collection_id" varchar;
      EXCEPTION WHEN duplicate_column THEN NULL;
      END $$;
    `);

    // ── Create collections table ──
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "collections" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "slug" varchar UNIQUE NOT NULL,
        "title" varchar NOT NULL,
        "title_fa" varchar,
        "description" text,
        "description_fa" text,
        "poster_url" varchar,
        "backdrop_url" varchar,
        "content_ids" jsonb DEFAULT '[]',
        "is_active" boolean NOT NULL DEFAULT true,
        "sort_order" int NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "collections";`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN IF EXISTS "collection_id";`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN IF EXISTS "is_dubbed";`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN IF EXISTS "is_coming_soon";`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN IF EXISTS "is_kids";`);
  }
}
