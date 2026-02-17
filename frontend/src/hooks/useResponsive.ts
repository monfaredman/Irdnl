"use client";

import { useTheme, useMediaQuery } from "@mui/material";
import { useMemo } from "react";

/**
 * Breakpoint constants coordinated between MUI and Tailwind.
 *
 * MUI defaults:  xs=0, sm=600, md=900, lg=1200, xl=1536
 * Tailwind v4:   sm=640, md=768, lg=1024, xl=1280, 2xl=1536
 *
 * We define our semantic breakpoints using MUI values (the source of truth)
 * and keep Tailwind utilities for utility-class-only contexts.
 *
 * Rule: All JS-driven responsive logic uses this hook.
 *       Tailwind classes handle CSS-only responsive styling.
 *       Never duplicate the same breakpoint logic in both.
 */
export const BREAKPOINTS = {
	mobile: 0, // xs: 0-599
	tablet: 600, // sm: 600-899
	desktop: 900, // md: 900+
	wide: 1200, // lg: 1200+
	ultraWide: 1536, // xl: 1536+
} as const;

/**
 * Semantic device types derived from MUI breakpoints.
 */
export type DeviceType = "mobile" | "tablet" | "desktop";

/**
 * Central responsive hook.
 *
 * Returns stable, memoized breakpoint booleans.
 * Prefer this over raw `useMediaQuery` calls to:
 *   - Avoid duplicate MediaQueryList listeners
 *   - Ensure consistent breakpoint semantics
 *   - Keep a single source of truth
 *
 * Usage:
 *   const { isMobile, isTablet, isDesktop, deviceType } = useResponsive();
 */
export function useResponsive() {
	const theme = useTheme();

	// MUI's useMediaQuery is SSR-safe and uses matchMedia with listener cleanup.
	const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600
	const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600-899
	const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // >= 900
	const isWide = useMediaQuery(theme.breakpoints.up("lg")); // >= 1200
	const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md")); // < 900

	const deviceType: DeviceType = useMemo(() => {
		if (isMobile) return "mobile";
		if (isTablet) return "tablet";
		return "desktop";
	}, [isMobile, isTablet]);

	return useMemo(
		() => ({
			isMobile,
			isTablet,
			isDesktop,
			isWide,
			isMobileOrTablet,
			deviceType,
		}),
		[isMobile, isTablet, isDesktop, isWide, isMobileOrTablet, deviceType],
	);
}

/**
 * Responsive value helper.
 *
 * Returns a value based on the current device type.
 * Keeps logic declarative and avoids ternary chains.
 *
 * Usage:
 *   const cols = useResponsiveValue({ mobile: 1, tablet: 2, desktop: 4 });
 */
export function useResponsiveValue<T>(values: {
	mobile: T;
	tablet: T;
	desktop: T;
}): T {
	const { deviceType } = useResponsive();
	return values[deviceType];
}
