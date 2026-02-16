import { MigrationInterface, QueryRunner, TableColumn, Table } from 'typeorm';

export class AddTicketsAndExtendSliderGenre1700000000010 implements MigrationInterface {
  name = 'AddTicketsAndExtendSliderGenre1700000000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── Create tickets table ───────────────────────────────────
    await queryRunner.createTable(
      new Table({
        name: 'tickets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'subject', type: 'varchar', isNullable: false },
          { name: 'message', type: 'text', isNullable: false },
          {
            name: 'status',
            type: 'enum',
            enum: ['open', 'in_progress', 'answered', 'closed'],
            default: "'open'",
          },
          {
            name: 'priority',
            type: 'enum',
            enum: ['low', 'medium', 'high'],
            default: "'medium'",
          },
          {
            name: 'category',
            type: 'enum',
            enum: ['general', 'technical', 'billing', 'content', 'account', 'other'],
            default: "'general'",
          },
          { name: 'admin_reply', type: 'text', isNullable: true },
          { name: 'admin_reply_at', type: 'timestamp', isNullable: true },
          { name: 'user_id', type: 'uuid', isNullable: false },
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
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // ─── Add new slider columns ─────────────────────────────────
    const sliderTable = await queryRunner.getTable('sliders');
    if (sliderTable) {
      const columnsToAdd = [
        { name: 'mobile_image_url', type: 'varchar', isNullable: true },
        { name: 'video_url', type: 'varchar', isNullable: true },
        { name: 'button_text', type: 'varchar', isNullable: true },
        { name: 'button_text_fa', type: 'varchar', isNullable: true },
        { name: 'show_slider', type: 'boolean', default: true, isNullable: false },
        { name: 'only_kids', type: 'boolean', default: false, isNullable: false },
      ];

      for (const col of columnsToAdd) {
        if (!sliderTable.findColumnByName(col.name)) {
          await queryRunner.addColumn(
            'sliders',
            new TableColumn({
              name: col.name,
              type: col.type,
              isNullable: col.isNullable,
              default: col.default !== undefined ? String(col.default) : undefined,
            }),
          );
        }
      }
    }

    // ─── Add new genre columns ──────────────────────────────────
    const genreTable = await queryRunner.getTable('genres');
    if (genreTable) {
      const columnsToAdd = [
        { name: 'poster_url', type: 'varchar', isNullable: true },
        { name: 'logo_url', type: 'varchar', isNullable: true },
        { name: 'backdrop_url', type: 'varchar', isNullable: true },
      ];

      for (const col of columnsToAdd) {
        if (!genreTable.findColumnByName(col.name)) {
          await queryRunner.addColumn(
            'genres',
            new TableColumn({
              name: col.name,
              type: col.type,
              isNullable: col.isNullable,
            }),
          );
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop ticket table
    await queryRunner.dropTable('tickets', true);

    // Remove slider columns
    const sliderTable = await queryRunner.getTable('sliders');
    if (sliderTable) {
      for (const colName of ['mobile_image_url', 'video_url', 'button_text', 'button_text_fa', 'show_slider', 'only_kids']) {
        if (sliderTable.findColumnByName(colName)) {
          await queryRunner.dropColumn('sliders', colName);
        }
      }
    }

    // Remove genre columns
    const genreTable = await queryRunner.getTable('genres');
    if (genreTable) {
      for (const colName of ['poster_url', 'logo_url', 'backdrop_url']) {
        if (genreTable.findColumnByName(colName)) {
          await queryRunner.dropColumn('genres', colName);
        }
      }
    }
  }
}
