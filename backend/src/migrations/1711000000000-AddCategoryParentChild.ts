import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryParentChild1711000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add parent_id column for self-referencing parent-child relationship
    await queryRunner.query(`
      ALTER TABLE "categories"
      ADD COLUMN IF NOT EXISTS "parent_id" uuid NULL
    `);

    // Add url_path column for URL routing segments
    await queryRunner.query(`
      ALTER TABLE "categories"
      ADD COLUMN IF NOT EXISTS "url_path" varchar NULL
    `);

    // Add foreign key constraint for parent-child relationship
    await queryRunner.query(`
      ALTER TABLE "categories"
      ADD CONSTRAINT "FK_categories_parent"
      FOREIGN KEY ("parent_id")
      REFERENCES "categories"("id")
      ON DELETE SET NULL
    `);

    // Add index for faster parent lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_categories_parent_id"
      ON "categories" ("parent_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_categories_parent_id"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "FK_categories_parent"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN IF EXISTS "url_path"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN IF EXISTS "parent_id"`);
  }
}
