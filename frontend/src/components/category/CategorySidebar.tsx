"use client";

/**
 * CategorySidebar Component
 * 
 * Premium Liquid Glass sidebar for category pages
 * Features: Trending carousel, upcoming releases, related genres, top stars
 */

import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Skeleton,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";
import {
  glassBlur,
  glassBorderRadius,
  glassColors,
  glassAnimations,
} from "@/theme/glass-design-system";
import type { SidebarData, TrendingItem, UpcomingItem, RelatedGenre, TopStar } from "@/types/category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface CategorySidebarProps {
  data: SidebarData | null;
  loading?: boolean;
  accentColor?: string;
  basePath?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function CategorySidebar({
  data,
  loading = false,
  accentColor = glassColors.persianGold,
  basePath = "/",
  mobileOpen = false,
  onMobileClose,
}: CategorySidebarProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const sidebarContent = (
    <Stack spacing={4}>
      {/* Trending Section */}
      <SidebarSection
        title={isRTL ? "پرطرفدار" : "Trending"}
        icon={<TrendingUpIcon />}
        accentColor={accentColor}
      >
        {loading ? (
          <TrendingLoadingSkeleton />
        ) : data?.trending && data.trending.length > 0 ? (
          <TrendingCarousel items={data.trending} accentColor={accentColor} isRTL={isRTL} />
        ) : (
          <EmptySection message={isRTL ? "محتوایی یافت نشد" : "No content found"} />
        )}
      </SidebarSection>

      {/* Upcoming Releases */}
      <SidebarSection
        title={isRTL ? "به زودی" : "Coming Soon"}
        icon={<ScheduleIcon />}
        accentColor={accentColor}
      >
        {loading ? (
          <UpcomingLoadingSkeleton />
        ) : data?.upcoming && data.upcoming.length > 0 ? (
          <UpcomingList items={data.upcoming} accentColor={accentColor} isRTL={isRTL} />
        ) : (
          <EmptySection message={isRTL ? "محتوایی یافت نشد" : "No upcoming content"} />
        )}
      </SidebarSection>

      {/* Related Genres */}
      <SidebarSection
        title={isRTL ? "ژانرهای مرتبط" : "Related Genres"}
        icon={<LocalOfferIcon />}
        accentColor={accentColor}
      >
        {loading ? (
          <GenresLoadingSkeleton />
        ) : data?.relatedGenres && data.relatedGenres.length > 0 ? (
          <GenreCloud genres={data.relatedGenres} basePath={basePath} accentColor={accentColor} isRTL={isRTL} />
        ) : (
          <EmptySection message={isRTL ? "ژانری یافت نشد" : "No genres found"} />
        )}
      </SidebarSection>

      {/* Top Stars */}
      <SidebarSection
        title={isRTL ? "ستاره‌های برتر" : "Top Stars"}
        icon={<StarIcon />}
        accentColor={accentColor}
      >
        {loading ? (
          <StarsLoadingSkeleton />
        ) : data?.topStars && data.topStars.length > 0 ? (
          <TopStarsList stars={data.topStars} accentColor={accentColor} isRTL={isRTL} />
        ) : (
          <EmptySection message={isRTL ? "بازیگری یافت نشد" : "No stars found"} />
        )}
      </SidebarSection>
    </Stack>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <Drawer
        anchor={isRTL ? "left" : "right"}
        open={mobileOpen}
        onClose={onMobileClose}
        PaperProps={{
          sx: {
            width: 320,
            maxWidth: "85vw",
            background: glassColors.deepMidnight,
            backdropFilter: `blur(${glassBlur.strong})`,
            borderLeft: isRTL ? "none" : `1px solid ${glassColors.glass.border}`,
            borderRight: isRTL ? `1px solid ${glassColors.glass.border}` : "none",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Close Button */}
          <Box sx={{ display: "flex", justifyContent: isRTL ? "flex-start" : "flex-end", mb: 2 }}>
            <IconButton
              onClick={onMobileClose}
              sx={{
                color: glassColors.text.secondary,
                "&:hover": { color: glassColors.text.primary },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {sidebarContent}
        </Box>
      </Drawer>
    );
  }

  // Desktop sidebar
  return (
    <Box
      sx={{
        width: 320,
        flexShrink: 0,
        display: { xs: "none", lg: "block" },
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 100,
          p: 3,
          borderRadius: glassBorderRadius.xl,
          background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
          backdropFilter: `blur(${glassBlur.medium})`,
          border: `1px solid ${glassColors.glass.border}`,
        }}
      >
        {sidebarContent}
      </Box>
    </Box>
  );
}

// ============================================================================
// SECTION WRAPPER
// ============================================================================

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  children: React.ReactNode;
}

function SidebarSection({ title, icon, accentColor, children }: SidebarSectionProps) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 2,
          pb: 1.5,
          borderBottom: `1px solid ${glassColors.glass.border}`,
        }}
      >
        <Box
          sx={{
            p: 0.75,
            borderRadius: glassBorderRadius.md,
            background: `${accentColor}20`,
            color: accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& svg": { fontSize: 18 },
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: glassColors.text.primary,
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}

// ============================================================================
// TRENDING CAROUSEL
// ============================================================================

interface TrendingCarouselProps {
  items: TrendingItem[];
  accentColor: string;
  isRTL: boolean;
}

function TrendingCarousel({ items, accentColor, isRTL }: TrendingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleItems = items.slice(currentIndex, currentIndex + 3);
  const canGoNext = currentIndex + 3 < items.length;
  const canGoPrev = currentIndex > 0;

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
        {visibleItems.map((item, index) => (
          <Link
            key={item.id}
            href={`/${item.type === "movie" ? "movies" : "series"}/${item.id}`}
            style={{ textDecoration: "none", flex: 1 }}
          >
            <Box
              sx={{
                position: "relative",
                aspectRatio: "2/3",
                borderRadius: glassBorderRadius.md,
                overflow: "hidden",
                border: `1px solid ${glassColors.glass.border}`,
                transition: glassAnimations.transition.spring,
                "&:hover": {
                  transform: "scale(1.05)",
                  border: `1px solid ${accentColor}60`,
                  boxShadow: `0 8px 24px -4px rgba(0,0,0,0.4)`,
                },
              }}
            >
              <Image
                src={item.poster || "/images/placeholder-poster.jpg"}
                alt={item.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="100px"
              />
              {/* Rating */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 4,
                  left: 4,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: glassBorderRadius.sm,
                  background: `${glassColors.deepMidnight}CC`,
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                <StarIcon sx={{ fontSize: 10, color: accentColor }} />
                <Typography sx={{ fontSize: "0.6rem", color: glassColors.text.primary }}>
                  {(Number(item.rating) || 0).toFixed(1)}
                </Typography>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>

      {/* Navigation */}
      {items.length > 3 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={!canGoPrev}
            sx={{
              width: 28,
              height: 28,
              background: glassColors.glass.base,
              border: `1px solid ${glassColors.glass.border}`,
              color: glassColors.text.secondary,
              "&:disabled": { opacity: 0.3 },
            }}
          >
            {isRTL ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setCurrentIndex(Math.min(items.length - 3, currentIndex + 1))}
            disabled={!canGoNext}
            sx={{
              width: 28,
              height: 28,
              background: glassColors.glass.base,
              border: `1px solid ${glassColors.glass.border}`,
              color: glassColors.text.secondary,
              "&:disabled": { opacity: 0.3 },
            }}
          >
            {isRTL ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

// ============================================================================
// UPCOMING LIST
// ============================================================================

interface UpcomingListProps {
  items: UpcomingItem[];
  accentColor: string;
  isRTL: boolean;
}

function UpcomingList({ items, accentColor, isRTL }: UpcomingListProps) {
  return (
    <Stack spacing={1.5}>
      {items.slice(0, 4).map((item) => (
        <Link
          key={item.id}
          href={`/${item.type === "movie" ? "movies" : "series"}/${item.id}`}
          style={{ textDecoration: "none" }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              p: 1,
              borderRadius: glassBorderRadius.md,
              transition: glassAnimations.transition.spring,
              "&:hover": {
                background: glassColors.glass.base,
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 50,
                height: 75,
                borderRadius: glassBorderRadius.sm,
                overflow: "hidden",
                flexShrink: 0,
                filter: "blur(2px) brightness(0.8)",
              }}
            >
              <Image
                src={item.poster || "/images/placeholder-poster.jpg"}
                alt={item.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="50px"
              />
              {/* Coming Soon Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `${glassColors.deepMidnight}80`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ScheduleIcon sx={{ fontSize: 16, color: accentColor }} />
              </Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: glassColors.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {isRTL && item.titleFa ? item.titleFa : item.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  color: accentColor,
                  mt: 0.5,
                }}
              >
                {new Date(item.releaseDate).toLocaleDateString(isRTL ? "fa-IR" : "en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </Box>
        </Link>
      ))}
    </Stack>
  );
}

// ============================================================================
// GENRE CLOUD
// ============================================================================

interface GenreCloudProps {
  genres: RelatedGenre[];
  basePath: string;
  accentColor: string;
  isRTL: boolean;
}

function GenreCloud({ genres, basePath, accentColor, isRTL }: GenreCloudProps) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {genres.map((genre) => (
        <Link
          key={genre.slug}
          href={`${basePath}/${genre.slug}`}
          style={{ textDecoration: "none" }}
        >
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: glassBorderRadius.pill,
              background: glassColors.glass.base,
              border: `1px solid ${glassColors.glass.border}`,
              transition: glassAnimations.transition.spring,
              cursor: "pointer",
              "&:hover": {
                background: `${accentColor}20`,
                border: `1px solid ${accentColor}60`,
                transform: "translateY(-2px)",
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: "0.75rem",
                color: glassColors.text.secondary,
                "&:hover": { color: glassColors.text.primary },
              }}
            >
              {isRTL ? genre.nameFa : genre.nameEn}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: "0.6rem",
                color: glassColors.text.muted,
                ml: 0.75,
              }}
            >
              ({genre.count})
            </Typography>
          </Box>
        </Link>
      ))}
    </Box>
  );
}

// ============================================================================
// TOP STARS LIST
// ============================================================================

interface TopStarsListProps {
  stars: TopStar[];
  accentColor: string;
  isRTL: boolean;
}

function TopStarsList({ stars, accentColor, isRTL }: TopStarsListProps) {
  return (
    <Stack spacing={1.5}>
      {stars.slice(0, 5).map((star) => (
        <Link
          key={star.id}
          href={`/cast/${star.id}`}
          style={{ textDecoration: "none" }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              p: 1,
              borderRadius: glassBorderRadius.md,
              transition: glassAnimations.transition.spring,
              "&:hover": {
                background: glassColors.glass.base,
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 40,
                height: 40,
                borderRadius: glassBorderRadius.circle,
                overflow: "hidden",
                border: `2px solid ${glassColors.glass.border}`,
                flexShrink: 0,
              }}
            >
              <Image
                src={star.photo || "/images/avatars/default.jpg"}
                alt={star.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="40px"
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: glassColors.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {isRTL && star.nameFa ? star.nameFa : star.name}
              </Typography>
              {star.knownFor && star.knownFor.length > 0 && (
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    color: glassColors.text.tertiary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {star.knownFor.slice(0, 2).join(", ")}
                </Typography>
              )}
            </Box>
          </Box>
        </Link>
      ))}
    </Stack>
  );
}

// ============================================================================
// EMPTY SECTION
// ============================================================================

function EmptySection({ message }: { message: string }) {
  return (
    <Box
      sx={{
        py: 3,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.8rem",
          color: glassColors.text.muted,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}

// ============================================================================
// LOADING SKELETONS
// ============================================================================

function TrendingLoadingSkeleton() {
  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          sx={{
            flex: 1,
            aspectRatio: "2/3",
            borderRadius: glassBorderRadius.md,
            bgcolor: glassColors.glass.mid,
          }}
        />
      ))}
    </Box>
  );
}

function UpcomingLoadingSkeleton() {
  return (
    <Stack spacing={1.5}>
      {[1, 2, 3, 4].map((i) => (
        <Box key={i} sx={{ display: "flex", gap: 1.5, p: 1 }}>
          <Skeleton
            variant="rectangular"
            width={50}
            height={75}
            sx={{ borderRadius: glassBorderRadius.sm, bgcolor: glassColors.glass.mid }}
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" sx={{ bgcolor: glassColors.glass.mid }} />
            <Skeleton variant="text" width="50%" sx={{ bgcolor: glassColors.glass.mid }} />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

function GenresLoadingSkeleton() {
  // Use fixed widths instead of Math.random() to avoid hydration errors
  const skeletonWidths = [85, 72, 93, 78, 88, 75];
  
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {skeletonWidths.map((width, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width={width}
          height={28}
          sx={{ borderRadius: glassBorderRadius.pill, bgcolor: glassColors.glass.mid }}
        />
      ))}
    </Box>
  );
}

function StarsLoadingSkeleton() {
  return (
    <Stack spacing={1.5}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "center", p: 1 }}>
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            sx={{ bgcolor: glassColors.glass.mid }}
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" sx={{ bgcolor: glassColors.glass.mid }} />
            <Skeleton variant="text" width="50%" sx={{ bgcolor: glassColors.glass.mid }} />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

export default CategorySidebar;
