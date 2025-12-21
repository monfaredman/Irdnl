"use client";

/**
 * CategoryHero Component
 * 
 * Premium Liquid Glass hero header for category pages
 * Features: Dynamic gradient background, glass effects, breadcrumbs, Persian/English titles
 */

import { Box, Stack, Typography, Chip, IconButton } from "@mui/material";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";
import {
  glassBlur,
  glassBorderRadius,
  glassColors,
  glassAnimations,
} from "@/theme/glass-design-system";
import type { BreadcrumbItem, CategoryConfig, SubGenre } from "@/types/category";
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface CategoryHeroProps {
  config: CategoryConfig;
  breadcrumbs: BreadcrumbItem[];
  currentSubGenre?: SubGenre;
  totalResults?: number;
}

export function CategoryHero({ 
  config, 
  breadcrumbs, 
  currentSubGenre,
  totalResults 
}: CategoryHeroProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";
  
  const title = currentSubGenre 
    ? (isRTL ? currentSubGenre.nameFa : currentSubGenre.nameEn)
    : (isRTL ? config.titleFa : config.titleEn);
    
  const subtitle = currentSubGenre
    ? (isRTL ? config.titleFa : config.titleEn)
    : (isRTL ? config.titleEn : config.titleFa);

  const description = isRTL ? config.descriptionFa : config.descriptionEn;
  
  const [gradientStart, gradientEnd] = config.gradientColors;

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: glassBorderRadius.xxl,
        background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
        backdropFilter: `blur(${glassBlur.medium})`,
        border: `1px solid ${glassColors.glass.border}`,
        p: { xs: 3, sm: 4, md: 6 },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${gradientStart}20, ${gradientEnd}10, transparent)`,
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${gradientStart}, ${gradientEnd}, transparent)`,
        },
      }}
    >
      {/* Decorative Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: isRTL ? "auto" : 0,
          left: isRTL ? 0 : "auto",
          width: "40%",
          height: "100%",
          opacity: 0.05,
          background: `radial-gradient(circle at ${isRTL ? "0%" : "100%"} 50%, ${gradientStart}, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <Stack spacing={3} sx={{ position: "relative", zIndex: 1 }}>
        {/* Breadcrumbs */}
        <Box
          component="nav"
          aria-label="breadcrumb"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {breadcrumbs.map((item, index) => (
            <Box
              key={item.href}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {index === 0 ? (
                <Link href={item.href} style={{ textDecoration: "none" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: glassBorderRadius.pill,
                      background: glassColors.glass.base,
                      border: `1px solid ${glassColors.glass.border}`,
                      transition: glassAnimations.transition.spring,
                      cursor: "pointer",
                      "&:hover": {
                        background: glassColors.glass.mid,
                        border: `1px solid ${glassColors.gold.light}`,
                      },
                    }}
                  >
                    <HomeIcon sx={{ fontSize: 16, color: glassColors.text.secondary }} />
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: glassColors.text.secondary,
                        fontWeight: 500,
                      }}
                    >
                      {isRTL ? item.labelFa : item.label}
                    </Typography>
                  </Box>
                </Link>
              ) : (
                <Link href={item.href} style={{ textDecoration: "none" }}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: glassBorderRadius.pill,
                      background: item.isActive ? glassColors.gold.lighter : glassColors.glass.base,
                      border: `1px solid ${item.isActive ? glassColors.gold.light : glassColors.glass.border}`,
                      transition: glassAnimations.transition.spring,
                      cursor: item.isActive ? "default" : "pointer",
                      "&:hover": item.isActive ? {} : {
                        background: glassColors.glass.mid,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: item.isActive ? glassColors.persianGold : glassColors.text.secondary,
                        fontWeight: item.isActive ? 600 : 500,
                      }}
                    >
                      {isRTL ? item.labelFa : item.label}
                    </Typography>
                  </Box>
                </Link>
              )}
              {index < breadcrumbs.length - 1 && (
                isRTL ? (
                  <ChevronLeftIcon sx={{ fontSize: 16, color: glassColors.text.muted }} />
                ) : (
                  <ChevronRightIcon sx={{ fontSize: 16, color: glassColors.text.muted }} />
                )
              )}
            </Box>
          ))}
        </Box>

        {/* Title Section */}
        <Box>
          {/* Category Label */}
          <Typography
            variant="overline"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: gradientStart,
              textTransform: "uppercase",
              mb: 1,
              display: "block",
            }}
          >
            {isRTL ? "دسته‌بندی" : "Category"}
          </Typography>

          {/* Main Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 1.5,
              background: `linear-gradient(135deg, ${glassColors.text.primary}, ${gradientStart})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `0 4px 24px ${gradientStart}30`,
            }}
          >
            {title}
          </Typography>

          {/* Subtitle Badge */}
          <Chip
            label={subtitle}
            size="small"
            sx={{
              background: glassColors.glass.base,
              backdropFilter: "blur(8px)",
              border: `1px solid ${glassColors.glass.border}`,
              borderRadius: glassBorderRadius.pill,
              color: glassColors.text.secondary,
              fontSize: "0.8rem",
              fontWeight: 500,
              mb: 2,
            }}
          />

          {/* Description */}
          <Typography
            sx={{
              color: glassColors.text.secondary,
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.7,
              maxWidth: 600,
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* Sub-genres Pills (if available) */}
        {config.subGenres && config.subGenres.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mt: 2,
            }}
          >
            {config.subGenres.map((genre) => {
              const isActive = currentSubGenre?.slug === genre.slug;
              return (
                <Link
                  key={genre.slug}
                  href={`${getBreadcrumbBase(breadcrumbs)}/${genre.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <Chip
                    label={isRTL ? genre.nameFa : genre.nameEn}
                    size="small"
                    sx={{
                      background: isActive 
                        ? `linear-gradient(135deg, ${gradientStart}40, ${gradientEnd}30)`
                        : glassColors.glass.base,
                      backdropFilter: "blur(8px)",
                      border: `1px solid ${isActive ? gradientStart : glassColors.glass.border}`,
                      borderRadius: glassBorderRadius.pill,
                      color: isActive ? glassColors.text.primary : glassColors.text.secondary,
                      fontSize: "0.8rem",
                      fontWeight: isActive ? 600 : 500,
                      cursor: "pointer",
                      transition: glassAnimations.transition.spring,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${gradientStart}20, ${gradientEnd}15)`,
                        border: `1px solid ${gradientStart}80`,
                        transform: "translateY(-2px)",
                      },
                    }}
                  />
                </Link>
              );
            })}
          </Box>
        )}

        {/* Results Count */}
        {totalResults !== undefined && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
                boxShadow: `0 0 12px ${gradientStart}60`,
              }}
            />
            <Typography
              sx={{
                color: glassColors.text.tertiary,
                fontSize: "0.875rem",
              }}
            >
              {isRTL 
                ? `${totalResults.toLocaleString("fa-IR")} نتیجه`
                : `${totalResults.toLocaleString()} results`
              }
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

// Helper function to get base path from breadcrumbs
function getBreadcrumbBase(breadcrumbs: BreadcrumbItem[]): string {
  if (breadcrumbs.length >= 2) {
    return breadcrumbs[breadcrumbs.length - 1].href;
  }
  return "/";
}

export default CategoryHero;
