"use client";

import { Box, Container, Divider } from "@mui/material";
import { MinimalHero } from "@/components/sections/MinimalHero";
import { MinimalGrid } from "@/components/sections/MinimalGrid";
import { movies, series } from "@/data/mockContent";
import { useLanguage } from "@/providers/language-provider";
import { minimalSpacing } from "@/theme/minimal-theme";

/**
 * Minimal Homepage Design
 * 
 * Key Principles:
 * - Maximum whitespace (128px, 64px, 32px spacing)
 * - Content-first approach
 * - Strict grid alignment
 * - No decorative elements
 * - Flat, clean design
 */
export default function MinimalHome() {
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
      {/* Hero Section - Bold headline + Single CTA */}
      <MinimalHero />

      {/* Divider */}
      <Container maxWidth="xl">
        <Divider />
      </Container>

      {/* Latest Foreign Movies */}
      <MinimalGrid
        title={language === 'fa' ? 'فیلم های خارجی' : 'Foreign Movies'}
        items={foreignMovies}
        type="movie"
        viewAllHref="/movies?origin=foreign"
      />

      {/* Divider */}
      <Container maxWidth="xl">
        <Divider />
      </Container>

      {/* Latest Foreign Series */}
      <MinimalGrid
        title={language === 'fa' ? 'سریال های خارجی' : 'Foreign Series'}
        items={foreignSeries}
        type="series"
        viewAllHref="/series?origin=foreign"
      />

      {/* Divider */}
      <Container maxWidth="xl">
        <Divider />
      </Container>

      {/* Latest Iranian Movies */}
      <MinimalGrid
        title={language === 'fa' ? 'فیلم های ایرانی' : 'Iranian Movies'}
        items={iranianMovies}
        type="movie"
        viewAllHref="/movies?origin=iranian"
      />

      {/* Divider */}
      <Container maxWidth="xl">
        <Divider />
      </Container>

      {/* Latest Iranian Series */}
      <MinimalGrid
        title={language === 'fa' ? 'سریال های ایرانی' : 'Iranian Series'}
        items={iranianSeries}
        type="series"
        viewAllHref="/series?origin=iranian"
      />
    </Box>
  );
}
