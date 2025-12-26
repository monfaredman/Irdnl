/**
 * Authentication Types
 *
 * Type definitions for authentication-related data structures
 */

// User roles matching backend
export enum UserRole {
	VIEWER = "viewer",
	MODERATOR = "moderator",
	ADMIN = "admin",
}

// User information returned from auth endpoints
export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	avatarUrl?: string | null;
}

// Login request payload
export interface LoginRequest {
	email: string;
	password: string;
}

// Register request payload
export interface RegisterRequest {
	email: string;
	password: string;
	name: string;
}

// Auth response from login/register
export interface AuthResponse {
	access_token: string;
	refresh_token: string;
	user: User;
}

// Register response (just returns basic info)
export interface RegisterResponse {
	id: string;
	email: string;
}

// Refresh token response
export interface RefreshResponse {
	access_token: string;
}

// Logout response
export interface LogoutResponse {
	message: string;
}

// Password reset response
export interface PasswordResetResponse {
	message: string;
}

// Auth error response
export interface AuthError {
	message: string;
	statusCode?: number;
	error?: string;
}

// Auth state for store
export interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

// Auth actions for store
export interface AuthActions {
	setAuth: (user: User, accessToken: string, refreshToken: string) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	clearError: () => void;
	logout: () => void;
	initialize: () => void;
}

// Combined auth store type
export type AuthStore = AuthState & AuthActions;
