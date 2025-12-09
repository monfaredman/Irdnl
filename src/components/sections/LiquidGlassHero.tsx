"use client";

import Link from "next/link";
import { Box, Typography, Container } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";
import { liquidGlassSpacing, liquidGlassColors } from "@/theme/liquid-glass-theme";

/**
 * Liquid Glass Hero
 * - Extreme minimalism with depth
 * - 70% whitespace minimum
 * - Single bold statement
 * - Subtle glass accent
 */
export const LiquidGlassHero = () => {
  const { language } = useLanguage();

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: liquidGlassSpacing.xxl / 8, // 128px
        px: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glass accent in background */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, ${liquidGlassColors.persianGold}15 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="md"
        sx={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            mb: liquidGlassSpacing.lg / 8, // 32px
            background: `linear-gradient(135deg, ${liquidGlassColors.white} 0%, ${liquidGlassColors.text.secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {language === 'fa' 
            ? 'سینمای بی‌پایان'
            : 'Cinema Redefined'}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            mb: liquidGlassSpacing.xl / 8, // 64px
            color: liquidGlassColors.text.secondary,
            maxWidth: '600px',
            mx: 'auto',
            fontSize: '19px',
          }}
        >
          {language === 'fa'
            ? 'تجربه تماشای فیلم و سریال با کیفیتی بی‌نظیر'
            : 'Experience movies and series like never before'}
        </Typography>

        <Box
          component={Link}
          href="/movies"
          sx={{
            display: 'inline-block',
            textDecoration: 'none',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: liquidGlassSpacing.xl / 8, // 64px
              py: liquidGlassSpacing.md / 8, // 24px
              background: liquidGlassColors.persianGold,
              color: liquidGlassColors.deepMidnight,
              fontSize: '17px',
              fontWeight: 600,
              borderRadius: '16px',
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              boxShadow: `
                0 8px 32px rgba(245, 158, 11, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                background: '#FBB040',
                boxShadow: `
                  0 12px 48px rgba(245, 158, 11, 0.4),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3)
                `,
                transform: 'translateY(-4px) scale(1.02)',
              },
              '&:active': {
                transform: 'translateY(0) scale(0.98)',
              },
            }}
          >
            {language === 'fa' ? 'شروع تماشا' : 'Start Watching'}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
