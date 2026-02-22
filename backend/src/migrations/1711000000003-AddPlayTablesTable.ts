import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlayTablesTable1711000000003 implements MigrationInterface {
  name = 'AddPlayTablesTable1711000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "play_table_status_enum" AS ENUM ('draft', 'scheduled', 'active', 'archived');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "play_tables" (
        "id"             uuid DEFAULT uuid_generate_v4() NOT NULL,
        "title"          character varying NOT NULL,
        "title_fa"       character varying,
        "description"    text,
        "description_fa" text,
        "content_ids"    jsonb NOT NULL DEFAULT '[]',
        "start_time"     TIMESTAMP NOT NULL,
        "end_time"       TIMESTAMP NOT NULL,
        "status"         "play_table_status_enum" NOT NULL DEFAULT 'draft',
        "image_url"      character varying,
        "is_active"      boolean NOT NULL DEFAULT true,
        "sort_order"     integer NOT NULL DEFAULT 0,
        "created_at"     TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_play_tables" PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "play_tables";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "play_table_status_enum";`);
  }
}
