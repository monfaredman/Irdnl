/**
 * VisualSynopsisCard - Synopsis with scenic background image
 */

"use client";

import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import {
	glassColors,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";

interface VisualSynopsisCardProps {
	synopsis: string;
	backgroundImage?: string;
}

export function VisualSynopsisCard({
	synopsis,
	backgroundImage,
}: VisualSynopsisCardProps) {
	const [expanded, setExpanded] = useState(false);
	const truncatedText = synopsis.slice(0, 300);
	const shouldTruncate = synopsis.length > 300;

	return (
		<Box
			sx={{
				position: "relative",
				mb: 4,
				borderRadius: glassBorderRadius.xl,
				overflow: "hidden",
			}}
		>
			{/* Background Image */}
			{backgroundImage && (
				<Box
					sx={{
						position: "absolute",
						inset: 0,
						backgroundImage: `url(${backgroundImage})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						filter: "brightness(0.3) blur(2px)",
						transform: "scale(1.1)",
					}}
				/>
			)}

			{/* Glass Overlay */}
			<Box
				sx={{
					position: "absolute",
					inset: 0,
					background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
					backdropFilter: glassBlur.strong,
					WebkitBackdropFilter: glassBlur.strong,
				}}
			/>

			{/* Content */}
			<Box
				sx={{
					position: "relative",
					zIndex: 1,
					p: { xs: 3, md: 4 },
					border: `1px solid ${glassColors.glass.border}`,
					borderRadius: glassBorderRadius.xl,
				}}
			>
				<Typography
					variant="h5"
					sx={{
						color: glassColors.text.primary,
						fontWeight: 700,
						mb: 2,
					}}
					dir="rtl"
				>
					خلاصه داستان
				</Typography>

				<Typography
					sx={{
						color: glassColors.text.secondary,
						fontSize: "1rem",
						lineHeight: 1.8,
						mb: shouldTruncate ? 2 : 0,
					}}
					dir="rtl"
				>
					{expanded || !shouldTruncate ? synopsis : `${truncatedText}...`}
				</Typography>

				{shouldTruncate && (
					<Button
						onClick={() => setExpanded(!expanded)}
						sx={{
							color: glassColors.gold.solid,
							textTransform: "none",
							fontWeight: 600,
							fontSize: "0.875rem",
							p: 0,
							minWidth: "auto",
							"&:hover": {
								background: "transparent",
								textDecoration: "underline",
							},
						}}
					>
						{expanded ? "نمایش کمتر" : "ادامه مطلب"}
					</Button>
				)}
			</Box>
		</Box>
	);
}
