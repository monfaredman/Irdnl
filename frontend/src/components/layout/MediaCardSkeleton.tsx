/**
 * MediaCardSkeleton - Reusable skeleton for media cards
 */

"use client";

import { Box } from "@mui/material";
import { keyframes } from "@mui/system";
import {
	glassColors,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
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

interface MediaCardSkeletonProps {
	delay?: number;
	variant?: "poster" | "backdrop";
}

export function MediaCardSkeleton({
	delay = 0,
	variant = "poster",
}: MediaCardSkeletonProps) {
	const aspectRatio = variant === "poster" ? "2/3" : "16/9";

	return (
		<Box
			sx={{
				animation: `${fadeIn} 0.6s ease-out ${delay}ms both`,
			}}
		>
			{/* Image Placeholder */}
			<Box
				sx={{
					position: "relative",
					aspectRatio,
					mb: 1.5,
					background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
					backdropFilter: glassBlur.light,
					WebkitBackdropFilter: glassBlur.light,
					border: `1px solid ${glassColors.glass.border}`,
					borderRadius: glassBorderRadius.lg,
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
			>
				{/* Rating Badge */}
				<Box
					sx={{
						position: "absolute",
						top: 8,
						right: 8,
						width: 32,
						height: 32,
						background: glassColors.glass.strong,
						backdropFilter: glassBlur.medium,
						border: `1px solid ${glassColors.glass.border}`,
						borderRadius: "50%",
						animation: `${pulse} 2s ease-in-out infinite`,
					}}
				/>
			</Box>

			{/* Title Lines */}
			<Box
				sx={{
					height: 14,
					width: "85%",
					mb: 0.75,
					background: glassColors.glass.mid,
					backdropFilter: glassBlur.light,
					border: `1px solid ${glassColors.glass.border}`,
					borderRadius: glassBorderRadius.sm,
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
						animation: `${shimmer} 2s infinite 0.3s`,
					},
				}}
			/>
			<Box
				sx={{
					height: 14,
					width: "65%",
					mb: 0.75,
					background: glassColors.glass.mid,
					backdropFilter: glassBlur.light,
					border: `1px solid ${glassColors.glass.border}`,
					borderRadius: glassBorderRadius.sm,
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
						animation: `${shimmer} 2s infinite 0.5s`,
					},
				}}
			/>
			<Box
				sx={{
					height: 12,
					width: "45%",
					background: glassColors.glass.base,
					backdropFilter: glassBlur.light,
					border: `1px solid ${glassColors.glass.border}`,
					borderRadius: glassBorderRadius.sm,
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
						animation: `${shimmer} 2s infinite 0.7s`,
					},
				}}
			/>
		</Box>
	);
}
