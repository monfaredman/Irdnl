"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Toolbar, Box, Button, IconButton, Drawer, Stack, TextField, InputAdornment, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NAV_LINKS } from "@/data/navigation";
import { useLanguage } from "@/providers/language-provider";
import { useState } from "react";
import { LanguageToggle } from "../navigation/LanguageToggle";

export const Header = () => {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useTheme();

  const glassStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.1)'}`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
  };

  const glassStrongStyle = {
    background: theme.palette.glass?.strong || 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.borderStrong || 'rgba(255, 255, 255, 0.15)'}`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 0 40px rgba(99, 102, 241, 0.1)',
  };

  const isRTL = language === 'fa';

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        top: 0,
        zIndex: 50,
        borderBottom: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.1)'}`,
      }}
    >
      <Toolbar sx={{ maxWidth: '1400px', width: '100%', mx: 'auto', justifyContent: 'space-between', px: { xs: 2, md: 4 }, py: 1.5 }}>
        {/* Left: Profile + Buy Subscription */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton
            component={Link}
            href="/account"
            sx={{
              ...glassStyle,
              borderRadius: 2,
              p: 1.25,
              color: '#fff',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: theme.palette.primary.light,
                transform: 'scale(1.05)',
              },
            }}
          >
            <PersonIcon />
          </IconButton>
          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontSize: '0.875rem',
              textTransform: 'none',
              fontWeight: 500,
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.tertiary?.main || theme.palette.secondary.main} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.tertiary?.light || theme.palette.secondary.light} 100%)`,
              },
            }}
          >
            {language === 'fa' ? 'خرید اشتراک' : 'Buy Subscription'}
          </Button>
        </Stack>

        {/* Center: Search Bar */}
        <Box sx={{ flex: 1, maxWidth: 600, mx: { xs: 1, md: 4 } }}>
          <TextField
            fullWidth
            placeholder={language === 'fa' ? 'جستجوی فیلم و سریال' : 'Search movies and series'}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                ...glassStyle,
                borderRadius: 2,
                color: '#fff',
                '& fieldset': {
                  borderColor: theme.palette.glass?.border || 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.glass?.borderStrong || 'rgba(255, 255, 255, 0.15)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.light,
                },
                '& input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.4)',
                  opacity: 1,
                },
              },
            }}
          />
        </Box>

        {/* Right: Logo + Navigation + Cart */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            component={Link}
            href="/"
            sx={{
              fontSize: '1.75rem',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textTransform: 'none',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              transition: 'transform 0.2s',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {language === 'fa' ? 'نما' : 'Nama'}
          </Button>
          
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', lg: 'flex' } }}>
            <Button
              component={Link}
              href="/movies"
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                color: pathname === '/movies' ? theme.palette.primary.light : 'rgba(255, 255, 255, 0.7)',
                textTransform: 'none',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                '&:hover': {
                  color: '#fff',
                  ...glassStyle,
                },
              }}
            >
              {language === 'fa' ? 'فیلم ها' : 'Movies'}
            </Button>
            <Button
              component={Link}
              href="/series"
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                color: pathname === '/series' ? theme.palette.primary.light : 'rgba(255, 255, 255, 0.7)',
                textTransform: 'none',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                '&:hover': {
                  color: '#fff',
                  ...glassStyle,
                },
              }}
            >
              {language === 'fa' ? 'سریال ها' : 'Series'}
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              component={Link}
              href="/market"
              sx={{
                ...glassStyle,
                borderRadius: 2,
                p: 1.25,
                color: '#fff',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: theme.palette.primary.light,
                  transform: 'scale(1.05)',
                },
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Box sx={{ display: { xs: 'none', md: 'block' }, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              {language === 'fa' ? 'فیلم بازار' : 'Movie Market'}
            </Box>
          </Stack>

          <IconButton
            sx={{
              display: { xs: 'flex', lg: 'none' },
              ...glassStyle,
              borderRadius: 2,
              p: 1.25,
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: theme.palette.primary.light,
                boxShadow: `0 0 60px rgba(99, 102, 241, 0.2)`,
              },
            }}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Toolbar>

      <Drawer
        anchor={isRTL ? 'left' : 'right'}
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: {
            ...glassStrongStyle,
            width: 280,
            p: 3,
          },
        }}
      >
        <Stack spacing={2}>
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              fullWidth
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1.5,
                color: pathname === link.href ? theme.palette.primary.light : 'rgba(255, 255, 255, 0.7)',
                ...(pathname === link.href ? glassStrongStyle : {}),
                textTransform: 'none',
                fontSize: '0.875rem',
                justifyContent: 'flex-start',
                transition: 'all 0.2s',
                '&:hover': {
                  color: '#fff',
                  ...(pathname !== link.href ? glassStyle : {}),
                },
              }}
            >
              {t(link.translationKey)}
            </Button>
          ))}
          <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
            <LanguageToggle />
            <Button
              component={Link}
              href="/account"
              onClick={() => setIsMenuOpen(false)}
              variant="contained"
              startIcon={<PersonIcon />}
              fullWidth
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1.5,
                fontSize: '0.875rem',
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              {t("account")}
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </AppBar>
  );
};
