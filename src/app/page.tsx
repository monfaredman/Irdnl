"use client";

import { Box } from "@mui/material";
import { LiquidGlassHero } from "@/components/sections/LiquidGlassHero";
import { LiquidGlassGrid } from "@/components/sections/LiquidGlassGrid";
import { movies, series } from "@/data/mockContent";
import { useLanguage } from "@/providers/language-provider";

/**
 * Apple-Inspired Liquid Glass Homepage
 * 
 * Design Principles:
 * - Frosted Liquid Glass aesthetic
 * - Extreme minimalism with depth
 * - 70% whitespace minimum
 * - Content-first experience
 * - Premium, sophisticated feel
 */
export default function Home() {
  const { language } = useLanguage();

  // Filter content by origin
  const foreignMovies = movies.filter(m => m.origin === "foreign");
  const iranianMovies = movies.filter(m => m.origin === "iranian");
  const foreignSeries = series.filter(s => s.origin === "foreign");
  const iranianSeries = series.filter(s => s.origin === "iranian");

  return (
    <Box
      sx={{
        minHeight: '100vh',
      }}
    >
      {/* Hero Section - Bold statement with maximum whitespace */}
      <LiquidGlassHero />

      {/* Content Sections - Glass cards with spring animations */}
      
      {/* Foreign Movies */}
      <LiquidGlassGrid
        title={language === 'fa' ? 'فیلم‌های خارجی' : 'Foreign Movies'}
        items={foreignMovies}
        type="movie"
        viewAllHref="/movies?origin=foreign"
      />

      {/* Foreign Series */}
      <LiquidGlassGrid
        title={language === 'fa' ? 'سریال‌های خارجی' : 'Foreign Series'}
        items={foreignSeries}
        type="series"
        viewAllHref="/series?origin=foreign"
      />

      {/* Iranian Movies */}
      <LiquidGlassGrid
        title={language === 'fa' ? 'فیلم‌های ایرانی' : 'Iranian Movies'}
        items={iranianMovies}
        type="movie"
        viewAllHref="/movies?origin=iranian"
      />

      {/* Iranian Series */}
      <LiquidGlassGrid
        title={language === 'fa' ? 'سریال‌های ایرانی' : 'Iranian Series'}
        items={iranianSeries}
        type="series"
        viewAllHref="/series?origin=iranian"
      />
    </Box>
  );
}
