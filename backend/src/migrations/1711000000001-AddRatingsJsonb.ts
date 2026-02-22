import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRatingsJsonb1711000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "content" ADD COLUMN IF NOT EXISTS "ratings" jsonb DEFAULT '{}';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "content" DROP COLUMN IF EXISTS "ratings";
    `);
  }
}
