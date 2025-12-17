/**
 * TMDB API Service Layer
 *
 * Features:
 * - Type-safe API client
 * - Rate limiting (40 requests/10s)
 * - Automatic retry with exponential backoff
 * - LocalStorage caching (1 hour TTL)
 * - Error handling and fallback content
 * - Multi-language support (en, fa)
 */

import type { Movie, Series } from "@/types/media";

// ============================================================================
// CONFIGURATION
// ============================================================================

const TMDB_CONFIG = {
	apiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
	baseUrl:
		process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3",
	imageBaseUrl:
		process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p",
	cacheDuration: parseInt(
		process.env.NEXT_PUBLIC_CACHE_DURATION || "3600000",
		10,
	), // 1 hour
	rateLimit: parseInt(process.env.NEXT_PUBLIC_API_RATE_LIMIT || "40", 10), // 40 req/window
	rateWindow: parseInt(process.env.NEXT_PUBLIC_API_RATE_WINDOW || "10000", 10), // 10 seconds
} as const;

// ============================================================================
// TYPES
// ============================================================================

interface TMDBMovie {
	id: number;
	title: string;
	original_title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	vote_count: number;
	genre_ids: number[];
	original_language: string;
	popularity: number;
	adult: boolean;
}

interface TMDBTVShow {
	id: number;
	name: string;
	original_name: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	first_air_date: string;
	vote_average: number;
	vote_count: number;
	genre_ids: number[];
	original_language: string;
	popularity: number;
	origin_country: string[];
}

interface TMDBResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

interface CacheEntry<T> {
	data: T;
	timestamp: number;
}

// ============================================================================
// RATE LIMITER
// ============================================================================

class RateLimiter {
	private requests: number[] = [];
	private limit: number;
	private window: number;

	constructor(limit: number, window: number) {
		this.limit = limit;
		this.window = window;
	}

	async throttle(): Promise<void> {
		const now = Date.now();
		this.requests = this.requests.filter((time) => now - time < this.window);

		if (this.requests.length >= this.limit) {
			const oldestRequest = this.requests[0];
			const waitTime = this.window - (now - oldestRequest);
			await new Promise((resolve) => setTimeout(resolve, waitTime));
			return this.throttle();
		}

		this.requests.push(now);
	}
}

const rateLimiter = new RateLimiter(
	TMDB_CONFIG.rateLimit,
	TMDB_CONFIG.rateWindow,
);

// ============================================================================
// CACHE MANAGER
// ============================================================================

class CacheManager {
	private prefix = "tmdb_cache_";

	set<T>(key: string, data: T): void {
		if (typeof window === "undefined") return;

		const entry: CacheEntry<T> = {
			data,
			timestamp: Date.now(),
		};

		try {
			localStorage.setItem(this.prefix + key, JSON.stringify(entry));
		} catch (error) {
			console.warn("Failed to cache data:", error);
		}
	}

	get<T>(key: string): T | null {
		if (typeof window === "undefined") return null;

		try {
			const item = localStorage.getItem(this.prefix + key);
			if (!item) return null;

			const entry: CacheEntry<T> = JSON.parse(item);
			const age = Date.now() - entry.timestamp;

			if (age > TMDB_CONFIG.cacheDuration) {
				this.delete(key);
				return null;
			}

			return entry.data;
		} catch (error) {
			console.warn("Failed to retrieve cached data:", error);
			return null;
		}
	}

	delete(key: string): void {
		if (typeof window === "undefined") return;
		localStorage.removeItem(this.prefix + key);
	}

	clear(): void {
		if (typeof window === "undefined") return;

		const keys = Object.keys(localStorage);
		keys.forEach((key) => {
			if (key.startsWith(this.prefix)) {
				localStorage.removeItem(key);
			}
		});
	}
}

const cache = new CacheManager();

// ============================================================================
// API CLIENT
// ============================================================================

class TMDBClient {
	private async fetchWithRetry<T>(
		url: string,
		retries = 3,
		backoff = 1000,
	): Promise<T> {
		await rateLimiter.throttle();

		try {
			const response = await fetch(url);

			if (!response.ok) {
				if (response.status === 429 && retries > 0) {
					// Rate limited - retry with exponential backoff
					await new Promise((resolve) => setTimeout(resolve, backoff));
					return this.fetchWithRetry<T>(url, retries - 1, backoff * 2);
				}
				throw new Error(
					`TMDB API error: ${response.status} ${response.statusText}`,
				);
			}

			return await response.json();
		} catch (error) {
			if (retries > 0) {
				await new Promise((resolve) => setTimeout(resolve, backoff));
				return this.fetchWithRetry<T>(url, retries - 1, backoff * 2);
			}
			throw error;
		}
	}

