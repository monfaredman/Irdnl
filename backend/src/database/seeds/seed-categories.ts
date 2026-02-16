import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from '../../config/typeorm.config';
import { Category } from '../../modules/content/entities/category.entity';
import { config as loadEnvConfig } from 'dotenv';

loadEnvConfig();
loadEnvConfig({ path: '.env.local', override: true });

/**
 * Seed the categories table with the menu structure:
 * 
 * • فیلم خارجی (children: اکشن, ترسناک, هندی, عاشقانه, جنگی, کمدی, درام, هیجان‌انگیز, جنایی, حادثه‌ای)
 * • فیلم ایرانی (no children)
 * • سریال (children: سریال خارجی, سریال ترکی, سریال کره‌ای)
 * • انیمیشن (no children)
 * • دوبله فارسی (no children)
 * • انیمه (no children)
 * • سایر (children: 250 فیلم برتر IMDb, کالکشن, به زودی)
 */
async function seedCategories() {
  const configLike = {
    get<T = any>(key: string, defaultValue?: T): T {
      return (process.env[key] ?? defaultValue) as T;
    },
  };

  const dataSource = new DataSource({
    ...buildTypeOrmOptions(configLike),
    entities: [Category],
  } as any);

  await dataSource.initialize();
  console.log('🔌 Database connected for category seeding');

  const categoryRepo = dataSource.getRepository(Category);

  // Clear existing categories (optional – comment out to preserve existing data)
  // await categoryRepo.clear();

  // ========================================================================
  // TOP-LEVEL PARENT CATEGORIES (showInMenu = true)
  // ========================================================================

  const parents: Partial<Category>[] = [
    {
      slug: 'foreign',
      nameEn: 'Foreign Movies',
      nameFa: 'فیلم خارجی',
      contentType: 'movie',
      descriptionEn: 'Best foreign movies from around the world',
      descriptionFa: 'بهترین فیلم‌های خارجی از سراسر جهان',
      gradientColors: ['#3B82F6', '#1D4ED8'],
      showInMenu: true,
      showInLanding: true,
      isActive: true,
      sortOrder: 1,
      urlPath: 'foreign',
      parentId: null,
    },
    {
      slug: 'iranian',
      nameEn: 'Iranian Movies',
      nameFa: 'فیلم ایرانی',
      contentType: 'movie',
      descriptionEn: 'Best Iranian cinema',
      descriptionFa: 'گلچینی از بهترین فیلم‌های سینمای ایران',
      gradientColors: ['#059669', '#047857'],
      showInMenu: true,
      showInLanding: true,
      isActive: true,
      sortOrder: 2,
      urlPath: 'iranian',
      parentId: null,
    },
    {
      slug: 'series',
      nameEn: 'Series',
      nameFa: 'سریال',
      contentType: 'series',
      descriptionEn: 'Popular TV series',
      descriptionFa: 'سریال‌های محبوب',
      gradientColors: ['#8B5CF6', '#7C3AED'],
      showInMenu: true,
      showInLanding: true,
      isActive: true,
      sortOrder: 3,
      urlPath: 'series',
      parentId: null,
    },
    {
      slug: 'animation',
      nameEn: 'Animation',
      nameFa: 'انیمیشن',
      contentType: 'mixed',
      descriptionEn: 'Best animated movies and series',
      descriptionFa: 'بهترین انیمیشن‌ها',
      gradientColors: ['#F97316', '#EA580C'],
      showInMenu: true,
      showInLanding: true,
      isActive: true,
      sortOrder: 4,
      urlPath: 'animation',
      parentId: null,
    },
    {
      slug: 'dubbed',
      nameEn: 'Persian Dubbed',
      nameFa: 'دوبله فارسی',
      contentType: 'movie',
      descriptionEn: 'Foreign movies with Persian dubbing',
      descriptionFa: 'فیلم‌های خارجی با دوبله فارسی',
      gradientColors: ['#EC4899', '#DB2777'],
      showInMenu: true,
      showInLanding: true,
      isActive: true,
      sortOrder: 5,
      urlPath: 'dubbed',
      parentId: null,
    },
    {
      slug: 'anime',
      nameEn: 'Anime',
      nameFa: 'انیمه',
      contentType: 'series',
      descriptionEn: 'Best Japanese anime',
      descriptionFa: 'بهترین انیمه‌های ژاپنی',
      gradientColors: ['#E11D48', '#BE185D'],
      showInMenu: true,
      showInLanding: true,
      showEpisodes: true,
      isActive: true,
      sortOrder: 6,
      urlPath: 'anime',
      parentId: null,
    },
    {
      slug: 'other',
      nameEn: 'Other',
      nameFa: 'سایر',
      contentType: 'mixed',
      descriptionEn: 'Other categories',
      descriptionFa: 'سایر دسته‌بندی‌ها',
      gradientColors: ['#6B7280', '#4B5563'],
      showInMenu: true,
      showInLanding: false,
      isActive: true,
      sortOrder: 7,
      urlPath: 'other',
      parentId: null,
    },
  ];

  // Upsert parents
  const savedParents: Record<string, Category> = {};
  for (const parentData of parents) {
    let existing = await categoryRepo.findOne({ where: { slug: parentData.slug! } });
    if (existing) {
      Object.assign(existing, parentData);
      savedParents[parentData.slug!] = await categoryRepo.save(existing);
    } else {
      const cat = categoryRepo.create(parentData);
      savedParents[parentData.slug!] = await categoryRepo.save(cat);
    }
    console.log(`  ✅ Parent: ${parentData.nameFa} (${parentData.slug})`);
  }

  // ========================================================================
  // CHILD CATEGORIES
  // ========================================================================

  interface ChildDef {
    parentSlug: string;
    children: Partial<Category>[];
  }

  const childDefs: ChildDef[] = [
    {
      parentSlug: 'foreign',
      children: [
        { slug: 'foreign-action',    nameEn: 'Action',    nameFa: 'اکشن',        urlPath: 'action',    contentType: 'movie', gradientColors: ['#DC2626', '#991B1B'], sortOrder: 1, tmdbParams: { with_genres: '28' } },
        { slug: 'foreign-horror',    nameEn: 'Horror',    nameFa: 'ترسناک',       urlPath: 'horror',    contentType: 'movie', gradientColors: ['#7C3AED', '#5B21B6'], sortOrder: 2, tmdbParams: { with_genres: '27' } },
        { slug: 'foreign-indian',    nameEn: 'Indian',    nameFa: 'هندی',         urlPath: 'indian',    contentType: 'movie', gradientColors: ['#F97316', '#EA580C'], sortOrder: 3, tmdbParams: { with_original_language: 'hi' } },
        { slug: 'foreign-romance',   nameEn: 'Romance',   nameFa: 'عاشقانه',      urlPath: 'romance',   contentType: 'movie', gradientColors: ['#EC4899', '#DB2777'], sortOrder: 4, tmdbParams: { with_genres: '10749' } },
        { slug: 'foreign-war',       nameEn: 'War',       nameFa: 'جنگی',         urlPath: 'war',       contentType: 'movie', gradientColors: ['#78716C', '#57534E'], sortOrder: 5, tmdbParams: { with_genres: '10752' } },
        { slug: 'foreign-comedy',    nameEn: 'Comedy',    nameFa: 'کمدی',         urlPath: 'comedy',    contentType: 'movie', gradientColors: ['#F59E0B', '#D97706'], sortOrder: 6, tmdbParams: { with_genres: '35' } },
        { slug: 'foreign-drama',     nameEn: 'Drama',     nameFa: 'درام',         urlPath: 'drama',     contentType: 'movie', gradientColors: ['#6366F1', '#4F46E5'], sortOrder: 7, tmdbParams: { with_genres: '18' } },
        { slug: 'foreign-thriller',  nameEn: 'Thriller',  nameFa: 'هیجان‌انگیز',  urlPath: 'thriller',  contentType: 'movie', gradientColors: ['#1F2937', '#111827'], sortOrder: 8, tmdbParams: { with_genres: '53' } },
        { slug: 'foreign-crime',     nameEn: 'Crime',     nameFa: 'جنایی',        urlPath: 'crime',     contentType: 'movie', gradientColors: ['#374151', '#1F2937'], sortOrder: 9, tmdbParams: { with_genres: '80' } },
        { slug: 'foreign-adventure', nameEn: 'Adventure', nameFa: 'حادثه‌ای',     urlPath: 'adventure', contentType: 'movie', gradientColors: ['#22C55E', '#16A34A'], sortOrder: 10, tmdbParams: { with_genres: '12' } },
      ],
    },
    {
      parentSlug: 'series',
      children: [
        { slug: 'series-foreign', nameEn: 'Foreign Series', nameFa: 'سریال خارجی',   urlPath: 'foreign', contentType: 'series', gradientColors: ['#8B5CF6', '#7C3AED'], sortOrder: 1 },
        { slug: 'series-turkish', nameEn: 'Turkish Series', nameFa: 'سریال ترکی',    urlPath: 'turkish', contentType: 'series', gradientColors: ['#EF4444', '#DC2626'], sortOrder: 2, tmdbParams: { with_original_language: 'tr' } },
        { slug: 'series-korean',  nameEn: 'Korean Series',  nameFa: 'سریال کره‌ای',  urlPath: 'korean',  contentType: 'series', gradientColors: ['#EC4899', '#DB2777'], sortOrder: 3, tmdbParams: { with_original_language: 'ko' } },
      ],
    },
    {
      parentSlug: 'other',
      children: [
        { slug: 'other-top250',      nameEn: 'Top 250 IMDb',  nameFa: '250 فیلم برتر IMDb', urlPath: 'top-250',      contentType: 'movie', gradientColors: ['#F59E0B', '#D97706'], sortOrder: 1 },
        { slug: 'other-collections', nameEn: 'Collections',   nameFa: 'کالکشن',              urlPath: 'collections',  contentType: 'mixed', gradientColors: ['#8B5CF6', '#7C3AED'], sortOrder: 2 },
        { slug: 'other-coming-soon', nameEn: 'Coming Soon',   nameFa: 'به زودی',              urlPath: 'coming-soon',  contentType: 'mixed', gradientColors: ['#14B8A6', '#0D9488'], sortOrder: 3 },
      ],
    },
  ];

  for (const def of childDefs) {
    const parent = savedParents[def.parentSlug];
    if (!parent) {
      console.warn(`  ⚠️  Parent "${def.parentSlug}" not found, skipping children`);
      continue;
    }

    for (const childData of def.children) {
      const fullChild: Partial<Category> = {
        ...childData,
        parentId: parent.id,
        showInMenu: false,    // Children don't appear as top-level menu items
        showInLanding: false,
        isActive: true,
        descriptionEn: `${childData.nameEn} under ${parent.nameEn}`,
        descriptionFa: `${childData.nameFa} - زیرمجموعه ${parent.nameFa}`,
      };

      let existing = await categoryRepo.findOne({ where: { slug: childData.slug! } });
      if (existing) {
        Object.assign(existing, fullChild);
        await categoryRepo.save(existing);
      } else {
        const cat = categoryRepo.create(fullChild);
        await categoryRepo.save(cat);
      }
      console.log(`    └─ Child: ${childData.nameFa} (${childData.slug}) → parent: ${parent.slug}`);
    }
  }

  console.log('\n🎉 Category seeding complete!');
  console.log(`   ${parents.length} parents, ${childDefs.reduce((acc, d) => acc + d.children.length, 0)} children`);

  await dataSource.destroy();
}

seedCategories().catch((err) => {
  console.error('❌ Category seeding failed:', err);
  process.exit(1);
});
