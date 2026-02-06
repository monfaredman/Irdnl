import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExternalPlayerUrl1700000000001 implements MigrationInterface {
  name = 'AddExternalPlayerUrl1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add external_player_url to content table
    await queryRunner.query(`
      ALTER TABLE "content"
      ADD COLUMN "external_player_url" varchar;
    `);

    // Add external_player_url to episodes table
    await queryRunner.query(`
      ALTER TABLE "episodes"
      ADD COLUMN "external_player_url" varchar;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN IF EXISTS "external_player_url";`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN IF EXISTS "external_player_url";`);
  }
}
