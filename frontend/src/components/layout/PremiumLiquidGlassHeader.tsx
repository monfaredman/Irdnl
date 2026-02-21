"use client";

import {
	AccountCircle,
	Category,
	Close as CloseIcon,
	KeyboardArrowDown,
	Login,
	Logout,
	Menu as MenuIcon,
	Movie,
	Person,
	Search as SearchIcon,
	Settings,
	Tv,
} from "@mui/icons-material";
import {
	AppBar,
	Avatar,
	Box,
	CircularProgress,
	Container,
	Drawer,
	IconButton,
	InputBase,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Menu,
	MenuItem,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthModals } from "@/components/modals/AuthModals";
import { routes } from "@/lib/routes";
import { useLanguage } from "@/providers/language-provider";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import {
	categoriesApi as publicCategoriesApi,
	type Category as PublicCategory,
	type MenuCategory,
} from "@/lib/api/public";
import { useIsAuthenticated, useAuthStore } from "@/store/auth";
import SearchAutocomplete from "@/components/search/SearchAutocomplete";

type UserMenuAction =
	| { type: "navigate"; href: string }
	| { type: "open-auth"; mode?: "login" | "register" }
	| { type: "logout" };

interface NavItem {
	label: string;
	labelFa: string;
	href: string;
	icon?: React.ReactNode;
	submenu?: SubMenuItem[];
	isActive?: boolean;
}

interface SubMenuItem {
	label: string;
	labelFa: string;
	href: string;
}

// Menu structure configuration - defines order and which items have submenus
// Only static items that don't come from the admin categories panel
const STATIC_MENU_ITEMS: Array<{
	slug: string;
	icon: React.ReactNode;
	labelEn: string;
	labelFa: string;
	href: string;
}> = [
		// { slug: "top-250", icon: <Movie />, labelEn: "Top 250", labelFa: "250 فیلم برتر IMDb", href: "/top-250" },
		// { slug: "collections", icon: <Category />, labelEn: "Collections", labelFa: "کالکشن", href: "/collections" },
	];

/**
 * Determine icon for a category based on its contentType or slug.
 */
function getCategoryIcon(category: PublicCategory): React.ReactNode {
	if (category.contentType === "series") return <Tv />;
	if (category.contentType === "movie") return <Movie />;
	// Slug-based heuristics for mixed types
	if (category.slug.includes("series") || category.slug.includes("anime")) return <Tv />;
	return <Category />;
}

/**
 * Convert category to URL path.
 * Uses urlPath if available, falls back to slug-based mapping.
 * For parent categories: /movies/{urlPath}
 * For child categories: /movies/{parent.urlPath}/{child.urlPath}
 */
function categoryToPath(category: PublicCategory, parent?: PublicCategory): string {
	const contentType = category.contentType==='series'?'serie':category.contentType;
	const parentContentType = parent?.contentType;


	if (parent && parent.urlPath && category.urlPath) {
		if (parentContentType === "other" && ['animation', 'dubbed', 'anime', 'other', 'coming-soon', 'collections', 'top-250'].includes(category.urlPath)) return `/${category.urlPath}`;
		if (parentContentType === "other") return `/${parent.urlPath==='series'?'serie':parent.urlPath}/${category.urlPath==='series'?'serie':category.urlPath}`;
		return `/${contentType}/${parent.urlPath==='series'?'serie':parent.urlPath}/${category.urlPath==='series'?'serie':category.urlPath}`;
	}
	if (category.urlPath) {
		if (['animation', 'dubbed', 'anime', 'other'].includes(category.urlPath)) {
			return `/${category.urlPath || category.slug}`;
		}
		if (parentContentType === "other") return `/${category.urlPath}`;
		return `/${contentType}/${category.urlPath}`;
	}
	// Fallback for legacy slugs
	const slugMap: Record<string, string> = {
		"movies-foreign": "/movie/foreign",
		"movies-iranian": "/movie/iranian",
		"series-foreign": "/serie/foreign",
		"series-iranian": "/serie/iranian",
	};
	return slugMap[category.slug] || `/category/${category.slug}`;
}

