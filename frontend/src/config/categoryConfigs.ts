/**
 * Category Configurations
 * 
 * Unified configurations for all genre/category pages.
 * These serve as local fallback definitions matching the DB's parent-child
 * category structure. The canonical data lives in the database.
 * 
 * Menu Structure:
 * • فیلم خارجی  (children: اکشن, ترسناک, هندی, عاشقانه, جنگی, کمدی, درام, هیجان‌انگیز, جنایی, حادثه‌ای)
 * • فیلم ایرانی  (no children)
 * • سریال       (children: سریال خارجی, سریال ترکی, سریال کره‌ای)
 * • انیمیشن     (no children)
 * • دوبله فارسی (no children)
 * • انیمه       (no children)
 * • سایر        (children: 250 فیلم برتر IMDb, کالکشن, به زودی)
 */

import type { CategoryConfig, SubGenre } from "@/types/category";

// ============================================================================
// COMMON SUB-GENRES
// ============================================================================

const commonMovieGenres: SubGenre[] = [
  { slug: "action", nameEn: "Action", nameFa: "اکشن", tmdbGenreId: "28" },
  { slug: "comedy", nameEn: "Comedy", nameFa: "کمدی", tmdbGenreId: "35" },
  { slug: "drama", nameEn: "Drama", nameFa: "درام", tmdbGenreId: "18" },
  { slug: "thriller", nameEn: "Thriller", nameFa: "هیجان‌انگیز", tmdbGenreId: "53" },
  { slug: "horror", nameEn: "Horror", nameFa: "ترسناک", tmdbGenreId: "27" },
  { slug: "sci-fi", nameEn: "Sci-Fi", nameFa: "علمی‌تخیلی", tmdbGenreId: "878" },
  { slug: "romance", nameEn: "Romance", nameFa: "عاشقانه", tmdbGenreId: "10749" },
  { slug: "mystery", nameEn: "Mystery", nameFa: "معمایی", tmdbGenreId: "9648" },
  { slug: "fantasy", nameEn: "Fantasy", nameFa: "فانتزی", tmdbGenreId: "14" },
  { slug: "animation", nameEn: "Animation", nameFa: "انیمیشن", tmdbGenreId: "16" },
  { slug: "documentary", nameEn: "Documentary", nameFa: "مستند", tmdbGenreId: "99" },
  { slug: "adventure", nameEn: "Adventure", nameFa: "ماجراجویی", tmdbGenreId: "12" },
  { slug: "family", nameEn: "Family", nameFa: "خانوادگی", tmdbGenreId: "10751" },
  { slug: "historical", nameEn: "Historical", nameFa: "تاریخی", tmdbGenreId: "36" },
];

const commonSeriesGenres: SubGenre[] = [
  { slug: "action", nameEn: "Action & Adventure", nameFa: "اکشن و ماجراجویی", tmdbGenreId: "10759" },
  { slug: "comedy", nameEn: "Comedy", nameFa: "کمدی", tmdbGenreId: "35" },
  { slug: "drama", nameEn: "Drama", nameFa: "درام", tmdbGenreId: "18" },
  { slug: "crime", nameEn: "Crime", nameFa: "جنایی", tmdbGenreId: "80" },
  { slug: "mystery", nameEn: "Mystery", nameFa: "معمایی", tmdbGenreId: "9648" },
  { slug: "sci-fi", nameEn: "Sci-Fi & Fantasy", nameFa: "علمی‌تخیلی و فانتزی", tmdbGenreId: "10765" },
  { slug: "animation", nameEn: "Animation", nameFa: "انیمیشن", tmdbGenreId: "16" },
  { slug: "documentary", nameEn: "Documentary", nameFa: "مستند", tmdbGenreId: "99" },
  { slug: "family", nameEn: "Family", nameFa: "خانوادگی", tmdbGenreId: "10751" },
  { slug: "kids", nameEn: "Kids", nameFa: "کودکان", tmdbGenreId: "10762" },
  { slug: "reality", nameEn: "Reality", nameFa: "واقعیت", tmdbGenreId: "10764" },
  { slug: "war", nameEn: "War & Politics", nameFa: "جنگی و سیاسی", tmdbGenreId: "10768" },
];

