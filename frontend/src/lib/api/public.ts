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
	contentType: "movie" | "series" | "mixed" | "other";
	descriptionEn?: string;
	descriptionFa?: string;
	gradientColors?: string[];
	icon?: string;
	imageUrl?: string;
	tmdbParams?: Record<string, any>;
	showEpisodes?: boolean;
	isActive: boolean;
	showInMenu: boolean;
	showInLanding: boolean;
	sortOrder: number;
	parentId?: string | null;
	urlPath?: string | null;
	parent?: Category | null;
	children?: Category[];
	createdAt: string;
	updatedAt: string;
}

/** Menu category is a top-level category with optional nested children */
export type MenuCategory = Category & {
	children: Category[];
};

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
	backdropUrl?: string;
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

export interface Collection {
	id: string;
	slug: string;
	title: string;
	titleFa?: string;
	description?: string;
	descriptionFa?: string;
	posterUrl?: string;
	backdropUrl?: string;
	contentIds: string[];
	isActive: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
	contents?: any[];
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
	 * List categories that should appear in menu (tree structure with children)
	 */
	listMenu: async (): Promise<ListResponse<MenuCategory>> => {
		const response = await publicApi.get<ListResponse<MenuCategory>>("/categories/menu");
		return response.data;
	},

	/**
	 * List categories that should appear on landing page
	 */
	listLanding: async (): Promise<ListResponse<Category>> => {
		const response = await publicApi.get<ListResponse<Category>>("/categories/landing");
		return response.data;
	},

	/**
	 * Get category by slug
	 */
	getBySlug: async (slug: string): Promise<Category> => {
		const response = await publicApi.get<Category>(`/categories/${slug}`);
		return response.data;
	},

	/**
	 * Get category by URL path (e.g. "foreign" or "foreign" + "action")
	 */
	getByPath: async (parentPath: string, childPath?: string): Promise<Category> => {
		const url = childPath
			? `/categories/path/${parentPath}/${childPath}`
			: `/categories/path/${parentPath}`;
		const response = await publicApi.get<Category>(url);
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

// ========================================================================
// COLLECTIONS API
// ========================================================================

export const collectionsApi = {
	/**
	 * List all active collections
	 */
	list: async (): Promise<ListResponse<Collection>> => {
		const response = await publicApi.get<ListResponse<Collection>>("/collections");
		return response.data;
	},

	/**
	 * Get collection by slug with contents
	 */
	getBySlug: async (slug: string): Promise<Collection> => {
		const response = await publicApi.get<Collection>(`/collections/${slug}`);
		return response.data;
	},
};

// ========================================================================
// PUBLIC COMMENTS API (outside /public prefix)
// ========================================================================

const commentsPublicApi = axios.create({
	baseURL: `${API_BASE_URL}/api/comments`,
	headers: {
		"Content-Type": "application/json",
	},
});

// ========================================================================
// BLOG PUBLIC API
// ========================================================================

const blogPublicApi = axios.create({
	baseURL: `${API_BASE_URL}/api/blog`,
	headers: {
		"Content-Type": "application/json",
	},
});

export const publicBlogApi = {
	/** Like a blog post by slug */
	like: async (slug: string): Promise<{ likesCount: number }> => {
		const response = await blogPublicApi.post<{ likesCount: number }>(
			`/${slug}/like`,
		);
		return response.data;
	},
};

export interface PublicComment {
	id: string;
	text: string;
	userName?: string;
	userEmail?: string;
	rating?: number;
	likesCount: number;
	status: string;
	createdAt: string;
	user?: {
		id: string;
		name: string;
		email: string;
		avatarUrl?: string;
	};
	replies?: PublicComment[];
	parentId?: string;
}

export interface PublicCommentsResponse {
	data: PublicComment[];
	comments: PublicComment[];
	total: number;
	page: number;
	limit: number;
}

export const publicCommentsApi = {
	/**
	 * Get approved comments for a content item
	 */
	getByContentId: async (
		contentId: string,
		page = 1,
		limit = 20,
	): Promise<PublicCommentsResponse> => {
		const response = await commentsPublicApi.get<PublicCommentsResponse>(
			`/content/${contentId}`,
			{ params: { page, limit } },
		);
		return response.data;
	},

	/**
	 * Create a new comment (public)
	 */
	create: async (data: {
		text: string;
		contentId: string;
		parentId?: string;
		userName?: string;
		userEmail?: string;
		rating?: number;
	}): Promise<PublicComment> => {
		const token =
			typeof window !== "undefined"
				? localStorage.getItem("access_token")
				: null;

		const response = await commentsPublicApi.post<PublicComment>("/", data, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		return response.data;
	},

	/**
	 * Like a comment
	 */
	like: async (commentId: string): Promise<{ likesCount: number }> => {
		const response = await commentsPublicApi.post<{ likesCount: number }>(
			`/${commentId}/like`,
		);
		return response.data;
	},
};

// ========================================================================
// PLAY TABLES API (PUBLIC)
// ========================================================================
export interface PlayTablePublic {
	id: string;
	title: string;
	titleFa: string | null;
	description: string | null;
	descriptionFa: string | null;
	contentIds: string[];
	startTime: string;
	endTime: string;
	status: string;
	imageUrl: string | null;
	isActive: boolean;
	sortOrder: number;
	contents: Array<{
		id: string;
		title: string;
		originalTitle?: string;
		posterUrl?: string;
		backdropUrl?: string;
		bannerUrl?: string;
		rating?: number;
		year?: number;
		type?: string;
		genres?: string[];
	}>;
}

export const playTablesApi = {
	list: async (): Promise<{ data: PlayTablePublic[]; total: number }> => {
		const response = await publicApi.get("/play-tables");
		return response.data;
	},
};
