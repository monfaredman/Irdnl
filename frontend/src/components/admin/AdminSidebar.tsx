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
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/store/admin-auth";
import { useTranslation } from "@/i18n";
import { useState } from "react";

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

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
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

	const renderMenuItem = (item: MenuItem, depth = 0, index = 0) => {
		const Icon = item.icon;
		const isExpanded = expandedItems.includes(item.labelKey);
		const hasChildren = item.children && item.children.length > 0;

		const isActive = item.href
			? pathname === item.href || pathname?.startsWith(item.href + "/")
			: hasChildren && item.children?.some((child) =>
					child.href && (pathname === child.href || pathname?.startsWith(child.href + "/"))
			  );

		if (hasChildren) {
			return (
				<div key={item.labelKey} className="admin-fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
					<button
						onClick={() => toggleExpand(item.labelKey)}
						className={cn(
							"group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
							depth > 0 && "pr-6",
							isActive
								? "bg-white/15 text-white shadow-sm"
								: "text-indigo-100 hover:bg-white/10 hover:text-white"
						)}
					>
						<div className={cn(
							"flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
							isActive
								? "bg-white/20 shadow-sm"
								: "bg-white/5 group-hover:bg-white/10"
						)}>
							<Icon className="h-4.5 w-4.5" />
						</div>
						<span className="flex-1 text-right">{t(item.labelKey)}</span>
						<ChevronDown className={cn(
							"h-4 w-4 transition-transform duration-200",
							!isExpanded && "-rotate-90"
						)} />
					</button>
					<div className={cn(
						"overflow-hidden transition-all duration-300 ease-in-out",
						isExpanded ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
					)}>
						<div className="mr-4 mt-1 space-y-0.5 border-r-2 border-indigo-400/30 pr-2">
							{item.children?.map((child, childIndex) => renderMenuItem(child, depth + 1, childIndex))}
						</div>
					</div>
				</div>
			);
		}

		return (
			<Link
				key={item.labelKey}
				href={item.href!}
				onClick={onNavigate}
				className={cn(
					"group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
					depth > 0 && "pr-5 text-[13px]",
					isActive
						? "bg-white/15 text-white shadow-sm"
						: "text-indigo-100/80 hover:bg-white/10 hover:text-white"
				)}
				style={{ animationDelay: `${index * 0.03}s` }}
			>
				{isActive && (
					<div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full shadow-sm" />
				)}
				<div className={cn(
					"flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
					depth > 0 && "h-7 w-7",
					isActive
						? "bg-white/20 shadow-sm"
						: "bg-transparent group-hover:bg-white/10"
				)}>
					<Icon className={cn("h-4.5 w-4.5", depth > 0 && "h-3.5 w-3.5")} />
				</div>
				{t(item.labelKey)}
			</Link>
		);
	};

	return (
		<div
			className="flex h-screen w-[272px] shrink-0 flex-col admin-scrollbar"
			style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)" }}
		>
			{/* Brand Header */}
			<div className="flex h-[72px] items-center gap-3 px-5 border-b border-white/10">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 shadow-inner">
					<Sparkles className="h-5 w-5 text-amber-300" />
				</div>
				<div>
					<h1 className="text-lg font-bold text-white tracking-tight">{t("admin.title")}</h1>
					<p className="text-[11px] text-indigo-200/70 font-medium">Management Panel</p>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 admin-scrollbar">
				{visibleMenuItems.map((item, index) => renderMenuItem(item, 0, index))}
			</nav>

			{/* User Profile & Logout */}
			<div className="border-t border-white/10 p-3">
				<Link
					href="/admin/profile"
					className="group mb-2 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200"
				>
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-400 to-purple-500 text-white text-sm font-bold shadow-md">
						{user?.name?.charAt(0).toUpperCase() || "A"}
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-white truncate">{user?.name}</p>
						<p className="text-[11px] text-indigo-200/60 truncate">{user?.email}</p>
					</div>
				</Link>
				<button
					onClick={logout}
					className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-indigo-200/70 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200"
				>
					<LogOut className="h-4.5 w-4.5" />
					{t("admin.menu.logout")}
				</button>
			</div>
		</div>
	);
}