export function PremiumLiquidGlassHeader() {
	const { language } = useLanguage();
	const pathname = usePathname();
	const router = useRouter();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [mounted, setMounted] = useState(false);

	// Dynamic navigation state
	const [navItems, setNavItems] = useState<NavItem[]>([]);
	const [navLoading, setNavLoading] = useState(true);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Fetch categories from backend and build menu based on parent-child structure
	useEffect(() => {
		const fetchNavigation = async () => {
			try {
				const categoriesResponse = await publicCategoriesApi.listMenu();
				const categories = categoriesResponse.data as MenuCategory[];

				// Build navigation items from parent-child category tree
				const dynamicNavItems: NavItem[] = [];

				const sortedCategories = [...categories]
					.filter((cat) => cat.isActive)
					.sort((a, b) => a.sortOrder - b.sortOrder);

				for (const category of sortedCategories) {
					const parentHref = categoryToPath(category);

					// Build submenu from child categories
					let submenu: SubMenuItem[] | undefined;
					if (category.children && category.children.length > 0) {
						submenu = category.children
							.filter((child) => child.isActive)
							.sort((a, b) => a.sortOrder - b.sortOrder)
							.map((child) => ({
								label: child.nameEn,
								labelFa: child.nameFa,
								href: categoryToPath(child, category),
							}));
					}

					dynamicNavItems.push({
						label: category.nameEn,
						labelFa: category.nameFa,
						href: parentHref,
						icon: getCategoryIcon(category),
						submenu,
						isActive: category.isActive,
					});
				}

				// Add static items at the end
				for (const staticItem of STATIC_MENU_ITEMS) {
					dynamicNavItems.push({
						label: staticItem.labelEn,
						labelFa: staticItem.labelFa,
						href: staticItem.href,
						icon: staticItem.icon,
						isActive: true,
					});
				}

				setNavItems(dynamicNavItems);
			} catch (error) {
				console.error("Failed to fetch navigation data:", error);
				// Fallback to minimal navigation if API fails
				setNavItems([
					{
						label: "Home",
						labelFa: "خانه",
						href: "/",
						icon: <Movie />,
						isActive: true,
					},
				]);
			} finally {
				setNavLoading(false);
			}
		};

		fetchNavigation();
	}, []);

	// State management
	const [scrolled, setScrolled] = useState(false);
	const [searchExpanded, setSearchExpanded] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [submenuAnchor, setSubmenuAnchor] = useState<{
		[key: string]: HTMLElement | null;
	}>({});
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
		"login",
	);
	const [userMenuBusy, setUserMenuBusy] = useState(false);
	const [userMenuError, setUserMenuError] = useState<string | null>(null);

	// Reactively track auth state from Zustand store
	const isAuthenticated = useIsAuthenticated();
	const storeLogout = useAuthStore((s) => s.logout);

	// Scroll detection for glass effect
	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 20;
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled);
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [scrolled]);

	// Handlers
	const handleSearchToggle = () => {
		setSearchExpanded(!searchExpanded);
	};

	const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleUserMenuClose = () => {
		setAnchorEl(null);
		setUserMenuError(null);
	};

	const handleUserMenuAction = async (action: UserMenuAction) => {
		setUserMenuError(null);
		setUserMenuBusy(true);
		try {
			if (action.type === "navigate") {
				handleUserMenuClose();
				router.push(action.href);
				return;
			}
			if (action.type === "open-auth") {
				handleUserMenuClose();
				setAuthModalMode(action.mode ?? "login");
				setAuthModalOpen(true);
				return;
			}
			if (action.type === "logout") {
				storeLogout();
				handleUserMenuClose();
				router.refresh();
				router.push(routes.home);
				return;
			}
		} catch (e) {
			setUserMenuError(
				language === "fa" ? "خطا در انجام عملیات" : "Something went wrong",
			);
		} finally {
			setUserMenuBusy(false);
		}
	};

	const handleMobileToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleSubmenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		itemHref: string,
	) => {
		setSubmenuAnchor({ ...submenuAnchor, [itemHref]: event.currentTarget });
	};

	const handleSubmenuClose = (itemHref: string) => {
		setSubmenuAnchor({ ...submenuAnchor, [itemHref]: null });
	};

	// Glass styles
	const glassBaseStyle = {
		background: scrolled
			? `linear-gradient(180deg, 
          ${glassColors.glass.mid} 0%, 
          ${glassColors.glass.base} 100%)`
			: `linear-gradient(180deg, 
          ${glassColors.glass.mid} 0%, 
          ${glassColors.glass.base} 100%)`,
		backdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
		WebkitBackdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
		borderBottom: "none",
		boxShadow: scrolled
			? `inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
         0 4px 24px -2px rgba(0, 0, 0, 0.2)`
			: "none",
		transition: glassAnimations.transition.spring,
		// Blur extension below header when at top
		"&::after": {
			content: '""',
			position: "absolute",
			left: 0,
			right: 0,
			top: "100%",
			height: scrolled ? 0 : "20px",
			backdropFilter: scrolled ? "none" : `blur(6px)`,
			WebkitBackdropFilter: scrolled ? "none" : `blur(6px)`,
			background: scrolled
				? "transparent"
				: `linear-gradient(to bottom, ${glassColors.glass.base}, transparent)`,
			maskImage: scrolled
				? "none"
				: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
			WebkitMaskImage: scrolled
				? "none"
				: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
			pointerEvents: "none",
			transition: "height 0.3s ease, opacity 0.3s ease",
			opacity: scrolled ? 0 : 1,
		},
	};

	const pillButtonStyle = (isActive: boolean) => ({
		px: 3,
		py: 1,
		borderRadius: glassBorderRadius.pill,
		position: "relative",
		overflow: "hidden",
		color: isActive ? glassColors.persianGold : glassColors.text.primary,
		fontSize: "0.875rem",
		fontWeight: 500,
		textTransform: "none" as const,
		background: isActive
			? `linear-gradient(135deg, ${glassColors.persianGold}20, ${glassColors.persianGold}10)`
			: "transparent",
		border: isActive
			? `1px solid ${glassColors.persianGold}40`
			: "1px solid transparent",
		transition: glassAnimations.transition.smooth,
		"&::before": {
			content: '""',
			position: "absolute",
			top: 0,
			left: "-100%",
			width: "100%",
			height: "100%",
			background: `linear-gradient(90deg, 
        transparent, 
        ${glassColors.glass.strong}, 
        transparent)`,
			transition: glassAnimations.transition.smooth,
		},
		"&:hover": {
			background: `linear-gradient(135deg, 
        ${glassColors.glass.strong}, 
        ${glassColors.glass.mid})`,
			border: `1px solid ${glassColors.glass.border}`,
			transform: "translateY(5px)",
			boxShadow: `0 8px 16px -4px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
			"&::before": {
				left: "100%",
			},
		},
		"&:active": {
			transform: "translateY(0px)",
		},
	});

	const avatarStyle = {
		width: 40,
		height: 40,
		border: `2px solid ${glassColors.glass.border}`,
		boxShadow: `0 4px 16px -2px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
		cursor: "pointer",
		transition: glassAnimations.transition.smooth,
		"&:hover": {
			transform: "scale(1.1)",
			border: `2px solid ${glassColors.persianGold}`,
			boxShadow: `0 8px 24px -4px ${glassColors.gold.glow},
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.3)`,
		},
	};

	const menuStyle = {
		"& .MuiPaper-root": {
			mt: 1,
			borderRadius: glassBorderRadius.lg,
			background: `linear-gradient(180deg, 
        ${glassColors.deepMidnight}F1, 
        ${glassColors.deepMidnight}E1)`,
			backdropFilter: `blur(${glassBlur.strong}px) saturate(180%)`,
			WebkitBackdropFilter: `blur(${glassBlur.strong}px) saturate(180%)`,
			border: `1px solid ${glassColors.glass.border}`,
			boxShadow: `0 16px 48px -8px rgba(0, 0, 0, 0.6),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`,
			"& .MuiMenuItem-root": {
				color: glassColors.text.secondary,
				borderRadius: glassBorderRadius.sm,
				mx: 1,
				my: 0.5,
				transition: glassAnimations.transition.springFast,
				"&:hover": {
					background: glassColors.deepMidnight,
					color: glassColors.persianGold,
				},
			},
		},
	};

	const drawerStyle = {
		"& .MuiDrawer-paper": {
			width: 280,
			background: `linear-gradient(180deg, 
        ${glassColors.deepMidnight}F2, 
        ${glassColors.deepMidnight}E6)`,
			backdropFilter: `blur(${glassBlur.strong}px) saturate(180%)`,
			WebkitBackdropFilter: `blur(${glassBlur.strong}px) saturate(180%)`,
			borderRight: `1px solid ${glassColors.glass.border}`,
			boxShadow: `4px 0 32px -4px rgba(0, 0, 0, 0.5),
                  inset -1px 0 0 0 rgba(255, 255, 255, 0.05)`,
		},
	};

	return (
		<>
			<AppBar
				position="fixed"
				elevation={0}
				sx={{
					...glassBaseStyle,
					zIndex: theme.zIndex.modal + 1,
				}}
			>
				<Container maxWidth="xl">
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							minHeight: 48,
							gap: 2,
						}}
					>
						{/* Logo - Minimal Glass Monogram */}
						<Link href="/" style={{ textDecoration: "none" }}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									cursor: "pointer",
									transition: glassAnimations.transition.smooth,
									"&:hover": {
										transform: "translateY(-2px)",
									},
								}}
							>
								<Box
									sx={{
										width: 40,
										height: 40,
										borderRadius: glassBorderRadius.md,
										background: `linear-gradient(135deg, 
                    ${glassColors.persianGold}40, 
                    ${glassColors.persianGold}20)`,
										backdropFilter: `blur(${glassBlur.light}px)`,
										border: `1px solid ${glassColors.persianGold}60`,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontWeight: 700,
										fontSize: "1.25rem",
										color: glassColors.persianGold,
										boxShadow: `0 4px 16px -2px ${glassColors.gold.glow},
                              inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
									}}
								>
									Ir
								</Box>
								<Box
									sx={{
										display: { xs: "none", sm: "block" },
										fontSize: "1.25rem",
										fontWeight: 700,
										color: "#FFFFFF",
										letterSpacing: "-0.02em",
									}}
								>
									irdnl
								</Box>
							</Box>
						</Link>

						{/* Desktop Navigation - Glass Pills */}
						{mounted && !isMobile && (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									flex: 1,
									justifyContent: "center",
								}}
							>
								{navItems.slice(0, 7).map((item, idx) => {
									const isActive = pathname === item.href;
									const label = language === "fa" ? item.labelFa : item.label;

									return (
										<Box
											key={`nav-${idx}-${item.label}`}
											sx={{ position: "relative" }}
											onMouseLeave={() =>
												item.submenu && handleSubmenuClose(item.href)
											}
										>
											<Link
												href={item.href}
												style={{ textDecoration: "none" }}
												onMouseEnter={(e) =>
													item.submenu && handleSubmenuOpen(e, item.href)
												}

											>
												<Box
													component="button"
													sx={{
														...pillButtonStyle(isActive),
														display: "flex",
														alignItems: "center",
														gap: 0.5,
													}}
												>
													{label}
													{item.submenu && (
														<KeyboardArrowDown
															sx={{
																fontSize: "1rem",
																transition: glassAnimations.transition.smooth,
																transform: submenuAnchor[item.href]
																	? "rotate(180deg)"
																	: "rotate(0deg)",
															}}
														/>
													)}
												</Box>
											</Link>
											{/* Submenu */}
											{item.submenu && (
												<Menu
													anchorEl={submenuAnchor[item.href]}
													open={Boolean(submenuAnchor[item.href])}
													onClose={() => handleSubmenuClose(item.href)}
													disableScrollLock
													MenuListProps={{
														onMouseLeave: () => handleSubmenuClose(item.href),
													}}
													sx={{ ...menuStyle, zIndex: '1300' }}
													transformOrigin={{
														horizontal: "center",
														vertical: "top",
													}}
													anchorOrigin={{
														horizontal: "center",
														vertical: "bottom",
													}}
												>
													{item.submenu.map((subItem, subIdx) => (
														<MenuItem
															key={`sub-${subIdx}-${subItem.label}`}
															onClick={() => handleSubmenuClose(item.href)}
															component={Link}
															href={subItem.href}
														>
															{language === "fa"
																? subItem.labelFa
																: subItem.label}
														</MenuItem>
													))}
												</Menu>
											)}
										</Box>
									);
								})}
							</Box>
						)}

						{/* Right Section - Search & User */}
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							{/* Glass Search with Autocomplete */}
							<SearchAutocomplete
								language={language}
								isExpanded={searchExpanded}
								onExpandToggle={handleSearchToggle}
								onClose={() => setSearchExpanded(false)}
							/>

							{/* User Avatar - Desktop Only */}
							{mounted && !isMobile && (
								<Avatar
									sx={avatarStyle}
									onClick={handleUserMenuOpen}
									alt="User"
									aria-label={language === "fa" ? "منوی کاربر" : "User menu"}
									aria-controls={anchorEl ? "user-menu" : undefined}
									aria-haspopup="menu"
									aria-expanded={anchorEl ? "true" : undefined}
								>
									<AccountCircle />
								</Avatar>
							)}

							{/* Mobile Hamburger */}
							{mounted && isMobile && (
								<IconButton
									onClick={handleMobileToggle}
									sx={{
										color: "#FFFFFF",
										transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
										"&:hover": {
											transform: "rotate(90deg)",
										},
									}}
								>
									<MenuIcon />
								</IconButton>
							)}
						</Box>
					</Box>
				</Container>
			</AppBar>

			{/* User Menu - Desktop */}
			<Menu
				id="user-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleUserMenuClose}
				disableScrollLock
				sx={menuStyle}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				{userMenuError && (
					<MenuItem disabled sx={{ opacity: 1 }}>
						<Box sx={{ color: "rgba(239, 68, 68, 0.9)", fontSize: "0.875rem" }}>
							{userMenuError}
						</Box>
					</MenuItem>
				)}

				{!isAuthenticated
					? [
						<MenuItem
							key="login"
							onClick={() =>
								handleUserMenuAction({ type: "open-auth", mode: "login" })
							}
							disabled={userMenuBusy}
						>
							<Login sx={{ ml: 2, fontSize: "1.25rem" }} />
							{language === "fa" ? "ورود" : "Login"}
							{userMenuBusy && <CircularProgress size={16} sx={{ ml: 1 }} />}
						</MenuItem>,
						<MenuItem
							key="register"
							onClick={() =>
								handleUserMenuAction({ type: "open-auth", mode: "register" })
							}
							disabled={userMenuBusy}
						>
							<Person sx={{ ml: 2, fontSize: "1.25rem" }} />
							{language === "fa" ? "ثبت نام" : "Register"}
						</MenuItem>,
					]
					: [
						<MenuItem
							key="profile"
							onClick={() =>
								handleUserMenuAction({
									type: "navigate",
									href: routes.user.profile,
								})
							}
							disabled={userMenuBusy}
						>
							<Person sx={{ ml: 2, fontSize: "1.25rem" }} />
							{language === "fa" ? "پروفایل" : "Profile"}
							{userMenuBusy && <CircularProgress size={16} sx={{ ml: 1 }} />}
						</MenuItem>,
						<MenuItem
							key="settings"
							onClick={() =>
								handleUserMenuAction({
									type: "navigate",
									href: routes.user.settings,
								})
							}
							disabled={userMenuBusy}
						>
							<Settings sx={{ ml: 2, fontSize: "1.25rem" }} />
							{language === "fa" ? "تنظیمات" : "Settings"}
						</MenuItem>,
						<MenuItem
							key="logout"
							onClick={() => handleUserMenuAction({ type: "logout" })}
							disabled={userMenuBusy}
						>
							<Logout sx={{ ml: 2, fontSize: "1.25rem" }} />
							{language === "fa" ? "خروج" : "Logout"}
						</MenuItem>,
					]}
			</Menu>

			{/* Mobile Drawer - Glass Sidebar */}
			<Drawer
				anchor="right"
				open={mobileOpen}
				onClose={handleMobileToggle}
				sx={drawerStyle}
			>
				<Box sx={{ pt: 10, px: 2 }}>
					{/* Mobile User Section */}
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 2,
							p: 2,
							mb: 2,
							borderRadius: glassBorderRadius.lg,
							background: glassColors.glass.base,
							border: `1px solid ${glassColors.glass.border}`,
						}}
					>
						<Avatar sx={{ width: 48, height: 48 }}>
							<AccountCircle />
						</Avatar>
						<Box>
							<Box
								sx={{
									color: glassColors.text.primary,
									fontWeight: 600,
									fontSize: "1rem",
								}}
							>
								{language === "fa" ? "کاربر" : "User"}
							</Box>
							<Box
								sx={{ color: glassColors.text.tertiary, fontSize: "0.875rem" }}
							>
								user@example.com
							</Box>
						</Box>
					</Box>

					{/* Mobile Navigation */}
					<List>
						{navItems.map((item, idx) => {
							const isActive = pathname === item.href;
							const label = language === "fa" ? item.labelFa : item.label;

							return (
								<ListItem key={`mobile-${idx}-${item.label}`} disablePadding>
									<Link
										href={item.href}
										style={{ textDecoration: "none", width: "100%" }}
										onClick={handleMobileToggle}
									>
										<ListItemButton
											sx={{
												borderRadius: glassBorderRadius.md,
												mb: 1,
												background: isActive
													? `linear-gradient(135deg, ${glassColors.persianGold}30, ${glassColors.persianGold}20)`
													: "transparent",
												border: isActive
													? `1px solid ${glassColors.persianGold}40`
													: "1px solid transparent",
												transition: glassAnimations.transition.smooth,
												"&:hover": {
													background: glassColors.glass.strong,
													transform: "translateX(-4px)",
												},
											}}
										>
											<Box
												sx={{
													color: isActive
														? glassColors.persianGold
														: glassColors.text.secondary,
													mr: 2,
													display: "flex",
												}}
											>
												{item.icon}
											</Box>
											<ListItemText
												primary={label}
												sx={{
													"& .MuiTypography-root": {
														color: isActive
															? "#FFFFFF"
															: "rgba(255, 255, 255, 0.9)",
														fontWeight: isActive ? 600 : 400,
													},
												}}
											/>
										</ListItemButton>
									</Link>
								</ListItem>
							);
						})}
					</List>

					{/* Mobile Logout */}
					<Box sx={{ mt: 4 }}>
						<ListItemButton
							onClick={() =>
								handleUserMenuAction(
									isAuthenticated
										? { type: "logout" }
										: { type: "open-auth", mode: "login" },
								)
							}
							sx={{
								borderRadius: glassBorderRadius.md,
								border: `1px solid ${glassColors.glass.border}`,
								transition: glassAnimations.transition.smooth,
								"&:hover": {
									background: "rgba(239, 68, 68, 0.1)",
									borderColor: "rgba(239, 68, 68, 0.3)",
								},
							}}
						>
							{isAuthenticated ? (
								<Logout sx={{ mr: 2, color: "rgba(239, 68, 68, 0.8)" }} />
							) : (
								<Login sx={{ mr: 2, color: "rgba(255, 255, 255, 0.8)" }} />
							)}
							<ListItemText
								primary={
									isAuthenticated
										? language === "fa"
											? "خروج"
											: "Logout"
										: language === "fa"
											? "ورود"
											: "Login"
								}
								sx={{
									"& .MuiTypography-root": {
										color: isAuthenticated
											? "rgba(239, 68, 68, 0.8)"
											: "rgba(255, 255, 255, 0.85)",
									},
								}}
							/>
						</ListItemButton>
					</Box>
				</Box>
			</Drawer>

			<AuthModals
				open={authModalOpen}
				onClose={() => setAuthModalOpen(false)}
				initialMode={authModalMode}
			/>
		</>
	);
}
