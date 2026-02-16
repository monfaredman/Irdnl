"use client";

/**
 * Collection Detail Page - صفحه جزئیات مجموعه
 * 
 * Dynamic page for individual movie collections
 * Shows all movies in a franchise with detailed information
 */

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CollectionsIcon from "@mui/icons-material/Collections";
import MovieIcon from "@mui/icons-material/Movie";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarIcon from "@mui/icons-material/Star";
import { Box, Button, Chip, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/providers/language-provider";
import {
  glassBlur,
  glassBorderRadius,
  glassColors,
} from "@/theme/glass-design-system";

const translations = {
  en: {
    backToCollections: "Back to Collections",
    movies: "movies",
    watchNow: "Watch Now",
    addToWatchlist: "Add to Watchlist",
    rating: "Rating",
    year: "Year",
    duration: "Duration",
    min: "min",
    overview: "Overview",
    cast: "Cast",
    director: "Director",
    comingSoon: "Coming Soon",
    description: "Full collection details with TMDB integration coming soon.",
  },
  fa: {
    backToCollections: "بازگشت به مجموعه‌ها",
    movies: "فیلم",
    watchNow: "تماشا کنید",
    addToWatchlist: "افزودن به لیست",
    rating: "امتیاز",
    year: "سال",
    duration: "مدت زمان",
    min: "دقیقه",
    overview: "خلاصه",
    cast: "بازیگران",
    director: "کارگردان",
    comingSoon: "به زودی",
    description: "جزئیات کامل مجموعه با یکپارچه‌سازی TMDB به زودی در دسترس خواهد بود.",
  },
};

// Collection data
const collectionsData: Record<string, {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  color: string;
  movies: {
    id: string;
    tmdbId: number;
    title: string;
    titleFa: string;
    year: number;
    rating: number;
    duration: number;
    poster: string;
  }[];
}> = {
  marvel: {
    id: "marvel",
    name: "Marvel Cinematic Universe",
    nameFa: "دنیای سینمایی مارول",
    description: "The Marvel Cinematic Universe is a media franchise and shared universe centered on superhero films independently produced by Marvel Studios.",
    descriptionFa: "دنیای سینمایی مارول یک فرنچایز رسانه‌ای و دنیای مشترک متمرکز بر فیلم‌های ابرقهرمانی است که به طور مستقل توسط استودیوهای مارول تولید می‌شود.",
    color: "#E23636",
    movies: [
      { id: "1", tmdbId: 1726, title: "Iron Man", titleFa: "مرد آهنی", year: 2008, rating: 7.9, duration: 126, poster: "/images/movies/movie-poster.jpg" },
      { id: "2", tmdbId: 1724, title: "The Incredible Hulk", titleFa: "هالک شگفت‌انگیز", year: 2008, rating: 6.7, duration: 112, poster: "/images/movies/movie-poster.jpg" },
      { id: "3", tmdbId: 10138, title: "Iron Man 2", titleFa: "مرد آهنی ۲", year: 2010, rating: 7.0, duration: 124, poster: "/images/movies/movie-poster.jpg" },
      { id: "4", tmdbId: 10195, title: "Thor", titleFa: "ثور", year: 2011, rating: 7.0, duration: 115, poster: "/images/movies/movie-poster.jpg" },
      { id: "5", tmdbId: 1771, title: "Captain America", titleFa: "کاپیتان آمریکا", year: 2011, rating: 6.9, duration: 124, poster: "/images/movies/movie-poster.jpg" },
      { id: "6", tmdbId: 24428, title: "The Avengers", titleFa: "انتقام‌جویان", year: 2012, rating: 8.0, duration: 143, poster: "/images/movies/movie-poster.jpg" },
    ],
  },
  dc: {
    id: "dc",
    name: "DC Extended Universe",
    nameFa: "دنیای گسترده DC",
    description: "The DC Extended Universe is a media franchise and shared universe centered on superhero films based on DC Comics characters.",
    descriptionFa: "دنیای گسترده DC یک فرنچایز رسانه‌ای و دنیای مشترک متمرکز بر فیلم‌های ابرقهرمانی مبتنی بر شخصیت‌های کمیک DC است.",
    color: "#0476F2",
    movies: [
      { id: "1", tmdbId: 49521, title: "Man of Steel", titleFa: "مرد فولادین", year: 2013, rating: 7.1, duration: 143, poster: "/images/movies/movie-poster.jpg" },
      { id: "2", tmdbId: 209112, title: "Batman v Superman", titleFa: "بتمن در مقابل سوپرمن", year: 2016, rating: 6.5, duration: 151, poster: "/images/movies/movie-poster.jpg" },
      { id: "3", tmdbId: 297761, title: "Suicide Squad", titleFa: "جوخه انتحار", year: 2016, rating: 6.0, duration: 123, poster: "/images/movies/movie-poster.jpg" },
      { id: "4", tmdbId: 297762, title: "Wonder Woman", titleFa: "زن شگفت‌انگیز", year: 2017, rating: 7.4, duration: 141, poster: "/images/movies/movie-poster.jpg" },
      { id: "5", tmdbId: 141052, title: "Justice League", titleFa: "لیگ عدالت", year: 2017, rating: 6.1, duration: 120, poster: "/images/movies/movie-poster.jpg" },
    ],
  },
  "star-wars": {
    id: "star-wars",
    name: "Star Wars Collection",
    nameFa: "مجموعه جنگ ستارگان",
    description: "Star Wars is an epic space opera saga created by George Lucas, spanning multiple trilogies and spin-offs.",
    descriptionFa: "جنگ ستارگان یک حماسه اپرای فضایی است که توسط جورج لوکاس خلق شده و شامل چندین سه‌گانه و فیلم‌های جانبی است.",
    color: "#FFE81F",
    movies: [
      { id: "1", tmdbId: 11, title: "A New Hope", titleFa: "امید تازه", year: 1977, rating: 8.6, duration: 121, poster: "/images/movies/movie-poster.jpg" },
      { id: "2", tmdbId: 1891, title: "The Empire Strikes Back", titleFa: "امپراتوری ضربه می‌زند", year: 1980, rating: 8.7, duration: 124, poster: "/images/movies/movie-poster.jpg" },
      { id: "3", tmdbId: 1892, title: "Return of the Jedi", titleFa: "بازگشت جدای", year: 1983, rating: 8.3, duration: 131, poster: "/images/movies/movie-poster.jpg" },
      { id: "4", tmdbId: 1893, title: "The Phantom Menace", titleFa: "تهدید شبح‌وار", year: 1999, rating: 6.5, duration: 136, poster: "/images/movies/movie-poster.jpg" },
      { id: "5", tmdbId: 1894, title: "Attack of the Clones", titleFa: "حمله کلون‌ها", year: 2002, rating: 6.6, duration: 142, poster: "/images/movies/movie-poster.jpg" },
      { id: "6", tmdbId: 1895, title: "Revenge of the Sith", titleFa: "انتقام سیث", year: 2005, rating: 7.6, duration: 140, poster: "/images/movies/movie-poster.jpg" },
    ],
  },
  "harry-potter": {
    id: "harry-potter",
    name: "Harry Potter Series",
    nameFa: "سریال هری پاتر",
    description: "The Harry Potter film series is based on the fantasy novels by J.K. Rowling, following the journey of a young wizard.",
    descriptionFa: "مجموعه فیلم‌های هری پاتر بر اساس رمان‌های فانتزی نوشته ج.ک. رولینگ است که سفر یک جادوگر جوان را دنبال می‌کند.",
    color: "#7F0909",
    movies: [
      { id: "1", tmdbId: 671, title: "Sorcerer's Stone", titleFa: "سنگ جادو", year: 2001, rating: 7.6, duration: 152, poster: "/images/movies/movie-poster.jpg" },
      { id: "2", tmdbId: 672, title: "Chamber of Secrets", titleFa: "تالار اسرار", year: 2002, rating: 7.4, duration: 161, poster: "/images/movies/movie-poster.jpg" },
      { id: "3", tmdbId: 673, title: "Prisoner of Azkaban", titleFa: "زندانی آزکابان", year: 2004, rating: 7.9, duration: 142, poster: "/images/movies/movie-poster.jpg" },
      { id: "4", tmdbId: 674, title: "Goblet of Fire", titleFa: "جام آتش", year: 2005, rating: 7.7, duration: 157, poster: "/images/movies/movie-poster.jpg" },
      { id: "5", tmdbId: 675, title: "Order of the Phoenix", titleFa: "محفل ققنوس", year: 2007, rating: 7.5, duration: 138, poster: "/images/movies/movie-poster.jpg" },
    ],
  },
  lotr: {
    id: "lotr",
    name: "Lord of the Rings",
    nameFa: "ارباب حلقه‌ها",
    description: "The Lord of the Rings trilogy is an epic fantasy adventure based on J.R.R. Tolkien's novels.",
    descriptionFa: "سه‌گانه ارباب حلقه‌ها یک ماجراجویی فانتزی حماسی بر اساس رمان‌های ج.آر.آر. تالکین است.",
    color: "#D4AF37",
    movies: [
      { id: "1", tmdbId: 120, title: "The Fellowship of the Ring", titleFa: "یاران حلقه", year: 2001, rating: 8.8, duration: 178, poster: "/images/movies/movie-poster.jpg" },
      { id: "2", tmdbId: 121, title: "The Two Towers", titleFa: "دو برج", year: 2002, rating: 8.7, duration: 179, poster: "/images/movies/movie-poster.jpg" },
      { id: "3", tmdbId: 122, title: "The Return of the King", titleFa: "بازگشت پادشاه", year: 2003, rating: 9.0, duration: 201, poster: "/images/movies/movie-poster.jpg" },
      { id: "4", tmdbId: 49051, title: "The Hobbit: An Unexpected Journey", titleFa: "هابیت: سفری غیرمنتظره", year: 2012, rating: 7.8, duration: 169, poster: "/images/movies/movie-poster.jpg" },
      { id: "5", tmdbId: 57158, title: "The Hobbit: The Desolation of Smaug", titleFa: "هابیت: ویرانی اسماگ", year: 2013, rating: 7.8, duration: 161, poster: "/images/movies/movie-poster.jpg" },
      { id: "6", tmdbId: 122917, title: "The Hobbit: The Battle of Five Armies", titleFa: "هابیت: نبرد پنج ارتش", year: 2014, rating: 7.4, duration: 144, poster: "/images/movies/movie-poster.jpg" },
    ],
  },
  "fast-furious": {
    id: "fast-furious",
    name: "Fast & Furious",
    nameFa: "سریع و خشمگین",
    description: "The Fast & Furious franchise is an action film series centered on illegal street racing, heists, and espionage.",
    descriptionFa: "فرنچایز سریع و خشمگین یک مجموعه فیلم اکشن است که بر مسابقات غیرقانونی خیابانی، سرقت و جاسوسی متمرکز است.",
    color: "#FF6B00",
    movies: [
      { id: "1", tmdbId: 9799, title: "The Fast and the Furious", titleFa: "سریع و خشمگین", year: 2001, rating: 6.8, duration: 106, poster: "/images/movies/movie-poster.jpg" },
      { id: "2", tmdbId: 584, title: "2 Fast 2 Furious", titleFa: "دو بار سریع دو بار خشمگین", year: 2003, rating: 5.9, duration: 107, poster: "/images/movies/movie-poster.jpg" },
      { id: "3", tmdbId: 1648, title: "Tokyo Drift", titleFa: "دریفت توکیو", year: 2006, rating: 6.0, duration: 104, poster: "/images/movies/movie-poster.jpg" },
      { id: "4", tmdbId: 13804, title: "Fast & Furious", titleFa: "سریع و خشمگین", year: 2009, rating: 6.5, duration: 107, poster: "/images/movies/movie-poster.jpg" },
      { id: "5", tmdbId: 51497, title: "Fast Five", titleFa: "سریع و خشمگین ۵", year: 2011, rating: 7.3, duration: 130, poster: "/images/movies/movie-poster.jpg" },
    ],
  },
};

// Persian number converter
function toPersianNumber(num: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num).replace(/\d/g, (d) => persianDigits[Number.parseInt(d)]);
}

