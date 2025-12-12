"use client";

import Link from "next/link";
import { Box, Typography, Button, Container } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";
import { minimalSpacing } from "@/theme/minimal-theme";

/**
 * Minimal Hero Section
 * - Single bold headline
 * - One primary CTA
 * - Maximum whitespace
 * - No gradients, shadows, or decorative elements
 */
export const MinimalHero = () => {
  const { language } = useLanguage();
  const isRTL = language === 'fa';

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: minimalSpacing.xxl / 8, // 128px / 8 = 16 (MUI spacing units)
        px: { xs: 2, md: 4 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            mb: minimalSpacing.lg / 8, // 32px
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          {language === 'fa' 
            ? 'تماشای فیلم و سریال'
            : 'Watch Movies & Series'}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            mb: minimalSpacing.xl / 8, // 64px
            color: 'text.secondary',
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          {language === 'fa'
            ? 'دسترسی نامحدود به هزاران فیلم و سریال'
            : 'Unlimited access to thousands of movies and series'}
        </Typography>

        <Button
          component={Link}
          href="/movies"
          variant="contained"
          sx={{
            minWidth: '200px',
          }}
        >
          {language === 'fa' ? 'شروع تماشا' : 'Start Watching'}
        </Button>
      </Container>
    </Box>
  );
};
