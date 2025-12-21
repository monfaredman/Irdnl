/**
 * Category Page Types
 * 
 * TypeScript interfaces for the unified Premium Liquid Glass category system
 */

import type { Movie, Series, Genre } from "./media";

// ============================================================================
// CATEGORY CONFIGURATION
// ============================================================================

export type CategoryType = 
  | "movies-foreign"
  | "movies-iranian"
  | "series-foreign"
  | "series-iranian"
  | "animation"
  | "dubbed"
  | "anime";

export type ContentType = "movie" | "series" | "mixed";

export interface CategoryConfig {
  /** Unique identifier for this category */
  id: CategoryType;
  /** Category type (for TMDB queries) */
  contentType: ContentType;
  /** Persian title */
  titleFa: string;
  /** English title */
  titleEn: string;
  /** Persian description */
  descriptionFa: string;
  /** English description */
  descriptionEn: string;
  /** Gradient colors for hero background [start, end] */
  gradientColors: [string, string];
  /** Icon name for category */
  icon?: string;
  /** TMDB query parameters */
  tmdbParams: TMDBQueryParams;
  /** Available sub-genres for this category */
  subGenres?: SubGenre[];
  /** Show episodes count instead of runtime */
  showEpisodes?: boolean;
  /** Additional metadata fields to display */
  metadataFields?: string[];
}

export interface SubGenre {
  slug: string;
  nameEn: string;
  nameFa: string;
  tmdbGenreId?: string;
}

// ============================================================================
// TMDB QUERY PARAMETERS
// ============================================================================

export interface TMDBQueryParams {
  /** TMDB genre IDs (comma-separated for multiple) */
  with_genres?: string;
  /** Original language filter (e.g., "fa" for Persian) */
  with_original_language?: string;
  /** Keywords filter */
  with_keywords?: string;
  /** Exclude adult content */
  include_adult?: boolean;
  /** Sort by field */
  sort_by?: string;
  /** Region filter */
  region?: string;
}

// ============================================================================
// FILTER STATE
// ============================================================================

export type SortOption = "newest" | "popular" | "rating" | "alphabetical";
export type QualityFilter = "all" | "4k" | "hd" | "sd";
export type ViewMode = "grid" | "list";

export interface FilterState {
  /** Sort option */
  sort: SortOption;
  /** Year range [start, end] */
  yearRange: [number, number];
  /** Quality filter */
  quality: QualityFilter;
  /** Selected genres */
  genres: string[];
  /** Country filter */
  country: string | null;
  /** Language filter */
  language: string | null;
  /** Search query within category */
  searchQuery: string;
  /** Current page */
  page: number;
  /** Items per page */
  perPage: number;
  /** View mode */
  viewMode: ViewMode;
}

export interface FilterPreset {
  id: string;
  name: string;
  nameFa: string;
  filters: Partial<FilterState>;
}

// ============================================================================
// BREADCRUMB
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  labelFa: string;
  href: string;
  isActive?: boolean;
}

// ============================================================================
// SIDEBAR SECTIONS
// ============================================================================

export interface TrendingItem {
  id: string;
  title: string;
  titleFa?: string;
  poster: string;
  rating: number;
  type: "movie" | "series";
}

export interface UpcomingItem {
  id: string;
  title: string;
  titleFa?: string;
  poster: string;
  releaseDate: string;
  type: "movie" | "series";
}

export interface RelatedGenre {
  slug: string;
  nameEn: string;
  nameFa: string;
  count: number;
}

export interface TopStar {
  id: string;
  name: string;
  nameFa?: string;
  photo: string;
  knownFor: string[];
}

export interface SidebarData {
  trending: TrendingItem[];
  upcoming: UpcomingItem[];
  relatedGenres: RelatedGenre[];
  topStars: TopStar[];
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ============================================================================
// CONTENT ITEM (Unified)
// ============================================================================

export type ContentItem = 
  | (Movie & { itemType: "movie" })
  | (Series & { itemType: "series" });

// ============================================================================
// CATEGORY PAGE PROPS
// ============================================================================

export interface CategoryPageProps {
  /** Category configuration */
  config: CategoryConfig;
  /** Current sub-genre (if any) */
  subGenre?: string;
  /** Initial filter state */
  initialFilters?: Partial<FilterState>;
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

export interface UseCategoryContentResult {
  /** Content items */
  items: ContentItem[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Pagination info */
  pagination: PaginationInfo;
  /** Refetch function */
  refetch: () => Promise<void>;
  /** Update filters */
  updateFilters: (filters: Partial<FilterState>) => void;
  /** Current filter state */
  filters: FilterState;
}

export interface UseCategorySidebarResult {
  /** Sidebar data */
  data: SidebarData | null;
  /** Loading state */
  loading: boolean;
}

// ============================================================================
// GENRE COLORS (for dynamic gradients)
// ============================================================================

export const genreGradients: Record<string, [string, string]> = {
  action: ["#DC2626", "#991B1B"],
  comedy: ["#F59E0B", "#D97706"],
  drama: ["#6366F1", "#4F46E5"],
  thriller: ["#1F2937", "#111827"],
  horror: ["#7C3AED", "#5B21B6"],
  "sci-fi": ["#06B6D4", "#0891B2"],
  romance: ["#EC4899", "#DB2777"],
  mystery: ["#8B5CF6", "#7C3AED"],
  fantasy: ["#10B981", "#059669"],
  animation: ["#F97316", "#EA580C"],
  documentary: ["#14B8A6", "#0D9488"],
  adventure: ["#22C55E", "#16A34A"],
  family: ["#3B82F6", "#2563EB"],
  historical: ["#A16207", "#854D0E"],
  anime: ["#E11D48", "#BE185D"],
  default: ["#F59E0B", "#D97706"],
};

// ============================================================================
// YEAR OPTIONS
// ============================================================================

export const yearOptions = {
  min: 1970,
  max: new Date().getFullYear() + 1,
  presets: [
    { label: "2024-Now", labelFa: "۲۰۲۴ تا کنون", range: [2024, 2025] as [number, number] },
    { label: "2020-2024", labelFa: "۲۰۲۰-۲۰۲۴", range: [2020, 2024] as [number, number] },
    { label: "2010-2020", labelFa: "۲۰۱۰-۲۰۲۰", range: [2010, 2020] as [number, number] },
    { label: "2000-2010", labelFa: "۲۰۰۰-۲۰۱۰", range: [2000, 2010] as [number, number] },
    { label: "Classic", labelFa: "کلاسیک", range: [1970, 2000] as [number, number] },
  ],
};

// ============================================================================
// SORT OPTIONS
// ============================================================================

export const sortOptions: { value: SortOption; labelEn: string; labelFa: string }[] = [
  { value: "newest", labelEn: "Newest", labelFa: "جدیدترین" },
  { value: "popular", labelEn: "Most Popular", labelFa: "محبوب‌ترین" },
  { value: "rating", labelEn: "Highest Rated", labelFa: "بهترین امتیاز" },
  { value: "alphabetical", labelEn: "A-Z", labelFa: "الفبایی" },
];

// ============================================================================
// QUALITY OPTIONS
// ============================================================================

export const qualityOptions: { value: QualityFilter; labelEn: string; labelFa: string }[] = [
  { value: "all", labelEn: "All", labelFa: "همه" },
  { value: "4k", labelEn: "4K Ultra HD", labelFa: "۴K" },
  { value: "hd", labelEn: "HD 1080p", labelFa: "HD" },
  { value: "sd", labelEn: "SD", labelFa: "SD" },
];
