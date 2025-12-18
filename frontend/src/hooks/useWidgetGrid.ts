"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Widget Grid Configuration
 */
export interface WidgetConfig {
	id: string;
	colSpan: number;
	rowSpan: number;
	type: "large" | "medium" | "small" | "poster";
	minColSpan?: number;
	minRowSpan?: number;
}

export interface WidgetPosition {
	id: string;
	col: number;
	row: number;
	colSpan: number;
	rowSpan: number;
	itemIndex: number;
}

export interface GridState {
	positions: WidgetPosition[];
	isEditMode: boolean;
	totalCols: number;
	totalRows: number;
}

interface UseWidgetGridOptions {
	storageKey: string;
	totalCols?: number;
	defaultWidgets: WidgetConfig[];
	itemCount: number;
}

/**
 * Fisher-Yates Shuffle Algorithm
 * Produces an unbiased random permutation of array elements
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

/**
 * Calculate grid positions for widgets using bin packing algorithm
 */
function calculateGridPositions(
	widgets: WidgetConfig[],
	totalCols: number,
	itemIndices: number[]
): WidgetPosition[] {
	const positions: WidgetPosition[] = [];
	const grid: boolean[][] = [];

	// Initialize empty grid (allocate enough rows)
	const maxRows = 20;
	for (let r = 0; r < maxRows; r++) {
		grid[r] = Array(totalCols).fill(false);
	}

	// Place each widget
	widgets.forEach((widget, idx) => {
		let placed = false;

		for (let row = 0; row < maxRows && !placed; row++) {
			for (let col = 0; col <= totalCols - widget.colSpan && !placed; col++) {
				// Check if space is available
				let canPlace = true;
				for (let r = row; r < row + widget.rowSpan && canPlace; r++) {
					for (let c = col; c < col + widget.colSpan && canPlace; c++) {
						if (grid[r]?.[c]) {
							canPlace = false;
						}
					}
				}

				if (canPlace) {
					// Mark cells as occupied
					for (let r = row; r < row + widget.rowSpan; r++) {
						for (let c = col; c < col + widget.colSpan; c++) {
							grid[r][c] = true;
						}
					}

					positions.push({
						id: widget.id,
						col,
						row,
						colSpan: widget.colSpan,
						rowSpan: widget.rowSpan,
						itemIndex: itemIndices[idx],
					});

					placed = true;
				}
			}
		}
	});

	return positions;
}

/**
 * Custom hook for iOS-style widget grid management
 * Features:
 * - Fisher-Yates shuffle for random placement
 * - LocalStorage persistence
 * - Edit mode toggle
 * - Grid state management
 */
