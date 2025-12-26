"use client";

/**
 * Collections Page - مجموعه‌ها
 * 
 * Premium Liquid Glass design showcasing curated movie collections
 * Features: TMDB integration, progress tracking, featured carousel
 */

import CollectionsIcon from "@mui/icons-material/Collections";
import MovieIcon from "@mui/icons-material/Movie";
import { Box, Chip, Typography } from "@mui/material";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";
import {
  glassBlur,
  glassBorderRadius,
  glassColors,
} from "@/theme/glass-design-system";

const translations = {
  en: {
    title: "Special Collections",
    subtitle: "Organized by franchise, theme, and cinematic universes",
    featuredTitle: "Featured Collections",
    allCollections: "All Collections",
    viewCollection: "View Collection",
    movies: "movies",
    comingSoon: "Coming Soon",
    description: "Movie collections will be available soon with TMDB integration.",
  },
  fa: {
    title: "مجموعه‌های ویژه",
    subtitle: "دسته‌بندی شده بر اساس فرنچایز، تم و دنیاها",
    featuredTitle: "مجموعه‌های برگزیده",
    allCollections: "همه مجموعه‌ها",
    viewCollection: "مشاهده مجموعه",
    movies: "فیلم",
    comingSoon: "به زودی",
    description: "مجموعه‌های فیلم به زودی با یکپارچه‌سازی TMDB در دسترس خواهند بود.",
  },
};

// Mock collections data for display
const mockCollections = [
  {
    id: "marvel",
    name: "Marvel Cinematic Universe",
    nameFa: "دنیای سینمایی مارول",
    movieCount: 32,
    color: "#E23636",
  },
  {
    id: "dc",
    name: "DC Extended Universe",
    nameFa: "دنیای گسترده DC",
    movieCount: 15,
    color: "#0476F2",
  },
  {
    id: "star-wars",
    name: "Star Wars Collection",
    nameFa: "مجموعه جنگ ستارگان",
    movieCount: 12,
    color: "#FFE81F",
  },
  {
    id: "harry-potter",
    name: "Harry Potter Series",
    nameFa: "سریال هری پاتر",
    movieCount: 10,
    color: "#7F0909",
  },
  {
    id: "lotr",
    name: "Lord of the Rings",
    nameFa: "ارباب حلقه‌ها",
    movieCount: 6,
    color: "#D4AF37",
  },
  {
    id: "fast-furious",
    name: "Fast & Furious",
    nameFa: "سریع و خشمگین",
    movieCount: 11,
    color: "#FF6B00",
  },
];

export default function CollectionsPage() {
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const t = translations[language];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${glassColors.deepMidnight} 0%, 
          #1a1a2e 50%, 
          ${glassColors.deepMidnight} 100%)`,
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Hero Section */}
        <Box
          sx={{
            mb: 6,
            p: { xs: 4, sm: 6 },
            borderRadius: glassBorderRadius.xxl,
            background: `linear-gradient(135deg, ${glassColors.gold.lighter}, ${glassColors.glass.mid})`,
            backdropFilter: glassBlur.strong,
            border: `1px solid ${glassColors.glass.border}`,
            position: "relative",
            overflow: "hidden",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <CollectionsIcon
                sx={{
                  fontSize: 48,
                  color: glassColors.persianGold,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.white})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.title}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: glassColors.text.secondary,
                maxWidth: 800,
              }}
            >
              {t.subtitle}
            </Typography>
          </Box>
        </Box>

        {/* Collections content */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4, 
              fontWeight: 800, 
              color: glassColors.text.primary,
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            {t.allCollections}
          </Typography>
          
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {mockCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: glassBorderRadius.xl,
                    overflow: "hidden",
                    height: 280,
                    background: `linear-gradient(135deg, ${collection.color}20, ${collection.color}10)`,
                    backdropFilter: glassBlur.medium,
                    border: `1px solid ${collection.color}40`,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px ${collection.color}30`,
                      border: `1px solid ${collection.color}60`,
                    },
                  }}
                >
                  {/* Content */}
                  <Box
                    sx={{
                      position: "relative",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: 3,
                    }}
                  >
                    {/* Collection Icon */}
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: glassColors.glass.mid,
                        backdropFilter: glassBlur.medium,
                        border: `1px solid ${glassColors.glass.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <CollectionsIcon sx={{ color: collection.color, fontSize: 24 }} />
                    </Box>

                    {/* Title */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          color: glassColors.text.primary,
                          mb: 1,
                          direction: isRTL ? "rtl" : "ltr",
                        }}
                      >
                        {isRTL ? collection.nameFa : collection.name}
                      </Typography>
                      
                      {/* Movie Count Badge */}
                      <Chip
                        icon={<MovieIcon />}
                        label={`${collection.movieCount} ${t.movies}`}
                        size="small"
                        sx={{
                          background: glassColors.glass.mid,
                          backdropFilter: glassBlur.medium,
                          border: `1px solid ${glassColors.glass.border}`,
                          color: glassColors.text.primary,
                          "& .MuiChip-icon": { color: collection.color },
                        }}
                      />
                    </Box>

                    {/* Coming Soon Badge */}
                    <Chip
                      label={t.comingSoon}
                      size="small"
                      sx={{
                        alignSelf: "flex-start",
                        background: collection.color,
                        color: glassColors.white,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Link>
            ))}
          </Box>
        </Box>

        {/* Info Message */}
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            px: 3,
            borderRadius: glassBorderRadius.lg,
            background: glassColors.glass.mid,
            backdropFilter: glassBlur.medium,
            border: `1px solid ${glassColors.glass.border}`,
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: glassColors.text.secondary,
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            {t.description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
