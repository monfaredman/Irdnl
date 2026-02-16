/**
 * User API
 *
 * API methods for user profile, watchlist, watch history, and password management.
 * All endpoints require JWT authentication (handled automatically by apiClient).
 */

import { apiClient } from "./client";

export interface UserProfile {
	id: string;
	email: string;
	name: string;
	role: string;
	avatarUrl?: string | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateProfileData {
	name?: string;
	avatarUrl?: string;
}

export interface ChangePasswordData {
	currentPassword: string;
	newPassword: string;
}

export interface WatchlistItem {
	id: string;
	contentId: string;
	createdAt: string;
	content?: {
		id: string;
		title: string;
		titleFa?: string;
		type: string;
		posterUrl?: string;
		backdropUrl?: string;
		year?: number;
		rating?: number;
		genres?: string[];
		duration?: number;
	};
}

export interface WatchHistoryItem {
	id: string;
	contentId: string;
	progressSeconds: number;
	createdAt: string;
	updatedAt: string;
	content?: {
		id: string;
		title: string;
		titleFa?: string;
		type: string;
		posterUrl?: string;
		backdropUrl?: string;
		year?: number;
		rating?: number;
		genres?: string[];
		duration?: number;
	};
}

export interface UserNotification {
	id: string;
	title: string;
	message: string;
	type: string;
	isRead: boolean;
	createdAt: string;
}

export interface UserNotificationsResponse {
	data: UserNotification[];
	total: number;
	unreadCount: number;
	page: number;
	limit: number;
}

export interface PlaylistData {
	id: string;
	title: string;
	description?: string | null;
	coverUrl?: string | null;
	isPublic: boolean;
	userId: string;
	likeCount: number;
	shareCount: number;
	createdAt: string;
	updatedAt: string;
	items?: PlaylistItemData[];
	user?: { id: string; name: string; avatarUrl?: string | null };
}

export interface PlaylistItemData {
	id: string;
	playlistId: string;
	contentId: string;
	sortOrder: number;
	note?: string | null;
	createdAt: string;
	content?: {
		id: string;
		title: string;
		originalTitle?: string | null;
		type: string;
		posterUrl?: string | null;
		backdropUrl?: string | null;
		year?: number | null;
		rating?: number | null;
		genres?: string[];
		duration?: number | null;
	};
}

export interface CreatePlaylistInput {
	title: string;
	description?: string;
	coverUrl?: string;
	isPublic?: boolean;
}

export interface UpdatePlaylistInput {
	title?: string;
	description?: string;
	coverUrl?: string;
	isPublic?: boolean;
}

// ─── Tickets ─────────────────────────────────────────────
export interface TicketData {
	id: string;
	subject: string;
	message: string;
	status: "open" | "in_progress" | "answered" | "closed";
	priority: "low" | "medium" | "high";
	category: "general" | "technical" | "billing" | "content" | "account" | "other";
	adminReply: string | null;
	adminReplyAt: string | null;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTicketInput {
	subject: string;
	message: string;
	priority?: "low" | "medium" | "high";
	category?: "general" | "technical" | "billing" | "content" | "account" | "other";
}

export const userApi = {
	/**
	 * Get current user profile
	 */
	async getMe(): Promise<UserProfile> {
		return apiClient.get<UserProfile>("/user/me");
	},

	/**
	 * Update current user profile
	 */
	async updateMe(data: UpdateProfileData): Promise<UserProfile> {
		return apiClient.put<UserProfile>("/user/me", data);
	},

	/**
	 * Change password
	 */
	async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
		return apiClient.post<{ message: string }>("/user/me/change-password", data);
	},

	/**
	 * Get user watchlist
	 */
	async getWatchlist(): Promise<WatchlistItem[]> {
		return apiClient.get<WatchlistItem[]>("/user/watchlist");
	},

	/**
	 * Add content to watchlist
	 */
	async addToWatchlist(contentId: string): Promise<WatchlistItem> {
		return apiClient.post<WatchlistItem>("/user/watchlist", { content_id: contentId });
	},

	/**
	 * Remove content from watchlist
	 */
	async removeFromWatchlist(contentId: string): Promise<void> {
		return apiClient.delete<void>(`/user/watchlist/${contentId}`);
	},

