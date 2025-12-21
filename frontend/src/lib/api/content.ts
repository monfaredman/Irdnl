/**
 * Content API
 *
 * API methods for fetching content from the backend
 */

import type { Movie, Series } from "@/types/media";
import { apiClient } from "./client";

export interface ContentListResponse {
	items: (Movie | Series)[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export type ContentSearchItem =
	| { type: "movie"; item: Movie }
	| { type: "series"; item: Series };

export interface ContentSearchResponse {
	items: ContentSearchItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface ContentQueryParams {
	type?: "movie" | "series";
	genre?: string;
	q?: string;
	page?: number;
	limit?: number;
}

export const contentApi = {
	/**
	 * Get list of content with pagination and filters
	 */
	async getContent(params?: ContentQueryParams): Promise<ContentListResponse> {
		return apiClient.get<ContentListResponse>("/content", params);
	},

	/**
	 * Get content by ID
	 */
	async getContentById(id: string): Promise<Movie | Series> {
		return apiClient.get<Movie | Series>(`/content/${id}`);
	},

	/**
	 * Get trending content
	 */
	async getTrending(limit?: number): Promise<(Movie | Series)[]> {
		return apiClient.get<(Movie | Series)[]>(
			"/content/trending",
			limit ? { limit } : undefined,
		);
	},

	/**
	 * Get episodes for a series
	 */
	async getEpisodes(contentId: string): Promise<unknown[]> {
		return apiClient.get<unknown[]>(`/content/${contentId}/episodes`);
	},

	/**
	 * Get streaming info for content
	 */
	async getStreamInfo(
		contentId: string,
	): Promise<Array<{ quality: string; hls_url: string; signed: boolean }>> {
		return apiClient.get<
			Array<{ quality: string; hls_url: string; signed: boolean }>
		>(`/content/${contentId}/stream`);
	},

	/**
	 * Get popular movies from TMDB (via backend)
	 */
	async getPopularMovies(
		language: "en" | "fa" = "fa",
		page: number = 1,
	): Promise<Movie[]> {
		const response = await apiClient.get<ContentListResponse>(
			"/content/tmdb/popular/movies",
			{
				language,
				page,
			},
		);
		return response.items as Movie[];
	},

	/**
	 * Get trending movies from TMDB (via backend)
	 */
	async getTrendingMovies(language: "en" | "fa" = "fa"): Promise<Movie[]> {
		const response = await apiClient.get<ContentListResponse>(
			"/content/tmdb/trending/movies",
			{
				language,
			},
		);
		return response.items as Movie[];
	},

	/**
	 * Get popular TV shows from TMDB (via backend)
	 */
	async getPopularTVShows(
		language: "en" | "fa" = "fa",
		page: number = 1,
	): Promise<Series[]> {
		const response = await apiClient.get<ContentListResponse>(
			"/content/tmdb/popular/tv",
			{
				language,
				page,
			},
		);
		return response.items as Series[];
	},

	/**
	 * Search movies from TMDB (via backend)
	 */
	async searchMovies(
		query: string,
		language: "en" | "fa" = "fa",
	): Promise<Movie[]> {
		const response = await apiClient.get<ContentListResponse>(
			"/content/tmdb/search/movies",
			{
				q: query,
				language,
			},
		);
		return response.items as Movie[];
	},

	/**
	 * Search TV shows from TMDB (via backend)
	 */
	async searchTVShows(
		query: string,
		language: "en" | "fa" = "fa",
	): Promise<Series[]> {
		const response = await apiClient.get<ContentListResponse>(
			"/content/tmdb/search/tv",
			{
				q: query,
				language,
			},
		);
		return response.items as Series[];
	},

	/**
	 * Search movies + TV shows from TMDB (via backend multi-search)
	 */
	async search(
		params: {
			q: string;
			language?: "en" | "fa";
			page?: number;
		},
	): Promise<{
		movies: Movie[];
		series: Series[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const response = await apiClient.get<ContentSearchResponse>(
			"/content/tmdb/search",
			params,
		);

		const movies = response.items
			.filter((entry) => entry.type === "movie")
			.map((entry) => entry.item as Movie);
		const series = response.items
			.filter((entry) => entry.type === "series")
			.map((entry) => entry.item as Series);

		return {
			movies,
			series,
			total: response.total,
			page: response.page,
			limit: response.limit,
			totalPages: response.totalPages,
		};
	},

	/**
	 * Discover movies from TMDB with filters (via backend)
	 */
	async discoverMovies(params: {
		language?: "en" | "fa";
		genre?: string;
		with_genres?: string;
		year?: number;
		certification?: string;
		country?: string;
		page?: number;
	}): Promise<ContentListResponse> {
		const response = await apiClient.get<ContentListResponse>(
			"/content/tmdb/discover/movies",
			params,
		);
		return {
			...response,
			items: response.items as Movie[],
		};
	},

	/**
	 * Discover TV shows from TMDB with filters (via backend)
	 */
	async discoverTVShows(params: {
		language?: "en" | "fa";
		genre?: string;
		with_genres?: string;
		year?: number;
		certification?: string;
		country?: string;
		page?: number;
	}): Promise<ContentListResponse> {
		const response = await apiClient.get<ContentListResponse>(
			"/content/tmdb/discover/tv",
			params,
		);
		return {
			...response,
			items: response.items as Series[],
		};
	},

	/**
	 * Animation content (genre 16) from TMDB (via backend discover)
	 */
	async getAnimationContent(params?: {
		language?: "en" | "fa";
		page?: number;
	}): Promise<{ movies: Movie[]; series: Series[] }> {
		const language = params?.language ?? "fa";
		const page = params?.page ?? 1;

		const [movieRes, seriesRes] = await Promise.all([
			this.discoverMovies({ language, page, with_genres: "16" }),
			this.discoverTVShows({ language, page, with_genres: "16" }),
		]);

		return {
			movies: movieRes.items as Movie[],
			series: seriesRes.items as Series[],
		};
	},
};
