/**
 * Authentication Provider
 *
 * Context provider for authentication state initialization and token refresh
 */

"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	type ReactNode,
} from "react";
import { useAuthStore, getAccessToken, getRefreshToken } from "@/store/auth";
import { authApi } from "@/lib/api/auth";
import type { User } from "@/types/auth";

interface AuthContextValue {
	isInitialized: boolean;
	user: User | null;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
	isInitialized: false,
	user: null,
	isAuthenticated: false,
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
	children: ReactNode;
}

// Token refresh interval (refresh 1 minute before expiry, assuming 15min token)
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

export function AuthProvider({ children }: AuthProviderProps) {
	const [isInitialized, setIsInitialized] = useState(false);
	const { user, isAuthenticated, setAuth, logout, initialize } = useAuthStore();

	/**
	 * Refresh the access token
	 */
	const refreshAccessToken = useCallback(async () => {
		const refreshToken = getRefreshToken();
		if (!refreshToken) {
			logout();
			return false;
		}

		try {
			const response = await authApi.refresh(refreshToken);
			const currentUser = useAuthStore.getState().user;

			if (currentUser) {
				setAuth(currentUser, response.access_token, refreshToken);
			}
			return true;
		} catch {
			// Refresh failed, log out user
			logout();
			return false;
		}
	}, [setAuth, logout]);

	/**
	 * Verify current token and user
	 */
	const verifyAuth = useCallback(async () => {
		const accessToken = getAccessToken();
		const refreshToken = getRefreshToken();

		if (!accessToken || !refreshToken) {
			return false;
		}

		try {
			// Verify token by fetching user profile
			const userData = await authApi.getMe(accessToken);
			setAuth(
				{
					id: userData.id,
					email: userData.email,
					name: userData.name,
					role: userData.role as User["role"],
					avatarUrl: userData.avatarUrl,
				},
				accessToken,
				refreshToken,
			);
			return true;
		} catch {
			// Token might be expired, try to refresh
			return refreshAccessToken();
		}
	}, [setAuth, refreshAccessToken]);

	/**
	 * Initialize auth state on mount
	 */
	useEffect(() => {
		const initAuth = async () => {
			// Initialize store from localStorage
			initialize();

			const accessToken = getAccessToken();
			if (accessToken) {
				// Verify the stored token is still valid
				await verifyAuth();
			}

			setIsInitialized(true);
		};

		initAuth();
	}, [initialize, verifyAuth]);

	/**
	 * Set up automatic token refresh
	 */
	useEffect(() => {
		if (!isAuthenticated) return;

		const intervalId = setInterval(() => {
			refreshAccessToken();
		}, TOKEN_REFRESH_INTERVAL);

		return () => clearInterval(intervalId);
	}, [isAuthenticated, refreshAccessToken]);

	/**
	 * Listen for storage events (for multi-tab sync)
	 */
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "access_token" || e.key === "user") {
				initialize();
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [initialize]);

	return (
		<AuthContext.Provider value={{ isInitialized, user, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthProvider;
