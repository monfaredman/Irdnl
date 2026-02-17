"use client";

import {
	BarChart3,
	Bell,
	Film,
	FolderTree,
	Gift,
	LayoutDashboard,
	Library,
	ListMusic,
	LogOut,
	MapPin,
	Tags,
	Video,
	Globe,
	Database,
	ChevronDown,
	ChevronRight,
	Upload,
	MessageSquare,
	BookOpen,
	SlidersHorizontal,
	UserCog,
	Ticket,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/store/admin-auth";
import { useTranslation } from "@/i18n";
import { useState } from "react";
import { Slider, SliderMark, SliderRail } from "@mui/material";
import { Preview } from "@mui/icons-material";

interface MenuItem {
	href?: string;
	labelKey: string;
	icon: any;
	children?: MenuItem[];
	/** Roles that can see this menu item. If omitted, all roles can see it. */
	roles?: string[];
}

const menuItems: MenuItem[] = [
	{ href: "/admin/dashboard", labelKey: "admin.menu.dashboard", icon: LayoutDashboard },
	{
		labelKey: "admin.menu.content",
		icon: Film,
		roles: ["admin", "content_manager", "viewer"],
		children: [
			{ href: "/admin/content", labelKey: "admin.menu.contentUpload", icon: Upload },
			{ href: "/admin/categories", labelKey: "admin.menu.categories", icon: FolderTree },
			{ href: "/admin/collections", labelKey: "admin.menu.collections", icon: Library },
			{ href: "/admin/sliders", labelKey: "admin.menu.sliders", icon: SlidersHorizontal },
			{ href: "/admin/genres", labelKey: "admin.menu.genres", icon: Tags },
			{ href: "/admin/offers", labelKey: "admin.menu.offers", icon: Gift },
			{ href: "/admin/pins", labelKey: "admin.menu.pins", icon: MapPin },
			{ href: "/admin/videos", labelKey: "admin.menu.videos", icon: Video },
		],
	},
	{ href: "/admin/users", labelKey: "admin.menu.users", icon: LayoutDashboard, roles: ["admin"] },
	{ href: "/admin/finance", labelKey: "admin.menu.finance", icon: BarChart3, roles: ["admin", "finance"] },
	{ href: "/admin/notifications", labelKey: "admin.menu.notifications", icon: Bell, roles: ["admin", "content_manager", "viewer"] },
	{ href: "/admin/comments", labelKey: "admin.comments.title", icon: MessageSquare, roles: ["admin", "content_manager", "viewer"] },
	{ href: "/admin/tickets", labelKey: "admin.menu.tickets", icon: Ticket, roles: ["admin", "content_manager", "viewer"] },
	{ href: "/admin/blog", labelKey: "admin.blog.title", icon: BookOpen, roles: ["admin", "content_manager", "viewer"] },
	{ href: "/admin/playlists", labelKey: "admin.menu.playlists", icon: ListMusic, roles: ["admin", "content_manager", "viewer"] },
	{ href: "/admin/upera", labelKey: "admin.menu.upera", icon: Globe, roles: ["admin", "content_manager", "viewer"] },
	{ href: "/admin/tmdb", labelKey: "admin.menu.tmdb", icon: Database, roles: ["admin", "content_manager", "viewer"] },
	// { href: "/admin/profile", labelKey: "admin.profile.title", icon: UserCog },
];

/** Filter menu items based on user role */
function filterMenuByRole(items: MenuItem[], role: string | undefined): MenuItem[] {
	if (!role) return [];
	return items
		.filter((item) => !item.roles || item.roles.includes(role))
		.map((item) => {
			if (item.children) {
				return {
					...item,
					children: item.children.filter(
						(child) => !child.roles || child.roles.includes(role)
					),
				};
			}
			return item;
		})
		.filter((item) => !item.children || item.children.length > 0);
}

export function AdminSidebar() {
	const pathname = usePathname();
	const { logout, user } = useAdminAuth();
	const { t } = useTranslation();
	const [expandedItems, setExpandedItems] = useState<string[]>(["admin.menu.content"]);

	const visibleMenuItems = filterMenuByRole(menuItems, user?.role);

	const toggleExpand = (labelKey: string) => {
		setExpandedItems((prev) =>
			prev.includes(labelKey)
				? prev.filter((key) => key !== labelKey)
				: [...prev, labelKey]
		);
	};

	const renderMenuItem = (item: MenuItem, depth = 0) => {
		const Icon = item.icon;
		const isExpanded = expandedItems.includes(item.labelKey);
		const hasChildren = item.children && item.children.length > 0;

		// Check if this item or any of its children is active
		const isActive = item.href
			? pathname === item.href || pathname?.startsWith(item.href + "/")
			: hasChildren && item.children?.some((child) => 
					child.href && (pathname === child.href || pathname?.startsWith(child.href + "/"))
			  );

		if (hasChildren) {
			return (
				<div key={item.labelKey}>
					<button
						onClick={() => toggleExpand(item.labelKey)}
						className={cn(
							"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
							depth > 0 && "pr-6",
							isActive
								? "bg-blue-50 text-blue-700"
								: "text-gray-700 hover:bg-gray-100"
						)}
					>
						<Icon className="h-5 w-5" />
						<span className="flex-1 text-right">{t(item.labelKey)}</span>
						{isExpanded ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</button>
					{isExpanded && (
						<div className="mr-2 space-y-1 border-r-2 border-gray-200 pr-2">
							{item.children?.map((child) => renderMenuItem(child, depth + 1))}
						</div>
					)}
				</div>
			);
		}

		return (
			<Link
				key={item.labelKey}
				href={item.href!}
				className={cn(
					"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
					depth > 0 && "pr-6 text-xs",
					isActive
						? "bg-blue-50 text-blue-700"
						: "text-gray-700 hover:bg-gray-100"
				)}
			>
				<Icon className={cn("h-5 w-5", depth > 0 && "h-4 w-4")} />
				{t(item.labelKey)}
			</Link>
		);
	};

	return (
		<div className="flex h-screen w-64 flex-col border-l border-gray-200 bg-white">
			<div className="flex h-16 items-center border-b border-gray-200 px-6">
				<h1 className="text-xl font-bold text-gray-900">{t("admin.title")}</h1>
			</div>
			<nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
				{visibleMenuItems.map((item) => renderMenuItem(item))}
			</nav>
			<div className="border-t border-gray-200 p-4">
				<Link
					href="/admin/profile"
					className="mb-2 flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
						{user?.name?.charAt(0).toUpperCase() || "A"}
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium text-gray-900">{user?.name}</p>
						<p className="text-xs text-gray-500">{user?.email}</p>
					</div>
				</Link>
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
