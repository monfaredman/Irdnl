"use client";

import { ExpandMore } from "@mui/icons-material";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import type { Movie, Series } from "@/types/media";
import {
	glassAnimations,
	glassBorderRadius,
	glassColors,
	glassStyles,
} from "@/theme/glass-design-system";
import { useState } from "react";

interface SynopsisAboutProps {
	item: Movie | Series;
	type: "movie" | "series";
}

export function SynopsisAbout({ item, type }: SynopsisAboutProps) {
	const [synopsisExpanded, setSynopsisExpanded] = useState(false);
	const [aboutExpanded, setAboutExpanded] = useState(false);

	const longDescription = item.description.length > 300;

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			{/* Synopsis Section */}
			<Box sx={{ ...glassStyles.card, p: { xs: 3, md: 4 } }}>
				<Typography
					variant="h5"
					sx={{
						color: glassColors.text.primary,
						fontWeight: 700,
						mb: 2,
						letterSpacing: "-0.01em",
					}}
					dir="rtl"
				>
					داستان {type === "series" ? "سریال" : "فیلم"}
				</Typography>

				<Box sx={{ position: "relative" }}>
					<Typography
						sx={{
							color: glassColors.text.secondary,
							lineHeight: 1.8,
							fontSize: "1rem",
						}}
						dir="rtl"
					>
						{synopsisExpanded || !longDescription
							? item.description
							: `${item.description.slice(0, 300)}...`}
					</Typography>

					{!synopsisExpanded && longDescription && (
						<Box
							sx={{
								position: "absolute",
								bottom: 0,
								left: 0,
								right: 0,
								height: "60px",
								background: `linear-gradient(to top, ${glassColors.deepMidnight}, transparent)`,
								pointerEvents: "none",
							}}
						/>
					)}
				</Box>

				{longDescription && (
					<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
						<IconButton
							onClick={() => setSynopsisExpanded(!synopsisExpanded)}
							sx={{
								...glassStyles.card,
								transition: glassAnimations.transition.spring,
								"&:hover": {
									transform: "translateY(-2px)",
									border: `1px solid ${glassColors.persianGold}40`,
								},
							}}
						>
							<ExpandMore
								sx={{
									color: glassColors.text.secondary,
									transform: synopsisExpanded ? "rotate(180deg)" : "rotate(0deg)",
									transition: glassAnimations.transition.smooth,
								}}
							/>
						</IconButton>
					</Box>
				)}
			</Box>

			{/* About Section */}
			<Box sx={{ ...glassStyles.card, p: { xs: 3, md: 4 } }}>
				<Typography
					variant="h5"
					sx={{
						color: glassColors.text.primary,
						fontWeight: 700,
						mb: 2,
						letterSpacing: "-0.01em",
					}}
					dir="rtl"
				>
					درباره {type === "series" ? "سریال" : "فیلم"}
				</Typography>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
						gap: 2,
					}}
				>
					{/* Production Info Panel */}
					<Box
						sx={{
							background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
							border: `1px solid ${glassColors.glass.border}`,
							borderRadius: glassBorderRadius.md,
							p: 2.5,
						}}
					>
						<Typography
							sx={{
								color: glassColors.text.primary,
								fontWeight: 600,
								mb: 1.5,
								fontSize: "0.95rem",
							}}
							dir="rtl"
						>
							اطلاعات تولید
						</Typography>

						<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography
									sx={{
										color: glassColors.text.secondary,
										fontSize: "0.875rem",
									}}
									dir="rtl"
								>
									سال تولید:
								</Typography>
								<Typography
									sx={{
										color: glassColors.text.primary,
										fontSize: "0.875rem",
										fontWeight: 500,
									}}
									dir="rtl"
								>
									{item.year}
								</Typography>
							</Box>

							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography
									sx={{
										color: glassColors.text.secondary,
										fontSize: "0.875rem",
									}}
									dir="rtl"
								>
									کشور سازنده:
								</Typography>
								<Typography
									sx={{
										color: glassColors.text.primary,
										fontSize: "0.875rem",
										fontWeight: 500,
									}}
									dir="rtl"
								>
									{item.origin === "iranian" ? "ایران" : "خارجی"}
								</Typography>
							</Box>

							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography
									sx={{
										color: glassColors.text.secondary,
										fontSize: "0.875rem",
									}}
									dir="rtl"
								>
									ژانر:
								</Typography>
								<Typography
									sx={{
										color: glassColors.text.primary,
										fontSize: "0.875rem",
										fontWeight: 500,
									}}
									dir="rtl"
								>
									{item.genres.join("، ")}
								</Typography>
							</Box>

							{type === "movie" && (
								<Box sx={{ display: "flex", justifyContent: "space-between" }}>
									<Typography
										sx={{
											color: glassColors.text.secondary,
											fontSize: "0.875rem",
										}}
										dir="rtl"
									>
										مدت زمان:
									</Typography>
									<Typography
										sx={{
											color: glassColors.text.primary,
											fontSize: "0.875rem",
											fontWeight: 500,
										}}
										dir="rtl"
									>
										{(item as Movie).duration} دقیقه
									</Typography>
								</Box>
							)}
						</Box>
					</Box>

					{/* Languages Panel */}
					<Box
						sx={{
							background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
							border: `1px solid ${glassColors.glass.border}`,
							borderRadius: glassBorderRadius.md,
							p: 2.5,
						}}
					>
						<Typography
							sx={{
								color: glassColors.text.primary,
								fontWeight: 600,
								mb: 1.5,
								fontSize: "0.95rem",
							}}
							dir="rtl"
						>
							زبان‌ها
						</Typography>

						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
							{item.languages.map((lang) => (
								<Box
									key={lang}
									sx={{
										px: 2,
										py: 0.75,
										background: glassColors.glass.base,
										border: `1px solid ${glassColors.glass.border}`,
										borderRadius: glassBorderRadius.pill,
										color: glassColors.text.secondary,
										fontSize: "0.875rem",
									}}
								>
									{lang === "fa" ? "فارسی" : "انگلیسی"}
								</Box>
							))}
						</Box>
					</Box>
				</Box>

				{/* Extended Info */}
				<Collapse in={aboutExpanded}>
					<Box sx={{ mt: 3 }}>
						<Typography
							sx={{
								color: glassColors.text.secondary,
								lineHeight: 1.8,
								fontSize: "0.95rem",
							}}
							dir="rtl"
						>
							{type === "series" ? "سریال" : "فیلم"} {item.title} یکی از آثار
							برجسته در ژانر {item.genres.join(" و ")} است که در سال {item.year}{" "}
							منتشر شد. این اثر با داستانی جذاب و بازیگری‌های قدرتمند توانسته
							توجه بسیاری از علاقه‌مندان را به خود جلب کند.
						</Typography>
					</Box>
				</Collapse>

				<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
					<IconButton
						onClick={() => setAboutExpanded(!aboutExpanded)}
						sx={{
							...glassStyles.card,
							transition: glassAnimations.transition.spring,
							"&:hover": {
								transform: "translateY(-2px)",
								border: `1px solid ${glassColors.persianGold}40`,
							},
						}}
					>
						<ExpandMore
							sx={{
								color: glassColors.text.secondary,
								transform: aboutExpanded ? "rotate(180deg)" : "rotate(0deg)",
								transition: glassAnimations.transition.smooth,
							}}
						/>
					</IconButton>
				</Box>
			</Box>
		</Box>
	);
}
