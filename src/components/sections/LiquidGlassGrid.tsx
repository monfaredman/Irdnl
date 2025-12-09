"use client";

import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Grid, Container } from "@mui/material";
import type { Movie, Series } from "@/types/media";
import { useLanguage } from "@/providers/language-provider";
import { liquidGlassSpacing, liquidGlassColors } from "@/theme/liquid-glass-theme";

interface LiquidGlassGridProps {
  title: string;
  items: (Movie | Series)[];
  type: "movie" | "series";
  viewAllHref?: string;
}

/**
 * Liquid Glass Content Grid
 * - Glass cards with liquid hover effects
 * - Spring animations (cubic-bezier(0.34, 1.56, 0.64, 1))
 * - Seamless 16px rounded corners
 * - Depth shadows with inset glow
 */
export const LiquidGlassGrid = ({ title, items, type, viewAllHref }: LiquidGlassGridProps) => {
  const { language } = useLanguage();

  // Show 6 items for cleaner minimal layout
  const displayItems = items.slice(0, 6);

  return (
    <Box
      component="section"
      sx={{
        py: liquidGlassSpacing.xl / 8, // 64px
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mb: liquidGlassSpacing.xl / 8, // 64px - more whitespace
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
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  color: '#FBB040',
                  transform: 'translateX(4px)',
                },
              }}
            >
              {language === 'fa' ? 'مشاهده همه' : 'View All'}
              <Box component="span" sx={{ fontSize: '18px' }}>→</Box>
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          {displayItems.map((item) => {
            const href = `/${type === "movie" ? "movies" : "series"}/${item.slug}`;
            return (
              <Grid key={item.id} size={{ xs: 6, sm: 4, md: 2 }}>
                <Box
                  component={Link}
                  href={href}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '150%', // 2:3 aspect ratio
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: liquidGlassColors.glass.base,
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      border: `1px solid ${liquidGlassColors.glass.border}`,
                      boxShadow: `
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `,
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        boxShadow: `
                          0 12px 48px rgba(0, 0, 0, 0.5),
                          inset 0 1px 0 rgba(255, 255, 255, 0.15),
                          0 0 0 1px rgba(245, 158, 11, 0.3)
                        `,
                        transform: 'translateY(-8px) scale(1.02)',
                      },
                      '&:active': {
                        transform: 'translateY(-4px) scale(1.01)',
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
                      sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 16vw"
                    />
                    
                    {/* Overlay gradient for better text readability */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                  </Box>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      mt: liquidGlassSpacing.sm / 8, // 16px
                      fontWeight: 500,
                      color: liquidGlassColors.text.primary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};
