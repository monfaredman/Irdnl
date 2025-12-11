"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Chip, Typography, IconButton, Tooltip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import type { Movie, Series } from "@/types/media";
import { useLanguage } from "@/providers/language-provider";
import {
  glassColors,
  glassSpacing,
  glassBorderRadius,
  glassAnimations,
  glassBlur,
} from "@/theme/glass-design-system";

interface GridOffersSectionProps {
  items: (Movie | Series)[];
}

type ChipType = "dubbed" | "free" | "subtitle";

interface GridItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

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

// Generate random layout with varying sizes for 11 items
const generateRandomLayout = (): GridItem[] => {
  const layouts: GridItem[] = [];
  const sizes = [
    { w: 2, h: 2 }, // Large square
    { w: 1, h: 2 }, // Tall rectangle
    { w: 2, h: 1 }, // Wide rectangle
    { w: 1, h: 1 }, // Small square
  ];

  let currentY = 0;
  let currentX = 0;

  for (let i = 0; i < 11; i++) {
    // Randomly select a size variant
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    
    // Ensure we don't exceed column boundaries
    if (currentX + size.w > 4) {
      currentX = 0;
      currentY += 1;
    }

    layouts.push({
      id: `item-${i}`,
      x: currentX,
      y: currentY,
      w: size.w,
      h: size.h,
    });

    currentX += size.w;
  }

  return layouts;
};

// Storage key for persisting layout
const STORAGE_KEY = "gridOffersLayout";

/**
 * Grid Offers Section - Draggable & Resizable Grid
 * - 11 items with varying random sizes
 * - Drag and drop functionality
 * - State persistence across refresh
 * - RTL layout support
 */
export const GridOffersSection = ({ items }: GridOffersSectionProps) => {
  const { language } = useLanguage();
  const isRTL = language === "fa";

  // Initialize layout from localStorage or generate random
  const [layout, setLayout] = useState<GridItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved layout:", e);
        }
      }
    }
    return generateRandomLayout();
  });

  const [dragging, setDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Save layout to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    }
  }, [layout]);

  // Mock chip assignment (in real app, this would come from item data)
  const getItemChip = (index: number): ChipType => {
    const types: ChipType[] = ["dubbed", "free", "subtitle"];
    return types[index % 3];
  };

  // Ensure we have exactly 11 items
  const displayItems = useMemo(() => {
    const selected = items.slice(0, 11);
    // If we don't have enough items, repeat the available ones
    while (selected.length < 11) {
      selected.push(items[selected.length % items.length]);
    }
    return selected;
  }, [items]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, itemId: string, gridX: number, gridY: number) => {
    setDragging(itemId);
    setDragStart({ x: gridX, y: gridY });
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetX: number, targetY: number) => {
    e.preventDefault();
    if (!dragging || !dragStart) return;

    const dx = targetX - dragStart.x;
    const dy = targetY - dragStart.y;

    if (dx === 0 && dy === 0) return;

    setLayout((prev) =>
      prev.map((item) =>
        item.id === dragging
          ? {
              ...item,
              x: Math.max(0, Math.min(3, item.x + dx)),
              y: Math.max(0, item.y + dy),
            }
          : item
      )
    );

    setDragging(null);
    setDragStart(null);
  };

  // Calculate grid row height
  const rowHeight = 150;
  const gap = 16;
  const maxRow = Math.max(...layout.map((item) => item.y + item.h));

  // Reset layout to new random configuration
  const handleResetLayout = () => {
    const newLayout = generateRandomLayout();
    setLayout(newLayout);
  };

  return (
    <Box
      component="section"
      sx={{
        py: `${glassSpacing.xl}px`,
        px: { xs: 2, md: 4 },
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Reset Layout Button */}
      <Box
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          mb: 2,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Tooltip title={language === "fa" ? "چیدمان تصادفی جدید" : "Shuffle Layout"}>
          <IconButton
            onClick={handleResetLayout}
            sx={{
              background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
              backdropFilter: `blur(${glassBlur.medium}px)`,
              border: `1px solid ${glassColors.glass.border}`,
              color: glassColors.persianGold,
              transition: glassAnimations.transition.smooth,
              "&:hover": {
                background: `linear-gradient(135deg, ${glassColors.persianGold}30, ${glassColors.persianGold}20)`,
                border: `1px solid ${glassColors.persianGold}60`,
                transform: "rotate(180deg)",
              },
            }}
          >
            <ShuffleIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          position: "relative",
          height: `${(maxRow + 1) * (rowHeight + gap)}px`,
        }}
        onDragOver={handleDragOver}
      >
        {displayItems.map((item, index) => {
          const gridItem = layout[index];
          if (!gridItem) return null;

          const chipType = getItemChip(index);
          const chipColor = getChipColor(chipType);
          const href = `/${"type" in item ? "series" : "movies"}/${item.slug}`;
          const isSeries = "type" in item;

          // Calculate position and size
          const left = isRTL
            ? `${100 - ((gridItem.x + gridItem.w) * 25)}%`
            : `${gridItem.x * 25}%`;
          const top = `${gridItem.y * (rowHeight + gap)}px`;
          const width = `calc(${gridItem.w * 25}% - ${gap}px)`;
          const height = `${gridItem.h * rowHeight + (gridItem.h - 1) * gap}px`;

          return (
            <Box
              key={gridItem.id}
              draggable
              onDragStart={(e) => handleDragStart(e, gridItem.id, gridItem.x, gridItem.y)}
              onDrop={(e) => handleDrop(e, gridItem.x, gridItem.y)}
              sx={{
                position: "absolute",
                left,
                top,
                width,
                height,
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
                transition: dragging === gridItem.id ? "none" : glassAnimations.transition.spring,
                cursor: "move",
                opacity: dragging === gridItem.id ? 0.5 : 1,
                zIndex: dragging === gridItem.id ? 100 : 1,
                "&:hover": {
                  boxShadow: `
                    0 16px 48px rgba(0, 0, 0, 0.6),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15),
                    0 0 0 1px ${glassColors.gold.glow}
                  `,
                  zIndex: 10,
                  "& .hover-overlay": {
                    opacity: 1,
                  },
                  "& .content-link": {
                    opacity: 1,
                  },
                },
              }}
            >
              {/* Clickable Link Overlay */}
              <Link
                href={href}
                className="content-link"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
                onClick={(e) => {
                  if (dragging) e.preventDefault();
                }}
              />

              {/* Image */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
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
                  draggable={false}
                />

                {/* Chip Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    [isRTL ? "left" : "right"]: 12,
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
                    pointerEvents: "none",
                  }}
                >
                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: glassColors.text.primary,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      mb: 0.5,
                      lineHeight: 1.3,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* English Title (if different) */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: glassColors.text.secondary,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      mb: 1,
                      textAlign: isRTL ? "right" : "left",
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
                        justifyContent: isRTL ? "flex-end" : "flex-start",
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
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {isSeries
                      ? `${language === "fa" ? "سریال" : "Series"} • ${
                          (item as Series).seasons?.length || 1
                        } ${
                          language === "fa"
                            ? "فصل"
                            : `Season${((item as Series).seasons?.length || 1) > 1 ? "s" : ""}`
                        }`
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
