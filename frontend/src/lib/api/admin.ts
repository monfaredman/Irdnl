import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const adminApi = axios.create({
	baseURL: `${API_BASE_URL}/admin`,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("admin_access_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

// Handle token refresh on 401
adminApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshToken = localStorage.getItem("admin_refresh_token");
				if (refreshToken) {
					const response = await axios.post(
						`${API_BASE_URL}/auth/admin/refresh`,
						{
							refresh_token: refreshToken,
						},
					);
					const { access_token } = response.data;
					localStorage.setItem("admin_access_token", access_token);
					originalRequest.headers.Authorization = `Bearer ${access_token}`;
					return adminApi(originalRequest);
				}
			} catch (refreshError) {
				// Refresh failed, redirect to login
				if (typeof window !== "undefined") {
					localStorage.removeItem("admin_access_token");
					localStorage.removeItem("admin_refresh_token");
					window.location.href = "/admin/login";
				}
			}
		}
		return Promise.reject(error);
	},
);

// Auth API
export const authApi = {
	login: async (email: string, password: string) => {
		const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
			email,
			password,
		});
		return response.data;
	},
	refresh: async (refreshToken: string) => {
		const response = await axios.post(`${API_BASE_URL}/auth/admin/refresh`, {
			refresh_token: refreshToken,
		});
		return response.data;
	},
	resetPassword: async (email: string) => {
		const response = await axios.post(`${API_BASE_URL}/auth/admin/reset`, {
			email,
		});
		return response.data;
	},
};

// Content API
export const contentApi = {
	list: async (params?: {
		page?: number;
		limit?: number;
		search?: string;
		type?: string;
		status?: string;
	}) => {
		const response = await adminApi.get("/content", { params });
		return response.data;
	},
	get: async (id: string) => {
		const response = await adminApi.get(`/content/${id}`);
		return response.data;
	},
	create: async (data: any) => {
		const response = await adminApi.post("/content", data);
		return response.data;
	},
	update: async (id: string, data: any) => {
		const response = await adminApi.put(`/content/${id}`, data);
		return response.data;
	},
	delete: async (id: string) => {
		await adminApi.delete(`/content/${id}`);
	},
};

// Users API
export const usersApi = {
	list: async (params?: {
		page?: number;
		limit?: number;
		search?: string;
		role?: string;
	}) => {
		const response = await adminApi.get("/users", { params });
		return response.data;
	},
	get: async (id: string) => {
		const response = await adminApi.get(`/users/${id}`);
		return response.data;
	},
	create: async (data: {
		email: string;
		password: string;
		name: string;
		role?: string;
		avatarUrl?: string;
		isActive?: boolean;
	}) => {
		const response = await adminApi.post("/users", data);
		return response.data;
	},
	update: async (id: string, data: any) => {
		const response = await adminApi.patch(`/users/${id}`, data);
		return response.data;
	},
	delete: async (id: string) => {
		await adminApi.delete(`/users/${id}`);
	},
};

// Seasons & Episodes API
export const seasonsApi = {
	create: async (data: {
		seriesId: string;
		number: number;
		title?: string;
	}) => {
		const response = await adminApi.post("/seasons", data);
		return response.data;
	},
	update: async (id: string, data: { number?: number; title?: string }) => {
		const response = await adminApi.put(`/seasons/${id}`, data);
		return response.data;
	},
	delete: async (id: string) => {
		await adminApi.delete(`/seasons/${id}`);
	},
};

export const episodesApi = {
	create: async (data: {
		seasonId: string;
		title: string;
		number: number;
		description?: string;
		duration?: number;
		thumbnailUrl?: string;
		videoAssetId?: string;
		externalPlayerUrl?: string;
	}) => {
		const response = await adminApi.post("/episodes", data);
		return response.data;
	},
	update: async (
		id: string,
		data: {
			title?: string;
			number?: number;
			description?: string;
			duration?: number;
			thumbnailUrl?: string;
			videoAssetId?: string;
			externalPlayerUrl?: string;
		},
	) => {
		const response = await adminApi.put(`/episodes/${id}`, data);
		return response.data;
	},
	delete: async (id: string) => {
		await adminApi.delete(`/episodes/${id}`);
	},
};

