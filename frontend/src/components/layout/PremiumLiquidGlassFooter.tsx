"use client";

import { Box, Container, IconButton, Typography, Link as MuiLink } from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  Language as LanguageIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";
import { liquidGlassColors } from "@/theme/liquid-glass-theme";

interface FooterLink {
  label: string;
  labelFa: string;
  href: string;
}

interface FooterSection {
  title: string;
  titleFa: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Content",
    titleFa: "محتوا",
    links: [
      { label: "Movies", labelFa: "فیلم‌ها", href: "/movies" },
      { label: "Series", labelFa: "سریال‌ها", href: "/series" },
      { label: "Genres", labelFa: "ژانرها", href: "/genres" },
    ],
  },
  {
    title: "Support",
    titleFa: "پشتیبانی",
    links: [
      { label: "Help Center", labelFa: "مرکز راهنما", href: "/help" },
      { label: "Contact", labelFa: "تماس", href: "/contact" },
      { label: "FAQ", labelFa: "سوالات متداول", href: "/faq" },
    ],
  },
  {
    title: "Company",
    titleFa: "شرکت",
    links: [
      { label: "About Us", labelFa: "درباره ما", href: "/about" },
      { label: "Careers", labelFa: "فرصت‌های شغلی", href: "/careers" },
      { label: "Press", labelFa: "اخبار", href: "/press" },
    ],
  },
  {
    title: "Legal",
    titleFa: "قانونی",
    links: [
      { label: "Privacy", labelFa: "حریم خصوصی", href: "/privacy" },
      { label: "Terms", labelFa: "شرایط استفاده", href: "/terms" },
      { label: "Cookies", labelFa: "کوکی‌ها", href: "/cookies" },
    ],
  },
];

const socialLinks = [
  { icon: <Instagram />, href: "https://instagram.com", label: "Instagram" },
  { icon: <Twitter />, href: "https://twitter.com", label: "Twitter" },
  { icon: <Facebook />, href: "https://facebook.com", label: "Facebook" },
  { icon: <YouTube />, href: "https://youtube.com", label: "YouTube" },
];

