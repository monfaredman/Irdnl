'use client';

import { createTheme } from '@mui/material/styles';

/**
 * MINIMAL DESIGN SYSTEM
 * 
 * 8-Point Grid System:
 * All spacing values are multiples of 8px
 * - xs: 8px
 * - sm: 16px
 * - md: 24px
 * - lg: 32px
 * - xl: 64px
 * - xxl: 128px
 * 
 * Color Palette (3 colors maximum):
 * - Black: #000000 (primary)
 * - White: #FFFFFF (backgrounds)
 * - Accent: #000000 (for emphasis)
 * 
 * Typography:
 * - Font Family: Inter (headings), System Sans (body)
 * - Weights: 400 (regular), 600 (bold)
 * - Sizes: 14px, 16px, 24px, 48px
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
  black: '#000000',
  white: '#FFFFFF',
  offWhite: '#F5F5F5',
  gray: '#999999',
  lightGray: '#E5E5E5',
};

export const minimalTheme = createTheme({
  spacing: 8, // Base unit for MUI spacing
  palette: {
    mode: 'light',
    primary: {
      main: colors.black,
      light: colors.gray,
      dark: colors.black,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.black,
      light: colors.gray,
      dark: colors.black,
      contrastText: colors.white,
    },
    background: {
      default: colors.white,
      paper: colors.offWhite,
    },
    text: {
      primary: colors.black,
      secondary: colors.gray,
      disabled: colors.lightGray,
    },
    divider: colors.lightGray,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Inter"',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '48px',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '32px',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    h4: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
    },
  },
  shape: {
    borderRadius: 0, // Flat design - no rounded corners
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: colors.white,
          color: colors.black,
          margin: 0,
          padding: 0,
        },
        '*': {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          boxSizing: 'border-box',
        },
        // Remove scrollbar styling for minimal look
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: colors.offWhite,
        },
        '::-webkit-scrollbar-thumb': {
          background: colors.lightGray,
          '&:hover': {
            background: colors.gray,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 0,
          padding: `${spacing.sm}px ${spacing.lg}px`,
          fontWeight: 600,
          fontSize: '16px',
          transition: 'none', // No transitions
          '&:hover': {
            transform: 'none', // No hover effects
          },
        },
        contained: {
          background: colors.black,
          color: colors.white,
          boxShadow: 'none',
          border: `1px solid ${colors.black}`,
          '&:hover': {
            background: colors.black,
            boxShadow: 'none',
          },
          '&:active': {
            background: colors.black,
          },
        },
        outlined: {
          border: `1px solid ${colors.black}`,
          color: colors.black,
          background: colors.white,
          '&:hover': {
            background: colors.offWhite,
            border: `1px solid ${colors.black}`,
          },
        },
        text: {
          color: colors.black,
          padding: `${spacing.xs}px ${spacing.sm}px`,
          '&:hover': {
            background: 'transparent',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: colors.white,
          border: `1px solid ${colors.lightGray}`,
          borderRadius: 0,
          boxShadow: 'none',
          transition: 'none',
          '&:hover': {
            background: colors.white,
            borderColor: colors.black,
            boxShadow: 'none',
            transform: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: colors.white,
            borderRadius: 0,
            '& fieldset': {
              borderColor: colors.lightGray,
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: colors.gray,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.black,
              borderWidth: '1px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: colors.white,
          border: `1px solid ${colors.lightGray}`,
          borderRadius: 0,
          transition: 'none',
          '&:hover': {
            background: colors.offWhite,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: colors.white,
          color: colors.black,
          boxShadow: 'none',
          borderBottom: `1px solid ${colors.lightGray}`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: spacing.sm,
          transition: 'none',
          '&:hover': {
            background: colors.offWhite,
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: spacing.lg,
          paddingRight: spacing.lg,
        },
      },
    },
  },
});

export const minimalSpacing = spacing;
export const minimalColors = colors;
