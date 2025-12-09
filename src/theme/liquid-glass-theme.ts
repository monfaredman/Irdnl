'use client';

import { createTheme } from '@mui/material/styles';

/**
 * LIQUID GLASS THEME - Apple-Inspired Design
 * 
 * Philosophy: Frosted Liquid Glass + Extreme Minimalism
 * Material System: Layered glass planes with depth
 * 
 * Glass Layers:
 * - Base: Deep midnight (#0A0A0A)
 * - Mid: Frosted glass (rgba(255,255,255,0.05))
 * - Top: Clear glass (rgba(255,255,255,0.02))
 * 
 * Spacing: 8px grid system (8, 16, 24, 32, 64, 128)
 * Colors: Black, White, Persian Gold (#F59E0B)
 * Fonts: SF Pro Display (Apple) + System Sans
 */

const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 64,
  xxl: 128,
};

const colors = {
  // Base colors
  deepMidnight: '#0A0A0A',
  white: '#FFFFFF',
  persianGold: '#F59E0B',
  
  // Glass layers
  glass: {
    base: 'rgba(255, 255, 255, 0.02)',
    mid: 'rgba(255, 255, 255, 0.05)',
    strong: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Text
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.5)',
  },
};

export const liquidGlassTheme = createTheme({
  spacing: 8,
  palette: {
    mode: 'dark',
    primary: {
      main: colors.persianGold,
      light: '#FBB040',
      dark: '#DC8B0C',
      contrastText: colors.deepMidnight,
    },
    secondary: {
      main: colors.white,
      light: colors.white,
      dark: 'rgba(255, 255, 255, 0.9)',
      contrastText: colors.deepMidnight,
    },
    background: {
      default: colors.deepMidnight,
      paper: colors.glass.base,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.tertiary,
    },
    divider: colors.glass.border,
  },
  typography: {
    fontFamily: [
      'var(--font-vazirmatn)', // Persian/Farsi font
      '-apple-system',
      'BlinkMacSystemFont',
      '"SF Pro Display"',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '64px',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontSize: '48px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '32px',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    body1: {
      fontSize: '17px',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0',
    },
    body2: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
    },
  },
  shape: {
    borderRadius: 16, // Apple-style rounded corners
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: colors.deepMidnight,
          color: colors.text.primary,
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
        },
        '*': {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          boxSizing: 'border-box',
        },
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: colors.glass.base,
        },
        '::-webkit-scrollbar-thumb': {
          background: colors.glass.mid,
          borderRadius: '4px',
          '&:hover': {
            background: colors.glass.strong,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 16,
          padding: `${spacing.sm}px ${spacing.lg}px`,
          fontWeight: 600,
          fontSize: '17px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        },
        contained: {
          background: colors.persianGold,
          color: colors.deepMidnight,
          boxShadow: `0 8px 32px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          '&:hover': {
            background: '#FBB040',
            boxShadow: `0 12px 40px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          background: colors.glass.base,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.glass.border}`,
          color: colors.white,
          '&:hover': {
            background: colors.glass.mid,
            border: `1px solid rgba(255, 255, 255, 0.2)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: colors.glass.base,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${colors.glass.border}`,
          borderRadius: 16,
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring animation
          '&:hover': {
            background: colors.glass.mid,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: `
              0 12px 48px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.15),
              0 0 0 1px rgba(245, 158, 11, 0.3)
            `,
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: colors.glass.base,
            backdropFilter: 'blur(20px)',
            borderRadius: 16,
            '& fieldset': {
              borderColor: colors.glass.border,
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.persianGold,
              borderWidth: '1px',
              boxShadow: `0 0 0 4px rgba(245, 158, 11, 0.1)`,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: colors.glass.base,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: 'none',
          borderBottom: `1px solid ${colors.glass.border}`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: spacing.sm,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: colors.glass.mid,
          },
        },
      },
    },
  },
});

export const liquidGlassSpacing = spacing;
export const liquidGlassColors = colors;
