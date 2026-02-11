"use client";

import { ExpandMore, PlayArrow, OpenInNew } from "@mui/icons-material";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Card,
	CardMedia,
	Typography,
} from "@mui/material";
import type { Series } from "@/types/media";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
	glassStyles,
} from "@/theme/glass-design-system";
import { useState } from "react";

interface SeasonsEpisodesProps {
	series: Series;
}

export function SeasonsEpisodes({ series }: SeasonsEpisodesProps) {
	const [expandedSeason, setExpandedSeason] = useState<string | false>(
		series.seasons[0]?.id || false,
	);

	const handleSeasonChange =
		(seasonId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpandedSeason(isExpanded ? seasonId : false);
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
				فصل‌ها و قسمت‌ها
			</Typography>

			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				{series.seasons.map((season) => (
					<Accordion
						key={season.id}
						expanded={expandedSeason === season.id}
						onChange={handleSeasonChange(season.id)}
						sx={{
							background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
							backdropFilter: glassBlur.medium,
							WebkitBackdropFilter: glassBlur.medium,
							border: `1px solid ${glassColors.glass.border}`,
							borderRadius: `${glassBorderRadius.lg}px !important`,
							boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.3)",
							transition: glassAnimations.transition.smooth,
							"&:before": {
								display: "none",
							},
							"&.Mui-expanded": {
								margin: 0,
								border: `1px solid ${glassColors.persianGold}40`,
							},
						}}
					>
						<AccordionSummary
							expandIcon={
								<ExpandMore sx={{ color: glassColors.text.secondary }} />
							}
							sx={{
								"& .MuiAccordionSummary-content": {
									margin: "16px 0",
								},
							}}
						>
							<Typography
								sx={{
									color: glassColors.text.primary,
									fontWeight: 600,
									fontSize: "1.1rem",
								}}
								dir="rtl"
							>
								{season.title} ({season.episodes.length} قسمت)
							</Typography>
						</AccordionSummary>

						<AccordionDetails>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: {
										xs: "1fr",
										sm: "repeat(2, 1fr)",
										md: "repeat(3, 1fr)",
									},
									gap: 2,
								}}
							>
								{season.episodes.map((episode) => (
									<Box
										key={episode.id}
										onClick={() => {
											const url = episode.externalPlayerUrl || series.externalPlayerUrl;
											if (url) {
												window.open(url, "_blank", "noopener,noreferrer");
											}
										}}
									>
										<Card
											sx={{
												...glassStyles.card,
												cursor: episode.externalPlayerUrl || series.externalPlayerUrl ? "pointer" : "default",
												transition: glassAnimations.transition.spring,
												position: "relative",
												overflow: "hidden",
												"&:hover": {
													transform: "translateY(-4px)",
													border: `1px solid ${glassColors.persianGold}40`,
													boxShadow: `0 12px 32px -8px ${glassColors.gold.glow}`,
													"& .play-overlay": {
														opacity: 1,
													},
												},
											}}
										>
											<Box sx={{ position: "relative", paddingTop: "56.25%" }}>
												<CardMedia
													component="img"
													image={episode.thumbnail}
													alt={episode.title}
													sx={{
														position: "absolute",
														top: 0,
														left: 0,
														width: "100%",
														height: "100%",
														objectFit: "cover",
													}}
												/>

												{/* Play Overlay */}
												<Box
													className="play-overlay"
													sx={{
														position: "absolute",
														top: 0,
														left: 0,
														right: 0,
														bottom: 0,
														background:
															"linear-gradient(180deg, transparent, rgba(0,0,0,0.7))",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														opacity: 0,
														transition: glassAnimations.transition.smooth,
													}}
												>
													<Box
														sx={{
															width: 56,
															height: 56,
															borderRadius: "50%",
															background: (episode.externalPlayerUrl || series.externalPlayerUrl)
																? `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`
																: glassColors.glass.mid,
															border: `2px solid ${(episode.externalPlayerUrl || series.externalPlayerUrl) ? glassColors.persianGold : glassColors.glass.border}`,
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															boxShadow: (episode.externalPlayerUrl || series.externalPlayerUrl)
																? `0 8px 24px -4px ${glassColors.gold.glow}`
																: "none",
															transition: glassAnimations.transition.spring,
															"&:hover": {
																transform: "scale(1.1)",
															},
														}}
													>
														<PlayArrow
															sx={{
																fontSize: "2rem",
																color: glassColors.text.primary,
															}}
														/>
													</Box>
												</Box>
											</Box>

											<Box sx={{ p: 2 }}>
												<Typography
													sx={{
														color: glassColors.text.primary,
														fontWeight: 600,
														mb: 0.5,
														fontSize: "0.9rem",
													}}
													dir="rtl"
												>
													{episode.number ? `قسمت ${episode.number}` : ""}{episode.number ? " - " : ""}{episode.title}
												</Typography>

												<Typography
													sx={{
														color: glassColors.text.secondary,
														fontSize: "0.8rem",
														mb: 1,
													}}
													dir="rtl"
												>
													{episode.duration} دقیقه
												</Typography>

												<Typography
													sx={{
														color: glassColors.text.tertiary,
														fontSize: "0.75rem",
														overflow: "hidden",
														textOverflow: "ellipsis",
														display: "-webkit-box",
														WebkitLineClamp: 2,
														WebkitBoxOrient: "vertical",
													}}
													dir="rtl"
												>
													{episode.synopsis}
												</Typography>
											</Box>
										</Card>
									</Box>
								))}
							</Box>
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		</Box>
	);
}