	/**
	 * Get user watch history
	 */
	async getWatchHistory(): Promise<WatchHistoryItem[]> {
		return apiClient.get<WatchHistoryItem[]>("/user/history");
	},

	/**
	 * Record watch progress
	 */
	async recordProgress(contentId: string, progressSeconds: number): Promise<WatchHistoryItem> {
		return apiClient.post<WatchHistoryItem>("/user/history", {
			content_id: contentId,
			progress_seconds: progressSeconds,
		});
	},

	// ─── Notifications ─────────────────────────────────────────
	/**
	 * Get user notifications
	 */
	async getNotifications(page = 1, limit = 20): Promise<UserNotificationsResponse> {
		return apiClient.get<UserNotificationsResponse>("/user/notifications", {
			params: { page, limit },
		});
	},

	/**
	 * Mark a notification as read
	 */
	async markNotificationRead(id: string): Promise<{ success: boolean }> {
		return apiClient.put<{ success: boolean }>(`/user/notifications/${id}/read`);
	},

	/**
	 * Mark all notifications as read
	 */
	async markAllNotificationsRead(): Promise<{ success: boolean }> {
		return apiClient.put<{ success: boolean }>("/user/notifications/read-all");
	},

	// ─── Playlists ─────────────────────────────────────────────
	/**
	 * Create a new playlist
	 */
	async createPlaylist(data: CreatePlaylistInput): Promise<PlaylistData> {
		return apiClient.post<PlaylistData>("/user/playlists", data);
	},

	/**
	 * Get my playlists
	 */
	async getMyPlaylists(): Promise<PlaylistData[]> {
		return apiClient.get<PlaylistData[]>("/user/playlists");
	},

	/**
	 * Get playlist by ID
	 */
	async getPlaylist(id: string): Promise<PlaylistData> {
		return apiClient.get<PlaylistData>(`/user/playlists/${id}`);
	},

	/**
	 * Update a playlist
	 */
	async updatePlaylist(id: string, data: UpdatePlaylistInput): Promise<PlaylistData> {
		return apiClient.put<PlaylistData>(`/user/playlists/${id}`, data);
	},

	/**
	 * Delete a playlist
	 */
	async deletePlaylist(id: string): Promise<void> {
		return apiClient.delete<void>(`/user/playlists/${id}`);
	},

	/**
	 * Add content to playlist
	 */
	async addToPlaylist(playlistId: string, contentId: string, note?: string): Promise<PlaylistItemData> {
		return apiClient.post<PlaylistItemData>(`/user/playlists/${playlistId}/items`, { contentId, note });
	},

	/**
	 * Remove item from playlist
	 */
	async removeFromPlaylist(playlistId: string, itemId: string): Promise<void> {
		return apiClient.delete<void>(`/user/playlists/${playlistId}/items/${itemId}`);
	},

	/**
	 * Reorder playlist items
	 */
	async reorderPlaylist(playlistId: string, itemIds: string[]): Promise<void> {
		await apiClient.put(`/user/playlists/${playlistId}/reorder`, { itemIds });
	},

	/**
	 * Toggle like on a playlist
	 */
	async togglePlaylistLike(playlistId: string): Promise<{ liked: boolean; likeCount: number }> {
		return apiClient.post<{ liked: boolean; likeCount: number }>(`/user/playlists/${playlistId}/like`);
	},

	/**
	 * Share a playlist (increment share count)
	 */
	async sharePlaylist(playlistId: string): Promise<{ shareCount: number }> {
		return apiClient.post<{ shareCount: number }>(`/user/playlists/${playlistId}/share`);
	},

	// ─── Tickets / Support ─────────────────────────────────────
	/**
	 * Create a new support ticket
	 */
	async createTicket(data: CreateTicketInput): Promise<TicketData> {
		return apiClient.post<TicketData>("/user/tickets", data);
	},

	/**
	 * Get my tickets
	 */
	async getMyTickets(): Promise<TicketData[]> {
		return apiClient.get<TicketData[]>("/user/tickets");
	},

	/**
	 * Get ticket by ID
	 */
	async getTicket(id: string): Promise<TicketData> {
		return apiClient.get<TicketData>(`/user/tickets/${id}`);
	},
};
