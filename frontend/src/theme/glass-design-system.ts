/**
 * LIQUID GLASS DESIGN SYSTEM
 *
 * Centralized design tokens and reusable styles for irdnl
 * Apple-inspired frosted glass aesthetic with Persian cultural elements
 *
 * Usage:
 * import { glassStyles, glassAnimations, glassColors } from '@/theme/glass-design-system';
 *
 * Apply to components:
 * <Box sx={glassStyles.card}>...</Box>
 * <Button sx={glassStyles.pillButton}>...</Button>
 */

import type { SxProps, Theme } from "@mui/material";

// ============================================================================
// GLASS COLORS
// ============================================================================

export const glassColors = {
	// Base colors
	deepMidnight: "#0A0A0A",
	black: "#000000",
	white: "#FFFFFF",
	persianGold: "#F59E0B",

	// Glass opacity layers
	glass: {
		base: "rgba(255, 255, 255, 0.02)",
		mid: "rgba(255, 255, 255, 0.05)",
		strong: "rgba(255, 255, 255, 0.08)",
		border: "rgba(255, 255, 255, 0.1)",
	},

	// Text hierarchy
	text: {
		primary: "#FFFFFF",
		secondary: "rgba(255, 255, 255, 0.7)",
		tertiary: "rgba(255, 255, 255, 0.5)",
		muted: "rgba(255, 255, 255, 0.3)",
	},

	// Persian Gold variations
	gold: {
		solid: "#F59E0B",
		light: "#F59E0B40", // 40% opacity
		lighter: "#F59E0B20", // 20% opacity
		glow: "#F59E0B30", // 30% opacity for shadows
	},
};

// ============================================================================
// GLASS ANIMATIONS
// ============================================================================

export const glassAnimations = {
	// Spring easing (Apple-style bounce)
	spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",

	// Smooth easing
	smooth: "cubic-bezier(0.4, 0, 0.2, 1)",

	// Duration presets
	duration: {
		fast: "0.2s",
		normal: "0.3s",
		slow: "0.4s",
		slower: "0.5s",
	},

	// Common transitions
	transition: {
		spring: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
		springFast: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
		springSlow: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
		smooth: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
	},
};

// ============================================================================
// GLASS SPACING (8px Grid System)
// ============================================================================

export const glassSpacing = {
	xs: 8, // 0.5rem
	sm: 16, // 1rem
	md: 24, // 1.5rem
	lg: 32, // 2rem
	xl: 64, // 4rem
	xxl: 128, // 8rem
};

// ============================================================================
// GLASS BORDER RADIUS
// ============================================================================

export const glassBorderRadius = {
	sm: "8px",
	md: "12px",
	lg: "16px",
	xl: "20px",
	xxl: "24px",
	pill: "24px", // For pill buttons
	circle: "50%",
};

// ============================================================================
// GLASS BLUR VALUES
// ============================================================================

export const glassBlur = {
	light: "blur(8px) saturate(120%)",
	medium: "blur(20px) saturate(180%)",
	strong: "blur(40px) saturate(180%)",
};

// ============================================================================
// REUSABLE GLASS STYLES
// ============================================================================

