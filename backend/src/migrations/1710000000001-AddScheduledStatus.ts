import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScheduledStatus1710000000001 implements MigrationInterface {
  name = 'AddScheduledStatus1710000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new status values to the enum - each must be in separate transaction
    await queryRunner.query(`ALTER TYPE "content_status_enum" ADD VALUE IF NOT EXISTS 'scheduled'`);
    await queryRunner.query(`ALTER TYPE "content_status_enum" ADD VALUE IF NOT EXISTS 'unpublished'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Note: PostgreSQL doesn't support removing enum values directly
    // You would need to recreate the enum type to remove values
    // For safety, we'll leave the enum values in the down migration
  }
}
