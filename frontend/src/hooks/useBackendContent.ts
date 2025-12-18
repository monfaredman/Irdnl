/**
 * useBackendContent Hook - React Hook for Backend API Integration
 *
 * Features:
 * - Automatic loading states
 * - Error handling
 * - Multi-language support
 * - Type-safe data fetching from backend
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
// POPULAR MOVIES
// ============================================================================

export function useBackendPopularMovies(
	options: UseBackendContentOptions = {},
): UseBackendContentResult<Movie[]> {
	const { language = "en", enabled = true } = options;
	const [data, setData] = useState<Movie[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const movies = await contentApi.getPopularMovies(language);
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
	}, [language, enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// TRENDING MOVIES
// ============================================================================

export function useBackendTrendingMovies(
	options: UseBackendContentOptions = {},
): UseBackendContentResult<Movie[]> {
	const { language = "en", enabled = true } = options;
	const [data, setData] = useState<Movie[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const movies = await contentApi.getTrendingMovies(language);
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
	}, [language, enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// POPULAR TV SHOWS
// ============================================================================

export function useBackendPopularTVShows(
	options: UseBackendContentOptions = {},
): UseBackendContentResult<Series[]> {
	const { language = "en", enabled = true } = options;
	const [data, setData] = useState<Series[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);
			const series = await contentApi.getPopularTVShows(language);
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
	}, [language, enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// SEARCH MOVIES
// ============================================================================

export function useBackendSearchMovies(
	query: string,
	options: UseBackendContentOptions = {},
): UseBackendContentResult<Movie[]> {
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
			const movies = await contentApi.searchMovies(query, language);
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
	}, [query, language, enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// SEARCH TV SHOWS
// ============================================================================

export function useBackendSearchTVShows(
	query: string,
	options: UseBackendContentOptions = {},
): UseBackendContentResult<Series[]> {
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
			const series = await contentApi.searchTVShows(query, language);
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
	}, [query, language, enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// COMBINED CONTENT (MOVIES + TV)
// ============================================================================

export function useBackendCombinedContent(
	options: UseBackendContentOptions = {},
): UseBackendContentResult<(Movie | Series)[]> {
	const { language = "en", enabled = true } = options;
	const [data, setData] = useState<(Movie | Series)[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			const [movies, series] = await Promise.all([
				contentApi.getPopularMovies(language),
				contentApi.getPopularTVShows(language),
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
	}, [language, enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// TRENDING CONTENT
// ============================================================================

export function useBackendTrendingContent(
	options: UseBackendContentOptions & { limit?: number } = {},
): UseBackendContentResult<(Movie | Series)[]> {
	const { language = "en", enabled = true, limit = 10 } = options;
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
	}, [language, enabled, limit]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// FILTERED CONTENT (TMDB Discover with Genre/Year filters)
// ============================================================================

export function useBackendFilteredContent(
	filters: ContentFilters,
	options: UseBackendContentOptions = {},
): UseBackendContentResult<(Movie | Series)[]> {
	const { language = "en", enabled = true } = options;
	const [data, setData] = useState<(Movie | Series)[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Determine which TMDB discover endpoint to call
			const isMovie = filters.type === "movie";
			const isSeries = filters.type === "series";

			let items: (Movie | Series)[] = [];

			if (isMovie || (!isMovie && !isSeries)) {
				// Fetch movies (or both if type is "all")
				const movieRes = await contentApi.discoverMovies({
					language,
					genre: filters.genre && filters.genre !== "all" ? filters.genre : undefined,
					year: filters.year,
					certification: filters.certification,
					country: filters.country,
					page: filters.page || 1,
				});
				items = [...items, ...movieRes.items];
			}

			if (isSeries || (!isMovie && !isSeries)) {
				// Fetch TV shows (or both if type is "all")
				const tvRes = await contentApi.discoverTVShows({
					language,
					genre: filters.genre && filters.genre !== "all" ? filters.genre : undefined,
					year: filters.year,
					certification: filters.certification,
					country: filters.country,
					page: filters.page || 1,
				});
				items = [...items, ...tvRes.items];
			}

			// Shuffle combined results for variety
			if (!isMovie && !isSeries) {
				items = items.sort(() => Math.random() - 0.5);
			}

			setData(items);
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
		// We intentionally depend on a stable serialized key so object identity
		// changes don't cause redundant refetches.
	}, [enabled, language, JSON.stringify(filters)]);

	return { data, loading, error, refetch: fetchData };
}
