/**
 * Backend API Client
 *
 * Type-safe client for communicating with the NestJS backend API
 * Includes automatic token refresh on 401 errors
 */

import { getAccessToken, getRefreshToken, useAuthStore } from "@/store/auth";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type QueryParamPrimitive = string | number | boolean | null | undefined;

export type QueryParams = Record<string, QueryParamPrimitive>;

interface RequestOptions extends RequestInit {
	params?: object;
	skipAuth?: boolean;
}

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Attempt to refresh the access token
 */
async function refreshAccessToken(): Promise<string | null> {
	const refreshToken = getRefreshToken();
	if (!refreshToken) {
		return null;
	}

	try {
		const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refresh_token: refreshToken }),
		});

		if (!response.ok) {
			throw new Error("Refresh failed");
		}

		const data = await response.json();
		const newAccessToken = data.access_token;

		// Update store with new token
		const store = useAuthStore.getState();
		if (store.user && refreshToken) {
			store.setAuth(store.user, newAccessToken, refreshToken);
		}

		return newAccessToken;
	} catch {
		// Refresh failed, logout user
		useAuthStore.getState().logout();
		return null;
	}
}

/**
 * Get a fresh access token, refreshing if necessary
 */
async function getFreshToken(): Promise<string | null> {
	if (isRefreshing && refreshPromise) {
		return refreshPromise;
	}

	isRefreshing = true;
	refreshPromise = refreshAccessToken();

	try {
		const token = await refreshPromise;
		return token;
	} finally {
		isRefreshing = false;
		refreshPromise = null;
	}
}

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	private buildUrl(endpoint: string, params?: object): string {
		const url = new URL(`${this.baseUrl}${endpoint}`);

		if (params) {
			Object.entries(params as Record<string, unknown>).forEach(
				([key, value]) => {
					if (value === undefined || value === null) return;
					// Only serialize primitives cleanly.
					if (
						typeof value === "string" ||
						typeof value === "number" ||
						typeof value === "boolean"
					) {
						url.searchParams.set(key, String(value));
					}
				},
			);
		}

		return url.toString();
	}

	private async request<T>(
		endpoint: string,
		options: RequestOptions = {},
	): Promise<T> {
		const { params, skipAuth, ...fetchOptions } = options;
		const url = this.buildUrl(endpoint, params);

		const headers = new Headers(fetchOptions.headers);
		if (!headers.has("Content-Type")) {
			headers.set("Content-Type", "application/json");
		}

		// Add auth token if available and not skipped
		if (!skipAuth && typeof window !== "undefined") {
			const token = getAccessToken();
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
		}

		try {
			let response = await fetch(url, {
				...fetchOptions,
				headers,
				credentials: "include",
			});

			// Handle 401 Unauthorized - try to refresh token
			if (response.status === 401 && !skipAuth) {
				const newToken = await getFreshToken();

				if (newToken) {
					// Retry the request with new token
					headers.set("Authorization", `Bearer ${newToken}`);
					response = await fetch(url, {
						...fetchOptions,
						headers,
						credentials: "include",
					});
				}
			}

			if (!response.ok) {
				const error = await response.json().catch(() => ({
					message: response.statusText,
					status: response.status,
				}));
				throw new Error(error.message || `API error: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Network error occurred");
		}
	}

	async get<T>(endpoint: string, params?: object, options?: RequestOptions): Promise<T> {
		return this.request<T>(endpoint, { method: "GET", params, ...options });
	}

	async post<T>(endpoint: string, data?: unknown, params?: object, options?: RequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
			params,
			...options,
		});
	}

	async put<T>(endpoint: string, data?: unknown, params?: object, options?: RequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
			params,
			...options,
		});
	}

	async delete<T>(endpoint: string, params?: object, options?: RequestOptions): Promise<T> {
		return this.request<T>(endpoint, { method: "DELETE", params, ...options });
	}
}

export const apiClient = new ApiClient(API_BASE_URL);
