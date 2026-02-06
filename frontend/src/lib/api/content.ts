/**
 * Content API
 *
 * API methods for fetching content from the backend database.
 * All data comes from the local database - no TMDB dependency.
 * TMDB is only used in the admin panel for content data import.
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

export interface ContentQueryParams {
	type?: "movie" | "series";
	genre?: string;
	q?: string;
	year?: number;
	country?: string;
	language?: string;
	featured?: boolean;
	sort?: "rating" | "year" | "createdAt" | "priority" | "title";
	order?: "ASC" | "DESC";
	page?: number;
	limit?: number;
}

export const contentApi = {
	/**
	 * Get list of content with pagination and filters (from database)
	 */
	async getContent(params?: ContentQueryParams): Promise<ContentListResponse> {
		return apiClient.get<ContentListResponse>("/content", params);
	},

	/**
	 * Get content by ID (from database)
	 */
	async getContentById(id: string): Promise<Movie | Series> {
		return apiClient.get<Movie | Series>(`/content/${id}`);
	},

	/**
	 * Get trending content (from database - based on watch history)
	 */
	async getTrending(limit?: number): Promise<(Movie | Series)[]> {
		return apiClient.get<(Movie | Series)[]>(
			"/content/trending",
			limit ? { limit } : undefined,
		);
	},

	/**
	 * Get popular content sorted by priority and rating (from database)
	 */
	async getPopular(type?: "movie" | "series", limit?: number): Promise<(Movie | Series)[]> {
		const params: Record<string, string | number> = {};
		if (type) params.type = type;
		if (limit) params.limit = limit;
		return apiClient.get<(Movie | Series)[]>("/content/popular", params);
	},

	/**
	 * Get popular movies (from database)
	 */
	async getPopularMovies(limit: number = 20): Promise<Movie[]> {
		const items = await this.getPopular("movie", limit);
		return items as Movie[];
	},

	/**
	 * Get trending movies (from database)
	 */
	async getTrendingMovies(limit: number = 20): Promise<Movie[]> {
		const trending = await this.getTrending(limit);
		return trending.filter((item) => (item as any).type === "movie" || (item as any).duration) as Movie[];
	},

	/**
	 * Get popular TV shows (from database)
	 */
	async getPopularTVShows(limit: number = 20): Promise<Series[]> {
		const items = await this.getPopular("series", limit);
		return items as Series[];
	},

	/**
	 * Get featured content (from database)
	 */
	async getFeatured(limit?: number): Promise<(Movie | Series)[]> {
		return apiClient.get<(Movie | Series)[]>(
			"/content/featured",
			limit ? { limit } : undefined,
		);
	},

	/**
	 * Search content in database
	 */
	async search(params: {
		q: string;
		type?: "movie" | "series";
		page?: number;
		limit?: number;
	}): Promise<ContentListResponse> {
		return apiClient.get<ContentListResponse>("/content/search", params);
	},

	/**
	 * Search movies in database
	 */
	async searchMovies(query: string): Promise<Movie[]> {
		const response = await this.search({ q: query, type: "movie" });
		return response.items as Movie[];
	},

	/**
	 * Search TV shows in database
	 */
	async searchTVShows(query: string): Promise<Series[]> {
		const response = await this.search({ q: query, type: "series" });
		return response.items as Series[];
	},

	/**
	 * Get filtered content from database (replaces TMDB discover)
	 */
	async getFilteredContent(params: {
		type?: "movie" | "series";
		genre?: string;
		year?: number;
		country?: string;
		page?: number;
		limit?: number;
	}): Promise<ContentListResponse> {
		return apiClient.get<ContentListResponse>("/content", {
			...params,
			sort: "rating",
			order: "DESC",
		});
	},

	/**
	 * Get episodes for a series (from database)
	 */
	async getEpisodes(contentId: string): Promise<unknown[]> {
		return apiClient.get<unknown[]>(`/content/${contentId}/episodes`);
	},

	/**
	 * Get streaming info for content (from database)
	 */
	async getStreamInfo(
		contentId: string,
	): Promise<Array<{ quality: string; hls_url: string; signed: boolean }>> {
		return apiClient.get<
			Array<{ quality: string; hls_url: string; signed: boolean }>
		>(`/content/${contentId}/stream`);
	},

	/**
	 * Animation content (genre animation) from database
	 */
	async getAnimationContent(params?: {
		page?: number;
	}): Promise<{ movies: Movie[]; series: Series[] }> {
		const page = params?.page ?? 1;

		const [movieRes, seriesRes] = await Promise.all([
			this.getFilteredContent({ genre: "animation", type: "movie", page }),
			this.getFilteredContent({ genre: "animation", type: "series", page }),
		]);

		return {
			movies: movieRes.items as Movie[],
			series: seriesRes.items as Series[],
		};
	},
};
