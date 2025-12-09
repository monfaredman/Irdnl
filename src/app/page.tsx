"use client";

import { Box, CircularProgress, Alert } from "@mui/material";
import { LiquidGlassSlider } from "@/components/sections/LiquidGlassSlider";
import { LiquidGlassCarousel } from "@/components/sections/LiquidGlassCarousel";
import { LiquidGlassGrid } from "@/components/sections/LiquidGlassGrid";
import { useLanguage } from "@/providers/language-provider";
import { 
  useTMDBPopularMovies, 
  useTMDBTrendingMovies,
  useTMDBPopularTVShows,
  useTMDBCombinedContent 
} from "@/hooks/useTMDB";

/**
 * Apple-Inspired Liquid Glass Homepage
 * 
 * Design Principles:
 * - Frosted Liquid Glass aesthetic
 * - Extreme minimalism with depth
 * - 70% whitespace minimum
 * - Content-first experience
 * - Premium, sophisticated feel
 * 
 * Data Source: TMDB API (The Movie Database)
 */
export default function Home() {
  const { language } = useLanguage();

  // Fetch real data from TMDB API
  const { data: combinedContent, loading: loadingCombined } = useTMDBCombinedContent({ language });
  const { data: popularMovies, loading: loadingMovies } = useTMDBPopularMovies({ language });
  const { data: trendingMovies, loading: loadingTrending } = useTMDBTrendingMovies({ language });
  const { data: popularSeries, loading: loadingSeries } = useTMDBPopularTVShows({ language });

  // Filter content by origin (Iranian vs Foreign)
  const foreignMovies = popularMovies?.filter(m => m.origin === "foreign") || [];
  const iranianMovies = trendingMovies?.filter(m => m.origin === "iranian") || [];
  const foreignSeries = popularSeries?.filter(s => s.origin === "foreign") || [];
  const iranianSeries = popularSeries?.filter(s => s.origin === "iranian") || [];

  // Loading state
  if (loadingCombined || loadingMovies || loadingTrending || loadingSeries) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#F59E0B' }} size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
      }}
    >
      {/* Premium Hero Slider - Featured/Popular Content */}
      {combinedContent && combinedContent.length > 0 && (
        <LiquidGlassSlider 
          items={combinedContent.slice(0, 5)}
          type="movie"
          autoplayDelay={5000}
        />
      )}

      {/* Content Sections - Mix of Carousels and Grids */}
      
      {/* Foreign Movies - Horizontal Carousel */}
      {foreignMovies.length > 0 && (
        <LiquidGlassCarousel
          title={language === 'fa' ? 'فیلم‌های خارجی' : 'Foreign Movies'}
          items={foreignMovies}
          type="movie"
          viewAllHref="/movies?origin=foreign"
        />
      )}

      {/* Foreign Series - Grid Layout */}
      {foreignSeries.length > 0 && (
        <LiquidGlassGrid
          title={language === 'fa' ? 'سریال‌های خارجی' : 'Foreign Series'}
          items={foreignSeries}
          type="series"
          viewAllHref="/series?origin=foreign"
        />
      )}

      {/* Iranian Movies - Horizontal Carousel */}
      {iranianMovies.length > 0 && (
        <LiquidGlassCarousel
          title={language === 'fa' ? 'فیلم‌های ایرانی' : 'Iranian Movies'}
          items={iranianMovies}
          type="movie"
          viewAllHref="/movies?origin=iranian"
        />
      )}

      {/* Iranian Series - Grid Layout */}
      {iranianSeries.length > 0 && (
        <LiquidGlassGrid
          title={language === 'fa' ? 'سریال‌های ایرانی' : 'Iranian Series'}
          items={iranianSeries}
          type="series"
          viewAllHref="/series?origin=iranian"
        />
      )}

      {/* Fallback if no content */}
      {!combinedContent?.length && !popularMovies?.length && !popularSeries?.length && (
        <Box sx={{ p: 8, textAlign: 'center' }}>
          <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
            {language === 'fa' 
              ? 'در حال بارگذاری محتوا از TMDB...' 
              : 'Loading content from TMDB...'}
          </Alert>
        </Box>
      )}
    </Box>
  );
}
