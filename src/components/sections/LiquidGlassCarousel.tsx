"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import type { Movie, Series } from "@/types/media";
import { useLanguage } from "@/providers/language-provider";
import {
  glassColors,
  glassStyles,
  glassSpacing,
  glassBorderRadius,
  glassAnimations,
  sliderStyles,
} from "@/theme/glass-design-system";

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
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const PrevIcon = isRTL ? ArrowForwardIosIcon : ArrowBackIosNewIcon;
  const NextIcon = isRTL ? ArrowBackIosNewIcon : ArrowForwardIosIcon;
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
        py: `${glassSpacing.xl}px`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          mb: `${glassSpacing.lg}px`,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 600,
            color: glassColors.text.primary,
          }}
        >
          {title}
        </Typography>
        
        {viewAllHref && (
          <Box
            component={Link}
            href={viewAllHref}
            sx={{
              ...glassStyles.link,
              fontSize: "0.9375rem",
              display: "flex",
              alignItems: "center",
              gap: "4px",
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
                    borderRadius: glassBorderRadius.lg,
                    overflow: "hidden",
                    background: glassColors.glass.base,
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    border: `1px solid ${glassColors.glass.border}`,
                    boxShadow: `
                      0 8px 32px rgba(0, 0, 0, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `,
                    transition: glassAnimations.transition.spring,
                    '&:hover': {
                      borderColor: glassColors.glass.border,
                      boxShadow: `
                        0 12px 48px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15),
                        0 0 0 1px ${glassColors.gold.glow}
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
                    mt: `${glassSpacing.sm}px`,
                    fontWeight: 500,
                    color: glassColors.text.primary,
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
            onClick={() => scroll(isRTL ? 'right' : 'left')}
            sx={{
              ...sliderStyles.arrow,
              position: "absolute",
              left: { xs: -8, md: -16 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              display: { xs: "none", md: "flex" },
              '&:hover': {
                background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.gold.light})`,
                color: glassColors.deepMidnight,
                transform: "translateY(-50%) scale(1.1)",
              },
            }}
          >
            <PrevIcon />
          </IconButton>
        )}

        {showRightArrow && (
          <IconButton
            onClick={() => scroll(isRTL ? 'left' : 'right')}
            sx={{
              ...sliderStyles.arrow,
              position: "absolute",
              right: { xs: -8, md: -16 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              display: { xs: "none", md: "flex" },
              '&:hover': {
                background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.gold.light})`,
                color: glassColors.deepMidnight,
                transform: "translateY(-50%) scale(1.1)",
              },
            }}
          >
            <NextIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
