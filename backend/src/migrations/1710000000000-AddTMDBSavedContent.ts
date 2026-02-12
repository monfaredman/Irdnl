import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class AddTMDBSavedContent1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tmdb_saved_content',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tmdb_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'media_type',
            type: 'enum',
            enum: ['movie', 'tv'],
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'original_title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'poster_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'backdrop_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'year',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'rating',
            type: 'float',
            default: 0,
            isNullable: true,
          },
          {
            name: 'original_language',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'genre_ids',
            type: 'jsonb',
            default: "'[]'",
            isNullable: true,
          },
          {
            name: 'origin_country',
            type: 'jsonb',
            default: "'[]'",
            isNullable: true,
          },
          {
            name: 'raw_data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'import_status',
            type: 'enum',
            enum: ['pending', 'imported', 'failed'],
            default: "'pending'",
          },
          {
            name: 'imported_content_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'tmdb_saved_content',
      new TableIndex({
        name: 'IDX_TMDB_SAVED_CONTENT_TMDB_ID',
        columnNames: ['tmdb_id'],
      }),
    );

    await queryRunner.createIndex(
      'tmdb_saved_content',
      new TableIndex({
        name: 'IDX_TMDB_SAVED_CONTENT_MEDIA_TYPE',
        columnNames: ['media_type'],
      }),
    );

    await queryRunner.createIndex(
      'tmdb_saved_content',
      new TableIndex({
        name: 'IDX_TMDB_SAVED_CONTENT_IMPORT_STATUS',
        columnNames: ['import_status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tmdb_saved_content');
  }
}
