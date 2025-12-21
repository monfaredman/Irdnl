"use client";

import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { BannerCarousel } from "@/components/sections/BannerCarousel";
import { EmblaCarousel } from "@/components/sections/EmblaCarousel";
import { FiltersSection } from "@/components/sections/FiltersSection";
import { IOSWidgetGridSection } from "@/components/sections/IOSWidgetGridSection";
import { LiquidGlassSlider } from "@/components/sections/LiquidGlassSlider";
import { MainPageSkeleton } from "@/components/layout/SkeletonLoader";
import {
	useBackendFilteredContent,
	useBackendCombinedContent,
	useBackendPopularMovies,
	useBackendPopularTVShows,
	useBackendTrendingMovies,
} from "@/hooks/useBackendContent";
import { useLanguage } from "@/providers/language-provider";
import { contentApi } from "@/lib/api/content";
import type { Movie } from "@/types/media";

type UiFilterState = {
	type: string;
	genre: string;
	country: string;
	yearRange: [number, number];
	ageRating: string;
};

/**
 * Apple-Inspired Liquid Glass Homepage
 *
 * Design Principles:
 * - Frosted Liquid Glass aesthetic
 * - Extreme minimalism with depth
 * - 70% whitespace minimum
 * - Content-first experience
 * - Premium, sophisticated feel
 *
 * Data Source: Backend API (integrated with TMDB)
 */
