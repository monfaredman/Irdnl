"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { liquidGlassTheme } from "@/theme/liquid-glass-theme";
import { PremiumLiquidGlassHeader } from "@/components/layout/PremiumLiquidGlassHeader";
import { PremiumLiquidGlassFooter } from "@/components/layout/PremiumLiquidGlassFooter";

/**
 * Premium Liquid Glass Layout
 * - Apple-inspired frosted glass aesthetic
 * - Always-on premium header + footer
 */
export function PremiumLiquidGlassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={liquidGlassTheme}>
      <CssBaseline />
      <PremiumLiquidGlassHeader />
      {children}
      <PremiumLiquidGlassFooter />
    </ThemeProvider>
  );
}
