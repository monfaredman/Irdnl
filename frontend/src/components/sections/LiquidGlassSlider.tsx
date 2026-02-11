"use client";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Container, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
	sliderStyles,
} from "@/theme/glass-design-system";
import type { Movie, Series } from "@/types/media";

interface LiquidGlassSliderProps {
	items: (Movie | Series)[];
	type: "movie" | "series";
	autoplayDelay?: number;
}

/**
 * Premium Liquid Glass Content Slider
 *
 * Features:
 * - Glass morphism with backdrop blur
 * - Smooth autoplay + manual navigation
 * - Floating glass arrows + dot indicators
 * - Parallax effect on scroll
 * - Lazy loading for performance
 * - Keyboard navigation (Arrow keys)
 * - Touch/swipe support for mobile
 * - 60fps optimized animations
 */
export const LiquidGlassSlider = ({
	items,
	type,
	autoplayDelay = 5000,
}: LiquidGlassSliderProps) => {
	const { language } = useLanguage();
	const isRTL = language === "fa";
	const PrevIcon = isRTL ? ArrowForwardIosIcon : ArrowBackIosNewIcon;
	const NextIcon = isRTL ? ArrowBackIosNewIcon : ArrowForwardIosIcon;
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isHovering, setIsHovering] = useState(false);
	const [touchStart, setTouchStart] = useState(0);
	const [touchEnd, setTouchEnd] = useState(0);
	const sliderRef = useRef<HTMLDivElement>(null);
	const autoplayRef = useRef<NodeJS.Timeout | null>(null);

	// Featured items (first 5)
	const featuredItems = items.slice(0, 5);
	const totalSlides = featuredItems.length;

	// Autoplay logic
	useEffect(() => {
		if (!isHovering && autoplayDelay > 0) {
			autoplayRef.current = setInterval(() => {
				setCurrentIndex((prev) => (prev + 1) % totalSlides);
			}, autoplayDelay);
		}

		return () => {
			if (autoplayRef.current) {
				clearInterval(autoplayRef.current);
			}
		};
	}, [isHovering, autoplayDelay, totalSlides]);

	// Navigation functions
	const goToSlide = useCallback((index: number) => {
		setCurrentIndex(index);
	}, []);

	const goToPrevious = useCallback(() => {
		setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
	}, [totalSlides]);

	const goToNext = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % totalSlides);
	}, [totalSlides]);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				if (isRTL) {
					goToNext();
				} else {
					goToPrevious();
				}
			} else if (e.key === "ArrowRight") {
				if (isRTL) {
					goToPrevious();
				} else {
					goToNext();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [goToPrevious, goToNext, isRTL]);

	// Touch/swipe handlers
	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStart(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = () => {
		if (!touchStart || !touchEnd) return;

		const distance = (touchStart - touchEnd) * (isRTL ? -1 : 1);
		const minSwipeDistance = 50;

		if (distance > minSwipeDistance) {
			goToNext();
		} else if (distance < -minSwipeDistance) {
			goToPrevious();
		}

		setTouchStart(0);
		setTouchEnd(0);
	};

	return (
		<Box
			ref={sliderRef}
			component="section"
			role="region"
			aria-label="Featured content slider"
			sx={{
				position: "relative",
				width: "100%",
				height: { xs: "70vh", sm: "80vh", md: "85vh", lg: "92vh" },
				minHeight: { xs: "480px", md: "560px" },
				overflow: "hidden",
				mb: 8,
			}}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			{/* Slides Container */}
			<Box
				sx={{
					position: "relative",
					width: "100%",
					height: "100%",
				}}
			>
				{featuredItems.map((item, index) => {
					const isActive = index === currentIndex;
					const isPrev =
						index === (currentIndex - 1 + totalSlides) % totalSlides;
					const isNext = index === (currentIndex + 1) % totalSlides;
					const isVisible = isActive || isPrev || isNext;
					const prevTranslate = isRTL
						? "translateX(100%) scale(0.9)"
						: "translateX(-100%) scale(0.9)";
					const nextTranslate = isRTL
						? "translateX(-100%) scale(0.9)"
						: "translateX(100%) scale(0.9)";

					return (
						<Box
							key={item.id}
							sx={{
								position: "absolute",
								inset: 0,
								opacity: isActive ? 1 : 0,
								transform: isActive
									? "translateX(0) scale(1)"
									: isPrev
										? prevTranslate
										: isNext
											? nextTranslate
											: "translateX(0) scale(0.9)",
								transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
								pointerEvents: isActive ? "auto" : "none",
								visibility: isVisible ? "visible" : "hidden",
								zIndex: isActive ? 2 : 1,
							}}
						>
							{/* Background Image with Parallax */}
							<Box
								sx={{
									position: "absolute",
									inset: 0,
									transform: isActive ? "scale(1.05)" : "scale(1)",
									transition: "transform 0.7s ease-out",
									"&::after": {
										content: '""',
										position: "absolute",
										inset: 0,
										background:
											"linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)",
								zIndex: 1,
							},
						}}
					>
						{(item.backdrop || item.poster) && (
							<Image
								src={item.backdrop || item.poster}
								alt={item.title}
								fill
								style={{
									objectFit: "cover",
								}}
								sizes="100vw"
								priority={index === 0}
								loading={index === 0 ? "eager" : "lazy"}
							/>
						)}
					</Box>							{/* Content Overlay */}
							<Container
								maxWidth="xl"
								sx={{
									position: "relative",
									zIndex: 2,
									height: "100%",
									display: "flex",
									alignItems: "flex-end",
									pb: { xs: 8, md: 12 },
								}}
							>
								<Box
									sx={{
										maxWidth: "600px",
										opacity: isActive ? 1 : 0,
										transform: isActive ? "translateY(0)" : "translateY(30px)",
										transition:
											"all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
									}}
								>
									{/* Glass Card */}
									<Box
										sx={{
											p: { xs: 3, md: 4 },
											background: "rgba(10, 10, 10, 0.50)",
											backdropFilter: `blur(${glassBlur.strong}px) saturate(180%)`,
											WebkitBackdropFilter: `blur(${glassBlur.strong}px) saturate(180%)`,
											border: `1px solid ${glassColors.glass.border}`,
											borderRadius: glassBorderRadius.xxl,
											boxShadow: `
                        0 8px 32px rgba(0, 0, 0, 0.6),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15)
                      `,
										}}
									>
										<Typography
											variant="h2"
											sx={{
												mb: 2,
												color: glassColors.text.primary,
												fontWeight: 700,
												textShadow:
													"0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)",
											}}
										>
											{item.title}
										</Typography>

										<Typography
											variant="body1"
											sx={{
												mb: 3,
												color: "rgba(255, 255, 255, 0.92)",
												display: "-webkit-box",
												WebkitLineClamp: 3,
												WebkitBoxOrient: "vertical",
												overflow: "hidden",
												textShadow: "0 1px 4px rgba(0, 0, 0, 0.7)",
											}}
										>
											{item.description}
										</Typography>

										{/* CTA Button */}
										<Box
											component={Link}
											href={`/item/${item.id}`}
											sx={{
												display: "inline-flex",
												alignItems: "center",
												gap: 1,
												px: 4,
												py: 2,
												background: glassColors.persianGold,
												color: glassColors.deepMidnight,
												fontSize: "17px",
												fontWeight: 600,
												borderRadius: glassBorderRadius.lg,
												textDecoration: "none",
												border: `1px solid rgba(255, 255, 255, 0.1)`,
												boxShadow: `
                          0 8px 32px ${glassColors.gold.glow},
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
												transition: glassAnimations.transition.spring,
												"&:hover": {
													background: glassColors.gold.light,
													boxShadow: `
                            0 12px 48px rgba(245, 158, 11, 0.4),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3)
                          `,
													transform: "translateY(-2px) scale(1.02)",
												},
											}}
										>
											<PlayArrowIcon />
											{language === "fa" ? "تماشا" : "Watch Now"}
										</Box>
									</Box>
								</Box>
							</Container>
						</Box>
					);
				})}
			</Box>

			{/* Navigation Arrows - Floating Glass */}
			<IconButton
				onClick={goToPrevious}
				aria-label="Previous slide"
				sx={{
					...sliderStyles.arrow,
					position: "absolute",
					...(isRTL
						? { right: { xs: 16, md: 32 } }
						: { left: { xs: 16, md: 32 } }),
					top: "50%",
					transform: "translateY(-50%)",
					zIndex: 10,
					width: { xs: 48, md: 56 },
					height: { xs: 48, md: 56 },
					opacity: isHovering ? 1 : 0.5,
					"&:hover": {
						background: glassColors.glass.strong,
						transform: "translateY(-50%) scale(1.1)",
						borderColor: glassColors.persianGold,
					},
				}}
			>
				<PrevIcon />
			</IconButton>

			<IconButton
				onClick={goToNext}
				aria-label="Next slide"
				sx={{
					...sliderStyles.arrow,
					position: "absolute",
					...(isRTL
						? { left: { xs: 16, md: 32 } }
						: { right: { xs: 16, md: 32 } }),
					top: "50%",
					transform: "translateY(-50%)",
					zIndex: 10,
					width: { xs: 48, md: 56 },
					height: { xs: 48, md: 56 },
					opacity: isHovering ? 1 : 0.5,
					"&:hover": {
						background: glassColors.glass.strong,
						transform: "translateY(-50%) scale(1.1)",
						borderColor: glassColors.persianGold,
					},
				}}
			>
				<NextIcon />
			</IconButton>

			{/* Dot Indicators */}
			<Box
				sx={{
					position: "absolute",
					bottom: 32,
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 20,
					display: "flex",
					gap: 1.5,
					px: 3,
					py: 1.5,
					background: "rgba(10, 10, 10, 0.85)",
					backdropFilter: `blur(${glassBlur.strong}px)`,
					border: `1px solid rgba(255, 255, 255, 0.2)`,
					borderRadius: glassBorderRadius.pill,
					boxShadow:
						"0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
				}}
			>
				{featuredItems.map((_, index) => (
					<Box
						key={index}
						component="button"
						onClick={() => goToSlide(index)}
						aria-label={`Go to slide ${index + 1}`}
						aria-current={index === currentIndex ? "true" : "false"}
						sx={{
							...sliderStyles.dot,
							width: index === currentIndex ? 32 : 8,
							height: 8,
							borderRadius: glassBorderRadius.sm,
							background:
								index === currentIndex
									? glassColors.persianGold
									: "rgba(255, 255, 255, 0.4)",
							border:
								index === currentIndex
									? `1px solid ${glassColors.persianGold}`
									: "1px solid rgba(255, 255, 255, 0.3)",
							transition: glassAnimations.transition.spring,
							cursor: "pointer",
							boxShadow:
								index === currentIndex
									? `0 0 12px ${glassColors.gold.glow}`
									: "none",
							"&:hover": {
								background:
									index === currentIndex
										? glassColors.gold.light
										: "rgba(255, 255, 255, 0.7)",
							},
						}}
					/>
				))}
			</Box>
		</Box>
	);
};
