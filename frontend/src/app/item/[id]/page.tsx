"use client";

import { ArrowBack } from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	IconButton,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import {
	glassBorderRadius,
	glassColors,
	glassSpacing,
} from "@/theme/glass-design-system";
import type { Movie, Series } from "@/types/media";
import { ItemHeader } from "@/components/media/ItemHeader";
import { SeasonsEpisodes } from "@/components/media/SeasonsEpisodes";
import { SynopsisAbout } from "@/components/media/SynopsisAbout";
import { SimilarContent } from "@/components/media/SimilarContent";
import { Comments } from "@/components/media/Comments";
import { CinematicHero } from "@/components/media/CinematicHero";
import { VisualDetailsStrip } from "@/components/media/VisualDetailsStrip";
import { CastGallery } from "@/components/media/CastGallery";
import { VisualRatingsDisplay } from "@/components/media/VisualRatingsDisplay";
import { VisualSynopsisCard } from "@/components/media/VisualSynopsisCard";
import { VisualContentGrid } from "@/components/media/VisualContentGrid";
import { useTMDBMovieDetails, useTMDBTVDetails } from "@/hooks/useTMDBDetails";
import { ShareDialog } from "@/components/modals/ShareDialog";

// Mock data for development
import { movies, series } from "@/data/mockContent";

