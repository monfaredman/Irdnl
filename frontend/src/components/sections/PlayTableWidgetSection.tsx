"use client";

import { memo, useMemo, useRef, useState, useCallback, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import LiveTvRoundedIcon from "@mui/icons-material/LiveTvRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";
import {
	glassAnimations,
	glassBorderRadius,
	glassColors,
	createGoldGlow,
} from "@/theme/glass-design-system";
import type { PlayTablePublic } from "@/lib/api/public";

// ============================================================================
// TYPES
// ============================================================================

interface PlayTableWidgetSectionProps {
	playTables: PlayTablePublic[];
}

interface TimelineEntry {
	playTable: PlayTablePublic;
	content: PlayTablePublic["contents"][number];
}

// ============================================================================
// HELPERS
// ============================================================================

function formatTime(dateStr: string, lang: string): string {
	try {
		return new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", {
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(dateStr));
	} catch {
		return "";
	}
}

function isCurrentlyLive(startStr: string, endStr: string): boolean {
	const now = Date.now();
	return now >= new Date(startStr).getTime() && now <= new Date(endStr).getTime();
}

// ============================================================================
// TIMELINE CARD
// ============================================================================

interface TimelineCardProps {
	entry: TimelineEntry;
	language: string;
	isRTL: boolean;
	isLive: boolean;
}

