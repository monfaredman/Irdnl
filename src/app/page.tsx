"use client";

import { Box, Container } from "@mui/material";
import { PersianHero } from "@/components/sections/PersianHero";
import { FilterBar } from "@/components/sections/FilterBar";
import { HorizontalCarousel } from "@/components/sections/HorizontalCarousel";
import { PlatformLogos } from "@/components/sections/PlatformLogos";
import { PromotionalBanner } from "@/components/sections/PromotionalBanner";
import { movies, series } from "@/data/mockContent";
import { useLanguage } from "@/providers/language-provider";

export default function Home() {
  const { language } = useLanguage();

  // Filter content by origin
  const foreignMovies = movies.filter(m => m.origin === "foreign");
  const iranianMovies = movies.filter(m => m.origin === "iranian");
  const foreignSeries = series.filter(s => s.origin === "foreign");
  const iranianSeries = series.filter(s => s.origin === "iranian");

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>
      {/* Hero Section */}
      <PersianHero />

      {/* Filter Bar */}
      <FilterBar />

      {/* Latest Foreign Movies */}
      <HorizontalCarousel
        title={language === 'fa' ? 'جدیدترین فیلم های خارجی' : 'Latest Foreign Movies'}
        items={foreignMovies}
        type="movie"
        viewAllHref="/movies?origin=foreign"
      />

      {/* Latest Foreign Series */}
      <HorizontalCarousel
        title={language === 'fa' ? 'جدیدترین سریال های خارجی' : 'Latest Foreign Series'}
        items={foreignSeries}
        type="series"
        viewAllHref="/series?origin=foreign"
      />

      {/* Platform Logos */}
      <PlatformLogos />

      {/* Movie Party Banner */}
      <PromotionalBanner
        title="فیلم پارتی"
        titleEn="Movie Party"
        description="به همراه دوستان خود در هر کجا فیلم یا سریال آنلاین تماشا کنید!"
        descriptionEn="Watch movies or series online with your friends anywhere!"
        buttonText="ورود به صفحه"
        buttonTextEn="Enter Page"
        buttonHref="/movie-party"
        gradient="linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(247, 37, 133, 0.4))"
      />

      {/* Latest Iranian Movies */}
      <HorizontalCarousel
        title={language === 'fa' ? 'جدیدترین فیلم های ایرانی' : 'Latest Iranian Movies'}
        items={iranianMovies}
        type="movie"
        viewAllHref="/movies?origin=iranian"
      />

      {/* Cinema Screening Banner */}
      <PromotionalBanner
        title="اکران سینما"
        titleEn="Cinema Screening"
        description="فیلم های روز سینما رو راحت تو خونه تماشا کنید!"
        descriptionEn="Watch today's cinema movies comfortably at home!"
        buttonText="خرید بلیط"
        buttonTextEn="Buy Ticket"
        buttonHref="/cinema-screening"
        gradient="linear-gradient(135deg, rgba(0, 212, 255, 0.4), rgba(147, 51, 234, 0.4))"
      />

      {/* Latest Iranian Series */}
      <HorizontalCarousel
        title={language === 'fa' ? 'جدیدترین سریال های ایرانی' : 'Latest Iranian Series'}
        items={iranianSeries}
        type="series"
        viewAllHref="/series?origin=iranian"
      />
    </Container>
  );
}
