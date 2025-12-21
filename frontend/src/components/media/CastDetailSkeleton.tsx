/**
 * CastDetailSkeleton - Loading placeholder for cast detail page
 */

"use client";

import { Box, Container, Skeleton } from "@mui/material";
import {
	glassBorderRadius,
	glassColors,
	glassStyles,
} from "@/theme/glass-design-system";

export function CastDetailSkeleton() {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: glassColors.deepMidnight,
			}}
		>
			{/* Hero Section Skeleton */}
			<Box
				sx={{
					position: "relative",
					height: { xs: "70vh", md: "80vh" },
					overflow: "hidden",
				}}
			>
				<Skeleton
					variant="rectangular"
					width="100%"
					height="100%"
					sx={{
						background: glassColors.glass.base,
					}}
				/>
				<Container
					maxWidth="lg"
					sx={{
						position: "absolute",
						bottom: 32,
						left: 0,
						right: 0,
					}}
				>
					<Skeleton
						variant="text"
						width="40%"
						height={60}
						sx={{
							background: glassColors.glass.strong,
							mb: 1,
						}}
					/>
					<Skeleton
						variant="text"
						width="20%"
						height={30}
						sx={{
							background: glassColors.glass.mid,
							mb: 3,
						}}
					/>
					<Box sx={{ display: "flex", gap: 2 }}>
						<Skeleton
							variant="rectangular"
							width={300}
							height={60}
							sx={{
								background: glassColors.glass.strong,
								borderRadius: glassBorderRadius.lg,
							}}
						/>
						{[1, 2, 3].map((i) => (
							<Skeleton
								key={i}
								variant="circular"
								width={48}
								height={48}
								sx={{
									background: glassColors.glass.mid,
								}}
							/>
						))}
					</Box>
				</Container>
			</Box>

			<Container maxWidth="lg" sx={{ pb: 8 }}>
				{/* Biography Skeleton */}
				<Box
					sx={{
						...glassStyles.card,
						p: 4,
						mb: 4,
						mt: -4,
					}}
				>
					<Skeleton
						variant="text"
						width="20%"
						height={40}
						sx={{
							background: glassColors.glass.mid,
							mb: 2,
						}}
					/>
					{[1, 2, 3, 4].map((i) => (
						<Skeleton
							key={i}
							variant="text"
							width={i === 4 ? "60%" : "100%"}
							height={24}
							sx={{
								background: glassColors.glass.base,
								mb: 1,
							}}
						/>
					))}
				</Box>

				{/* Known For Skeleton */}
				<Skeleton
					variant="text"
					width="30%"
					height={40}
					sx={{
						background: glassColors.glass.mid,
						mb: 3,
					}}
				/>
				<Box sx={{ display: "flex", gap: 2, mb: 4 }}>
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Skeleton
							key={i}
							variant="rectangular"
							width={150}
							height={225}
							sx={{
								background: glassColors.glass.strong,
								borderRadius: glassBorderRadius.lg,
								flexShrink: 0,
							}}
						/>
					))}
				</Box>

				{/* Filmography Skeleton */}
				<Skeleton
					variant="text"
					width="25%"
					height={40}
					sx={{
						background: glassColors.glass.mid,
						mb: 3,
					}}
				/>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, 1fr)",
							md: "repeat(3, 1fr)",
						},
						gap: 2,
					}}
				>
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Skeleton
							key={i}
							variant="rectangular"
							width="100%"
							height={120}
							sx={{
								background: glassColors.glass.strong,
								borderRadius: glassBorderRadius.lg,
							}}
						/>
					))}
				</Box>
			</Container>
		</Box>
	);
}
