/**
 * Search API
 *
 * API methods for Elasticsearch-powered search with autocomplete,
 * fuzzy matching, and highlighted results.
 */

import type { Movie, Series } from "@/types/media";
import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────

export interface SearchParams {
	q: string;
	type?: "movie" | "series";
	genre?: string;
	year?: number;
	country?: string;
	lang?: string;
	page?: number;
	limit?: number;
	sort?: "relevance" | "rating" | "year" | "newest";
}

export interface SearchResultItem {
	id: string;
	title: string;
	originalTitle: string | null;
	description: string | null;
	shortDescription: string | null;
	type: "movie" | "series";
	year: number | null;
	rating: number | null;
	posterUrl: string | null;
	thumbnailUrl: string | null;
	backdropUrl: string | null;
	genres: string[];
	tags: string[];
	director: string | null;
	country: string | null;
	duration: number | null;
	accessType: string;
	featured: boolean;
	isDubbed: boolean;
	localizedContent: Record<
		string,
		{ title?: string; description?: string; shortDescription?: string }
	> | null;
	highlights?: Record<string, string[]>;
	score?: number;
}

export interface SearchResponse {
	items: SearchResultItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	took: number;
	query: string;
}

export interface SuggestItem {
	id: string;
	title: string;
	originalTitle: string | null;
	type: "movie" | "series";
	year: number | null;
	rating: number | null;
	posterUrl: string | null;
	thumbnailUrl: string | null;
	genres: string[];
	accessType: string;
	highlight?: string;
}

export interface SuggestResponse {
	items: SuggestItem[];
	total: number;
	took: number;
	query: string;
}

// ─── Transform helpers ───────────────────────────────────────────────────

function transformSearchItemToMedia(item: SearchResultItem): Movie | Series {
	const slug =
		item.title
			?.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim() || item.id;

	return {
		id: item.id,
		slug,
		title: item.title,
		originalTitle: item.originalTitle || undefined,
		description: item.description || "",
		poster: item.posterUrl || "",
		backdrop: item.backdropUrl || "",
		year: item.year || 0,
		rating: item.rating || 0,
		genres: item.genres || [],
		tags: item.tags || [],
		accessType: (item.accessType as any) || "free",
		type: item.type,
		duration: item.duration || undefined,
		featured: item.featured,
		// Preserve search-specific data
		highlights: item.highlights,
		score: item.score,
		localizedContent: item.localizedContent,
	} as any;
}

// ─── API Methods ─────────────────────────────────────────────────────────

export const searchApi = {
	/**
	 * Full-text search with Elasticsearch
	 * Supports fuzzy matching, filters, highlighting, and pagination
	 */
	async search(params: SearchParams): Promise<SearchResponse> {
		const response = await apiClient.get<SearchResponse>(
			"/search",
			params as any,
		);
		return response;
	},

	/**
	 * Search and transform results to Movie/Series format
	 */
	async searchContent(params: SearchParams): Promise<{
		items: (Movie | Series)[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		took: number;
		query: string;
	}> {
		const response = await this.search(params);
		return {
			...response,
			items: response.items.map(transformSearchItemToMedia),
		};
	},

	/**
	 * Autocomplete suggestions
	 * Returns lightweight results for dropdown display
	 */
	async suggest(params: { q: string; limit?: number }): Promise<SuggestResponse> {
		const response = await apiClient.get<SuggestResponse>(
			"/search/suggest",
			params as any,
		);
		return response;
	},

	/**
	 * Check search health
	 */
	async health(): Promise<{ elasticsearch: boolean }> {
		return apiClient.get<{ elasticsearch: boolean }>("/search/health");
	},
};
