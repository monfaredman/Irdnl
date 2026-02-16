import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryDisplayOptions1700000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add showInMenu and showInLanding columns to categories
    await queryRunner.query(`
      ALTER TABLE "categories"
      ADD COLUMN IF NOT EXISTS "show_in_menu" boolean NOT NULL DEFAULT true
    `);
    await queryRunner.query(`
      ALTER TABLE "categories"
      ADD COLUMN IF NOT EXISTS "show_in_landing" boolean NOT NULL DEFAULT false
    `);

    // Add categoryIds column to content
    await queryRunner.query(`
      ALTER TABLE "content"
      ADD COLUMN IF NOT EXISTS "category_ids" jsonb DEFAULT '[]'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN IF EXISTS "show_in_menu"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN IF EXISTS "show_in_landing"`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN IF EXISTS "category_ids"`);
  }
}
