import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScheduledStatus1710000000001 implements MigrationInterface {
  name = 'AddScheduledStatus1710000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new status values to the enum
    await queryRunner.query(`
      ALTER TYPE "content_status_enum" ADD VALUE IF NOT EXISTS 'scheduled';
    `);
    await queryRunner.query(`
      ALTER TYPE "content_status_enum" ADD VALUE IF NOT EXISTS 'unpublished';
    `);

    // Create index on publish_date for scheduled content queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_content_publish_date" ON "content" ("publish_date") 
      WHERE status = 'scheduled' AND publish_date IS NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_content_publish_date"`);
    
    // Note: PostgreSQL doesn't support removing enum values directly
    // You would need to recreate the enum type to remove values
    // For safety, we'll leave the enum values in the down migration
  }
}
