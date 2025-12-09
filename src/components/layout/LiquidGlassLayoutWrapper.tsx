"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { liquidGlassTheme } from "@/theme/liquid-glass-theme";
import { LiquidGlassHeader } from "@/components/layout/LiquidGlassHeader";
import { LiquidGlassFooter } from "@/components/layout/LiquidGlassFooter";

/**
 * Liquid Glass Layout Wrapper
 * - Apple-inspired frosted glass aesthetic
 * - Extreme minimalism
 * - Premium experience
 */
export function LiquidGlassLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={liquidGlassTheme}>
      <CssBaseline />
      <LiquidGlassHeader />
      {children}
      <LiquidGlassFooter />
    </ThemeProvider>
  );
}
