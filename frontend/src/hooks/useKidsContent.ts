/**
 * useKidsContent Hook
 * 
 * Custom hook for fetching kids-friendly content from TMDB
 * Features: Age-based filtering, safety ratings, educational content
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { useLanguage } from "@/providers/language-provider";
import { tmdbClient, mapTMDBMovieToMovie, mapTMDBTVShowToSeries } from "@/lib/tmdb-service";
import type { Movie, Series } from "@/types/media";

// TMDB Genre IDs
const KIDS_GENRE_IDS = {
  animation: 16,
  family: 10751,
  kidsTV: 10762,  // Kids (TV)
};

// Age range types
export type AgeRange = "all" | "3-5" | "6-9" | "10-12";

// Kids category types
export interface KidsCategory {
  id: string;
  nameEn: string;
  nameFa: string;
  icon: string;
  color: string;
  keywords?: string[];
  genreIds?: number[];
}

// Predefined kids categories
export const KIDS_CATEGORIES: KidsCategory[] = [
  {
    id: "animals",
    nameEn: "Animal Adventures",
    nameFa: "انیمیشن‌های حیوانات",
    icon: "🐾",
    color: "#22C55E",
    keywords: ["animals", "zoo", "pets"],
  },
  {
    id: "educational",
    nameEn: "Educational Stories",
    nameFa: "داستان‌های آموزشی",
    icon: "📚",
    color: "#3B82F6",
    keywords: ["learning", "school", "science"],
  },
  {
    id: "music",
    nameEn: "Music & Songs",
    nameFa: "موسیقی و آهنگ",
    icon: "🎵",
    color: "#EC4899",
    keywords: ["music", "sing", "dance"],
  },
  {
    id: "science",
    nameEn: "Science & Discovery",
    nameFa: "علم و کشف",
    icon: "🔬",
    color: "#8B5CF6",
    keywords: ["science", "space", "robot"],
  },
  {
    id: "classics",
    nameEn: "Classic Cartoons",
    nameFa: "کارتون‌های کلاسیک",
    icon: "🎬",
    color: "#F59E0B",
    keywords: ["classic", "disney"],
  },
  {
    id: "iranian",
    nameEn: "Iranian Kids Shows",
    nameFa: "سریال‌های ایرانی کودک",
    icon: "🇮🇷",
    color: "#EF4444",
    keywords: [],
  },
];

// Popular kids characters
export interface KidsCharacter {
  id: string;
  name: string;
  nameFa: string;
  image: string;
  color: string;
  franchise: string;
  tmdbId?: number;
}

export const POPULAR_CHARACTERS: KidsCharacter[] = [
  { id: "elsa", name: "Elsa", nameFa: "السا", image: "/images/avatars/avatar-1.jpg", color: "#87CEEB", franchise: "Frozen" },
  { id: "woody", name: "Woody", nameFa: "وودی", image: "/images/avatars/avatar-2.jpg", color: "#8B4513", franchise: "Toy Story" },
  { id: "nemo", name: "Nemo", nameFa: "نمو", image: "/images/avatars/avatar-3.jpg", color: "#FF6347", franchise: "Finding Nemo" },
  { id: "simba", name: "Simba", nameFa: "سیمبا", image: "/images/avatars/avatar-4.jpg", color: "#FFD700", franchise: "Lion King" },
  { id: "peppa", name: "Peppa Pig", nameFa: "پپا پیگ", image: "/images/avatars/avatar-1.jpg", color: "#FF69B4", franchise: "Peppa Pig" },
  { id: "paw", name: "Chase", nameFa: "چیس", image: "/images/avatars/avatar-2.jpg", color: "#1E90FF", franchise: "PAW Patrol" },
  { id: "minion", name: "Minions", nameFa: "مینیون‌ها", image: "/images/avatars/avatar-3.jpg", color: "#FFD700", franchise: "Minions" },
  { id: "lightning", name: "Lightning McQueen", nameFa: "لایتنینگ مک‌کوئین", image: "/images/avatars/avatar-4.jpg", color: "#FF0000", franchise: "Cars" },
];

// Educational badges
export interface EducationalBadge {
  id: string;
  labelEn: string;
  labelFa: string;
  color: string;
}

export const EDUCATIONAL_BADGES: EducationalBadge[] = [
  { id: "math", labelEn: "Math Learning", labelFa: "یادگیری ریاضی", color: "#3B82F6" },
  { id: "friendship", labelEn: "Friendship", labelFa: "دوستی", color: "#EC4899" },
  { id: "creativity", labelEn: "Creativity", labelFa: "خلاقیت", color: "#8B5CF6" },
  { id: "nature", labelEn: "Nature", labelFa: "طبیعت", color: "#22C55E" },
  { id: "teamwork", labelEn: "Teamwork", labelFa: "کار گروهی", color: "#F59E0B" },
  { id: "problem-solving", labelEn: "Problem Solving", labelFa: "حل مسئله", color: "#EF4444" },
];

interface KidsContentResult {
  movies: Movie[];
  series: Series[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseKidsContentOptions {
  ageRange?: AgeRange;
  category?: string;
  page?: number;
  limit?: number;
}

// Main hook for kids content
export function useKidsContent(options: UseKidsContentOptions = {}): KidsContentResult {
  const { language } = useLanguage();
  const { ageRange = "all", category, page = 1, limit = 20 } = options;
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get genre IDs based on age range
  const getGenreIds = useCallback(() => {
    // For kids, always include Animation (16) and Family (10751)
    return `${KIDS_GENRE_IDS.animation},${KIDS_GENRE_IDS.family}`;
  }, []);

  // Get vote average filter based on age (younger = higher rating threshold)
  const getVoteThreshold = useCallback(() => {
    switch (ageRange) {
      case "3-5": return 7.0;
      case "6-9": return 6.5;
      case "10-12": return 6.0;
      default: return 6.0;
    }
  }, [ageRange]);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const genreIds = getGenreIds();
      
      // Fetch both movies and TV shows for kids
      const [movieResponse, tvResponse] = await Promise.all([
        tmdbClient.discoverMovies({
          language,
          page,
          with_genres: genreIds,
          sort_by: "popularity.desc",
        }),
        tmdbClient.discoverTVShows({
          language,
          page,
          with_genres: `${KIDS_GENRE_IDS.animation}|${KIDS_GENRE_IDS.family}|${KIDS_GENRE_IDS.kidsTV}`,
          sort_by: "popularity.desc",
        }),
      ]);

      // Filter by vote average for quality
      const voteThreshold = getVoteThreshold();
      
      const filteredMovies = movieResponse.results
        .filter((m) => m.vote_average >= voteThreshold && !m.adult)
        .slice(0, limit)
        .map(mapTMDBMovieToMovie);

      const filteredSeries = tvResponse.results
        .filter((s) => s.vote_average >= voteThreshold)
        .slice(0, limit)
        .map(mapTMDBTVShowToSeries);

      setMovies(filteredMovies);
      setSeries(filteredSeries);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch kids content"));
      setMovies([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, [language, page, limit, ageRange, getGenreIds, getVoteThreshold]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { movies, series, loading, error, refetch: fetchContent };
}

// Hook for featured kids shows
export function useFeaturedKidsShows(): KidsContentResult {
  const { language } = useLanguage();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get top-rated family/animation content
      const [movieResponse, tvResponse] = await Promise.all([
        tmdbClient.discoverMovies({
          language,
          page: 1,
          with_genres: `${KIDS_GENRE_IDS.animation}`,
          sort_by: "vote_average.desc",
        }),
        tmdbClient.discoverTVShows({
          language,
          page: 1,
          with_genres: `${KIDS_GENRE_IDS.kidsTV}`,
          sort_by: "vote_average.desc",
        }),
      ]);

      const topMovies = movieResponse.results
        .filter((m) => m.vote_average >= 7.5 && m.vote_count >= 500 && !m.adult)
        .slice(0, 6)
        .map(mapTMDBMovieToMovie);

      const topSeries = tvResponse.results
        .filter((s) => s.vote_average >= 7.0)
        .slice(0, 6)
        .map(mapTMDBTVShowToSeries);

      setMovies(topMovies);
      setSeries(topSeries);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch featured kids content"));
      setMovies([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return { movies, series, loading, error, refetch: fetchFeatured };
}

// Hook for kids content by category
export function useKidsCategoryContent(categoryId: string): KidsContentResult {
  const { language } = useLanguage();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const category = useMemo(
    () => KIDS_CATEGORIES.find((c) => c.id === categoryId),
    [categoryId]
  );

  const fetchCategoryContent = useCallback(async () => {
    if (!category) {
      setMovies([]);
      setSeries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // For Iranian content, use language filter
      if (categoryId === "iranian") {
        const [movieResponse, tvResponse] = await Promise.all([
          tmdbClient.discoverMovies({
            language,
            page: 1,
            with_genres: `${KIDS_GENRE_IDS.animation}`,
            with_original_language: "fa",
            sort_by: "popularity.desc",
          }),
          tmdbClient.discoverTVShows({
            language,
            page: 1,
            with_genres: `${KIDS_GENRE_IDS.animation}|${KIDS_GENRE_IDS.kidsTV}`,
            with_original_language: "fa",
            sort_by: "popularity.desc",
          }),
        ]);

        setMovies(movieResponse.results.slice(0, 12).map(mapTMDBMovieToMovie));
        setSeries(tvResponse.results.slice(0, 12).map(mapTMDBTVShowToSeries));
        return;
      }

      // For other categories, use keyword search combined with genre filter
      const keywords = category.keywords || [];
      
      if (keywords.length > 0) {
        const searchPromises = keywords.map((keyword) => 
          tmdbClient.searchMovies(keyword, language)
        );
        
        const searchResults = await Promise.all(searchPromises);
        
        const allMovies = searchResults
          .flatMap((r) => r.results)
          .filter((m) => 
            m.genre_ids.includes(KIDS_GENRE_IDS.animation) || 
            m.genre_ids.includes(KIDS_GENRE_IDS.family)
          )
          .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i) // Dedupe
          .slice(0, 12)
          .map(mapTMDBMovieToMovie);

        setMovies(allMovies);
      } else {
        const movieResponse = await tmdbClient.discoverMovies({
          language,
          page: 1,
          with_genres: `${KIDS_GENRE_IDS.animation}`,
          sort_by: "popularity.desc",
        });
        
        setMovies(movieResponse.results.slice(0, 12).map(mapTMDBMovieToMovie));
      }

      // Fetch TV content
      const tvResponse = await tmdbClient.discoverTVShows({
        language,
        page: 1,
        with_genres: `${KIDS_GENRE_IDS.animation}|${KIDS_GENRE_IDS.kidsTV}`,
        sort_by: "popularity.desc",
      });

      setSeries(tvResponse.results.slice(0, 12).map(mapTMDBTVShowToSeries));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch category content"));
      setMovies([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, category, language]);

  useEffect(() => {
    fetchCategoryContent();
  }, [fetchCategoryContent]);

  return { movies, series, loading, error, refetch: fetchCategoryContent };
}

// Helper function to get random educational badge
export function getRandomBadge(): EducationalBadge {
  return EDUCATIONAL_BADGES[Math.floor(Math.random() * EDUCATIONAL_BADGES.length)];
}

// Helper to format duration for kids
export function formatKidsDuration(minutes: number): { label: string; labelFa: string } {
  if (minutes <= 20) {
    return { label: "Short (15 min)", labelFa: "کوتاه (۱۵ دقیقه)" };
  } else if (minutes <= 60) {
    return { label: "Medium (30-60 min)", labelFa: "متوسط (۳۰-۶۰ دقیقه)" };
  } else {
    return { label: "Long (90 min)", labelFa: "بلند (۹۰ دقیقه)" };
  }
}

export default useKidsContent;
