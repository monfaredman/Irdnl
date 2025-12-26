/**
 * Collection Components
 * 
 * Reusable components for displaying movie collections
 * Premium Liquid Glass design with TMDB integration
 */

"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MovieIcon from "@mui/icons-material/Movie";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarIcon from "@mui/icons-material/Star";
import { Box, Button, Chip, IconButton, Skeleton, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
  glassAnimations,
  glassBlur,
  glassBorderRadius,
  glassColors,
} from "@/theme/glass-design-system";
import type { MappedCollection } from "@/lib/tmdb-service";
import { getCollectionColor } from "@/hooks/useCollections";

// Persian number converter
function toPersianNumber(num: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num).replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

// ============================================================================
// Collection Card Component
// ============================================================================

export interface CollectionCardProps {
  collection: MappedCollection;
  color?: string;
  featured?: boolean;
  watchedCount?: number;
  showProgress?: boolean;
  height?: number | string;
}

export function CollectionCard({
  collection,
  color,
  featured = false,
  watchedCount = 0,
  showProgress = true,
  height,
}: CollectionCardProps) {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const isRTL = language === "fa";

  const cardColor = color || getCollectionColor(collection.id);
  const progress = watchedCount > 0 ? (watchedCount / collection.movieCount) * 100 : 0;
  const hasProgress = watchedCount > 0 && showProgress;

  const t = {
    movies: language === "fa" ? "فیلم" : "movies",
    watched: language === "fa" ? "تماشا شده" : "Watched",
    of: language === "fa" ? "از" : "of",
    continueWatching: language === "fa" ? "ادامه تماشا" : "Continue",
    startWatching: language === "fa" ? "شروع تماشا" : "Start",
  };

  return (
    <Link href={`/collections/${collection.id}`} style={{ textDecoration: "none" }}>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "relative",
          height: height || (featured ? 380 : 320),
          borderRadius: glassBorderRadius.xl,
          overflow: "hidden",
          cursor: "pointer",
          transition: glassAnimations.transition.spring,
          transform: isHovered ? "scale(1.02)" : "scale(1)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${cardColor}60, transparent 50%), 
                        linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)`,
            zIndex: 1,
          },
        }}
      >
        {/* Background */}
        {collection.backdrop ? (
          <Image
            src={collection.backdrop}
            alt={collection.name}
            fill
            style={{
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 0.5,
            }}
          >
            {collection.movies.slice(0, 4).map((movie) => (
              <Box key={movie.id} sx={{ position: "relative", overflow: "hidden" }}>
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Accent Line */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${cardColor}, ${cardColor}80)`,
            zIndex: 3,
          }}
        />

        {/* Glass Border */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            border: `1px solid ${cardColor}40`,
            borderRadius: glassBorderRadius.xl,
            zIndex: 2,
            transition: "border-color 0.3s ease",
            ...(isHovered && { borderColor: `${cardColor}80` }),
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            zIndex: 3,
          }}
        >
          <Typography
            variant={featured ? "h4" : "h5"}
            sx={{
              color: "#fff",
              fontWeight: 800,
              mb: 0.5,
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              lineHeight: 1.2,
            }}
          >
            {collection.name}
          </Typography>

          {collection.timeline && (
            <Typography
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.85rem",
                mb: 1.5,
              }}
            >
              {isRTL ? toPersianNumber(collection.timeline) : collection.timeline}
            </Typography>
          )}

          {/* Stats */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Chip
              icon={<MovieIcon sx={{ fontSize: "0.9rem" }} />}
              label={`${isRTL ? toPersianNumber(collection.movieCount) : collection.movieCount} ${t.movies}`}
              size="small"
              sx={{
                background: `${cardColor}30`,
                color: "#fff",
                border: `1px solid ${cardColor}60`,
                fontWeight: 600,
                "& .MuiChip-icon": { color: "#fff" },
              }}
            />

            {collection.averageRating > 0 && (
              <Chip
                icon={<StarIcon sx={{ fontSize: "0.9rem", color: "#FACC15" }} />}
                label={isRTL ? toPersianNumber(collection.averageRating) : collection.averageRating}
                size="small"
                sx={{
                  background: "rgba(250, 204, 21, 0.2)",
                  color: "#FACC15",
                  border: "1px solid rgba(250, 204, 21, 0.4)",
                  fontWeight: 600,
                }}
              />
            )}
          </Box>

          {/* Progress Bar */}
          {hasProgress && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>
                  {t.watched}: {isRTL ? toPersianNumber(watchedCount) : watchedCount} {t.of}{" "}
                  {isRTL ? toPersianNumber(collection.movieCount) : collection.movieCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 4,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${cardColor}, ${cardColor}CC)`,
                    borderRadius: 2,
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </Box>
          )}

          {/* CTA Button */}
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            sx={{
              background: `linear-gradient(135deg, ${cardColor}, ${cardColor}CC)`,
              color: "#fff",
              borderRadius: glassBorderRadius.lg,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              opacity: isHovered ? 1 : 0.9,
              transition: "all 0.3s ease",
              "&:hover": {
                background: `linear-gradient(135deg, ${cardColor}DD, ${cardColor})`,
                transform: "translateY(-2px)",
              },
            }}
          >
            {hasProgress ? t.continueWatching : t.startWatching}
          </Button>
        </Box>

        {/* Hover Glow */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 100%, ${cardColor}30, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      </Box>
    </Link>
  );
}

// ============================================================================
// Collection Carousel Component
// ============================================================================

export interface CollectionCarouselProps {
  collections: MappedCollection[];
  title?: string;
  loading?: boolean;
  cardWidth?: number;
  showProgress?: boolean;
}

export function CollectionCarousel({
  collections,
  title,
  loading = false,
  cardWidth = 450,
  showProgress = false,
}: CollectionCarouselProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = cardWidth + 24;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ mb: 6 }}>
        {title && (
          <Typography variant="h5" sx={{ color: glassColors.text.primary, fontWeight: 700, mb: 3 }}>
            {title}
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 3, overflowX: "hidden" }}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={cardWidth}
              height={380}
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: glassBorderRadius.xl,
                flexShrink: 0,
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        {title && (
          <Typography variant="h5" sx={{ color: glassColors.text.primary, fontWeight: 700 }}>
            {title}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => scroll(isRTL ? "right" : "left")}
            sx={{
              background: glassColors.glass.strong,
              backdropFilter: glassBlur.light,
              border: `1px solid ${glassColors.glass.border}`,
              color: glassColors.text.primary,
              "&:hover": { background: glassColors.glass.mid },
            }}
          >
            {isRTL ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          <IconButton
            onClick={() => scroll(isRTL ? "left" : "right")}
            sx={{
              background: glassColors.glass.strong,
              backdropFilter: glassBlur.light,
              border: `1px solid ${glassColors.glass.border}`,
              color: glassColors.text.primary,
              "&:hover": { background: glassColors.glass.mid },
            }}
          >
            {isRTL ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          pb: 2,
          mx: -2,
          px: 2,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {collections.map((collection, index) => (
          <Box
            key={collection.id}
            sx={{
              flexShrink: 0,
              width: cardWidth,
              scrollSnapAlign: "start",
            }}
          >
            <CollectionCard
              collection={collection}
              featured
              watchedCount={showProgress ? Math.floor(Math.random() * collection.movieCount) : 0}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ============================================================================
// Collection Grid Component
// ============================================================================

export interface CollectionGridProps {
  collections: MappedCollection[];
  loading?: boolean;
  columns?: { xs?: number; sm?: number; md?: number; lg?: number };
}

export function CollectionGrid({
  collections,
  loading = false,
  columns = { xs: 1, sm: 2, lg: 3 },
}: CollectionGridProps) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: `repeat(${columns.xs || 1}, 1fr)`,
            sm: `repeat(${columns.sm || 2}, 1fr)`,
            md: `repeat(${columns.md || columns.sm || 2}, 1fr)`,
            lg: `repeat(${columns.lg || 3}, 1fr)`,
          },
          gap: 3,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={320}
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              borderRadius: glassBorderRadius.xl,
            }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: `repeat(${columns.xs || 1}, 1fr)`,
          sm: `repeat(${columns.sm || 2}, 1fr)`,
          md: `repeat(${columns.md || columns.sm || 2}, 1fr)`,
          lg: `repeat(${columns.lg || 3}, 1fr)`,
        },
        gap: 3,
      }}
    >
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </Box>
  );
}

export default CollectionCard;
