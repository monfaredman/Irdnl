"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Toolbar, Box, Button, Container, Stack, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useLanguage } from "@/providers/language-provider";
import { liquidGlassSpacing, liquidGlassColors } from "@/theme/liquid-glass-theme";
import { NAV_LINKS } from "@/data/navigation";
import { useState, useEffect } from "react";

/**
 * Liquid Glass Navigation
 * - Frosted glass that blurs on scroll
 * - Apple-inspired floating aesthetic
 * - Seamless rounded corners
 * - Spring animations on hover
 */
export const LiquidGlassHeader = () => {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: scrolled 
          ? 'rgba(10, 10, 10, 0.8)'
          : liquidGlassColors.glass.base,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: `1px solid ${liquidGlassColors.glass.border}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
              fontSize: '28px',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${liquidGlassColors.white} 0%, ${liquidGlassColors.persianGold} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              letterSpacing: '-0.02em',
              '&:hover': {
                background: `linear-gradient(135deg, ${liquidGlassColors.persianGold} 0%, ${liquidGlassColors.white} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {language === 'fa' ? 'پرشیا پلی' : 'PersiaPlay'}
          </Button>

          {/* Desktop Navigation */}
          <Stack
            direction="row"
            spacing={liquidGlassSpacing.lg / 8}
            sx={{
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {NAV_LINKS.slice(1).map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="text"
                  sx={{
                    color: isActive ? liquidGlassColors.persianGold : liquidGlassColors.text.secondary,
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '15px',
                    px: liquidGlassSpacing.md / 8,
                    py: liquidGlassSpacing.xs / 8,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: isActive ? '80%' : '0%',
                      height: '2px',
                      background: liquidGlassColors.persianGold,
                      borderRadius: '2px',
                      transition: 'width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    },
                    '&:hover': {
                      color: liquidGlassColors.white,
                      background: liquidGlassColors.glass.base,
                      '&::after': {
                        width: '80%',
                      },
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
              minWidth: 'auto',
              px: liquidGlassSpacing.lg / 8,
            }}
          >
            {language === 'fa' ? 'ورود' : 'Sign In'}
          </Button>

          {/* Mobile Menu */}
          <Button
            variant="outlined"
            sx={{
              display: { xs: 'block', md: 'none' },
              minWidth: 'auto',
              px: liquidGlassSpacing.md / 8,
            }}
          >
            {language === 'fa' ? 'منو' : 'Menu'}
          </Button>
        </Container>
      </Toolbar>
    </AppBar>
  );
};
