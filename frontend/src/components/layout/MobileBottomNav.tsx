"use client";

import {
	Category,
	Home,
	Person,
	Search as SearchIcon,
	Login,
} from "@mui/icons-material";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import { useLanguage } from "@/providers/language-provider";
import { useIsAuthenticated } from "@/store/auth";
import {
	glassColors,
	glassAnimations,
} from "@/theme/glass-design-system";

interface BottomNavItem {
	href: string;
	labelFa: string;
	labelEn: string;
	icon: React.ReactNode;
	/** Match these path prefixes for active state */
	matchPrefixes?: string[];
}

const navItems: BottomNavItem[] = [
	{
		href: routes.home,
		labelFa: "خانه",
		labelEn: "Home",
		icon: <Home />,
	},
	{
		href: routes.search,
		labelFa: "جستجو",
		labelEn: "Search",
		icon: <SearchIcon />,
		matchPrefixes: ["/search"],
	},
	{
		href: routes.genres,
		labelFa: "دسته‌بندی",
		labelEn: "Categories",
		icon: <Category />,
		matchPrefixes: ["/genres", "/category", "/movies", "/series"],
	},
];

export function MobileBottomNav() {
	const { language } = useLanguage();
	const pathname = usePathname();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const isAuthenticated = useIsAuthenticated();

	// Don't render on desktop or admin routes
	if (!isMobile || pathname?.startsWith("/admin")) {
		return null;
	}

	// Build final items — last item is profile/login depending on auth state
	const profileItem: BottomNavItem = isAuthenticated
		? {
				href: routes.user.profile,
				labelFa: "پروفایل",
				labelEn: "Profile",
				icon: <Person />,
				matchPrefixes: ["/user"],
			}
		: {
				href: routes.auth.login,
				labelFa: "ورود",
				labelEn: "Login",
				icon: <Login />,
			};

	const allItems = [...navItems, profileItem];

	const isActive = (item: BottomNavItem) => {
		if (item.href === "/" && pathname === "/") return true;
		if (item.href !== "/" && pathname === item.href) return true;
		if (item.matchPrefixes) {
			return item.matchPrefixes.some(
				(prefix) => pathname?.startsWith(prefix) && item.href !== "/",
			);
		}
		return false;
	};

	return (
		<Box
			component="nav"
			sx={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1300,
				display: "flex",
				alignItems: "stretch",
				height: 56,
				background: `linear-gradient(180deg, 
					${glassColors.glass.strong} 0%, 
					${glassColors.glass.mid} 100%)`,
				backdropFilter: "blur(24px) saturate(180%)",
				WebkitBackdropFilter: "blur(24px) saturate(180%)",
				borderTop: `1px solid ${glassColors.glass.border}`,
				boxShadow: `0 -4px 24px -2px rgba(0, 0, 0, 0.3),
					inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`,
				paddingBottom: "env(safe-area-inset-bottom, 0px)",
			}}
		>
			{allItems.map((item) => {
				const active = isActive(item);

				return (
					<Box
						key={item.href}
						component={Link}
						href={item.href}
						sx={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 0.25,
							textDecoration: "none",
							border: "none",
							background: "transparent",
							cursor: "pointer",
							position: "relative",
							transition: glassAnimations.transition.smooth,
							"&::before": active
								? {
										content: '""',
										position: "absolute",
										top: 0,
										left: "50%",
										transform: "translateX(-50%)",
										width: 24,
										height: 2,
										borderRadius: "0 0 4px 4px",
										background: glassColors.persianGold,
										boxShadow: `0 2px 8px ${glassColors.persianGold}60`,
									}
								: {},
							"& .nav-icon": {
								color: active
									? glassColors.persianGold
									: "rgba(255, 255, 255, 0.55)",
								fontSize: "1.5rem",
								transition: "all 0.3s ease",
								filter: active
									? `drop-shadow(0 0 6px ${glassColors.persianGold}40)`
									: "none",
							},
							"&:active": {
								transform: "scale(0.92)",
							},
						}}
					>
						<Box className="nav-icon" sx={{ display: "flex" }}>
							{item.icon}
						</Box>
						<Typography
							sx={{
								fontSize: "0.625rem",
								fontWeight: active ? 600 : 400,
								color: active
									? glassColors.persianGold
									: "rgba(255, 255, 255, 0.55)",
								lineHeight: 1.2,
								letterSpacing: "0.01em",
								fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
								transition: "color 0.3s ease",
							}}
						>
							{language === "fa" ? item.labelFa : item.labelEn}
						</Typography>
					</Box>
				);
			})}
		</Box>
	);
}
