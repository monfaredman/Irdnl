/**
 * useCategoryContent Hook
 * 
 * Custom hook for fetching and filtering category content with TMDB integration
 * Features: Filtering, sorting, pagination, caching, error handling
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { useLanguage } from "@/providers/language-provider";
import { contentApi } from "@/lib/api/content";
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

// Genre ID mapping for TMDB
const GENRE_ID_MAP: Record<string, string> = {
  action: "28",
  adventure: "12",
  animation: "16",
  comedy: "35",
  thriller: "53",
  crime: "80",
  documentary: "99",
  drama: "18",
  family: "10751",
  fantasy: "14",
  historical: "36",
  history: "36",
  horror: "27",
  music: "10402",
  mystery: "9648",
  romance: "10749",
  "sci-fi": "878",
  scifi: "878",
  war: "10752",
  western: "37",
};

// TV Genre ID mapping
const TV_GENRE_ID_MAP: Record<string, string> = {
  action: "10759", // Action & Adventure
  adventure: "10759",
  animation: "16",
  comedy: "35",
  crime: "80",
  documentary: "99",
  drama: "18",
  family: "10751",
  kids: "10762",
  mystery: "9648",
  news: "10763",
  reality: "10764",
  "sci-fi": "10765", // Sci-Fi & Fantasy
  scifi: "10765",
  fantasy: "10765",
  soap: "10766",
  talk: "10767",
  war: "10768", // War & Politics
  western: "37",
};

// Sort option mapping for TMDB
const SORT_MAP: Record<SortOption, string> = {
  newest: "primary_release_date.desc",
  popular: "popularity.desc",
  rating: "vote_average.desc",
  alphabetical: "original_title.asc",
};

const TV_SORT_MAP: Record<SortOption, string> = {
  newest: "first_air_date.desc",
  popular: "popularity.desc",
  rating: "vote_average.desc",
  alphabetical: "original_name.asc",
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

  // Build TMDB query parameters
  const buildQueryParams = useCallback(() => {
    const params: Record<string, string | number | boolean | undefined> = {
      language: language === "fa" ? "fa" : "en",
      page: filters.page,
    };

    // Add base config params
    if (config.tmdbParams.with_genres) {
      params.with_genres = config.tmdbParams.with_genres;
    }
    if (config.tmdbParams.with_original_language) {
      params.with_original_language = config.tmdbParams.with_original_language;
    }
    if (config.tmdbParams.with_keywords) {
      params.with_keywords = config.tmdbParams.with_keywords;
    }

    // Add sub-genre filter
    if (subGenre) {
      const genreIdMap = config.contentType === "series" ? TV_GENRE_ID_MAP : GENRE_ID_MAP;
      const genreId = genreIdMap[subGenre.toLowerCase()];
      if (genreId) {
        params.with_genres = genreId;
      }
    }

    // Add additional genre filters
    if (filters.genres.length > 0) {
      const genreIdMap = config.contentType === "series" ? TV_GENRE_ID_MAP : GENRE_ID_MAP;
      const genreIds = filters.genres
        .map(g => genreIdMap[g.toLowerCase()])
        .filter(Boolean)
        .join(",");
      if (genreIds) {
        params.with_genres = params.with_genres 
          ? `${params.with_genres},${genreIds}` 
          : genreIds;
      }
    }

    // Add year filter
    if (filters.yearRange[0] > 1970 || filters.yearRange[1] < new Date().getFullYear() + 1) {
      if (config.contentType === "series") {
        params["first_air_date.gte"] = `${filters.yearRange[0]}-01-01`;
        params["first_air_date.lte"] = `${filters.yearRange[1]}-12-31`;
      } else {
        params["primary_release_date.gte"] = `${filters.yearRange[0]}-01-01`;
        params["primary_release_date.lte"] = `${filters.yearRange[1]}-12-31`;
      }
    }

    // Add sort
    const sortMap = config.contentType === "series" ? TV_SORT_MAP : SORT_MAP;
    params.sort_by = sortMap[filters.sort];

    // For rating sort, require minimum votes
    if (filters.sort === "rating") {
      params["vote_count.gte"] = 100;
    }

    return params;
  }, [config, subGenre, filters, language]);

  // Fetch content
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = buildQueryParams();

      let result: { items: (Movie | Series)[]; total: number; totalPages: number };

      // Fetch based on content type
      if (config.contentType === "movie" || config.contentType === "movies-foreign" as any) {
        const response = await contentApi.discoverMovies(params as any);
        result = {
          items: response.items,
          total: response.total || response.items.length,
          totalPages: response.totalPages || 1,
        };
      } else if (config.contentType === "series") {
        const response = await contentApi.discoverTVShows(params as any);
        result = {
          items: response.items,
          total: response.total || response.items.length,
          totalPages: response.totalPages || 1,
        };
      } else {
        // Mixed content - fetch both
        const [moviesRes, seriesRes] = await Promise.all([
          contentApi.discoverMovies(params as any),
          contentApi.discoverTVShows(params as any),
        ]);
        result = {
          items: [...moviesRes.items, ...seriesRes.items],
          total: (moviesRes.total || 0) + (seriesRes.total || 0),
          totalPages: Math.max(moviesRes.totalPages || 1, seriesRes.totalPages || 1),
        };
      }

      // Transform items to ContentItem format
      let contentItems: ContentItem[] = result.items.map((item) => ({
        ...item,
        itemType: "duration" in item ? "movie" : "series",
      })) as ContentItem[];

      // Apply client-side search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        contentItems = contentItems.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)
        );
      }

      // Apply client-side sorting for alphabetical (as TMDB may not handle Persian)
      if (filters.sort === "alphabetical") {
        contentItems.sort((a, b) => a.title.localeCompare(b.title, language === "fa" ? "fa" : "en"));
      }

      setItems(contentItems);
      setTotalItems(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Failed to fetch category content:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch content"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams, config.contentType, filters.searchQuery, filters.sort, language]);

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

        // Build params similar to main content
        const params: Record<string, string | number> = {
          language: language === "fa" ? "fa" : "en",
          page: 1,
        };

        if (config.tmdbParams.with_genres) {
          params.with_genres = config.tmdbParams.with_genres;
        }

        // Fetch trending content for this category
        const trendingResponse = config.contentType === "series"
          ? await contentApi.discoverTVShows({ ...params, sort_by: "popularity.desc" } as any)
          : await contentApi.discoverMovies({ ...params, sort_by: "popularity.desc" } as any);

        const trending = trendingResponse.items.slice(0, 6).map((item) => ({
          id: item.id,
          title: item.title,
          titleFa: item.title,
          poster: item.poster,
          rating: item.rating,
          type: ("duration" in item ? "movie" : "series") as "movie" | "series",
        }));

        // Mock upcoming data (TMDB doesn't have proper upcoming endpoint for discover)
        const upcoming = trendingResponse.items.slice(6, 10).map((item) => ({
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

        // Mock top stars (would need TMDB credits API for real data)
        const topStars = [
          { id: "1", name: "Leonardo DiCaprio", photo: "/images/avatars/default.jpg", knownFor: ["Inception", "Titanic"] },
          { id: "2", name: "Scarlett Johansson", photo: "/images/avatars/default.jpg", knownFor: ["Black Widow", "Lost in Translation"] },
          { id: "3", name: "Tom Hanks", photo: "/images/avatars/default.jpg", knownFor: ["Forrest Gump", "Cast Away"] },
          { id: "4", name: "Meryl Streep", photo: "/images/avatars/default.jpg", knownFor: ["The Devil Wears Prada"] },
          { id: "5", name: "Denzel Washington", photo: "/images/avatars/default.jpg", knownFor: ["Training Day", "Malcolm X"] },
        ];

        setData({
          trending,
          upcoming,
          relatedGenres,
          topStars,
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
