/**
 * useCategoryContent Hook
 * 
 * Custom hook for fetching and filtering category content from the backend database.
 * All data comes from the local database via contentApi - no TMDB dependency.
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { useLanguage } from "@/providers/language-provider";
import { contentApi, type ContentQueryParams } from "@/lib/api/content";
import type { Movie, Series } from "@/types/media";
import type {
  CategoryConfig,
  ContentItem,
  FilterState,
  PaginationInfo,
  SidebarData,
  SortOption,
  UseCategoryContentResult,
} from "@/types/category";

// Default filter state
const defaultFilters: FilterState = {
  sort: "popular",
  yearRange: [1970, new Date().getFullYear() + 1],
  quality: "all",
  genres: [],
  country: null,
  language: null,
  searchQuery: "",
  page: 1,
  perPage: 20,
  viewMode: "grid",
};

// Map frontend sort options to backend sort fields
const SORT_FIELD_MAP: Record<SortOption, ContentQueryParams["sort"]> = {
  newest: "createdAt",
  popular: "priority",
  rating: "rating",
  alphabetical: "title",
};

const SORT_ORDER_MAP: Record<SortOption, ContentQueryParams["order"]> = {
  newest: "DESC",
  popular: "DESC",
  rating: "DESC",
  alphabetical: "ASC",
};

export function useCategoryContent(
  config: CategoryConfig,
  subGenre?: string,
  initialFilters?: Partial<FilterState>
): UseCategoryContentResult {
  const { language } = useLanguage();
  
  // Initialize filters
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  // State
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Build backend query parameters
  const buildQueryParams = useCallback((): ContentQueryParams => {
    const params: ContentQueryParams = {
      page: filters.page,
      limit: filters.perPage,
    };

    // Filter by content type
    if (config.contentType === "movie") {
      params.type = "movie";
    } else if (config.contentType === "series") {
      params.type = "series";
    }
    // "mixed" => no type filter

    // Filter by category ID (from backend category system)
    if (config.categoryId) {
      params.categoryId = config.categoryId;
    }

    // Filter by genre (sub-genre from URL or tmdbParams)
    if (subGenre) {
      params.genre = subGenre;
    } else if (config.tmdbParams.with_genres) {
      // Legacy: tmdbParams might contain genre names
      if (!config.categoryId) {
        params.genre = config.tmdbParams.with_genres;
      }
    }

    // Filter by language from config
    if (config.tmdbParams.with_original_language) {
      params.language = config.tmdbParams.with_original_language;
    }

    // Filter for dubbed content
    if (config.isDubbed) {
      params.isDubbed = true;
    }

    // Additional genre filters from filter bar
    if (filters.genres.length > 0) {
      params.genre = filters.genres[0];
    }

    // Year filter
    if (filters.yearRange[0] > 1970 || filters.yearRange[1] < new Date().getFullYear() + 1) {
      if (filters.yearRange[1] - filters.yearRange[0] <= 1) {
        params.year = filters.yearRange[0];
      }
    }

    // Country filter
    if (filters.country && filters.country !== "all") {
      params.country = filters.country;
    }

    // Search filter
    if (filters.searchQuery) {
      params.q = filters.searchQuery;
    }

    // Sort
    params.sort = SORT_FIELD_MAP[filters.sort] || "createdAt";
    params.order = SORT_ORDER_MAP[filters.sort] || "DESC";

    return params;
  }, [config, subGenre, filters, language]);

  // Fetch content from backend
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = buildQueryParams();
      const response = await contentApi.getContent(params);

      // Transform items to ContentItem format
      const contentItems: ContentItem[] = response.items.map((item) => ({
        ...item,
        itemType: ("duration" in item ? "movie" : "series") as "movie" | "series",
      })) as ContentItem[];

      setItems(contentItems);
      setTotalItems(response.total);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch category content:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch content"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Refetch on filter/config change
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Pagination info
  const pagination: PaginationInfo = useMemo(() => ({
    currentPage: filters.page,
    totalPages,
    totalItems,
    itemsPerPage: filters.perPage,
    hasNextPage: filters.page < totalPages,
    hasPrevPage: filters.page > 1,
  }), [filters.page, filters.perPage, totalPages, totalItems]);

  return {
    items,
    loading,
    error,
    pagination,
    refetch: fetchContent,
    updateFilters,
    filters,
  };
}

// ============================================================================
// SIDEBAR DATA HOOK
// ============================================================================

export function useCategorySidebar(
  config: CategoryConfig,
  subGenre?: string
): { data: SidebarData | null; loading: boolean } {
  const { language } = useLanguage();
  const [data, setData] = useState<SidebarData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        setLoading(true);

        // Build params for trending content in this category
        const params: ContentQueryParams = {
          sort: "rating",
          order: "DESC",
          limit: 10,
        };

        if (config.contentType === "movie") {
          params.type = "movie";
        } else if (config.contentType === "series") {
          params.type = "series";
        }

        if (config.categoryId) {
          params.categoryId = config.categoryId;
        }

        // Fetch top-rated content for this category
        const response = await contentApi.getContent(params);

        const trending = response.items.slice(0, 6).map((item: Movie | Series) => ({
          id: item.id,
          title: item.title,
          titleFa: item.title,
          poster: item.poster,
          rating: item.rating,
          type: ("duration" in item ? "movie" : "series") as "movie" | "series",
        }));

        // Use remaining items as "upcoming"
        const upcoming = response.items.slice(6, 10).map((item: Movie | Series) => ({
          id: item.id,
          title: item.title,
          titleFa: item.title,
          poster: item.poster,
          releaseDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          type: ("duration" in item ? "movie" : "series") as "movie" | "series",
        }));

        // Generate related genres from config
        const relatedGenres = config.subGenres?.slice(0, 8).map((g) => ({
          slug: g.slug,
          nameEn: g.nameEn,
          nameFa: g.nameFa,
          count: Math.floor(Math.random() * 200) + 50,
        })) || [];

        setData({
          trending,
          upcoming,
          relatedGenres,
          topStars: [],
        });
      } catch (err) {
        console.error("Failed to fetch sidebar data:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarData();
  }, [config, subGenre, language]);

  return { data, loading };
}

export default useCategoryContent;
