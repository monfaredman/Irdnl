"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Box, IconButton, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CloseIcon from "@mui/icons-material/Close";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

/**
 * Widget Size Configuration
 */
export interface WidgetSize {
	colSpan: number;
	rowSpan: number;
	type: "large" | "medium" | "small" | "poster";
}

export interface DraggableWidgetProps {
	id: string;
	children: React.ReactNode;
	isEditMode: boolean;
	size: WidgetSize;
	gridColumn: string;
	gridRow: string;
	onRemove?: (id: string) => void;
	isRTL?: boolean;
	disabled?: boolean;
}

/**
 * CSS Keyframes for iOS-style shake animation
 */
const shakeKeyframes = `
@keyframes widgetShake {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(-1deg); }
  20% { transform: rotate(1deg); }
  30% { transform: rotate(-1deg); }
  40% { transform: rotate(1deg); }
  50% { transform: rotate(0deg); }
  60% { transform: rotate(1deg); }
  70% { transform: rotate(-1deg); }
  80% { transform: rotate(1deg); }
  90% { transform: rotate(-1deg); }
  100% { transform: rotate(0deg); }
}

@keyframes widgetPulse {
  0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
  100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
}

@keyframes dragHandleBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
`;

/**
 * DraggableWidget Component
 * 
 * An iOS-style draggable widget with:
 * - Edit mode visual indicators (shake animation, handles)
 * - Smooth drag transitions
 * - Visual feedback during drag
 * - Touch and mouse support
 */
const DraggableWidget = memo(function DraggableWidget({
	id,
	children,
	isEditMode,
	size,
	gridColumn,
	gridRow,
	onRemove,
	isRTL = false,
	disabled = false,
}: DraggableWidgetProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
		isOver,
		active,
	} = useSortable({
		id,
		disabled: !isEditMode || disabled,
		transition: {
			duration: 250,
			easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
		},
	});

	// Check if this widget is being dragged over by another
	const isDropTarget = isOver && active?.id !== id;

	// Transform styles for drag
	const style = useMemo(() => ({
		transform: CSS.Transform.toString(transform),
		transition: isDragging ? "none" : transition,
		gridColumn,
		gridRow,
		zIndex: isDragging ? 100 : isDropTarget ? 50 : 1,
		position: "relative" as const,
	}), [transform, transition, isDragging, gridColumn, gridRow, isDropTarget]);

	// Handle remove click
	const handleRemove = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		onRemove?.(id);
	}, [id, onRemove]);

	return (
		<>
			{/* Inject keyframes */}
			<style>{shakeKeyframes}</style>

			<Box
				ref={setNodeRef}
				style={style}
				{...(isEditMode ? { ...attributes, ...listeners } : {})}
				sx={{
					// Base styles
					position: "relative",
					borderRadius: glassBorderRadius.lg,
					overflow: "hidden",
					cursor: isEditMode ? (isDragging ? "grabbing" : "grab") : "pointer",
					touchAction: isEditMode ? "none" : "auto",
					userSelect: "none",
					WebkitUserSelect: "none",
					willChange: isDragging ? "transform" : "auto",

					// Glass morphism background
					background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
					backdropFilter: `blur(${glassBlur.medium})`,
					WebkitBackdropFilter: `blur(${glassBlur.medium})`,
					border: `1px solid ${glassColors.glass.border}`,
					boxShadow: isDragging
						? `0 24px 48px rgba(0, 0, 0, 0.5), 0 0 0 2px ${glassColors.persianGold}40`
						: isDropTarget
						? `0 0 20px ${glassColors.persianGold}50, 0 8px 32px rgba(0, 0, 0, 0.4)`
						: `0 8px 32px -4px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,

					// Transitions
					transition: isDragging
						? "box-shadow 0.2s ease"
						: `${glassAnimations.transition.spring}, box-shadow 0.2s ease`,

					// Edit mode animations
					animation: isEditMode && !isDragging
						? "widgetShake 0.5s ease-in-out infinite"
						: "none",

					// Drag state transforms
					transform: isDragging
						? "scale(1.05)"
						: isDropTarget
						? "scale(1.02)"
						: "scale(1)",
					opacity: isDragging ? 0.9 : 1,

					// Hover effects (only when not in edit mode)
					"&:hover": !isEditMode ? {
						transform: "translateY(-4px) scale(1.02)",
						boxShadow: `0 16px 48px -8px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)`,
						border: `1px solid ${glassColors.gold.light}`,
						"& .drag-handle": {
							opacity: 1,
						},
					} : {},

					// Active state
					"&:active": isEditMode ? {
						cursor: "grabbing",
						animation: "none",
					} : {},
				}}
			>
				{/* Edit Mode Overlay */}
				{isEditMode && (
					<Box
						sx={{
							position: "absolute",
							inset: 0,
							background: "rgba(0, 0, 0, 0.1)",
							pointerEvents: "none",
							zIndex: 5,
						}}
					/>
				)}

				{/* Drag Handle */}
				<Box
					className="drag-handle"
					sx={{
						position: "absolute",
						top: 8,
						[isRTL ? "right" : "left"]: 8,
						zIndex: 10,
						background: `${glassColors.glass.strong}`,
						backdropFilter: `blur(8px)`,
						borderRadius: glassBorderRadius.sm,
						p: 0.5,
						opacity: isEditMode ? 1 : 0.6,
						transition: glassAnimations.transition.smooth,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						animation: isEditMode ? "dragHandleBounce 1s ease-in-out infinite" : "none",
					}}
				>
					<DragIndicatorIcon
						sx={{
							fontSize: "1rem",
							color: isEditMode ? glassColors.persianGold : glassColors.text.secondary,
						}}
					/>
				</Box>

				{/* Remove Button (only in edit mode) */}
				{isEditMode && onRemove && (
					<IconButton
						onClick={handleRemove}
						onPointerDown={(e) => e.stopPropagation()}
						sx={{
							position: "absolute",
							top: -6,
							[isRTL ? "left" : "right"]: -6,
							zIndex: 20,
							width: 24,
							height: 24,
							background: "#ef4444",
							color: "white",
							"&:hover": {
								background: "#dc2626",
								transform: "scale(1.1)",
							},
							boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
							transition: glassAnimations.transition.spring,
						}}
					>
						<CloseIcon sx={{ fontSize: 14 }} />
					</IconButton>
				)}

				{/* Drop Zone Indicator */}
				{isDropTarget && (
					<Box
						sx={{
							position: "absolute",
							inset: 0,
							border: `2px dashed ${glassColors.persianGold}`,
							borderRadius: glassBorderRadius.lg,
							background: `${glassColors.persianGold}10`,
							animation: "widgetPulse 1s ease-in-out infinite",
							pointerEvents: "none",
							zIndex: 6,
						}}
					/>
				)}

				{/* Widget Content */}
				<Box
					sx={{
						width: "100%",
						height: "100%",
						position: "relative",
						pointerEvents: isEditMode ? "none" : "auto",
					}}
				>
					{children}
				</Box>
			</Box>
		</>
	);
});

export default DraggableWidget;
