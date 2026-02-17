"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";
import {
	glassAnimations,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import { useWidgetGrid, type WidgetConfig } from "@/hooks/useWidgetGrid";
import { WidgetGrid, DraggableWidget } from "@/components/interactive";
import { pickWidgetImage } from "@/lib/tmdb-images";
import { useResponsiveValue } from "@/hooks/useResponsive";
import type { Movie, Series } from "@/types/media";

// ============================================================================
// TYPES
// ============================================================================

export interface OfferItem {
	id: string;
	title: string;
	titleFa?: string;
	imageUrl?: string;
	backdropUrl?: string;
	linkUrl?: string;
	contentId?: string;
	discountPercent?: number;
}

interface IOSWidgetGridSectionProps {
	items?: (Movie | Series)[];
	title?: string;
	storageKey?: string;
	offers?: OfferItem[];
}

type ChipType = "dubbed" | "free" | "subtitle" | "offer";

// ============================================================================
// CONSTANTS
// ============================================================================

const ITEM_COUNT = 7;
const GAP = 16;

// Desktop: 4 columns – original layout
const DESKTOP_COLS = 4;
const DESKTOP_ROW_HEIGHT = 180;
const DESKTOP_WIDGET_CONFIGS: WidgetConfig[] = [
	{ id: "widget-0", colSpan: 2, rowSpan: 2, type: "large" },
	{ id: "widget-1", colSpan: 1, rowSpan: 1, type: "small" },
	{ id: "widget-2", colSpan: 1, rowSpan: 2, type: "poster" },
	{ id: "widget-3", colSpan: 1, rowSpan: 1, type: "small" },
	{ id: "widget-4", colSpan: 2, rowSpan: 1, type: "medium" },
	{ id: "widget-5", colSpan: 1, rowSpan: 1, type: "small" },
	{ id: "widget-6", colSpan: 1, rowSpan: 1, type: "small" },
];

// Tablet: 3 columns – clamp colSpan to 3
const TABLET_COLS = 3;
const TABLET_ROW_HEIGHT = 160;
const TABLET_WIDGET_CONFIGS: WidgetConfig[] = [
	{ id: "widget-0", colSpan: 2, rowSpan: 2, type: "large" },
	{ id: "widget-1", colSpan: 1, rowSpan: 1, type: "small" },
	{ id: "widget-2", colSpan: 1, rowSpan: 2, type: "poster" },
	{ id: "widget-3", colSpan: 1, rowSpan: 1, type: "small" },
	{ id: "widget-4", colSpan: 2, rowSpan: 1, type: "medium" },
	{ id: "widget-5", colSpan: 1, rowSpan: 1, type: "small" },
	{ id: "widget-6", colSpan: 1, rowSpan: 1, type: "small" },
];

// Mobile: 2 columns – all widgets max 2 wide, poster gets full width
const MOBILE_COLS = 2;
const MOBILE_ROW_HEIGHT = 150;
const MOBILE_WIDGET_CONFIGS: WidgetConfig[] = [
	{ id: "widget-0", colSpan: 2, rowSpan: 2, type: "large" },
	{ id: "widget-1", colSpan: 1, rowSpan: 1, type: "small" },
	{ id: "widget-2", colSpan: 1, rowSpan: 2, type: "poster" },
	{ id: "widget-3", colSpan: 1, rowSpan: 1, type: "small" },
	{ id: "widget-4", colSpan: 2, rowSpan: 1, type: "medium" },
	{ id: "widget-5", colSpan: 1, rowSpan: 1, type: "small" },
	{ id: "widget-6", colSpan: 1, rowSpan: 1, type: "small" },
];

const STORAGE_KEY = "ios_widget_grid_layout";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getChipLabel = (type: ChipType, language: string): string => {
	const labels = {
		dubbed: language === "fa" ? "دوبله" : "Dubbed",
		free: language === "fa" ? "رایگان" : "Free",
		subtitle: language === "fa" ? "زیرنویس" : "Subtitle",
		offer: language === "fa" ? "پیشنهاد" : "Offer",
	};
	return labels[type];
};

const getChipColor = (type: ChipType): string => {
	const colors = {
		dubbed: glassColors.persianGold,
		free: "#10b981",
		subtitle: "#3b82f6",
		offer: "#ef4444",
	};
	return colors[type];
};

const getItemChip = (index: number): ChipType => {
	const types: ChipType[] = ["dubbed", "free", "subtitle"];
	return types[index % 3];
};

// ============================================================================
// WIDGET CONTENT COMPONENT
// ============================================================================

interface WidgetContentProps {
	item: Movie | Series;
	chipType: ChipType;
	language: string;
	isRTL: boolean;
	isDragging: boolean;
	widgetType: WidgetConfig["type"];
	priority?: boolean;
}

const WidgetContent = memo(function WidgetContent({
	item,
	chipType,
	language,
	isRTL,
	isDragging,
	widgetType,
	priority = false,
}: WidgetContentProps) {
	const chipColor = getChipColor(chipType);
	const href = (item as any).linkUrl || `/item/${item.id}`;
	const isSeries = "type" in item;
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);

	// Map widget types to TMDB image kinds + sizes.
	// Requirements:
	// - large (688x374): backdrop
	// - small (335x178): poster
	// - medium (688x178): backdrop (prefer original, center-crop)
	// - poster (335x374): poster
	const { imageUrl, objectPosition, sizes } = useMemo(() => {
		const posterUrl = item.poster;
		const backdropUrl = item.backdrop;

		switch (widgetType) {
			case "large": {
				return {
					imageUrl: pickWidgetImage({
						kind: "backdrop",
						size: "w1280",
						backdropUrl,
						posterUrl,
					}),
					objectPosition: "center",
					sizes:
						"(max-width: 600px) 100vw, (max-width: 960px) 100vw, 50vw",
				};
			}
			case "medium": {
				// Prefer a max-resolution backdrop since we are aggressively cropping to 3.86:1.
				return {
					imageUrl: pickWidgetImage({
						kind: "backdrop",
						size: "original",
						backdropUrl,
						posterUrl,
					}),
					// Vertical centering for crop preference
					objectPosition: "center 50%",
					sizes:
						"(max-width: 600px) 100vw, (max-width: 960px) 100vw, 50vw",
				};
			}
			case "poster": {
				return {
					imageUrl: pickWidgetImage({
						kind: "poster",
						size: "w500",
						backdropUrl,
						posterUrl,
					}),
					objectPosition: "center",
					sizes:
						"(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw",
				};
			}
			case "small":
			default: {
				return {
					imageUrl: pickWidgetImage({
						kind: "poster",
						size: "w342",
						backdropUrl,
						posterUrl,
					}),
					objectPosition: "center",
					sizes:
						"(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw",
				};
			}
		}
	}, [item.backdrop, item.poster, widgetType]);

	return (
		<Box
			sx={{
				position: "relative",
				width: "100%",
				height: "100%",
				overflow: "hidden",
				background: `linear-gradient(135deg, ${glassColors.glass.mid}, ${glassColors.glass.base})`,
			}}
		>
			{/* Loading shimmer */}
			{!isLoaded && !hasError && (
				<Box
					sx={{
						position: "absolute",
						inset: 0,
						zIndex: 1,
						background: `linear-gradient(90deg, ${glassColors.glass.base}, ${glassColors.glass.strong}, ${glassColors.glass.base})`,
						backgroundSize: "200% 100%",
						animation: "shimmer 1.2s ease-in-out infinite",
					}}
				/>
			)}

			{/* Error fallback */}
			{hasError && (
				<Box
					sx={{
						position: "absolute",
						inset: 0,
						zIndex: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background: `linear-gradient(135deg, ${glassColors.deepMidnight}CC, ${glassColors.deepMidnight}99)`,
						color: glassColors.text.secondary,
						fontSize: "0.75rem",
						textAlign: "center",
						p: 2,
					}}
				>
					{language === "fa" ? "تصویر در دسترس نیست" : "Image unavailable"}
				</Box>
			)}

			{/* Background Image */}
			<Image
				src={imageUrl}
				alt={item.title}
				fill
				style={{ objectFit: "cover", objectPosition }}
				sizes={sizes}
				loading="lazy"
				onLoad={() => setIsLoaded(true)}
				onError={() => setHasError(true)}
				draggable={false}
			/>

			{/* Chip Badge */}
			<Box
				sx={{
					position: "absolute",
					top: 12,
					[isRTL ? "left" : "right"]: 12,
					zIndex: 2,
				}}
			>
				<Chip
					label={getChipLabel(chipType, language)}
					size="small"
					sx={{
						background: `${chipColor}30`,
						backdropFilter: `blur(8px)`,
						border: `1px solid ${chipColor}60`,
						color: chipColor,
						fontWeight: 600,
						fontSize: "0.75rem",
						boxShadow: `0 4px 16px ${chipColor}40`,
					}}
				/>
			</Box>

			{/* Hover Overlay with Link */}
			<Box
				className="hover-overlay"
				sx={{
					position: "absolute",
					inset: 0,
					background: `linear-gradient(
						to top,
						${glassColors.deepMidnight}F5 0%,
						${glassColors.deepMidnight}E0 40%,
						${glassColors.deepMidnight}80 70%,
						transparent 100%
					)`,
					backdropFilter: `blur(8px) saturate(120%)`,
					opacity: 0,
					transition: glassAnimations.transition.smooth,
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-end",
					p: 2,
					"&:hover": {
						opacity: 1,
					},
				}}
			>
				<Link
					href={href}
					style={{
						position: "absolute",
						inset: 0,
						zIndex: 1,
					}}
					onClick={(e) => {
						if (isDragging) {
							e.preventDefault();
						}
					}}
				/>

				<Typography
					variant="h6"
					sx={{
						fontWeight: 700,
						color: glassColors.text.primary,
						fontSize: { xs: "0.875rem", sm: "1rem" },
						mb: 0.5,
						lineHeight: 1.3,
						textAlign: isRTL ? "right" : "left",
						position: "relative",
						zIndex: 2,
						pointerEvents: "none",
					}}
				>
					{item.title}
				</Typography>

				<Typography
					variant="body2"
					sx={{
						color: glassColors.text.secondary,
						fontSize: { xs: "0.75rem", sm: "0.875rem" },
						mb: 1,
						textAlign: isRTL ? "right" : "left",
						textTransform: "capitalize",
						position: "relative",
						zIndex: 2,
						pointerEvents: "none",
					}}
				>
					{item.slug ? item.slug.replace(/-/g, " ") : item.title}
				</Typography>

				{"rating" in item && item.rating && (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 0.5,
							mb: 1,
							justifyContent: isRTL ? "flex-end" : "flex-start",
							position: "relative",
							zIndex: 2,
							pointerEvents: "none",
						}}
					>
						<StarIcon
							sx={{
								fontSize: "1rem",
								color: glassColors.persianGold,
							}}
						/>
						<Typography
							variant="body2"
							sx={{
								fontWeight: 600,
								color: glassColors.text.primary,
							}}
						>
							{item.rating}
						</Typography>
						<Typography
							variant="caption"
							sx={{
								color: glassColors.text.tertiary,
								ml: 0.5,
							}}
						>
							IMDb
						</Typography>
					</Box>
				)}

				<Typography
					variant="caption"
					sx={{
						color: glassColors.text.secondary,
						fontSize: "0.75rem",
						textAlign: isRTL ? "right" : "left",
						position: "relative",
						zIndex: 2,
						pointerEvents: "none",
					}}
				>
					{isSeries
						? `${language === "fa" ? "سریال" : "Series"} • ${
								(item as Series).seasons?.length || 1
							} ${
								language === "fa"
									? "فصل"
									: `Season${((item as Series).seasons?.length || 1) > 1 ? "s" : ""}`
							}`
						: `${language === "fa" ? "فیلم" : "Movie"} • ${
								(item as Movie).year || "2024"
							}`}
				</Typography>
			</Box>

			{/* Inject shimmer keyframes */}
			<style>{`
				@keyframes shimmer {
					0% { background-position: 200% 0; }
					100% { background-position: -200% 0; }
				}
			`}</style>
		</Box>
	);
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * iOS-Style Widget Grid Section
 * 
 * A fluid drag-and-drop widget grid similar to iOS Home Screen:
 * - Edit mode with visual indicators (shake animation, handles)
 * - Drag boxes to rearrange within compatible slots
 * - Other boxes automatically rearrange during drag
 * - Smooth animations for position changes
 * - Saves arrangement to user preferences (localStorage)
 * 
 * Uses @dnd-kit with custom modifiers for natural movement physics.
 * Supports both mouse and touch interactions.
 */
