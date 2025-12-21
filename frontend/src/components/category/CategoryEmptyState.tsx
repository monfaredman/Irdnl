"use client";

/**
 * CategoryEmptyState Component
 * 
 * Premium Liquid Glass empty/no results state for category pages
 * Features: Glass illustration, suggestions, filter clear option
 */

import { Box, Stack, Typography, Button } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";
import {
  glassBorderRadius,
  glassColors,
  glassAnimations,
} from "@/theme/glass-design-system";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ExploreIcon from "@mui/icons-material/Explore";
import Link from "next/link";

interface CategoryEmptyStateProps {
  type?: "no-results" | "no-content" | "error";
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  suggestedGenres?: { slug: string; nameEn: string; nameFa: string }[];
  basePath?: string;
  accentColor?: string;
}

export function CategoryEmptyState({
  type = "no-results",
  hasActiveFilters = false,
  onClearFilters,
  suggestedGenres = [],
  basePath = "/",
  accentColor = glassColors.persianGold,
}: CategoryEmptyStateProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";

  // Content based on type
  const content = {
    "no-results": {
      icon: <SearchOffIcon sx={{ fontSize: 64 }} />,
      titleEn: "No Results Found",
      titleFa: "نتیجه‌ای یافت نشد",
      descriptionEn: "No content matches your current filters. Try adjusting your search criteria.",
      descriptionFa: "هیچ محتوایی با این فیلترها یافت نشد. فیلترها را تغییر دهید.",
    },
    "no-content": {
      icon: <ExploreIcon sx={{ fontSize: 64 }} />,
      titleEn: "No Content Available",
      titleFa: "محتوایی موجود نیست",
      descriptionEn: "This category doesn't have any content yet. Check back later!",
      descriptionFa: "این دسته‌بندی هنوز محتوایی ندارد. بعداً سر بزنید!",
    },
    error: {
      icon: <SearchOffIcon sx={{ fontSize: 64 }} />,
      titleEn: "Something Went Wrong",
      titleFa: "خطایی رخ داد",
      descriptionEn: "We couldn't load the content. Please try again later.",
      descriptionFa: "محتوا بارگذاری نشد. لطفاً دوباره تلاش کنید.",
    },
  };

  const { icon, titleEn, titleFa, descriptionEn, descriptionFa } = content[type];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 4,
      }}
    >
      {/* Glass Container */}
      <Box
        sx={{
          maxWidth: 480,
          width: "100%",
          p: 6,
          borderRadius: glassBorderRadius.xxl,
          background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
          border: `1px solid ${glassColors.glass.border}`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
          },
        }}
      >
        {/* Decorative Background */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentColor}10, transparent)`,
            pointerEvents: "none",
          }}
        />

        <Stack spacing={3} sx={{ position: "relative", zIndex: 1 }}>
          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              color: glassColors.text.muted,
              opacity: 0.6,
            }}
          >
            {icon}
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              fontWeight: 700,
              color: glassColors.text.primary,
            }}
          >
            {isRTL ? titleFa : titleEn}
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: "1rem",
              color: glassColors.text.secondary,
              lineHeight: 1.7,
            }}
          >
            {isRTL ? descriptionFa : descriptionEn}
          </Typography>

          {/* Actions */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            {/* Clear Filters Button */}
            {hasActiveFilters && onClearFilters && (
              <Button
                onClick={onClearFilters}
                startIcon={<FilterAltOffIcon />}
                sx={{
                  px: 3,
                  py: 1.25,
                  borderRadius: glassBorderRadius.pill,
                  background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
                  border: `1px solid ${accentColor}`,
                  color: accentColor,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textTransform: "none",
                  transition: glassAnimations.transition.spring,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${accentColor}50, ${accentColor}30)`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 24px -4px ${accentColor}40`,
                  },
                }}
              >
                {isRTL ? "پاک کردن فیلترها" : "Clear Filters"}
              </Button>
            )}

            {/* Browse All Button */}
            <Link href={basePath} style={{ textDecoration: "none" }}>
              <Button
                startIcon={<ExploreIcon />}
                sx={{
                  px: 3,
                  py: 1.25,
                  borderRadius: glassBorderRadius.pill,
                  background: glassColors.glass.base,
                  border: `1px solid ${glassColors.glass.border}`,
                  color: glassColors.text.secondary,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textTransform: "none",
                  transition: glassAnimations.transition.spring,
                  "&:hover": {
                    background: glassColors.glass.mid,
                    color: glassColors.text.primary,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {isRTL ? "مشاهده همه" : "Browse All"}
              </Button>
            </Link>
          </Stack>

          {/* Suggested Genres */}
          {suggestedGenres.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: glassColors.text.muted,
                  mb: 1.5,
                }}
              >
                {isRTL ? "پیشنهادها:" : "Suggestions:"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                {suggestedGenres.map((genre) => (
                  <Link
                    key={genre.slug}
                    href={`${basePath}/${genre.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 0.75,
                        borderRadius: glassBorderRadius.pill,
                        background: glassColors.glass.base,
                        border: `1px solid ${glassColors.glass.border}`,
                        color: glassColors.text.secondary,
                        fontSize: "0.8rem",
                        transition: glassAnimations.transition.spring,
                        cursor: "pointer",
                        "&:hover": {
                          background: `${accentColor}20`,
                          border: `1px solid ${accentColor}60`,
                          color: glassColors.text.primary,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      {isRTL ? genre.nameFa : genre.nameEn}
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export default CategoryEmptyState;
