"use client";

import { Box, CircularProgress, Alert } from "@mui/material";
import { LiquidGlassSlider } from "@/components/sections/LiquidGlassSlider";
import { EmblaCarousel } from "@/components/sections/EmblaCarousel";
import { OffersSection } from "@/components/sections/OffersSection";
import { FiltersSection } from "@/components/sections/FiltersSection";
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

      {/* Offers Section - 8 cards with chips (no header) */}
      {combinedContent && combinedContent.length > 0 && (
        <OffersSection items={combinedContent} />
      )}

      {/* Filters Section */}
      <FiltersSection />

      {/* New Movie Carousel - فیلم جدید */}
      {trendingMovies && trendingMovies.length > 0 && (
        <EmblaCarousel
          title={language === 'fa' ? 'فیلم جدید' : 'New Movies'}
          items={trendingMovies}
          type="movie"
          viewAllHref="/movies?sort=new"
        />
      )}

      {/* Foreign Series Carousel - سریال خارجی */}
      {foreignSeries.length > 0 && (
        <EmblaCarousel
          title={language === 'fa' ? 'سریال خارجی' : 'Foreign Series'}
          items={foreignSeries}
          type="series"
          viewAllHref="/series?origin=foreign"
        />
      )}

      {/* New Iranian Series - سریال ایرانی جدید */}
      {iranianSeries.length > 0 && (
        <EmblaCarousel
          title={language === 'fa' ? 'سریال ایرانی جدید' : 'New Iranian Series'}
          items={iranianSeries}
          type="series"
          viewAllHref="/series?origin=iranian"
        />
      )}

      {/* Persian Dubbed - دوبله فارسی جدید */}
      {foreignMovies.length > 0 && (
        <EmblaCarousel
          title={language === 'fa' ? 'دوبله فارسی جدید' : 'New Persian Dubbed'}
          items={foreignMovies.slice(0, 8)}
          type="movie"
          viewAllHref="/movies?dubbed=true"
        />
      )}

      {/* Animation Carousel - انیمیشن */}
      {popularMovies && popularMovies.length > 0 && (
        <EmblaCarousel
          title={language === 'fa' ? 'انیمیشن' : 'Animation'}
          items={popularMovies.slice(0, 8)}
          type="movie"
          viewAllHref="/genres?type=animation"
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
