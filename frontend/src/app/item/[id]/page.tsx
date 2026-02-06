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

	// Prepare visual data from database content
	const visualImages = useMemo(() => {
		if (!data) return [];
		// Use backdrop image if available
		const images: Array<{ url: string; caption: string; aspectRatio: number }> = [];
		if (data.backdrop) {
			images.push({ url: data.backdrop, caption: "Scene 1", aspectRatio: 1.78 });
		}
		if ((data as any).bannerUrl) {
			images.push({ url: (data as any).bannerUrl, caption: "Banner", aspectRatio: 1.78 });
		}
		return images;
	}, [data]);

	const castMembers = useMemo(() => {
		if (!data) return [];
		// Use cast from database content
		const cast = (data as any).cast;
		if (!Array.isArray(cast)) return [];
		return cast.slice(0, 15).map((member: any, idx: number) => ({
			id: member.id || idx,
			name: member.name || member,
			character: member.character || "",
			profileUrl: member.profileUrl || member.profile_path || "/images/placeholder.jpg",
		}));
	}, [data]);

	const relatedContent = useMemo(() => {
		// Fallback to mock similar content from local data
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
	}, [type, id]);

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
						backdropUrl={data.backdrop}
						title={data.title}
						englishTitle={(data as any).originalTitle || undefined}
						tagline={(data as any).tagline || undefined}
						year={data.year}
						rating={data.rating}
						duration={
							type === "movie"
								? (data as Movie).duration
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
							voteCount={(data as any).voteCount || 1000}
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
