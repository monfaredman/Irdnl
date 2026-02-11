"use client";

import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Box, Chip, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
	glassSpacing,
} from "@/theme/glass-design-system";
import type { Movie, Series } from "@/types/media";

interface GridOffersSectionProps {
	items: (Movie | Series)[];
}

type ChipType = "dubbed" | "free" | "subtitle";

// Fixed layout configuration for 7 items
// Grid dimensions based on requirements:
// - 688 × 374 pixels: 1 item (large horizontal) - colSpan: 2, rowSpan: 2
// - 335 × 178 pixels: 4 items (small) - colSpan: 1, rowSpan: 1
// - 688 × 178 pixels: 1 item (medium horizontal) - colSpan: 2, rowSpan: 1
// - 335 × 374 pixels: 1 item (poster type) - colSpan: 1, rowSpan: 2

interface GridItemConfig {
	id: number;
	colSpan: number;
	rowSpan: number;
	gridColumn: string;
	gridRow: string;
	width: number;
	height: number;
	type: "large" | "small" | "medium" | "poster";
}

interface GridCell {
	id: number;
	colSpan: number;
	rowSpan: number;
	itemIndex: number;
}

const ITEM_COUNT = 7;

// Define a key for storing layout in localStorage
const STORAGE_KEY = "grid_offers_layout";

// Fixed grid layout configuration
// Layout pattern:
// Row 1-2: [Large 688x374] [Small 335x178] [Poster 335x374]
// Row 2:   [continued]     [Small 335x178] [continued]
// Row 3:   [Medium 688x178]               [Small 335x178] [Small 335x178]
const TOTAL_COLS = 4; // Define the total number of columns in the grid

const GRID_CONFIG: GridItemConfig[] = [
	// Large horizontal (688 × 374) - Position: top-left
	{ id: 0, colSpan: 2, rowSpan: 2, gridColumn: "1 / span 2", gridRow: "1 / span 2", width: 688, height: 374, type: "large" },
	// Small (335 × 178) - Position: top-middle
	{ id: 1, colSpan: 1, rowSpan: 1, gridColumn: "3 / span 1", gridRow: "1 / span 1", width: 335, height: 178, type: "small" },
	// Poster type (335 × 374) - Position: top-right
	{ id: 2, colSpan: 1, rowSpan: 2, gridColumn: "4 / span 1", gridRow: "1 / span 2", width: 335, height: 374, type: "poster" },
	// Small (335 × 178) - Position: middle-middle
	{ id: 3, colSpan: 1, rowSpan: 1, gridColumn: "3 / span 1", gridRow: "2 / span 1", width: 335, height: 178, type: "small" },
	// Medium horizontal (688 × 178) - Position: bottom-left
	{ id: 4, colSpan: 2, rowSpan: 1, gridColumn: "1 / span 2", gridRow: "3 / span 1", width: 688, height: 178, type: "medium" },
	// Small (335 × 178) - Position: bottom-middle
	{ id: 5, colSpan: 1, rowSpan: 1, gridColumn: "3 / span 1", gridRow: "3 / span 1", width: 335, height: 178, type: "small" },
	// Small (335 × 178) - Position: bottom-right
	{ id: 6, colSpan: 1, rowSpan: 1, gridColumn: "4 / span 1", gridRow: "3 / span 1", width: 335, height: 178, type: "small" },
];

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

/**
 * Grid Offers Section with Drag & Drop
 * - Users can drag cards and swap positions
 * - When cards swap, their sizes also swap
 * - Layout persisted to localStorage
 * - Full RTL support
 */
