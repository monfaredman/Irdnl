"use client";

import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Stack, IconButton, useTheme } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";
import type { Movie, Series } from "@/types/media";
import { useLanguage } from "@/providers/language-provider";

interface HorizontalCarouselProps {
  title: string;
  items: (Movie | Series)[];
  type: "movie" | "series";
  viewAllHref?: string;
}

export const HorizontalCarousel = ({ title, items, type, viewAllHref }: HorizontalCarouselProps) => {
  const theme = useTheme();
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 700,
            color: '#fff',
          }}
        >
          {title}
        </Typography>
        {viewAllHref && (
          <Stack direction="row" spacing={1} alignItems="center" component={Link} href={viewAllHref}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: theme.palette.primary.light,
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
                transition: 'color 0.2s',
              }}
            >
              {language === 'fa' ? 'مشاهده همه' : 'View All'}
            </Typography>
            {language === 'fa' ? (
              <ArrowBackIosIcon sx={{ fontSize: 14, color: theme.palette.primary.light }} />
            ) : (
              <ArrowForwardIosIcon sx={{ fontSize: 14, color: theme.palette.primary.light }} />
            )}
          </Stack>
        )}
      </Stack>

      <Box sx={{ position: 'relative' }}>
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
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
                  position: 'relative',
                  minWidth: { xs: 180, sm: 220, md: 260 },
                  width: { xs: 180, sm: 220, md: 260 },
                  height: { xs: 270, sm: 330, md: 390 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 40px rgba(147, 51, 234, 0.3)`,
                  },
                }}
              >
                <Image
                  src={item.poster}
                  alt={item.title}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                  sizes="(max-width: 768px) 180px, 260px"
                />
              </Box>
            );
          })}
        </Box>

        {/* Scroll Buttons */}
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            background: theme.palette.glass?.strong || 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.1)'}`,
            color: '#fff',
            width: 40,
            height: 40,
            display: { xs: 'none', md: 'flex' },
            '&:hover': {
              background: theme.palette.glass?.medium || 'rgba(255, 255, 255, 0.15)',
              transform: 'translateY(-50%) scale(1.1)',
            },
            transition: 'all 0.2s',
          }}
        >
          <ArrowBackIosIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            background: theme.palette.glass?.strong || 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.1)'}`,
            color: '#fff',
            width: 40,
            height: 40,
            display: { xs: 'none', md: 'flex' },
            '&:hover': {
              background: theme.palette.glass?.medium || 'rgba(255, 255, 255, 0.15)',
              transform: 'translateY(-50%) scale(1.1)',
            },
            transition: 'all 0.2s',
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