// Videos API
export const videosApi = {
	list: async (contentId?: string) => {
		const response = await adminApi.get("/videos", { params: { contentId } });
		return response.data;
	},
	get: async (id: string) => {
		const response = await adminApi.get(`/videos/${id}`);
		return response.data;
	},
	upload: async (file: File, contentId: string, quality: string) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("contentId", contentId);
		formData.append("quality", quality);
		const response = await adminApi.post("/videos/upload", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	},
	uploadForEpisode: async (
		file: File,
		contentId: string,
		episodeId: string,
		quality: string,
	) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("contentId", contentId);
		formData.append("episodeId", episodeId);
		formData.append("quality", quality);
		const response = await adminApi.post("/videos/upload", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	},
	markTranscoded: async (
		assetId: string,
		data: { hlsUrl: string; duration: number; status?: string },
	) => {
		const response = await adminApi.post(
			`/videos/${assetId}/mark-transcoded`,
			data,
		);
		return response.data;
	},
	delete: async (id: string) => {
		await adminApi.delete(`/videos/${id}`);
	},
};

// Images API
export const imagesApi = {
	upload: async (file: File, type: "poster" | "banner") => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", type);
		const response = await adminApi.post("/images/upload", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	},
};

// Analytics API
export const analyticsApi = {
	getDashboard: async () => {
		const response = await adminApi.get("/analytics/dashboard");
		return response.data;
	},
};

// ========================================================================
// CATEGORIES API
// ========================================================================
export const categoriesApi = {
	list: async () => {
		const response = await adminApi.get("/categories");
		return response.data;
	},
	get: async (id: string) => {
		const response = await adminApi.get(`/categories/${id}`);
		return response.data;
	},
	create: async (data: {
		slug: string;
		nameEn: string;
		nameFa: string;
		contentType?: string;
		descriptionEn?: string;
		descriptionFa?: string;
		gradientColors?: string[];
		icon?: string;
		imageUrl?: string;
		tmdbParams?: Record<string, any>;
		showEpisodes?: boolean;
		isActive?: boolean;
		sortOrder?: number;
	}) => {
		const response = await adminApi.post("/categories", data);
		return response.data;
	},
	update: async (id: string, data: any) => {
		const response = await adminApi.put(`/categories/${id}`, data);
		return response.data;
	},
	delete: async (id: string) => {
		await adminApi.delete(`/categories/${id}`);
	},
};

// ========================================================================
// GENRES API
// ========================================================================
export const genresApi = {
	list: async (categorySlug?: string) => {
		const response = await adminApi.get("/genres", {
			params: categorySlug ? { categorySlug } : {},
		});
		return response.data;
	},
	get: async (id: string) => {
		const response = await adminApi.get(`/genres/${id}`);
		return response.data;
	},
	create: async (data: {
		slug: string;
		nameEn: string;
		nameFa: string;
		tmdbGenreId?: string;
		categorySlugs?: string[];
		isActive?: boolean;
		sortOrder?: number;
	}) => {
		const response = await adminApi.post("/genres", data);
		return response.data;
	},
	update: async (id: string, data: any) => {
		const response = await adminApi.put(`/genres/${id}`, data);
		return response.data;
	},
	delete: async (id: string) => {
		await adminApi.delete(`/genres/${id}`);
	},
};

// ========================================================================
// SLIDERS API
// ========================================================================
export const slidersApi = {
	list: async (section?: string) => {
		const response = await adminApi.get("/sliders", {
			params: section ? { section } : {},
		});
		return response.data;
	},
	get: async (id: string) => {
		const response = await adminApi.get(`/sliders/${id}`);
		return response.data;
	},
	create: async (data: {
		title: string;
		titleFa?: string;
		description?: string;
		descriptionFa?: string;
		imageUrl?: string;
		linkUrl?: string;
		contentId?: string;
		section?: string;
		isActive?: boolean;
		sortOrder?: number;
		startDate?: string;
		endDate?: string;
	}) => {
		const response = await adminApi.post("/sliders", data);
		return response.data;
	},
	update: async (id: string, data: any) => {
		const response = await adminApi.put(`/sliders/${id}`, data);
		return response.data;
	},
	delete: async (id: string) => {
		await adminApi.delete(`/sliders/${id}`);
	},
};