const TimelineCard = memo(function TimelineCard({
	entry,
	language,
	isRTL,
	isLive,
}: TimelineCardProps) {
	const { playTable, content } = entry;
	const title = content.title || content.originalTitle || "";
	const posterUrl = content.posterUrl || "";
	const ptTitle = (language === "fa" ? playTable.titleFa : null) || playTable.title;
	const timeStr = formatTime(playTable.startTime, language);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				width: { xs: 130, sm: 150 },
				flexShrink: 0,
				position: "relative",
				pt: "8px", // room for hover lift
			}}
		>
			{/* ── Card ── */}
			<Link href={`/item/${content.id}`} style={{ textDecoration: "none", width: "100%" }}>
				<Box
					sx={{
						position: "relative",
						width: "100%",
						aspectRatio: "2/3",
						borderRadius: glassBorderRadius.md,
						overflow: "hidden",
						border: `1px solid ${isLive ? `${glassColors.persianGold}50` : glassColors.glass.border}`,
						transition: glassAnimations.transition.spring,
						cursor: "pointer",
						"&:hover": {
							transform: "translateY(-6px)",
							boxShadow: isLive
								? `0 16px 40px -10px ${glassColors.persianGold}35`
								: `0 16px 40px -10px rgba(0,0,0,0.5)`,
							border: `1px solid ${isLive ? `${glassColors.persianGold}70` : "rgba(255,255,255,0.15)"}`,
						},
					}}
				>
					{/* Poster image */}
					{posterUrl ? (
						<Image
							src={posterUrl}
							alt={title}
							fill
							style={{ objectFit: "cover" }}
							sizes="160px"
						/>
					) : (
						<Box
							sx={{
								width: "100%",
								height: "100%",
								background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.base})`,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<LiveTvRoundedIcon sx={{ fontSize: 32, color: glassColors.text.muted }} />
						</Box>
					)}

					{/* Bottom gradient */}
					<Box
						sx={{
							position: "absolute",
							bottom: 0,
							left: 0,
							right: 0,
							height: "55%",
							background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)",
							pointerEvents: "none",
						}}
					/>

					{/* Live badge */}
					{isLive && (
						<Box
							sx={{
								position: "absolute",
								top: 8,
								...(isRTL ? { right: 8 } : { left: 8 }),
								display: "flex",
								alignItems: "center",
								gap: 0.4,
								px: 0.8,
								py: 0.2,
								borderRadius: "6px",
								background: "rgba(239, 68, 68, 0.9)",
								backdropFilter: "blur(4px)",
							}}
						>
							{/* Pulse dot */}
							<Box sx={{ position: "relative", width: 6, height: 6, flexShrink: 0 }}>
								<Box
									sx={{
										position: "absolute",
										inset: 0,
										borderRadius: "50%",
										bgcolor: "#fff",
										animation: "lp 2s ease-in-out infinite",
										"@keyframes lp": {
											"0%,100%": { transform: "scale(1)", opacity: 1 },
											"50%": { transform: "scale(2)", opacity: 0 },
										},
									}}
								/>
								<Box sx={{ position: "absolute", inset: 0, borderRadius: "50%", bgcolor: "#fff" }} />
							</Box>
							<Typography sx={{ fontSize: "0.55rem", color: "#fff", fontWeight: 700, lineHeight: 1 }}>
								{language === "fa" ? "زنده" : "LIVE"}
							</Typography>
						</Box>
					)}

					{/* Rating */}
					{content.rating && (
						<Box
							sx={{
								position: "absolute",
								top: 8,
								...(isRTL ? { left: 8 } : { right: 8 }),
								px: 0.6,
								py: 0.15,
								borderRadius: "6px",
								background: "rgba(0,0,0,0.6)",
								backdropFilter: "blur(4px)",
								border: "1px solid rgba(255,255,255,0.08)",
							}}
						>
							<Typography sx={{ fontSize: "0.6rem", color: glassColors.text.secondary, fontWeight: 600 }}>
								⭐ {content.rating}
							</Typography>
						</Box>
					)}

					{/* Title overlay at bottom */}
					<Box
						sx={{
							position: "absolute",
							bottom: 0,
							left: 0,
							right: 0,
							px: 1,
							pb: 1,
							pt: 3,
						}}
					>
						<Typography
							sx={{
								color: "#fff",
								fontSize: "0.75rem",
								fontWeight: 600,
								lineHeight: 1.25,
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
								direction: isRTL ? "rtl" : "ltr",
								textAlign: isRTL ? "right" : "left",
							}}
						>
							{title}
						</Typography>
						{content.year && (
							<Typography
								sx={{
									color: glassColors.text.muted,
									fontSize: "0.6rem",
									fontWeight: 400,
									mt: 0.2,
									direction: isRTL ? "rtl" : "ltr",
									textAlign: isRTL ? "right" : "left",
								}}
							>
								{language === "fa"
									? new Intl.NumberFormat("fa-IR").format(content.year)
									: content.year}
							</Typography>
						)}
					</Box>
				</Box>
			</Link>

			{/* ── Connector stem (card → timeline dot) ── */}
			<Box
				sx={{
					width: 2,
					height: 16,
					background: isLive
						? `linear-gradient(180deg, ${glassColors.persianGold}80, ${glassColors.persianGold})`
						: `linear-gradient(180deg, ${glassColors.glass.border}, rgba(255,255,255,0.18))`,
				}}
			/>

			{/* ── Timeline dot with line ── */}
			<Box
				sx={{
					position: "relative",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					flexShrink: 0,
				}}
			>
				{/* Horizontal line through the centre of the dot */}
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "-50%",
						right: "-50%",
						height: 1,
						transform: "translateY(-50%)",
						background: `linear-gradient(${isRTL ? "270deg" : "90deg"}, ${glassColors.glass.border}, rgba(255,255,255,0.06))`,
						pointerEvents: "none",
						zIndex: 1,
					}}
				/>
				<Box
					sx={{
						width: isLive ? 12 : 8,
						height: isLive ? 12 : 8,
						borderRadius: "50%",
						background: isLive
							? glassColors.persianGold
							: glassColors.glass.strong,
						border: `2px solid ${isLive ? glassColors.persianGold : "rgba(255,255,255,0.12)"}`,
						boxShadow: isLive ? createGoldGlow(12, -2, 0.6) : "none",
						flexShrink: 0,
						position: "relative",
						zIndex: 2,
					}}
				/>
			</Box>

			{/* ── Time label below dot ── */}
			<Typography
				sx={{
					mt: 0.8,
					fontSize: "0.65rem",
					fontWeight: 600,
					color: isLive ? glassColors.persianGold : glassColors.text.muted,
					whiteSpace: "nowrap",
					lineHeight: 1,
				}}
			>
				{timeStr}
			</Typography>

			{/* ── Schedule name ── */}
			<Typography
				sx={{
					mt: 0.25,
					fontSize: "0.55rem",
					fontWeight: 400,
					color: glassColors.text.muted,
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
					maxWidth: "100%",
					textAlign: "center",
					direction: isRTL ? "rtl" : "ltr",
				}}
			>
				{ptTitle}
			</Typography>
		</Box>
	);
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PlayTableWidgetSection = memo(function PlayTableWidgetSection({
	playTables,
}: PlayTableWidgetSectionProps) {
	const { language } = useLanguage();
	const isRTL = language === "fa";
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	// Flatten all play tables → individual content entries
	const entries: TimelineEntry[] = useMemo(() => {
		const out: TimelineEntry[] = [];
		for (const pt of playTables) {
			if (!pt.contents?.length) continue;
			for (const c of pt.contents) {
				out.push({ playTable: pt, content: c });
			}
		}
		return out;
	}, [playTables]);

	// Check scroll arrows visibility
	const updateScrollState = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		const tolerance = 4;
		const maxScroll = el.scrollWidth - el.clientWidth;

		if (maxScroll <= 0) {
			// All items fit — no scrolling possible
			setCanScrollLeft(false);
			setCanScrollRight(false);
			return;
		}

		// Math.abs normalises the RTL negative-scrollLeft browsers
		const scrollPos = Math.abs(el.scrollLeft);
		setCanScrollLeft(scrollPos > tolerance);
		setCanScrollRight(scrollPos < maxScroll - tolerance);
	}, []);

	const scroll = useCallback((dir: "left" | "right") => {
		const el = scrollRef.current;
		if (!el) return;
		const amount = 320;
		// In RTL the "forward" direction is negative scrollLeft
		const sign = dir === "left" ? -1 : 1;
		el.scrollBy({ left: sign * amount, behavior: "smooth" });
	}, []);

	const onScroll = useCallback(() => updateScrollState(), [updateScrollState]);

	// Attach ref + listen for resize
	const onRefReady = useCallback(
		(node: HTMLDivElement | null) => {
			(scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
			if (node) {
				updateScrollState();
			}
		},
		[updateScrollState],
	);

	// Re-check scroll state on resize
	useEffect(() => {
		const handleResize = () => updateScrollState();
		window.addEventListener("resize", handleResize);
		// Also update once after images may have loaded
		const timer = setTimeout(updateScrollState, 600);
		return () => {
			window.removeEventListener("resize", handleResize);
			clearTimeout(timer);
		};
	}, [updateScrollState, entries.length]);

	if (entries.length === 0) return null;

	const sectionTitle = language === "fa" ? "جدول پخش" : "Schedule";

	return (
		<Box
			sx={{
				maxWidth: 1400,
				mx: "auto",
				px: { xs: 2, sm: 3, md: 4 },
				py: { xs: 3, md: 5 },
			}}
		>
			{/* ── Header row ── */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					mb: 3,
					direction: isRTL ? "rtl" : "ltr",
				}}
			>
				{/* Title group */}
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<LiveTvRoundedIcon
						sx={{ fontSize: 20, color: glassColors.persianGold }}
					/>
					<Typography
						sx={{
							color: glassColors.text.primary,
							fontWeight: 700,
							fontSize: { xs: "1rem", sm: "1.15rem" },
							letterSpacing: "-0.01em",
						}}
					>
						{sectionTitle}
					</Typography>
					<Box
						sx={{
							ml: 1,
							px: 1,
							py: 0.2,
							borderRadius: "6px",
							background: glassColors.glass.mid,
							border: `1px solid ${glassColors.glass.border}`,
						}}
					>
						<Typography
							sx={{
								fontSize: "0.65rem",
								fontWeight: 500,
								color: glassColors.text.tertiary,
							}}
						>
							{entries.length} {language === "fa" ? "عنوان" : "titles"}
						</Typography>
					</Box>
				</Box>

				{/* Nav arrows */}
				<Box sx={{ display: "flex", gap: 0.5 }}>
					<IconButton
						onClick={() => scroll(isRTL ? "right" : "left")}
						disabled={!canScrollLeft}
						size="small"
						sx={{
							width: 32,
							height: 32,
							background: glassColors.glass.mid,
							border: `1px solid ${glassColors.glass.border}`,
							color: glassColors.text.secondary,
							transition: glassAnimations.transition.spring,
							"&:hover": {
								background: glassColors.glass.strong,
								border: "1px solid rgba(255,255,255,0.15)",
							},
							"&.Mui-disabled": { opacity: 0.25 },
						}}
					>
						{isRTL ? <ChevronRightRoundedIcon sx={{ fontSize: 18 }} /> : <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />}
					</IconButton>
					<IconButton
						onClick={() => scroll(isRTL ? "left" : "right")}
						disabled={!canScrollRight}
						size="small"
						sx={{
							width: 32,
							height: 32,
							background: glassColors.glass.mid,
							border: `1px solid ${glassColors.glass.border}`,
							color: glassColors.text.secondary,
							transition: glassAnimations.transition.spring,
							"&:hover": {
								background: glassColors.glass.strong,
								border: "1px solid rgba(255,255,255,0.15)",
							},
							"&.Mui-disabled": { opacity: 0.25 },
						}}
					>
						{isRTL ? <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} /> : <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />}
					</IconButton>
				</Box>
			</Box>

			{/* ── Horizontal scroll container ── */}
			<Box
				ref={onRefReady}
				onScroll={onScroll}
				sx={{
					display: "flex",
					gap: { xs: 2, sm: 3 },
					overflowX: "auto",
					pt: "12px", // room above cards for hover translateY(-6px)
					pb: "6px",
					direction: isRTL ? "rtl" : "ltr",
					scrollSnapType: "x mandatory",
					"&::-webkit-scrollbar": { display: "none" },
					msOverflowStyle: "none",
					scrollbarWidth: "none",
				}}
			>
				{entries.map((entry) => {
					const live = isCurrentlyLive(entry.playTable.startTime, entry.playTable.endTime);
					return (
						<Box
							key={`${entry.playTable.id}-${entry.content.id}`}
							sx={{ scrollSnapAlign: "start", position: "relative" }}
						>
							<TimelineCard
								entry={entry}
								language={language}
								isRTL={isRTL}
								isLive={live}
							/>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
});

export default PlayTableWidgetSection;