export const glassStyles = {
	// -------------------------------------------------------------------------
	// GLASS CARD (Base container)
	// -------------------------------------------------------------------------
	card: {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: glassBlur.medium,
		WebkitBackdropFilter: glassBlur.medium,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.lg,
		boxShadow: `0 8px 32px -4px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
		transition: glassAnimations.transition.spring,
	} as SxProps<Theme>,

	// -------------------------------------------------------------------------
	// GLASS CARD WITH HOVER EFFECT
	// -------------------------------------------------------------------------
	cardHover: {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: glassBlur.medium,
		WebkitBackdropFilter: glassBlur.medium,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.lg,
		boxShadow: `0 8px 32px -4px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
		transition: glassAnimations.transition.spring,
		"&:hover": {
			transform: "translateY(-4px) scale(1.02)",
			boxShadow: `0 16px 48px -8px rgba(0, 0, 0, 0.4),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.15)`,
			border: `1px solid ${glassColors.gold.light}`,
		},
	} as SxProps<Theme>,

	// -------------------------------------------------------------------------
	// PILL BUTTON (Navigation/CTA)
	// -------------------------------------------------------------------------
	pillButton: (isActive: boolean = false) =>
		({
			px: 3,
			py: 1,
			borderRadius: glassBorderRadius.pill,
			position: "relative",
			overflow: "hidden",
			color: isActive ? glassColors.persianGold : glassColors.white,
			fontSize: "0.875rem",
			fontWeight: 500,
			textTransform: "none",
			background: isActive
				? `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`
				: "transparent",
			border: isActive
				? `1px solid ${glassColors.gold.light}`
				: "1px solid transparent",
			transition: glassAnimations.transition.spring,
			"&::before": {
				content: '""',
				position: "absolute",
				top: 0,
				left: "-100%",
				width: "100%",
				height: "100%",
				background: `linear-gradient(90deg, transparent, ${glassColors.glass.strong}, transparent)`,
				transition: `left ${glassAnimations.duration.slower} ${glassAnimations.spring}`,
			},
			"&:hover": {
				background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
				border: `1px solid ${glassColors.glass.border}`,
				transform: "translateY(-2px)",
				boxShadow: `0 8px 16px -4px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
				"&::before": {
					left: "100%",
				},
			},
		}) as SxProps<Theme>,

	// -------------------------------------------------------------------------
	// GLASS LINK (Footer/Navigation)
	// -------------------------------------------------------------------------
	link: {
		color: glassColors.text.secondary,
		textDecoration: "none",
		fontSize: "0.875rem",
		fontWeight: 400,
		display: "inline-block",
		position: "relative",
		padding: "4px 0",
		transition: glassAnimations.transition.spring,
		"&::after": {
			content: '""',
			position: "absolute",
			bottom: 0,
			left: 0,
			width: 0,
			height: "1px",
			background: `linear-gradient(90deg, ${glassColors.persianGold}, transparent)`,
			transition: `width ${glassAnimations.duration.slow} ${glassAnimations.spring}`,
		},
		"&:hover": {
			color: glassColors.white,
			transform: "translateX(4px)",
			"&::after": {
				width: "100%",
			},
		},
	} as SxProps<Theme>,

	// -------------------------------------------------------------------------
	// GLASS ICON BUTTON (Social/Actions)
	// -------------------------------------------------------------------------
	iconButton: {
		width: 40,
		height: 40,
		position: "relative",
		overflow: "hidden",
		background: glassColors.glass.base,
		border: `1px solid ${glassColors.glass.border}`,
		backdropFilter: "blur(10px)",
		transition: glassAnimations.transition.spring,
		"&::before": {
			content: '""',
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "0%",
			background: `linear-gradient(180deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
			transition: `height ${glassAnimations.duration.slow} ${glassAnimations.spring}`,
		},
		"&:hover": {
			transform: "translateY(-4px) scale(1.05)",
			border: `1px solid ${glassColors.gold.light}`,
			boxShadow: `0 8px 24px -4px ${glassColors.gold.glow},
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
			"&::before": {
				height: "100%",
			},
		},
		"& svg": {
			position: "relative",
			zIndex: 1,
			color: glassColors.text.secondary,
			transition: `color ${glassAnimations.duration.normal} ease`,
		},
		"&:hover svg": {
			color: glassColors.white,
		},
	} as SxProps<Theme>,

	// -------------------------------------------------------------------------
	// GLASS INPUT (Search/Forms)
	// -------------------------------------------------------------------------
	input: {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: glassBlur.medium,
		WebkitBackdropFilter: glassBlur.medium,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.xl,
		color: glassColors.white,
		transition: glassAnimations.transition.spring,
		"& input": {
			color: glassColors.white,
		},
		"& ::placeholder": {
			color: glassColors.text.tertiary,
			opacity: 1,
		},
		"&:hover": {
			border: `1px solid ${glassColors.glass.border}`,
			boxShadow: `0 4px 16px -2px rgba(0, 0, 0, 0.2)`,
		},
		"&:focus-within": {
			border: `1px solid ${glassColors.gold.light}`,
			boxShadow: `0 8px 24px -4px ${glassColors.gold.glow},
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
		},
	} as SxProps<Theme>,

	// -------------------------------------------------------------------------
	// GLASS BORDER (Dividers)
	// -------------------------------------------------------------------------
	border: {
		top: {
			borderTop: `1px solid ${glassColors.glass.border}`,
		},
		bottom: {
			borderBottom: `1px solid ${glassColors.glass.border}`,
		},
		left: {
			borderLeft: `1px solid ${glassColors.glass.border}`,
		},
		right: {
			borderRight: `1px solid ${glassColors.glass.border}`,
		},
		all: {
			border: `1px solid ${glassColors.glass.border}`,
		},
	},

	// -------------------------------------------------------------------------
	// GLASS HEADER (Scroll-aware)
	// -------------------------------------------------------------------------
	header: (scrolled: boolean = false) =>
		({
			background: scrolled
				? `linear-gradient(180deg, ${glassColors.glass.mid}, ${glassColors.glass.base})`
				: "transparent",
			backdropFilter: scrolled ? glassBlur.medium : glassBlur.light,
			WebkitBackdropFilter: scrolled ? glassBlur.medium : glassBlur.light,
			borderBottom: scrolled
				? `1px solid ${glassColors.glass.border}`
				: "1px solid transparent",
			boxShadow: scrolled
				? `inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
         0 4px 24px -2px rgba(0, 0, 0, 0.2)`
				: "none",
			transition: glassAnimations.transition.spring,
		}) as SxProps<Theme>,

	// -------------------------------------------------------------------------
	// GLASS LOGO/MONOGRAM
	// -------------------------------------------------------------------------
	logo: {
		width: 48,
		height: 48,
		borderRadius: glassBorderRadius.md,
		background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
		backdropFilter: "blur(10px)",
		border: `1px solid ${glassColors.persianGold}60`,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontWeight: 700,
		fontSize: "1.5rem",
		color: glassColors.persianGold,
		boxShadow: `0 4px 16px -2px ${glassColors.gold.glow},
                inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
		transition: glassAnimations.transition.spring,
		"&:hover": {
			transform: "translateY(-2px)",
		},
	} as SxProps<Theme>,

	// -------------------------------------------------------------------------
	// PERSIAN PATTERN BACKGROUND
	// -------------------------------------------------------------------------
	persianPattern: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0.03,
		backgroundImage: `
      radial-gradient(circle at 25% 25%, ${glassColors.gold.light} 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, ${glassColors.gold.light} 0%, transparent 50%)
    `,
		backgroundSize: "100px 100px",
		pointerEvents: "none",
	} as SxProps<Theme>,
};

// ============================================================================
// SLIDER/CAROUSEL SPECIFIC STYLES
// ============================================================================

export const sliderStyles = {
	// Container for slider
	container: {
		position: "relative",
		width: "100%",
		overflow: "hidden",
	} as SxProps<Theme>,

	// Slide item
	slide: (isActive: boolean = false) =>
		({
			transition: `all ${glassAnimations.duration.slow} ${glassAnimations.spring}`,
			transform: isActive ? "scale(1.05)" : "scale(1)",
			opacity: isActive ? 1 : 0.7,
		}) as SxProps<Theme>,

	// Navigation arrows
	arrow: {
		width: 48,
		height: 48,
		borderRadius: glassBorderRadius.circle,
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: glassBlur.medium,
		WebkitBackdropFilter: glassBlur.medium,
		border: `1px solid ${glassColors.glass.border}`,
		color: glassColors.white,
		transition: glassAnimations.transition.spring,
		"&:hover": {
			background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
			border: `1px solid ${glassColors.gold.light}`,
			transform: "scale(1.1)",
			boxShadow: `0 8px 24px -4px ${glassColors.gold.glow}`,
		},
		"&:disabled": {
			opacity: 0.3,
			pointerEvents: "none",
		},
	} as SxProps<Theme>,

	// Dot indicators
	dot: (isActive: boolean = false) =>
		({
			width: isActive ? 24 : 8,
			height: 8,
			borderRadius: glassBorderRadius.sm,
			background: isActive
				? `linear-gradient(90deg, ${glassColors.persianGold}, ${glassColors.gold.light})`
				: glassColors.glass.border,
			border: isActive
				? `1px solid ${glassColors.persianGold}`
				: `1px solid ${glassColors.glass.border}`,
			transition: glassAnimations.transition.spring,
			cursor: "pointer",
			"&:hover": {
				background: glassColors.gold.lighter,
			},
		}) as SxProps<Theme>,

	// Slide overlay (for text/CTA)
	overlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 4,
		background: `linear-gradient(180deg, transparent, ${glassColors.deepMidnight}CC)`,
		backdropFilter: glassBlur.medium,
		WebkitBackdropFilter: glassBlur.medium,
	} as SxProps<Theme>,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a glass gradient background
 */
export const createGlassGradient = (
	direction: string = "135deg",
	startOpacity: number = 0.08,
	endOpacity: number = 0.05,
) => {
	return `linear-gradient(${direction}, rgba(255, 255, 255, ${startOpacity}), rgba(255, 255, 255, ${endOpacity}))`;
};

/**
 * Create a Persian Gold gradient
 */
export const createGoldGradient = (
	direction: string = "135deg",
	startOpacity: number = 0.4,
	endOpacity: number = 0.2,
) => {
	return `linear-gradient(${direction}, ${glassColors.persianGold}${Math.round(startOpacity * 255).toString(16)}, ${glassColors.persianGold}${Math.round(endOpacity * 255).toString(16)})`;
};

/**
 * Create a glass shadow
 */
export const createGlassShadow = (
	blur: number = 32,
	spread: number = -4,
	opacity: number = 0.3,
) => {
	return `0 ${blur / 2}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity}),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`;
};

/**
 * Create a glow shadow with Persian Gold
 */
export const createGoldGlow = (
	blur: number = 24,
	spread: number = -4,
	opacity: number = 0.3,
) => {
	return `0 ${blur / 2}px ${blur}px ${spread}px ${glassColors.persianGold}${Math.round(opacity * 255).toString(16)}`;
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export const glassDesignSystem = {
	colors: glassColors,
	animations: glassAnimations,
	spacing: glassSpacing,
	borderRadius: glassBorderRadius,
	blur: glassBlur,
	styles: glassStyles,
	slider: sliderStyles,
	utils: {
		createGlassGradient,
		createGoldGradient,
		createGlassShadow,
		createGoldGlow,
	},
};

export default glassDesignSystem;