export const IOSWidgetGridSection = memo(function IOSWidgetGridSection({
	items,
	title,
	storageKey = STORAGE_KEY,
	offers,
}: IOSWidgetGridSectionProps) {
	const { language } = useLanguage();
	const isRTL = language === "fa";

	// Responsive grid configuration
	const responsiveCols = useResponsiveValue({
		mobile: MOBILE_COLS,
		tablet: TABLET_COLS,
		desktop: DESKTOP_COLS,
	});
	const responsiveRowHeight = useResponsiveValue({
		mobile: MOBILE_ROW_HEIGHT,
		tablet: TABLET_ROW_HEIGHT,
		desktop: DESKTOP_ROW_HEIGHT,
	});
	const responsiveWidgetConfigs = useResponsiveValue({
		mobile: MOBILE_WIDGET_CONFIGS,
		tablet: TABLET_WIDGET_CONFIGS,
		desktop: DESKTOP_WIDGET_CONFIGS,
	});

	// Widget grid hook for state management
	const {
		positions,
		widgetOrder,
		itemIndices,
		isEditMode,
		totalRows,
		toggleEditMode,
		shuffleLayout,
		resetLayout,
		swapWidgets,
	} = useWidgetGrid({
		storageKey,
		totalCols: responsiveCols,
		defaultWidgets: responsiveWidgetConfigs,
		itemCount: ITEM_COUNT,
	});

	const activeOffers = offers?.filter((o) => o.imageUrl || o.linkUrl) || [];

	// Convert offers to Movie-like items for widget grid display
	const offerAsItems = useMemo((): (Movie | Series)[] => {
		return activeOffers.map((offer) => ({
			id: offer.contentId || offer.id,
			title: (language === "fa" ? offer.titleFa : undefined) || offer.title,
			slug: offer.id,
			poster: offer.imageUrl || "",
			backdrop: offer.backdropUrl || offer.imageUrl || "",
			rating: 0,
			year: new Date().getFullYear(),
			genres: [],
			description: "",
			// Store linkUrl for widget click
			linkUrl: offer.linkUrl || (offer.contentId ? `/item/${offer.contentId}` : undefined),
		} as any));
	}, [activeOffers, language]);

	// Prepare display items: use provided items, or fall back to offer items
	const displayItems = useMemo(() => {
		const sourceItems = items && items.length > 0 ? items : offerAsItems;
		if (sourceItems.length === 0) return [];
		const result: (Movie | Series)[] = [];
		for (let i = 0; i < ITEM_COUNT; i++) {
			result.push(sourceItems[i % sourceItems.length]);
		}
		return result;
	}, [items, offerAsItems]);

	// Handle drag end
	const handleDragEnd = useCallback(
		(activeId: string, overId: string) => {
			swapWidgets(activeId, overId);
		},
		[swapWidgets]
	);

	// Get widget position by ID
	const getPositionById = useCallback(
		(widgetId: string) => {
			return positions.find((p) => p.id === widgetId);
		},
		[positions]
	);

	// Get widget config by ID
	const getConfigById = useCallback((widgetId: string) => {
		return responsiveWidgetConfigs.find((c: WidgetConfig) => c.id === widgetId);
	}, [responsiveWidgetConfigs]);

	// Section title
	const sectionTitle =
		title ||
		(language === "fa"
			? "پیشنهادات ویژه"
			: "Special Offers");

	const sectionSubtitle = language === "fa"
		? "برای ویرایش، دکمه ویرایش را بزنید"
		: "Tap edit to customize layout";

	if (displayItems.length === 0) {
		return null;
	}

	return (
		<WidgetGrid
			widgetIds={widgetOrder}
			isEditMode={isEditMode}
			onToggleEditMode={toggleEditMode}
			onShuffle={shuffleLayout}
			onReset={resetLayout}
			onDragEnd={handleDragEnd}
			totalCols={responsiveCols}
			totalRows={totalRows}
			rowHeight={responsiveRowHeight}
			gap={GAP}
			title={sectionTitle}
			subtitle={sectionSubtitle}
			isRTL={isRTL}
			showControls={true}
			maxWidth="1400px"
		>
			{widgetOrder.map((widgetId, index) => {
				const position = getPositionById(widgetId);
				const config = getConfigById(widgetId);

				if (!position || !config) return null;

				const item = displayItems[position.itemIndex];
				if (!item) return null;

				const chipType = getItemChip(position.itemIndex);

				return (
					<DraggableWidget
						key={widgetId}
						id={widgetId}
						isEditMode={isEditMode}
						size={{
							colSpan: config.colSpan,
							rowSpan: config.rowSpan,
							type: config.type,
						}}
						gridColumn={`${position.col + 1} / span ${position.colSpan}`}
						gridRow={`${position.row + 1} / span ${position.rowSpan}`}
						isRTL={isRTL}
					>
						<WidgetContent
							item={item}
							chipType={chipType}
							language={language}
							isRTL={isRTL}
							isDragging={isEditMode}
							widgetType={config.type}
							priority={index < 2}
						/>
					</DraggableWidget>
				);
			})}
		</WidgetGrid>
	);
});

export default IOSWidgetGridSection;