export default function CollectionDetailPage() {
  const params = useParams();
  const collectionId = params.id as string;
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const t = translations[language];

  const collection = collectionsData[collectionId];

  if (!collection) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: glassColors.deepMidnight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CollectionsIcon sx={{ fontSize: 80, color: glassColors.text.muted, mb: 2 }} />
          <Typography variant="h4" sx={{ color: glassColors.text.primary, mb: 2 }}>
            Collection Not Found
          </Typography>
          <Button
            component={Link}
            href="/category/collections"
            variant="contained"
            sx={{
              background: glassColors.persianGold,
              color: glassColors.white,
              "&:hover": { background: glassColors.gold.solid },
            }}
          >
            {t.backToCollections}
          </Button>
        </Box>
      </Box>
    );
  }

  const title = isRTL ? collection.nameFa : collection.name;
  const description = isRTL ? collection.descriptionFa : collection.description;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${glassColors.deepMidnight} 0%, 
          ${collection.color}15 50%, 
          ${glassColors.deepMidnight} 100%)`,
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Back Button */}
        <IconButton
          component={Link}
          href="/category/collections"
          sx={{
            mb: 3,
            background: glassColors.glass.mid,
            backdropFilter: glassBlur.medium,
            border: `1px solid ${glassColors.glass.border}`,
            color: glassColors.text.primary,
            "&:hover": {
              background: glassColors.glass.strong,
              transform: "translateX(-4px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {isRTL ? <ArrowForwardIcon /> : <ArrowBackIcon />}
        </IconButton>

        {/* Collection Header */}
        <Box
          sx={{
            mb: 6,
            p: { xs: 4, sm: 6 },
            borderRadius: glassBorderRadius.xxl,
            background: `linear-gradient(135deg, ${collection.color}30, ${glassColors.glass.mid})`,
            backdropFilter: glassBlur.strong,
            border: `1px solid ${collection.color}40`,
            position: "relative",
            overflow: "hidden",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          {/* Decorative gradient */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              [isRTL ? "left" : "right"]: 0,
              width: "50%",
              height: "100%",
              background: `radial-gradient(circle at ${isRTL ? "0%" : "100%"} 50%, ${collection.color}20, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: collection.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CollectionsIcon sx={{ fontSize: 32, color: glassColors.white }} />
              </Box>
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: glassColors.text.primary,
                    mb: 0.5,
                  }}
                >
                  {title}
                </Typography>
                <Chip
                  icon={<MovieIcon />}
                  label={`${isRTL ? toPersianNumber(collection.movies.length) : collection.movies.length} ${t.movies}`}
                  sx={{
                    background: glassColors.glass.mid,
                    backdropFilter: glassBlur.medium,
                    border: `1px solid ${glassColors.glass.border}`,
                    color: glassColors.text.primary,
                    "& .MuiChip-icon": { color: collection.color },
                  }}
                />
              </Box>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: glassColors.text.secondary,
                maxWidth: 900,
                lineHeight: 1.8,
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>

        {/* Movies Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 6,
          }}
        >
          {collection.movies.map((movie, index) => (
            <Link
              key={movie.id}
              href={`/item/${movie.tmdbId}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  borderRadius: glassBorderRadius.xl,
                  overflow: "hidden",
                  background: `linear-gradient(135deg, ${collection.color}15, ${glassColors.glass.mid})`,
                  backdropFilter: glassBlur.medium,
                  border: `1px solid ${collection.color}30`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 20px 40px ${collection.color}30`,
                    border: `1px solid ${collection.color}60`,
                  },
                }}
              >
              {/* Movie Poster Placeholder */}
              <Box
                sx={{
                  width: "100%",
                  paddingTop: "150%",
                  background: `linear-gradient(135deg, ${collection.color}40, ${collection.color}20)`,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <MovieIcon sx={{ fontSize: 48, color: glassColors.text.muted }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: glassColors.text.primary,
                      fontWeight: 700,
                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    {isRTL ? movie.titleFa : movie.title}
                  </Typography>
                </Box>
              </Box>

              {/* Movie Info */}
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    direction: isRTL ? "rtl" : "ltr",
                  }}
                >
                  <Chip
                    icon={<StarIcon />}
                    label={isRTL ? toPersianNumber((Number(movie.rating) || 0).toFixed(1)) : (Number(movie.rating) || 0).toFixed(1)}
                    size="small"
                    sx={{
                      background: collection.color,
                      color: glassColors.white,
                      fontWeight: 700,
                      "& .MuiChip-icon": { color: glassColors.white },
                    }}
                  />
                  <Typography variant="body2" sx={{ color: glassColors.text.secondary }}>
                    {isRTL ? toPersianNumber(movie.year) : movie.year}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: glassColors.text.tertiary,
                    mb: 2,
                    direction: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {isRTL ? `${toPersianNumber(movie.duration)} ${t.min}` : `${movie.duration} ${t.min}`}
                </Typography>

                <Button
                  component={Link}
                  href={`/item/${movie.tmdbId}`}
                  fullWidth
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    background: collection.color,
                    color: glassColors.white,
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      background: collection.color,
                      filter: "brightness(1.2)",
                    },
                  }}
                >
                  {t.watchNow}
                </Button>
              </Box>
            </Box>
          </Link>
          ))}
        </Box>

        {/* Coming Soon Notice */}
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
