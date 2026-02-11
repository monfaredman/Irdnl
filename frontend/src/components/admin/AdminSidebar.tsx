"use client";

import {
	BarChart3,
	Bell,
	Film,
	FolderTree,
	Gift,
	Image,
	LayoutDashboard,
	LogOut,
	MapPin,
	Tags,
	Users,
	Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/store/admin-auth";
import { useTranslation } from "@/i18n";

const menuItems = [
	{ href: "/admin/dashboard", labelKey: "admin.menu.dashboard", icon: LayoutDashboard },
	{ href: "/admin/content", labelKey: "admin.menu.content", icon: Film },
	{ href: "/admin/categories", labelKey: "admin.menu.categories", icon: FolderTree },
	{ href: "/admin/genres", labelKey: "admin.menu.genres", icon: Tags },
	{ href: "/admin/sliders", labelKey: "admin.menu.sliders", icon: Image },
	{ href: "/admin/offers", labelKey: "admin.menu.offers", icon: Gift },
	{ href: "/admin/pins", labelKey: "admin.menu.pins", icon: MapPin },
	{ href: "/admin/users", labelKey: "admin.menu.users", icon: Users },
	{ href: "/admin/videos", labelKey: "admin.menu.videos", icon: Video },
	{ href: "/admin/notifications", labelKey: "admin.menu.notifications", icon: Bell },
	{ href: "/admin/finance", labelKey: "admin.menu.finance", icon: BarChart3 },
];

export function AdminSidebar() {
	const pathname = usePathname();
	const { logout, user } = useAdminAuth();
	const { t } = useTranslation();

	return (
		<div className="flex h-screen w-64 flex-col border-l border-gray-200 bg-white">
			<div className="flex h-16 items-center border-b border-gray-200 px-6">
				<h1 className="text-xl font-bold text-gray-900">{t("admin.title")}</h1>
			</div>
			<nav className="flex-1 space-y-1 px-3 py-4">
				{menuItems.map((item) => {
					const Icon = item.icon;
					const isActive =
						pathname === item.href || pathname?.startsWith(item.href + "/");
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-blue-50 text-blue-700"
									: "text-gray-700 hover:bg-gray-100",
							)}
						>
							<Icon className="h-5 w-5" />
							{t(item.labelKey)}
						</Link>
					);
				})}
			</nav>
			<div className="border-t border-gray-200 p-4">
				<div className="mb-2 flex items-center gap-3 px-3 py-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
						{user?.name?.charAt(0).toUpperCase() || "A"}
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium text-gray-900">{user?.name}</p>
						<p className="text-xs text-gray-500">{user?.email}</p>
					</div>
				</div>
				<button
					onClick={logout}
					className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
				>
					<LogOut className="h-5 w-5" />
					{t("admin.menu.logout")}
				</button>
			</div>
		</div>
	);
}
