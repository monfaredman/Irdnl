/**
 * useTMDB Hook - React Hook for TMDB API Integration
 * 
 * Features:
 * - Automatic loading states
 * - Error handling
 * - Multi-language support
 * - Cache invalidation
 * - Type-safe data fetching
 */

import { useState, useEffect } from "react";
import { tmdbClient, mapTMDBMovieToMovie, mapTMDBTVShowToSeries } from "@/lib/tmdb-service";
import type { Movie, Series } from "@/types/media";
import type { TMDBResponse, TMDBMovie, TMDBTVShow } from "@/lib/tmdb-service";

interface UseTMDBOptions {
  language?: "en" | "fa";
  enabled?: boolean;
}

interface UseTMDBResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// POPULAR MOVIES
// ============================================================================

export function useTMDBPopularMovies(options: UseTMDBOptions = {}): UseTMDBResult<Movie[]> {
  const { language = "en", enabled = true } = options;
  const [data, setData] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tmdbClient.getPopularMovies(language);
      const movies = response.results.map(mapTMDBMovieToMovie);
      setData(movies);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch popular movies"));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [language, enabled]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// TRENDING MOVIES
// ============================================================================

export function useTMDBTrendingMovies(options: UseTMDBOptions = {}): UseTMDBResult<Movie[]> {
  const { language = "en", enabled = true } = options;
  const [data, setData] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tmdbClient.getTrendingMovies(language);
      const movies = response.results.map(mapTMDBMovieToMovie);
      setData(movies);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch trending movies"));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [language, enabled]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// POPULAR TV SHOWS
// ============================================================================

export function useTMDBPopularTVShows(options: UseTMDBOptions = {}): UseTMDBResult<Series[]> {
  const { language = "en", enabled = true } = options;
  const [data, setData] = useState<Series[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tmdbClient.getPopularTVShows(language);
      const series = response.results.map(mapTMDBTVShowToSeries);
      setData(series);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch popular TV shows"));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [language, enabled]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// SEARCH MOVIES
// ============================================================================

export function useTMDBSearchMovies(
  query: string,
  options: UseTMDBOptions = {}
): UseTMDBResult<Movie[]> {
  const { language = "en", enabled = true } = options;
  const [data, setData] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!query.trim()) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await tmdbClient.searchMovies(query, language);
      const movies = response.results.map(mapTMDBMovieToMovie);
      setData(movies);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to search movies"));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && query) {
      const debounce = setTimeout(fetchData, 500);
      return () => clearTimeout(debounce);
    }
  }, [query, language, enabled]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// SEARCH TV SHOWS
// ============================================================================

export function useTMDBSearchTVShows(
  query: string,
  options: UseTMDBOptions = {}
): UseTMDBResult<Series[]> {
  const { language = "en", enabled = true } = options;
  const [data, setData] = useState<Series[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!query.trim()) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await tmdbClient.searchTVShows(query, language);
      const series = response.results.map(mapTMDBTVShowToSeries);
      setData(series);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to search TV shows"));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && query) {
      const debounce = setTimeout(fetchData, 500);
      return () => clearTimeout(debounce);
    }
  }, [query, language, enabled]);

  return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// COMBINED CONTENT (MOVIES + TV)
// ============================================================================

export function useTMDBCombinedContent(
  options: UseTMDBOptions = {}
): UseTMDBResult<(Movie | Series)[]> {
  const { language = "en", enabled = true } = options;
  const [data, setData] = useState<(Movie | Series)[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [moviesResponse, tvResponse] = await Promise.all([
        tmdbClient.getPopularMovies(language),
        tmdbClient.getPopularTVShows(language),
      ]);

      const movies = moviesResponse.results.map(mapTMDBMovieToMovie);
      const series = tvResponse.results.map(mapTMDBTVShowToSeries);
      
      // Combine and shuffle for variety
      const combined = [...movies.slice(0, 10), ...series.slice(0, 10)];
      const shuffled = combined.sort(() => Math.random() - 0.5);
      
      setData(shuffled);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch content"));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [language, enabled]);

  return { data, loading, error, refetch: fetchData };
}
