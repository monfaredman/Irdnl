/**
 * Authentication API Client
 *
 * API functions for authentication operations with the NestJS backend
 */

import type {
	AuthResponse,
	LoginRequest,
	LogoutResponse,
	PasswordResetResponse,
	RefreshResponse,
	RegisterRequest,
	RegisterResponse,
} from "@/types/auth";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Helper function to make API requests
 */
async function authFetch<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`;

	const headers = new Headers(options.headers);
	if (!headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	const response = await fetch(url, {
		...options,
		headers,
		credentials: "include",
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({
			message: response.statusText,
			statusCode: response.status,
		}));
		throw new Error(errorData.message || `API error: ${response.status}`);
	}

	return response.json();
}

/**
 * Authentication API functions
 */
export const authApi = {
	/**
	 * Register a new user
	 */
	register: async (data: RegisterRequest): Promise<RegisterResponse> => {
		return authFetch<RegisterResponse>("/auth/register", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},

	/**
	 * Login with email and password
	 */
	login: async (data: LoginRequest): Promise<AuthResponse> => {
		return authFetch<AuthResponse>("/auth/login", {
			method: "POST",
			body: JSON.stringify(data),
		});
	},

	/**
	 * Refresh access token using refresh token
	 */
	refresh: async (refreshToken: string): Promise<RefreshResponse> => {
		return authFetch<RefreshResponse>("/auth/refresh", {
			method: "POST",
			body: JSON.stringify({ refresh_token: refreshToken }),
		});
	},

	/**
	 * Logout user (requires auth token)
	 */
	logout: async (accessToken: string): Promise<LogoutResponse> => {
		return authFetch<LogoutResponse>("/auth/logout", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	},

	/**
	 * Request password reset
	 */
	requestPasswordReset: async (
		email: string,
	): Promise<PasswordResetResponse> => {
		return authFetch<PasswordResetResponse>("/auth/reset-password", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
	},

	/**
	 * Get current user profile (requires auth)
	 */
	getMe: async (accessToken: string) => {
		return authFetch<{
			id: string;
			email: string;
			name: string;
			role: string;
			avatarUrl?: string | null;
		}>("/user/me", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	},

	/**
	 * Update current user profile (requires auth)
	 */
	updateMe: async (
		accessToken: string,
		data: { name?: string; avatarUrl?: string },
	) => {
		return authFetch<{
			id: string;
			email: string;
			name: string;
			role: string;
			avatarUrl?: string | null;
		}>("/user/me", {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(data),
		});
	},
};

export default authApi;
