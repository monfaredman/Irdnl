"use client";

import { Box, Typography, Grid, Button, Chip, IconButton } from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLanguage } from "@/providers/language-provider";
import {
  glassColors,
  glassBorderRadius,
  glassBlur,
} from "@/theme/glass-design-system";

const translations = {
  en: {
    title: "Press & News",
    subtitle: "Latest announcements and media resources",
    latestNews: "Latest News",
    pressReleases: "Press Releases",
    mediaKit: "Media Kit",
    downloadKit: "Download Media Kit",
    readMore: "Read More",
    share: "Share",
    categories: {
      announcement: "Announcement",
      partnership: "Partnership",
      feature: "New Feature",
      award: "Award",
    },
    contact: {
      title: "Media Contact",
      description: "For press inquiries, please contact our media team",
      email: "press@irdnl.com",
      phone: "+98 21 1234 5678",
    },
  },
  fa: {
    title: "اخبار و مطبوعات",
    subtitle: "آخرین اطلاعیه‌ها و منابع رسانه‌ای",
    latestNews: "آخرین اخبار",
    pressReleases: "اطلاعیه‌های مطبوعاتی",
    mediaKit: "کیت رسانه‌ای",
    downloadKit: "دانلود کیت رسانه‌ای",
    readMore: "بیشتر بخوانید",
    share: "اشتراک‌گذاری",
    categories: {
      announcement: "اطلاعیه",
      partnership: "همکاری",
      feature: "ویژگی جدید",
      award: "جایزه",
    },
    contact: {
      title: "تماس رسانه‌ای",
      description: "برای سوالات مطبوعاتی، با تیم رسانه ما تماس بگیرید",
      email: "press@irdnl.com",
      phone: "۰۲۱-۱۲۳۴۵۶۷۸",
    },
  },
};

const newsItems = [
  {
    id: 1,
    title: "irdnl Reaches 10 Million Subscribers",
    titleFa: "پرشیاپلی به ۱۰ میلیون مشترک رسید",
    excerpt: "A major milestone for the leading Persian streaming platform",
    excerptFa: "دستاورد بزرگ برای پیشرو پلتفرم استریمینگ فارسی",
    date: "2025-01-15",
    dateFa: "۱۴۰۳/۱۰/۲۶",
    category: "announcement",
    featured: true,
  },
  {
    id: 2,
    title: "New Partnership with International Studios",
    titleFa: "همکاری جدید با استودیوهای بین‌المللی",
    excerpt: "Expanding our content library with exclusive partnerships",
    excerptFa: "گسترش کتابخانه محتوا با همکاری‌های انحصاری",
    date: "2025-01-10",
    dateFa: "۱۴۰۳/۱۰/۲۱",
    category: "partnership",
    featured: false,
  },
  {
    id: 3,
    title: "Introducing 4K HDR Streaming",
    titleFa: "معرفی استریمینگ 4K HDR",
    excerpt: "Experience cinema-quality streaming at home",
    excerptFa: "تجربه کیفیت سینمایی در خانه",
    date: "2025-01-05",
    dateFa: "۱۴۰۳/۱۰/۱۶",
    category: "feature",
    featured: true,
  },
  {
    id: 4,
    title: "Best Streaming Platform Award 2024",
    titleFa: "جایزه بهترین پلتفرم استریمینگ ۲۰۲۴",
    excerpt: "Recognized for excellence in user experience",
    excerptFa: "تقدیر برای برتری در تجربه کاربری",
    date: "2024-12-20",
    dateFa: "۱۴۰۳/۰۹/۳۰",
    category: "award",
    featured: false,
  },
  {
    id: 5,
    title: "Kids Zone Launch Announcement",
    titleFa: "اعلام راه‌اندازی بخش کودکان",
    excerpt: "Safe and fun content for the whole family",
    excerptFa: "محتوای امن و سرگرم‌کننده برای همه خانواده",
    date: "2024-12-15",
    dateFa: "۱۴۰۳/۰۹/۲۵",
    category: "feature",
    featured: false,
  },
  {
    id: 6,
    title: "Expansion to New Markets",
    titleFa: "گسترش به بازارهای جدید",
    excerpt: "irdnl now available in 20+ countries",
    excerptFa: "پرشیاپلی اکنون در بیش از ۲۰ کشور در دسترس است",
    date: "2024-12-01",
    dateFa: "۱۴۰۳/۰۹/۱۱",
    category: "announcement",
    featured: false,
  },
];

