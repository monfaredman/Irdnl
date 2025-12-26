/**
 * Protected Route Component
 *
 * HOC and component for protecting routes that require authentication
 */

"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { useAuthStore } from "@/store/auth";
import { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
	children: ReactNode;
	/** Redirect path when not authenticated */
	redirectTo?: string;
	/** Minimum role required (optional) */
	requiredRole?: UserRole;
	/** Show loading state while checking auth */
	loadingComponent?: ReactNode;
}

/**
 * Default loading component
 */
const DefaultLoading = () => (
	<div className="flex min-h-screen items-center justify-center bg-black">
		<div className="flex flex-col items-center gap-4">
			<div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
			<p className="text-sm text-white/60">Loading...</p>
		</div>
	</div>
);

/**
 * Check if user has required role
 */
function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
	const roleHierarchy: Record<UserRole, number> = {
		[UserRole.VIEWER]: 1,
		[UserRole.MODERATOR]: 2,
		[UserRole.ADMIN]: 3,
	};

	return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Protected Route Component
 *
 * Wraps content that requires authentication
 */
export function ProtectedRoute({
	children,
	redirectTo = "/auth/login",
	requiredRole,
	loadingComponent,
}: ProtectedRouteProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { isInitialized, isAuthenticated, user } = useAuthContext();

	useEffect(() => {
		if (!isInitialized) return;

		if (!isAuthenticated) {
			// Store the intended destination for redirect after login
			const returnUrl = encodeURIComponent(pathname);
			router.push(`${redirectTo}?returnUrl=${returnUrl}`);
			return;
		}

		// Check role if required
		if (requiredRole && user) {
			if (!hasRequiredRole(user.role, requiredRole)) {
				// User doesn't have required role, redirect to home or unauthorized page
				router.push("/");
			}
		}
	}, [isInitialized, isAuthenticated, user, requiredRole, router, pathname, redirectTo]);

	// Show loading while checking auth
	if (!isInitialized) {
		return loadingComponent ?? <DefaultLoading />;
	}

	// Not authenticated
	if (!isAuthenticated) {
		return loadingComponent ?? <DefaultLoading />;
	}

	// Check role
	if (requiredRole && user && !hasRequiredRole(user.role, requiredRole)) {
		return loadingComponent ?? <DefaultLoading />;
	}

	return <>{children}</>;
}

/**
 * Hook for checking if current user is authenticated
 * Can be used in components to conditionally render content
 */
export function useRequireAuth(redirectTo = "/auth/login") {
	const router = useRouter();
	const pathname = usePathname();
	const { isInitialized, isAuthenticated } = useAuthContext();

	useEffect(() => {
		if (isInitialized && !isAuthenticated) {
			const returnUrl = encodeURIComponent(pathname);
			router.push(`${redirectTo}?returnUrl=${returnUrl}`);
		}
	}, [isInitialized, isAuthenticated, router, pathname, redirectTo]);

	return { isAuthenticated, isLoading: !isInitialized };
}

/**
 * Hook for checking if user has specific role
 */
export function useRequireRole(requiredRole: UserRole, redirectTo = "/") {
	const router = useRouter();
	const { isInitialized, isAuthenticated, user } = useAuthContext();

	useEffect(() => {
		if (!isInitialized) return;

		if (!isAuthenticated) {
			router.push("/auth/login");
			return;
		}

		if (user && !hasRequiredRole(user.role, requiredRole)) {
			router.push(redirectTo);
		}
	}, [isInitialized, isAuthenticated, user, requiredRole, router, redirectTo]);

	const hasRole = user ? hasRequiredRole(user.role, requiredRole) : false;

	return { hasRole, isLoading: !isInitialized };
}

/**
 * Higher-Order Component for protecting pages
 */
export function withAuth<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	options?: {
		redirectTo?: string;
		requiredRole?: UserRole;
	},
) {
	const displayName =
		WrappedComponent.displayName || WrappedComponent.name || "Component";

	const WithAuthComponent = (props: P) => {
		return (
			<ProtectedRoute
				redirectTo={options?.redirectTo}
				requiredRole={options?.requiredRole}
			>
				<WrappedComponent {...props} />
			</ProtectedRoute>
		);
	};

	WithAuthComponent.displayName = `withAuth(${displayName})`;

	return WithAuthComponent;
}

export default ProtectedRoute;
