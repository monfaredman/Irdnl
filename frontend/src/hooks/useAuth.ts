/**
 * useAuth Hook
 *
 * Custom hook for authentication operations
 * Provides login, register, logout, and token refresh functionality
 */

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import {
	useAuthStore,
	getAccessToken,
	getRefreshToken,
} from "@/store/auth";
import type { LoginRequest, RegisterRequest, User } from "@/types/auth";

export interface UseAuthReturn {
	// State
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;

	// Actions
	login: (data: LoginRequest) => Promise<boolean>;
	register: (data: RegisterRequest) => Promise<boolean>;
	logout: () => Promise<void>;
	refreshToken: () => Promise<boolean>;
	clearError: () => void;
}

export function useAuth(): UseAuthReturn {
	const router = useRouter();
	const store = useAuthStore();

	const {
		user,
		isAuthenticated,
		isLoading,
		error,
		setAuth,
		setLoading,
		setError,
		clearError,
		logout: clearAuth,
	} = store;

	/**
	 * Login with email and password
	 */
	const login = useCallback(
		async (data: LoginRequest): Promise<boolean> => {
			setLoading(true);
			setError(null);

			try {
				const response = await authApi.login(data);
				setAuth(response.user, response.access_token, response.refresh_token);
				return true;
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Login failed. Please try again.";
				setError(message);
				return false;
			} finally {
				setLoading(false);
			}
		},
		[setAuth, setLoading, setError],
	);

	/**
	 * Register a new user
	 */
	const register = useCallback(
		async (data: RegisterRequest): Promise<boolean> => {
			setLoading(true);
			setError(null);

			try {
				await authApi.register(data);
				// After registration, automatically log in
				const loginResponse = await authApi.login({
					email: data.email,
					password: data.password,
				});
				setAuth(
					loginResponse.user,
					loginResponse.access_token,
					loginResponse.refresh_token,
				);
				return true;
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: "Registration failed. Please try again.";
				setError(message);
				return false;
			} finally {
				setLoading(false);
			}
		},
		[setAuth, setLoading, setError],
	);

	/**
	 * Logout the current user
	 */
	const logout = useCallback(async (): Promise<void> => {
		setLoading(true);

		try {
			const token = getAccessToken();
			if (token) {
				// Try to logout on server (best effort)
				await authApi.logout(token).catch(() => {
					// Ignore errors - we'll clear local state anyway
				});
			}
		} finally {
			clearAuth();
			setLoading(false);
			router.push("/");
		}
	}, [clearAuth, setLoading, router]);

	/**
	 * Refresh the access token using the refresh token
	 */
	const refreshToken = useCallback(async (): Promise<boolean> => {
		const currentRefreshToken = getRefreshToken();

		if (!currentRefreshToken) {
			clearAuth();
			return false;
		}

		try {
			const response = await authApi.refresh(currentRefreshToken);

			// Update only the access token
			const currentUser = store.user;
			if (currentUser && currentRefreshToken) {
				setAuth(currentUser, response.access_token, currentRefreshToken);
			}

			return true;
		} catch {
			// Refresh failed, clear auth
			clearAuth();
			return false;
		}
	}, [store.user, setAuth, clearAuth]);

	return {
		user,
		isAuthenticated,
		isLoading,
		error,
		login,
		register,
		logout,
		refreshToken,
		clearError,
	};
}

export default useAuth;
