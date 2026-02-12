import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUperaContent1709000000000 implements MigrationInterface {
  name = 'AddUperaContent1709000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "upera_content_type_enum" AS ENUM('movie', 'series');
    `);

    await queryRunner.query(`
      CREATE TYPE "upera_import_status_enum" AS ENUM('pending', 'imported', 'failed');
    `);

    // Create upera_content table
    await queryRunner.query(`
      CREATE TABLE "upera_content" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "upera_id" varchar NOT NULL,
        "title_fa" varchar,
        "title_en" varchar,
        "type" "upera_content_type_enum" NOT NULL,
        "year" int,
        "description" text,
        "poster_url" varchar,
        "banner_url" varchar,
        "rating" numeric(3,1),
        "imdb_rating" numeric(3,1),
        "genres" jsonb DEFAULT '[]',
        "is_free" boolean NOT NULL DEFAULT false,
        "is_dubbed" boolean NOT NULL DEFAULT false,
        "country" varchar,
        "qualities" jsonb,
        "seasons" jsonb,
        "affiliate_link" varchar,
        "import_status" "upera_import_status_enum" NOT NULL DEFAULT 'pending',
        "imported_content_id" varchar,
        "raw_data" jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_upera_content" PRIMARY KEY ("id")
      );
    `);

    // Create index on upera_id for fast lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_upera_content_upera_id" ON "upera_content" ("upera_id");
    `);

    // Create index on import_status for filtering
    await queryRunner.query(`
      CREATE INDEX "IDX_upera_content_import_status" ON "upera_content" ("import_status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_upera_content_import_status"`);
    await queryRunner.query(`DROP INDEX "IDX_upera_content_upera_id"`);
    await queryRunner.query(`DROP TABLE "upera_content"`);
    await queryRunner.query(`DROP TYPE "upera_import_status_enum"`);
    await queryRunner.query(`DROP TYPE "upera_content_type_enum"`);
  }
}
