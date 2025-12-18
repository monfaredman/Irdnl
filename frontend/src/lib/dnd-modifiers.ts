"use client";

import type { Modifier } from "@dnd-kit/core";

/**
 * iOS-Style Custom Modifiers for @dnd-kit
 * 
 * These modifiers provide natural movement physics similar to iOS Home Screen widgets:
 * - Smooth spring animations
 * - Inertia-based movement
 * - Snap-to-grid behavior
 * - Touch-friendly gestures
 */

/**
 * Spring Physics Modifier
 * Adds a spring-like feel to drag movements
 */
export const springPhysicsModifier: Modifier = ({
	transform,
	activatorEvent,
	active,
	over,
}) => {
	if (!transform) return transform;

	// Apply spring easing effect
	const springFactor = 0.85;
	const damping = 0.95;

	return {
		...transform,
		x: transform.x * springFactor,
		y: transform.y * springFactor,
		scaleX: 1.02 + (transform.x * 0.00001),
		scaleY: 1.02 + (transform.y * 0.00001),
	};
};

/**
 * Snap to Grid Modifier
 * Snaps the dragged element to a grid during drag
 */
export const createSnapToGridModifier = (
	gridCellWidth: number,
	gridCellHeight: number
): Modifier => {
	return ({ transform }) => {
		if (!transform) return transform;

		const snapX = Math.round(transform.x / gridCellWidth) * gridCellWidth;
		const snapY = Math.round(transform.y / gridCellHeight) * gridCellHeight;

		// Smooth snap with easing
		const ease = 0.15;
		const snappedX = transform.x + (snapX - transform.x) * ease;
		const snappedY = transform.y + (snapY - transform.y) * ease;

		return {
			...transform,
			x: snappedX,
			y: snappedY,
		};
	};
};

/**
 * Boundary Restriction Modifier
 * Restricts drag to within a container
 */
export const createBoundaryModifier = (
	containerRect: { width: number; height: number } | null
): Modifier => {
	return ({ transform, draggingNodeRect }) => {
		if (!transform || !containerRect || !draggingNodeRect) return transform;

		const maxX = containerRect.width - draggingNodeRect.width;
		const maxY = containerRect.height - draggingNodeRect.height;

		return {
			...transform,
			x: Math.min(Math.max(transform.x, -draggingNodeRect.left), maxX),
			y: Math.min(Math.max(transform.y, -draggingNodeRect.top), maxY),
		};
	};
};

/**
 * Resistance Modifier
 * Adds resistance at edges for a rubber-band effect
 */
export const createResistanceModifier = (
	threshold: number = 50,
	resistanceFactor: number = 0.2
): Modifier => {
	return ({ transform }) => {
		if (!transform) return transform;

		let x = transform.x;
		let y = transform.y;

		// Apply resistance at edges
		if (Math.abs(x) > threshold) {
			const excess = Math.abs(x) - threshold;
			x = Math.sign(x) * (threshold + excess * resistanceFactor);
		}

		if (Math.abs(y) > threshold) {
			const excess = Math.abs(y) - threshold;
			y = Math.sign(y) * (threshold + excess * resistanceFactor);
		}

		return {
			...transform,
			x,
			y,
		};
	};
};

/**
 * iOS Lift Modifier
 * Lifts and scales the element when dragging starts
 */
export const iOSLiftModifier: Modifier = ({ transform, active }) => {
	if (!transform) return transform;

	return {
		...transform,
		scaleX: 1.05,
		scaleY: 1.05,
	};
};

/**
 * Tilt on Drag Modifier
 * Adds a subtle tilt effect based on drag direction
 */
export const tiltOnDragModifier: Modifier = ({ transform }) => {
	if (!transform) return transform;

	// Calculate tilt based on velocity/direction
	const tiltX = Math.min(Math.max(transform.y * 0.05, -5), 5);
	const tiltY = Math.min(Math.max(-transform.x * 0.05, -5), 5);

	return {
		...transform,
		// Note: Actual rotation would need CSS transform
	};
};

/**
 * Combine multiple modifiers
 */
export const combineModifiers = (...modifiers: Modifier[]): Modifier => {
	return (args) => {
		return modifiers.reduce((transform, modifier) => {
			const result = modifier({ ...args, transform });
			return result || transform;
		}, args.transform);
	};
};

/**
 * iOS-style animation config for dnd-kit
 */
export const iOSAnimationConfig = {
	duration: 250,
	easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Spring easing
};

/**
 * Touch sensor options for mobile optimization
 */
export const touchSensorOptions = {
	activationConstraint: {
		delay: 150, // Long press delay
		tolerance: 5, // Movement tolerance during delay
	},
};

/**
 * Mouse sensor options
 */
export const mouseSensorOptions = {
	activationConstraint: {
		distance: 8, // Minimum drag distance before activation
	},
};

/**
 * Keyboard sensor options for accessibility
 */
export const keyboardSensorOptions = {
	coordinateGetter: (event: KeyboardEvent, args: { currentCoordinates: { x: number; y: number } }) => {
		const { currentCoordinates } = args;
		const step = 50;

		switch (event.code) {
			case "ArrowUp":
				return { x: currentCoordinates.x, y: currentCoordinates.y - step };
			case "ArrowDown":
				return { x: currentCoordinates.x, y: currentCoordinates.y + step };
			case "ArrowLeft":
				return { x: currentCoordinates.x - step, y: currentCoordinates.y };
			case "ArrowRight":
				return { x: currentCoordinates.x + step, y: currentCoordinates.y };
			default:
				return currentCoordinates;
		}
	},
};

export default {
	springPhysicsModifier,
	createSnapToGridModifier,
	createBoundaryModifier,
	createResistanceModifier,
	iOSLiftModifier,
	tiltOnDragModifier,
	combineModifiers,
	iOSAnimationConfig,
	touchSensorOptions,
	mouseSensorOptions,
	keyboardSensorOptions,
};
