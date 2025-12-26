/**
 * Authentication Store
 *
 * Zustand store for managing user authentication state
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthStore, User } from "@/types/auth";

// Storage keys
const STORAGE_KEY = "auth-storage";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

/**
 * Safe localStorage access (handles SSR)
 */
const safeLocalStorage = {
	getItem: (key: string): string | null => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(key);
	},
	setItem: (key: string, value: string): void => {
		if (typeof window === "undefined") return;
		localStorage.setItem(key, value);
	},
	removeItem: (key: string): void => {
		if (typeof window === "undefined") return;
		localStorage.removeItem(key);
	},
};

/**
 * Initialize auth state from localStorage
 */
const getInitialState = () => {
	const accessToken = safeLocalStorage.getItem(ACCESS_TOKEN_KEY);
	const refreshToken = safeLocalStorage.getItem(REFRESH_TOKEN_KEY);
	const userJson = safeLocalStorage.getItem(USER_KEY);

	let user: User | null = null;
	if (userJson) {
		try {
			user = JSON.parse(userJson);
		} catch {
			// Invalid JSON, clear it
			safeLocalStorage.removeItem(USER_KEY);
		}
	}

	return {
		user,
		accessToken,
		refreshToken,
		isAuthenticated: !!accessToken && !!user,
		isLoading: false,
		error: null,
	};
};

/**
 * Auth store with persistence
 */
export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			// Initial state
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			// Actions
			setAuth: (user: User, accessToken: string, refreshToken: string) => {
				// Store tokens separately for easy access
				safeLocalStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
				safeLocalStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
				safeLocalStorage.setItem(USER_KEY, JSON.stringify(user));

				set({
					user,
					accessToken,
					refreshToken,
					isAuthenticated: true,
					error: null,
				});
			},

			setLoading: (isLoading: boolean) => {
				set({ isLoading });
			},

			setError: (error: string | null) => {
				set({ error, isLoading: false });
			},

			clearError: () => {
				set({ error: null });
			},

			logout: () => {
				// Clear all auth data from localStorage
				safeLocalStorage.removeItem(ACCESS_TOKEN_KEY);
				safeLocalStorage.removeItem(REFRESH_TOKEN_KEY);
				safeLocalStorage.removeItem(USER_KEY);

				set({
					user: null,
					accessToken: null,
					refreshToken: null,
					isAuthenticated: false,
					error: null,
				});
			},

			initialize: () => {
				const initialState = getInitialState();
				set(initialState);
			},
		}),
		{
			name: STORAGE_KEY,
			storage: createJSONStorage(() => ({
				getItem: (name) => {
					if (typeof window === "undefined") return null;
					return localStorage.getItem(name);
				},
				setItem: (name, value) => {
					if (typeof window === "undefined") return;
					localStorage.setItem(name, value);
				},
				removeItem: (name) => {
					if (typeof window === "undefined") return;
					localStorage.removeItem(name);
				},
			})),
			partialize: (state) => ({
				user: state.user,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);

/**
 * Selector hooks for specific state slices
 */
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
	useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () =>
	useAuthStore((state) => state.refreshToken);

/**
 * Get access token outside React components
 */
export const getAccessToken = (): string | null => {
	return safeLocalStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token outside React components
 */
export const getRefreshToken = (): string | null => {
	return safeLocalStorage.getItem(REFRESH_TOKEN_KEY);
};
