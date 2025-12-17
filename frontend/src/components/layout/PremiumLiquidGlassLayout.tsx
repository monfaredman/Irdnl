"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { usePathname } from "next/navigation";
import { PremiumLiquidGlassFooter } from "@/components/layout/PremiumLiquidGlassFooter";
import { PremiumLiquidGlassHeader } from "@/components/layout/PremiumLiquidGlassHeader";
import { liquidGlassTheme } from "@/theme/liquid-glass-theme";

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
	const isAdminRoute = pathname?.startsWith("/admin");

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