export default function ItemDetailPage() {
	const { id } = useParams<{ id: string }>();

	const [data, setData] = useState<Movie | Series | null>(null);
	const [type, setType] = useState<"movie" | "series" | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [shareDialogOpen, setShareDialogOpen] = useState(false);

	// Extract TMDB ID from the data (assuming it's stored as numeric ID)
	const tmdbId = data ? Number(data.id) : null;

	// Fetch detailed TMDB data
	const movieDetails = useTMDBMovieDetails(type === "movie" ? tmdbId : null);
	const tvDetails = useTMDBTVDetails(type === "series" ? tmdbId : null);

	const tmdbDetails = type === "movie" ? movieDetails : tvDetails;

	const fetchItem = useCallback(async () => {
		// Guard against undefined id
		if (!id) {
			setError("Invalid item ID");
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			// Try to find in movies first
			const movie = movies.find((m) => m.id === id);
			if (movie) {
				setData(movie);
				setType("movie");
				setLoading(false);
				return;
			}

			// Try to find in series
			const seriesItem = series.find((s) => s.id === id);
			if (seriesItem) {
				setData(seriesItem);
				setType("series");
				setLoading(false);
				return;
			}

			// If not found in mock data, try API
			const res = await fetch(`/api/content/${encodeURIComponent(id)}`, {
				method: "GET",
				headers: { Accept: "application/json" },
				cache: "no-store",
			});

			if (!res.ok) {
				throw new Error(`Content not found: ${res.status}`);
			}

			const json = await res.json();

			// Detect type based on data structure
			if ("seasons" in json) {
				setData(json as Series);
				setType("series");
			} else {
				setData(json as Movie);
				setType("movie");
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load content");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchItem();
	}, [fetchItem]);

	// Prepare visual data from TMDB
	const visualImages = useMemo(() => {
		if (!tmdbDetails.images?.backdrops) return [];
		return tmdbDetails.images.backdrops.slice(0, 10).map((img, idx) => ({
			url: tmdbDetails.getImageUrl(img.file_path, "original"),
			caption: `Scene ${idx + 1}`,
			aspectRatio: img.aspect_ratio,
		}));
	}, [tmdbDetails.images]);

	const castMembers = useMemo(() => {
		if (!tmdbDetails.credits?.cast) return [];
		return tmdbDetails.credits.cast.slice(0, 15).map((member) => ({
			id: member.id,
			name: member.name,
			character: member.character,
			profileUrl:
				tmdbDetails.getImageUrl(member.profile_path, "w200") ||
				"/images/placeholder.jpg",
		}));
	}, [tmdbDetails.credits]);

	const relatedContent = useMemo(() => {
		if (!tmdbDetails.recommendations?.results) {
			// Fallback to mock similar content
			const items =
				type === "movie"
					? movies.filter((m) => m.id !== id).slice(0, 12)
					: series.filter((s) => s.id !== id).slice(0, 12);
			return items.map((item) => ({
				id: item.id,
				title: item.title,
				backdropUrl: item.backdrop,
				rating: item.rating,
				year: item.year,
			}));
		}
		return tmdbDetails.recommendations.results.slice(0, 12).map((item) => ({
			id: String(item.id),
			title: item.title || item.name || "Unknown",
			backdropUrl:
				tmdbDetails.getImageUrl(item.backdrop_path, "w500") ||
				"/images/placeholder.jpg",
			rating: item.vote_average,
			year: undefined,
		}));
	}, [tmdbDetails.recommendations, type, id]);

	// Get similar content
	const similarContent =
		type === "movie"
			? movies.filter((m) => m.id !== id).slice(0, 8)
			: series.filter((s) => s.id !== id).slice(0, 8);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				position: "relative",
				background: glassColors.deepMidnight,
			}}
		>
			{/* Breadcrumb - Floating on top */}
			<Box
				sx={{
					position: "absolute",
					top: { xs: 80, md: 100 },
					left: { xs: 16, md: 32 },
					zIndex: 10,
					display: "flex",
					alignItems: "center",
					gap: 1,
				}}
			>
				<IconButton
					component={Link}
					href="/"
					aria-label="Back to home"
					sx={{
						color: glassColors.text.primary,
						background: `${glassColors.glass.strong}`,
						backdropFilter: "blur(10px)",
						border: `1px solid ${glassColors.glass.border}`,
						"&:hover": {
							background: glassColors.glass.mid,
							border: `1px solid ${glassColors.gold.solid}`,
							transform: "scale(1.05)",
						},
					}}
				>
					<ArrowBack />
				</IconButton>
				<Typography
					sx={{
						color: glassColors.text.secondary,
						fontSize: "0.875rem",
						background: glassColors.glass.strong,
						backdropFilter: "blur(10px)",
						px: 2,
						py: 0.75,
						borderRadius: glassBorderRadius.pill,
						border: `1px solid ${glassColors.glass.border}`,
					}}
					dir="rtl"
				>
					خانه / {type === "movie" ? "فیلم" : "سریال"}
				</Typography>
			</Box>

			{/* Error State */}
			{error && (
				<Container maxWidth="lg" sx={{ pt: 20 }}>
					<Alert
						severity="error"
						sx={{
							mb: 3,
							borderRadius: glassBorderRadius.lg,
							background: "rgba(239,68,68,0.12)",
							border: "1px solid rgba(239,68,68,0.25)",
							color: glassColors.text.primary,
						}}
						action={
							<Button
								onClick={fetchItem}
								color="inherit"
								size="small"
								sx={{ textTransform: "none" }}
							>
								تلاش مجدد
							</Button>
						}
					>
						{error}
					</Alert>
				</Container>
			)}

			{/* Loading State */}
			{loading && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "100vh",
					}}
				>
					<CircularProgress
						size={60}
						sx={{
							color: glassColors.persianGold,
						}}
					/>
				</Box>
			)}

			{/* Content */}
			{!loading && data && type && (
				<>
					{/* A. Cinematic Hero Section */}
					<CinematicHero
						backdropUrl={
							tmdbDetails.details
								? tmdbDetails.getImageUrl(
										type === "movie"
											? (tmdbDetails.details as any).backdrop_path
											: (tmdbDetails.details as any).backdrop_path,
										"original",
									)
								: data.backdrop
						}
						title={data.title}
						englishTitle={
							tmdbDetails.details
								? type === "movie"
									? (tmdbDetails.details as any).original_title
									: (tmdbDetails.details as any).original_name
								: undefined
						}
						tagline={
							tmdbDetails.details
								? (tmdbDetails.details as any).tagline
								: undefined
						}
						year={data.year}
						rating={data.rating}
						duration={
							type === "movie"
								? tmdbDetails.details
									? (tmdbDetails.details as any).runtime
									: (data as Movie).duration
								: tmdbDetails.details
									? `${(tmdbDetails.details as any).number_of_seasons} Seasons`
									: "Series"
						}
						genres={data.genres || []}
						externalPlayerUrl={data.externalPlayerUrl}
						onPlay={() => {
							if (data.externalPlayerUrl) {
								window.open(data.externalPlayerUrl, "_blank", "noopener,noreferrer");
							}
						}}
						onAddToList={() => console.log("Add to list clicked")}
						onShare={() => setShareDialogOpen(true)}
					/>

					<Container maxWidth="lg" sx={{ pb: 8 }}>
						{/* B. Visual Details Strip */}
						{visualImages.length > 0 && (
							<VisualDetailsStrip images={visualImages} />
						)}

						{/* C. Visual Synopsis Card */}
						<VisualSynopsisCard
							synopsis={data.description}
							backgroundImage={visualImages[1]?.url || data.backdrop}
						/>

						{/* D. Visual Ratings Display */}
						<VisualRatingsDisplay
							userScore={data.rating}
							voteCount={
								tmdbDetails.details
									? (tmdbDetails.details as any).vote_count || 1000
									: 1000
							}
							criticsScore={Math.round((data.rating / 10) * 100)}
						/>

						{/* E. Cast & Crew Gallery */}
						{castMembers.length > 0 && <CastGallery cast={castMembers} />}

						{/* F. Season & Episodes (Series Only) */}
						{type === "series" && <SeasonsEpisodes series={data as Series} />}

						{/* G. Visual Content Grid - Similar Content */}
						{relatedContent.length > 0 && (
							<VisualContentGrid
								items={relatedContent}
								title={type === "movie" ? "فیلم‌های مرتبط" : "سریال‌های مرتبط"}
							/>
						)}

						{/* H. Comments with Visual Context */}
						<Comments itemId={id} />
					</Container>

					{/* Share Dialog */}
					<ShareDialog
						open={shareDialogOpen}
						onClose={() => setShareDialogOpen(false)}
						title={data.title}
					/>
				</>
			)}
		</Box>
	);
}
