"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
	Box,
	InputBase,
	Typography,
	Chip,
	CircularProgress,
	IconButton,
	Fade,
} from "@mui/material";
import {
	Search as SearchIcon,
	Close as CloseIcon,
	Movie as MovieIcon,
	Tv as TvIcon,
	Star as StarIcon,
	TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSuggest, useSearchShortcut } from "@/hooks/useSearch";
import {
	glassColors,
	glassAnimations,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";
import { routes } from "@/lib/routes";
import type { SuggestItem } from "@/lib/api/search";

interface SearchAutocompleteProps {
	language?: string;
	onClose?: () => void;
	isExpanded: boolean;
	onExpandToggle: () => void;
}

export default function SearchAutocomplete({
	language = "fa",
	onClose,
	isExpanded,
	onExpandToggle,
}: SearchAutocompleteProps) {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [showDropdown, setShowDropdown] = useState(false);

	const {
		suggestions,
		isLoading,
		query,
		setQuery,
		clearSuggestions,
	} = useSuggest({ debounce: 300, minLength: 1, limit: 8 });

	const items = suggestions?.items || [];

	// Focus input when expanded
	useEffect(() => {
		if (isExpanded && inputRef.current) {
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [isExpanded]);

	// Show/hide dropdown
	useEffect(() => {
		setShowDropdown(isExpanded && query.trim().length >= 1 && (items.length > 0 || isLoading));
	}, [isExpanded, query, items.length, isLoading]);

	// Reset active index on new results
	useEffect(() => {
		setActiveIndex(-1);
	}, [suggestions]);

	// Close on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setShowDropdown(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	// Navigate to content item
	const handleSelect = useCallback(
		(item: SuggestItem) => {
			const slug =
				item.title
					?.toLowerCase()
					.replace(/[^a-z0-9\s-]/g, "")
					.replace(/\s+/g, "-")
					.replace(/-+/g, "-")
					.trim() || item.id;

			setShowDropdown(false);
			clearSuggestions();
			onClose?.();
			router.push(`/item/${item.id}`);
		},
		[router, clearSuggestions, onClose],
	);

	// Submit search
	const handleSubmit = useCallback(
		(e?: React.FormEvent) => {
			e?.preventDefault();
			if (query.trim()) {
				setShowDropdown(false);
				clearSuggestions();
				onClose?.();
				router.push(`${routes.search}?q=${encodeURIComponent(query.trim())}`);
			}
		},
		[query, router, clearSuggestions, onClose],
	);

	// Keyboard navigation
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (!showDropdown || items.length === 0) {
				if (e.key === "Enter") handleSubmit();
				if (e.key === "Escape") {
					onExpandToggle();
				}
				return;
			}

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setActiveIndex((prev) =>
						prev < items.length ? prev + 1 : 0,
					);
					break;
				case "ArrowUp":
					e.preventDefault();
					setActiveIndex((prev) =>
						prev > 0 ? prev - 1 : items.length,
					);
					break;
				case "Enter":
					e.preventDefault();
					if (activeIndex >= 0 && activeIndex < items.length) {
						handleSelect(items[activeIndex]);
					} else {
						handleSubmit();
					}
					break;
				case "Escape":
					setShowDropdown(false);
					onExpandToggle();
					break;
			}
		},
		[showDropdown, items, activeIndex, handleSelect, handleSubmit, onExpandToggle],
	);

	// Cmd+K shortcut
	useSearchShortcut(
		useCallback(() => {
			if (!isExpanded) {
				onExpandToggle();
			} else {
				inputRef.current?.focus();
			}
		}, [isExpanded, onExpandToggle]),
	);

	// ─── Highlight match text ────────────────────────────────────────────
	const highlightMatch = (text: string, q: string) => {
		if (!q || !text) return text;
		const idx = text.toLowerCase().indexOf(q.toLowerCase());
		if (idx === -1) return text;
		return (
			<>
				{text.slice(0, idx)}
				<Box
					component="span"
					sx={{ color: glassColors.persianGold, fontWeight: 700 }}
				>
					{text.slice(idx, idx + q.length)}
				</Box>
				{text.slice(idx + q.length)}
			</>
		);
	};

	// ─── Styles ──────────────────────────────────────────────────────────
	const dropdownStyle = {
		position: "absolute" as const,
		top: "calc(100% + 8px)",
		right: 0,
		left: 0,
		minWidth: { xs: "280px", sm: "380px" },
		maxHeight: "480px",
		overflowY: "auto" as const,
		borderRadius: glassBorderRadius.lg,
		background: `linear-gradient(180deg, 
      rgba(15, 15, 15, 0.97) 0%, 
      rgba(10, 10, 10, 0.98) 100%)`,
		backdropFilter: `blur(${glassBlur.strong}px) saturate(200%)`,
		WebkitBackdropFilter: `blur(${glassBlur.strong}px) saturate(200%)`,
		border: `1px solid ${glassColors.glass.border}`,
		boxShadow: `0 24px 64px -12px rgba(0, 0, 0, 0.7),
      0 8px 24px -4px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`,
		zIndex: 9999,
		// Custom scrollbar
		"&::-webkit-scrollbar": {
			width: "4px",
		},
		"&::-webkit-scrollbar-track": {
			background: "transparent",
		},
		"&::-webkit-scrollbar-thumb": {
			background: glassColors.glass.border,
			borderRadius: "2px",
		},
	};

	const itemStyle = (isActive: boolean) => ({
		display: "flex",
		alignItems: "center",
		gap: 1.5,
		px: 2,
		py: 1.5,
		cursor: "pointer",
		borderRadius: glassBorderRadius.sm,
		mx: 1,
		transition: glassAnimations.transition.springFast,
		background: isActive
			? `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`
			: "transparent",
		border: isActive
			? `1px solid ${glassColors.glass.border}`
			: "1px solid transparent",
		"&:hover": {
			background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
			border: `1px solid ${glassColors.glass.border}`,
			transform: "translateX(4px)",
		},
	});

	return (
		<Box ref={containerRef} sx={{ position: "relative" }}>
			{/* Search Input Container */}
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{
					display: "flex",
					alignItems: "center",
					width: isExpanded ? { xs: "220px", sm: "340px" } : "40px",
					height: "40px",
					borderRadius: glassBorderRadius.pill,
					background: isExpanded
						? `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`
						: "transparent",
					border: isExpanded
						? `1px solid ${glassColors.glass.border}`
						: "1px solid transparent",
					backdropFilter: isExpanded
						? `blur(${glassBlur.medium}px) saturate(180%)`
						: "none",
					WebkitBackdropFilter: isExpanded
						? `blur(${glassBlur.medium}px) saturate(180%)`
						: "none",
					transition: glassAnimations.transition.spring,
					overflow: "hidden",
					boxShadow: isExpanded
						? `0 8px 24px -4px rgba(0, 0, 0, 0.3),
               inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`
						: "none",
				}}
			>
				{isExpanded && (
					<InputBase
						inputRef={inputRef}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={handleKeyDown}
						onFocus={() => {
							if (query.trim().length >= 1 && items.length > 0) {
								setShowDropdown(true);
							}
						}}
						placeholder={
							language === "fa"
								? "جستجو... (⌘K)"
								: "Search... (⌘K)"
						}
						sx={{
							flex: 1,
							px: 2,
							color: "#FFFFFF",
							fontSize: "0.875rem",
							direction: language === "fa" ? "rtl" : "ltr",
							"& ::placeholder": {
								color: "rgba(255, 255, 255, 0.5)",
								opacity: 1,
							},
						}}
					/>
				)}

				{isExpanded && isLoading && (
					<CircularProgress
						size={16}
						sx={{ color: glassColors.persianGold, mr: 1 }}
					/>
				)}

				<IconButton
					onClick={() => {
						if (isExpanded && query) {
							setQuery("");
							clearSuggestions();
							setShowDropdown(false);
						} else {
							onExpandToggle();
							if (isExpanded) {
								setQuery("");
								clearSuggestions();
								setShowDropdown(false);
							}
						}
					}}
					size="small"
					sx={{
						color: "#FFFFFF",
						transition:
							"all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
						"&:hover": {
							transform: "rotate(90deg)",
						},
						margin: "-0.5rem",
					}}
				>
					{isExpanded ? <CloseIcon /> : <SearchIcon />}
				</IconButton>
			</Box>

			{/* Autocomplete Dropdown */}
			<Fade in={showDropdown} timeout={200}>
				<Box sx={dropdownStyle}>
					{/* Results */}
					{items.length > 0 && (
						<Box sx={{ py: 1 }}>
							{/* Section header */}
							<Box
								sx={{
									px: 2,
									py: 1,
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}
							>
								<TrendingIcon
									sx={{
										fontSize: "0.875rem",
										color: glassColors.text.tertiary,
									}}
								/>
								<Typography
									variant="caption"
									sx={{
										color: glassColors.text.tertiary,
										textTransform: "uppercase",
										letterSpacing: "0.1em",
										fontSize: "0.7rem",
									}}
								>
									{language === "fa" ? "نتایج" : "Results"}
								</Typography>
							</Box>

							{items.map((item, index) => (
								<Box
									key={item.id}
									onClick={() => handleSelect(item)}
									sx={itemStyle(index === activeIndex)}
									role="option"
									aria-selected={index === activeIndex}
								>
									{/* Thumbnail */}
									<Box
										sx={{
											width: 44,
											height: 62,
											borderRadius: glassBorderRadius.sm,
											overflow: "hidden",
											flexShrink: 0,
											border: `1px solid ${glassColors.glass.border}`,
											background: glassColors.glass.base,
										}}
									>
										{item.posterUrl || item.thumbnailUrl ? (
											<Box
												component="img"
												src={
													item.posterUrl ||
													item.thumbnailUrl ||
													""
												}
												alt={item.title}
												sx={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
												}}
												onError={(e: any) => {
													e.target.style.display = "none";
												}}
											/>
										) : (
											<Box
												sx={{
													width: "100%",
													height: "100%",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													background: `linear-gradient(135deg, ${glassColors.glass.mid}, ${glassColors.glass.base})`,
												}}
											>
												{item.type === "series" ? (
													<TvIcon
														sx={{
															fontSize: "1.2rem",
															color: glassColors.text.muted,
														}}
													/>
												) : (
													<MovieIcon
														sx={{
															fontSize: "1.2rem",
															color: glassColors.text.muted,
														}}
													/>
												)}
											</Box>
										)}
									</Box>

									{/* Content */}
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography
											sx={{
												color: glassColors.text.primary,
												fontSize: "0.875rem",
												fontWeight: 600,
												lineHeight: 1.3,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{item.highlight ? (
												<span
													dangerouslySetInnerHTML={{
														__html: item.highlight,
													}}
												/>
											) : (
												highlightMatch(
													item.title,
													query,
												)
											)}
										</Typography>

										{item.originalTitle && (
											<Typography
												sx={{
													color: glassColors.text.tertiary,
													fontSize: "0.75rem",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												}}
											>
												{item.originalTitle}
											</Typography>
										)}

										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 0.5,
												mt: 0.5,
											}}
										>
											{/* Type badge */}
											<Chip
												label={
													item.type === "series"
														? language === "fa"
															? "سریال"
															: "Series"
														: language === "fa"
															? "فیلم"
															: "Movie"
												}
												size="small"
												sx={{
													height: 18,
													fontSize: "0.65rem",
													fontWeight: 600,
													background:
														item.type === "series"
															? "rgba(59, 130, 246, 0.2)"
															: "rgba(245, 158, 11, 0.2)",
													color:
														item.type === "series"
															? "#60A5FA"
															: glassColors.persianGold,
													border: `1px solid ${
														item.type === "series"
															? "rgba(59, 130, 246, 0.3)"
															: "rgba(245, 158, 11, 0.3)"
													}`,
													"& .MuiChip-label": {
														px: 0.8,
													},
												}}
											/>

											{/* Year */}
											{item.year && (
												<Typography
													sx={{
														color: glassColors.text.muted,
														fontSize: "0.7rem",
													}}
												>
													{item.year}
												</Typography>
											)}

											{/* Rating */}
											{item.rating && (
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 0.25,
													}}
												>
													<StarIcon
														sx={{
															fontSize: "0.7rem",
															color: glassColors.persianGold,
														}}
													/>
													<Typography
														sx={{
															color: glassColors.text.secondary,
															fontSize: "0.7rem",
															fontWeight: 600,
														}}
													>
														{Number(item.rating).toFixed(1)}
													</Typography>
												</Box>
											)}
										</Box>
									</Box>
								</Box>
							))}
						</Box>
					)}

					{/* No results */}
					{!isLoading && items.length === 0 && query.trim().length >= 2 && (
						<Box
							sx={{
								px: 3,
								py: 4,
								textAlign: "center",
							}}
						>
							<SearchIcon
								sx={{
									fontSize: "2rem",
									color: glassColors.text.muted,
									mb: 1,
								}}
							/>
							<Typography
								sx={{
									color: glassColors.text.tertiary,
									fontSize: "0.875rem",
								}}
							>
								{language === "fa"
									? "نتیجه‌ای یافت نشد"
									: "No results found"}
							</Typography>
						</Box>
					)}

					{/* "View all results" footer */}
					{query.trim().length >= 1 && (
						<Box
							onClick={() => handleSubmit()}
							sx={{
								px: 2,
								py: 1.5,
								borderTop: `1px solid ${glassColors.glass.border}`,
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 1,
								transition: glassAnimations.transition.springFast,
								background:
									activeIndex === items.length
										? glassColors.glass.mid
										: "transparent",
								"&:hover": {
									background: glassColors.glass.mid,
								},
							}}
							role="option"
							aria-selected={activeIndex === items.length}
						>
							<SearchIcon
								sx={{
									fontSize: "0.875rem",
									color: glassColors.persianGold,
								}}
							/>
							<Typography
								sx={{
									color: glassColors.text.secondary,
									fontSize: "0.8rem",
									fontWeight: 500,
								}}
							>
								{language === "fa"
									? `مشاهده همه نتایج برای "${query}"`
									: `View all results for "${query}"`}
							</Typography>
						</Box>
					)}
				</Box>
			</Fade>
		</Box>
	);
}