export const GridOffersSection = ({ items }: GridOffersSectionProps) => {
	const { language } = useLanguage();
	const isRTL = language === "fa";
	const [dragItemId, setDragItemId] = useState<number | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOverId, setDragOverId] = useState<number | null>(null);

	// Refs for values that don't need to trigger re-renders
	const dragOverItemRef = useRef<number | null>(null);

	// Initialize layout from storage or default
	const [layout, setLayout] = useState<GridCell[]>(() => {
		if (typeof window !== "undefined") {
			try {
				const stored = localStorage.getItem(STORAGE_KEY);
				if (stored) {
					const parsed = JSON.parse(stored);
					if (Array.isArray(parsed) && parsed.length === ITEM_COUNT) {
						return parsed;
					}
				}
			} catch {
				// Ignore parse errors
			}
		}
		return GRID_CONFIG.map((config, index) => ({
			id: config.id,
			colSpan: config.colSpan,
			rowSpan: config.rowSpan,
			itemIndex: index,
		}));
	});

	// Persist layout changes
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
		}
	}, [layout]);

	// Ensure we have exactly 11 items
	const displayItems = useMemo(() => {
		if (!items || items.length === 0) return [];
		const result: (Movie | Series)[] = [];
		for (let i = 0; i < ITEM_COUNT; i++) {
			result.push(items[i % items.length]);
		}
		return result;
	}, [items]);

	// Drag handlers
	const handleDragStart = useCallback(
		(e: React.DragEvent<HTMLDivElement>, cellId: number) => {
			setDragItemId(cellId);
			setIsDragging(true);

			// Set drag image
			const target = e.currentTarget;
			if (target) {
				e.dataTransfer.effectAllowed = "move";
				e.dataTransfer.setData("text/plain", String(cellId));

				// Create ghost image
				const ghost = target.cloneNode(true) as HTMLElement;
				ghost.style.opacity = "0.8";
				ghost.style.position = "absolute";
				ghost.style.top = "-1000px";
				document.body.appendChild(ghost);
				e.dataTransfer.setDragImage(ghost, 50, 50);
				setTimeout(() => document.body.removeChild(ghost), 0);
			}
		},
		[],
	);

	const handleDragEnd = useCallback(() => {
		setDragItemId(null);
		dragOverItemRef.current = null;
		setIsDragging(false);
		setDragOverId(null);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}, []);

	const handleDragEnter = useCallback(
		(e: React.DragEvent<HTMLDivElement>, cellId: number) => {
			e.preventDefault();
			if (dragItemId !== null && dragItemId !== cellId) {
				dragOverItemRef.current = cellId;
				setDragOverId(cellId);
			}
		},
		[dragItemId],
	);

	const handleDragLeave = useCallback(
		(e: React.DragEvent<HTMLDivElement>, cellId: number) => {
			e.preventDefault();
			if (dragOverId === cellId) {
				setDragOverId(null);
			}
		},
		[dragOverId],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>, targetCellId: number) => {
			e.preventDefault();

			const sourceCellId = dragItemId;
			if (sourceCellId === null || sourceCellId === targetCellId) {
				handleDragEnd();
				return;
			}

			// Swap the items and their sizes
			setLayout((prevLayout) => {
				const newLayout = [...prevLayout];
				const sourceIndex = newLayout.findIndex(
					(cell) => cell.id === sourceCellId,
				);
				const targetIndex = newLayout.findIndex(
					(cell) => cell.id === targetCellId,
				);

				if (sourceIndex === -1 || targetIndex === -1) return prevLayout;

				// Swap itemIndex (which item is displayed)
				const tempItemIndex = newLayout[sourceIndex].itemIndex;
				newLayout[sourceIndex] = {
					...newLayout[sourceIndex],
					itemIndex: newLayout[targetIndex].itemIndex,
				};
				newLayout[targetIndex] = {
					...newLayout[targetIndex],
					itemIndex: tempItemIndex,
				};

				return newLayout;
			});

			handleDragEnd();
		},
		[handleDragEnd, dragItemId],
	);

	// Touch handlers for mobile
	const touchStartRef = useRef<{ id: number; x: number; y: number } | null>(
		null,
	);

	const handleTouchStart = useCallback(
		(e: React.TouchEvent<HTMLDivElement>, cellId: number) => {
			const touch = e.touches[0];
			touchStartRef.current = {
				id: cellId,
				x: touch.clientX,
				y: touch.clientY,
			};
			setDragItemId(cellId);
		},
		[],
	);

	const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
		if (!touchStartRef.current) return;

		const touch = e.touches[0];
		const element = document.elementFromPoint(touch.clientX, touch.clientY);
		const gridItem = element?.closest("[data-grid-id]") as HTMLElement | null;

		if (gridItem) {
			const targetId = parseInt(gridItem.dataset.gridId || "-1", 10);
			if (targetId !== -1 && targetId !== touchStartRef.current.id) {
				setDragOverId(targetId);
				dragOverItemRef.current = targetId;
			}
		}
	}, []);

	const handleTouchEnd = useCallback(() => {
		if (
			touchStartRef.current &&
			dragOverItemRef.current !== null &&
			touchStartRef.current.id !== dragOverItemRef.current
		) {
			const sourceCellId = touchStartRef.current.id;
			const targetCellId = dragOverItemRef.current;

			setLayout((prevLayout) => {
				const newLayout = [...prevLayout];
				const sourceIndex = newLayout.findIndex(
					(cell) => cell.id === sourceCellId,
				);
				const targetIndex = newLayout.findIndex(
					(cell) => cell.id === targetCellId,
				);

				if (sourceIndex === -1 || targetIndex === -1) return prevLayout;

				const tempItemIndex = newLayout[sourceIndex].itemIndex;
				newLayout[sourceIndex] = {
					...newLayout[sourceIndex],
					itemIndex: newLayout[targetIndex].itemIndex,
				};
				newLayout[targetIndex] = {
					...newLayout[targetIndex],
					itemIndex: tempItemIndex,
				};

				return newLayout;
			});
		}

		touchStartRef.current = null;
		setDragItemId(null);
		dragOverItemRef.current = null;
		setDragOverId(null);
		setIsDragging(false);
	}, []);

	const getItemChip = (index: number): ChipType => {
		const types: ChipType[] = ["dubbed", "free", "subtitle"];
		return types[index % 3];
	};

	// Calculate grid positions
	const calculateGridPositions = useMemo(() => {
		const positions: {
			id: number;
			col: number;
			row: number;
			colSpan: number;
			rowSpan: number;
		}[] = [];
		const grid: boolean[][] = [];

		// Initialize empty grid (max 10 rows)
		for (let r = 0; r < 10; r++) {
			grid[r] = Array(TOTAL_COLS).fill(false);
		}

		// Place each cell
		layout.forEach((cell) => {
			let placed = false;

			for (let row = 0; row < 10 && !placed; row++) {
				for (let col = 0; col <= TOTAL_COLS - cell.colSpan && !placed; col++) {
					// Check if space is available
					let canPlace = true;
					for (let r = row; r < row + cell.rowSpan && canPlace; r++) {
						for (let c = col; c < col + cell.colSpan && canPlace; c++) {
							if (grid[r]?.[c]) {
								canPlace = false;
							}
						}
					}

					if (canPlace) {
						// Mark grid cells as occupied
						for (let r = row; r < row + cell.rowSpan; r++) {
							for (let c = col; c < col + cell.colSpan; c++) {
								if (grid[r]) grid[r][c] = true;
							}
						}

						positions.push({
							id: cell.id,
							col: isRTL ? TOTAL_COLS - col - cell.colSpan : col,
							row,
							colSpan: cell.colSpan,
							rowSpan: cell.rowSpan,
						});
						placed = true;
					}
				}
			}
		});

		return positions;
	}, [layout, isRTL]);

	const rowHeight = 180;
	const gap = 16;
	const maxRow = Math.max(
		...calculateGridPositions.map((p) => p.row + p.rowSpan),
	);

	if (displayItems.length === 0) {
		return null;
	}

	return (
		<Box
			component="section"
			sx={{
				py: `${glassSpacing.xl}px`,
				px: { xs: 2, md: 4 },
				direction: isRTL ? "rtl" : "ltr",
			}}
		>
			{/* Section Title */}
			<Box
				sx={{
					maxWidth: "1400px",
					mx: "auto",
					mb: 3,
				}}
			>
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						color: glassColors.text.primary,
						textAlign: isRTL ? "right" : "left",
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					<DragIndicatorIcon
						sx={{ color: glassColors.text.tertiary, fontSize: "1.2rem" }}
					/>
					{language === "fa"
						? "پیشنهادات ویژه (بکشید و رها کنید)"
						: "Special Offers (Drag & Drop)"}
				</Typography>
			</Box>

			{/* CSS Grid Container */}
			<Box
				sx={{
					maxWidth: "1400px",
					mx: "auto",
					display: "grid",
					gridTemplateColumns: `repeat(${TOTAL_COLS}, 1fr)`,
					gridAutoRows: `${rowHeight}px`,
					gap: `${gap}px`,
					minHeight: `${maxRow * (rowHeight + gap)}px`,
				}}
			>
				{layout.map((cell) => {
					const position = calculateGridPositions.find((p) => p.id === cell.id);
					if (!position) return null;

					const item = displayItems[cell.itemIndex];
					if (!item) return null;

					const chipType = getItemChip(cell.itemIndex);
					const chipColor = getChipColor(chipType);
					const href = `/item/${item.id}`;
					const isSeries = "type" in item;
					const isBeingDragged = isDragging && dragItemId === cell.id;
					const isDragTarget = dragOverId === cell.id;

					return (
						<Box
							key={cell.id}
							data-grid-id={cell.id}
							draggable
							onDragStart={(e) => handleDragStart(e, cell.id)}
							onDragEnd={handleDragEnd}
							onDragOver={handleDragOver}
							onDragEnter={(e) => handleDragEnter(e, cell.id)}
							onDragLeave={(e) => handleDragLeave(e, cell.id)}
							onDrop={(e) => handleDrop(e, cell.id)}
							onTouchStart={(e) => handleTouchStart(e, cell.id)}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
							sx={{
								gridColumn: `${position.col + 1} / span ${position.colSpan}`,
								gridRow: `${position.row + 1} / span ${position.rowSpan}`,
								position: "relative",
								borderRadius: glassBorderRadius.lg,
								overflow: "hidden",
								background: glassColors.glass.base,
								backdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
								WebkitBackdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
								border: isDragTarget
									? `2px dashed ${glassColors.persianGold}`
									: `1px solid ${glassColors.glass.border}`,
								boxShadow: isDragTarget
									? `0 0 20px ${glassColors.persianGold}50, 0 8px 32px rgba(0, 0, 0, 0.4)`
									: `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
								transition: isBeingDragged
									? "none"
									: glassAnimations.transition.spring,
								cursor: "grab",
								opacity: isBeingDragged ? 0.5 : 1,
								transform: isDragTarget ? "scale(1.02)" : "scale(1)",
								zIndex: isBeingDragged ? 100 : isDragTarget ? 50 : 1,
								"&:active": {
									cursor: "grabbing",
								},
								"&:hover": {
									boxShadow: isDragTarget
										? `0 0 20px ${glassColors.persianGold}50, 0 8px 32px rgba(0, 0, 0, 0.4)`
										: `0 16px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px ${glassColors.gold.glow}`,
									"& .hover-overlay": {
										opacity: 1,
									},
									"& .drag-handle": {
										opacity: 1,
									},
								},
							}}
						>
							{/* Drag Handle Indicator */}
							<Box
								className="drag-handle"
								sx={{
									position: "absolute",
									top: 8,
									[isRTL ? "right" : "left"]: 8,
									zIndex: 10,
									background: `${glassColors.glass.strong}`,
									backdropFilter: `blur(${glassBlur.light}px)`,
									borderRadius: glassBorderRadius.sm,
									p: 0.5,
									opacity: 0.6,
									transition: glassAnimations.transition.smooth,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<DragIndicatorIcon
									sx={{
										fontSize: "1rem",
										color: glassColors.text.secondary,
									}}
								/>
							</Box>

							{/* Image */}
							<Box
								sx={{
									position: "relative",
									width: "100%",
									height: "100%",
									overflow: "hidden",
									pointerEvents: "none",
								}}
							>
								<Image
									src={item.poster}
									alt={item.title}
									fill
									style={{ objectFit: "cover" }}
									sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw"
									loading="lazy"
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
											backdropFilter: `blur(${glassBlur.light}px)`,
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
										backdropFilter: `blur(${glassBlur.light}px) saturate(120%)`,
										opacity: 0,
										transition: glassAnimations.transition.smooth,
										display: "flex",
										flexDirection: "column",
										justifyContent: "flex-end",
										p: 2,
										pointerEvents: "auto",
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
							</Box>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};
