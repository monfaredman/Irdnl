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
	ratings?: {
		imdb?: { score: number; votes?: number };
		rottenTomatoes?: { tomatometer: number; audience?: number };
		metacritic?: { score: number };
		fandango?: { score: number };
		letterboxd?: { score: number };
		myAnimeList?: { score: number };
	} | null;
}

// Rating source config for rendering
const RATING_SOURCES = [
	{ key: 'imdb', label: 'IMDb', emoji: '🎬', maxScore: 10, color: '#F5C518', bgColor: 'rgba(245,197,24,0.1)' },
	{ key: 'rottenTomatoes', label: 'Rotten Tomatoes', emoji: '🍅', maxScore: 100, suffix: '%', color: '#FA320A', bgColor: 'rgba(250,50,10,0.1)' },
	{ key: 'metacritic', label: 'Metacritic', emoji: 'Ⓜ️', maxScore: 100, color: '#FFCC34', bgColor: 'rgba(255,204,52,0.1)' },
	{ key: 'fandango', label: 'Fandango', emoji: '⭐', maxScore: 5, color: '#FF7800', bgColor: 'rgba(255,120,0,0.1)' },
	{ key: 'letterboxd', label: 'Letterboxd', emoji: '📝', maxScore: 5, color: '#00E054', bgColor: 'rgba(0,224,84,0.1)' },
	{ key: 'myAnimeList', label: 'MyAnimeList', emoji: '📺', maxScore: 10, color: '#2E51A2', bgColor: 'rgba(46,81,162,0.1)' },
] as const;

export function VisualRatingsDisplay({
	userScore,
	voteCount,
	criticsScore,
	ratings,
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

			{/* Multi-Source Ratings Row */}
			{ratings && Object.keys(ratings).some((k) => {
				const val = (ratings as any)[k];
				return val && (val.score != null || val.tomatometer != null);
			}) && (
				<Box sx={{ mt: 3 }}>
					<Typography
						sx={{
							color: glassColors.text.secondary,
							fontSize: "0.9rem",
							fontWeight: 600,
							mb: 2,
						}}
						dir="rtl"
					>
						امتیاز سایت‌های معتبر
					</Typography>
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 2,
						}}
					>
						{RATING_SOURCES.map((src) => {
							const data = (ratings as any)?.[src.key];
							if (!data) return null;
							const score = src.key === 'rottenTomatoes' ? data.tomatometer : data.score;
							if (score == null) return null;
							const percentage = (score / src.maxScore) * 100;

							return (
								<Box
									key={src.key}
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1.5,
										p: 1.5,
										px: 2.5,
										background: src.bgColor,
										border: `1px solid ${src.color}30`,
										borderRadius: glassBorderRadius.lg,
										minWidth: 140,
									}}
								>
									<Typography sx={{ fontSize: "1.5rem" }}>{src.emoji}</Typography>
									<Box>
										<Typography
											sx={{
												color: glassColors.text.primary,
												fontSize: "0.75rem",
												fontWeight: 600,
												opacity: 0.8,
											}}
										>
											{src.label}
										</Typography>
										<Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
											<Typography
												sx={{
													color: src.color,
													fontSize: "1.25rem",
													fontWeight: 800,
												}}
											>
												{score}
											</Typography>
											<Typography
												sx={{
													color: glassColors.text.tertiary,
													fontSize: "0.7rem",
												}}
											>
												{src.suffix || `/${src.maxScore}`}
											</Typography>
										</Box>
										{/* Mini progress bar */}
										<Box
											sx={{
												height: 3,
												width: 60,
												background: `${src.color}20`,
												borderRadius: 2,
												overflow: "hidden",
												mt: 0.5,
											}}
										>
											<Box
												sx={{
													height: "100%",
													width: `${Math.min(percentage, 100)}%`,
													background: src.color,
													borderRadius: 2,
													transition: "width 1s ease",
												}}
											/>
										</Box>
										{src.key === 'imdb' && data.votes && (
											<Typography
												sx={{
													color: glassColors.text.tertiary,
													fontSize: "0.65rem",
													mt: 0.3,
												}}
											>
												{data.votes.toLocaleString()} رأی
											</Typography>
										)}
										{src.key === 'rottenTomatoes' && data.audience != null && (
											<Typography
												sx={{
													color: glassColors.text.tertiary,
													fontSize: "0.65rem",
													mt: 0.3,
												}}
											>
												مخاطبان: {data.audience}%
											</Typography>
										)}
									</Box>
								</Box>
							);
						})}
					</Box>
				</Box>
			)}
		</Box>
	);
}
