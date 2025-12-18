/**
 * SkeletonLoader - Premium Liquid Glass skeleton loading components
 */

"use client";

import { Box, Container } from "@mui/material";
import { keyframes } from "@mui/system";
import {
	glassColors,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";

// ============================================================================
// ANIMATIONS
// ============================================================================

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
  }
`;

// ============================================================================
// BASE GLASS SKELETON
// ============================================================================

interface GlassSkeletonProps {
	width?: string | number;
	height?: string | number;
	borderRadius?: string | number;
	delay?: number;
	variant?: "rect" | "circle" | "pill";
	animation?: "shimmer" | "pulse" | "glow";
}

function GlassSkeleton({
	width = "100%",
	height = 20,
	borderRadius,
	delay = 0,
	variant = "rect",
	animation = "shimmer",
}: GlassSkeletonProps) {
	const getRadius = () => {
		if (borderRadius) return borderRadius;
		if (variant === "circle") return "50%";
		if (variant === "pill") return glassBorderRadius.pill;
		return glassBorderRadius.md;
	};

	return (
		<Box
			sx={{
				width,
				height,
				background: glassColors.glass.mid,
				backdropFilter: glassBlur.light,
				WebkitBackdropFilter: glassBlur.light,
				border: `1px solid ${glassColors.glass.border}`,
				borderRadius: getRadius(),
				position: "relative",
				overflow: "hidden",
				animation: `${fadeIn} 0.6s ease-out ${delay}ms both`,
				...(animation === "pulse" && {
					animation: `${pulse} 2s ease-in-out infinite`,
				}),
				...(animation === "glow" && {
					animation: `${glowPulse} 3s ease-in-out infinite`,
				}),
				// Shimmer effect
				...(animation === "shimmer" && {
					"&::after": {
						content: '""',
						position: "absolute",
						top: 0,
						left: "-100%",
						width: "100%",
						height: "100%",
						background: `linear-gradient(90deg, transparent, ${glassColors.glass.border}, transparent)`,
						animation: `${shimmer} 2s infinite`,
					},
				}),
			}}
		/>
	);
}

// ============================================================================
// HERO SECTION SKELETON
// ============================================================================

export function HeroSkeleton() {
	return (
		<Box
			sx={{
				width: "100%",
				height: { xs: 300, md: 400 },
				mb: 4,
				position: "relative",
			}}
		>
			{/* Main Hero Panel */}
			<Box
				sx={{
					width: { xs: "100%", md: "80%" },
					height: "100%",
					background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
					backdropFilter: glassBlur.medium,
					WebkitBackdropFilter: glassBlur.medium,
					border: `1px solid ${glassColors.glass.border}`,
					borderRadius: glassBorderRadius.xl,
					p: { xs: 3, md: 4 },
					position: "relative",
					overflow: "hidden",
					animation: `${fadeIn} 0.8s ease-out`,
					// Diagonal shimmer
					"&::after": {
						content: '""',
						position: "absolute",
						top: "-50%",
						left: "-50%",
						width: "200%",
						height: "200%",
						background: `linear-gradient(135deg, transparent, ${glassColors.glass.border}, transparent)`,
						animation: `${shimmer} 3s infinite`,
					},
				}}
			>
				{/* Title Placeholders */}
				<Box sx={{ position: "relative", zIndex: 1, mb: 3 }}>
					<GlassSkeleton width="40%" height={40} delay={200} />
					<Box sx={{ mt: 1 }}>
						<GlassSkeleton width="30%" height={32} delay={300} />
					</Box>
				</Box>

				{/* Metadata Pills */}
				<Box
					sx={{
						display: "flex",
						gap: 1,
						flexWrap: "wrap",
						position: "relative",
						zIndex: 1,
					}}
				>
					<GlassSkeleton
						width={80}
						height={32}
						variant="pill"
						delay={400}
						animation="pulse"
					/>
					<GlassSkeleton
						width={100}
						height={32}
						variant="pill"
						delay={500}
						animation="pulse"
					/>
					<GlassSkeleton
						width={90}
						height={32}
						variant="pill"
						delay={600}
						animation="pulse"
					/>
					<GlassSkeleton
						width={120}
						height={32}
						variant="pill"
						delay={700}
						animation="pulse"
					/>
				</Box>
			</Box>
		</Box>
	);
}

// ============================================================================
// NAVIGATION/FILTER BAR SKELETON
// ============================================================================

export function FilterBarSkeleton() {
	const pills = [120, 100, 140, 90, 110];

	return (
		<Box
			sx={{
				display: "flex",
				gap: 2,
				mb: 4,
				overflowX: "auto",
				pb: 1,
			}}
		>
			{pills.map((width, index) => (
				<GlassSkeleton
					key={index}
					width={width}
					height={40}
					variant="pill"
					delay={200 + index * 100}
					animation="pulse"
				/>
			))}
		</Box>
	);
}

// ============================================================================
// CONTENT GRID SKELETON
// ============================================================================

interface ContentGridSkeletonProps {
	count?: number;
}

export function ContentGridSkeleton({ count = 8 }: ContentGridSkeletonProps) {
	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: {
					xs: "repeat(2, 1fr)",
					sm: "repeat(3, 1fr)",
					md: "repeat(4, 1fr)",
				},
				gap: 3,
				mb: 4,
			}}
		>
			{Array.from({ length: count }).map((_, index) => (
				<Box
					key={index}
					sx={{
						animation: `${fadeIn} 0.6s ease-out ${400 + Math.floor(index / 4) * 100 + (index % 4) * 50}ms both`,
					}}
				>
					{/* Poster Placeholder */}
					<Box
						sx={{
							position: "relative",
							aspectRatio: "2/3",
							mb: 2,
							background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
							backdropFilter: glassBlur.light,
							WebkitBackdropFilter: glassBlur.light,
							border: `1px solid ${glassColors.glass.border}`,
							borderRadius: glassBorderRadius.lg,
							overflow: "hidden",
							// Random glow effect
							...(index === 2 && {
								animation: `${glowPulse} 3s ease-in-out infinite`,
							}),
							// Shimmer
							"&::after": {
								content: '""',
								position: "absolute",
								top: 0,
								left: "-100%",
								width: "100%",
								height: "100%",
								background: `linear-gradient(90deg, transparent, ${glassColors.glass.border}, transparent)`,
								animation: `${shimmer} 2.5s infinite ${index * 0.2}s`,
							},
						}}
					>
						{/* Rating Badge Placeholder */}
						<Box
							sx={{
								position: "absolute",
								top: 8,
								right: 8,
								width: 36,
								height: 36,
								background: glassColors.glass.strong,
								backdropFilter: glassBlur.medium,
								border: `1px solid ${glassColors.glass.border}`,
								borderRadius: "50%",
								animation: `${pulse} 2s ease-in-out infinite`,
							}}
						/>
					</Box>

					{/* Text Lines */}
					<Box sx={{ px: 0.5 }}>
						<GlassSkeleton
							width="90%"
							height={16}
							delay={500 + index * 50}
						/>
						<Box sx={{ mt: 1 }}>
							<GlassSkeleton
								width="70%"
								height={16}
								delay={550 + index * 50}
							/>
						</Box>
						<Box sx={{ mt: 1 }}>
							<GlassSkeleton
								width="50%"
								height={14}
								delay={600 + index * 50}
							/>
						</Box>
					</Box>
				</Box>
			))}
		</Box>
	);
}

// ============================================================================
// SIDEBAR SKELETON
// ============================================================================

export function SidebarSkeleton() {
	return (
		<Box
			sx={{
				display: { xs: "none", lg: "block" },
				position: "sticky",
				top: 100,
			}}
		>
			{/* Trending Panel */}
			<Box
				sx={{
					p: 3,
					mb: 3,
					background: glassColors.glass.mid,
					backdropFilter: glassBlur.medium,
					border: `1px solid ${glassColors.glass.border}`,
					borderRadius: glassBorderRadius.lg,
					animation: `${fadeIn} 0.6s ease-out 600ms both`,
				}}
			>
				<GlassSkeleton width="60%" height={20} delay={700} />

				{/* List Items */}
				{[0, 1, 2].map((index) => (
					<Box
						key={index}
						sx={{
							display: "flex",
							gap: 2,
							mt: 2,
							animation: `${fadeIn} 0.6s ease-out ${800 + index * 100}ms both`,
						}}
					>
						<GlassSkeleton width={48} height={48} variant="circle" />
						<Box sx={{ flex: 1 }}>
							<GlassSkeleton width="80%" height={14} />
							<Box sx={{ mt: 1 }}>
								<GlassSkeleton width="60%" height={12} />
							</Box>
						</Box>
					</Box>
				))}
			</Box>

			{/* Coming Soon Panel */}
			<Box
				sx={{
					p: 3,
					background: glassColors.glass.mid,
					backdropFilter: glassBlur.medium,
					border: `1px solid ${glassColors.glass.border}`,
					borderRadius: glassBorderRadius.lg,
					animation: `${fadeIn} 0.6s ease-out 1000ms both`,
				}}
			>
				<GlassSkeleton width="70%" height={20} delay={1100} />
				<Box sx={{ mt: 2 }}>
					<GlassSkeleton width="100%" height={120} delay={1200} />
				</Box>
				<Box sx={{ mt: 2 }}>
					<GlassSkeleton width="90%" height={14} delay={1300} />
				</Box>
			</Box>
		</Box>
	);
}

// ============================================================================
// FEATURED CATEGORIES SKELETON
// ============================================================================

export function FeaturedCategoriesSkeleton() {
	return (
		<Box sx={{ mb: 4 }}>
			{[0, 1, 2].map((categoryIndex) => (
				<Box
					key={categoryIndex}
					sx={{
						mb: 4,
						animation: `${fadeIn} 0.6s ease-out ${800 + categoryIndex * 200}ms both`,
					}}
				>
					{/* Category Title */}
					<GlassSkeleton
						width={200}
						height={28}
						delay={900 + categoryIndex * 200}
					/>

					{/* Horizontal Scrollable Grid */}
					<Box
						sx={{
							display: "flex",
							gap: 2,
							mt: 2,
							overflowX: "hidden",
						}}
					>
						{[0, 1, 2, 3, 4].map((itemIndex) => (
							<Box
								key={itemIndex}
								sx={{
									flexShrink: 0,
									width: { xs: 140, md: 180 },
									animation: `${fadeIn} 0.6s ease-out ${1000 + categoryIndex * 200 + itemIndex * 50}ms both`,
								}}
							>
								<Box
									sx={{
										aspectRatio: "2/3",
										background: glassColors.glass.mid,
										backdropFilter: glassBlur.light,
										border: `1px solid ${glassColors.glass.border}`,
										borderRadius: glassBorderRadius.md,
										position: "relative",
										overflow: "hidden",
										"&::after": {
											content: '""',
											position: "absolute",
											top: 0,
											left: "-100%",
											width: "100%",
											height: "100%",
											background: `linear-gradient(90deg, transparent, ${glassColors.glass.border}, transparent)`,
											animation: `${shimmer} 2s infinite ${itemIndex * 0.3}s`,
										},
									}}
								/>
								<Box sx={{ mt: 1 }}>
									<GlassSkeleton width="90%" height={12} />
								</Box>
							</Box>
						))}
					</Box>
				</Box>
			))}
		</Box>
	);
}

// ============================================================================
// MAIN PAGE SKELETON (COMPOSITE)
// ============================================================================

export function MainPageSkeleton() {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				pt: { xs: 10, md: 12 },
				pb: 8,
				background: glassColors.deepMidnight,
			}}
		>
			<Container maxWidth="xl">
				{/* Hero Section */}
				<HeroSkeleton />

				{/* Filter Bar */}
				<FilterBarSkeleton />

				{/* Main Content Grid */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", lg: "1fr 300px" },
						gap: 4,
					}}
				>
					{/* Content Area */}
					<Box>
						<ContentGridSkeleton count={8} />
						<FeaturedCategoriesSkeleton />
					</Box>

					{/* Sidebar */}
					<SidebarSkeleton />
				</Box>
			</Container>
		</Box>
	);
}
