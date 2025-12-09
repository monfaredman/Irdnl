"use client";

import { Box, Container, Typography, Stack } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";
import { liquidGlassSpacing, liquidGlassColors } from "@/theme/liquid-glass-theme";

/**
 * Liquid Glass Footer
 * - Minimal content-first approach
 * - Frosted glass aesthetic
 * - 70% whitespace
 */
export const LiquidGlassFooter = () => {
  const { language } = useLanguage();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${liquidGlassColors.glass.border}`,
        py: liquidGlassSpacing.xl / 8, // 64px
        mt: liquidGlassSpacing.xxl / 8, // 128px
        background: liquidGlassColors.glass.base,
        backdropFilter: 'blur(20px)',
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: liquidGlassSpacing.lg / 8, md: liquidGlassSpacing.xl / 8 }}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Brand */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${liquidGlassColors.white} 0%, ${liquidGlassColors.persianGold} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1,
              }}
            >
              {language === 'fa' ? 'پرشیا پلی' : 'PersiaPlay'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: liquidGlassColors.text.secondary,
              }}
            >
              {language === 'fa'
                ? 'تجربه سینمای بی‌پایان'
                : 'Cinema Redefined'}
            </Typography>
          </Box>

          {/* Copyright */}
          <Typography
            variant="body2"
            sx={{
              color: liquidGlassColors.text.tertiary,
            }}
          >
            © 2025 PersiaPlay. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};
