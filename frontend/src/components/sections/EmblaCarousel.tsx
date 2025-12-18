"use client";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, IconButton, Typography } from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassAnimations,
	glassBorderRadius,
	glassColors,
	glassSpacing,
	glassStyles,
	sliderStyles,
} from "@/theme/glass-design-system";
import type { Movie, Series } from "@/types/media";

interface EmblaCarouselProps {
	title: string;
	items: (Movie | Series)[];
	type: "movie" | "series";
	viewAllHref?: string;
	showViewAll?: boolean;
}

/**
 * Embla Carousel with Liquid Glass Design
 * - Smooth native scrolling
 * - Glass card hover effects
 * - Responsive navigation arrows
 * - Shows 8 items per section
 */
export const EmblaCarousel = ({
	title,
	items,
	type,
	viewAllHref,
	showViewAll = true,
}: EmblaCarouselProps) => {
	const { language } = useLanguage();
	const isRTL = language === "fa";
	const PrevIcon = isRTL ? ArrowForwardIosIcon : ArrowBackIosNewIcon;
	const NextIcon = isRTL ? ArrowBackIosNewIcon : ArrowForwardIosIcon;

	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		direction: isRTL ? "rtl" : "ltr",
		slidesToScroll: 1,
		containScroll: "trimSnaps",
	});

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	useEffect(() => {
		if (emblaApi) {
			emblaApi.reInit();
		}
	}, [emblaApi, isRTL]);

	return (
		<Box
			component="section"
			sx={{
				position: "relative",
				py: `${glassSpacing.xl}px`,
			}}
		>
			{/* Header with "Show All" */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					px: { xs: 2, md: 4 },
					mb: `${glassSpacing.lg}px`,
				}}
			>
				<Typography
					variant="h3"
					sx={{
						fontWeight: 600,
						color: glassColors.text.primary,
						fontSize: { xs: "1.5rem", md: "2rem" },
					}}
				>
					{title}
				</Typography>

				{showViewAll && viewAllHref && (
					<Box
						component={Link}
						href={viewAllHref}
						sx={{
							...glassStyles.link,
							fontSize: "0.9375rem",
							display: "flex",
							alignItems: "center",
							gap: "4px",
							color: glassColors.persianGold,
							transition: glassAnimations.transition.smooth,
							"&:hover": {
								color: glassColors.gold.light,
								transform: "translateX(4px)",
							},
						}}
					>
						{language === "fa" ? "مشاهده همه" : "Show All"}
						<Box component="span" sx={{ fontSize: "18px" }}>
							→
						</Box>
					</Box>
				)}
			</Box>

			{/* Carousel Container */}
			<Box sx={{ position: "relative" }}>
				<Box
					ref={emblaRef}
					sx={{
						overflow: "hidden",
						px: { xs: 2, md: 4 },
					}}
				>
					<Box
						sx={{
							display: "flex",
							gap: 3,
							backfaceVisibility: "hidden",
							touchAction: "pan-y",
						}}
					>
						{items.slice(0, 8).map((item) => {
							const href = `/item/${item.id}`;
							return (
								<Box
									key={item.id}
									sx={{
										flex: "0 0 auto",
										width: { xs: "200px", sm: "240px", md: "280px" },
									}}
								>
									<Box
										component={Link}
										href={href}
										sx={{
											textDecoration: "none",
											color: "inherit",
											display: "block",
										}}
									>
										<Box
											sx={{
												position: "relative",
												width: "100%",
												paddingBottom: "150%",
												borderRadius: glassBorderRadius.lg,
												overflow: "hidden",
												background: glassColors.glass.base,
												backdropFilter: "blur(20px) saturate(180%)",
												WebkitBackdropFilter: "blur(20px) saturate(180%)",
												border: `1px solid ${glassColors.glass.border}`,
												boxShadow: `
                          0 8px 32px rgba(0, 0, 0, 0.4),
                          inset 0 1px 0 rgba(255, 255, 255, 0.1)
                        `,
												transition: glassAnimations.transition.spring,
												"&:hover": {
													borderColor: glassColors.glass.border,
													boxShadow: `
                            0 12px 48px rgba(0, 0, 0, 0.5),
                            inset 0 1px 0 rgba(255, 255, 255, 0.15),
                            0 0 0 1px ${glassColors.gold.glow}
                          `,
													transform: "translateY(-8px) scale(1.03)",
												},
											}}
										>
											<Image
												src={item.poster}
												alt={item.title}
												fill
												style={{
													objectFit: "cover",
												}}
												sizes="(max-width: 600px) 200px, (max-width: 960px) 240px, 280px"
												loading="lazy"
											/>

											{/* Gradient overlay */}
											<Box
												sx={{
													position: "absolute",
													bottom: 0,
													left: 0,
													right: 0,
													height: "50%",
													background:
														"linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
													pointerEvents: "none",
												}}
											/>
										</Box>

										<Typography
											variant="body2"
											sx={{
												mt: `${glassSpacing.sm}px`,
												fontWeight: 500,
												color: glassColors.text.primary,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{item.title}
										</Typography>
									</Box>
								</Box>
							);
						})}
					</Box>
				</Box>

				{/* Navigation Arrows */}
				<IconButton
					onClick={scrollPrev}
					sx={{
						...sliderStyles.arrow,
						position: "absolute",
						right: { xs: 0, md: 0 },
						top: "35%",
						transform: "translateY(-50%)",
						zIndex: 2,
						display: { xs: "none", md: "flex" },
						"&:hover": {
							background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.gold.light})`,
							color: glassColors.deepMidnight,
							transform: "translateY(-50%) scale(1.1)",
						},
					}}
				>
					<PrevIcon />
				</IconButton>

				<IconButton
					onClick={scrollNext}
					sx={{
						...sliderStyles.arrow,
						position: "absolute",
						left: { xs: 0, md: 0 },
						top: "35%",
						transform: "translateY(-50%)",
						zIndex: 2,
						display: { xs: "none", md: "flex" },
						"&:hover": {
							background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.gold.light})`,
							color: glassColors.deepMidnight,
							transform: "translateY(-50%) scale(1.1)",
						},
					}}
				>
					<NextIcon />
				</IconButton>
			</Box>
		</Box>
	);
};
