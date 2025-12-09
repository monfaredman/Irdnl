"use client";

import Link from "next/link";
import { Box, Card, CardContent, Grid, Stack, Typography, useTheme } from "@mui/material";
import { popularGenres } from "@/data/mockContent";

export const CategoryTiles = () => {
  const theme = useTheme();

  const glassStrongStyle = {
    background: theme.palette.glass?.strong || 'rgba(255, 255, 255, 0.14)',
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.borderStrong || 'rgba(255, 255, 255, 0.18)'}`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
  };

  const glassStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.12)'}`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
  };

  return (
    <Box
      component="section"
      sx={{
        ...glassStrongStyle,
        borderRadius: 4,
        p: 3,
        transition: 'all 0.4s',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#fff' }}>
          Popular genres
        </Typography>
        <Link href="/genres" style={{ textDecoration: 'none' }}>
          <Typography
            component="span"
            sx={{
              position: 'relative',
              fontSize: '0.875rem',
              color: theme.palette.primary.light,
              transition: 'all 0.3s',
              '&:hover': {
                color: theme.palette.primary.main,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: 0,
                height: '2px',
                background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                transition: 'width 0.3s',
              },
              '&:hover::after': {
                width: '100%',
              },
            }}
          >
            Explore all
          </Typography>
        </Link>
      </Stack>
      <Grid container spacing={2}>
        {popularGenres.map((genre, index) => (
          <Grid item xs={12} sm={6} key={genre.id}>
            <Card
              component={Link}
              href={genre.href}
              sx={{
                ...glassStyle,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                p: 2.5,
                textDecoration: 'none',
                transition: 'all 0.4s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  borderColor: theme.palette.primary.light,
                  boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 0 60px rgba(0, 212, 255, 0.3)`,
                  '& .gradient-overlay': {
                    opacity: 1,
                  },
                  '& .shimmer': {
                    transform: 'translateX(100%)',
                  },
                },
              }}
            >
              <Box
                className="gradient-overlay"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}33, ${theme.palette.secondary.main}33, ${theme.palette.tertiary?.main || theme.palette.accent?.main || theme.palette.secondary.main}33)`,
                  opacity: 0,
                  transition: 'opacity 0.5s',
                }}
              />
              <Box
                className="shimmer"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.05), transparent)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 0.7s',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                {genre.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
