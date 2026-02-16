import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBlogPostsTable1710000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE blog_post_status_enum AS ENUM ('draft', 'published', 'scheduled', 'archived');
      CREATE TYPE blog_category_enum AS ENUM ('news', 'reviews', 'interviews', 'behind_scenes', 'industry', 'technology', 'opinion', 'tutorials');
    `);

    await queryRunner.createTable(
      new Table({
        name: 'blog_posts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'excerpt',
            type: 'text',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'cover_image',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'blog_post_status_enum',
            default: "'draft'",
          },
          {
            name: 'category',
            type: 'blog_category_enum',
          },
          {
            name: 'tags',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'author_id',
            type: 'uuid',
          },
          {
            name: 'published_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'scheduled_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'views_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'likes_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'comments_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'reading_time',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'is_featured',
            type: 'boolean',
            default: false,
          },
          {
            name: 'meta_title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'meta_description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'meta_keywords',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'blog_posts',
      new TableForeignKey({
        columnNames: ['author_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX idx_blog_posts_status ON blog_posts(status);
      CREATE INDEX idx_blog_posts_category ON blog_posts(category);
      CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
      CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
      CREATE INDEX idx_blog_posts_scheduled_at ON blog_posts(scheduled_at);
      CREATE INDEX idx_blog_posts_is_featured ON blog_posts(is_featured);
      CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('blog_posts');
    await queryRunner.query(`
      DROP TYPE blog_post_status_enum;
      DROP TYPE blog_category_enum;
    `);
  }
}
