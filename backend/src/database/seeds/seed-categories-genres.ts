import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from '../../config/typeorm.config';
import { Category } from '../../modules/content/entities/category.entity';
import { Genre } from '../../modules/content/entities/genre.entity';
import { config as loadEnvConfig } from 'dotenv';

loadEnvConfig();
loadEnvConfig({ path: '.env.local', override: true });

/**
 * Seed categories and genres
 * Auto-generated on 2026-02-17T12:32:18.717Z
 * 
 * Categories: 11 parents, 16 children
 * Genres: 22 total
 */
async function seedCategoriesAndGenres() {
  const configLike = {
    get<T = any>(key: string, defaultValue?: T): T {
      return (process.env[key] ?? defaultValue) as T;
    },
  };

  const dataSource = new DataSource({
    ...buildTypeOrmOptions(configLike),
    entities: [Category, Genre],
  } as any);

  await dataSource.initialize();
  console.log('🔌 Database connected for seeding');

  const categoryRepo = dataSource.getRepository(Category);
  const genreRepo = dataSource.getRepository(Genre);

  // ========================================================================
  // GENRES
  // ========================================================================
  console.log('\n📚 Seeding genres...');
  
  const genresData = [
  {
    "slug": "action",
    "nameEn": "Action",
    "nameFa": "اکشن",
    "tmdbGenreId": "28",
    "categorySlugs": [
      "movies-foreign",
      "movies-iranian",
      "animation",
      "dubbed",
      "anime"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 1,
    "isActive": true
  },
  {
    "slug": "comedy",
    "nameEn": "Comedy",
    "nameFa": "کمدی",
    "tmdbGenreId": "35",
    "categorySlugs": [
      "movies-foreign",
      "movies-iranian",
      "series-foreign",
      "series-iranian",
      "animation",
      "dubbed",
      "anime"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 2,
    "isActive": true
  },
  {
    "slug": "drama",
    "nameEn": "Drama",
    "nameFa": "درام",
    "tmdbGenreId": "18",
    "categorySlugs": [
      "movies-foreign",
      "movies-iranian",
      "series-foreign",
      "series-iranian",
      "anime"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 3,
    "isActive": true
  },
  {
    "slug": "thriller",
    "nameEn": "Thriller",
    "nameFa": "هیجان‌انگیز",
    "tmdbGenreId": "53",
    "categorySlugs": [
      "movies-foreign"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 4,
    "isActive": true
  },
  {
    "slug": "horror",
    "nameEn": "Horror",
    "nameFa": "ترسناک",
    "tmdbGenreId": "27",
    "categorySlugs": [
      "movies-foreign",
      "anime"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 5,
    "isActive": true
  },
  {
    "slug": "sci-fi",
    "nameEn": "Sci-Fi",
    "nameFa": "علمی‌تخیلی",
    "tmdbGenreId": "878",
    "categorySlugs": [
      "movies-foreign",
      "animation",
      "anime"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 6,
    "isActive": true
  },
  {
    "slug": "romance",
    "nameEn": "Romance",
    "nameFa": "عاشقانه",
    "tmdbGenreId": "10749",
    "categorySlugs": [
      "movies-foreign",
      "movies-iranian",
      "anime"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 7,
    "isActive": true
  },
  {
    "slug": "mystery",
    "nameEn": "Mystery",
    "nameFa": "معمایی",
    "tmdbGenreId": "9648",
    "categorySlugs": [
      "movies-foreign",
      "series-foreign"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 8,
    "isActive": true
  },
  {
    "slug": "fantasy",
    "nameEn": "Fantasy",
    "nameFa": "فانتزی",
    "tmdbGenreId": "14",
    "categorySlugs": [
      "movies-foreign",
      "animation",
      "anime"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 9,
    "isActive": true
  },
  {
    "slug": "animation-genre",
    "nameEn": "Animation",
    "nameFa": "انیمیشن",
    "tmdbGenreId": "16",
    "categorySlugs": [
      "movies-foreign",
      "series-foreign",
      "dubbed"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 10,
    "isActive": true
  },
  {
    "slug": "documentary",
    "nameEn": "Documentary",
    "nameFa": "مستند",
    "tmdbGenreId": "99",
    "categorySlugs": [
      "movies-foreign",
      "series-foreign"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 11,
    "isActive": true
  },
  {
    "slug": "adventure",
    "nameEn": "Adventure",
    "nameFa": "ماجراجویی",
    "tmdbGenreId": "12",
    "categorySlugs": [
      "movies-foreign",
      "animation",
      "dubbed",
      "anime"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 12,
    "isActive": true
  },
  {
    "slug": "family",
    "nameEn": "Family",
    "nameFa": "خانوادگی",
    "tmdbGenreId": "10751",
    "categorySlugs": [
      "movies-foreign",
      "movies-iranian",
      "series-foreign",
      "series-iranian",
      "animation",
      "dubbed"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 13,
    "isActive": true
  },
  {
    "slug": "historical",
    "nameEn": "Historical",
    "nameFa": "تاریخی",
    "tmdbGenreId": "36",
    "categorySlugs": [
      "movies-foreign",
      "movies-iranian"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 14,
    "isActive": true
  },
  {
    "slug": "crime",
    "nameEn": "Crime",
    "nameFa": "جنایی",
    "tmdbGenreId": "80",
    "categorySlugs": [
      "series-foreign",
      "series-iranian"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 15,
    "isActive": true
  },
  {
    "slug": "kids",
    "nameEn": "Kids",
    "nameFa": "کودکان",
    "tmdbGenreId": "10762",
    "categorySlugs": [
      "series-foreign"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 16,
    "isActive": true
  },
  {
    "slug": "reality",
    "nameEn": "Reality",
    "nameFa": "واقعیت",
    "tmdbGenreId": "10764",
    "categorySlugs": [
      "series-foreign"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 17,
    "isActive": true
  },
  {
    "slug": "war",
    "nameEn": "War & Politics",
    "nameFa": "جنگی و سیاسی",
    "tmdbGenreId": "10768",
    "categorySlugs": [
      "series-foreign"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 18,
    "isActive": true
  },
  {
    "slug": "slice-of-life",
    "nameEn": "Slice of Life",
    "nameFa": "زندگی روزمره",
    "tmdbGenreId": null,
    "categorySlugs": [
      "anime"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 19,
    "isActive": true
  },
  {
    "slug": "sports",
    "nameEn": "Sports",
    "nameFa": "ورزشی",
    "tmdbGenreId": null,
    "categorySlugs": [
      "anime"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 20,
    "isActive": true
  },
  {
    "slug": "action-adventure",
    "nameEn": "Action & Adventure",
    "nameFa": "اکشن و ماجراجویی",
    "tmdbGenreId": "10759",
    "categorySlugs": [
      "series-foreign"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 21,
    "isActive": true
  },
  {
    "slug": "sci-fi-fantasy",
    "nameEn": "Sci-Fi & Fantasy",
    "nameFa": "علمی‌تخیلی و فانتزی",
    "tmdbGenreId": "10765",
    "categorySlugs": [
      "series-foreign"
    ],
    "posterUrl": null,
    "logoUrl": null,
    "backdropUrl": null,
    "sortOrder": 22,
    "isActive": true
  }
];

  for (const genreData of genresData) {
    let existing = await genreRepo.findOne({ where: { slug: genreData.slug } });
    if (existing) {
      Object.assign(existing, genreData);
      await genreRepo.save(existing);
      console.log(`  ✅ Updated: ${genreData.nameFa} (${genreData.slug})`);
    } else {
      const genre = genreRepo.create(genreData);
      await genreRepo.save(genre);
      console.log(`  ✅ Created: ${genreData.nameFa} (${genreData.slug})`);
    }
  }

  // ========================================================================
  // PARENT CATEGORIES
  // ========================================================================
  console.log('\n📁 Seeding parent categories...');
  
  const parentsData = [
  {
    "slug": "foreign",
    "nameEn": "Foreign Movies",
    "nameFa": "فیلم خارجی",
    "contentType": "movie",
    "descriptionEn": "Best foreign movies from around the world",
    "descriptionFa": "بهترین فیلم‌های خارجی از سراسر جهان",
    "gradientColors": [
      "#3B82F6",
      "#1D4ED8"
    ],
    "showInMenu": true,
    "showInLanding": true,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 1,
    "urlPath": "foreign",
    "tmdbParams": {}
  },
  {
    "slug": "movies-foreign",
    "nameEn": "Foreign Movies",
    "nameFa": "فیلم‌های خارجی",
    "contentType": "movie",
    "descriptionEn": "Best foreign movies from around the world with Persian subtitles",
    "descriptionFa": "بهترین فیلم‌های خارجی از سراسر جهان با زیرنویس فارسی",
    "gradientColors": [
      "#3B82F6",
      "#1D4ED8"
    ],
    "showInMenu": true,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 1,
    "urlPath": null,
    "tmdbParams": {
      "include_adult": false
    }
  },
  {
    "slug": "movies-iranian",
    "nameEn": "Iranian Movies",
    "nameFa": "فیلم‌های ایرانی",
    "contentType": "movie",
    "descriptionEn": "A selection of the best Iranian cinema",
    "descriptionFa": "گلچینی از بهترین فیلم‌های سینمای ایران",
    "gradientColors": [
      "#059669",
      "#047857"
    ],
    "showInMenu": true,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 2,
    "urlPath": null,
    "tmdbParams": {
      "include_adult": false,
      "with_original_language": "fa"
    }
  },
  {
    "slug": "iranian",
    "nameEn": "Iranian Movies",
    "nameFa": "فیلم ایرانی",
    "contentType": "movie",
    "descriptionEn": "Best Iranian cinema",
    "descriptionFa": "گلچینی از بهترین فیلم‌های سینمای ایران",
    "gradientColors": [
      "#059669",
      "#047857"
    ],
    "showInMenu": true,
    "showInLanding": true,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 2,
    "urlPath": "iranian",
    "tmdbParams": {}
  },
  {
    "slug": "series",
    "nameEn": "Series",
    "nameFa": "سریال",
    "contentType": "series",
    "descriptionEn": "Popular TV series",
    "descriptionFa": "سریال‌های محبوب",
    "gradientColors": [
      "#8B5CF6",
      "#7C3AED"
    ],
    "showInMenu": true,
    "showInLanding": true,
    "showEpisodes": false,
    "isActive": false,
    "sortOrder": 3,
    "urlPath": "series",
    "tmdbParams": {}
  },
  {
    "slug": "animation",
    "nameEn": "Animation",
    "nameFa": "انیمیشن",
    "contentType": "mixed",
    "descriptionEn": "Best animated movies and series",
    "descriptionFa": "بهترین انیمیشن‌ها",
    "gradientColors": [
      "#F97316",
      "#EA580C"
    ],
    "showInMenu": true,
    "showInLanding": true,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 4,
    "urlPath": "animation",
    "tmdbParams": {
      "with_genres": "16",
      "include_adult": false
    }
  },
  {
    "slug": "series-iranian",
    "nameEn": "Iranian Series",
    "nameFa": "سریال‌های ایرانی",
    "contentType": "series",
    "descriptionEn": "Popular Iranian TV series",
    "descriptionFa": "سریال‌های محبوب تلویزیونی ایران",
    "gradientColors": [
      "#10B981",
      "#059669"
    ],
    "showInMenu": true,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": false,
    "sortOrder": 4,
    "urlPath": null,
    "tmdbParams": {
      "include_adult": false,
      "with_original_language": "fa"
    }
  },
  {
    "slug": "dubbed",
    "nameEn": "Persian Dubbed",
    "nameFa": "دوبله فارسی",
    "contentType": "movie",
    "descriptionEn": "Foreign movies with Persian dubbing",
    "descriptionFa": "فیلم‌های خارجی با دوبله فارسی",
    "gradientColors": [
      "#EC4899",
      "#DB2777"
    ],
    "showInMenu": true,
    "showInLanding": true,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 5,
    "urlPath": "dubbed",
    "tmdbParams": {
      "include_adult": false
    }
  },
  {
    "slug": "anime",
    "nameEn": "Anime",
    "nameFa": "انیمه",
    "contentType": "series",
    "descriptionEn": "Best Japanese anime",
    "descriptionFa": "بهترین انیمه‌های ژاپنی",
    "gradientColors": [
      "#E11D48",
      "#BE185D"
    ],
    "showInMenu": true,
    "showInLanding": true,
    "showEpisodes": true,
    "isActive": true,
    "sortOrder": 6,
    "urlPath": "anime",
    "tmdbParams": {
      "with_genres": "16",
      "include_adult": false,
      "with_original_language": "ja"
    }
  },
  {
    "slug": "other",
    "nameEn": "Other",
    "nameFa": "سایر",
    "contentType": "mixed",
    "descriptionEn": "Other categories",
    "descriptionFa": "سایر دسته‌بندی‌ها",
    "gradientColors": [
      "#6B7280",
      "#4B5563"
    ],
    "showInMenu": true,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 7,
    "urlPath": "other",
    "tmdbParams": {}
  },
  {
    "slug": "content-korean",
    "nameEn": "korean content",
    "nameFa": "محتوای کره ای",
    "contentType": "mixed",
    "descriptionEn": "korean content korean content",
    "descriptionFa": "محتوای کره ای محتوای کره ای",
    "gradientColors": [
      "#CA2A30",
      "#062F88"
    ],
    "showInMenu": true,
    "showInLanding": true,
    "showEpisodes": true,
    "isActive": true,
    "sortOrder": 50,
    "urlPath": null,
    "tmdbParams": {}
  }
];

  const savedParents: Record<string, Category> = {};
  for (const parentData of parentsData) {
    let existing = await categoryRepo.findOne({ where: { slug: parentData.slug } });
    if (existing) {
      Object.assign(existing, parentData);
      savedParents[parentData.slug] = await categoryRepo.save(existing);
      console.log(`  ✅ Updated: ${parentData.nameFa} (${parentData.slug})`);
    } else {
      const cat = categoryRepo.create(parentData);
      savedParents[parentData.slug] = await categoryRepo.save(cat);
      console.log(`  ✅ Created: ${parentData.nameFa} (${parentData.slug})`);
    }
  }

  // ========================================================================
  // CHILD CATEGORIES
  // ========================================================================
  console.log('\n📂 Seeding child categories...');
  
  const childrenData = [
  {
    "slug": "foreign-action",
    "nameEn": "Action",
    "nameFa": "اکشن",
    "parentSlug": "foreign",
    "contentType": "movie",
    "descriptionEn": "Action under Foreign Movies",
    "descriptionFa": "اکشن - زیرمجموعه فیلم خارجی",
    "gradientColors": [
      "#DC2626",
      "#991B1B"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 1,
    "urlPath": "action",
    "tmdbParams": {
      "with_genres": "28"
    }
  },
  {
    "slug": "other-top250",
    "nameEn": "Top 250 IMDb",
    "nameFa": "250 فیلم برتر IMDb",
    "parentSlug": "other",
    "contentType": "movie",
    "descriptionEn": "Top 250 IMDb under Other",
    "descriptionFa": "250 فیلم برتر IMDb - زیرمجموعه سایر",
    "gradientColors": [
      "#F59E0B",
      "#D97706"
    ],
    "showInMenu": false,
    "showInLanding": true,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 1,
    "urlPath": "top-250",
    "tmdbParams": {}
  },
  {
    "slug": "series-foreign",
    "nameEn": "Foreign Series",
    "nameFa": "سریال خارجی",
    "parentSlug": "series",
    "contentType": "series",
    "descriptionEn": "Foreign Series under Series",
    "descriptionFa": "سریال خارجی - زیرمجموعه سریال",
    "gradientColors": [
      "#8B5CF6",
      "#7C3AED"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 1,
    "urlPath": "foreign",
    "tmdbParams": {
      "include_adult": false
    }
  },
  {
    "slug": "series-turkish",
    "nameEn": "Turkish Series",
    "nameFa": "سریال ترکی",
    "parentSlug": "series",
    "contentType": "series",
    "descriptionEn": "Turkish Series under Series",
    "descriptionFa": "سریال ترکی - زیرمجموعه سریال",
    "gradientColors": [
      "#EF4444",
      "#DC2626"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 2,
    "urlPath": "turkish",
    "tmdbParams": {
      "with_original_language": "tr"
    }
  },
  {
    "slug": "other-collections",
    "nameEn": "Collections",
    "nameFa": "کالکشن",
    "parentSlug": "other",
    "contentType": "mixed",
    "descriptionEn": "Collections under Other",
    "descriptionFa": "کالکشن - زیرمجموعه سایر",
    "gradientColors": [
      "#8B5CF6",
      "#7C3AED"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 2,
    "urlPath": "collections",
    "tmdbParams": {}
  },
  {
    "slug": "foreign-horror",
    "nameEn": "Horror",
    "nameFa": "ترسناک",
    "parentSlug": "foreign",
    "contentType": "movie",
    "descriptionEn": "Horror under Foreign Movies",
    "descriptionFa": "ترسناک - زیرمجموعه فیلم خارجی",
    "gradientColors": [
      "#7C3AED",
      "#5B21B6"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 2,
    "urlPath": "horror",
    "tmdbParams": {
      "with_genres": "27"
    }
  },
  {
    "slug": "foreign-indian",
    "nameEn": "Indian",
    "nameFa": "هندی",
    "parentSlug": "foreign",
    "contentType": "movie",
    "descriptionEn": "Indian under Foreign Movies",
    "descriptionFa": "هندی - زیرمجموعه فیلم خارجی",
    "gradientColors": [
      "#F97316",
      "#EA580C"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": false,
    "sortOrder": 3,
    "urlPath": "indian",
    "tmdbParams": {
      "with_original_language": "hi"
    }
  },
  {
    "slug": "series-korean",
    "nameEn": "Korean Series",
    "nameFa": "سریال کره‌ای",
    "parentSlug": "series",
    "contentType": "series",
    "descriptionEn": "Korean Series under Series",
    "descriptionFa": "سریال کره‌ای - زیرمجموعه سریال",
    "gradientColors": [
      "#EC4899",
      "#DB2777"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": false,
    "sortOrder": 3,
    "urlPath": "korean",
    "tmdbParams": {
      "with_original_language": "ko"
    }
  },
  {
    "slug": "other-coming-soon",
    "nameEn": "Coming Soon",
    "nameFa": "به زودی",
    "parentSlug": "other",
    "contentType": "mixed",
    "descriptionEn": "Coming Soon under Other",
    "descriptionFa": "به زودی - زیرمجموعه سایر",
    "gradientColors": [
      "#14B8A6",
      "#0D9488"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 3,
    "urlPath": "coming-soon",
    "tmdbParams": {}
  },
  {
    "slug": "foreign-romance",
    "nameEn": "Romance",
    "nameFa": "عاشقانه",
    "parentSlug": "foreign",
    "contentType": "movie",
    "descriptionEn": "Romance under Foreign Movies",
    "descriptionFa": "عاشقانه - زیرمجموعه فیلم خارجی",
    "gradientColors": [
      "#EC4899",
      "#DB2777"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": false,
    "sortOrder": 4,
    "urlPath": "romance",
    "tmdbParams": {
      "with_genres": "10749"
    }
  },
  {
    "slug": "foreign-war",
    "nameEn": "War",
    "nameFa": "جنگی",
    "parentSlug": "foreign",
    "contentType": "movie",
    "descriptionEn": "War under Foreign Movies",
    "descriptionFa": "جنگی - زیرمجموعه فیلم خارجی",
    "gradientColors": [
      "#78716C",
      "#57534E"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": false,
    "sortOrder": 5,
    "urlPath": "war",
    "tmdbParams": {
      "with_genres": "10752"
    }
  },
  {
    "slug": "foreign-comedy",
    "nameEn": "Comedy",
    "nameFa": "کمدی",
    "parentSlug": "foreign",
    "contentType": "movie",
    "descriptionEn": "Comedy under Foreign Movies",
    "descriptionFa": "کمدی - زیرمجموعه فیلم خارجی",
    "gradientColors": [
      "#F59E0B",
      "#D97706"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": false,
    "sortOrder": 6,
    "urlPath": "comedy",
    "tmdbParams": {
      "with_genres": "35"
    }
  },
  {
    "slug": "foreign-drama",
    "nameEn": "Drama",
    "nameFa": "درام",
    "parentSlug": "foreign",
    "contentType": "movie",
    "descriptionEn": "Drama under Foreign Movies",
    "descriptionFa": "درام - زیرمجموعه فیلم خارجی",
    "gradientColors": [
      "#6366F1",
      "#4F46E5"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 7,
    "urlPath": "drama",
    "tmdbParams": {
      "with_genres": "18"
    }
  },
  {
    "slug": "foreign-thriller",
    "nameEn": "Thriller",
    "nameFa": "هیجان‌انگیز",
    "parentSlug": "foreign",
    "contentType": "movie",
    "descriptionEn": "Thriller under Foreign Movies",
    "descriptionFa": "هیجان‌انگیز - زیرمجموعه فیلم خارجی",
    "gradientColors": [
      "#1F2937",
      "#111827"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 8,
    "urlPath": "thriller",
    "tmdbParams": {
      "with_genres": "53"
    }
  },
  {
    "slug": "foreign-crime",
    "nameEn": "Crime",
    "nameFa": "جنایی",
    "parentSlug": "foreign",
    "contentType": "movie",
    "descriptionEn": "Crime under Foreign Movies",
    "descriptionFa": "جنایی - زیرمجموعه فیلم خارجی",
    "gradientColors": [
      "#374151",
      "#1F2937"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 9,
    "urlPath": "crime",
    "tmdbParams": {
      "with_genres": "80"
    }
  },
  {
    "slug": "foreign-adventure",
    "nameEn": "Adventure",
    "nameFa": "حادثه‌ای",
    "parentSlug": "foreign",
    "contentType": "movie",
    "descriptionEn": "Adventure under Foreign Movies",
    "descriptionFa": "حادثه‌ای - زیرمجموعه فیلم خارجی",
    "gradientColors": [
      "#22C55E",
      "#16A34A"
    ],
    "showInMenu": false,
    "showInLanding": false,
    "showEpisodes": false,
    "isActive": true,
    "sortOrder": 10,
    "urlPath": "adventure",
    "tmdbParams": {
      "with_genres": "12"
    }
  }
];

  for (const childData of childrenData) {
    const parent = savedParents[childData.parentSlug];
    if (!parent) {
      console.warn(`  ⚠️  Parent "${childData.parentSlug}" not found for ${childData.slug}, skipping`);
      continue;
    }

    const fullChild = {
      ...childData,
      parentId: parent.id,
    };
    delete (fullChild as any).parentSlug; // Remove temporary field

    let existing = await categoryRepo.findOne({ where: { slug: childData.slug } });
    if (existing) {
      Object.assign(existing, fullChild);
      await categoryRepo.save(existing);
      console.log(`    └─ Updated: ${childData.nameFa} (${childData.slug}) → parent: ${parent.slug}`);
    } else {
      const cat = categoryRepo.create(fullChild);
      await categoryRepo.save(cat);
      console.log(`    └─ Created: ${childData.nameFa} (${childData.slug}) → parent: ${parent.slug}`);
    }
  }

  console.log('\n🎉 Seeding complete!');
  console.log(`   • ${parentsData.length} parent categories`);
  console.log(`   • ${childrenData.length} child categories`);
  console.log(`   • ${genresData.length} genres`);

  await dataSource.destroy();
}

seedCategoriesAndGenres().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