// ========================================================================
// OFFERS API
// ========================================================================
export const offersApi = {
	list: async () => {
		const response = await adminApi.get("/offers");
		return response.data;
	},
	get: async (id: string) => {
		const response = await adminApi.get(`/offers/${id}`);
		return response.data;
	},
	create: async (data: {
		title: string;
		titleFa?: string;
		description?: string;
		descriptionFa?: string;
		imageUrl?: string;
		linkUrl?: string;
		discountPercent?: number;
		discountCode?: string;
		originalPrice?: number;
		offerPrice?: number;
		isActive?: boolean;
		sortOrder?: number;
		startDate?: string;
		endDate?: string;
	}) => {
		const response = await adminApi.post("/offers", data);
		return response.data;
	},
	update: async (id: string, data: any) => {
		const response = await adminApi.put(`/offers/${id}`, data);
		return response.data;
	},
	delete: async (id: string) => {
		await adminApi.delete(`/offers/${id}`);
	},
};

// ========================================================================
// PINS API
// ========================================================================
export const pinsApi = {
	list: async (section?: string) => {
		const response = await adminApi.get("/pins", {
			params: section ? { section } : {},
		});
		return response.data;
	},
	get: async (id: string) => {
		const response = await adminApi.get(`/pins/${id}`);
		return response.data;
	},
	create: async (data: {
		contentId: string;
		section: string;
		label?: string;
		labelFa?: string;
		isActive?: boolean;
		sortOrder?: number;
	}) => {
		const response = await adminApi.post("/pins", data);
		return response.data;
	},
	update: async (id: string, data: any) => {
		const response = await adminApi.put(`/pins/${id}`, data);
		return response.data;
	},
	delete: async (id: string) => {
		await adminApi.delete(`/pins/${id}`);
	},
};

// Notifications API
export const notificationsApi = {
	list: async (params?: { page?: number; limit?: number; type?: string }) => {
		const response = await adminApi.get("/notifications", { params });
		return response.data;
	},
	get: async (id: string) => {
		const response = await adminApi.get(`/notifications/${id}`);
		return response.data;
	},
	create: async (data: {
		title: string;
		message: string;
		type: "push" | "email";
		userId?: string;
	}) => {
		const response = await adminApi.post("/notifications", data);
		return response.data;
	},
};

// Collections API
export const collectionsApi = {
	list: async (params?: { page?: number; limit?: number }) => {
		const response = await adminApi.get("/collections", { params });
		return response.data;
	},
	get: async (id: string) => {
		const response = await adminApi.get(`/collections/${id}`);
		return response.data;
	},
	create: async (data: {
		slug: string;
		title: string;
		titleFa?: string;
		description?: string;
		descriptionFa?: string;
		posterUrl?: string;
		backdropUrl?: string;
		contentIds?: string[];
		isActive?: boolean;
		sortOrder?: number;
	}) => {
		const response = await adminApi.post("/collections", data);
		return response.data;
	},
	update: async (id: string, data: any) => {
		const response = await adminApi.put(`/collections/${id}`, data);
		return response.data;
	},
	delete: async (id: string) => {
		await adminApi.delete(`/collections/${id}`);
	},
};

// ========================================================================
// TMDB Helper API (Admin Only) - Used for auto-fill in content wizard
// ========================================================================

export interface TMDBSearchResult {
	tmdbId: string;
	mediaType: "movie" | "tv";
	title: string;
	originalTitle: string;
	description: string;
	year: number | null;
	posterUrl: string;
	backdropUrl: string;
	rating: number;
	originalLanguage: string;
	genreIds: number[];
	originCountry?: string[];
}

