"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { liquidGlassTheme } from "@/theme/liquid-glass-theme";
import { PremiumLiquidGlassHeader } from "@/components/layout/PremiumLiquidGlassHeader";
import { PremiumLiquidGlassFooter } from "@/components/layout/PremiumLiquidGlassFooter";

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
      <PremiumLiquidGlassHeader />
      {children}
      <PremiumLiquidGlassFooter />
    </ThemeProvider>
  );
}
