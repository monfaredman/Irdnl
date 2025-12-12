"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Drawer, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import PaymentIcon from "@mui/icons-material/Payment";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useLanguage } from "@/providers/language-provider";
import {
  glassColors,
  glassBorderRadius,
  glassAnimations,
  glassBlur,
} from "@/theme/glass-design-system";

interface UserLayoutProps {
  children: ReactNode;
}

const translations = {
  en: {
    profile: "Profile",
    watchlist: "Watchlist",
    history: "Watch History",
    settings: "Settings",
    subscription: "Subscription",
    payment: "Payment",
    logout: "Logout",
    myAccount: "My Account",
  },
  fa: {
    profile: "پروفایل",
    watchlist: "لیست تماشا",
    history: "تاریخچه تماشا",
    settings: "تنظیمات",
    subscription: "اشتراک",
    payment: "پرداخت",
    logout: "خروج",
    myAccount: "حساب کاربری",
  },
};

const menuItems = [
  { key: "profile", path: "/user/profile", icon: PersonIcon },
  { key: "watchlist", path: "/user/watchlist", icon: BookmarkIcon },
  { key: "history", path: "/user/history", icon: HistoryIcon },
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
          U
        </Avatar>
        <Typography
          variant="h6"
          sx={{ color: glassColors.text.primary, fontWeight: 600 }}
        >
          کاربر تست
        </Typography>
        <Typography sx={{ color: glassColors.text.tertiary, fontSize: "0.875rem" }}>
          test@example.com
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
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon sx={{ color: "#EF4444" }} />
          </ListItemIcon>
          <ListItemText
            primary={t.logout}
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
  );
};

export default UserLayout;