export interface TMDBSearchResponse {
	items: TMDBSearchResult[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface TMDBContentDetails {
	title: string;
	originalTitle: string;
	tagline: string;
	type: "movie" | "series";
	year: number | null;
	description: string;
	duration: number | null;
	posterUrl: string;
	bannerUrl: string;
	backdropUrl: string;
	rating: number;
	genres: string[];
	originalLanguage: string;
	languages: string[];
	cast: Array<{ name: string; character: string; imageUrl: string }>;
	crew: Array<{ name: string; role: string; department: string }>;
	director: string;
	writer: string;
	producer: string;
	productionCompany: string;
	country: string;
	tmdbId: string;
	imdbId: string;
	numberOfSeasons?: number;
	numberOfEpisodes?: number;
	seasons?: TMDBSeasonSummary[];
}

export interface TMDBSeasonSummary {
	id: number;
	name: string;
	seasonNumber: number;
	episodeCount: number;
	overview: string;
	posterUrl: string;
	airDate: string;
}

export interface TMDBEpisode {
	episodeNumber: number;
	name: string;
	overview: string;
	runtime: number | null;
	stillUrl: string;
	airDate: string;
	voteAverage: number;
}

export interface TMDBSeasonDetail {
	seasonNumber: number;
	name: string;
	overview: string;
	posterUrl: string;
	airDate: string;
	episodes: TMDBEpisode[];
}

export const tmdbApi = {
	/**
	 * Search TMDB for movies and TV shows (admin helper for auto-fill)
	 */
	search: async (
		q: string,
		language: "en" | "fa" = "fa",
		page: number = 1,
	): Promise<TMDBSearchResponse> => {
		const response = await adminApi.get("/tmdb/search", {
			params: { q, language, page },
		});
		return response.data;
	},

	/**
	 * Get full movie details from TMDB for auto-fill
	 */
	getMovieDetails: async (
		tmdbId: string,
		language: "en" | "fa" = "fa",
	): Promise<TMDBContentDetails> => {
		const response = await adminApi.get(`/tmdb/details/movie/${tmdbId}`, {
			params: { language },
		});
		return response.data;
	},

	/**
	 * Get full TV show details from TMDB for auto-fill
	 */
	getTVDetails: async (
		tmdbId: string,
		language: "en" | "fa" = "fa",
	): Promise<TMDBContentDetails> => {
		const response = await adminApi.get(`/tmdb/details/tv/${tmdbId}`, {
			params: { language },
		});
		return response.data;
	},

	/**
	 * Get episodes for a specific TV season from TMDB
	 */
	getTVSeasonEpisodes: async (
		tmdbId: string,
		seasonNumber: number,
		language: "en" | "fa" = "fa",
	): Promise<TMDBSeasonDetail> => {
		const response = await adminApi.get(
			`/tmdb/tv/${tmdbId}/season/${seasonNumber}`,
			{ params: { language } },
		);
		return response.data;
	},

	// ========================================================================
	// TMDB Admin Module - New dedicated endpoints for TMDB management
	// ========================================================================

	// Discover movies/TV with filters
	discover: async (params?: {
		type?: "movie" | "tv";
		language?: "en" | "fa";
		genre?: string;
		withGenres?: string;
		year?: number;
		certification?: string;
		country?: string;
		page?: number;
	}) => {
		const response = await adminApi.get("/tmdb/discover", { params });
		return response.data;
	},

	// Get popular content
	getPopular: async (params?: {
		type?: "movie" | "tv";
		language?: "en" | "fa";
		page?: number;
	}) => {
		const response = await adminApi.get("/tmdb/popular", { params });
		return response.data;
	},

	// Get trending content
	getTrending: async (params?: {
		language?: "en" | "fa";
		mediaType?: "all" | "movie" | "tv";
		timeWindow?: "day" | "week";
		page?: number;
	}) => {
		const response = await adminApi.get("/tmdb/trending", { params });
		return response.data;
	},

	// Get full details (unified endpoint)
	getDetails: async (params: {
		id: string;
		type?: "movie" | "tv";
		language?: "en" | "fa";
	}) => {
		const response = await adminApi.get("/tmdb/details", { params });
		return response.data;
	},

	// Get season details (new unified endpoint)
	getSeasonDetails: async (params: {
		tvId: string;
		seasonNumber: number;
		language?: "en" | "fa";
	}) => {
		const response = await adminApi.get("/tmdb/season-details", { params });
		return response.data;
	},

	// Save content locally for later import
	saveContent: async (data: {
		tmdbId: string;
		mediaType: "movie" | "tv";
		rawData?: any;
		autoImport?: boolean;
	}) => {
		const response = await adminApi.post("/tmdb/saved", data);
		return response.data;
	},

	// Save multiple items at once
	saveBulkContent: async (items: Array<{
		tmdbId: string;
		mediaType: "movie" | "tv";
		rawData?: any;
	}>) => {
		const response = await adminApi.post("/tmdb/saved/bulk", items);
		return response.data;
	},

	// Get saved content list
	getSavedContent: async (params?: {
		page?: number;
		limit?: number;
		mediaType?: string;
		status?: string;
		search?: string;
	}) => {
		const response = await adminApi.get("/tmdb/saved", { params });
		return response.data;
	},

	// Get single saved content by ID
	getSavedContentById: async (id: string) => {
		const response = await adminApi.get(`/tmdb/saved/${id}`);
		return response.data;
	},

	// Import saved content to main database
	importToDatabase: async (savedContentId: string) => {
		const response = await adminApi.post("/tmdb/saved/import", {
			savedContentId,
		});
		return response.data;
	},

	// Delete saved content
	deleteSavedContent: async (id: string) => {
		await adminApi.delete(`/tmdb/saved/${id}`);
	},
};

// Upera API (Gateway calls to Seeko/Upera)
export const uperaApi = {
	// Browse content from Upera
	browseMovies: async (params?: {
		trending?: number;
		genre?: string;
		free?: number;
		country?: number;
		persian?: number;
		query?: string;
		page?: number;
	}) => {
		const response = await adminApi.get("/upera/browse/movies", {
			params,
		});
		return response.data;
	},

	browseSeries: async (params?: {
		trending?: number;
		genre?: string;
		free?: number;
		country?: number;
		persian?: number;
		query?: string;
		page?: number;
	}) => {
		const response = await adminApi.get("/upera/browse/series", {
			params,
		});
		return response.data;
	},

	getSeriesEpisodes: async (seriesId: string) => {
		const response = await adminApi.get(
			`/upera/browse/series/${seriesId}/episodes`,
		);
		return response.data;
	},

	getAffiliateLinks: async (params: {
		id: string;
		type: string;
		ref?: number;
		traffic?: number;
		token?: string;
	}) => {
		const response = await adminApi.get(
			"/upera/browse/affiliate-links",
			{ params },
		);
		return response.data;
	},

	// Purchase
	getPaymentUrl: async (data: {
		qualityId: number;
		episodeId?: string;
		movieId?: string;
		paymentMethod: string;
		mobile: string;
		callbackUrl: string;
		refid?: string;
		token?: string;
		paymentId?: string;
	}) => {
		const response = await adminApi.post("/upera/buy/payment-url", data);
		return response.data;
	},

	paymentCallback: async (data: {
		paymentId: string;
		refNum: string;
		checkItAgain?: number;
		token?: string;
	}) => {
		const response = await adminApi.post("/upera/buy/callback", data);
		return response.data;
	},

	getLink: async (data: {
		id: string;
		type: string;
		mobile: string;
		token?: string;
	}) => {
		const response = await adminApi.post("/upera/buy/get-link", data);
		return response.data;
	},

	// Home Screening
	homeScreeningBuy: async (data: {
		cart: Array<{ id: string }>;
		paymentMethod: string;
		mobile: number;
		token?: string;
		callbackUrl?: string;
		ekran: boolean;
	}) => {
		const response = await adminApi.post("/upera/screening/buy", data);
		return response.data;
	},

	watchMovieHls: async (
		movieId: string,
		mobile: number,
		token?: string,
		ip?: string,
	) => {
		const response = await adminApi.get(
			`/upera/screening/watch/${movieId}`,
			{ params: { mobile, token, ip } },
		);
		return response.data;
	},

	getEkranToken: async (
		movieId: string,
		mobile: string,
		token?: string,
	) => {
		const response = await adminApi.get(
			`/upera/screening/ekran/${movieId}`,
			{ params: { mobile, token } },
		);
		return response.data;
	},

	// Local Storage & Import
	saveMoviesToLocal: async (items: any[]) => {
		const response = await adminApi.post("/upera/local/save-movies", {
			items,
		});
		return response.data;
	},

	saveSeriesToLocal: async (items: any[]) => {
		const response = await adminApi.post("/upera/local/save-series", {
			items,
		});
		return response.data;
	},

	getLocalContent: async (params?: {
		page?: number;
		limit?: number;
		type?: string;
		status?: string;
		search?: string;
	}) => {
		const response = await adminApi.get("/upera/local", { params });
		return response.data;
	},

	getLocalContentById: async (id: string) => {
		const response = await adminApi.get(`/upera/local/${id}`);
		return response.data;
	},

	importToDatabase: async (uperaContentId: string) => {
		const response = await adminApi.post("/upera/local/import", {
			uperaContentId,
		});
		return response.data;
	},

	deleteLocalContent: async (id: string) => {
		await adminApi.delete(`/upera/local/${id}`);
	},

	// Upera Site Content (api.upera.tv)
	getDiscover: async (params?: {
		age?: string;
		country?: string;
		discover_page?: number;
		f_type?: string;
		kids?: number;
		lang?: string;
		sortby?: string;
	}) => {
		const response = await adminApi.get("/upera/site/discover", { params });
		return response.data;
	},

	getSliders: async (params?: {
		age?: string;
		media_type?: string;
		location?: string;
		ref?: string;
	}) => {
		const response = await adminApi.get("/upera/site/sliders", { params });
		return response.data;
	},

	getOffers: async (params?: {
		age?: string;
		media_type?: string;
	}) => {
		const response = await adminApi.get("/upera/site/offers", { params });
		return response.data;
	},

	getGenres: async (params?: {
		age?: string;
	}) => {
		const response = await adminApi.get("/upera/site/genres", { params });
		return response.data;
	},

	getPlans: async () => {
		const response = await adminApi.get("/upera/site/plans");
		return response.data;
	},

	// Discover Direct Import
	importDiscoverItem: async (rawItem: Record<string, any>, type?: string) => {
		const response = await adminApi.post("/upera/site/discover/import", {
			rawItem,
			type,
		});
		return response.data;
	},

	importDiscoverBulk: async (items: Record<string, any>[], type?: string) => {
		const response = await adminApi.post("/upera/site/discover/import-bulk", {
			items,
			type,
		});
		return response.data;
	},

	checkImportedItems: async (uperaIds: string[]) => {
		const response = await adminApi.post("/upera/site/discover/check-imported", {
			uperaIds,
		});
		return response.data;
	},
};

// Comments API
export const commentsApi = {
	// Get all comments with filters
	list: async (params?: {
		page?: number;
		limit?: number;
		status?: string;
		type?: string;
		contentId?: string;
		userId?: string;
		search?: string;
		sortBy?: string;
		sortOrder?: "ASC" | "DESC";
	}) => {
		const response = await adminApi.get("/comments", { params });
		return response.data;
	},

	// Get comment statistics
	getStats: async () => {
		const response = await adminApi.get("/comments/stats");
		return response.data;
	},

	// Get single comment
	getById: async (id: string) => {
		const response = await adminApi.get(`/comments/${id}`);
		return response.data;
	},

	// Update comment
	update: async (id: string, data: {
		text?: string;
		status?: string;
		adminReply?: string;
		isPinned?: boolean;
		rating?: number;
	}) => {
		const response = await adminApi.put(`/comments/${id}`, data);
		return response.data;
	},

	// Delete comment
	delete: async (id: string) => {
		await adminApi.delete(`/comments/${id}`);
	},

	// Approve comment
	approve: async (id: string) => {
		const response = await adminApi.post(`/comments/${id}/approve`);
		return response.data;
	},

	// Reject comment
	reject: async (id: string) => {
		const response = await adminApi.post(`/comments/${id}/reject`);
		return response.data;
	},

	// Mark as spam
	markAsSpam: async (id: string) => {
		const response = await adminApi.post(`/comments/${id}/spam`);
		return response.data;
	},

	// Bulk action
	bulkAction: async (ids: string[], action: "approve" | "reject" | "delete" | "spam") => {
		const response = await adminApi.post("/comments/bulk-action", { ids, action });
		return response.data;
	},
};

export const blogApi = {
	// List blog posts
	list: async (params?: {
		page?: number;
		limit?: number;
		status?: string;
		category?: string;
		search?: string;
		tag?: string;
		isFeatured?: boolean;
		sortBy?: string;
		sortOrder?: string;
	}) => {
		const response = await adminApi.get("/blog", { params });
		return response.data;
	},

	// Get statistics
	getStats: async () => {
		const response = await adminApi.get("/blog/stats");
		return response.data;
	},

	// Get single blog post
	getById: async (id: string) => {
		const response = await adminApi.get(`/blog/${id}`);
		return response.data;
	},

	// Create blog post
	create: async (data: {
		title: string;
		slug: string;
		excerpt: string;
		content: string;
		coverImage?: string;
		status: string;
		category: string;
		tags?: string[];
		scheduledAt?: string;
		isFeatured?: boolean;
		metaTitle?: string;
		metaDescription?: string;
		metaKeywords?: string[];
	}) => {
		const response = await adminApi.post("/blog", data);
		return response.data;
	},

	// Update blog post
	update: async (id: string, data: {
		title?: string;
		slug?: string;
		excerpt?: string;
		content?: string;
		coverImage?: string;
		status?: string;
		category?: string;
		tags?: string[];
		scheduledAt?: string;
		isFeatured?: boolean;
		metaTitle?: string;
		metaDescription?: string;
		metaKeywords?: string[];
	}) => {
		const response = await adminApi.put(`/blog/${id}`, data);
		return response.data;
	},

	// Delete blog post
	delete: async (id: string) => {
		await adminApi.delete(`/blog/${id}`);
	},
};

// ── User Profile API (calls /user/* instead of /admin/*) ──
// Must use the BACKEND API URL, not the Next.js frontend URL
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const userApi = axios.create({
	baseURL: `${BACKEND_API_URL}/user`,
	headers: { "Content-Type": "application/json" },
});

userApi.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("admin_access_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

// Handle token refresh on 401 for userApi
userApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshToken = localStorage.getItem("admin_refresh_token");
				if (refreshToken) {
					const response = await axios.post(
						`${BACKEND_API_URL}/auth/admin/refresh`,
						{ refresh_token: refreshToken },
					);
					const { access_token } = response.data;
					localStorage.setItem("admin_access_token", access_token);
					originalRequest.headers.Authorization = `Bearer ${access_token}`;
					return userApi(originalRequest);
				}
			} catch (refreshError) {
				if (typeof window !== "undefined") {
					localStorage.removeItem("admin_access_token");
					localStorage.removeItem("admin_refresh_token");
					window.location.href = "/admin/login";
				}
			}
		}
		return Promise.reject(error);
	},
);

