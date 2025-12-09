"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Toolbar, Box, Button, Container, Stack } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";
import { minimalSpacing } from "@/theme/minimal-theme";
import { NAV_LINKS } from "@/data/navigation";

/**
 * Minimal Header
 * - Simplified navigation
 * - No search bar (separate search page)
 * - Clean logo/wordmark
 * - Flat design with border only
 */
export const MinimalHeader = () => {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isRTL = language === 'fa';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 64, md: 80 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 0,
          }}
        >
          {/* Logo/Wordmark */}
          <Button
            component={Link}
            href="/"
            sx={{
              fontSize: '24px',
              fontWeight: 600,
              color: 'text.primary',
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                background: 'transparent',
                color: 'text.secondary',
              },
            }}
          >
            {language === 'fa' ? 'پرشیا پلی' : 'PersiaPlay'}
          </Button>

          {/* Desktop Navigation */}
          <Stack
            direction="row"
            spacing={minimalSpacing.lg / 8}
            sx={{
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="text"
                  sx={{
                    color: isActive ? 'text.primary' : 'text.secondary',
                    fontWeight: isActive ? 600 : 400,
                    borderBottom: isActive ? '1px solid' : 'none',
                    borderColor: 'text.primary',
                    borderRadius: 0,
                    px: 0,
                    py: minimalSpacing.xs / 8,
                    '&:hover': {
                      color: 'text.primary',
                      background: 'transparent',
                    },
                  }}
                >
                  {link.translationKey.toUpperCase()}
                </Button>
              );
            })}
          </Stack>

          {/* CTA Button */}
          <Button
            variant="contained"
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            {language === 'fa' ? 'ورود' : 'Sign In'}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="text"
            sx={{
              display: { xs: 'block', md: 'none' },
              minWidth: 'auto',
              p: minimalSpacing.sm / 8,
            }}
          >
            {language === 'fa' ? 'منو' : 'Menu'}
          </Button>
        </Container>
      </Toolbar>
    </AppBar>
  );
};
