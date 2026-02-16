"use client";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import SettingsIcon from "@mui/icons-material/Settings";
import {
	Avatar,
	Box,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

interface UserLayoutProps {
	children: ReactNode;
}

const translations = {
	en: {
		profile: "Profile",
		notifications: "Notifications",
		playlists: "Playlists",
		watchlist: "Watchlist",
		history: "Watch History",
		tickets: "Support Tickets",
		settings: "Settings",
		subscription: "Subscription",
		payment: "Payment",
		logout: "Logout",
		myAccount: "My Account",
	},
	fa: {
		profile: "پروفایل",
		notifications: "اعلان‌ها",
		playlists: "لیست‌های پخش",
		watchlist: "لیست تماشا",
		history: "تاریخچه تماشا",
		tickets: "تیکت‌های پشتیبانی",
		settings: "تنظیمات",
		subscription: "اشتراک",
		payment: "پرداخت",
		logout: "خروج",
		myAccount: "حساب کاربری",
	},
};

const menuItems = [
	{ key: "profile", path: "/user/profile", icon: PersonIcon },
	{ key: "notifications", path: "/user/notifications", icon: NotificationsIcon },
	{ key: "playlists", path: "/user/playlists", icon: PlaylistPlayIcon },
	{ key: "watchlist", path: "/user/watchlist", icon: BookmarkIcon },
	{ key: "history", path: "/user/history", icon: HistoryIcon },
	{ key: "tickets", path: "/user/tickets", icon: ConfirmationNumberIcon },
	{ key: "settings", path: "/user/settings", icon: SettingsIcon },
	{ key: "subscription", path: "/user/subscription", icon: CardMembershipIcon },
	{ key: "payment", path: "/user/payment", icon: PaymentIcon },
];

export const UserLayout = ({ children }: UserLayoutProps) => {
	const { language } = useLanguage();
	const isRTL = language === "fa";
	const t = translations[language] || translations.en;
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);
	const { user, logout, isLoading } = useAuth();

	const handleLogout = async () => {
		await logout();
	};

	const sidebarContent = (
		<Box
			sx={{
				width: 280,
				height: "100%",
				background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
				backdropFilter: `blur(${glassBlur.medium})`,
				borderRight: isRTL ? "none" : `1px solid ${glassColors.glass.border}`,
				borderLeft: isRTL ? `1px solid ${glassColors.glass.border}` : "none",
				p: 3,
			}}
		>
			{/* User Info */}
			<Box sx={{ textAlign: "center", mb: 4 }}>
				<Avatar
					src={user?.avatarUrl || undefined}
					sx={{
						width: 80,
						height: 80,
						mx: "auto",
						mb: 2,
						background: `linear-gradient(135deg, ${glassColors.persianGold}, #D97706)`,
						fontSize: "2rem",
						fontWeight: 700,
					}}
				>
					{user?.name?.charAt(0).toUpperCase() || "U"}
				</Avatar>
				<Typography
					variant="h6"
					sx={{ color: glassColors.text.primary, fontWeight: 600 }}
				>
					{user?.name || "User"}
				</Typography>
				<Typography
					sx={{ color: glassColors.text.tertiary, fontSize: "0.875rem" }}
				>
					{user?.email || ""}
				</Typography>
			</Box>

			{/* Navigation */}
			<List sx={{ p: 0 }}>
				{menuItems.map((item) => {
					const isActive = pathname === item.path;
					const Icon = item.icon;
					const label = t[item.key as keyof typeof t];

					return (
						<ListItem
							key={item.key}
							component={Link}
							href={item.path}
							onClick={() => setMobileOpen(false)}
							sx={{
								borderRadius: glassBorderRadius.lg,
								mb: 1,
								px: 2,
								py: 1.5,
								background: isActive
									? `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`
									: "transparent",
								border: isActive
									? `1px solid ${glassColors.persianGold}60`
									: "1px solid transparent",
								transition: glassAnimations.transition.spring,
								textDecoration: "none",
								"&:hover": {
									background: isActive
										? `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`
										: glassColors.glass.base,
									transform: "translateX(4px)",
								},
							}}
						>
							<ListItemIcon sx={{ minWidth: 40 }}>
								<Icon
									sx={{
										color: isActive
											? glassColors.persianGold
											: glassColors.text.secondary,
									}}
								/>
							</ListItemIcon>
							<ListItemText
								primary={label}
								sx={{
									"& .MuiListItemText-primary": {
										color: isActive
											? glassColors.persianGold
											: glassColors.text.primary,
										fontWeight: isActive ? 600 : 400,
									},
								}}
							/>
						</ListItem>
					);
				})}

				{/* Logout */}
				<ListItem
					component="button"
					onClick={handleLogout}
					disabled={isLoading}
					sx={{
						borderRadius: glassBorderRadius.lg,
						mt: 4,
						px: 2,
						py: 1.5,
						background: "transparent",
						border: `1px solid rgba(239, 68, 68, 0.3)`,
						transition: glassAnimations.transition.spring,
						width: "100%",
						cursor: "pointer",
						"&:hover": {
							background: "rgba(239, 68, 68, 0.1)",
							transform: "translateX(4px)",
						},
						"&:disabled": {
							opacity: 0.5,
							cursor: "not-allowed",
						},
					}}
				>
					<ListItemIcon sx={{ minWidth: 40 }}>
						<LogoutIcon sx={{ color: "#EF4444" }} />
					</ListItemIcon>
					<ListItemText
						primary={isLoading ? "..." : t.logout}
						sx={{
							"& .MuiListItemText-primary": {
								color: "#EF4444",
							},
						}}
					/>
				</ListItem>
			</List>
		</Box>
	);

	return (
		<ProtectedRoute>
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					direction: isRTL ? "rtl" : "ltr",
				}}
			>
			{/* Mobile Menu Button */}
			<IconButton
				onClick={() => setMobileOpen(true)}
				sx={{
					display: { xs: "flex", md: "none" },
					position: "fixed",
					top: 80,
					[isRTL ? "right" : "left"]: 16,
					zIndex: 1000,
					background: glassColors.glass.strong,
					backdropFilter: `blur(${glassBlur.medium})`,
					border: `1px solid ${glassColors.glass.border}`,
					color: glassColors.text.primary,
					"&:hover": {
						background: glassColors.glass.mid,
					},
				}}
			>
				<MenuIcon />
			</IconButton>

			{/* Desktop Sidebar */}
			<Box
				sx={{
					display: { xs: "none", md: "block" },
					width: 280,
					flexShrink: 0,
				}}
			>
				{sidebarContent}
			</Box>

			{/* Mobile Drawer */}
			<Drawer
				anchor={isRTL ? "right" : "left"}
				open={mobileOpen}
				onClose={() => setMobileOpen(false)}
				sx={{
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": {
						background: "transparent",
						boxShadow: "none",
					},
				}}
			>
				<IconButton
					onClick={() => setMobileOpen(false)}
					sx={{
						position: "absolute",
						top: 16,
						[isRTL ? "left" : "right"]: 16,
						zIndex: 10,
						color: glassColors.text.primary,
					}}
				>
					<CloseIcon />
				</IconButton>
				{sidebarContent}
			</Drawer>

			{/* Main Content */}
			<Box
				component="main"
				sx={{
					flex: 1,
					p: { xs: 2, md: 4 },
					pt: { xs: 10, md: 4 },
				}}
			>
				{children}
			</Box>
		</Box>
		</ProtectedRoute>
	);
};

export default UserLayout;