export default function PressPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const isRTL = language === "fa";

  const glassCardSx = {
    background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
    backdropFilter: `blur(${glassBlur.medium})`,
    border: `1px solid ${glassColors.glass.border}`,
    borderRadius: glassBorderRadius.xl,
    p: 4,
  };

  const getCategoryLabel = (category: string) => {
    return t.categories[category as keyof typeof t.categories] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      announcement: glassColors.persianGold,
      partnership: "#8B5CF6",
      feature: "#06B6D4",
      award: "#F59E0B",
    };
    return colors[category] || glassColors.persianGold;
  };

  const featuredNews = newsItems.filter((item) => item.featured);
  const regularNews = newsItems.filter((item) => !item.featured);

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          ...glassCardSx,
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
          <NewspaperIcon sx={{ fontSize: "2rem", color: "#000" }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            sx={{ color: glassColors.text.primary, fontWeight: 800, mb: 0.5 }}
          >
            {t.title}
          </Typography>
          <Typography sx={{ color: glassColors.text.tertiary }}>
            {t.subtitle}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{
            background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}80)`,
            color: "#000",
            fontWeight: 600,
            borderRadius: glassBorderRadius.md,
            px: 3,
            "&:hover": {
              background: glassColors.persianGold,
            },
          }}
        >
          {t.downloadKit}
        </Button>
      </Box>

      {/* Featured News */}
      <Typography
        variant="h5"
        sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 3 }}
      >
        {t.latestNews}
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {featuredNews.map((news) => (
          <Grid size={{ xs: 12, md: 6 }} key={news.id}>
            <Box
              sx={{
                ...glassCardSx,
                height: "100%",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  border: `1px solid ${glassColors.persianGold}40`,
                  boxShadow: `0 20px 40px -12px ${glassColors.persianGold}20`,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Chip
                  label={getCategoryLabel(news.category)}
                  size="small"
                  sx={{
                    background: `${getCategoryColor(news.category)}20`,
                    color: getCategoryColor(news.category),
                    fontWeight: 600,
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: glassColors.text.tertiary,
                    fontSize: "0.875rem",
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: "1rem" }} />
                  {language === "fa" ? news.dateFa : news.date}
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: glassColors.text.primary,
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                {language === "fa" ? news.titleFa : news.title}
              </Typography>
              <Typography sx={{ color: glassColors.text.secondary, mb: 3 }}>
                {language === "fa" ? news.excerptFa : news.excerpt}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  endIcon={isRTL ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                  sx={{
                    color: glassColors.persianGold,
                    fontWeight: 600,
                    "&:hover": {
                      background: `${glassColors.persianGold}10`,
                    },
                  }}
                >
                  {t.readMore}
                </Button>
                <IconButton
                  sx={{
                    color: glassColors.text.secondary,
                    "&:hover": {
                      background: `${glassColors.glass.mid}`,
                    },
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Press Releases */}
      <Typography
        variant="h5"
        sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 3 }}
      >
        {t.pressReleases}
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {regularNews.map((news) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={news.id}>
            <Box
              sx={{
                ...glassCardSx,
                p: 3,
                height: "100%",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  border: `1px solid ${glassColors.glass.border}`,
                  boxShadow: `0 12px 24px -8px rgba(0,0,0,0.3)`,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Chip
                  label={getCategoryLabel(news.category)}
                  size="small"
                  sx={{
                    background: `${getCategoryColor(news.category)}20`,
                    color: getCategoryColor(news.category),
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: glassColors.text.primary,
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                {language === "fa" ? news.titleFa : news.title}
              </Typography>
              <Typography
                sx={{
                  color: glassColors.text.tertiary,
                  fontSize: "0.875rem",
                  mb: 2,
                }}
              >
                {language === "fa" ? news.excerptFa : news.excerpt}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: glassColors.text.tertiary,
                  fontSize: "0.875rem",
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: "1rem" }} />
                {language === "fa" ? news.dateFa : news.date}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Media Contact */}
      <Box
        sx={{
          ...glassCardSx,
          background: `linear-gradient(135deg, ${glassColors.persianGold}15, ${glassColors.persianGold}05)`,
          border: `1px solid ${glassColors.persianGold}30`,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 2 }}
        >
          {t.contact.title}
        </Typography>
        <Typography
          sx={{ color: glassColors.text.secondary, mb: 3, maxWidth: 600, mx: "auto" }}
        >
          {t.contact.description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              sx={{ color: glassColors.text.tertiary, fontSize: "0.875rem" }}
            >
              Email
            </Typography>
            <Typography sx={{ color: glassColors.persianGold, fontWeight: 600 }}>
              {t.contact.email}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{ color: glassColors.text.tertiary, fontSize: "0.875rem" }}
            >
              Phone
            </Typography>
            <Typography sx={{ color: glassColors.persianGold, fontWeight: 600 }}>
              {t.contact.phone}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
