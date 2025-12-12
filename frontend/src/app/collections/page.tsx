"use client";

import { useState } from "react";
import { Box, Typography, Chip, Grid } from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";
import {
  glassColors,
  glassBorderRadius,
  glassBlur,
} from "@/theme/glass-design-system";

const translations = {
  en: {
    title: "Collections",
    subtitle: "Curated movie collections for every taste",
    movies: "movies",
    viewAll: "View All",
  },
  fa: {
    title: "مجموعه‌ها",
    subtitle: "مجموعه‌های انتخابی فیلم برای هر سلیقه",
    movies: "فیلم",
    viewAll: "مشاهده همه",
  },
};

// Mock collections data
const collections = [
  {
    id: "marvel",
    name: "Marvel Cinematic Universe",
    nameFa: "دنیای سینمایی مارول",
    description: "All MCU movies in chronological order",
    descriptionFa: "تمام فیلم‌های MCU به ترتیب زمانی",
    poster: "/images/movies/movie-poster.jpg",
    backdrop: "/images/movies/movie-backdrop.jpg",
    movieCount: 32,
    color: "#E23636",
  },
  {
    id: "dc",
    name: "DC Extended Universe",
    nameFa: "دنیای گسترده DC",
    description: "DC superhero movies",
    descriptionFa: "فیلم‌های ابرقهرمانی DC",
    poster: "/images/movies/movie-poster.jpg",
    backdrop: "/images/movies/movie-backdrop.jpg",
    movieCount: 15,
    color: "#0476F2",
  },
  {
    id: "nolan",
    name: "Christopher Nolan Collection",
    nameFa: "مجموعه کریستوفر نولان",
    description: "Masterpieces from the legendary director",
    descriptionFa: "شاهکارهای کارگردان افسانه‌ای",
    poster: "/images/movies/movie-poster.jpg",
    backdrop: "/images/movies/movie-backdrop.jpg",
    movieCount: 12,
    color: "#1A1A1A",
  },
  {
    id: "pixar",
    name: "Pixar Animation",
    nameFa: "انیمیشن‌های پیکسار",
    description: "Heartwarming animated movies",
    descriptionFa: "انیمیشن‌های دلنشین",
    poster: "/images/movies/movie-poster.jpg",
    backdrop: "/images/movies/movie-backdrop.jpg",
    movieCount: 26,
    color: "#06B6D4",
  },
  {
    id: "ghibli",
    name: "Studio Ghibli",
    nameFa: "استودیو جیبلی",
    description: "Magical anime from Japan",
    descriptionFa: "انیمیشن‌های جادویی ژاپنی",
    poster: "/images/movies/movie-poster.jpg",
    backdrop: "/images/movies/movie-backdrop.jpg",
    movieCount: 22,
    color: "#22C55E",
  },
  {
    id: "oscar",
    name: "Oscar Winners",
    nameFa: "برندگان اسکار",
    description: "Best Picture winners through the years",
    descriptionFa: "برندگان بهترین فیلم در طول سال‌ها",
    poster: "/images/movies/movie-poster.jpg",
    backdrop: "/images/movies/movie-backdrop.jpg",
    movieCount: 95,
    color: glassColors.persianGold,
  },
  {
    id: "horror-classics",
    name: "Horror Classics",
    nameFa: "کلاسیک‌های ترسناک",
    description: "Timeless horror masterpieces",
    descriptionFa: "شاهکارهای بی‌زمان ترسناک",
    poster: "/images/movies/movie-poster.jpg",
    backdrop: "/images/movies/movie-backdrop.jpg",
    movieCount: 50,
    color: "#991B1B",
  },
  {
    id: "sci-fi-essentials",
    name: "Sci-Fi Essentials",
    nameFa: "ضروریات علمی‌تخیلی",
    description: "Must-watch science fiction",
    descriptionFa: "علمی‌تخیلی‌های دیدنی",
    poster: "/images/movies/movie-poster.jpg",
    backdrop: "/images/movies/movie-backdrop.jpg",
    movieCount: 40,
    color: "#7C3AED",
  },
];

export default function CollectionsPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const glassCardSx = {
    background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
    backdropFilter: `blur(${glassBlur.medium})`,
    border: `1px solid ${glassColors.glass.border}`,
    borderRadius: glassBorderRadius.xl,
    overflow: "hidden",
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          ...glassCardSx,
          p: 4,
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: glassBorderRadius.lg,
            background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}80)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CollectionsIcon sx={{ fontSize: "2rem", color: "#000" }} />
        </Box>
        <Box>
          <Typography
            variant="h3"
            sx={{
              color: glassColors.text.primary,
              fontWeight: 800,
              mb: 0.5,
            }}
          >
            {t.title}
          </Typography>
          <Typography sx={{ color: glassColors.text.tertiary }}>
            {t.subtitle}
          </Typography>
        </Box>
      </Box>

      {/* Collections Grid */}
      <Grid container spacing={3}>
        {collections.map((collection) => {
          const isHovered = hoveredId === collection.id;
          return (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={collection.id}>
              <Link
                href={`/collections/${collection.id}`}
                style={{ textDecoration: "none" }}
              >
                <Box
                  onMouseEnter={() => setHoveredId(collection.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  sx={{
                    position: "relative",
                    height: 280,
                    borderRadius: glassBorderRadius.xl,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.4s ease",
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${collection.color}80, transparent 50%), linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)`,
                      zIndex: 1,
                    },
                  }}
                >
                  {/* Background Image */}
                  <Image
                    src={collection.backdrop}
                    alt={language === "fa" ? collection.nameFa : collection.name}
                    fill
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                      transform: isHovered ? "scale(1.1)" : "scale(1)",
                    }}
                  />

                  {/* Accent Line */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: collection.color,
                      zIndex: 2,
                    }}
                  />

                  {/* Content */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 3,
                      zIndex: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        mb: 0.5,
                      }}
                    >
                      {language === "fa" ? collection.nameFa : collection.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.9rem",
                        mb: 2,
                      }}
                    >
                      {language === "fa" ? collection.descriptionFa : collection.description}
                    </Typography>
                    <Chip
                      label={`${collection.movieCount} ${t.movies}`}
                      size="small"
                      sx={{
                        background: `${collection.color}40`,
                        color: "#fff",
                        border: `1px solid ${collection.color}80`,
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* Hover Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: `${collection.color}20`,
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      zIndex: 1,
                    }}
                  />
                </Box>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
