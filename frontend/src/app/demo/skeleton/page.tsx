/**
 * Skeleton Demo Page - Showcase all skeleton loading states
 * Route: /demo/skeleton
 */

"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { useState } from "react";
import {
	MainPageSkeleton,
	HeroSkeleton,
	FilterBarSkeleton,
	ContentGridSkeleton,
	SidebarSkeleton,
	FeaturedCategoriesSkeleton,
	MediaCardSkeleton,
	CarouselSkeleton,
} from "@/components/layout";
import { glassColors, glassBorderRadius } from "@/theme/glass-design-system";

export default function SkeletonDemoPage() {
	const [activeDemo, setActiveDemo] = useState<string>("full");

	const demos = [
		{ id: "full", label: "Full Page Skeleton", component: <MainPageSkeleton /> },
		{
			id: "hero",
			label: "Hero Section",
			component: (
				<Box sx={{ p: 4, background: glassColors.deepMidnight }}>
					<HeroSkeleton />
				</Box>
			),
		},
		{
			id: "filter",
			label: "Filter Bar",
			component: (
				<Box sx={{ p: 4, background: glassColors.deepMidnight }}>
					<FilterBarSkeleton />
				</Box>
			),
		},
		{
			id: "grid",
			label: "Content Grid",
			component: (
				<Box sx={{ p: 4, background: glassColors.deepMidnight }}>
					<ContentGridSkeleton count={8} />
				</Box>
			),
		},
		{
			id: "carousel",
			label: "Carousel",
			component: <CarouselSkeleton count={6} />,
		},
		{
			id: "cards",
			label: "Media Cards",
			component: (
				<Box
					sx={{
						p: 4,
						background: glassColors.deepMidnight,
						display: "grid",
						gridTemplateColumns: "repeat(4, 1fr)",
						gap: 3,
					}}
				>
					{Array.from({ length: 4 }).map((_, i) => (
						<MediaCardSkeleton key={i} delay={i * 100} />
					))}
				</Box>
			),
		},
		{
			id: "sidebar",
			label: "Sidebar",
			component: (
				<Box
					sx={{
						p: 4,
						background: glassColors.deepMidnight,
						maxWidth: 300,
					}}
				>
					<SidebarSkeleton />
				</Box>
			),
		},
		{
			id: "categories",
			label: "Featured Categories",
			component: (
				<Box sx={{ p: 4, background: glassColors.deepMidnight }}>
					<FeaturedCategoriesSkeleton />
				</Box>
			),
		},
	];

	const currentDemo = demos.find((d) => d.id === activeDemo);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: glassColors.deepMidnight,
				pt: 12,
			}}
		>
			<Container maxWidth="xl">
				{/* Header */}
				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h3"
						sx={{
							color: glassColors.text.primary,
							fontWeight: 800,
							mb: 1,
						}}
					>
						Skeleton Loading Components
					</Typography>
					<Typography
						sx={{
							color: glassColors.text.secondary,
							fontSize: "1.125rem",
						}}
					>
						Premium Liquid Glass skeleton loaders for IrDnl
					</Typography>
				</Box>

				{/* Demo Selector */}
				<Box
					sx={{
						display: "flex",
						gap: 2,
						mb: 4,
						flexWrap: "wrap",
					}}
				>
					{demos.map((demo) => (
						<Button
							key={demo.id}
							onClick={() => setActiveDemo(demo.id)}
							variant={activeDemo === demo.id ? "contained" : "outlined"}
							sx={{
								background:
									activeDemo === demo.id
										? `linear-gradient(135deg, ${glassColors.gold.solid}, #D97706)`
										: glassColors.glass.mid,
								color:
									activeDemo === demo.id
										? glassColors.black
										: glassColors.text.primary,
								border: `1px solid ${activeDemo === demo.id ? glassColors.gold.solid : glassColors.glass.border}`,
								borderRadius: glassBorderRadius.pill,
								px: 3,
								textTransform: "none",
								fontWeight: 600,
								"&:hover": {
									background:
										activeDemo === demo.id
											? `linear-gradient(135deg, #FBBF24, ${glassColors.gold.solid})`
											: glassColors.glass.strong,
								},
							}}
						>
							{demo.label}
						</Button>
					))}
				</Box>

				{/* Demo Display */}
				<Box
					sx={{
						border: `1px solid ${glassColors.glass.border}`,
						borderRadius: glassBorderRadius.xl,
						overflow: "hidden",
						background: glassColors.deepMidnight,
					}}
				>
					{currentDemo?.component}
				</Box>

				{/* Info */}
				<Box
					sx={{
						mt: 4,
						p: 3,
						background: glassColors.glass.mid,
						border: `1px solid ${glassColors.glass.border}`,
						borderRadius: glassBorderRadius.lg,
					}}
				>
					<Typography
						sx={{
							color: glassColors.text.primary,
							fontWeight: 600,
							mb: 1,
						}}
					>
						Implementation Details:
					</Typography>
					<Typography
						sx={{
							color: glassColors.text.secondary,
							fontSize: "0.875rem",
							fontFamily: "monospace",
						}}
					>
						{`import { ${currentDemo?.id === "full" ? "MainPageSkeleton" : currentDemo?.label.replace(" ", "")} } from "@/components/layout";`}
					</Typography>
				</Box>
			</Container>
		</Box>
	);
}
