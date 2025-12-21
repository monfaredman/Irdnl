/**
 * Category Configurations
 * 
 * Unified configurations for all genre/category pages
 * Each config defines: titles, TMDB params, gradients, sub-genres
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
  // Foreign Movies
  "movies-foreign": {
    id: "movies-foreign",
    contentType: "movie",
    titleFa: "فیلم‌های خارجی",
    titleEn: "Foreign Movies",
    descriptionFa: "بهترین فیلم‌های خارجی از سراسر جهان با زیرنویس فارسی",
    descriptionEn: "Best foreign movies from around the world with Persian subtitles",
    gradientColors: ["#3B82F6", "#1D4ED8"],
    tmdbParams: {
      include_adult: false,
    },
    subGenres: commonMovieGenres,
  },

  // Iranian Movies
  "movies-iranian": {
    id: "movies-iranian",
    contentType: "movie",
    titleFa: "فیلم‌های ایرانی",
    titleEn: "Iranian Movies",
    descriptionFa: "گلچینی از بهترین فیلم‌های سینمای ایران",
    descriptionEn: "A selection of the best Iranian cinema",
    gradientColors: ["#059669", "#047857"],
    tmdbParams: {
      with_original_language: "fa",
      include_adult: false,
    },
    subGenres: commonMovieGenres.filter(g => 
      ["drama", "comedy", "romance", "thriller", "historical", "family"].includes(g.slug)
    ),
  },

  // Foreign Series
  "series-foreign": {
    id: "series-foreign",
    contentType: "series",
    titleFa: "سریال‌های خارجی",
    titleEn: "Foreign Series",
    descriptionFa: "سریال‌های محبوب از سراسر جهان با زیرنویس فارسی",
    descriptionEn: "Popular TV series from around the world with Persian subtitles",
    gradientColors: ["#8B5CF6", "#7C3AED"],
    tmdbParams: {
      include_adult: false,
    },
    subGenres: commonSeriesGenres,
  },

  // Iranian Series
  "series-iranian": {
    id: "series-iranian",
    contentType: "series",
    titleFa: "سریال‌های ایرانی",
    titleEn: "Iranian Series",
    descriptionFa: "سریال‌های محبوب تلویزیونی ایران",
    descriptionEn: "Popular Iranian TV series",
    gradientColors: ["#10B981", "#059669"],
    tmdbParams: {
      with_original_language: "fa",
      include_adult: false,
    },
    subGenres: commonSeriesGenres.filter(g =>
      ["drama", "comedy", "crime", "family", "historical"].includes(g.slug)
    ),
  },

  // Animation
  "animation": {
    id: "animation",
    contentType: "mixed",
    titleFa: "انیمیشن",
    titleEn: "Animation",
    descriptionFa: "بهترین انیمیشن‌های سینمایی و سریالی",
    descriptionEn: "Best animated movies and series",
    gradientColors: ["#F97316", "#EA580C"],
    tmdbParams: {
      with_genres: "16",
      include_adult: false,
    },
    subGenres: [
      { slug: "action", nameEn: "Action", nameFa: "اکشن" },
      { slug: "adventure", nameEn: "Adventure", nameFa: "ماجراجویی" },
      { slug: "comedy", nameEn: "Comedy", nameFa: "کمدی" },
      { slug: "family", nameEn: "Family", nameFa: "خانوادگی" },
      { slug: "fantasy", nameEn: "Fantasy", nameFa: "فانتزی" },
      { slug: "sci-fi", nameEn: "Sci-Fi", nameFa: "علمی‌تخیلی" },
    ],
  },

  // Dubbed
  "dubbed": {
    id: "dubbed",
    contentType: "movie",
    titleFa: "دوبله فارسی",
    titleEn: "Persian Dubbed",
    descriptionFa: "فیلم‌های خارجی با دوبله فارسی",
    descriptionEn: "Foreign movies with Persian dubbing",
    gradientColors: ["#EC4899", "#DB2777"],
    tmdbParams: {
      include_adult: false,
    },
    subGenres: commonMovieGenres.filter(g =>
      ["action", "comedy", "animation", "family", "adventure", "fantasy"].includes(g.slug)
    ),
  },

  // Anime
  "anime": {
    id: "anime",
    contentType: "series",
    titleFa: "انیمه",
    titleEn: "Anime",
    descriptionFa: "بهترین انیمه‌های ژاپنی با زیرنویس فارسی",
    descriptionEn: "Best Japanese anime with Persian subtitles",
    gradientColors: ["#E11D48", "#BE185D"],
    tmdbParams: {
      with_genres: "16",
      with_original_language: "ja",
      include_adult: false,
    },
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

  // Add category type (Movies/Series)
  if (categoryId.startsWith("movies")) {
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
  } else if (categoryId.startsWith("series")) {
    breadcrumbs.push({ label: "Series", labelFa: "سریال‌ها", href: "/series", isActive: false });
    
    if (categoryId === "series-foreign") {
      breadcrumbs.push({
        label: "Foreign",
        labelFa: "خارجی",
        href: "/series/foreign",
        isActive: !subGenre,
      });
    } else if (categoryId === "series-iranian") {
      breadcrumbs.push({
        label: "Iranian",
        labelFa: "ایرانی",
        href: "/series/iranian",
        isActive: !subGenre,
      });
    }
  } else {
    // Standalone categories
    breadcrumbs.push({
      label: config.titleEn,
      labelFa: config.titleFa,
      href: `/${categoryId}`,
      isActive: !subGenre,
    });
  }

  // Add sub-genre if present
  if (subGenre) {
    const subGenreInfo = getSubGenre(categoryId, subGenre);
    if (subGenreInfo) {
      breadcrumbs.push({
        label: subGenreInfo.nameEn,
        labelFa: subGenreInfo.nameFa,
        href: `${breadcrumbs[breadcrumbs.length - 1].href}/${subGenre}`,
        isActive: true,
      });
    }
  }

  return breadcrumbs;
}

export default categoryConfigs;
