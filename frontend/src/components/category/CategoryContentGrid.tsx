"use client";

/**
 * CategoryContentGrid Component
 * 
 * Premium Liquid Glass content display for category pages
 * Features: Grid/List views, glass cards, hover effects, quick actions, loading shimmer
 */

import { useState, useCallback } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Skeleton,
  Tooltip,
  Fade,
  Grow,
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
import type { ContentItem, ViewMode } from "@/types/category";
import type { Movie, Series } from "@/types/media";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import { RatingBadge } from "@/components/interactive/RatingBadge";
import { WatchlistButton } from "@/components/interactive/WatchlistButton";

interface CategoryContentGridProps {
  items: ContentItem[];
  viewMode: ViewMode;
  loading?: boolean;
  accentColor?: string;
  onItemClick?: (item: ContentItem) => void;
  onQuickPreview?: (item: ContentItem) => void;
}

// Loading skeleton count
const SKELETON_COUNT = 12;

export function CategoryContentGrid({
  items,
  viewMode,
  loading = false,
  accentColor = glassColors.persianGold,
  onItemClick,
  onQuickPreview,
}: CategoryContentGridProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";

  // Show skeletons while loading
  if (loading) {
    return viewMode === "grid" ? (
      <GridLoadingSkeleton accentColor={accentColor} />
    ) : (
      <ListLoadingSkeleton accentColor={accentColor} />
    );
  }

  return viewMode === "grid" ? (
    <GridView 
      items={items} 
      accentColor={accentColor}
      isRTL={isRTL}
      onItemClick={onItemClick}
      onQuickPreview={onQuickPreview}
    />
  ) : (
    <ListView 
      items={items} 
      accentColor={accentColor}
      isRTL={isRTL}
      onItemClick={onItemClick}
      onQuickPreview={onQuickPreview}
    />
  );
}

// ============================================================================
// GRID VIEW
// ============================================================================

interface ViewProps {
  items: ContentItem[];
  accentColor: string;
  isRTL: boolean;
  onItemClick?: (item: ContentItem) => void;
  onQuickPreview?: (item: ContentItem) => void;
}

function GridView({ items, accentColor, isRTL, onItemClick, onQuickPreview }: ViewProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(5, 1fr)",
        },
        gap: { xs: 2, md: 3 },
      }}
    >
      {items.map((item, index) => (
        <Grow in key={item.id} timeout={300 + index * 50}>
          <Box>
            <GridCard 
              item={item} 
              accentColor={accentColor}
              isRTL={isRTL}
              onItemClick={onItemClick}
              onQuickPreview={onQuickPreview}
            />
          </Box>
        </Grow>
      ))}
    </Box>
  );
}

interface GridCardProps {
  item: ContentItem;
  accentColor: string;
  isRTL: boolean;
  onItemClick?: (item: ContentItem) => void;
  onQuickPreview?: (item: ContentItem) => void;
}

