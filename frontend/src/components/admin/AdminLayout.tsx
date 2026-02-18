"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/store/admin-auth";
import { AdminSidebar } from "./AdminSidebar";
import { useResponsive } from "@/hooks/useResponsive";
import { Menu as MenuIcon, X } from "lucide-react";

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
		<div className="flex h-screen" dir="rtl" style={{ background: "var(--admin-bg)" }}>
			{/* Mobile/Tablet: hamburger trigger */}
			{isMobileOrTablet && (
				<button
					type="button"
					onClick={() => setMobileOpen(true)}
					className="fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-lg border border-gray-100 md:hidden transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95"
					aria-label="Open menu"
				>
					<MenuIcon className="h-5 w-5 text-gray-700" />
				</button>
			)}

			{/* Sidebar: desktop = static, mobile/tablet = drawer overlay */}
			{isMobileOrTablet ? (
				<>
					{/* Backdrop with blur */}
					<div
						className={`fixed inset-0 z-40 transition-all duration-300 ${
							mobileOpen
								? "bg-black/50 backdrop-blur-sm opacity-100 pointer-events-auto"
								: "opacity-0 pointer-events-none"
						}`}
						onClick={() => setMobileOpen(false)}
						onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
						aria-hidden="true"
					/>
					{/* Drawer with smooth slide */}
					<div
						className={`fixed top-0 right-0 z-50 h-full transform transition-all duration-300 ease-out ${
							mobileOpen
								? "translate-x-0 shadow-2xl"
								: "translate-x-full"
						}`}
					>
						{/* Close button overlaid on drawer */}
						{mobileOpen && (
							<button
								type="button"
								onClick={() => setMobileOpen(false)}
								className="absolute top-4 left-4 z-50 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white hover:bg-white/25 transition-all duration-200"
								aria-label="Close menu"
							>
								<X className="h-4 w-4" />
							</button>
						)}
						<AdminSidebar onNavigate={() => setMobileOpen(false)} />
					</div>
				</>
			) : (
				<AdminSidebar />
			)}

			{/* Main content area */}
			<main className="flex-1 overflow-y-auto admin-scrollbar-light">
				<div
					className={`mx-auto p-5 sm:p-7 admin-fade-in ${isMobileOrTablet ? "pt-16" : ""}`}
					style={{ maxWidth: "1440px" }}
				>
					{children}
				</div>
			</main>
		</div>
	);
}