	private buildUrl(
		endpoint: string,
		params: Record<string, string | number> = {},
	): string {
		const url = new URL(`${TMDB_CONFIG.baseUrl}${endpoint}`);
		url.searchParams.set("api_key", TMDB_CONFIG.apiKey);

		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.set(key, String(value));
		});

		return url.toString();
	}

	async getPopularMovies(
		language: "en" | "fa" = "en",
		page = 1,
	): Promise<TMDBResponse<TMDBMovie>> {
		const cacheKey = `popular_movies_${language}_${page}`;
		const cached = cache.get<TMDBResponse<TMDBMovie>>(cacheKey);
		if (cached) return cached;

		const url = this.buildUrl("/movie/popular", {
			language: language === "fa" ? "fa-IR" : "en-US",
			page,
		});

		const data = await this.fetchWithRetry<TMDBResponse<TMDBMovie>>(url);
		cache.set(cacheKey, data);
		return data;
	}

	async getTrendingMovies(
		language: "en" | "fa" = "en",
	): Promise<TMDBResponse<TMDBMovie>> {
		const cacheKey = `trending_movies_${language}`;
		const cached = cache.get<TMDBResponse<TMDBMovie>>(cacheKey);
		if (cached) return cached;

		const url = this.buildUrl("/trending/movie/week", {
			language: language === "fa" ? "fa-IR" : "en-US",
		});

		const data = await this.fetchWithRetry<TMDBResponse<TMDBMovie>>(url);
		cache.set(cacheKey, data);
		return data;
	}

	async getPopularTVShows(
		language: "en" | "fa" = "en",
		page = 1,
	): Promise<TMDBResponse<TMDBTVShow>> {
		const cacheKey = `popular_tv_${language}_${page}`;
		const cached = cache.get<TMDBResponse<TMDBTVShow>>(cacheKey);
		if (cached) return cached;

		const url = this.buildUrl("/tv/popular", {
			language: language === "fa" ? "fa-IR" : "en-US",
			page,
		});

		const data = await this.fetchWithRetry<TMDBResponse<TMDBTVShow>>(url);
		cache.set(cacheKey, data);
		return data;
	}

	async searchMovies(
		query: string,
		language: "en" | "fa" = "en",
	): Promise<TMDBResponse<TMDBMovie>> {
		const cacheKey = `search_movies_${query}_${language}`;
		const cached = cache.get<TMDBResponse<TMDBMovie>>(cacheKey);
		if (cached) return cached;

		const url = this.buildUrl("/search/movie", {
			query,
			language: language === "fa" ? "fa-IR" : "en-US",
		});

		const data = await this.fetchWithRetry<TMDBResponse<TMDBMovie>>(url);
		cache.set(cacheKey, data);
		return data;
	}

	async searchTVShows(
		query: string,
		language: "en" | "fa" = "en",
	): Promise<TMDBResponse<TMDBTVShow>> {
		const cacheKey = `search_tv_${query}_${language}`;
		const cached = cache.get<TMDBResponse<TMDBTVShow>>(cacheKey);
		if (cached) return cached;

		const url = this.buildUrl("/search/tv", {
			query,
			language: language === "fa" ? "fa-IR" : "en-US",
		});

		const data = await this.fetchWithRetry<TMDBResponse<TMDBTVShow>>(url);
		cache.set(cacheKey, data);
		return data;
	}

	getImageUrl(
		path: string | null,
		size: "w200" | "w500" | "original" = "w500",
	): string {
		if (!path) return "/images/placeholder.jpg";
		return `${TMDB_CONFIG.imageBaseUrl}/${size}${path}`;
	}
}

export const tmdbClient = new TMDBClient();

// ============================================================================
// DATA MAPPERS
// ============================================================================

export function mapTMDBMovieToMovie(tmdbMovie: TMDBMovie): Movie {
	return {
		id: String(tmdbMovie.id),
		title: tmdbMovie.title,
		slug: tmdbMovie.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
		description: tmdbMovie.overview || "No description available.",
		poster: tmdbClient.getImageUrl(tmdbMovie.poster_path, "w500"),
		backdrop: tmdbClient.getImageUrl(tmdbMovie.backdrop_path, "original"),
		year: tmdbMovie.release_date
			? new Date(tmdbMovie.release_date).getFullYear()
			: 2024,
		rating: Math.round(tmdbMovie.vote_average * 10) / 10,
		duration: 120, // TMDB doesn't provide this in list endpoints
		genres: ["drama"], // Map genre_ids to actual genres if needed
		languages: [tmdbMovie.original_language === "fa" ? "fa" : "en"],
		origin:
			tmdbMovie.original_language === "fa" ||
			tmdbMovie.original_language === "ar"
				? "iranian"
				: "foreign",
		cast: [],
		tags: [],
		sources: [],
		downloads: [],
		subtitles: [
			{
				id: "en-1",
				language: "en",
				label: "English",
				url: "#",
			},
			{
				id: "fa-1",
				language: "fa",
				label: "Persian",
				url: "#",
			},
		],
	};
}

export function mapTMDBTVShowToSeries(tmdbShow: TMDBTVShow): Series {
	return {
		id: String(tmdbShow.id),
		title: tmdbShow.name,
		slug: tmdbShow.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
		description: tmdbShow.overview || "No description available.",
		poster: tmdbClient.getImageUrl(tmdbShow.poster_path, "w500"),
		backdrop: tmdbClient.getImageUrl(tmdbShow.backdrop_path, "original"),
		year: tmdbShow.first_air_date
			? new Date(tmdbShow.first_air_date).getFullYear()
			: 2024,
		rating: Math.round(tmdbShow.vote_average * 10) / 10,
		genres: ["drama"],
		languages: [tmdbShow.original_language === "fa" ? "fa" : "en"],
		origin:
			tmdbShow.origin_country.includes("IR") ||
			tmdbShow.original_language === "fa"
				? "iranian"
				: "foreign",
		cast: [],
		tags: [],
		seasons: [],
		ongoing: true,
	};
}

// ============================================================================
// EXPORTS
// ============================================================================

export { cache, rateLimiter, TMDB_CONFIG };
export type { TMDBMovie, TMDBTVShow, TMDBResponse };
