import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropCommentContentFK1700000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Find and drop the FK constraint on comments.content_id -> content.id
    const table = await queryRunner.getTable('comments');
    if (table) {
      const fk = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('content_id') !== -1,
      );
      if (fk) {
        await queryRunner.dropForeignKey('comments', fk);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-add the FK if needed
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_comments_content" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE`,
    );
  }
}
