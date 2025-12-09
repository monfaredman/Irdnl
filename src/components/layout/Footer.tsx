"use client";

import Link from "next/link";
import { Box, Container, Typography, Stack, IconButton, useTheme } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useLanguage } from "@/providers/language-provider";

export const Footer = () => {
  const theme = useTheme();
  const { language } = useLanguage();

  const glassStrongStyle = {
    background: 'rgba(10, 10, 15, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.1)'}`,
  };

  return (
    <Box
      component="footer"
      sx={{
        ...glassStrongStyle,
        mt: 8,
        color: '#fff',
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ px: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          {/* Left: Social Media Icons */}
          <Stack direction="row" spacing={2}>
            <IconButton
              component="a"
              href="https://t.me/persiaplay"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                ...glassStrongStyle,
                border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.1)'}`,
                color: '#fff',
                '&:hover': {
                  borderColor: theme.palette.primary.light,
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s',
              }}
            >
              <TelegramIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://instagram.com/persiaplay"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                ...glassStrongStyle,
                border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.1)'}`,
                color: '#fff',
                '&:hover': {
                  borderColor: theme.palette.primary.light,
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s',
              }}
            >
              <InstagramIcon />
            </IconButton>
          </Stack>

          {/* Right: Logo + Links */}
          <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap" justifyContent="center">
            <Typography
              component={Link}
              href="/"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textDecoration: 'none',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
                transition: 'transform 0.2s',
              }}
            >
              {language === 'fa' ? 'نما' : 'Nama'}
            </Typography>
            <Stack direction="row" spacing={3} flexWrap="wrap" justifyContent="center">
              <Link
                href="/market"
                style={{ textDecoration: 'none' }}
              >
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: theme.palette.primary.light,
                    },
                  }}
                >
                  {language === 'fa' ? 'فیلم بازار' : 'Movie Market'}
                </Typography>
              </Link>
              <Link
                href="/support"
                style={{ textDecoration: 'none' }}
              >
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: theme.palette.primary.light,
                    },
                  }}
                >
                  {language === 'fa' ? 'پشتیبانی' : 'Support'}
                </Typography>
              </Link>
              <Link
                href="/legal/terms"
                style={{ textDecoration: 'none' }}
              >
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: theme.palette.primary.light,
                    },
                  }}
                >
                  {language === 'fa' ? 'قوانین و مقررات' : 'Terms and Conditions'}
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
