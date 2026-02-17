"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/store/admin-auth";
import { AdminSidebar } from "./AdminSidebar";
import { useResponsive } from "@/hooks/useResponsive";
import { Menu as MenuIcon } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAdminAuth();
	const router = useRouter();
	const [mounted, setMounted] = useState(false);
	const { isMobileOrTablet } = useResponsive();
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (mounted && !isAuthenticated) {
			router.push("/admin/login");
		}
	}, [mounted, isAuthenticated, router]);

	// Close mobile drawer on route change (handled by child link clicks)
	// Close on breakpoint change from mobile→desktop
	useEffect(() => {
		if (!isMobileOrTablet) {
			setMobileOpen(false);
		}
	}, [isMobileOrTablet]);

	// During SSR and initial client render, show nothing to avoid hydration mismatch
	if (!mounted || !isAuthenticated) {
		return null;
	}

	return (
		<div className="flex h-screen bg-gray-50" dir="rtl">
			{/* Mobile/Tablet: hamburger trigger */}
			{isMobileOrTablet && (
				<button
					type="button"
					onClick={() => setMobileOpen(true)}
					className="fixed top-3 right-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md border border-gray-200 md:hidden"
					aria-label="Open menu"
				>
					<MenuIcon className="h-5 w-5 text-gray-700" />
				</button>
			)}

			{/* Sidebar: desktop = static, mobile/tablet = drawer overlay */}
			{isMobileOrTablet ? (
				<>
					{/* Backdrop */}
					{mobileOpen && (
						<div
							className="fixed inset-0 z-40 bg-black/40 transition-opacity"
							onClick={() => setMobileOpen(false)}
							onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
							aria-hidden="true"
						/>
					)}
					{/* Drawer */}
					<div
						className={`fixed top-0 right-0 z-50 h-full transform transition-transform duration-300 ease-in-out ${
							mobileOpen ? "translate-x-0" : "translate-x-full"
						}`}
					>
						<AdminSidebar onNavigate={() => setMobileOpen(false)} />
					</div>
				</>
			) : (
				<AdminSidebar />
			)}

			{/* Main content */}
			<main className="flex-1 overflow-y-auto">
				<div
					className={`mx-auto p-4 sm:p-6 ${isMobileOrTablet ? "pt-14" : ""}`}
					style={{ maxWidth: "1400px" }}
				>
					{children}
				</div>
			</main>
		</div>
	);
}
