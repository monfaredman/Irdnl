"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminAuth } from "@/store/admin-auth";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAdminAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/admin/login");
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="flex h-screen bg-gray-50">
			<AdminSidebar />
			<main className="flex-1 overflow-y-auto">
				<div className="container mx-auto p-6">{children}</div>
			</main>
		</div>
	);
}