export const profileApi = {
	// Get current user profile
	getMe: async () => {
		const response = await userApi.get("/me");
		return response.data;
	},

	// Update current user profile (name, avatarUrl)
	updateMe: async (data: { name?: string; avatarUrl?: string }) => {
		const response = await userApi.put("/me", data);
		return response.data;
	},

	// Change password
	changePassword: async (data: { currentPassword: string; newPassword: string }) => {
		const response = await userApi.post("/me/change-password", data);
		return response.data;
	},

	// Upload avatar image
	uploadAvatar: async (file: File): Promise<{ url: string }> => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", "poster");
		const response = await adminApi.post("/images/upload", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	},
};

// ─── Admin Tickets API ─────────────────────────────────────────
export const ticketsApi = {
	list: async (status?: string) => {
		const params = status ? { params: { status } } : {};
		const response = await adminApi.get("/tickets", params);
		return response.data;
	},
	getStats: async () => {
		const response = await adminApi.get("/tickets/stats");
		return response.data;
	},
	get: async (id: string) => {
		const response = await adminApi.get(`/tickets/${id}`);
		return response.data;
	},
	reply: async (id: string, data: { adminReply: string; status?: string }) => {
		const response = await adminApi.put(`/tickets/${id}/reply`, data);
		return response.data;
	},
	updateStatus: async (id: string, status: string) => {
		const response = await adminApi.put(`/tickets/${id}/status`, { status });
		return response.data;
	},
	delete: async (id: string) => {
		const response = await adminApi.delete(`/tickets/${id}`);
		return response.data;
	},
};

export default adminApi;
