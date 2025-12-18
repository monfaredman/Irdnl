"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import { useWidgetGrid, type WidgetConfig } from "@/hooks/useWidgetGrid";
import { WidgetGrid, DraggableWidget } from "@/components/interactive";
import { pickWidgetImage } from "@/lib/tmdb-images";
import type { Movie, Series } from "@/types/media";

// ============================================================================
// TYPES
// ============================================================================

interface IOSWidgetGridSectionProps {
	items: (Movie | Series)[];
	title?: string;
	storageKey?: string;
}

type ChipType = "dubbed" | "free" | "subtitle";

// ============================================================================
// CONSTANTS
// ============================================================================

const ITEM_COUNT = 7;
const TOTAL_COLS = 4;
const ROW_HEIGHT = 180;
const GAP = 16;

// Widget configurations matching the original grid layout
const WIDGET_CONFIGS: WidgetConfig[] = [
	{ id: "widget-0", colSpan: 2, rowSpan: 2, type: "large" },    // Large horizontal (688 × 374)
	{ id: "widget-1", colSpan: 1, rowSpan: 1, type: "small" },    // Small (335 × 178)
	{ id: "widget-2", colSpan: 1, rowSpan: 2, type: "poster" },   // Poster type (335 × 374)
	{ id: "widget-3", colSpan: 1, rowSpan: 1, type: "small" },    // Small (335 × 178)
	{ id: "widget-4", colSpan: 2, rowSpan: 1, type: "medium" },   // Medium horizontal (688 × 178)
	{ id: "widget-5", colSpan: 1, rowSpan: 1, type: "small" },    // Small (335 × 178)
	{ id: "widget-6", colSpan: 1, rowSpan: 1, type: "small" },    // Small (335 × 178)
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
	};
	return labels[type];
};

const getChipColor = (type: ChipType): string => {
	const colors = {
		dubbed: glassColors.persianGold,
		free: "#10b981",
		subtitle: "#3b82f6",
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
	const href = `/item/${item.id}`;
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
					{item.slug.replace(/-/g, " ")}
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
}: IOSWidgetGridSectionProps) {
	const { language } = useLanguage();
	const isRTL = language === "fa";

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
		totalCols: TOTAL_COLS,
		defaultWidgets: WIDGET_CONFIGS,
		itemCount: ITEM_COUNT,
	});

	// Prepare display items (cycle through available items)
	const displayItems = useMemo(() => {
		if (!items || items.length === 0) return [];
		const result: (Movie | Series)[] = [];
		for (let i = 0; i < ITEM_COUNT; i++) {
			result.push(items[i % items.length]);
		}
		return result;
	}, [items]);

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
		return WIDGET_CONFIGS.find((c) => c.id === widgetId);
	}, []);

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
			totalCols={TOTAL_COLS}
			totalRows={totalRows}
			rowHeight={ROW_HEIGHT}
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
							// Prioritize the first 2 widgets (largest above-the-fold-ish)
							priority={index < 2}
						/>
					</DraggableWidget>
				);
			})}
		</WidgetGrid>
	);
});

export default IOSWidgetGridSection;
