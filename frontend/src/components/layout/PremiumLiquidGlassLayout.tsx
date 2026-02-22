"use client";

import { AppBar, Box, CssBaseline, ThemeProvider } from "@mui/material";
import { usePathname } from "next/navigation";
import { PremiumLiquidGlassFooter } from "@/components/layout/PremiumLiquidGlassFooter";
import { PremiumLiquidGlassHeader } from "@/components/layout/PremiumLiquidGlassHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { liquidGlassTheme } from "@/theme/liquid-glass-theme";

/**
 * Premium Liquid Glass Layout
 * - Apple-inspired frosted glass aesthetic
 * - Always-on premium header + footer
 * - Mobile bottom navigation bar (hidden on desktop)
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
			<Box sx={{ mt: "30px", pb: { xs: "56px", md: 0 } }}>{children}</Box>
			<PremiumLiquidGlassFooter />
			<MobileBottomNav />
		</ThemeProvider>
	);
}
