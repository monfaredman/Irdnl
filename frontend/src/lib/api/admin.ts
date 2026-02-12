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
};

export default adminApi;
