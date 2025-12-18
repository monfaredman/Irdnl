/**
 * VisualContentGrid - Mosaic grid of related content with glass overlays
 */

"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
	glassColors,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";

interface ContentItem {
	id: string;
	title: string;
	backdropUrl: string;
	rating: number;
	year?: number;
}

interface VisualContentGridProps {
	items: ContentItem[];
	title?: string;
}

export function VisualContentGrid({
	items,
	title = "محتوای مرتبط",
}: VisualContentGridProps) {
	const [hoveredId, setHoveredId] = useState<string | null>(null);

	if (!items.length) return null;

	return (
		<Box sx={{ mb: 4 }}>
			{/* Section Title */}
			<Typography
				variant="h5"
				sx={{
					color: glassColors.text.primary,
					fontWeight: 700,
					mb: 3,
				}}
				dir="rtl"
			>
				{title}
			</Typography>

			{/* Mosaic Grid */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "repeat(2, 1fr)",
						sm: "repeat(3, 1fr)",
						md: "repeat(4, 1fr)",
					},
					gap: 2,
				}}
			>
				{items.slice(0, 12).map((item) => (
					<Link
						key={item.id}
						href={`/item/${item.id}`}
						style={{ textDecoration: "none" }}
					>
						<Box
							onMouseEnter={() => setHoveredId(item.id)}
							onMouseLeave={() => setHoveredId(null)}
							sx={{
								position: "relative",
								aspectRatio: "16/9",
								borderRadius: glassBorderRadius.lg,
								overflow: "hidden",
								cursor: "pointer",
								transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
								transform:
									hoveredId === item.id
										? "translateY(-8px) scale(1.02)"
										: "translateY(0) scale(1)",
								boxShadow:
									hoveredId === item.id
										? `0 20px 40px rgba(0,0,0,0.6), 0 0 30px ${glassColors.gold.glow}`
										: "0 4px 12px rgba(0,0,0,0.3)",
							}}
						>
							{/* Backdrop Image */}
							<Box
								sx={{
									position: "relative",
									width: "100%",
									height: "100%",
								}}
							>
								<Image
									src={item.backdropUrl}
									alt={item.title}
									fill
									style={{
										objectFit: "cover",
										transition: "transform 0.4s ease",
										transform:
											hoveredId === item.id ? "scale(1.1)" : "scale(1)",
									}}
								/>
							</Box>

							{/* Glass Overlay */}
							<Box
								sx={{
									position: "absolute",
									inset: 0,
									background: `linear-gradient(to top, ${glassColors.black}, transparent 60%)`,
									opacity: hoveredId === item.id ? 0.9 : 0.6,
									transition: "opacity 0.3s ease",
								}}
							/>

							{/* Content */}
							<Box
								sx={{
									position: "absolute",
									bottom: 0,
									left: 0,
									right: 0,
									p: 2,
									transform:
										hoveredId === item.id ? "translateY(0)" : "translateY(8px)",
									opacity: hoveredId === item.id ? 1 : 0,
									transition: "all 0.3s ease",
								}}
							>
								<Typography
									sx={{
										color: glassColors.text.primary,
										fontSize: "0.875rem",
										fontWeight: 700,
										mb: 0.5,
										lineHeight: 1.3,
										display: "-webkit-box",
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
									}}
									dir="rtl"
								>
									{item.title}
								</Typography>

								<Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
									{item.year && (
										<Typography
											sx={{
												color: glassColors.text.tertiary,
												fontSize: "0.75rem",
											}}
										>
											{item.year}
										</Typography>
									)}
									<Typography
										sx={{
											color: glassColors.gold.solid,
											fontSize: "0.75rem",
											fontWeight: 600,
										}}
									>
										⭐ {item.rating.toFixed(1)}
									</Typography>
								</Box>
							</Box>

							{/* Shine Effect on Hover */}
							<Box
								sx={{
									position: "absolute",
									inset: 0,
									background: `linear-gradient(135deg, transparent, ${glassColors.gold.lighter}, transparent)`,
									opacity: 0,
									transform: "translateX(-100%)",
									transition: "all 0.6s ease",
									...(hoveredId === item.id && {
										opacity: 0.3,
										transform: "translateX(100%)",
									}),
								}}
							/>

							{/* Glass Border */}
							<Box
								sx={{
									position: "absolute",
									inset: 0,
									border: `1px solid ${hoveredId === item.id ? glassColors.gold.solid : glassColors.glass.border}`,
									borderRadius: glassBorderRadius.lg,
									opacity: hoveredId === item.id ? 1 : 0.5,
									transition: "all 0.3s ease",
								}}
							/>
						</Box>
					</Link>
				))}
			</Box>
		</Box>
	);
}
