"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { minimalTheme } from "@/theme/minimal-theme";
import { MinimalHeader } from "@/components/layout/MinimalHeader";
import { MinimalFooter } from "@/components/layout/MinimalFooter";

/**
 * Minimal Layout Wrapper
 * - Uses minimal theme
 * - Simplified header and footer
 * - Clean structure
 */
export function MinimalLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={minimalTheme}>
      <CssBaseline />
      <MinimalHeader />
      {children}
      <MinimalFooter />
    </ThemeProvider>
  );
}
