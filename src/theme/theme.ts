'use client';

import { createTheme } from '@mui/material/styles';

// New vibrant color palette - Modern, fresh, distinct
const colors = {
  primary: {
    main: '#00d4ff', // Vibrant Cyan
    light: '#33ddff',
    dark: '#00a8cc',
    contrastText: '#000000',
  },
  secondary: {
    main: '#9333ea', // Rich Purple
    light: '#a855f7',
    dark: '#7e22ce',
    contrastText: '#ffffff',
  },
  tertiary: {
    main: '#f72585', // Hot Pink
    light: '#ff4da6',
    dark: '#d91a6b',
    contrastText: '#ffffff',
  },
  accent: {
    main: '#ff6b35', // Vibrant Orange
    light: '#ff8c5a',
    dark: '#e55a2b',
    contrastText: '#ffffff',
  },
  background: {
    default: '#0a0a0f',
    paper: 'rgba(255, 255, 255, 0.05)',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.75)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.06)',
    medium: 'rgba(255, 255, 255, 0.09)',
    strong: 'rgba(255, 255, 255, 0.14)',
    border: 'rgba(255, 255, 255, 0.12)',
    borderStrong: 'rgba(255, 255, 255, 0.18)',
  },
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    tertiary: colors.tertiary,
    accent: colors.accent,
    glass: colors.glass,
  } as any,
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: colors.background.default,
          color: colors.text.primary,
          overflowX: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `
              radial-gradient(circle at 20% 30%, rgba(0, 212, 255, 0.18) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.18) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(247, 37, 133, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 60% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)
            `,
            animation: 'liquidFloat 20s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 0,
          },
          '@keyframes liquidFloat': {
            '0%, 100%': {
              transform: 'translate(0, 0) scale(1)',
            },
            '33%': {
              transform: 'translate(3%, -3%) scale(1.05)',
            },
            '66%': {
              transform: 'translate(-3%, 3%) scale(0.95)',
            },
          },
        },
        '*': {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::-webkit-scrollbar': {
          width: '10px',
          height: '10px',
        },
        '::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
        },
        '::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 16,
          padding: '10px 24px',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 50%, ${colors.tertiary.main} 100%)`,
          boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 30px rgba(0, 212, 255, 0.4)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.secondary.light} 50%, ${colors.tertiary.light} 100%)`,
            boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 50px rgba(0, 212, 255, 0.6)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: colors.glass.light,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${colors.glass.border}`,
          boxShadow: `
            0 8px 32px 0 rgba(0, 0, 0, 0.37),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
          `,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: colors.glass.medium,
            borderColor: colors.primary.light,
            boxShadow: `
              0 8px 32px 0 rgba(0, 0, 0, 0.4),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
              0 0 60px rgba(0, 212, 255, 0.3)
            `,
            transform: 'scale(1.02)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: colors.glass.light,
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: 16,
            '& fieldset': {
              borderColor: colors.glass.border,
            },
            '&:hover fieldset': {
              borderColor: colors.glass.borderStrong,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.light,
              boxShadow: `0 0 20px rgba(0, 212, 255, 0.4)`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: colors.glass.light,
          backdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${colors.glass.border}`,
          borderRadius: 24,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: colors.glass.medium,
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
});

// Extend theme with custom properties
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    accent: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    glass: {
      light: string;
      medium: string;
      strong: string;
      border: string;
      borderStrong: string;
    };
  }
  interface PaletteOptions {
    tertiary?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    accent?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    glass?: {
      light: string;
      medium: string;
      strong: string;
      border: string;
      borderStrong: string;
    };
  }
}


