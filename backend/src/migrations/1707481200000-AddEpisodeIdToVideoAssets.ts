import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEpisodeIdToVideoAssets1707481200000 implements MigrationInterface {
  name = 'AddEpisodeIdToVideoAssets1707481200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add episode_id column to video_assets (idempotent)
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "video_assets" ADD COLUMN "episode_id" uuid;
      EXCEPTION WHEN duplicate_column THEN NULL;
      END $$;
    `);

    // Add foreign key constraint (idempotent)
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "video_assets" ADD CONSTRAINT "FK_video_assets_episode"
          FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "video_assets" DROP CONSTRAINT "FK_video_assets_episode"`,
    );

    // Drop episode_id column
    await queryRunner.query(
      `ALTER TABLE "video_assets" DROP COLUMN "episode_id"`,
    );
  }
}
