"use client";

import { Alert, Box, CircularProgress } from "@mui/material";
import { BannerCarousel } from "@/components/sections/BannerCarousel";
import { EmblaCarousel } from "@/components/sections/EmblaCarousel";
import { FiltersSection } from "@/components/sections/FiltersSection";
import { GridOffersSection } from "@/components/sections/GridOffersSection";
import { LiquidGlassSlider } from "@/components/sections/LiquidGlassSlider";
import {
	useBackendCombinedContent,
	useBackendPopularMovies,
	useBackendPopularTVShows,
	useBackendTrendingMovies,
} from "@/hooks/useBackendContent";
import { useLanguage } from "@/providers/language-provider";

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

	// Fetch real data from backend API (which integrates with TMDB)
	const { data: combinedContent, loading: loadingCombined } =
		useBackendCombinedContent({ language });
	const { data: popularMovies, loading: loadingMovies } =
		useBackendPopularMovies({ language });
	const { data: trendingMovies, loading: loadingTrending } =
		useBackendTrendingMovies({ language });
	const { data: popularSeries, loading: loadingSeries } =
		useBackendPopularTVShows({ language });

	// Filter content by origin (Iranian vs Foreign)
	const foreignMovies =
		popularMovies?.filter((m) => m.origin === "foreign") || [];
	const foreignSeries =
		popularSeries?.filter((s) => s.origin === "foreign") || [];
	const iranianSeries =
		popularSeries?.filter((s) => s.origin === "iranian") || [];

	// Loading state
	if (loadingCombined || loadingMovies || loadingTrending || loadingSeries) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<CircularProgress sx={{ color: "#F59E0B" }} size={60} />
			</Box>
		);
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

			{/* Offers Section - 11 draggable cards with varying sizes */}
			{combinedContent && combinedContent.length > 0 && (
				<GridOffersSection items={combinedContent} />
			)}

			{/* Filters Section */}
			<FiltersSection />

			{/* New Movie Carousel - فیلم جدید */}
			{trendingMovies && trendingMovies.length > 0 && (
				<EmblaCarousel
					title={language === "fa" ? "فیلم جدید" : "New Movies"}
					items={trendingMovies}
					type="movie"
					viewAllHref="/movies?sort=new"
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
					viewAllHref="/series?origin=foreign"
				/>
			)}

			{/* New Iranian Series - سریال ایرانی جدید */}
			{iranianSeries.length > 0 && (
				<EmblaCarousel
					title={language === "fa" ? "سریال ایرانی جدید" : "New Iranian Series"}
					items={iranianSeries}
					type="series"
					viewAllHref="/series?origin=iranian"
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
					viewAllHref="/movies?dubbed=true"
				/>
			)}

			{/* Animation Carousel - انیمیشن */}
			{popularMovies && popularMovies.length > 0 && (
				<EmblaCarousel
					title={language === "fa" ? "انیمیشن" : "Animation"}
					items={popularMovies.slice(0, 8)}
					type="movie"
					viewAllHref="/genres?type=animation"
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
