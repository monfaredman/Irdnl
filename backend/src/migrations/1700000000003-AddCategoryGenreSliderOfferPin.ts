import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryGenreSliderOfferPin1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Categories table ──
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "categories" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "slug" varchar UNIQUE NOT NULL,
        "name_en" varchar NOT NULL,
        "name_fa" varchar NOT NULL,
        "content_type" varchar NOT NULL DEFAULT 'mixed',
        "description_en" text,
        "description_fa" text,
        "gradient_colors" jsonb DEFAULT '[]',
        "icon" varchar,
        "image_url" varchar,
        "tmdb_params" jsonb DEFAULT '{}',
        "show_episodes" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "sort_order" int NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // ── Genres table ──
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "genres" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "slug" varchar UNIQUE NOT NULL,
        "name_en" varchar NOT NULL,
        "name_fa" varchar NOT NULL,
        "tmdb_genre_id" varchar,
        "category_slugs" jsonb DEFAULT '[]',
        "is_active" boolean NOT NULL DEFAULT true,
        "sort_order" int NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // ── Sliders table ──
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sliders" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar NOT NULL,
        "title_fa" varchar,
        "description" text,
        "description_fa" text,
        "image_url" varchar,
        "link_url" varchar,
        "content_id" uuid,
        "section" varchar NOT NULL DEFAULT 'hero',
        "is_active" boolean NOT NULL DEFAULT true,
        "sort_order" int NOT NULL DEFAULT 0,
        "start_date" TIMESTAMP,
        "end_date" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_sliders_content" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE SET NULL
      );
    `);

    // ── Offers table ──
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "offers" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar NOT NULL,
        "title_fa" varchar,
        "description" text,
        "description_fa" text,
        "image_url" varchar,
        "link_url" varchar,
        "discount_percent" int,
        "discount_code" varchar,
        "original_price" numeric(12, 0),
        "offer_price" numeric(12, 0),
        "is_active" boolean NOT NULL DEFAULT true,
        "sort_order" int NOT NULL DEFAULT 0,
        "start_date" TIMESTAMP,
        "end_date" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // ── Pins table ──
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "pins" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "content_id" uuid NOT NULL,
        "section" varchar NOT NULL,
        "label" varchar,
        "label_fa" varchar,
        "is_active" boolean NOT NULL DEFAULT true,
        "sort_order" int NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_pins_content" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE
      );
    `);

    // ═══════════════════════════════════════════════
    //  SEED: Import categories from frontend config
    // ═══════════════════════════════════════════════
    await queryRunner.query(`
      INSERT INTO "categories" ("slug", "name_en", "name_fa", "content_type", "description_en", "description_fa", "gradient_colors", "tmdb_params", "show_episodes", "sort_order")
      VALUES
        ('movies-foreign', 'Foreign Movies', 'فیلم‌های خارجی', 'movie',
         'Best foreign movies from around the world with Persian subtitles',
         'بهترین فیلم‌های خارجی از سراسر جهان با زیرنویس فارسی',
         '["#3B82F6","#1D4ED8"]', '{"include_adult":false}', false, 1),

        ('movies-iranian', 'Iranian Movies', 'فیلم‌های ایرانی', 'movie',
         'A selection of the best Iranian cinema',
         'گلچینی از بهترین فیلم‌های سینمای ایران',
         '["#059669","#047857"]', '{"with_original_language":"fa","include_adult":false}', false, 2),

        ('series-foreign', 'Foreign Series', 'سریال‌های خارجی', 'series',
         'Popular TV series from around the world with Persian subtitles',
         'سریال‌های محبوب از سراسر جهان با زیرنویس فارسی',
         '["#8B5CF6","#7C3AED"]', '{"include_adult":false}', false, 3),

        ('series-iranian', 'Iranian Series', 'سریال‌های ایرانی', 'series',
         'Popular Iranian TV series',
         'سریال‌های محبوب تلویزیونی ایران',
         '["#10B981","#059669"]', '{"with_original_language":"fa","include_adult":false}', false, 4),

        ('animation', 'Animation', 'انیمیشن', 'mixed',
         'Best animated movies and series',
         'بهترین انیمیشن‌های سینمایی و سریالی',
         '["#F97316","#EA580C"]', '{"with_genres":"16","include_adult":false}', false, 5),

        ('dubbed', 'Persian Dubbed', 'دوبله فارسی', 'movie',
         'Foreign movies with Persian dubbing',
         'فیلم‌های خارجی با دوبله فارسی',
         '["#EC4899","#DB2777"]', '{"include_adult":false}', false, 6),

        ('anime', 'Anime', 'انیمه', 'series',
         'Best Japanese anime with Persian subtitles',
         'بهترین انیمه‌های ژاپنی با زیرنویس فارسی',
         '["#E11D48","#BE185D"]', '{"with_genres":"16","with_original_language":"ja","include_adult":false}', true, 7)
      ON CONFLICT ("slug") DO NOTHING;
    `);

    // ═══════════════════════════════════════════════
    //  SEED: Import genres from frontend config
    // ═══════════════════════════════════════════════
    await queryRunner.query(`
      INSERT INTO "genres" ("slug", "name_en", "name_fa", "tmdb_genre_id", "category_slugs", "sort_order")
      VALUES
        ('action',       'Action',              'اکشن',              '28',    '["movies-foreign","movies-iranian","animation","dubbed","anime"]', 1),
        ('comedy',       'Comedy',              'کمدی',              '35',    '["movies-foreign","movies-iranian","series-foreign","series-iranian","animation","dubbed","anime"]', 2),
        ('drama',        'Drama',               'درام',              '18',    '["movies-foreign","movies-iranian","series-foreign","series-iranian","anime"]', 3),
        ('thriller',     'Thriller',            'هیجان‌انگیز',       '53',    '["movies-foreign"]', 4),
        ('horror',       'Horror',              'ترسناک',            '27',    '["movies-foreign","anime"]', 5),
        ('sci-fi',       'Sci-Fi',              'علمی‌تخیلی',        '878',   '["movies-foreign","animation","anime"]', 6),
        ('romance',      'Romance',             'عاشقانه',           '10749', '["movies-foreign","movies-iranian","anime"]', 7),
        ('mystery',      'Mystery',             'معمایی',            '9648',  '["movies-foreign","series-foreign"]', 8),
        ('fantasy',      'Fantasy',             'فانتزی',            '14',    '["movies-foreign","animation","anime"]', 9),
        ('animation-genre', 'Animation',        'انیمیشن',           '16',    '["movies-foreign","series-foreign","dubbed"]', 10),
        ('documentary',  'Documentary',         'مستند',             '99',    '["movies-foreign","series-foreign"]', 11),
        ('adventure',    'Adventure',           'ماجراجویی',         '12',    '["movies-foreign","animation","dubbed","anime"]', 12),
        ('family',       'Family',              'خانوادگی',          '10751', '["movies-foreign","movies-iranian","series-foreign","series-iranian","animation","dubbed"]', 13),
        ('historical',   'Historical',          'تاریخی',            '36',    '["movies-foreign","movies-iranian"]', 14),
        ('crime',        'Crime',               'جنایی',             '80',    '["series-foreign","series-iranian"]', 15),
        ('kids',         'Kids',                'کودکان',            '10762', '["series-foreign"]', 16),
        ('reality',      'Reality',             'واقعیت',            '10764', '["series-foreign"]', 17),
        ('war',          'War & Politics',      'جنگی و سیاسی',     '10768', '["series-foreign"]', 18),
        ('slice-of-life','Slice of Life',       'زندگی روزمره',      NULL,    '["anime"]', 19),
        ('sports',       'Sports',              'ورزشی',             NULL,    '["anime"]', 20),
        ('action-adventure', 'Action & Adventure', 'اکشن و ماجراجویی', '10759', '["series-foreign"]', 21),
        ('sci-fi-fantasy',   'Sci-Fi & Fantasy',   'علمی‌تخیلی و فانتزی', '10765', '["series-foreign"]', 22)
      ON CONFLICT ("slug") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "pins";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sliders";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "offers";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "genres";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "categories";`);
  }
}
