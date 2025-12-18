"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
	DndContext,
	DragOverlay,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
	type DragOverEvent,
	type UniqueIdentifier,
	MeasuringStrategy,
} from "@dnd-kit/core";
import {
	SortableContext,
	rectSortingStrategy,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { Box, IconButton, Typography, Tooltip, Fade } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
	glassSpacing,
} from "@/theme/glass-design-system";
import {
	touchSensorOptions,
	mouseSensorOptions,
} from "@/lib/dnd-modifiers";

export interface WidgetGridProps {
	children: React.ReactNode;
	widgetIds: string[];
	isEditMode: boolean;
	onToggleEditMode: () => void;
	onShuffle?: () => void;
	onReset?: () => void;
	onDragEnd: (activeId: string, overId: string) => void;
	totalCols?: number;
	totalRows: number;
	rowHeight?: number;
	gap?: number;
	title?: string;
	subtitle?: string;
	isRTL?: boolean;
	showControls?: boolean;
	maxWidth?: string | number;
}

/**
 * WidgetGrid Component
 * 
 * A container for iOS-style draggable widgets with:
 * - CSS Grid layout with defined areas
 * - Edit mode toggle with visual indicators
 * - @dnd-kit DndContext for drag-and-drop
 * - Support for mouse and touch interactions
 * - Smooth animations for position changes
 */
