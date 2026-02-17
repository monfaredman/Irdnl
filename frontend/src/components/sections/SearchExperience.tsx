"use client";

import {
	Search as SearchIcon,
	FilterList as FilterIcon,
	Movie as MovieIcon,
	Tv as TvIcon,
	Clear as ClearIcon,
	Sort as SortIcon,
	AccessTime as TimeIcon,
} from "@mui/icons-material";
import {
	Box,
	Chip,
	CircularProgress,
	Fade,
	IconButton,
	InputBase,
	MenuItem,
	Pagination,
	Select,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MediaCard } from "@/components/media/MediaCard";
import { searchApi, type SearchParams, type SearchResponse, type SearchResultItem } from "@/lib/api/search";
import { useLanguage } from "@/providers/language-provider";
import {
	glassColors,
	glassAnimations,
	glassBorderRadius,
	glassBlur,
} from "@/theme/glass-design-system";
import { routes } from "@/lib/routes";
import type { Movie, Series } from "@/types/media";

// ─── Types ───────────────────────────────────────────────────────────────

type SortOption = "relevance" | "rating" | "year" | "newest";
type TypeFilter = "all" | "movie" | "series";

// ─── Helpers ─────────────────────────────────────────────────────────────

function transformResultToMedia(item: SearchResultItem): Movie | Series {
	const slug =
		item.title
			?.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim() || item.id;

	return {
		id: item.id,
		slug,
		title: item.title,
		originalTitle: item.originalTitle || undefined,
		description: item.description || "",
		poster: item.posterUrl || "",
		backdrop: item.backdropUrl || "",
		year: item.year || 0,
		rating: item.rating || 0,
		genres: item.genres || [],
		tags: item.tags || [],
		accessType: (item.accessType as any) || "free",
		type: item.type,
		duration: item.duration || undefined,
		featured: item.featured,
	} as any;
}

// ─── Component ───────────────────────────────────────────────────────────

