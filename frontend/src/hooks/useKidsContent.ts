/**
 * useKidsContent Hook
 * 
 * Custom hook for fetching kids-friendly content from backend database
 * Features: Age-based filtering, safety ratings, educational content
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { contentApi } from "@/lib/api/content";
import type { Movie, Series } from "@/types/media";

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
  const { ageRange = "all", category, page = 1, limit = 20 } = options;
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch kids content from backend (isKids flag)
      const [movieRes, seriesRes] = await Promise.all([
        contentApi.getContent({ isKids: true, type: "movie", sort: "rating", order: "DESC", page, limit }),
        contentApi.getContent({ isKids: true, type: "series", sort: "rating", order: "DESC", page, limit }),
      ]);

      setMovies(movieRes.items as Movie[]);
      setSeries(seriesRes.items as Series[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch kids content"));
      setMovies([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, ageRange]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { movies, series, loading, error, refetch: fetchContent };
}

// Hook for featured kids shows
export function useFeaturedKidsShows(): KidsContentResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get top-rated kids content from backend
      const [movieRes, seriesRes] = await Promise.all([
        contentApi.getContent({ isKids: true, type: "movie", featured: true, sort: "rating", order: "DESC", limit: 6 }),
        contentApi.getContent({ isKids: true, type: "series", featured: true, sort: "rating", order: "DESC", limit: 6 }),
      ]);

      // Fallback: if no featured kids content, get regular top-rated kids content
      if (movieRes.items.length === 0 && seriesRes.items.length === 0) {
        const [movieFallback, seriesFallback] = await Promise.all([
          contentApi.getContent({ isKids: true, type: "movie", sort: "rating", order: "DESC", limit: 6 }),
          contentApi.getContent({ isKids: true, type: "series", sort: "rating", order: "DESC", limit: 6 }),
        ]);
        setMovies(movieFallback.items as Movie[]);
        setSeries(seriesFallback.items as Series[]);
      } else {
        setMovies(movieRes.items as Movie[]);
        setSeries(seriesRes.items as Series[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch featured kids content"));
      setMovies([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return { movies, series, loading, error, refetch: fetchFeatured };
}

// Hook for kids content by category
export function useKidsCategoryContent(categoryId: string): KidsContentResult {
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

      // For Iranian content, filter by language
      const extraParams: Record<string, any> = {};
      if (categoryId === "iranian") {
        extraParams.language = "fa";
      } else if (categoryId === "educational") {
        extraParams.genre = "education";
      } else if (categoryId === "music") {
        extraParams.genre = "music";
      } else if (categoryId === "science") {
        extraParams.genre = "documentary";
      } else if (categoryId === "animals") {
        extraParams.genre = "animation";
      } else if (categoryId === "classics") {
        extraParams.sort = "year";
        extraParams.order = "ASC";
      }

      const [movieRes, seriesRes] = await Promise.all([
        contentApi.getContent({ isKids: true, type: "movie", sort: "rating", order: "DESC", limit: 12, ...extraParams }),
        contentApi.getContent({ isKids: true, type: "series", sort: "rating", order: "DESC", limit: 12, ...extraParams }),
      ]);

      setMovies(movieRes.items as Movie[]);
      setSeries(seriesRes.items as Series[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch category content"));
      setMovies([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, category]);

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
