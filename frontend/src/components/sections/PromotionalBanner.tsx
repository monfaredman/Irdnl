"use client";

import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button, Stack, useTheme } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";

interface PromotionalBannerProps {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  buttonText: string;
  buttonTextEn: string;
  buttonHref: string;
  backgroundImage?: string;
  gradient?: string;
}

export const PromotionalBanner = ({
  title,
  titleEn,
  description,
  descriptionEn,
  buttonText,
  buttonTextEn,
  buttonHref,
  backgroundImage,
  gradient = 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(247, 37, 133, 0.3))',
}: PromotionalBannerProps) => {
  const theme = useTheme();
  const { language } = useLanguage();

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 300, md: 400 },
        borderRadius: 4,
        overflow: 'hidden',
        mb: 6,
      }}
    >
      {backgroundImage ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: gradient,
              zIndex: 1,
            },
          }}
        >
          <Image
            src={backgroundImage}
            alt={title}
            fill
            style={{
              objectFit: 'cover',
              opacity: 0.6,
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: gradient,
            zIndex: 1,
          }}
        />
      )}

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: { xs: 4, md: 6 },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 700,
            color: '#fff',
            mb: 2,
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}
        >
          {language === 'fa' ? title : titleEn}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 4,
            maxWidth: 600,
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}
        >
          {language === 'fa' ? description : descriptionEn}
        </Typography>
        <Button
          component={Link}
          href={buttonHref}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.tertiary?.main || theme.palette.secondary.main} 100%)`,
            boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 30px rgba(147, 51, 234, 0.4)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.tertiary?.light || theme.palette.secondary.light} 100%)`,
              boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 50px rgba(147, 51, 234, 0.6)`,
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s',
          }}
        >
          {language === 'fa' ? buttonText : buttonTextEn}
        </Button>
      </Box>
    </Box>
  );
};