export default function Home() {
	const { language } = useLanguage();
	const [filters, setFilters] = useState<UiFilterState>({
		type: "all",
		genre: "all",
		country: "all",
		yearRange: [2000, 2024],
		ageRating: "all",
	});
	const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

	const backendFilters = useMemo(() => {
		// Map UI filters to TMDB discover params
		return {
			type:
				filters.type === "movie" || filters.type === "series"
					? (filters.type as "movie" | "series")
					: undefined,
			genre: filters.genre !== "all" ? filters.genre : undefined,
			// Use the end of year range as the target year
			year: filters.yearRange[1] !== 2024 ? filters.yearRange[1] : undefined,
			// Map age rating to TMDB certification
			certification: filters.ageRating !== "all" ? filters.ageRating : undefined,
			// Country - TMDB uses ISO 3166-1 codes
			country: filters.country !== "all" ? filters.country : undefined,
			page: 1,
			limit: 20,
		};
	}, [
		filters.genre,
		filters.type,
		filters.yearRange,
		filters.ageRating,
		filters.country,
	]);

	// Fetch real data from backend API (which integrates with TMDB)
	const { data: combinedContent, loading: loadingCombined } =
		useBackendCombinedContent({ language });
	const { data: popularMovies, loading: loadingMovies } =
		useBackendPopularMovies({ language });
	const { data: trendingMovies, loading: loadingTrending } =
		useBackendTrendingMovies({ language });
	const { data: popularSeries, loading: loadingSeries } =
		useBackendPopularTVShows({ language });
	const {
		data: filteredContent,
		loading: loadingFiltered,
		error: errorFiltered,
	} = useBackendFilteredContent(backendFilters, { enabled: true });

	const [animationItems, setAnimationItems] = useState<Movie[]>([]);
	const [loadingAnimation, setLoadingAnimation] = useState(false);

	// Animation content (genre 16) from TMDB via backend discover
	// Lightweight client-side fetch (no need for a dedicated hook yet).
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				setLoadingAnimation(true);
				const res = await contentApi.getAnimationContent({
					language: language === "fa" ? "fa" : "en",
					page: 1,
				});
				if (cancelled) return;
				// For the home carousel we show movies (can be extended to mixed types later)
				setAnimationItems(res.movies.slice(0, 8));
			} finally {
				if (!cancelled) setLoadingAnimation(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [language]);

	// Filter content by origin (Iranian vs Foreign)
	const foreignMovies =
		popularMovies?.filter((m) => m.origin === "foreign") || [];
	const foreignSeries =
		popularSeries?.filter((s) => s.origin === "foreign") || [];
	const iranianSeries =
		popularSeries?.filter((s) => s.origin === "iranian") || [];

	// Loading state - Show beautiful skeleton instead of spinner
	if (loadingCombined || loadingMovies || loadingTrending || loadingSeries) {
		return <MainPageSkeleton />;
	}

	return (
		<Box
			sx={{
				minHeight: "100vh",
			}}
		>
			{/* Premium Hero Slider - Featured/Popular Content */}
			{combinedContent && combinedContent.length > 0 && (
				<LiquidGlassSlider
					items={combinedContent.slice(0, 5)}
					type="movie"
					autoplayDelay={5000}
				/>
			)}

			{/* iOS-Style Widget Grid - Drag & Drop */}
			{combinedContent && combinedContent.length > 0 && (
				<IOSWidgetGridSection items={combinedContent} />
			)}

			{/* Filters Section */}
			<FiltersSection
				onFilterChange={(next) => {
					setFilters(next);
					setHasAppliedFilters(true);
				}}
			/>

			{/* Filtered Results (from backend /content) */}
			{hasAppliedFilters && errorFiltered && (
				<Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
					<Alert severity="error" sx={{ maxWidth: 900, mx: "auto" }}>
						{language === "fa"
							? "خطا در دریافت نتایج فیلتر شده"
							: "Failed to fetch filtered results"}
					</Alert>
				</Box>
			)}

			{hasAppliedFilters && loadingFiltered && (
				<Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
					<CircularProgress sx={{ color: "#F59E0B" }} size={28} />
				</Box>
			)}

			{hasAppliedFilters &&
				!loadingFiltered &&
				filteredContent &&
				filteredContent.length > 0 && (
				<EmblaCarousel
					title={language === "fa" ? "نتایج فیلتر" : "Filtered Results"}
					items={filteredContent}
					type="movie"
					viewAllHref="/search"
				/>
			)}

			{/* New Movie Carousel - فیلم جدید */}
			{trendingMovies && trendingMovies.length > 0 && (
				<EmblaCarousel
					title={language === "fa" ? "فیلم جدید" : "New Movies"}
					items={trendingMovies}
					type="movie"
					viewAllHref="/movies/foreign"
				/>
			)}

			{/* Banner 1 - Featured Content */}
			{popularMovies && popularMovies.length > 0 && (
				<BannerCarousel
					items={popularMovies.slice(5, 10)}
					height={324}
					autoplayDelay={6000}
				/>
			)}

			{/* Foreign Series Carousel - سریال خارجی */}
			{foreignSeries.length > 0 && (
				<EmblaCarousel
					title={language === "fa" ? "سریال خارجی" : "Foreign Series"}
					items={foreignSeries}
					type="series"
					viewAllHref="/series/foreign"
				/>
			)}

			{/* New Iranian Series - سریال ایرانی جدید */}
			{iranianSeries.length > 0 && (
				<EmblaCarousel
					title={language === "fa" ? "سریال ایرانی جدید" : "New Iranian Series"}
					items={iranianSeries}
					type="series"
					viewAllHref="/series/iranian"
				/>
			)}

			{/* Banner 2 - Series Highlights */}
			{popularSeries && popularSeries.length > 0 && (
				<BannerCarousel
					items={popularSeries.slice(3, 8)}
					height={324}
					autoplayDelay={7000}
				/>
			)}

			{/* Persian Dubbed - دوبله فارسی جدید */}
			{foreignMovies.length > 0 && (
				<EmblaCarousel
					title={language === "fa" ? "دوبله فارسی جدید" : "New Persian Dubbed"}
					items={foreignMovies.slice(0, 8)}
					type="movie"
					viewAllHref="/dubbed"
				/>
			)}

			{/* Animation Carousel - انیمیشن */}
			{!loadingAnimation && animationItems.length > 0 && (
				<EmblaCarousel
					title={language === "fa" ? "انیمیشن" : "Animation"}
					items={animationItems}
					type="movie"
					viewAllHref="/animation"
				/>
			)}

			{/* Fallback if no content */}
			{!combinedContent?.length &&
				!popularMovies?.length &&
				!popularSeries?.length && (
					<Box sx={{ p: 8, textAlign: "center" }}>
						<Alert severity="info" sx={{ maxWidth: 600, mx: "auto" }}>
							{language === "fa"
								? "در حال بارگذاری محتوا..."
								: "Loading content..."}
						</Alert>
					</Box>
				)}
		</Box>
	);
}