// ============================================================================
// CATEGORY CONFIGURATIONS
// ============================================================================

export const categoryConfigs: Record<string, CategoryConfig> = {
  // ========================================================================
  // فیلم خارجی — Foreign Movies (parent with children)
  // ========================================================================
  "foreign": {
    id: "foreign" as any,
    contentType: "movie",
    titleFa: "فیلم خارجی",
    titleEn: "Foreign Movies",
    descriptionFa: "بهترین فیلم‌های خارجی از سراسر جهان با زیرنویس فارسی",
    descriptionEn: "Best foreign movies from around the world with Persian subtitles",
    gradientColors: ["#3B82F6", "#1D4ED8"],
    tmdbParams: { include_adult: false },
    subGenres: commonMovieGenres,
  },
  // Children of فیلم خارجی
  "foreign-action": {
    id: "foreign-action" as any,
    contentType: "movie",
    titleFa: "اکشن",
    titleEn: "Action",
    descriptionFa: "فیلم‌های اکشن خارجی",
    descriptionEn: "Foreign action movies",
    gradientColors: ["#DC2626", "#991B1B"],
    tmdbParams: { with_genres: "28", include_adult: false },
  },
  "foreign-horror": {
    id: "foreign-horror" as any,
    contentType: "movie",
    titleFa: "ترسناک",
    titleEn: "Horror",
    descriptionFa: "فیلم‌های ترسناک خارجی",
    descriptionEn: "Foreign horror movies",
    gradientColors: ["#7C3AED", "#5B21B6"],
    tmdbParams: { with_genres: "27", include_adult: false },
  },
  "foreign-indian": {
    id: "foreign-indian" as any,
    contentType: "movie",
    titleFa: "هندی",
    titleEn: "Indian",
    descriptionFa: "فیلم‌های هندی",
    descriptionEn: "Indian movies",
    gradientColors: ["#F97316", "#EA580C"],
    tmdbParams: { with_original_language: "hi", include_adult: false },
  },
  "foreign-romance": {
    id: "foreign-romance" as any,
    contentType: "movie",
    titleFa: "عاشقانه",
    titleEn: "Romance",
    descriptionFa: "فیلم‌های عاشقانه خارجی",
    descriptionEn: "Foreign romance movies",
    gradientColors: ["#EC4899", "#DB2777"],
    tmdbParams: { with_genres: "10749", include_adult: false },
  },
  "foreign-war": {
    id: "foreign-war" as any,
    contentType: "movie",
    titleFa: "جنگی",
    titleEn: "War",
    descriptionFa: "فیلم‌های جنگی خارجی",
    descriptionEn: "Foreign war movies",
    gradientColors: ["#78716C", "#57534E"],
    tmdbParams: { with_genres: "10752", include_adult: false },
  },
  "foreign-comedy": {
    id: "foreign-comedy" as any,
    contentType: "movie",
    titleFa: "کمدی",
    titleEn: "Comedy",
    descriptionFa: "فیلم‌های کمدی خارجی",
    descriptionEn: "Foreign comedy movies",
    gradientColors: ["#F59E0B", "#D97706"],
    tmdbParams: { with_genres: "35", include_adult: false },
  },
  "foreign-drama": {
    id: "foreign-drama" as any,
    contentType: "movie",
    titleFa: "درام",
    titleEn: "Drama",
    descriptionFa: "فیلم‌های درام خارجی",
    descriptionEn: "Foreign drama movies",
    gradientColors: ["#6366F1", "#4F46E5"],
    tmdbParams: { with_genres: "18", include_adult: false },
  },
  "foreign-thriller": {
    id: "foreign-thriller" as any,
    contentType: "movie",
    titleFa: "هیجان‌انگیز",
    titleEn: "Thriller",
    descriptionFa: "فیلم‌های هیجان‌انگیز خارجی",
    descriptionEn: "Foreign thriller movies",
    gradientColors: ["#1F2937", "#111827"],
    tmdbParams: { with_genres: "53", include_adult: false },
  },
  "foreign-crime": {
    id: "foreign-crime" as any,
    contentType: "movie",
    titleFa: "جنایی",
    titleEn: "Crime",
    descriptionFa: "فیلم‌های جنایی خارجی",
    descriptionEn: "Foreign crime movies",
    gradientColors: ["#374151", "#1F2937"],
    tmdbParams: { with_genres: "80", include_adult: false },
  },
  "foreign-adventure": {
    id: "foreign-adventure" as any,
    contentType: "movie",
    titleFa: "حادثه‌ای",
    titleEn: "Adventure",
    descriptionFa: "فیلم‌های حادثه‌ای خارجی",
    descriptionEn: "Foreign adventure movies",
    gradientColors: ["#22C55E", "#16A34A"],
    tmdbParams: { with_genres: "12", include_adult: false },
  },

  // ========================================================================
  // فیلم ایرانی — Iranian Movies (no children)
  // ========================================================================
  "iranian": {
    id: "iranian" as any,
    contentType: "movie",
    titleFa: "فیلم ایرانی",
    titleEn: "Iranian Movies",
    descriptionFa: "گلچینی از بهترین فیلم‌های سینمای ایران",
    descriptionEn: "A selection of the best Iranian cinema",
    gradientColors: ["#059669", "#047857"],
    tmdbParams: { with_original_language: "fa", include_adult: false },
    subGenres: commonMovieGenres.filter(g =>
      ["drama", "comedy", "romance", "thriller", "historical", "family", "action"].includes(g.slug)
    ),
  },

  // ========================================================================
  // سریال — Series (parent with children)
  // ========================================================================
  "series": {
    id: "series" as any,
    contentType: "series",
    titleFa: "سریال",
    titleEn: "Series",
    descriptionFa: "سریال‌های محبوب از سراسر جهان",
    descriptionEn: "Popular TV series from around the world",
    gradientColors: ["#8B5CF6", "#7C3AED"],
    tmdbParams: { include_adult: false },
    subGenres: commonSeriesGenres,
  },
  // Children of سریال
  "series-foreign": {
    id: "series-foreign" as any,
    contentType: "series",
    titleFa: "سریال خارجی",
    titleEn: "Foreign Series",
    descriptionFa: "سریال‌های خارجی محبوب",
    descriptionEn: "Popular foreign TV series",
    gradientColors: ["#8B5CF6", "#7C3AED"],
    tmdbParams: { include_adult: false },
    subGenres: commonSeriesGenres,
  },
  "series-turkish": {
    id: "series-turkish" as any,
    contentType: "series",
    titleFa: "سریال ترکی",
    titleEn: "Turkish Series",
    descriptionFa: "سریال‌های ترکی محبوب",
    descriptionEn: "Popular Turkish TV series",
    gradientColors: ["#EF4444", "#DC2626"],
    tmdbParams: { with_original_language: "tr", include_adult: false },
    subGenres: commonSeriesGenres.filter(g =>
      ["drama", "comedy", "crime", "romance", "family"].includes(g.slug)
    ),
  },
  "series-korean": {
    id: "series-korean" as any,
    contentType: "series",
    titleFa: "سریال کره‌ای",
    titleEn: "Korean Series",
    descriptionFa: "سریال‌های کره‌ای محبوب",
    descriptionEn: "Popular Korean TV series",
    gradientColors: ["#EC4899", "#DB2777"],
    tmdbParams: { with_original_language: "ko", include_adult: false },
    subGenres: commonSeriesGenres.filter(g =>
      ["drama", "comedy", "romance", "action", "mystery", "fantasy"].includes(g.slug)
    ),
  },

  // ========================================================================
  // انیمیشن — Animation (no children)
  // ========================================================================
  "animation": {
    id: "animation" as any,
    contentType: "mixed",
    titleFa: "انیمیشن",
    titleEn: "Animation",
    descriptionFa: "بهترین انیمیشن‌های سینمایی و سریالی",
    descriptionEn: "Best animated movies and series",
    gradientColors: ["#F97316", "#EA580C"],
    tmdbParams: { with_genres: "16", include_adult: false },
    subGenres: [
      { slug: "action", nameEn: "Action", nameFa: "اکشن" },
      { slug: "adventure", nameEn: "Adventure", nameFa: "ماجراجویی" },
      { slug: "comedy", nameEn: "Comedy", nameFa: "کمدی" },
      { slug: "family", nameEn: "Family", nameFa: "خانوادگی" },
      { slug: "fantasy", nameEn: "Fantasy", nameFa: "فانتزی" },
      { slug: "sci-fi", nameEn: "Sci-Fi", nameFa: "علمی‌تخیلی" },
    ],
  },

  // ========================================================================
  // دوبله فارسی — Persian Dubbed (no children)
  // ========================================================================
  "dubbed": {
    id: "dubbed" as any,
    contentType: "mixed",
    isDubbed: true,
    titleFa: "دوبله فارسی",
    titleEn: "Persian Dubbed",
    descriptionFa: "فیلم‌ها و سریال‌های خارجی با دوبله فارسی",
    descriptionEn: "Foreign movies & series with Persian dubbing",
    gradientColors: ["#EC4899", "#DB2777"],
    tmdbParams: { include_adult: false },
    subGenres: commonMovieGenres.filter(g =>
      ["action", "comedy", "animation", "family", "adventure", "fantasy"].includes(g.slug)
    ),
  },

  // ========================================================================
  // انیمه — Anime (no children)
  // ========================================================================
  "anime": {
    id: "anime" as any,
    contentType: "series",
    titleFa: "انیمه",
    titleEn: "Anime",
    descriptionFa: "بهترین انیمه‌های ژاپنی با زیرنویس فارسی",
    descriptionEn: "Best Japanese anime with Persian subtitles",
    gradientColors: ["#E11D48", "#BE185D"],
    tmdbParams: { with_genres: "16", with_original_language: "ja", include_adult: false },
    subGenres: [
      { slug: "action", nameEn: "Action", nameFa: "اکشن" },
      { slug: "adventure", nameEn: "Adventure", nameFa: "ماجراجویی" },
      { slug: "comedy", nameEn: "Comedy", nameFa: "کمدی" },
      { slug: "drama", nameEn: "Drama", nameFa: "درام" },
      { slug: "fantasy", nameEn: "Fantasy", nameFa: "فانتزی" },
      { slug: "horror", nameEn: "Horror", nameFa: "ترسناک" },
      { slug: "romance", nameEn: "Romance", nameFa: "عاشقانه" },
      { slug: "sci-fi", nameEn: "Sci-Fi", nameFa: "علمی‌تخیلی" },
      { slug: "slice-of-life", nameEn: "Slice of Life", nameFa: "زندگی روزمره" },
      { slug: "sports", nameEn: "Sports", nameFa: "ورزشی" },
    ],
    showEpisodes: true,
  },

  // ========================================================================
  // سایر — Other (parent with children)
  // ========================================================================
  "other": {
    id: "other" as any,
    contentType: "mixed",
    titleFa: "سایر",
    titleEn: "Other",
    descriptionFa: "سایر دسته‌بندی‌ها",
    descriptionEn: "Other categories",
    gradientColors: ["#6B7280", "#4B5563"],
    tmdbParams: {},
  },
  "other-top250": {
    id: "other-top250" as any,
    contentType: "movie",
    titleFa: "250 فیلم برتر IMDb",
    titleEn: "Top 250 IMDb",
    descriptionFa: "250 فیلم برتر IMDb",
    descriptionEn: "Top 250 IMDb movies",
    gradientColors: ["#F59E0B", "#D97706"],
    tmdbParams: { sort_by: "vote_average.desc" },
  },
  "other-collections": {
    id: "other-collections" as any,
    contentType: "mixed",
    titleFa: "کالکشن",
    titleEn: "Collections",
    descriptionFa: "مجموعه‌های فیلم و سریال",
    descriptionEn: "Movie and series collections",
    gradientColors: ["#8B5CF6", "#7C3AED"],
    tmdbParams: {},
  },
  "other-coming-soon": {
    id: "other-coming-soon" as any,
    contentType: "mixed",
    titleFa: "به زودی",
    titleEn: "Coming Soon",
    descriptionFa: "فیلم‌ها و سریال‌های به زودی",
    descriptionEn: "Upcoming movies and series",
    gradientColors: ["#14B8A6", "#0D9488"],
    tmdbParams: {},
  },

  // ========================================================================
  // Legacy IDs (backward compatibility)
  // ========================================================================
  "movies-foreign": {
    id: "movies-foreign" as any,
    contentType: "movie",
    titleFa: "فیلم خارجی",
    titleEn: "Foreign Movies",
    descriptionFa: "بهترین فیلم‌های خارجی از سراسر جهان با زیرنویس فارسی",
    descriptionEn: "Best foreign movies from around the world with Persian subtitles",
    gradientColors: ["#3B82F6", "#1D4ED8"],
    tmdbParams: { include_adult: false },
    subGenres: commonMovieGenres,
  },
  "movies-iranian": {
    id: "movies-iranian" as any,
    contentType: "movie",
    titleFa: "فیلم ایرانی",
    titleEn: "Iranian Movies",
    descriptionFa: "گلچینی از بهترین فیلم‌های سینمای ایران",
    descriptionEn: "A selection of the best Iranian cinema",
    gradientColors: ["#059669", "#047857"],
    tmdbParams: { with_original_language: "fa", include_adult: false },
    subGenres: commonMovieGenres.filter(g =>
      ["drama", "comedy", "romance", "thriller", "historical", "family"].includes(g.slug)
    ),
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get category config by ID
 */
export function getCategoryConfig(id: string): CategoryConfig | undefined {
  return categoryConfigs[id];
}

/**
 * Get all category configs
 */
export function getAllCategoryConfigs(): CategoryConfig[] {
  return Object.values(categoryConfigs);
}

/**
 * Get sub-genre by slug within a category
 */
export function getSubGenre(categoryId: string, genreSlug: string): SubGenre | undefined {
  const config = categoryConfigs[categoryId];
  return config?.subGenres?.find(g => g.slug === genreSlug);
}

/**
 * Generate breadcrumbs for a category page
 * Supports both new parent-child IDs and legacy category IDs
 */
export function generateBreadcrumbs(
  categoryId: string,
  subGenre?: string
): { label: string; labelFa: string; href: string; isActive: boolean }[] {
  const config = categoryConfigs[categoryId];
  if (!config) return [];

  const breadcrumbs: { label: string; labelFa: string; href: string; isActive: boolean }[] = [
    { label: "Home", labelFa: "خانه", href: "/", isActive: false },
  ];

  // Determine if this is a child category by checking if the ID contains a dash
  // and the parent part exists as a separate config
  const parts = categoryId.split("-");
  const parentId = parts[0];
  const parentConfig = parts.length > 1 ? categoryConfigs[parentId] : null;

  if (parentConfig && parts.length > 1) {
    // This is a child category
    breadcrumbs.push({
      label: parentConfig.titleEn,
      labelFa: parentConfig.titleFa,
      href: `/movies/${parentId}`,
      isActive: false,
    });
    breadcrumbs.push({
      label: config.titleEn,
      labelFa: config.titleFa,
      href: `/movies/${parentId}/${parts.slice(1).join("-")}`,
      isActive: !subGenre,
    });
  } else if (categoryId.startsWith("movies")) {
    // Legacy: movies-foreign, movies-iranian
    breadcrumbs.push({ label: "Movies", labelFa: "فیلم‌ها", href: "/movies", isActive: false });
    if (categoryId === "movies-foreign") {
      breadcrumbs.push({
        label: "Foreign",
        labelFa: "خارجی",
        href: "/movies/foreign",
        isActive: !subGenre,
      });
    } else if (categoryId === "movies-iranian") {
      breadcrumbs.push({
        label: "Iranian",
        labelFa: "ایرانی",
        href: "/movies/iranian",
        isActive: !subGenre,
      });
    }
  } else {
    // Top-level categories (animation, dubbed, anime, iranian, etc.)
    breadcrumbs.push({
      label: config.titleEn,
      labelFa: config.titleFa,
      href: `/movies/${categoryId}`,
      isActive: !subGenre,
    });
  }

  // Add sub-genre if present
  if (subGenre) {
    const subGenreInfo = getSubGenre(categoryId, subGenre);
    if (subGenreInfo) {
      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
      breadcrumbs.push({
        label: subGenreInfo.nameEn,
        labelFa: subGenreInfo.nameFa,
        href: `${lastBreadcrumb.href}/${subGenre}`,
        isActive: true,
      });
    }
  }

  return breadcrumbs;
}

export default categoryConfigs;
