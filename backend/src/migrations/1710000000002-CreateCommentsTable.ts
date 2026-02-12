import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommentsTable1710000000002 implements MigrationInterface {
  name = 'CreateCommentsTable1710000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create comment_status enum
    await queryRunner.query(`
      CREATE TYPE "comment_status_enum" AS ENUM ('pending', 'approved', 'rejected', 'spam')
    `);

    // Create comment_type enum
    await queryRunner.query(`
      CREATE TYPE "comment_type_enum" AS ENUM ('comment', 'support', 'report', 'feedback')
    `);

    // Create comments table
    await queryRunner.query(`
      CREATE TABLE "comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "text" text NOT NULL,
        "type" "comment_type_enum" NOT NULL DEFAULT 'comment',
        "status" "comment_status_enum" NOT NULL DEFAULT 'pending',
        "user_id" uuid,
        "content_id" uuid,
        "parent_id" uuid,
        "user_name" character varying,
        "user_email" character varying,
        "rating" integer NOT NULL DEFAULT 0,
        "admin_reply" text,
        "admin_id" uuid,
        "replied_at" timestamp,
        "ip_address" character varying,
        "user_agent" text,
        "is_pinned" boolean NOT NULL DEFAULT false,
        "is_spoiler" boolean NOT NULL DEFAULT false,
        "likes_count" integer NOT NULL DEFAULT 0,
        "dislikes_count" integer NOT NULL DEFAULT 0,
        "metadata" jsonb DEFAULT '{}',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_comments" PRIMARY KEY ("id")
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_comments_user_id" ON "comments" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_comments_content_id" ON "comments" ("content_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_comments_parent_id" ON "comments" ("parent_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_comments_status" ON "comments" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_comments_type" ON "comments" ("type")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_comments_created_at" ON "comments" ("created_at")
    `);

    // Add foreign keys
    await queryRunner.query(`
      ALTER TABLE "comments" 
      ADD CONSTRAINT "FK_comments_user_id" 
      FOREIGN KEY ("user_id") 
      REFERENCES "users"("id") 
      ON DELETE SET NULL 
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "comments" 
      ADD CONSTRAINT "FK_comments_content_id" 
      FOREIGN KEY ("content_id") 
      REFERENCES "content"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "comments" 
      ADD CONSTRAINT "FK_comments_parent_id" 
      FOREIGN KEY ("parent_id") 
      REFERENCES "comments"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.query(`
      ALTER TABLE "comments" DROP CONSTRAINT "FK_comments_parent_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "comments" DROP CONSTRAINT "FK_comments_content_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "comments" DROP CONSTRAINT "FK_comments_user_id"
    `);

    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_comments_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_comments_type"`);
    await queryRunner.query(`DROP INDEX "IDX_comments_status"`);
    await queryRunner.query(`DROP INDEX "IDX_comments_parent_id"`);
    await queryRunner.query(`DROP INDEX "IDX_comments_content_id"`);
    await queryRunner.query(`DROP INDEX "IDX_comments_user_id"`);

    // Drop table
    await queryRunner.query(`DROP TABLE "comments"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE "comment_type_enum"`);
    await queryRunner.query(`DROP TYPE "comment_status_enum"`);
  }
}
