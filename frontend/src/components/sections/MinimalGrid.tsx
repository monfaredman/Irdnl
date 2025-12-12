"use client";

import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Grid, Container } from "@mui/material";
import type { Movie, Series } from "@/types/media";
import { useLanguage } from "@/providers/language-provider";
import { minimalSpacing } from "@/theme/minimal-theme";

interface MinimalGridProps {
  title: string;
  items: (Movie | Series)[];
  type: "movie" | "series";
  viewAllHref?: string;
}

/**
 * Minimal Content Grid
 * - Clean, evenly spaced cards
 * - Grid-based layout with strict alignment
 * - No carousels or scroll effects
 * - Flat card design with simple border
 */
export const MinimalGrid = ({ title, items, type, viewAllHref }: MinimalGridProps) => {
  const { language } = useLanguage();

  // Show only first 8 items for clean layout
  const displayItems = items.slice(0, 8);

  return (
    <Box
      component="section"
      sx={{
        py: minimalSpacing.xl / 8, // 64px
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mb: minimalSpacing.lg / 8, // 32px
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
          {viewAllHref && (
            <Typography
              component={Link}
              href={viewAllHref}
              variant="body2"
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                borderBottom: '1px solid',
                borderColor: 'text.primary',
                '&:hover': {
                  color: 'text.secondary',
                },
              }}
            >
              {language === 'fa' ? 'مشاهده همه' : 'View All'}
            </Typography>
          )}
        </Box>

        <Grid container spacing={3}> {/* 24px spacing */}
          {displayItems.map((item) => {
            const href = `/${type === "movie" ? "movies" : "series"}/${item.slug}`;
            return (
              <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
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
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: 'text.primary',
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
                      sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw"
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: minimalSpacing.sm / 8, // 16px
                      fontWeight: 400,
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
