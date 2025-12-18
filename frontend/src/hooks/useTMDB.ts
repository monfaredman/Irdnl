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

import { useEffect, useState } from "react";
import type { TMDBMovie, TMDBResponse, TMDBTVShow } from "@/lib/tmdb-service";
import {
	mapTMDBMovieToMovie,
	mapTMDBTVShowToSeries,
	tmdbClient,
} from "@/lib/tmdb-service";
import type { Movie, Series } from "@/types/media";

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

export function useTMDBPopularMovies(
	options: UseTMDBOptions = {},
): UseTMDBResult<Movie[]> {
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

export function useTMDBTrendingMovies(
	options: UseTMDBOptions = {},
): UseTMDBResult<Movie[]> {
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

export function useTMDBPopularTVShows(
	options: UseTMDBOptions = {},
): UseTMDBResult<Series[]> {
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

export function useTMDBSearchMovies(
	query: string,
	options: UseTMDBOptions = {},
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

export function useTMDBSearchTVShows(
	query: string,
	options: UseTMDBOptions = {},
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

export function useTMDBCombinedContent(
	options: UseTMDBOptions = {},
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
// DISCOVER MOVIES BY ORIGIN & GENRE
// ============================================================================

export function useTMDBDiscoverMovies(
	origin: "foreign" | "iranian",
	genre?: string,
	options: UseTMDBOptions = {},
): UseTMDBResult<Movie[]> {
	const { language = "en", enabled = true } = options;
	const [data, setData] = useState<Movie[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Map genre names to TMDB genre IDs
			const genreMap: Record<string, string> = {
				action: "28",
				adventure: "12",
				animation: "16",
				comedy: "35",
				thriller: "53,80", // thriller + crime
				documentary: "99",
				drama: "18",
				family: "10751",
				fantasy: "14",
				historical: "36,10752", // history + war
				horror: "27",
				mystery: "9648",
				romance: "10749",
				"sci-fi": "878",
			};

			const params: {
				language?: "en" | "fa";
				with_genres?: string;
				with_original_language?: string;
			} = {
				language,
			};

			// Set origin filter
			if (origin === "iranian") {
				params.with_original_language = "fa";
			}
			// For foreign, we don't filter by language to get all non-Persian content

			// Set genre filter
			if (genre && genreMap[genre]) {
				params.with_genres = genreMap[genre];
			}

			const response = await tmdbClient.discoverMovies(params);
			let movies = response.results.map(mapTMDBMovieToMovie);

			// Filter for foreign origin (exclude Persian/Arabic)
			if (origin === "foreign") {
				movies = movies.filter(
					(m) =>
						m.languages[0] !== "fa" &&
						!m.languages.includes("fa") &&
						m.origin === "foreign",
				);
			}

			// Additional genre filter if needed (for exact match)
			if (genre) {
				movies = movies.filter((m) =>
					m.genres?.some((g) => g.toLowerCase().includes(genre.toLowerCase())),
				);
			}

			setData(movies);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to discover movies"),
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
	}, [origin, genre, language, enabled]);

	return { data, loading, error, refetch: fetchData };
}

// ============================================================================
// DISCOVER TV SHOWS BY ORIGIN & GENRE
// ============================================================================

export function useTMDBDiscoverSeries(
	origin: "foreign" | "iranian",
	genre?: string,
	options: UseTMDBOptions = {},
): UseTMDBResult<Series[]> {
	const { language = "en", enabled = true } = options;
	const [data, setData] = useState<Series[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Map genre names to TMDB genre IDs
			const genreMap: Record<string, string> = {
				action: "10759", // Action & Adventure
				animation: "16",
				comedy: "35",
				thriller: "80", // Crime
				documentary: "99",
				drama: "18",
				family: "10751",
				fantasy: "14",
				horror: "27",
				mystery: "9648",
				romance: "10749",
				"sci-fi": "10765", // Sci-Fi & Fantasy
			};

			const params: {
				language?: "en" | "fa";
				with_genres?: string;
				with_original_language?: string;
			} = {
				language,
			};

			// Set origin filter
			if (origin === "iranian") {
				params.with_original_language = "fa";
			}

			// Set genre filter
			if (genre && genreMap[genre]) {
				params.with_genres = genreMap[genre];
			}

			const response = await tmdbClient.discoverTVShows(params);
			let series = response.results.map(mapTMDBTVShowToSeries);

			// Filter for foreign origin (exclude Persian)
			if (origin === "foreign") {
				series = series.filter(
					(s) =>
						s.languages[0] !== "fa" &&
						!s.languages.includes("fa") &&
						s.origin === "foreign",
				);
			}

			// Additional genre filter if needed
			if (genre) {
				series = series.filter((s) =>
					s.genres?.some((g) => g.toLowerCase().includes(genre.toLowerCase())),
				);
			}

			setData(series);
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to discover TV shows"),
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
	}, [origin, genre, language, enabled]);

	return { data, loading, error, refetch: fetchData };
}