export function useWidgetGrid({
	storageKey,
	totalCols = 4,
	defaultWidgets,
	itemCount,
}: UseWidgetGridOptions) {
	// Edit mode state
	const [isEditMode, setIsEditMode] = useState(false);

	// Item indices for each widget (which content item is displayed)
	const [itemIndices, setItemIndices] = useState<number[]>(() => {
		if (typeof window !== "undefined") {
			try {
				const stored = localStorage.getItem(`${storageKey}_indices`);
				if (stored) {
					const parsed = JSON.parse(stored);
					if (Array.isArray(parsed) && parsed.length === itemCount) {
						return parsed;
					}
				}
			} catch {
				// Ignore parse errors
			}
		}
		// Default: sequential indices
		return Array.from({ length: itemCount }, (_, i) => i);
	});

	// Widget order (which widget config is in which position)
	const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
		if (typeof window !== "undefined") {
			try {
				const stored = localStorage.getItem(`${storageKey}_order`);
				if (stored) {
					const parsed = JSON.parse(stored);
					if (Array.isArray(parsed) && parsed.length === defaultWidgets.length) {
						return parsed;
					}
				}
			} catch {
				// Ignore parse errors
			}
		}
		return defaultWidgets.map((w) => w.id);
	});

	// Persist changes to localStorage
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem(`${storageKey}_indices`, JSON.stringify(itemIndices));
			localStorage.setItem(`${storageKey}_order`, JSON.stringify(widgetOrder));
		}
	}, [itemIndices, widgetOrder, storageKey]);

	// Calculate current grid positions
	const positions = useMemo(() => {
		const orderedWidgets = widgetOrder
			.map((id) => defaultWidgets.find((w) => w.id === id))
			.filter((w): w is WidgetConfig => w !== undefined);

		return calculateGridPositions(orderedWidgets, totalCols, itemIndices);
	}, [widgetOrder, defaultWidgets, totalCols, itemIndices]);

	// Calculate total rows needed
	const totalRows = useMemo(() => {
		return Math.max(...positions.map((p) => p.row + p.rowSpan), 1);
	}, [positions]);

	// Toggle edit mode
	const toggleEditMode = useCallback(() => {
		setIsEditMode((prev) => !prev);
	}, []);

	// Enable edit mode
	const enableEditMode = useCallback(() => {
		setIsEditMode(true);
	}, []);

	// Disable edit mode
	const disableEditMode = useCallback(() => {
		setIsEditMode(false);
	}, []);

	// Shuffle layout using Fisher-Yates
	const shuffleLayout = useCallback(() => {
		setWidgetOrder((prev) => fisherYatesShuffle(prev));
		setItemIndices((prev) => fisherYatesShuffle(prev));
	}, []);

	// Reset to default layout
	const resetLayout = useCallback(() => {
		setWidgetOrder(defaultWidgets.map((w) => w.id));
		setItemIndices(Array.from({ length: itemCount }, (_, i) => i));
	}, [defaultWidgets, itemCount]);

	// Swap two widgets
	const swapWidgets = useCallback((sourceId: string, targetId: string) => {
		setWidgetOrder((prev) => {
			const newOrder = [...prev];
			const sourceIdx = newOrder.indexOf(sourceId);
			const targetIdx = newOrder.indexOf(targetId);

			if (sourceIdx !== -1 && targetIdx !== -1) {
				[newOrder[sourceIdx], newOrder[targetIdx]] = [
					newOrder[targetIdx],
					newOrder[sourceIdx],
				];
			}

			return newOrder;
		});

		// Also swap item indices
		setItemIndices((prev) => {
			const newIndices = [...prev];
			const sourceIdx = widgetOrder.indexOf(sourceId);
			const targetIdx = widgetOrder.indexOf(targetId);

			if (sourceIdx !== -1 && targetIdx !== -1) {
				[newIndices[sourceIdx], newIndices[targetIdx]] = [
					newIndices[targetIdx],
					newIndices[sourceIdx],
				];
			}

			return newIndices;
		});
	}, [widgetOrder]);

	// Move widget to a new position (reorder)
	const moveWidget = useCallback((activeId: string, overId: string) => {
		setWidgetOrder((prev) => {
			const activeIdx = prev.indexOf(activeId);
			const overIdx = prev.indexOf(overId);

			if (activeIdx === -1 || overIdx === -1) return prev;

			const newOrder = [...prev];
			newOrder.splice(activeIdx, 1);
			newOrder.splice(overIdx, 0, activeId);

			return newOrder;
		});
	}, []);

	// Get position for a specific widget
	const getWidgetPosition = useCallback(
		(widgetId: string): WidgetPosition | undefined => {
			return positions.find((p) => p.id === widgetId);
		},
		[positions]
	);

	// Get widget config by ID
	const getWidgetConfig = useCallback(
		(widgetId: string): WidgetConfig | undefined => {
			return defaultWidgets.find((w) => w.id === widgetId);
		},
		[defaultWidgets]
	);

	return {
		// State
		positions,
		widgetOrder,
		itemIndices,
		isEditMode,
		totalCols,
		totalRows,

		// Actions
		toggleEditMode,
		enableEditMode,
		disableEditMode,
		shuffleLayout,
		resetLayout,
		swapWidgets,
		moveWidget,

		// Getters
		getWidgetPosition,
		getWidgetConfig,
	};
}

export default useWidgetGrid;