export default function WidgetGrid({
	children,
	widgetIds,
	isEditMode,
	onToggleEditMode,
	onShuffle,
	onReset,
	onDragEnd,
	totalCols = 4,
	totalRows,
	rowHeight = 178,
	gap = 16,
	title,
	subtitle,
	isRTL = false,
	showControls = true,
	maxWidth = "1400px",
}: WidgetGridProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

	// Configure sensors for mouse, touch, and keyboard
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 200,
				tolerance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Handle drag start
	const handleDragStart = useCallback((event: DragStartEvent) => {
		setActiveId(event.active.id);
	}, []);

	// Handle drag over (for visual feedback)
	const handleDragOver = useCallback((event: DragOverEvent) => {
		// Visual feedback handled by DraggableWidget
	}, []);

	// Handle drag end
	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			setActiveId(null);

			if (over && active.id !== over.id) {
				onDragEnd(String(active.id), String(over.id));
			}
		},
		[onDragEnd]
	);

	// Handle drag cancel
	const handleDragCancel = useCallback(() => {
		setActiveId(null);
	}, []);

	// Calculate grid height
	const gridHeight = useMemo(() => {
		return totalRows * rowHeight + (totalRows - 1) * gap;
	}, [totalRows, rowHeight, gap]);

	return (
		<Box
			component="section"
			sx={{
				py: `${glassSpacing.xl}px`,
				px: { xs: 2, md: 4 },
				direction: isRTL ? "rtl" : "ltr",
			}}
		>
			{/* Header with Title and Controls */}
			{(title || showControls) && (
				<Box
					sx={{
						maxWidth,
						mx: "auto",
						mb: 3,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 2,
						flexWrap: "wrap",
					}}
				>
					{/* Title Section */}
					{title && (
						<Box>
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
								{title}
								{isEditMode && (
									<Typography
										component="span"
										sx={{
											fontSize: "0.75rem",
											color: glassColors.persianGold,
											background: `${glassColors.persianGold}20`,
											px: 1.5,
											py: 0.25,
											borderRadius: glassBorderRadius.pill,
											fontWeight: 500,
										}}
									>
										{isRTL ? "حالت ویرایش" : "Edit Mode"}
									</Typography>
								)}
							</Typography>
							{subtitle && (
								<Typography
									variant="body2"
									sx={{
										color: glassColors.text.secondary,
										mt: 0.5,
									}}
								>
									{subtitle}
								</Typography>
							)}
						</Box>
					)}

					{/* Control Buttons */}
					{showControls && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							{/* Shuffle Button */}
							{isEditMode && onShuffle && (
								<Fade in={isEditMode}>
									<Tooltip title={isRTL ? "تصادفی" : "Shuffle"}>
										<IconButton
											onClick={onShuffle}
											sx={{
												background: `${glassColors.glass.strong}`,
												backdropFilter: `blur(8px)`,
												color: glassColors.text.primary,
												"&:hover": {
													background: `${glassColors.glass.mid}`,
													color: glassColors.persianGold,
												},
												transition: glassAnimations.transition.spring,
											}}
										>
											<ShuffleIcon />
										</IconButton>
									</Tooltip>
								</Fade>
							)}

							{/* Reset Button */}
							{isEditMode && onReset && (
								<Fade in={isEditMode}>
									<Tooltip title={isRTL ? "بازنشانی" : "Reset"}>
										<IconButton
											onClick={onReset}
											sx={{
												background: `${glassColors.glass.strong}`,
												backdropFilter: `blur(8px)`,
												color: glassColors.text.primary,
												"&:hover": {
													background: `${glassColors.glass.mid}`,
													color: glassColors.persianGold,
												},
												transition: glassAnimations.transition.spring,
											}}
										>
											<RestartAltIcon />
										</IconButton>
									</Tooltip>
								</Fade>
							)}

							{/* Edit Mode Toggle */}
							<Tooltip title={isRTL ? (isEditMode ? "تایید" : "ویرایش") : (isEditMode ? "Done" : "Edit")}>
								<IconButton
									onClick={onToggleEditMode}
									sx={{
										background: isEditMode
											? glassColors.persianGold
											: `${glassColors.glass.strong}`,
										backdropFilter: `blur(8px)`,
										color: isEditMode ? glassColors.black : glassColors.text.primary,
										"&:hover": {
											background: isEditMode
												? glassColors.gold.solid
												: `${glassColors.glass.mid}`,
											transform: "scale(1.05)",
										},
										transition: glassAnimations.transition.spring,
										boxShadow: isEditMode
											? `0 4px 12px ${glassColors.persianGold}40`
											: "none",
									}}
								>
									{isEditMode ? <DoneIcon /> : <EditIcon />}
								</IconButton>
							</Tooltip>
						</Box>
					)}
				</Box>
			)}

			{/* DnD Context */}
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}
				modifiers={[restrictToParentElement]}
				measuring={{
					droppable: {
						strategy: MeasuringStrategy.Always,
					},
				}}
			>
				<SortableContext items={widgetIds} strategy={rectSortingStrategy}>
					{/* CSS Grid Container */}
					<Box
						ref={containerRef}
						sx={{
							maxWidth,
							mx: "auto",
							display: "grid",
							gridTemplateColumns: `repeat(${totalCols}, 1fr)`,
							gridAutoRows: `${rowHeight}px`,
							gap: `${gap}px`,
							minHeight: `${gridHeight}px`,
							position: "relative",

							// Edit mode visual feedback
							"&::before": isEditMode ? {
								content: '""',
								position: "absolute",
								inset: -8,
								border: `2px dashed ${glassColors.glass.border}`,
								borderRadius: glassBorderRadius.xl,
								pointerEvents: "none",
								animation: "pulse 2s ease-in-out infinite",
							} : {},

							// Grid lines overlay in edit mode
							"&::after": isEditMode ? {
								content: '""',
								position: "absolute",
								inset: 0,
								backgroundImage: `
									linear-gradient(${glassColors.glass.border} 1px, transparent 1px),
									linear-gradient(90deg, ${glassColors.glass.border} 1px, transparent 1px)
								`,
								backgroundSize: `calc(100% / ${totalCols}) ${rowHeight + gap}px`,
								pointerEvents: "none",
								opacity: 0.3,
								borderRadius: glassBorderRadius.lg,
							} : {},
						}}
					>
						{children}
					</Box>
				</SortableContext>

				{/* Drag Overlay for smooth drag preview */}
				<DragOverlay
					dropAnimation={{
						duration: 250,
						easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
					}}
				>
					{activeId ? (
						<Box
							sx={{
								width: "100%",
								height: "100%",
								background: `${glassColors.glass.strong}`,
								backdropFilter: `blur(${glassBlur.medium})`,
								borderRadius: glassBorderRadius.lg,
								border: `2px solid ${glassColors.persianGold}`,
								boxShadow: `0 24px 48px rgba(0, 0, 0, 0.5)`,
								opacity: 0.9,
							}}
						/>
					) : null}
				</DragOverlay>
			</DndContext>

			{/* Instructions when in edit mode */}
			{isEditMode && (
				<Fade in={isEditMode}>
					<Box
						sx={{
							maxWidth,
							mx: "auto",
							mt: 2,
							display: "flex",
							justifyContent: "center",
						}}
					>
						<Typography
							variant="body2"
							sx={{
								color: glassColors.text.tertiary,
								textAlign: "center",
								background: `${glassColors.glass.base}`,
								backdropFilter: `blur(8px)`,
								px: 3,
								py: 1,
								borderRadius: glassBorderRadius.pill,
								border: `1px solid ${glassColors.glass.border}`,
							}}
						>
							{isRTL
								? "🎯 برای جابجایی ویجت‌ها آنها را بکشید و رها کنید"
								: "🎯 Drag and drop widgets to rearrange them"}
						</Typography>
					</Box>
				</Fade>
			)}

			{/* Inject pulse animation */}
			<style>{`
				@keyframes pulse {
					0%, 100% { opacity: 0.5; }
					50% { opacity: 1; }
				}
			`}</style>
		</Box>
	);
}
