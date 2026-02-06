"use client";

import { OpenInNew, PlayArrow } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

interface ExternalPlayerButtonProps {
	/** The URL to the third-party player */
	externalUrl?: string;
	/** Poster/backdrop image for the visual card */
	poster?: string;
	/** Title of the content */
	title?: string;
	/** Size variant */
	variant?: "hero" | "card" | "inline";
}

/**
 * ExternalPlayerButton — replaces the built-in VideoPlayer.
 * Renders a clickable card/button that opens the third-party player URL
 * in a new tab.
 */
export function ExternalPlayerButton({
	externalUrl,
	poster,
	title = "Watch",
	variant = "card",
}: ExternalPlayerButtonProps) {
	const handlePlay = () => {
		if (!externalUrl) return;
		window.open(externalUrl, "_blank", "noopener,noreferrer");
	};

	if (variant === "inline") {
		return (
			<Button
				startIcon={<PlayArrow />}
				endIcon={<OpenInNew sx={{ fontSize: "1rem !important" }} />}
				onClick={handlePlay}
				disabled={!externalUrl}
				sx={{
					px: 4,
					py: 1.5,
					fontSize: "1rem",
					fontWeight: 700,
					borderRadius: glassBorderRadius.pill,
					background: externalUrl
						? `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`
						: glassColors.glass.mid,
					border: `1px solid ${externalUrl ? glassColors.persianGold : glassColors.glass.border}`,
					color: glassColors.text.primary,
					textTransform: "none",
					"&:hover": {
						transform: "translateY(-2px)",
						boxShadow: `0 12px 32px -8px ${glassColors.gold.glow}`,
					},
					"&:disabled": {
						color: glassColors.text.muted,
						background: glassColors.glass.base,
						border: `1px solid ${glassColors.glass.border}`,
					},
				}}
			>
				{externalUrl ? "Watch Now" : "Not Available"}
			</Button>
		);
	}

	// Card variant: visual card with poster + play overlay
	return (
		<Box
			onClick={handlePlay}
			sx={{
				position: "relative",
				width: "100%",
				paddingTop: "56.25%", // 16:9 aspect ratio
				borderRadius: `${glassBorderRadius.lg}px`,
				overflow: "hidden",
				cursor: externalUrl ? "pointer" : "default",
				border: `1px solid ${glassColors.glass.border}`,
				background: glassColors.glass.strong,
				"&:hover .play-overlay": {
					opacity: 1,
				},
				"&:hover img": {
					transform: "scale(1.05)",
				},
			}}
		>
			{/* Poster Background */}
			{poster && (
				<Box
					component="img"
					src={poster}
					alt={title}
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						objectFit: "cover",
						transition: "transform 0.5s ease",
					}}
				/>
			)}

			{/* Gradient overlay */}
			<Box
				sx={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)",
				}}
			/>

			{/* Play Overlay */}
			<Box
				className="play-overlay"
				sx={{
					position: "absolute",
					inset: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 2,
					opacity: externalUrl ? 0.85 : 0.5,
					transition: "opacity 0.3s ease",
				}}
			>
				{/* Play circle */}
				<Box
					sx={{
						width: 72,
						height: 72,
						borderRadius: "50%",
						background: externalUrl
							? `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`
							: glassColors.glass.mid,
						border: `2px solid ${externalUrl ? glassColors.persianGold : glassColors.glass.border}`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backdropFilter: glassBlur.light,
						boxShadow: externalUrl
							? `0 8px 32px -4px ${glassColors.gold.glow}`
							: "none",
						transition: "all 0.3s ease",
					}}
				>
					<PlayArrow
						sx={{
							fontSize: "2.5rem",
							color: glassColors.text.primary,
						}}
					/>
				</Box>

				{/* Label */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 0.5,
						px: 2,
						py: 0.75,
						borderRadius: glassBorderRadius.pill,
						background: glassColors.glass.strong,
						backdropFilter: glassBlur.light,
						border: `1px solid ${glassColors.glass.border}`,
					}}
				>
					<Typography
						sx={{
							color: glassColors.text.primary,
							fontSize: "0.875rem",
							fontWeight: 600,
						}}
					>
						{externalUrl ? "Watch on External Player" : "Not Available"}
					</Typography>
					{externalUrl && (
						<OpenInNew
							sx={{
								fontSize: "0.875rem",
								color: glassColors.text.secondary,
								ml: 0.5,
							}}
						/>
					)}
				</Box>
			</Box>

			{/* Bottom bar with title */}
			<Box
				sx={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					p: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Typography
					sx={{
						color: glassColors.text.primary,
						fontWeight: 600,
						fontSize: "0.875rem",
					}}
					noWrap
				>
					{title}
				</Typography>
				{externalUrl && (
					<OpenInNew
						sx={{
							fontSize: "1rem",
							color: glassColors.text.secondary,
						}}
					/>
				)}
			</Box>
		</Box>
	);
}
