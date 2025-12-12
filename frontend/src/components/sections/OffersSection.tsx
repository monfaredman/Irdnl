"use client";

import Link from "next/link";
import Image from "next/image";
import { Box, Chip, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import type { Movie, Series } from "@/types/media";
import { useLanguage } from "@/providers/language-provider";
import {
  glassColors,
  glassSpacing,
  glassBorderRadius,
  glassAnimations,
  glassBlur,
} from "@/theme/glass-design-system";

interface OffersSectionProps {
  items: (Movie | Series)[];
}

type ChipType = "dubbed" | "free" | "subtitle";

const getChipLabel = (type: ChipType, language: string): string => {
  const labels = {
    dubbed: language === "fa" ? "دوبله" : "Dubbed",
    free: language === "fa" ? "رایگان" : "Free",
    subtitle: language === "fa" ? "زیرنویس" : "Subtitle",
  };
  return labels[type];
};

const getChipColor = (type: ChipType): string => {
  const colors = {
    dubbed: glassColors.persianGold,
    free: "#10b981",
    subtitle: "#3b82f6",
  };
  return colors[type];
};

/**
 * Offers Section - LiquidGlass Design
 * - 8 cards in 4x2 grid
 * - Each card shows image with chip
 * - Hover reveals: Persian/English name, IMDb score, type info
 */
export const OffersSection = ({ items }: OffersSectionProps) => {
  const { language } = useLanguage();

  // Mock chip assignment (in real app, this would come from item data)
  const getItemChip = (index: number): ChipType => {
    const types: ChipType[] = ["dubbed", "free", "subtitle"];
    return types[index % 3];
  };

  return (
    <Box
      component="section"
      sx={{
        py: `${glassSpacing.xl}px`,
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Grid of 8 cards (4 per row) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        {items.slice(0, 8).map((item, index) => {
          const chipType = getItemChip(index);
          const chipColor = getChipColor(chipType);
          const href = `/${"type" in item ? "series" : "movies"}/${item.slug}`;
          const isSeries = "type" in item;
          
          return (
            <Box
              key={item.id}
              component={Link}
              href={href}
              sx={{
                position: "relative",
                textDecoration: "none",
                color: "inherit",
                borderRadius: glassBorderRadius.lg,
                overflow: "hidden",
                background: glassColors.glass.base,
                backdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
                WebkitBackdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
                border: `1px solid ${glassColors.glass.border}`,
                boxShadow: `
                  0 8px 32px rgba(0, 0, 0, 0.4),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
                transition: glassAnimations.transition.spring,
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: `
                    0 16px 48px rgba(0, 0, 0, 0.6),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15),
                    0 0 0 1px ${glassColors.gold.glow}
                  `,
                  "& .hover-overlay": {
                    opacity: 1,
                  },
                },
              }}
            >
              {/* Image */}
              <Box
                sx={{
                  position: "relative",
                  paddingBottom: "150%",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={item.poster}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw"
                  loading="lazy"
                />

                {/* Chip Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 2,
                  }}
                >
                  <Chip
                    label={getChipLabel(chipType, language)}
                    size="small"
                    sx={{
                      background: `${chipColor}30`,
                      backdropFilter: `blur(${glassBlur.light}px)`,
                      border: `1px solid ${chipColor}60`,
                      color: chipColor,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      boxShadow: `0 4px 16px ${chipColor}40`,
                    }}
                  />
                </Box>

                {/* Hover Overlay with Details */}
                <Box
                  className="hover-overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(
                      to top,
                      ${glassColors.deepMidnight}F5 0%,
                      ${glassColors.deepMidnight}E0 40%,
                      ${glassColors.deepMidnight}80 70%,
                      transparent 100%
                    )`,
                    backdropFilter: `blur(${glassBlur.light}px) saturate(120%)`,
                    opacity: 0,
                    transition: glassAnimations.transition.smooth,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    p: 2,
                  }}
                >
                  {/* Persian Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: glassColors.text.primary,
                      fontSize: "1rem",
                      mb: 0.5,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* English Title (if different) */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: glassColors.text.secondary,
                      fontSize: "0.875rem",
                      mb: 1,
                    }}
                  >
                    {item.slug.replace(/-/g, " ")}
                  </Typography>

                  {/* IMDb Score */}
                  {"rating" in item && item.rating && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <StarIcon
                        sx={{
                          fontSize: "1rem",
                          color: glassColors.persianGold,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: glassColors.text.primary,
                        }}
                      >
                        {item.rating}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: glassColors.text.tertiary,
                          ml: 0.5,
                        }}
                      >
                        IMDb
                      </Typography>
                    </Box>
                  )}

                  {/* Type-specific Info */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: glassColors.text.secondary,
                      fontSize: "0.75rem",
                    }}
                  >
                    {isSeries
                      ? `${language === "fa" ? "سریال" : "Series"} • ${
                          (item as Series).seasons || 1
                        } ${language === "fa" ? "فصل" : "Season${(item as Series).seasons > 1 ? 's' : ''}"}`
                      : `${language === "fa" ? "فیلم" : "Movie"} • ${
                          (item as Movie).year || "2024"
                        }`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
