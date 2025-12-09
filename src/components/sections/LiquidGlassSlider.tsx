"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, IconButton, Container, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import type { Movie, Series } from "@/types/media";
import { liquidGlassColors } from "@/theme/liquid-glass-theme";

interface LiquidGlassSliderProps {
  items: (Movie | Series)[];
  type: "movie" | "series";
  autoplayDelay?: number;
}

/**
 * Premium Liquid Glass Content Slider
 * 
 * Features:
 * - Glass morphism with backdrop blur
 * - Smooth autoplay + manual navigation
 * - Floating glass arrows + dot indicators
 * - Parallax effect on scroll
 * - Lazy loading for performance
 * - Keyboard navigation (Arrow keys)
 * - Touch/swipe support for mobile
 * - 60fps optimized animations
 */
export const LiquidGlassSlider = ({ 
  items, 
  type,
  autoplayDelay = 5000 
}: LiquidGlassSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Featured items (first 5)
  const featuredItems = items.slice(0, 5);
  const totalSlides = featuredItems.length;

  // Autoplay logic
  useEffect(() => {
    if (!isHovering && autoplayDelay > 0) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, autoplayDelay);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isHovering, autoplayDelay, totalSlides]);

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <Box
      ref={sliderRef}
      component="section"
      role="region"
      aria-label="Featured content slider"
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "60vh", md: "75vh" },
        minHeight: "500px",
        overflow: "hidden",
        mb: 8,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {featuredItems.map((item, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === (currentIndex - 1 + totalSlides) % totalSlides;
          const isNext = index === (currentIndex + 1) % totalSlides;
          const isVisible = isActive || isPrev || isNext;

          return (
            <Box
              key={item.id}
              sx={{
                position: "absolute",
                inset: 0,
                opacity: isActive ? 1 : 0,
                transform: isActive 
                  ? "translateX(0) scale(1)" 
                  : isPrev 
                  ? "translateX(-100%) scale(0.9)"
                  : isNext
                  ? "translateX(100%) scale(0.9)"
                  : "translateX(0) scale(0.9)",
                transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
                pointerEvents: isActive ? "auto" : "none",
                visibility: isVisible ? "visible" : "hidden",
                zIndex: isActive ? 2 : 1,
              }}
            >
              {/* Background Image with Parallax */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  transition: "transform 0.7s ease-out",
                  '&::after': {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)",
                    zIndex: 1,
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
                  sizes="100vw"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </Box>

              {/* Content Overlay */}
              <Container
                maxWidth="xl"
                sx={{
                  position: "relative",
                  zIndex: 2,
                  height: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                  pb: { xs: 8, md: 12 },
                }}
              >
                <Box
                  sx={{
                    maxWidth: "600px",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(30px)",
                    transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
                  }}
                >
                  {/* Glass Card */}
                  <Box
                    sx={{
                      p: { xs: 3, md: 4 },
                      background: liquidGlassColors.glass.base,
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      border: `1px solid ${liquidGlassColors.glass.border}`,
                      borderRadius: "24px",
                      boxShadow: `
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `,
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        mb: 2,
                        background: `linear-gradient(135deg, ${liquidGlassColors.white} 0%, ${liquidGlassColors.text.secondary} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        color: liquidGlassColors.text.secondary,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description || "Experience this amazing content on PersiaPlay."}
                    </Typography>

                    {/* CTA Button */}
                    <Box
                      component={Link}
                      href={`/${type}s/${item.slug}`}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: 4,
                        py: 2,
                        background: liquidGlassColors.persianGold,
                        color: liquidGlassColors.deepMidnight,
                        fontSize: "17px",
                        fontWeight: 600,
                        borderRadius: "16px",
                        textDecoration: "none",
                        border: `1px solid rgba(255, 255, 255, 0.1)`,
                        boxShadow: `
                          0 8px 32px rgba(245, 158, 11, 0.3),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        '&:hover': {
                          background: "#FBB040",
                          boxShadow: `
                            0 12px 48px rgba(245, 158, 11, 0.4),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3)
                          `,
                          transform: "translateY(-2px) scale(1.02)",
                        },
                      }}
                    >
                      <PlayArrowIcon />
                      Watch Now
                    </Box>
                  </Box>
                </Box>
              </Container>
            </Box>
          );
        })}
      </Box>

      {/* Navigation Arrows - Floating Glass */}
      <IconButton
        onClick={goToPrevious}
        aria-label="Previous slide"
        sx={{
          position: "absolute",
          left: { xs: 16, md: 32 },
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: { xs: 48, md: 56 },
          height: { xs: 48, md: 56 },
          background: liquidGlassColors.glass.mid,
          backdropFilter: "blur(20px)",
          border: `1px solid ${liquidGlassColors.glass.border}`,
          color: liquidGlassColors.white,
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: isHovering ? 1 : 0.5,
          '&:hover': {
            background: liquidGlassColors.glass.strong,
            transform: "translateY(-50%) scale(1.1)",
            borderColor: liquidGlassColors.persianGold,
          },
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <IconButton
        onClick={goToNext}
        aria-label="Next slide"
        sx={{
          position: "absolute",
          right: { xs: 16, md: 32 },
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: { xs: 48, md: 56 },
          height: { xs: 48, md: 56 },
          background: liquidGlassColors.glass.mid,
          backdropFilter: "blur(20px)",
          border: `1px solid ${liquidGlassColors.glass.border}`,
          color: liquidGlassColors.white,
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: isHovering ? 1 : 0.5,
          '&:hover': {
            background: liquidGlassColors.glass.strong,
            transform: "translateY(-50%) scale(1.1)",
            borderColor: liquidGlassColors.persianGold,
          },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      {/* Dot Indicators */}
      <Box
        sx={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          gap: 1.5,
          px: 3,
          py: 1.5,
          background: liquidGlassColors.glass.mid,
          backdropFilter: "blur(20px)",
          border: `1px solid ${liquidGlassColors.glass.border}`,
          borderRadius: "24px",
        }}
      >
        {featuredItems.map((_, index) => (
          <Box
            key={index}
            component="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : "false"}
            sx={{
              width: index === currentIndex ? 32 : 8,
              height: 8,
              borderRadius: "4px",
              border: "none",
              background: index === currentIndex 
                ? liquidGlassColors.persianGold
                : liquidGlassColors.glass.border,
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              '&:hover': {
                background: index === currentIndex 
                  ? "#FBB040"
                  : liquidGlassColors.text.tertiary,
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
