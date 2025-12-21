"use client";

import {
	Box,
	Chip,
	CircularProgress,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { MediaCard } from "@/components/media/MediaCard";
import { useLanguage } from "@/providers/language-provider";
import { contentApi } from "@/lib/api/content";
import type { Movie, Series } from "@/types/media";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import { useEffect, useMemo, useState } from "react";

export default function AnimationPage() {
	const { language } = useLanguage();

	const [movies, setMovies] = useState<Movie[]>([]);
	const [series, setSeries] = useState<Series[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				setLoading(true);
				setError(null);
				const res = await contentApi.getAnimationContent({
					language: language === "fa" ? "fa" : "en",
					page: 1,
				});
				if (cancelled) return;
				setMovies(res.movies);
				setSeries(res.series);
			} catch (err) {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : "Failed to load animation");
				setMovies([]);
				setSeries([]);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [language]);

	const allAnimation = useMemo(
		() => [
			...movies.map((item) => ({ ...item, type: "movie" as const })),
			...series.map((item) => ({ ...item, type: "series" as const })),
		],
		[movies, series],
	);

	const glassStyle = {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: `blur(${glassBlur.medium})`,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.xl,
	};

	return (
		<Box sx={{ minHeight: "100vh", py: 8 }}>
			<Container maxWidth="xl">
				<Stack spacing={6}>
					{/* Premium Header */}
					<Box
						sx={{
							...glassStyle,
							p: { xs: 4, md: 6 },
							position: "relative",
							overflow: "hidden",
							"&::before": {
								content: '""',
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								height: "1px",
								background: `linear-gradient(90deg, transparent, ${glassColors.persianGold}, transparent)`,
							},
						}}
					>
						<Stack spacing={2}>
							<Typography
								variant="overline"
								sx={{
									fontSize: "0.75rem",
									fontWeight: 600,
									letterSpacing: "0.2em",
									color: glassColors.persianGold,
									textTransform: "uppercase",
								}}
							>
								{language === "fa" ? "دسته‌بندی" : "Category"}
							</Typography>
							<Typography
								variant="h2"
								sx={{
									fontSize: { xs: "2.5rem", md: "3.5rem" },
									fontWeight: 800,
									color: glassColors.text.primary,
									lineHeight: 1.1,
									background: `linear-gradient(135deg, ${glassColors.text.primary}, ${glassColors.persianGold})`,
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
								}}
							>
								{language === "fa" ? "انیمیشن" : "Animation"}
							</Typography>
							<Typography
								variant="body1"
								sx={{
									color: glassColors.text.secondary,
									maxWidth: 600,
									fontSize: "1.125rem",
									lineHeight: 1.6,
								}}
							>
								{language === "fa"
									? "بهترین انیمیشن‌های سینمایی و سریالی"
									: "Best animated movies and series"}
							</Typography>
						</Stack>

						{/* Content Type Pills */}
						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 1.5,
								mt: 4,
							}}
						>
							<Chip
								label={language === "fa" ? "فیلم" : "Movies"}
								sx={{
									background: glassColors.glass.base,
									backdropFilter: `blur(${glassBlur.light})`,
									border: `1px solid ${glassColors.glass.border}`,
									color: glassColors.text.primary,
									fontWeight: 500,
									transition: "all 0.3s ease",
									"&:hover": {
										background: glassColors.glass.mid,
										borderColor: glassColors.persianGold,
										transform: "translateY(-2px)",
										boxShadow: `0 8px 24px ${glassColors.persianGold}30`,
									},
								}}
							/>
							<Chip
								label={language === "fa" ? "سریال" : "Series"}
								sx={{
									background: glassColors.glass.base,
									backdropFilter: `blur(${glassBlur.light})`,
									border: `1px solid ${glassColors.glass.border}`,
									color: glassColors.text.primary,
									fontWeight: 500,
									transition: "all 0.3s ease",
									"&:hover": {
										background: glassColors.glass.mid,
										borderColor: glassColors.persianGold,
										transform: "translateY(-2px)",
										boxShadow: `0 8px 24px ${glassColors.persianGold}30`,
									},
								}}
							/>
						</Box>

						{/* Stats */}
						<Box
							sx={{
								display: "flex",
								gap: 4,
								mt: 4,
								pt: 4,
								borderTop: `1px solid ${glassColors.glass.border}`,
							}}
						>
							<Box>
								<Typography
									variant="h4"
									sx={{
										fontWeight: 700,
										color: glassColors.persianGold,
									}}
								>
									{allAnimation.length}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: glassColors.text.tertiary }}
								>
									{language === "fa" ? "عنوان" : "Titles"}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant="h4"
									sx={{
										fontWeight: 700,
										color: glassColors.persianGold,
									}}
								>
									{movies.length}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: glassColors.text.tertiary }}
								>
									{language === "fa" ? "فیلم" : "Movies"}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant="h4"
									sx={{
										fontWeight: 700,
										color: glassColors.persianGold,
									}}
								>
									{series.length}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: glassColors.text.tertiary }}
								>
									{language === "fa" ? "سریال" : "Series"}
								</Typography>
							</Box>
						</Box>
					</Box>

					{/* Content Grid */}
					{error && (
						<Box sx={{ ...glassStyle, p: 4, textAlign: "center" }}>
							<Typography sx={{ color: "rgba(255, 100, 100, 0.9)" }}>
								{error}
							</Typography>
						</Box>
					)}
					{loading && (
						<Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
							<CircularProgress sx={{ color: glassColors.persianGold }} size={28} />
						</Box>
					)}
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "repeat(2, 1fr)",
								md: "repeat(3, 1fr)",
								lg: "repeat(4, 1fr)",
								xl: "repeat(5, 1fr)",
							},
							gap: 3,
						}}
					>
						{!loading &&
							allAnimation.map((item) => (
								<MediaCard key={`${item.type}-${item.id}`} item={item} type={item.type} />
							))}
					</Box>

					{/* Empty State */}
					{!loading && allAnimation.length === 0 && (
						<Box
							sx={{
								...glassStyle,
								p: 8,
								textAlign: "center",
							}}
						>
							<Typography
								sx={{
									color: glassColors.text.tertiary,
									fontSize: "1.125rem",
								}}
							>
								{language === "fa"
									? "محتوایی پیدا نشد"
									: "No content found"}
							</Typography>
						</Box>
					)}
				</Stack>
			</Container>
		</Box>
	);
}
