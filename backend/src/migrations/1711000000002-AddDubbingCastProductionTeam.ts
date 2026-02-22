import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDubbingCastProductionTeam1711000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "content"
      ADD COLUMN IF NOT EXISTS "dubbing_cast" jsonb DEFAULT '[]';
    `);
    await queryRunner.query(`
      ALTER TABLE "content"
      ADD COLUMN IF NOT EXISTS "production_team" jsonb DEFAULT '[]';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN IF EXISTS "dubbing_cast";`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN IF EXISTS "production_team";`);
  }
}
