"use client";

import { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  AccountCircle,
  Movie,
  Tv,
  Category,
  Person,
  Logout,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/providers/language-provider";
import { liquidGlassColors } from "@/theme/liquid-glass-theme";

interface NavItem {
  label: string;
  labelFa: string;
  href: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Movies", labelFa: "فیلم‌ها", href: "/movies", icon: <Movie /> },
  { label: "Series", labelFa: "سریال‌ها", href: "/series", icon: <Tv /> },
  { label: "Genres", labelFa: "ژانرها", href: "/genres", icon: <Category /> },
  { label: "Account", labelFa: "حساب کاربری", href: "/account", icon: <Person /> },
];

export function PremiumLiquidGlassHeader() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State management
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Auto-focus search when expanded
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  // Handlers
  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
    if (searchExpanded) {
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Glass styles
  const glassBaseStyle = {
    background: scrolled
      ? `linear-gradient(180deg, 
          ${liquidGlassColors.glass.mid} 0%, 
          ${liquidGlassColors.glass.base} 100%)`
      : "transparent",
    backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(8px) saturate(120%)",
    WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(8px) saturate(120%)",
    borderBottom: scrolled
      ? `1px solid ${liquidGlassColors.glass.border}`
      : "1px solid transparent",
    boxShadow: scrolled
      ? `inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
         0 4px 24px -2px rgba(0, 0, 0, 0.2)`
      : "none",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  };

  const pillButtonStyle = (isActive: boolean) => ({
    px: 3,
    py: 1,
    borderRadius: "24px",
    position: "relative",
    overflow: "hidden",
    color: isActive ? liquidGlassColors.persianGold : "#FFFFFF",
    fontSize: "0.875rem",
    fontWeight: 500,
    textTransform: "none" as const,
    background: isActive
      ? `linear-gradient(135deg, ${liquidGlassColors.persianGold}20, ${liquidGlassColors.persianGold}10)`
      : "transparent",
    border: isActive
      ? `1px solid ${liquidGlassColors.persianGold}40`
      : "1px solid transparent",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background: `linear-gradient(90deg, 
        transparent, 
        ${liquidGlassColors.glass.strong}, 
        transparent)`,
      transition: "left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    "&:hover": {
      background: `linear-gradient(135deg, 
        ${liquidGlassColors.glass.strong}, 
        ${liquidGlassColors.glass.mid})`,
      border: `1px solid ${liquidGlassColors.glass.border}`,
      transform: "translateY(-2px)",
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

  const searchContainerStyle = {
    display: "flex",
    alignItems: "center",
    width: searchExpanded ? { xs: "200px", sm: "300px" } : "40px",
    height: "40px",
    borderRadius: "20px",
    background: searchExpanded
      ? `linear-gradient(135deg, ${liquidGlassColors.glass.strong}, ${liquidGlassColors.glass.mid})`
      : "transparent",
    border: searchExpanded
      ? `1px solid ${liquidGlassColors.glass.border}`
      : "1px solid transparent",
    backdropFilter: searchExpanded ? "blur(20px) saturate(180%)" : "none",
    WebkitBackdropFilter: searchExpanded ? "blur(20px) saturate(180%)" : "none",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    overflow: "hidden",
    boxShadow: searchExpanded
      ? `0 8px 24px -4px rgba(0, 0, 0, 0.3),
         inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`
      : "none",
  };

  const avatarStyle = {
    width: 40,
    height: 40,
    border: `2px solid ${liquidGlassColors.glass.border}`,
    boxShadow: `0 4px 16px -2px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    "&:hover": {
      transform: "scale(1.1)",
      border: `2px solid ${liquidGlassColors.persianGold}`,
      boxShadow: `0 8px 24px -4px ${liquidGlassColors.persianGold}40,
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.3)`,
    },
  };

  const menuStyle = {
    "& .MuiPaper-root": {
      mt: 1,
      borderRadius: "16px",
      background: `linear-gradient(180deg, 
        ${liquidGlassColors.glass.strong}, 
        ${liquidGlassColors.glass.mid})`,
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: `1px solid ${liquidGlassColors.glass.border}`,
      boxShadow: `0 16px 48px -8px rgba(0, 0, 0, 0.4),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
      "& .MuiMenuItem-root": {
        color: "#FFFFFF",
        borderRadius: "8px",
        mx: 1,
        my: 0.5,
        transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": {
          background: liquidGlassColors.glass.strong,
          transform: "translateX(4px)",
        },
      },
    },
  };

  const drawerStyle = {
    "& .MuiDrawer-paper": {
      width: 280,
      background: `linear-gradient(180deg, 
        ${liquidGlassColors.deepMidnight}F2, 
        ${liquidGlassColors.deepMidnight}E6)`,
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      borderRight: `1px solid ${liquidGlassColors.glass.border}`,
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
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 72,
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
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, 
                    ${liquidGlassColors.persianGold}40, 
                    ${liquidGlassColors.persianGold}20)`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${liquidGlassColors.persianGold}60`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: liquidGlassColors.persianGold,
                  boxShadow: `0 4px 16px -2px ${liquidGlassColors.persianGold}30,
                              inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
                  }}
                >
                  P
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
                  PersiaPlay
                </Box>
              </Box>
            </Link>

            {/* Desktop Navigation - Glass Pills */}
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                {navItems.slice(0, 3).map((item) => {
                  const isActive = pathname === item.href;
                  const label = language === "fa" ? item.labelFa : item.label;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{ textDecoration: "none" }}
                    >
                      <Box
                        component="button"
                        sx={pillButtonStyle(isActive)}
                      >
                        {label}
                      </Box>
                    </Link>
                  );
                })}
              </Box>
            )}

            {/* Right Section - Search & User */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Glass Search Field */}
              <Box
                component="form"
                onSubmit={handleSearchSubmit}
                sx={searchContainerStyle}
              >
                {searchExpanded && (
                  <InputBase
                    inputRef={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === "fa" ? "جستجو..." : "Search..."}
                    sx={{
                      flex: 1,
                      px: 2,
                      color: "#FFFFFF",
                      fontSize: "0.875rem",
                      "& ::placeholder": {
                        color: "rgba(255, 255, 255, 0.5)",
                        opacity: 1,
                      },
                    }}
                  />
                )}
                <IconButton
                  onClick={handleSearchToggle}
                  size="small"
                  sx={{
                    color: "#FFFFFF",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    "&:hover": {
                      transform: "rotate(90deg)",
                    },
                  }}
                >
                  {searchExpanded ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
              </Box>

              {/* User Avatar - Desktop Only */}
              {!isMobile && (
                <Avatar
                  sx={avatarStyle}
                  onClick={handleUserMenuOpen}
                  alt="User"
                >
                  <AccountCircle />
                </Avatar>
              )}

              {/* Mobile Hamburger */}
              {isMobile && (
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
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
        sx={menuStyle}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleUserMenuClose}>
          <Person sx={{ mr: 1, fontSize: "1.25rem" }} />
          {language === "fa" ? "حساب کاربری" : "Account"}
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <Logout sx={{ mr: 1, fontSize: "1.25rem" }} />
          {language === "fa" ? "خروج" : "Logout"}
        </MenuItem>
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
              borderRadius: "16px",
              background: liquidGlassColors.glass.base,
              border: `1px solid ${liquidGlassColors.glass.border}`,
            }}
          >
            <Avatar sx={{ width: 48, height: 48 }}>
              <AccountCircle />
            </Avatar>
            <Box>
              <Box sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: "1rem" }}>
                {language === "fa" ? "کاربر" : "User"}
              </Box>
              <Box sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.875rem" }}>
                user@example.com
              </Box>
            </Box>
          </Box>

          {/* Mobile Navigation */}
          <List>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const label = language === "fa" ? item.labelFa : item.label;

              return (
                <ListItem key={item.href} disablePadding>
                  <Link
                    href={item.href}
                    style={{ textDecoration: "none", width: "100%" }}
                    onClick={handleMobileToggle}
                  >
                    <ListItemButton
                      sx={{
                      borderRadius: "12px",
                      mb: 1,
                      background: isActive
                        ? `linear-gradient(135deg, ${liquidGlassColors.persianGold}30, ${liquidGlassColors.persianGold}20)`
                        : "transparent",
                      border: isActive
                        ? `1px solid ${liquidGlassColors.persianGold}40`
                        : "1px solid transparent",
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      "&:hover": {
                        background: liquidGlassColors.glass.strong,
                        transform: "translateX(-4px)",
                      },
                      }}
                    >
                      <Box
                        sx={{
                          color: isActive
                            ? liquidGlassColors.persianGold
                            : "rgba(255, 255, 255, 0.7)",
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
                            color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.9)",
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
              sx={{
                borderRadius: "12px",
                border: `1px solid ${liquidGlassColors.glass.border}`,
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": {
                  background: "rgba(239, 68, 68, 0.1)",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                },
              }}
            >
              <Logout sx={{ mr: 2, color: "rgba(239, 68, 68, 0.8)" }} />
              <ListItemText
                primary={language === "fa" ? "خروج" : "Logout"}
                sx={{
                  "& .MuiTypography-root": {
                    color: "rgba(239, 68, 68, 0.8)",
                  },
                }}
              />
            </ListItemButton>
          </Box>
        </Box>
      </Drawer>

      {/* Spacer for fixed header */}
      <Box sx={{ height: 72 }} />
    </>
  );
}
