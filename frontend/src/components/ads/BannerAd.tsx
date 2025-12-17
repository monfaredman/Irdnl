"use client";

import { Box, Typography, useTheme } from "@mui/material";

interface BannerAdProps {
  placement: "hero" | "sidebar" | "footer";
}

export const BannerAd = ({ placement }: BannerAdProps) => {
  const theme = useTheme();

  const glassSubtleStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    border: `1px dashed ${theme.palette.primary.light}50`,
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10, ${theme.palette.tertiary?.main || theme.palette.accent?.main || theme.palette.secondary.main}10)`,
  };

  return (
    <Box
      role="complementary"
      aria-label={`${placement} advertisement slot`}
      sx={{
        ...glassSubtleStyle,
        height: 112,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          color: theme.palette.primary.light,
        }}
      >
        irdnl Ad — {placement}
      </Typography>
    </Box>
  );
};