function GridCard({ item, accentColor, isRTL, onItemClick, onQuickPreview }: GridCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const href = item.itemType === "movie" 
    ? `/movies/${item.slug}` 
    : `/series/${item.slug}`;

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: glassBorderRadius.lg,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
        backdropFilter: `blur(${glassBlur.medium})`,
        border: `1px solid ${glassColors.glass.border}`,
        transition: glassAnimations.transition.spring,
        cursor: "pointer",
        aspectRatio: "2/3",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          border: `1px solid ${accentColor}60`,
          boxShadow: `
            0 20px 40px -8px rgba(0, 0, 0, 0.5),
            0 0 30px ${accentColor}20,
            inset 0 1px 0 0 rgba(255, 255, 255, 0.15)
          `,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <Link href={href} style={{ textDecoration: "none" }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={item.poster || "/images/placeholder-poster.jpg"}
            alt={item.title}
            fill
            style={{
              objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: isHovered ? "scale(1.08)" : "scale(1)",
            }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />

          {/* Liquid Shine Effect */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "50%",
              height: "100%",
              background: `linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.1),
                transparent
              )`,
              transform: "skewX(-25deg)",
              transition: "left 0.6s ease",
              ...(isHovered && {
                left: "200%",
              }),
            }}
          />

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(
                180deg,
                transparent 30%,
                rgba(0, 0, 0, 0.4) 70%,
                rgba(0, 0, 0, 0.85) 100%
              )`,
              opacity: isHovered ? 1 : 0.7,
              transition: glassAnimations.transition.smooth,
            }}
          />
        </Box>
      </Link>

      {/* Rating Badge */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: isRTL ? "auto" : 12,
          right: isRTL ? 12 : "auto",
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: glassBorderRadius.pill,
            background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
            backdropFilter: "blur(8px)",
            border: `1px solid ${glassColors.glass.border}`,
          }}
        >
          <StarIcon sx={{ fontSize: 14, color: accentColor }} />
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: glassColors.text.primary }}>
            {item.rating.toFixed(1)}
          </Typography>
        </Box>
      </Box>

      {/* Type Badge */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: isRTL ? "auto" : 12,
          left: isRTL ? 12 : "auto",
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            p: 0.75,
            borderRadius: glassBorderRadius.md,
            background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
            backdropFilter: "blur(8px)",
            border: `1px solid ${glassColors.glass.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {item.itemType === "movie" ? (
            <MovieIcon sx={{ fontSize: 14, color: glassColors.text.secondary }} />
          ) : (
            <TvIcon sx={{ fontSize: 14, color: glassColors.text.secondary }} />
          )}
        </Box>
      </Box>

      {/* Content Info Overlay */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          zIndex: 10,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: glassColors.text.primary,
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          {item.title}
        </Typography>

        {/* Year */}
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: glassColors.text.secondary,
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          {item.year}
        </Typography>
      </Box>

      {/* Hover Actions */}
      <Fade in={isHovered}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            gap: 1,
            zIndex: 20,
          }}
        >
          {/* Play Button */}
          <Link href={href}>
            <IconButton
              sx={{
                width: 48,
                height: 48,
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
                border: `2px solid ${accentColor}`,
                color: glassColors.deepMidnight,
                transition: glassAnimations.transition.spring,
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: `0 0 30px ${accentColor}60`,
                },
              }}
            >
              <PlayArrowIcon />
            </IconButton>
          </Link>

          {/* Bookmark Button */}
          <Box
            sx={{
              "& button": {
                minWidth: 40,
                width: 40,
                height: 40,
                p: 0,
                background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
                backdropFilter: "blur(8px)",
                border: `1px solid ${glassColors.glass.border}`,
                color: glassColors.text.primary,
                transition: glassAnimations.transition.spring,
                "&:hover": {
                  background: glassColors.glass.strong,
                  border: `1px solid ${accentColor}60`,
                },
              },
            }}
          >
            <WatchlistButton
              mediaId={item.id}
              payload={{
                id: item.id,
                slug: item.slug,
                poster: item.poster,
                title: item.title,
                type: item.itemType,
              }}
            />
          </Box>

          {/* Quick Preview Button */}
          {onQuickPreview && (
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickPreview(item);
              }}
              sx={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
                backdropFilter: "blur(8px)",
                border: `1px solid ${glassColors.glass.border}`,
                color: glassColors.text.primary,
                transition: glassAnimations.transition.spring,
                "&:hover": {
                  background: glassColors.glass.strong,
                  border: `1px solid ${accentColor}60`,
                },
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Fade>
    </Box>
  );
}

// ============================================================================
// LIST VIEW
// ============================================================================

function ListView({ items, accentColor, isRTL, onItemClick, onQuickPreview }: ViewProps) {
  return (
    <Stack spacing={2}>
      {items.map((item, index) => (
        <Grow in key={item.id} timeout={200 + index * 30}>
          <Box>
            <ListCard 
              item={item} 
              accentColor={accentColor}
              isRTL={isRTL}
              onItemClick={onItemClick}
              onQuickPreview={onQuickPreview}
            />
          </Box>
        </Grow>
      ))}
    </Stack>
  );
}

