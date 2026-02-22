/**
 * CinematicHero - Full-bleed cinematic hero section with parallax
 */

"use client";

import { PlayArrow, Bookmark, BookmarkBorder, Share, PlaylistAdd, PlaylistAddCheck, ThumbUp, ThumbUpOutlined, OpenInNew, ShoppingCart, Subscriptions, DataUsage } from "@mui/icons-material";
import { Box, Button, Chip, Typography, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import {
	glassColors,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";

import type { AccessType } from "@/types/media";

interface CinematicHeroProps {
	backdropUrl: string;
	title: string;
	englishTitle?: string;
	tagline?: string;
	year: number;
	rating: number;
	duration?: number | string;
	genres: string[];
	externalPlayerUrl?: string;
	accessType?: AccessType;
	sources?: Array<{ quality: string; url: string; format?: string; type?: string }>;
	contentId?: string;
	onPlay?: () => void;
	onAddToList?: () => void;
	onShare?: () => void;
	// Bookmark / Playlist / Clap
	isBookmarked?: boolean;
	onToggleBookmark?: () => void;
	isInPlaylist?: boolean;
	onTogglePlaylist?: () => void;
	isClapped?: boolean;
	clapCount?: number;
	onToggleClap?: () => void;
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
	externalPlayerUrl,
	accessType,
	sources,
	contentId,
	onPlay,
	onAddToList,
	onShare,
	isBookmarked,
	onToggleBookmark,
	isInPlaylist,
	onTogglePlaylist,
	isClapped,
	clapCount,
	onToggleClap,
}: CinematicHeroProps) {
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => setScrollY(window.scrollY);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const parallaxOffset = scrollY * 0.5;

	// Determine if this is Upera content (redirect) vs free in-site content
	const isUperaContent = accessType && accessType !== "free";
	const hasPlayableContent = !isUperaContent && (sources?.length ?? 0) > 0;
	const hasExternalLink = !!externalPlayerUrl;

	// Button label and icon based on access type
	const getPlayButtonConfig = () => {
		if (isUperaContent) {
			switch (accessType) {
				case "subscription":
					return { label: "تماشا (اشتراکی)", icon: <Subscriptions sx={{ fontSize: "1rem" }} /> };
				case "single_purchase":
					return { label: "خرید و تماشا", icon: <ShoppingCart sx={{ fontSize: "1rem" }} /> };
				case "traffic":
					return { label: "تماشا (ترافیکی)", icon: <DataUsage sx={{ fontSize: "1rem" }} /> };
				default:
					return { label: "پخش آنلاین", icon: <OpenInNew sx={{ fontSize: "1rem" }} /> };
			}
		}
		if (hasExternalLink) {
			return { label: "تماشای آنلاین", icon: <OpenInNew sx={{ fontSize: "1rem" }} /> };
		}
		return { label: "پخش", icon: undefined };
	};

	const playConfig = getPlayButtonConfig();

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
							label={`⭐ ${(Number(rating) || 0).toFixed(1)}`}
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
							alignItems: "center",
						}}
					>
						<Button
							variant="contained"
							size="large"
							startIcon={<PlayArrow sx={{marginLeft:1}}/>}
							endIcon={playConfig.icon}
							component={hasExternalLink ? "a" : "button"}
							href={hasExternalLink ? externalPlayerUrl : undefined}
							target={hasExternalLink ? "_blank" : undefined}
							rel={hasExternalLink ? "noopener noreferrer" : undefined}
							onClick={hasExternalLink ? undefined : () => {
								if (onPlay) {
									onPlay();
								} else if (hasPlayableContent && contentId) {
									window.location.href = `/watch/${contentId}`;
								}
							}}
							disabled={!hasExternalLink && !onPlay && !hasPlayableContent}
							sx={{
								background: isUperaContent || hasExternalLink
									? `linear-gradient(135deg, ${glassColors.gold.solid}, #D97706)`
									: glassColors.glass.mid,
								color: isUperaContent || hasExternalLink ? glassColors.black : glassColors.text.primary,
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
									background: isUperaContent || hasExternalLink
										? `linear-gradient(135deg, #FBBF24, ${glassColors.gold.solid})`
										: glassColors.glass.strong,
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
							{playConfig.label}
						</Button>

						{/* Bookmark */}
						<IconButton
							onClick={onToggleBookmark}
							aria-label="نشان‌گذاری"
							sx={{
								background: isBookmarked ? `${glassColors.persianGold}30` : glassColors.glass.mid,
								backdropFilter: glassBlur.light,
								border: `1px solid ${isBookmarked ? glassColors.persianGold : glassColors.glass.border}`,
								color: isBookmarked ? glassColors.persianGold : glassColors.text.primary,
								transition: "all 0.3s ease",
								"&:hover": {
									background: `${glassColors.persianGold}20`,
									transform: "scale(1.1)",
								},
							}}
						>
							{isBookmarked ? <Bookmark /> : <BookmarkBorder />}
						</IconButton>

						{/* Playlist */}
						<IconButton
							onClick={onTogglePlaylist}
							aria-label="افزودن به لیست پخش"
							sx={{
								background: isInPlaylist ? `${glassColors.persianGold}30` : glassColors.glass.mid,
								backdropFilter: glassBlur.light,
								border: `1px solid ${isInPlaylist ? glassColors.persianGold : glassColors.glass.border}`,
								color: isInPlaylist ? glassColors.persianGold : glassColors.text.primary,
								transition: "all 0.3s ease",
								"&:hover": {
									background: `${glassColors.persianGold}20`,
									transform: "scale(1.1)",
								},
							}}
						>
							{isInPlaylist ? <PlaylistAddCheck /> : <PlaylistAdd />}
						</IconButton>

						{/* Clap / Like */}
						<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
							<IconButton
								onClick={onToggleClap}
								aria-label="لایک"
								sx={{
									background: isClapped ? `${glassColors.persianGold}30` : glassColors.glass.mid,
									backdropFilter: glassBlur.light,
									border: `1px solid ${isClapped ? glassColors.persianGold : glassColors.glass.border}`,
									color: isClapped ? glassColors.persianGold : glassColors.text.primary,
									transition: "all 0.3s ease",
									"&:hover": {
										background: `${glassColors.persianGold}20`,
										transform: "scale(1.1)",
									},
								}}
							>
								{isClapped ? <ThumbUp /> : <ThumbUpOutlined />}
							</IconButton>
							{(clapCount ?? 0) > 0 && (
								<Typography sx={{ color: glassColors.text.secondary, fontSize: "0.85rem" }}>
									{clapCount}
								</Typography>
							)}
						</Box>

						{/* Share */}
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
