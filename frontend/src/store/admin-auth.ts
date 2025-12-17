import { create } from "zustand";

interface AdminUser {
	id: string;
	email: string;
	name: string;
	role: string;
	avatarUrl?: string | null;
}

interface AdminAuthState {
	user: AdminUser | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	setAuth: (user: AdminUser, accessToken: string, refreshToken: string) => void;
	logout: () => void;
}

export const useAdminAuth = create<AdminAuthState>()((set) => ({
	user:
		typeof window !== "undefined"
			? JSON.parse(localStorage.getItem("admin_user") || "null")
			: null,
	accessToken:
		typeof window !== "undefined"
			? localStorage.getItem("admin_access_token")
			: null,
	refreshToken:
		typeof window !== "undefined"
			? localStorage.getItem("admin_refresh_token")
			: null,
	isAuthenticated:
		typeof window !== "undefined"
			? !!localStorage.getItem("admin_access_token")
			: false,
	setAuth: (user, accessToken, refreshToken) => {
		if (typeof window !== "undefined") {
			localStorage.setItem("admin_access_token", accessToken);
			localStorage.setItem("admin_refresh_token", refreshToken);
			localStorage.setItem("admin_user", JSON.stringify(user));
		}
		set({
			user,
			accessToken,
			refreshToken,
			isAuthenticated: true,
		});
	},
	logout: () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("admin_access_token");
			localStorage.removeItem("admin_refresh_token");
			localStorage.removeItem("admin_user");
		}
		set({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
		});
	},
}));
