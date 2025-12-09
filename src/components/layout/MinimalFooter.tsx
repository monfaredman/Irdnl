"use client";

import { Box, Container, Typography, Stack, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";
import { minimalSpacing } from "@/theme/minimal-theme";
import { FOOTER_LINKS } from "@/data/navigation";

/**
 * Minimal Footer
 * - Essential links only
 * - Clean grid layout
 * - No decorative elements
 */
export const MinimalFooter = () => {
  const { language } = useLanguage();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        py: minimalSpacing.xl / 8, // 64px
        mt: minimalSpacing.xxl / 8, // 128px
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: minimalSpacing.lg / 8, md: minimalSpacing.xl / 8 }}
          sx={{
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                mb: minimalSpacing.sm / 8,
                fontWeight: 600,
              }}
            >
              {language === 'fa' ? 'پرشیا پلی' : 'PersiaPlay'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                maxWidth: '300px',
              }}
            >
              {language === 'fa'
                ? 'پلتفرم پخش آنلاین فیلم و سریال'
                : 'Online streaming platform for movies and series'}
            </Typography>
          </Box>

          {/* Legal Links */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                mb: minimalSpacing.sm / 8,
                fontWeight: 600,
              }}
            >
              {language === 'fa' ? 'قانونی' : 'Legal'}
            </Typography>
            <Stack spacing={minimalSpacing.xs / 8}>
              {FOOTER_LINKS.legal.map((link) => (
                <MuiLink
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          {/* Contact Links */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                mb: minimalSpacing.sm / 8,
                fontWeight: 600,
              }}
            >
              {language === 'fa' ? 'تماس' : 'Contact'}
            </Typography>
            <Stack spacing={minimalSpacing.xs / 8}>
              {FOOTER_LINKS.contact.map((link) => (
                <MuiLink
                  key={link.href}
                  href={link.href}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Copyright */}
        <Box
          sx={{
            mt: minimalSpacing.xl / 8,
            pt: minimalSpacing.lg / 8,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
            }}
          >
            © 2025 PersiaPlay. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
