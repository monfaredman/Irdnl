"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/store/admin-auth";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAdminAuth();
	const router = useRouter();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (mounted && !isAuthenticated) {
			router.push("/admin/login");
		}
	}, [mounted, isAuthenticated, router]);

	// During SSR and initial client render, show nothing to avoid hydration mismatch
	if (!mounted || !isAuthenticated) {
		return null;
	}

	return (
		<div className="flex h-screen bg-gray-50" dir="rtl">
			<AdminSidebar />
			<main className="flex-1 overflow-y-auto">
				<div className="container mx-auto p-6">{children}</div>
			</main>
		</div>
	);
}
