"use client";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, IconButton, Typography } from "@mui/material";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
	glassSpacing,
} from "@/theme/glass-design-system";
import type { Movie, Series } from "@/types/media";

interface BannerCarouselProps {
	items: (Movie | Series)[];
	height?: number;
	autoplayDelay?: number;
}

/**
 * Banner Carousel with Embla Fade Mode
 * - Full-width banner slides (324px height)
 * - Fade transition between slides
 * - Prev/Next navigation buttons
 * - Dot indicators
 * - Auto-advances with configurable delay
 * - Fetches backdrop images from TMDB
 */
export const BannerCarousel = ({
	items,
	height = 324,
	autoplayDelay = 5000,
}: BannerCarouselProps) => {
	const { language } = useLanguage();
	const isRTL = language === "fa";
	const PrevIcon = isRTL ? ArrowForwardIosIcon : ArrowBackIosNewIcon;
	const NextIcon = isRTL ? ArrowBackIosNewIcon : ArrowForwardIosIcon;

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: true,
			direction: isRTL ? "rtl" : "ltr",
		},
		[
			Fade(),
			Autoplay({
				delay: autoplayDelay,
				stopOnInteraction: false,
				stopOnMouseEnter: true,
			}),
		],
	);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	const scrollTo = useCallback(
		(index: number) => {
			if (emblaApi) emblaApi.scrollTo(index);
		},
		[emblaApi],
	);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;

		setScrollSnaps(emblaApi.scrollSnapList());
		onSelect();

		emblaApi.on("select", onSelect);
		emblaApi.on("reInit", onSelect);

		return () => {
			emblaApi.off("select", onSelect);
			emblaApi.off("reInit", onSelect);
		};
	}, [emblaApi, onSelect]);

	// Reinit on RTL change
	useEffect(() => {
		if (emblaApi) {
			emblaApi.reInit();
		}
	}, [emblaApi, isRTL]);

	if (!items || items.length === 0) {
		return null;
	}

	return (
		<Box
			component="section"
			sx={{
				position: "relative",
				py: `${glassSpacing.lg}px`,
				px: { xs: 2, md: 4 },
			}}
		>
			<Box
				sx={{
					maxWidth: "1400px",
					mx: "auto",
					position: "relative",
				}}
			>
				{/* Embla Viewport */}
				<Box
					ref={emblaRef}
					sx={{
						overflow: "hidden",
						borderRadius: glassBorderRadius.xl,
						border: `1px solid ${glassColors.glass.border}`,
						boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
					}}
				>
					{/* Embla Container */}
					<Box
						sx={{
							display: "flex",
							height: `${height}px`,
						}}
					>
						{items.map((item, index) => {
							const href = `/item/${item.id}`;
							// Use backdrop for full-width banners (better quality for wide images)
							const imageUrl = item.backdrop || item.poster;

							return (
								<Box
									key={`banner-${item.id}-${index}`}
									sx={{
										flex: "0 0 100%",
										minWidth: 0,
										position: "relative",
										height: "100%",
									}}
								>
									<Link
										href={href}
										style={{
											display: "block",
											width: "100%",
											height: "100%",
											position: "relative",
										}}
									>
										{/* Banner Image */}
										<Image
											src={imageUrl}
											alt={item.title}
											fill
											style={{
												objectFit: "cover",
												objectPosition: "center top",
											}}
											sizes="100vw"
											priority={index === 0}
										/>

										{/* Gradient Overlay */}
										<Box
											sx={{
												position: "absolute",
												inset: 0,
												background: `linear-gradient(
                          ${isRTL ? "to left" : "to right"},
                          ${glassColors.deepMidnight}E0 0%,
                          ${glassColors.deepMidnight}80 30%,
                          transparent 60%
                        )`,
												backdropFilter: `blur(4px)`,
											}}
										/>

										{/* Content Overlay */}
										<Box
											sx={{
												position: "absolute",
												bottom: 0,
												[isRTL ? "right" : "left"]: 0,
												p: { xs: 3, md: 4 },
												maxWidth: { xs: "100%", md: "50%" },
												textAlign: isRTL ? "right" : "left",
											}}
										>
											{/* Badge */}
											<Box
												sx={{
													display: "inline-block",
													px: 1.5,
													py: 0.5,
													mb: 1.5,
													borderRadius: glassBorderRadius.sm,
													background: `${glassColors.persianGold}30`,
													backdropFilter: `blur(${glassBlur.light}px)`,
													border: `1px solid ${glassColors.persianGold}60`,
												}}
											>
												<Typography
													variant="caption"
													sx={{
														color: glassColors.persianGold,
														fontWeight: 700,
														fontSize: "0.7rem",
														textTransform: "uppercase",
														letterSpacing: "0.05em",
													}}
												>
													{language === "fa" ? "ویژه" : "Featured"}
												</Typography>
											</Box>

											{/* Title */}
											<Typography
												variant="h4"
												sx={{
													fontWeight: 800,
													color: glassColors.text.primary,
													fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
													mb: 1,
													lineHeight: 1.2,
													textShadow: "0 2px 8px rgba(0,0,0,0.6)",
												}}
											>
												{item.title}
											</Typography>

											{/* Subtitle */}
											<Typography
												variant="body2"
												sx={{
													color: glassColors.text.secondary,
													fontSize: { xs: "0.75rem", sm: "0.875rem" },
													display: "-webkit-box",
													WebkitLineClamp: 2,
													WebkitBoxOrient: "vertical",
													overflow: "hidden",
													textShadow: "0 1px 4px rgba(0,0,0,0.4)",
												}}
											>
												{item.description?.slice(0, 150)}
												{item.description && item.description.length > 150
													? "..."
													: ""}
											</Typography>
										</Box>
									</Link>
								</Box>
							);
						})}
					</Box>
				</Box>

				{/* Navigation Arrows */}
				<IconButton
					onClick={scrollPrev}
					aria-label={isRTL ? "بعدی" : "Previous"}
					sx={{
						position: "absolute",
						top: "50%",
						[isRTL ? "right" : "left"]: { xs: -8, md: -20 },
						transform: "translateY(-50%)",
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: `blur(${glassBlur.medium}px)`,
						border: `1px solid ${glassColors.glass.border}`,
						color: glassColors.text.primary,
						width: { xs: 36, md: 44 },
						height: { xs: 36, md: 88 },
						transition: glassAnimations.transition.smooth,
						zIndex: 10,
						"&:hover": {
							background: `linear-gradient(135deg, ${glassColors.persianGold}30, ${glassColors.persianGold}20)`,
							border: `1px solid ${glassColors.persianGold}60`,
							color: glassColors.persianGold,
							transform: "translateY(-50%) scale(1.1)",
						},
					}}
				>
					<PrevIcon sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }} />
				</IconButton>

				<IconButton
					onClick={scrollNext}
					aria-label={isRTL ? "قبلی" : "Next"}
					sx={{
						position: "absolute",
						top: "50%",
						[isRTL ? "left" : "right"]: { xs: -8, md: -20 },
						transform: "translateY(-50%)",
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: `blur(${glassBlur.medium}px)`,
						border: `1px solid ${glassColors.glass.border}`,
						color: glassColors.text.primary,
					width: { xs: 36, md: 44 },
						height: { xs: 36, md: 88 },
						transition: glassAnimations.transition.smooth,
						zIndex: 10,
						"&:hover": {
							background: `linear-gradient(135deg, ${glassColors.persianGold}30, ${glassColors.persianGold}20)`,
							border: `1px solid ${glassColors.persianGold}60`,
							color: glassColors.persianGold,
							transform: "translateY(-50%) scale(1.1)",
						},
					}}
				>
					<NextIcon sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }} />
				</IconButton>

				{/* Dot Indicators */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: 1,
						mt: 2,
					}}
				>
					{scrollSnaps.map((_, index) => (
						<Box
							key={`dot-${index}`}
							onClick={() => scrollTo(index)}
							sx={{
								width: selectedIndex === index ? 24 : 8,
								height: 8,
								borderRadius: 4,
								background:
									selectedIndex === index
										? glassColors.persianGold
										: `${glassColors.glass.strong}`,
								border: `1px solid ${
									selectedIndex === index
										? glassColors.persianGold
										: glassColors.glass.border
								}`,
								cursor: "pointer",
								transition: glassAnimations.transition.smooth,
								"&:hover": {
									background:
										selectedIndex === index
											? glassColors.persianGold
											: `${glassColors.persianGold}50`,
								},
							}}
						/>
					))}
				</Box>
			</Box>
		</Box>
	);
};
