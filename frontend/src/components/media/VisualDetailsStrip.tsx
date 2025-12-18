/**
 * VisualDetailsStrip - Horizontal scrollable gallery of movie stills/images
 */

"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import {
	glassColors,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";

interface ImageItem {
	url: string;
	caption?: string;
	aspectRatio: number;
}

interface VisualDetailsStripProps {
	images: ImageItem[];
	title?: string;
}

export function VisualDetailsStrip({
	images,
	title = "پشت صحنه و تصاویر",
}: VisualDetailsStripProps) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	if (!images.length) return null;

	return (
		<Box sx={{ mb: 4 }}>
			{/* Section Title */}
			{title && (
				<Typography
					variant="h5"
					sx={{
						color: glassColors.text.primary,
						fontWeight: 700,
						mb: 3,
						px: { xs: 2, md: 0 },
					}}
					dir="rtl"
				>
					{title}
				</Typography>
			)}

			{/* Scrollable Strip */}
			<Box
				sx={{
					display: "flex",
					gap: 2,
					overflowX: "auto",
					overflowY: "hidden",
					px: { xs: 2, md: 0 },
					pb: 2,
					"&::-webkit-scrollbar": {
						height: 8,
					},
					"&::-webkit-scrollbar-track": {
						background: glassColors.glass.base,
						borderRadius: glassBorderRadius.sm,
					},
					"&::-webkit-scrollbar-thumb": {
						background: glassColors.glass.strong,
						borderRadius: glassBorderRadius.sm,
						"&:hover": {
							background: glassColors.glass.border,
						},
					},
				}}
			>
				{images.map((image, index) => (
					<Box
						key={index}
						onMouseEnter={() => setHoveredIndex(index)}
						onMouseLeave={() => setHoveredIndex(null)}
						sx={{
							position: "relative",
							flexShrink: 0,
							width: { xs: 280, md: 360 },
							height: { xs: 157, md: 202 }, // 16:9 aspect ratio
							borderRadius: glassBorderRadius.lg,
							overflow: "hidden",
							border: `1px solid ${glassColors.glass.border}`,
							background: glassColors.glass.base,
							cursor: "pointer",
							transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
							transform:
								hoveredIndex === index ? "scale(1.05)" : "scale(1)",
							boxShadow:
								hoveredIndex === index
									? `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${glassColors.gold.glow}`
									: "0 4px 12px rgba(0,0,0,0.3)",
						}}
					>
						{/* Image */}
						<Box
							sx={{
								position: "relative",
								width: "100%",
								height: "100%",
								overflow: "hidden",
							}}
						>
							<Image
								src={image.url}
								alt={image.caption || "Scene still"}
								fill
								style={{
									objectFit: "cover",
									transition: "transform 0.3s ease",
									transform:
										hoveredIndex === index ? "scale(1.1)" : "scale(1)",
								}}
							/>
						</Box>

						{/* Caption Tooltip on Hover */}
						{image.caption && (
							<Box
								sx={{
									position: "absolute",
									bottom: 0,
									left: 0,
									right: 0,
									p: 2,
									background: `linear-gradient(to top, ${glassColors.black}, transparent)`,
									backdropFilter: glassBlur.medium,
									WebkitBackdropFilter: glassBlur.medium,
									opacity: hoveredIndex === index ? 1 : 0,
									transition: "opacity 0.3s ease",
								}}
							>
								<Typography
									sx={{
										color: glassColors.text.primary,
										fontSize: "0.875rem",
										fontWeight: 500,
									}}
								>
									{image.caption}
								</Typography>
							</Box>
						)}

						{/* Glass Frame Effect */}
						<Box
							sx={{
								position: "absolute",
								inset: 0,
								border: `2px solid transparent`,
								borderRadius: glassBorderRadius.lg,
								background: `linear-gradient(135deg, ${glassColors.glass.border}, transparent) border-box`,
								WebkitMask:
									"linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
								WebkitMaskComposite: "xor",
								maskComposite: "exclude",
								opacity: hoveredIndex === index ? 1 : 0,
								transition: "opacity 0.3s ease",
							}}
						/>
					</Box>
				))}
			</Box>
		</Box>
	);
}
