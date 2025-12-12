"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { liquidGlassTheme } from "@/theme/liquid-glass-theme";
import { PremiumLiquidGlassHeader } from "@/components/layout/PremiumLiquidGlassHeader";
import { PremiumLiquidGlassFooter } from "@/components/layout/PremiumLiquidGlassFooter";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Admin routes get their own layout, skip the main site layout
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={liquidGlassTheme}>
      <CssBaseline />
      <PremiumLiquidGlassHeader />
      {children}
      <PremiumLiquidGlassFooter />
    </ThemeProvider>
  );
}
