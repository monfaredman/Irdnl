/**
 * useBackendContent Hook - React Hook for Backend Database Content
 *
 * All data is fetched from the local database.
 * TMDB is NOT used in these hooks - only in the admin panel.
 *
 * Features:
 * - Automatic loading states
 * - Error handling
 * - Type-safe data fetching from backend database
 */

import { useEffect, useState } from "react";
import { contentApi } from "@/lib/api/content";
import type { Movie, Series } from "@/types/media";

interface UseBackendContentOptions {
	language?: "en" | "fa";
	enabled?: boolean;
}

interface UseBackendContentResult<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
}

export interface ContentFilters {
	type?: "movie" | "series";
	genre?: string;
	year?: number;
	certification?: string;
	country?: string;
	q?: string;
	page?: number;
	limit?: number;
}

// ============================================================================
// POPULAR MOVIES (from database)
// ============================================================================

export function useBackendPopularMovies(
	options: UseBackendContentOptions = {},
): UseBackendContentResult<Movie[]> {
	const { enabled = true } = options;
	const [data, setData] = useState<Movie[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const movies = await contentApi.getPopularMovies();
			setData(movies);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to fetch popular movies"),
			);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (enabled) {
			fetchData();
		}
	}, [enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// TRENDING MOVIES (from database)
// ============================================================================

export function useBackendTrendingMovies(
	options: UseBackendContentOptions = {},
): UseBackendContentResult<Movie[]> {
	const { enabled = true } = options;
	const [data, setData] = useState<Movie[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const movies = await contentApi.getTrendingMovies();
			setData(movies);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to fetch trending movies"),
			);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (enabled) {
			fetchData();
		}
	}, [enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// POPULAR TV SHOWS (from database)
// ============================================================================

export function useBackendPopularTVShows(
	options: UseBackendContentOptions = {},
): UseBackendContentResult<Series[]> {
	const { enabled = true } = options;
	const [data, setData] = useState<Series[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const series = await contentApi.getPopularTVShows();
			setData(series);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to fetch popular TV shows"),
			);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (enabled) {
			fetchData();
		}
	}, [enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// SEARCH MOVIES (from database)
// ============================================================================

export function useBackendSearchMovies(
	query: string,
	options: UseBackendContentOptions = {},
): UseBackendContentResult<Movie[]> {
	const { enabled = true } = options;
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
			const movies = await contentApi.searchMovies(query);
			setData(movies);
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to search movies"),
			);
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
	}, [query, enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// SEARCH TV SHOWS (from database)
// ============================================================================

export function useBackendSearchTVShows(
	query: string,
	options: UseBackendContentOptions = {},
): UseBackendContentResult<Series[]> {
	const { enabled = true } = options;
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
			const series = await contentApi.searchTVShows(query);
			setData(series);
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to search TV shows"),
			);
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
	}, [query, enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// COMBINED CONTENT (MOVIES + TV from database)
// ============================================================================

export function useBackendCombinedContent(
	options: UseBackendContentOptions = {},
): UseBackendContentResult<(Movie | Series)[]> {
	const { enabled = true } = options;
	const [data, setData] = useState<(Movie | Series)[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			const [movies, series] = await Promise.all([
				contentApi.getPopularMovies(10),
				contentApi.getPopularTVShows(10),
			]);

			// Combine and shuffle for variety
			const combined = [...movies.slice(0, 10), ...series.slice(0, 10)];
			const shuffled = combined.sort(() => Math.random() - 0.5);

			setData(shuffled);
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to fetch content"),
			);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (enabled) {
			fetchData();
		}
	}, [enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// TRENDING CONTENT (from database)
// ============================================================================

export function useBackendTrendingContent(
	options: UseBackendContentOptions & { limit?: number } = {},
): UseBackendContentResult<(Movie | Series)[]> {
	const { enabled = true, limit = 10 } = options;
	const [data, setData] = useState<(Movie | Series)[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const content = await contentApi.getTrending(limit);
			setData(content);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to fetch trending content"),
			);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (enabled) {
			fetchData();
		}
	}, [enabled, limit]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// FILTERED CONTENT (from database with genre/year/country filters)
// ============================================================================

export function useBackendFilteredContent(
	filters: ContentFilters,
	options: UseBackendContentOptions = {},
): UseBackendContentResult<(Movie | Series)[]> {
	const { enabled = true } = options;
	const [data, setData] = useState<(Movie | Series)[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await contentApi.getFilteredContent({
				type: filters.type,
				genre: filters.genre && filters.genre !== "all" ? filters.genre : undefined,
				year: filters.year,
				country: filters.country && filters.country !== "all" ? filters.country : undefined,
				page: filters.page || 1,
				limit: filters.limit || 20,
			});

			setData(response.items);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to fetch filtered content"),
			);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!enabled) return;

		// small debounce so rapid filter changes don't spam the API
		const t = setTimeout(fetchData, 250);
		return () => clearTimeout(t);
	}, [enabled, JSON.stringify(filters)]);

	return { data, loading, error, refetch: fetchData };
}
