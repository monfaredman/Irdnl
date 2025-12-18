/**
 * CarouselSkeleton - Skeleton for horizontal carousel sections
 */

"use client";

import { Box, Container } from "@mui/material";
import { keyframes } from "@mui/system";
import { MediaCardSkeleton } from "./MediaCardSkeleton";
import {
	glassColors,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";

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

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

interface CarouselSkeletonProps {
	count?: number;
	delay?: number;
}

export function CarouselSkeleton({ count = 6, delay = 0 }: CarouselSkeletonProps) {
	return (
		<Box
			sx={{
				py: { xs: 3, md: 4 },
				animation: `${fadeIn} 0.6s ease-out ${delay}ms both`,
			}}
		>
			<Container maxWidth="xl">
				{/* Title Skeleton */}
				<Box
					sx={{
						height: 28,
						width: { xs: 180, md: 220 },
						mb: 3,
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
							animation: `${shimmer} 2s infinite`,
						},
					}}
				/>

				{/* Carousel Items */}
				<Box
					sx={{
						display: "flex",
						gap: { xs: 2, md: 3 },
						overflowX: "hidden",
					}}
				>
					{Array.from({ length: count }).map((_, index) => (
						<Box
							key={index}
							sx={{
								flexShrink: 0,
								width: { xs: 140, sm: 160, md: 180 },
							}}
						>
							<MediaCardSkeleton delay={delay + 100 + index * 50} />
						</Box>
					))}
				</Box>
			</Container>
		</Box>
	);
}
