"use client";

import { Box, Chip, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { MediaCard } from "@/components/media/MediaCard";
import { useTMDBDiscoverMovies } from "@/hooks/useTMDB";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

export default function ForeignMoviesPage() {
	const { language } = useLanguage();
	
	// Fetch foreign movies from TMDB
	const { data: foreignMovies, loading, error } = useTMDBDiscoverMovies("foreign", undefined, {
		language,
	});

	// Extract unique genres
	const allGenres = Array.from(
		new Set(foreignMovies?.flatMap((m) => m.genres || []) || [])
	);

	const glassStyle = {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: `blur(${glassBlur.medium})`,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.xl,
	};

	if (loading) {
		return (
			<Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
				<CircularProgress sx={{ color: glassColors.persianGold }} />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ minHeight: "100vh", py: 8 }}>
				<Container maxWidth="xl">
					<Box sx={{ ...glassStyle, p: 8, textAlign: "center" }}>
						<Typography sx={{ color: glassColors.text.tertiary, fontSize: "1.125rem" }}>
							{language === "fa" ? "خطا در دریافت اطلاعات" : "Error loading data"}
						</Typography>
					</Box>
				</Container>
			</Box>
		);
	}

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
								{language === "fa" ? "فیلم" : "Movies"}
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
								{language === "fa" ? "فیلم خارجی" : "Foreign Movies"}
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
									? "فیلم‌های خارجی با کیفیت بالا و زیرنویس فارسی"
									: "High-quality foreign films with Persian subtitles"}
							</Typography>
						</Stack>

						{/* Genre Pills */}
						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 1.5,
								mt: 4,
							}}
						>
							{allGenres.slice(0, 6).map((genre) => (
								<Chip
									key={genre}
									label={genre}
									sx={{
										background: glassColors.glass.base,
										backdropFilter: `blur(${glassBlur.light})`,
										border: `1px solid ${glassColors.glass.border}`,
										color: glassColors.text.primary,
										fontWeight: 500,
										textTransform: "capitalize",
										transition: "all 0.3s ease",
										"&:hover": {
											background: glassColors.glass.mid,
											borderColor: glassColors.persianGold,
											transform: "translateY(-2px)",
											boxShadow: `0 8px 24px ${glassColors.persianGold}30`,
										},
									}}
								/>
							))}
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
									{foreignMovies?.length || 0}
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
									{allGenres?.length || 0}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: glassColors.text.tertiary }}
								>
									{language === "fa" ? "ژانر" : "Genres"}
								</Typography>
							</Box>
						</Box>
					</Box>

					{/* Movies Grid */}
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
						{foreignMovies && foreignMovies.length > 0 ? (
							foreignMovies.map((movie) => (
								<MediaCard key={movie.id} item={movie} type="movie" />
							))
						) : (
							<Box sx={{ ...glassStyle, p: 8, textAlign: "center", gridColumn: "1 / -1" }}>
								<Typography sx={{ color: glassColors.text.tertiary, fontSize: "1.125rem" }}>
									{language === "fa" ? "فیلمی پیدا نشد" : "No movies found"}
								</Typography>
							</Box>
						)}
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}
