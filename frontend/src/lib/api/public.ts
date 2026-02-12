import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

const publicApi = axios.create({
	baseURL: `${API_BASE_URL}/api/public`,
	headers: {
		"Content-Type": "application/json",
	},
});

// ========================================================================
// TYPES
// ========================================================================

export interface Category {
	id: string;
	slug: string;
	nameEn: string;
	nameFa: string;
	contentType: "movie" | "series" | "mixed";
	descriptionEn?: string;
	descriptionFa?: string;
	gradientColors?: string[];
	icon?: string;
	imageUrl?: string;
	tmdbParams?: Record<string, any>;
	showEpisodes?: boolean;
	isActive: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
}

export interface Genre {
	id: string;
	slug: string;
	nameEn: string;
	nameFa: string;
	tmdbGenreId?: string;
	categorySlugs?: string[];
	isActive: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
}

export interface Slider {
	id: string;
	title: string;
	titleFa?: string;
	description?: string;
	descriptionFa?: string;
	imageUrl?: string;
	linkUrl?: string;
	contentId?: string;
	content?: any;
	section: string;
	isActive: boolean;
	sortOrder: number;
	startDate?: string;
	endDate?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Offer {
	id: string;
	title: string;
	titleFa?: string;
	discountPercent?: number;
	discountCode?: string;
	imageUrl?: string;
	linkUrl?: string;
	contentId?: string;
	content?: any;
	isActive: boolean;
	sortOrder: number;
	startDate?: string;
	endDate?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Pin {
	id: string;
	label: string;
	labelFa?: string;
	imageUrl?: string;
	contentId?: string;
	content?: any;
	section: string;
	isActive: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
}

export interface ListResponse<T> {
	data: T[];
	total: number;
}

// ========================================================================
// CATEGORIES API
// ========================================================================

export const categoriesApi = {
	/**
	 * List all active categories
	 */
	list: async (): Promise<ListResponse<Category>> => {
		const response = await publicApi.get<ListResponse<Category>>("/categories");
		return response.data;
	},

	/**
	 * Get category by slug
	 */
	getBySlug: async (slug: string): Promise<Category> => {
		const response = await publicApi.get<Category>(`/categories/${slug}`);
		return response.data;
	},
};

// ========================================================================
// GENRES API
// ========================================================================

export const genresApi = {
	/**
	 * List all active genres, optionally filtered by category
	 */
	list: async (categorySlug?: string): Promise<ListResponse<Genre>> => {
		const response = await publicApi.get<ListResponse<Genre>>("/genres", {
			params: categorySlug ? { categorySlug } : {},
		});
		return response.data;
	},

	/**
	 * Get genre by slug
	 */
	getBySlug: async (slug: string): Promise<Genre> => {
		const response = await publicApi.get<Genre>(`/genres/${slug}`);
		return response.data;
	},
};

// ========================================================================
// SLIDERS API
// ========================================================================

export const slidersApi = {
	/**
	 * List active sliders, optionally filtered by section
	 */
	list: async (section?: string): Promise<ListResponse<Slider>> => {
		const response = await publicApi.get<ListResponse<Slider>>("/sliders", {
			params: section ? { section } : {},
		});
		return response.data;
	},
};

// ========================================================================
// OFFERS API
// ========================================================================

export const offersApi = {
	/**
	 * List active offers
	 */
	list: async (): Promise<ListResponse<Offer>> => {
		const response = await publicApi.get<ListResponse<Offer>>("/offers");
		return response.data;
	},
};

// ========================================================================
// PINS API
// ========================================================================

export const pinsApi = {
	/**
	 * List active pins, optionally filtered by section
	 */
	list: async (section?: string): Promise<ListResponse<Pin>> => {
		const response = await publicApi.get<ListResponse<Pin>>("/pins", {
			params: section ? { section } : {},
		});
		return response.data;
	},
};
