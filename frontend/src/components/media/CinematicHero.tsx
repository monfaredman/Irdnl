/**
 * CinematicHero - Full-bleed cinematic hero section with parallax
 */

"use client";

import { PlayArrow, Bookmark, Share, Add } from "@mui/icons-material";
import { Box, Button, Chip, Typography, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import {
	glassColors,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";

interface CinematicHeroProps {
	backdropUrl: string;
	title: string;
	englishTitle?: string;
	tagline?: string;
	year: number;
	rating: number;
	duration?: number | string;
	genres: string[];
	onPlay?: () => void;
	onAddToList?: () => void;
	onShare?: () => void;
}

export function CinematicHero({
	backdropUrl,
	title,
	englishTitle,
	tagline,
	year,
	rating,
	duration,
	genres,
	onPlay,
	onAddToList,
	onShare,
}: CinematicHeroProps) {
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => setScrollY(window.scrollY);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const parallaxOffset = scrollY * 0.5;

	return (
		<Box
			sx={{
				position: "relative",
				height: { xs: "70vh", md: "85vh" },
				overflow: "hidden",
				mb: 4,
			}}
		>
			{/* Parallax Background */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundImage: `url(${backdropUrl})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					transform: `translateY(${parallaxOffset}px)`,
					transition: "transform 0.1s linear",
					"&::after": {
						content: '""',
						position: "absolute",
						inset: 0,
						background: `
              linear-gradient(to top, ${glassColors.deepMidnight} 0%, transparent 50%),
              linear-gradient(to right, ${glassColors.deepMidnight} 0%, transparent 40%),
              radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)
            `,
					},
				}}
			/>

			{/* Content Container */}
			<Box
				sx={{
					position: "relative",
					zIndex: 2,
					height: "100%",
					display: "flex",
					alignItems: "flex-end",
					px: { xs: 2, md: 6 },
					pb: { xs: 4, md: 8 },
				}}
			>
				{/* Floating Glass Panel */}
				<Box
					sx={{
						maxWidth: "800px",
					p: { xs: 3, md: 4 },
					background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
					backdropFilter: glassBlur.strong,
					WebkitBackdropFilter: glassBlur.strong,
					border: `1px solid ${glassColors.glass.border}`,
						borderRadius: glassBorderRadius.xl,
						boxShadow: `
              0 20px 60px rgba(0,0,0,0.6),
              inset 0 1px 0 rgba(255,255,255,0.1)
            `,
					}}
				>
					{/* Tagline */}
					{tagline && (
						<Typography
							sx={{
								color: glassColors.gold.solid,
								fontSize: "0.875rem",
								fontWeight: 600,
								mb: 1,
								letterSpacing: "0.05em",
								textTransform: "uppercase",
							}}
						>
							{tagline}
						</Typography>
					)}

					{/* Persian Title */}
					<Typography
						variant="h2"
						sx={{
							color: glassColors.text.primary,
							fontWeight: 900,
							mb: 1,
							fontSize: { xs: "2rem", md: "3.5rem" },
							lineHeight: 1.1,
							textShadow: `
                0 2px 10px rgba(0,0,0,0.5),
                0 0 30px ${glassColors.gold.glow}
              `,
						}}
						dir="rtl"
					>
						{title}
					</Typography>

					{/* English Title */}
					{englishTitle && (
						<Typography
							sx={{
								color: glassColors.text.secondary,
								fontSize: { xs: "1rem", md: "1.25rem" },
								mb: 2,
								fontWeight: 300,
							}}
						>
							{englishTitle}
						</Typography>
					)}

					{/* Metadata Pills */}
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 1,
							mb: 3,
						}}
					>
						<Chip
							label={year}
							sx={{
								background: glassColors.glass.mid,
								backdropFilter: glassBlur.light,
								border: `1px solid ${glassColors.glass.border}`,
								color: glassColors.text.primary,
								fontWeight: 600,
								fontSize: "0.875rem",
							}}
						/>
						<Chip
							label={`⭐ ${rating.toFixed(1)}`}
							sx={{
								background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
								backdropFilter: glassBlur.light,
								border: `1px solid ${glassColors.gold.solid}40`,
								color: glassColors.text.primary,
								fontWeight: 600,
								fontSize: "0.875rem",
							}}
						/>
						{duration && (
							<Chip
								label={typeof duration === "number" ? `${duration} min` : duration}
								sx={{
									background: glassColors.glass.mid,
									backdropFilter: glassBlur.light,
									border: `1px solid ${glassColors.glass.border}`,
									color: glassColors.text.secondary,
									fontSize: "0.875rem",
								}}
							/>
						)}
						{genres.slice(0, 3).map((genre) => (
							<Chip
								key={genre}
								label={genre}
								sx={{
									background: glassColors.glass.base,
									backdropFilter: glassBlur.light,
									border: `1px solid ${glassColors.glass.border}`,
									color: glassColors.text.tertiary,
									fontSize: "0.75rem",
								}}
							/>
						))}
					</Box>

					{/* Action Buttons */}
					<Box
						sx={{
							display: "flex",
							gap: 2,
							flexWrap: "wrap",
						}}
					>
						<Button
							variant="contained"
							size="large"
							startIcon={<PlayArrow />}
							onClick={onPlay}
							sx={{
								background: `linear-gradient(135deg, ${glassColors.gold.solid}, #D97706)`,
								color: glassColors.black,
								fontWeight: 700,
								px: 4,
								py: 1.5,
								borderRadius: glassBorderRadius.pill,
								textTransform: "none",
								fontSize: "1.125rem",
								position: "relative",
								overflow: "hidden",
								"&::before": {
									content: '""',
									position: "absolute",
									inset: 0,
									background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent)",
									opacity: 0,
									transition: "opacity 0.4s ease",
								},
								"&:hover": {
									background: `linear-gradient(135deg, #FBBF24, ${glassColors.gold.solid})`,
									transform: "translateY(-2px)",
									boxShadow: `0 10px 30px ${glassColors.gold.glow}`,
									"&::before": {
										opacity: 1,
										animation: "ripple 1s ease-out infinite",
									},
								},
								"@keyframes ripple": {
									"0%": {
										transform: "scale(0)",
										opacity: 1,
									},
									"100%": {
										transform: "scale(2)",
										opacity: 0,
									},
								},
							}}
						>
							پخش
						</Button>

						<IconButton
							onClick={onAddToList}
							sx={{
								background: glassColors.glass.mid,
								backdropFilter: glassBlur.light,
								border: `1px solid ${glassColors.glass.border}`,
								color: glassColors.text.primary,
								"&:hover": {
									background: glassColors.glass.strong,
									border: `1px solid ${glassColors.gold.solid}`,
									transform: "scale(1.05)",
								},
							}}
						>
							<Add />
						</IconButton>

						<IconButton
							onClick={onAddToList}
							sx={{
								background: glassColors.glass.mid,
								backdropFilter: glassBlur.light,
								border: `1px solid ${glassColors.glass.border}`,
								color: glassColors.text.primary,
								"&:hover": {
									background: glassColors.glass.strong,
									transform: "scale(1.05)",
								},
							}}
						>
							<Bookmark />
						</IconButton>

						<IconButton
							onClick={onShare}
							sx={{
								background: glassColors.glass.mid,
								backdropFilter: glassBlur.light,
								border: `1px solid ${glassColors.glass.border}`,
								color: glassColors.text.primary,
								"&:hover": {
									background: glassColors.glass.strong,
									transform: "scale(1.05)",
								},
							}}
						>
							<Share />
						</IconButton>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
