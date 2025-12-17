/**
 * Backend API Client
 *
 * Type-safe client for communicating with the NestJS backend API
 */

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type QueryParamPrimitive = string | number | boolean | null | undefined;

export type QueryParams = Record<string, QueryParamPrimitive>;

interface RequestOptions extends RequestInit {
	params?: object;
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
		const { params, ...fetchOptions } = options;
		const url = this.buildUrl(endpoint, params);

		const headers = new Headers(fetchOptions.headers);
		if (!headers.has("Content-Type")) {
			headers.set("Content-Type", "application/json");
		}

		// Add auth token if available
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("access_token");
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
		}

		try {
			const response = await fetch(url, {
				...fetchOptions,
				headers,
				credentials: "include",
			});

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

	async get<T>(endpoint: string, params?: object): Promise<T> {
		return this.request<T>(endpoint, { method: "GET", params });
	}

	async post<T>(endpoint: string, data?: unknown, params?: object): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
			params,
		});
	}

	async put<T>(endpoint: string, data?: unknown, params?: object): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
			params,
		});
	}

	async delete<T>(endpoint: string, params?: object): Promise<T> {
		return this.request<T>(endpoint, { method: "DELETE", params });
	}
}

export const apiClient = new ApiClient(API_BASE_URL);
