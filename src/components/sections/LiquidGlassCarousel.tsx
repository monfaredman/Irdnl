"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import type { Movie, Series } from "@/types/media";
import { liquidGlassColors } from "@/theme/liquid-glass-theme";

interface LiquidGlassCarouselProps {
  title: string;
  items: (Movie | Series)[];
  type: "movie" | "series";
  viewAllHref?: string;
}

/**
 * Compact Liquid Glass Carousel
 * - Multiple cards visible (3-5 depending on screen)
 * - Smooth scroll animation
 * - Glass card hover effects
 * - Horizontal navigation
 */
export const LiquidGlassCarousel = ({ 
  title, 
  items, 
  type,
  viewAllHref 
}: LiquidGlassCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
      
      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        py: 8,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 600,
            color: liquidGlassColors.white,
          }}
        >
          {title}
        </Typography>
        
        {viewAllHref && (
          <Box
            component={Link}
            href={viewAllHref}
            sx={{
              color: liquidGlassColors.persianGold,
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              '&:hover': {
                color: "#FBB040",
                transform: "translateX(4px)",
              },
            }}
          >
            View All
            <Box component="span" sx={{ fontSize: "18px" }}>→</Box>
          </Box>
        )}
      </Box>

      {/* Carousel Container */}
      <Box sx={{ position: "relative" }}>
        <Box
          ref={scrollRef}
          onScroll={checkScrollPosition}
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            '&::-webkit-scrollbar': {
              display: "none",
            },
            px: { xs: 2, md: 4 },
            pb: 2,
          }}
        >
          {items.map((item) => {
            const href = `/${type === "movie" ? "movies" : "series"}/${item.slug}`;
            return (
              <Box
                key={item.id}
                component={Link}
                href={href}
                sx={{
                  minWidth: { xs: "200px", sm: "240px", md: "280px" },
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "150%",
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: liquidGlassColors.glass.base,
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    border: `1px solid ${liquidGlassColors.glass.border}`,
                    boxShadow: `
                      0 8px 32px rgba(0, 0, 0, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `,
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    '&:hover': {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      boxShadow: `
                        0 12px 48px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15),
                        0 0 0 1px rgba(245, 158, 11, 0.3)
                      `,
                      transform: "translateY(-8px) scale(1.03)",
                    },
                  }}
                >
                  <Image
                    src={item.poster}
                    alt={item.title}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    sizes="(max-width: 600px) 200px, (max-width: 960px) 240px, 280px"
                    loading="lazy"
                  />
                  
                  {/* Gradient overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                      pointerEvents: "none",
                    }}
                  />
                </Box>
                
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    fontWeight: 500,
                    color: liquidGlassColors.text.primary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Navigation Arrows */}
        {showLeftArrow && (
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: "absolute",
              left: { xs: -8, md: -16 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              width: 48,
              height: 48,
              background: liquidGlassColors.glass.strong,
              backdropFilter: "blur(20px)",
              border: `1px solid ${liquidGlassColors.glass.border}`,
              color: liquidGlassColors.white,
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: { xs: "none", md: "flex" },
              '&:hover': {
                background: liquidGlassColors.persianGold,
                color: liquidGlassColors.deepMidnight,
                transform: "translateY(-50%) scale(1.1)",
              },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        )}

        {showRightArrow && (
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: "absolute",
              right: { xs: -8, md: -16 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              width: 48,
              height: 48,
              background: liquidGlassColors.glass.strong,
              backdropFilter: "blur(20px)",
              border: `1px solid ${liquidGlassColors.glass.border}`,
              color: liquidGlassColors.white,
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: { xs: "none", md: "flex" },
              '&:hover': {
                background: liquidGlassColors.persianGold,
                color: liquidGlassColors.deepMidnight,
                transform: "translateY(-50%) scale(1.1)",
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