export function SearchExperience() {
	const { language } = useLanguage();
	const searchParams = useSearchParams();
	const router = useRouter();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	// State
	const [query, setQuery] = useState(searchParams.get("q") || "");
	const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
	const [sortBy, setSortBy] = useState<SortOption>("relevance");
	const [page, setPage] = useState(1);
	const [results, setResults] = useState<SearchResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Derived
	const isRtl = language === "fa";
	const t = useMemo(
		() => ({
			search: isRtl ? "جستجو" : "Search",
			searchPlaceholder: isRtl
				? "عنوان، بازیگر، کارگردان، ژانر..."
				: "Title, actor, director, genre...",
			results: isRtl ? "نتایج" : "Results",
			noResults: isRtl ? "نتیجه‌ای یافت نشد" : "No results found",
			noResultsDesc: isRtl
				? "جستجوی دیگری را امتحان کنید"
				: "Try a different search term",
			movies: isRtl ? "فیلم‌ها" : "Movies",
			series: isRtl ? "سریال‌ها" : "Series",
			all: isRtl ? "همه" : "All",
			sortRelevance: isRtl ? "مرتبط‌ترین" : "Most Relevant",
			sortRating: isRtl ? "امتیاز" : "Highest Rated",
			sortYear: isRtl ? "سال" : "Release Year",
			sortNewest: isRtl ? "جدیدترین" : "Newest",
			found: isRtl ? "نتیجه یافت شد" : "results found",
			inMs: isRtl ? "در" : "in",
			ms: isRtl ? "میلی‌ثانیه" : "ms",
		}),
		[isRtl],
	);

	// ─── Search execution ────────────────────────────────────────────────
	const executeSearch = useCallback(
		async (searchQuery: string, searchType: TypeFilter, searchSort: SortOption, searchPage: number) => {
			const trimmed = searchQuery.trim();
			if (!trimmed) {
				setResults(null);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const params: SearchParams = {
					q: trimmed,
					page: searchPage,
					limit: 24,
					sort: searchSort,
				};
				if (searchType !== "all") {
					params.type = searchType;
				}

				const response = await searchApi.search(params);
				setResults(response);
			} catch (err: any) {
				setError(err?.message || "Search failed");
				setResults(null);
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Auto-search from URL params on mount
	useEffect(() => {
		const q = searchParams.get("q") || "";
		const type = (searchParams.get("type") as TypeFilter) || "all";
		if (q) {
			setQuery(q);
			setTypeFilter(type);
			executeSearch(q, type, sortBy, 1);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Re-search when filters change
	const handleSearch = useCallback(
		(e?: React.FormEvent) => {
			e?.preventDefault();
			setPage(1);
			executeSearch(query, typeFilter, sortBy, 1);
			// Update URL without full reload
			const params = new URLSearchParams();
			params.set("q", query);
			if (typeFilter !== "all") params.set("type", typeFilter);
			router.replace(`${routes.search}?${params.toString()}`, { scroll: false });
		},
		[query, typeFilter, sortBy, executeSearch, router],
	);

	const handleFilterChange = useCallback(
		(type: TypeFilter) => {
			setTypeFilter(type);
			setPage(1);
			executeSearch(query, type, sortBy, 1);
		},
		[query, sortBy, executeSearch],
	);

	const handleSortChange = useCallback(
		(sort: SortOption) => {
			setSortBy(sort);
			setPage(1);
			executeSearch(query, typeFilter, sort, 1);
		},
		[query, typeFilter, executeSearch],
	);

	const handlePageChange = useCallback(
		(_: React.ChangeEvent<unknown>, newPage: number) => {
			setPage(newPage);
			executeSearch(query, typeFilter, sortBy, newPage);
			window.scrollTo({ top: 0, behavior: "smooth" });
		},
		[query, typeFilter, sortBy, executeSearch],
	);

	// ─── Glass Styles ────────────────────────────────────────────────────
	const glassInputStyle = {
		display: "flex",
		alignItems: "center",
		px: 2.5,
		py: 1,
		borderRadius: glassBorderRadius.pill,
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		border: `1px solid ${glassColors.glass.border}`,
		backdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
		WebkitBackdropFilter: `blur(${glassBlur.medium}px) saturate(180%)`,
		boxShadow: `0 8px 24px -4px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`,
		transition: glassAnimations.transition.spring,
		"&:focus-within": {
			border: `1px solid ${glassColors.persianGold}60`,
			boxShadow: `0 8px 32px -4px ${glassColors.gold.glow}, inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
		},
	};

	const chipStyle = (isActive: boolean) => ({
		height: 32,
		fontSize: "0.8rem",
		fontWeight: 600,
		borderRadius: glassBorderRadius.pill,
		cursor: "pointer",
		transition: glassAnimations.transition.springFast,
		background: isActive
			? `linear-gradient(135deg, ${glassColors.persianGold}30, ${glassColors.persianGold}15)`
			: glassColors.glass.mid,
		color: isActive ? glassColors.persianGold : glassColors.text.secondary,
		border: `1px solid ${isActive ? `${glassColors.persianGold}50` : glassColors.glass.border}`,
		"&:hover": {
			background: isActive
				? `linear-gradient(135deg, ${glassColors.persianGold}40, ${glassColors.persianGold}20)`
				: glassColors.glass.strong,
			border: `1px solid ${isActive ? glassColors.persianGold : "rgba(255,255,255,0.2)"}`,
			transform: "translateY(-1px)",
		},
	});

	const selectStyle = {
		height: 36,
		fontSize: "0.8rem",
		borderRadius: glassBorderRadius.md,
		background: glassColors.glass.mid,
		border: `1px solid ${glassColors.glass.border}`,
		color: glassColors.text.secondary,
		"& .MuiOutlinedInput-notchedOutline": { border: "none" },
		"& .MuiSelect-icon": { color: glassColors.text.muted },
		transition: glassAnimations.transition.springFast,
		"&:hover": {
			background: glassColors.glass.strong,
		},
	};

	// ─── Render ──────────────────────────────────────────────────────────
	const items = results?.items || [];
	const mediaItems = items.map(transformResultToMedia);
	const totalPages = results?.totalPages || 0;

	return (
		<Box sx={{ direction: isRtl ? "rtl" : "ltr" }}>
			{/* Search Bar */}
			<Box component="form" onSubmit={handleSearch} sx={glassInputStyle}>
				<SearchIcon
					sx={{ color: glassColors.text.muted, mr: isRtl ? 0 : 1.5, ml: isRtl ? 1.5 : 0 }}
				/>
				<InputBase
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={t.searchPlaceholder}
					fullWidth
					sx={{
						color: glassColors.text.primary,
						fontSize: { xs: "0.9rem", sm: "1rem" },
						direction: isRtl ? "rtl" : "ltr",
						"& ::placeholder": {
							color: glassColors.text.muted,
							opacity: 1,
						},
					}}
				/>
				{query && (
					<IconButton
						onClick={() => {
							setQuery("");
							setResults(null);
						}}
						size="small"
						sx={{ color: glassColors.text.muted }}
					>
						<ClearIcon fontSize="small" />
					</IconButton>
				)}
			</Box>

			{/* Filters Bar */}
			<Stack
				direction="row"
				spacing={1}
				sx={{
					mt: 2.5,
					flexWrap: "wrap",
					alignItems: "center",
					gap: 1,
				}}
			>
				{/* Type filters */}
				<Chip
					icon={<FilterIcon sx={{ fontSize: "0.9rem" }} />}
					label={t.all}
					onClick={() => handleFilterChange("all")}
					sx={chipStyle(typeFilter === "all")}
				/>
				<Chip
					icon={<MovieIcon sx={{ fontSize: "0.9rem" }} />}
					label={t.movies}
					onClick={() => handleFilterChange("movie")}
					sx={chipStyle(typeFilter === "movie")}
				/>
				<Chip
					icon={<TvIcon sx={{ fontSize: "0.9rem" }} />}
					label={t.series}
					onClick={() => handleFilterChange("series")}
					sx={chipStyle(typeFilter === "series")}
				/>

				{/* Spacer */}
				<Box sx={{ flex: 1 }} />

				{/* Sort */}
				<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
					<SortIcon sx={{ fontSize: "1rem", color: glassColors.text.muted }} />
					<Select
						value={sortBy}
						onChange={(e) => handleSortChange(e.target.value as SortOption)}
						size="small"
						sx={selectStyle}
					>
						<MenuItem value="relevance">{t.sortRelevance}</MenuItem>
						<MenuItem value="rating">{t.sortRating}</MenuItem>
						<MenuItem value="year">{t.sortYear}</MenuItem>
						<MenuItem value="newest">{t.sortNewest}</MenuItem>
					</Select>
				</Box>
			</Stack>

			{/* Results Meta */}
			{results && !isLoading && (
				<Fade in>
					<Box
						sx={{
							mt: 3,
							mb: 2,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							flexWrap: "wrap",
							gap: 1,
						}}
					>
						<Typography
							sx={{
								color: glassColors.text.secondary,
								fontSize: "0.85rem",
							}}
						>
							<Box
								component="span"
								sx={{ color: glassColors.persianGold, fontWeight: 700 }}
							>
								{results.total.toLocaleString(isRtl ? "fa-IR" : "en-US")}
							</Box>{" "}
							{t.found}
						</Typography>
						<Typography
							sx={{
								color: glassColors.text.muted,
								fontSize: "0.75rem",
								display: "flex",
								alignItems: "center",
								gap: 0.5,
							}}
						>
							<TimeIcon sx={{ fontSize: "0.85rem" }} />
							{t.inMs} {results.took}
							{t.ms}
						</Typography>
					</Box>
				</Fade>
			)}

			{/* Loading */}
			{isLoading && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						py: 8,
						gap: 2,
					}}
				>
					<CircularProgress
						size={28}
						sx={{ color: glassColors.persianGold }}
					/>
					<Typography sx={{ color: glassColors.text.secondary, fontSize: "0.9rem" }}>
						{isRtl ? "در حال جستجو..." : "Searching..."}
					</Typography>
				</Box>
			)}

			{/* Error */}
			{error && (
				<Box
					sx={{
						mt: 4,
						p: 3,
						borderRadius: glassBorderRadius.lg,
						background: "rgba(239, 68, 68, 0.1)",
						border: "1px solid rgba(239, 68, 68, 0.3)",
						textAlign: "center",
					}}
				>
					<Typography sx={{ color: "#F87171", fontSize: "0.9rem" }}>
						{error}
					</Typography>
				</Box>
			)}

			{/* No Results */}
			{!isLoading && !error && results && items.length === 0 && (
				<Fade in>
					<Box
						sx={{
							mt: 6,
							py: 8,
							textAlign: "center",
							borderRadius: glassBorderRadius.lg,
							background: glassColors.glass.base,
							border: `1px solid ${glassColors.glass.border}`,
						}}
					>
						<SearchIcon
							sx={{
								fontSize: "3rem",
								color: glassColors.text.muted,
								mb: 2,
							}}
						/>
						<Typography
							sx={{
								color: glassColors.text.secondary,
								fontSize: "1.1rem",
								fontWeight: 600,
								mb: 1,
							}}
						>
							{t.noResults}
						</Typography>
						<Typography
							sx={{
								color: glassColors.text.muted,
								fontSize: "0.85rem",
							}}
						>
							{t.noResultsDesc}
						</Typography>
					</Box>
				</Fade>
			)}

			{/* Results Grid */}
			{!isLoading && items.length > 0 && (
				<Fade in>
					<Box
						sx={{
							mt: 2,
							display: "grid",
							gridTemplateColumns: {
								xs: "repeat(2, 1fr)",
								sm: "repeat(3, 1fr)",
								md: "repeat(4, 1fr)",
								lg: "repeat(5, 1fr)",
							},
							gap: { xs: 1.5, sm: 2, md: 2.5 },
						}}
					>
						{mediaItems.map((item) => (
							<MediaCard
								key={item.id}
								item={item}
								type={(item as any).type === "series" ? "series" : "movie"}
							/>
						))}
					</Box>
				</Fade>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<Box
					sx={{
						mt: 5,
						mb: 3,
						display: "flex",
						justifyContent: "center",
					}}
				>
					<Pagination
						count={totalPages}
						page={page}
						onChange={handlePageChange}
						shape="rounded"
						size={isMobile ? "small" : "medium"}
						sx={{
							"& .MuiPaginationItem-root": {
								color: glassColors.text.secondary,
								borderRadius: glassBorderRadius.sm,
								border: `1px solid ${glassColors.glass.border}`,
								background: glassColors.glass.base,
								transition: glassAnimations.transition.springFast,
								"&:hover": {
									background: glassColors.glass.strong,
									border: `1px solid ${glassColors.glass.border}`,
									transform: "translateY(-2px)",
								},
								"&.Mui-selected": {
									background: `linear-gradient(135deg, ${glassColors.persianGold}30, ${glassColors.persianGold}15)`,
									color: glassColors.persianGold,
									border: `1px solid ${glassColors.persianGold}50`,
									fontWeight: 700,
								},
							},
						}}
					/>
				</Box>
			)}
		</Box>
	);
}