export function PremiumLiquidGlassFooter() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "fa" ? "en" : "fa");
  };

  const glassLinkStyle = {
    color: "rgba(255, 255, 255, 0.7)",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: 400,
    display: "inline-block",
    position: "relative",
    padding: "4px 0",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: 0,
      height: "1px",
      background: `linear-gradient(90deg, ${liquidGlassColors.persianGold}, transparent)`,
      transition: "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    "&:hover": {
      color: "#FFFFFF",
      transform: "translateX(4px)",
      "&::after": {
        width: "100%",
      },
    },
  };

  const glassIconStyle = {
    width: 40,
    height: 40,
    position: "relative",
    overflow: "hidden",
    background: liquidGlassColors.glass.base,
    border: `1px solid ${liquidGlassColors.glass.border}`,
    backdropFilter: "blur(10px)",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "0%",
      background: `linear-gradient(180deg, ${liquidGlassColors.persianGold}40, ${liquidGlassColors.persianGold}20)`,
      transition: "height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    "&:hover": {
      transform: "translateY(-4px) scale(1.05)",
      border: `1px solid ${liquidGlassColors.persianGold}40`,
      boxShadow: `0 8px 24px -4px ${liquidGlassColors.persianGold}30,
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
      "&::before": {
        height: "100%",
      },
    },
    "& svg": {
      position: "relative",
      zIndex: 1,
      color: "rgba(255, 255, 255, 0.7)",
      transition: "color 0.3s ease",
    },
    "&:hover svg": {
      color: "#FFFFFF",
    },
  };

  const languageToggleStyle = {
    px: 3,
    py: 1,
    borderRadius: "20px",
    background: `linear-gradient(135deg, ${liquidGlassColors.glass.strong}, ${liquidGlassColors.glass.mid})`,
    border: `1px solid ${liquidGlassColors.glass.border}`,
    backdropFilter: "blur(20px)",
    color: "#FFFFFF",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    display: "flex",
    alignItems: "center",
    gap: 1,
    "&:hover": {
      background: `linear-gradient(135deg, ${liquidGlassColors.persianGold}30, ${liquidGlassColors.persianGold}20)`,
      border: `1px solid ${liquidGlassColors.persianGold}40`,
      transform: "translateY(-2px)",
      boxShadow: `0 8px 16px -4px ${liquidGlassColors.persianGold}30,
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        mt: 8,
        pt: 8,
        pb: 4,
        overflow: "hidden",
      }}
    >
      {/* Persian Pattern Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${liquidGlassColors.persianGold}40 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${liquidGlassColors.persianGold}40 0%, transparent 50%)
          `,
          backgroundSize: "100px 100px",
          pointerEvents: "none",
        }}
      />

      {/* Decorative Persian Geometric Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "200px",
          opacity: 0.05,
          backgroundImage: `
            conic-gradient(
              from 0deg,
              ${liquidGlassColors.persianGold}00,
              ${liquidGlassColors.persianGold}40,
              ${liquidGlassColors.persianGold}00
            )
          `,
          borderRadius: "50%",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Glass Top Border */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, 
            transparent, 
            ${liquidGlassColors.glass.border}, 
            transparent)`,
        }}
      />

      <Container maxWidth="xl">
        {/* Main Footer Content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "2fr repeat(4, 1fr)",
            },
            gap: 4,
            mb: 6,
          }}
        >
          {/* Brand Section - Persian Calligraphy */}
          <Box>
            <Box sx={{ mb: 3 }}>
              {/* Logo with Persian Touch */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
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
                    fontSize: "1.5rem",
                    color: liquidGlassColors.persianGold,
                    boxShadow: `0 4px 16px -2px ${liquidGlassColors.persianGold}30,
                                inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
                    fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
                  }}
                >
                  {language === "fa" ? "پ" : "P"}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      letterSpacing: "-0.02em",
                      fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
                    }}
                  >
                    {language === "fa" ? "پرشیاپلی" : "PersiaPlay"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
                    }}
                  >
                    {language === "fa"
                      ? "سرگرمی ایرانی و بین‌المللی"
                      : "Persian & International Entertainment"}
                  </Typography>
                </Box>
              </Box>

              {/* Language Switcher */}
              <Box
                component="button"
                onClick={toggleLanguage}
                sx={languageToggleStyle}
              >
                <LanguageIcon sx={{ fontSize: "1.125rem" }} />
                {language === "fa" ? "English" : "فارسی"}
              </Box>
            </Box>
          </Box>

          {/* Footer Links Sections */}
          {footerSections.map((section, index) => (
            <Box key={index}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  mb: 2,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
                }}
              >
                {language === "fa" ? section.titleFa : section.title}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      component="span"
                      sx={{
                        ...glassLinkStyle,
                        fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
                      }}
                    >
                      {language === "fa" ? link.labelFa : link.label}
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Social Media Icons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mb: 4,
            py: 4,
            borderTop: `1px solid ${liquidGlassColors.glass.border}`,
            borderBottom: `1px solid ${liquidGlassColors.glass.border}`,
          }}
        >
          {socialLinks.map((social, index) => (
            <MuiLink
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <IconButton sx={glassIconStyle} aria-label={social.label}>
                {social.icon}
              </IconButton>
            </MuiLink>
          ))}
        </Box>

        {/* Copyright & Legal */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            pt: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.5)",
              fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {language === "fa"
              ? `© ${new Date().getFullYear()} پرشیاپلی. تمام حقوق محفوظ است.`
              : `© ${new Date().getFullYear()} PersiaPlay. All rights reserved.`}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/privacy" style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: liquidGlassColors.persianGold,
                  },
                }}
              >
                {language === "fa" ? "حریم خصوصی" : "Privacy Policy"}
              </Typography>
            </Link>
            <Link href="/terms" style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: liquidGlassColors.persianGold,
                  },
                }}
              >
                {language === "fa" ? "شرایط استفاده" : "Terms of Service"}
              </Typography>
            </Link>
            <Link href="/cookies" style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: language === "fa" ? "Vazirmatn" : "inherit",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: liquidGlassColors.persianGold,
                  },
                }}
              >
                {language === "fa" ? "سیاست کوکی" : "Cookie Policy"}
              </Typography>
            </Link>
          </Box>
        </Box>

        {/* Decorative Persian Quote/Motto (Optional) */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${liquidGlassColors.glass.border}`,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.3)",
              fontStyle: "italic",
              fontFamily: language === "fa" ? "Vazirmatn" : "serif",
              letterSpacing: language === "fa" ? "normal" : "0.05em",
            }}
          >
            {language === "fa"
              ? "« هنر برای جهان، جهان برای هنر »"
              : "« Art for the World, World for Art »"}
          </Typography>
        </Box>
      </Container>

      {/* Bottom Gradient Fade */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "100px",
          background: `linear-gradient(180deg, transparent, ${liquidGlassColors.deepMidnight}40)`,
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}
