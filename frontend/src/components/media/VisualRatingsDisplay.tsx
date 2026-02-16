/**
 * VisualRatingsDisplay - Circular rating meters with liquid fill animation
 */

"use client";

import { Box, Typography, LinearProgress } from "@mui/material";
import { Star, ThumbUp, Timeline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
	glassColors,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";

interface VisualRatingsDisplayProps {
	userScore: number; // 0-10
	voteCount: number;
	criticsScore?: number; // 0-100
}

export function VisualRatingsDisplay({
	userScore,
	voteCount,
	criticsScore,
}: VisualRatingsDisplayProps) {
	const [animatedScore, setAnimatedScore] = useState(0);
	const [animatedCriticsScore, setAnimatedCriticsScore] = useState(0);

	const safeUserScore = Number(userScore) || 0;
	const userPercentage = (safeUserScore / 10) * 100;

	useEffect(() => {
		// Animate scores
		const duration = 1500;
		const steps = 60;
		const increment = userPercentage / steps;
		const criticsIncrement = (criticsScore || 0) / steps;

		let current = 0;
		const timer = setInterval(() => {
			current += 1;
			setAnimatedScore(Math.min(increment * current, userPercentage));
			setAnimatedCriticsScore(
				Math.min(criticsIncrement * current, criticsScore || 0),
			);

			if (current >= steps) clearInterval(timer);
		}, duration / steps);

		return () => clearInterval(timer);
	}, [userPercentage, criticsScore]);

	return (
		<Box
			sx={{
				mb: 4,
				p: { xs: 3, md: 4 },
				background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
				backdropFilter: glassBlur.medium,
				WebkitBackdropFilter: glassBlur.medium,
				border: `1px solid ${glassColors.glass.border}`,
				borderRadius: glassBorderRadius.xl,
			}}
		>
			<Typography
				variant="h5"
				sx={{
					color: glassColors.text.primary,
					fontWeight: 700,
					mb: 3,
				}}
				dir="rtl"
			>
				امتیازات و نظرات
			</Typography>

			{/* Ratings Grid */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
					gap: 3,
				}}
			>
				{/* User Score - Circular Meter */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 3,
						p: 3,
						background: glassColors.glass.base,
						backdropFilter: glassBlur.light,
						border: `1px solid ${glassColors.glass.border}`,
						borderRadius: glassBorderRadius.lg,
					}}
				>
					{/* Circular Progress */}
					<Box sx={{ position: "relative", width: 120, height: 120 }}>
						{/* Background Circle */}
						<svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
							<circle
								cx="60"
								cy="60"
								r="54"
								fill="none"
								stroke={glassColors.glass.border}
								strokeWidth="8"
							/>
							{/* Animated Fill */}
							<circle
								cx="60"
								cy="60"
								r="54"
								fill="none"
								stroke={`url(#gradient-user)`}
								strokeWidth="8"
								strokeDasharray={`${(animatedScore / 100) * 339.292} 339.292`}
								strokeLinecap="round"
								style={{
									transition: "stroke-dasharray 0.3s ease",
								}}
							/>
							<defs>
								<linearGradient id="gradient-user" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stopColor={glassColors.gold.solid} />
									<stop offset="100%" stopColor="#FBBF24" />
								</linearGradient>
							</defs>
						</svg>

						{/* Score Text */}
						<Box
							sx={{
								position: "absolute",
								inset: 0,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Typography
								sx={{
									color: glassColors.text.primary,
									fontSize: "2rem",
									fontWeight: 800,
									lineHeight: 1,
								}}
							>
								{(Number(userScore) || 0).toFixed(1)}
							</Typography>
							<Typography
								sx={{
									color: glassColors.text.tertiary,
									fontSize: "0.75rem",
								}}
							>
								/10
							</Typography>
						</Box>
					</Box>

					{/* Info */}
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
							<Star sx={{ color: glassColors.gold.solid, fontSize: 20 }} />
							<Typography
								sx={{
									color: glassColors.text.primary,
									fontSize: "1.125rem",
									fontWeight: 700,
								}}
							>
								امتیاز کاربران
							</Typography>
						</Box>
						<Typography
							sx={{
								color: glassColors.text.secondary,
								fontSize: "0.875rem",
							}}
						>
							{voteCount.toLocaleString()} رأی
						</Typography>
					</Box>
				</Box>

				{/* Critics Score - Bar Chart */}
				{criticsScore !== undefined && (
					<Box
						sx={{
							p: 3,
							background: glassColors.glass.base,
							backdropFilter: glassBlur.light,
							border: `1px solid ${glassColors.glass.border}`,
							borderRadius: glassBorderRadius.lg,
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
							<Timeline sx={{ color: glassColors.gold.solid, fontSize: 20 }} />
							<Typography
								sx={{
									color: glassColors.text.primary,
									fontSize: "1.125rem",
									fontWeight: 700,
								}}
							>
								امتیاز منتقدین
							</Typography>
						</Box>

						{/* Bar */}
						<Box sx={{ mb: 2 }}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									mb: 1,
								}}
							>
								<Typography
									sx={{
										color: glassColors.text.primary,
										fontSize: "1.5rem",
										fontWeight: 800,
									}}
								>
									{Math.round(animatedCriticsScore)}%
								</Typography>
								<Typography
									sx={{
										color: glassColors.text.tertiary,
										fontSize: "0.875rem",
									}}
								>
									Tomatometer
								</Typography>
							</Box>
							<Box
								sx={{
									height: 12,
									background: glassColors.glass.border,
									borderRadius: glassBorderRadius.pill,
									overflow: "hidden",
									position: "relative",
								}}
							>
								<Box
									sx={{
										height: "100%",
										width: `${animatedCriticsScore}%`,
										background: `linear-gradient(90deg, ${glassColors.gold.solid}, #FBBF24)`,
										borderRadius: glassBorderRadius.pill,
										transition: "width 0.3s ease",
										boxShadow: `0 0 10px ${glassColors.gold.glow}`,
									}}
								/>
							</Box>
						</Box>

						{/* Comparison */}
						<Typography
							sx={{
								color: glassColors.text.secondary,
								fontSize: "0.875rem",
							}}
						>
							{animatedCriticsScore > userPercentage
								? "منتقدین امتیاز بالاتری داده‌اند"
								: animatedCriticsScore < userPercentage
									? "کاربران امتیاز بالاتری داده‌اند"
									: "امتیاز منتقدین و کاربران برابر است"}
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
}
