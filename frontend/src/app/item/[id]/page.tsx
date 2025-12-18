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
import { useCallback, useEffect, useState } from "react";
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

// Mock data for development
import { movies, series } from "@/data/mockContent";

export default function ItemDetailPage() {
	const { id } = useParams<{ id: string }>();

	const [data, setData] = useState<Movie | Series | null>(null);
	const [type, setType] = useState<"movie" | "series" | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	// Get similar content
	const similarContent =
		type === "movie"
			? movies.filter((m) => m.id !== id).slice(0, 8)
			: series.filter((s) => s.id !== id).slice(0, 8);

	return (
		<Box
			sx={{
				py: { xs: 12, md: 14 },
				minHeight: "100vh",
				position: "relative",
				background: `
          radial-gradient(circle at 20% 15%, ${glassColors.gold.glow} 0%, transparent 55%),
          radial-gradient(circle at 85% 25%, rgba(255,255,255,0.08) 0%, transparent 55%),
          radial-gradient(circle at 50% 95%, ${glassColors.gold.glow} 0%, transparent 60%),
          ${glassColors.deepMidnight}
        `,
			}}
		>
			<Container maxWidth="lg">
				{/* Breadcrumb */}
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
					<IconButton
						component={Link}
						href="/"
						aria-label="Back to home"
						sx={{
							color: glassColors.text.secondary,
							border: `1px solid ${glassColors.glass.border}`,
							background: glassColors.glass.base,
							"&:hover": {
								background: glassColors.glass.mid,
								border: `1px solid ${glassColors.glass.strong}`,
							},
						}}
					>
						<ArrowBack />
					</IconButton>
					<Typography
						sx={{
							color: glassColors.text.tertiary,
							fontSize: "0.875rem",
						}}
						dir="rtl"
					>
						خانه / {type === "movie" ? "فیلم" : "سریال"}
					</Typography>
				</Box>

				{/* Error State */}
				{error && (
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
				)}

				{/* Loading State */}
				{loading && (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							minHeight: "60vh",
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
					<Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
						{/* A. Header Section */}
						<ItemHeader item={data} type={type} />

						{/* B. Season & Episodes (Series Only) */}
						{type === "series" && <SeasonsEpisodes series={data as Series} />}

						{/* C. Synopsis & About */}
						<SynopsisAbout item={data} type={type} />

						{/* D. Similar Content */}
						<SimilarContent items={similarContent} type={type} />

						{/* E. Comments */}
						<Comments itemId={id} />
					</Box>
				)}
			</Container>
		</Box>
	);
}
