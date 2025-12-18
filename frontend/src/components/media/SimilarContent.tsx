"use client";

import { PlayArrow, Star } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import type { Movie, Series } from "@/types/media";
import {
	glassAnimations,
	glassBorderRadius,
	glassColors,
	glassStyles,
} from "@/theme/glass-design-system";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

interface SimilarContentProps {
	items: (Movie | Series)[];
	type: "movie" | "series";
}

export function SimilarContent({ items, type }: SimilarContentProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const scrollAmount = 300;
			scrollRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<Box sx={{ ...glassStyles.card, p: { xs: 3, md: 4 } }}>
			<Typography
				variant="h5"
				sx={{
					color: glassColors.text.primary,
					fontWeight: 700,
					mb: 3,
					letterSpacing: "-0.01em",
				}}
				dir="rtl"
			>
				{type === "series" ? "سریال‌های" : "فیلم‌های"} مشابه
			</Typography>

			<Box sx={{ position: "relative" }}>
				<Box
					ref={scrollRef}
					sx={{
						display: "flex",
						gap: 2,
						overflowX: "auto",
						scrollBehavior: "smooth",
						pb: 2,
						"&::-webkit-scrollbar": {
							height: 6,
						},
						"&::-webkit-scrollbar-track": {
							background: glassColors.glass.base,
							borderRadius: glassBorderRadius.pill,
						},
						"&::-webkit-scrollbar-thumb": {
							background: glassColors.glass.border,
							borderRadius: glassBorderRadius.pill,
							"&:hover": {
								background: glassColors.glass.strong,
							},
						},
					}}
				>
					{items.map((item) => (
						<Link
							key={item.id}
							href={`/item/${item.id}`}
							style={{ textDecoration: "none" }}
						>
							<Box
								sx={{
									...glassStyles.card,
									width: 200,
									flexShrink: 0,
									cursor: "pointer",
									transition: glassAnimations.transition.spring,
									position: "relative",
									overflow: "hidden",
									"&:hover": {
										transform: "translateY(-8px)",
										border: `1px solid ${glassColors.persianGold}40`,
										boxShadow: `0 16px 48px -12px ${glassColors.gold.glow}`,
										"& .quick-action": {
											opacity: 1,
										},
									},
								}}
							>
								{/* Poster */}
								<Box
									sx={{
										position: "relative",
										width: "100%",
										height: 280,
										borderRadius: glassBorderRadius.md,
										overflow: "hidden",
									}}
								>
									<Image
										src={item.poster}
										alt={item.title}
										fill
										sizes="200px"
										style={{ objectFit: "cover" }}
									/>

									{/* Quick Action Button */}
									<Box
										className="quick-action"
										sx={{
											position: "absolute",
											top: "50%",
											left: "50%",
											transform: "translate(-50%, -50%)",
											opacity: 0,
											transition: glassAnimations.transition.smooth,
										}}
									>
										<IconButton
											sx={{
												width: 56,
												height: 56,
												background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
												border: `2px solid ${glassColors.persianGold}`,
												boxShadow: `0 8px 24px -4px ${glassColors.gold.glow}`,
												"&:hover": {
													transform: "scale(1.15)",
													background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.gold.light})`,
												},
											}}
										>
											<PlayArrow
												sx={{
													fontSize: "2rem",
													color: glassColors.text.primary,
												}}
											/>
										</IconButton>
									</Box>
								</Box>

								{/* Info */}
								<Box sx={{ p: 2 }}>
									<Typography
										sx={{
											color: glassColors.text.primary,
											fontWeight: 600,
											mb: 0.5,
											fontSize: "0.95rem",
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
										dir="rtl"
									>
										{item.title}
									</Typography>

									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 0.5,
											mb: 0.5,
										}}
									>
										<Star
											sx={{
												color: glassColors.persianGold,
												fontSize: "1rem",
											}}
										/>
										<Typography
											sx={{
												color: glassColors.text.secondary,
												fontSize: "0.875rem",
												fontWeight: 600,
											}}
										>
											{item.rating.toFixed(1)}
										</Typography>
									</Box>

									<Typography
										sx={{
											color: glassColors.text.tertiary,
											fontSize: "0.8rem",
										}}
										dir="rtl"
									>
										{item.year} • {item.genres[0]}
									</Typography>
								</Box>
							</Box>
						</Link>
					))}
				</Box>
			</Box>
		</Box>
	);
}
