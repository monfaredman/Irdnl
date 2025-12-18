import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  name = 'InitialMigration1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('viewer', 'moderator', 'admin');
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" varchar NOT NULL UNIQUE,
        "password_hash" varchar NOT NULL,
        "name" varchar NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'viewer',
        "avatar_url" varchar,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      );
    `);

    // Create subscriptions table
    await queryRunner.query(`
      CREATE TYPE "subscription_status_enum" AS ENUM('active', 'cancelled', 'expired');
      CREATE TABLE "subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "plan" varchar NOT NULL,
        "status" "subscription_status_enum" NOT NULL DEFAULT 'active',
        "expires_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_subscriptions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_subscriptions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // Create content table
    await queryRunner.query(`
      CREATE TYPE "content_type_enum" AS ENUM('movie', 'series');
      CREATE TYPE "content_status_enum" AS ENUM('draft', 'published');
      CREATE TABLE "content" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar NOT NULL,
        "type" "content_type_enum" NOT NULL,
        "year" int,
        "description" text,
        "poster_url" varchar,
        "banner_url" varchar,
        "rating" numeric(3,1),
        "status" "content_status_enum" NOT NULL DEFAULT 'draft',
        "license_info" jsonb,
        "seo" jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_content" PRIMARY KEY ("id")
      );
    `);

    // Create series table
    await queryRunner.query(`
      CREATE TABLE "series" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "content_id" uuid NOT NULL UNIQUE,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_series" PRIMARY KEY ("id"),
        CONSTRAINT "FK_series_content" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE
      );
    `);

    // Create seasons table
    await queryRunner.query(`
      CREATE TABLE "seasons" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "series_id" uuid NOT NULL,
        "number" int NOT NULL,
        "title" varchar,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_seasons" PRIMARY KEY ("id"),
        CONSTRAINT "FK_seasons_series" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE
      );
    `);

    // Create video_assets table
    await queryRunner.query(`
      CREATE TYPE "video_asset_status_enum" AS ENUM('uploaded', 'processing', 'ready', 'error');
      CREATE TABLE "video_assets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "content_id" uuid NOT NULL,
        "quality" varchar NOT NULL,
        "status" "video_asset_status_enum" NOT NULL DEFAULT 'uploaded',
        "hls_url" varchar,
        "duration" int,
        "filesize" bigint,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_video_assets" PRIMARY KEY ("id"),
        CONSTRAINT "FK_video_assets_content" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE
      );
    `);

    // Create episodes table
    await queryRunner.query(`
      CREATE TABLE "episodes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "season_id" uuid NOT NULL,
        "title" varchar NOT NULL,
        "number" int NOT NULL,
        "description" text,
        "video_asset_id" uuid,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_episodes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_episodes_season" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_episodes_video_asset" FOREIGN KEY ("video_asset_id") REFERENCES "video_assets"("id") ON DELETE SET NULL
      );
    `);

    // Create watch_history table
    await queryRunner.query(`
      CREATE TABLE "watch_history" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "content_id" uuid NOT NULL,
        "progress_seconds" int NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_watch_history" PRIMARY KEY ("id"),
        CONSTRAINT "FK_watch_history_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_watch_history_content" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_watch_history_user_content" UNIQUE ("user_id", "content_id")
      );
    `);

    // Create watchlist table
    await queryRunner.query(`
      CREATE TABLE "watchlist" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "content_id" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_watchlist" PRIMARY KEY ("id"),
        CONSTRAINT "FK_watchlist_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_watchlist_content" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_watchlist_user_content" UNIQUE ("user_id", "content_id")
      );
    `);

    // Create jobs table
    await queryRunner.query(`
      CREATE TYPE "job_type_enum" AS ENUM('transcode', 'drm_package');
      CREATE TYPE "job_status_enum" AS ENUM('pending', 'running', 'done', 'failed');
      CREATE TABLE "jobs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" "job_type_enum" NOT NULL,
        "payload" jsonb NOT NULL,
        "status" "job_status_enum" NOT NULL DEFAULT 'pending',
        "error" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_jobs" PRIMARY KEY ("id")
      );
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_content_type" ON "content" ("type");`);
    await queryRunner.query(`CREATE INDEX "IDX_content_status" ON "content" ("status");`);
    await queryRunner.query(
      `CREATE INDEX "IDX_watch_history_user" ON "watch_history" ("user_id");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_watch_history_content" ON "watch_history" ("content_id");`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_watchlist_user" ON "watchlist" ("user_id");`);
    await queryRunner.query(`CREATE INDEX "IDX_jobs_status" ON "jobs" ("status");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "jobs";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "watchlist";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "watch_history";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "episodes";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "video_assets";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "seasons";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "series";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "content";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subscriptions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);

    await queryRunner.query(`DROP TYPE IF EXISTS "job_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "job_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "video_asset_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "content_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "content_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "subscription_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum";`);
  }
}