function ListCard({ item, accentColor, isRTL, onItemClick, onQuickPreview }: GridCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const href = item.itemType === "movie" 
    ? `/movies/${item.slug}` 
    : `/series/${item.slug}`;

  // Get duration or episode count
  const duration = item.itemType === "movie" 
    ? (item as Movie).duration 
    : (item as Series).seasons?.reduce((acc, s) => acc + s.episodes?.length || 0, 0) || 0;

  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 2, md: 3 },
        p: 2,
        borderRadius: glassBorderRadius.lg,
        background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
        backdropFilter: `blur(${glassBlur.medium})`,
        border: `1px solid ${glassColors.glass.border}`,
        transition: glassAnimations.transition.spring,
        cursor: "pointer",
        "&:hover": {
          transform: "translateX(4px)",
          border: `1px solid ${accentColor}40`,
          boxShadow: `0 8px 32px -8px rgba(0, 0, 0, 0.4), 0 0 20px ${accentColor}10`,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster */}
      <Link href={href} style={{ textDecoration: "none", flexShrink: 0 }}>
        <Box
          sx={{
            position: "relative",
            width: { xs: 80, sm: 100, md: 120 },
            height: { xs: 120, sm: 150, md: 180 },
            borderRadius: glassBorderRadius.md,
            overflow: "hidden",
            border: `1px solid ${glassColors.glass.border}`,
          }}
        >
          <Image
            src={item.poster || "/images/placeholder-poster.jpg"}
            alt={item.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="120px"
          />
        </Box>
      </Link>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0, py: 1 }}>
        <Stack spacing={1}>
          {/* Title & Type Badge */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, flexWrap: "wrap" }}>
            <Link href={href} style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  fontWeight: 600,
                  color: glassColors.text.primary,
                  transition: glassAnimations.transition.spring,
                  "&:hover": {
                    color: accentColor,
                  },
                }}
              >
                {item.title}
              </Typography>
            </Link>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: glassBorderRadius.sm,
                background: glassColors.glass.base,
                border: `1px solid ${glassColors.glass.border}`,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {item.itemType === "movie" ? (
                <MovieIcon sx={{ fontSize: 12, color: glassColors.text.tertiary }} />
              ) : (
                <TvIcon sx={{ fontSize: 12, color: glassColors.text.tertiary }} />
              )}
              <Typography sx={{ fontSize: "0.65rem", color: glassColors.text.tertiary }}>
                {isRTL 
                  ? (item.itemType === "movie" ? "فیلم" : "سریال")
                  : (item.itemType === "movie" ? "Movie" : "Series")
                }
              </Typography>
            </Box>
          </Box>

          {/* Meta Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: accentColor }} />
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: glassColors.text.primary }}>
                {item.rating.toFixed(1)}
              </Typography>
            </Box>

            {/* Year */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: glassColors.text.tertiary }} />
              <Typography sx={{ fontSize: "0.8rem", color: glassColors.text.secondary }}>
                {item.year}
              </Typography>
            </Box>

            {/* Duration/Episodes */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: glassColors.text.tertiary }} />
              <Typography sx={{ fontSize: "0.8rem", color: glassColors.text.secondary }}>
                {item.itemType === "movie"
                  ? `${Math.floor(duration / 60)}h ${duration % 60}m`
                  : (isRTL ? `${duration} قسمت` : `${duration} episodes`)
                }
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: glassColors.text.secondary,
              lineHeight: 1.6,
              display: { xs: "none", sm: "-webkit-box" },
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.description}
          </Typography>

          {/* Genres */}
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: "auto" }}>
            {item.genres?.slice(0, 3).map((genre) => (
              <Box
                key={genre}
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: glassBorderRadius.sm,
                  background: glassColors.glass.base,
                  border: `1px solid ${glassColors.glass.border}`,
                  fontSize: "0.7rem",
                  color: glassColors.text.tertiary,
                  textTransform: "capitalize",
                }}
              >
                {genre}
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateX(0)" : `translateX(${isRTL ? "-" : ""}10px)`,
          transition: glassAnimations.transition.spring,
        }}
      >
        <Link href={href}>
          <IconButton
            sx={{
              width: 44,
              height: 44,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
              border: `2px solid ${accentColor}`,
              color: glassColors.deepMidnight,
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <PlayArrowIcon />
          </IconButton>
        </Link>
        <Box
          sx={{
            "& button": {
              minWidth: 36,
              width: 36,
              height: 36,
              p: 0,
              background: glassColors.glass.base,
              border: `1px solid ${glassColors.glass.border}`,
              color: glassColors.text.primary,
            },
          }}
        >
          <WatchlistButton
            mediaId={item.id}
            payload={{
              id: item.id,
              slug: item.slug,
              poster: item.poster,
              title: item.title,
              type: item.itemType,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

// ============================================================================
// LOADING SKELETONS
// ============================================================================

function GridLoadingSkeleton({ accentColor }: { accentColor: string }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(5, 1fr)",
        },
        gap: { xs: 2, md: 3 },
      }}
    >
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Box
          key={index}
          sx={{
            aspectRatio: "2/3",
            borderRadius: glassBorderRadius.lg,
            background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
            border: `1px solid ${glassColors.glass.border}`,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: glassColors.glass.mid,
              "&::after": {
                background: `linear-gradient(90deg, transparent, ${accentColor}10, transparent)`,
              },
            }}
          />
          <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2 }}>
            <Skeleton variant="text" width="80%" sx={{ bgcolor: glassColors.glass.strong }} />
            <Skeleton variant="text" width="40%" sx={{ bgcolor: glassColors.glass.strong }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function ListLoadingSkeleton({ accentColor }: { accentColor: string }) {
  return (
    <Stack spacing={2}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            gap: 3,
            p: 2,
            borderRadius: glassBorderRadius.lg,
            background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
            border: `1px solid ${glassColors.glass.border}`,
          }}
        >
          <Skeleton
            variant="rectangular"
            width={120}
            height={180}
            sx={{
              borderRadius: glassBorderRadius.md,
              bgcolor: glassColors.glass.mid,
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1, py: 1 }}>
            <Skeleton variant="text" width="60%" height={28} sx={{ bgcolor: glassColors.glass.strong }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: glassColors.glass.mid, mt: 1 }} />
            <Skeleton variant="text" width="100%" height={16} sx={{ bgcolor: glassColors.glass.mid, mt: 2 }} />
            <Skeleton variant="text" width="80%" height={16} sx={{ bgcolor: glassColors.glass.mid }} />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

export default CategoryContentGrid;
