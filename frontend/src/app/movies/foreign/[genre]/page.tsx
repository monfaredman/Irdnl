"use client";

import { Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MediaCard } from "@/components/media/MediaCard";
import { useTMDBDiscoverMovies } from "@/hooks/useTMDB";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

const genreMap: Record<string, { en: string; fa: string }> = {
	action: { en: "Action", fa: "اکشن" },
	comedy: { en: "Comedy", fa: "کمدی" },
	drama: { en: "Drama", fa: "درام" },
	thriller: { en: "Thriller", fa: "هیجان‌انگیز" },
	horror: { en: "Horror", fa: "ترسناک" },
	"sci-fi": { en: "Sci-Fi", fa: "علمی‌تخیلی" },
	romance: { en: "Romance", fa: "عاشقانه" },
	mystery: { en: "Mystery", fa: "معمایی" },
	fantasy: { en: "Fantasy", fa: "فانتزی" },
	animation: { en: "Animation", fa: "انیمیشن" },
	documentary: { en: "Documentary", fa: "مستند" },
	adventure: { en: "Adventure", fa: "ماجراجویی" },
	family: { en: "Family", fa: "خانوادگی" },
	historical: { en: "Historical", fa: "تاریخی" },
};

export default function ForeignMovieGenrePage() {
	const params = useParams();
	const router = useRouter();
	const { language } = useLanguage();
	const genre = params.genre as string;
	
	const genreInfo = genreMap[genre] || { en: genre, fa: genre };
	
	// Fetch movies from TMDB by genre
	const { data: filteredMovies, loading, error } = useTMDBDiscoverMovies("foreign", genre, {
		language,
	});

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
						<Stack spacing={3}>
							{/* Back Button */}
							<Button
								onClick={() => router.push("/movies/foreign")}
								startIcon={<ArrowBackIcon />}
								sx={{
									alignSelf: "flex-start",
									color: glassColors.text.secondary,
									textTransform: "none",
									fontSize: "0.875rem",
									"&:hover": {
										color: glassColors.persianGold,
										background: glassColors.glass.base,
									},
								}}
							>
								{language === "fa" ? "بازگشت به فیلم خارجی" : "Back to Foreign Movies"}
							</Button>

							<Box>
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
									{language === "fa" ? "فیلم خارجی" : "Foreign Movies"}
								</Typography>
								<Typography
									variant="h2"
									sx={{
										fontSize: { xs: "2.5rem", md: "3.5rem" },
										fontWeight: 800,
										color: glassColors.text.primary,
										lineHeight: 1.1,
										mt: 1,
										background: `linear-gradient(135deg, ${glassColors.text.primary}, ${glassColors.persianGold})`,
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
									}}
								>
									{language === "fa" ? genreInfo.fa : genreInfo.en}
								</Typography>
								<Typography
									variant="body1"
									sx={{
										color: glassColors.text.secondary,
										maxWidth: 600,
										fontSize: "1.125rem",
										lineHeight: 1.6,
										mt: 2,
									}}
								>
									{language === "fa"
										? `فیلم‌های ${genreInfo.fa} خارجی با کیفیت بالا`
										: `High-quality foreign ${genreInfo.en} movies`}
								</Typography>
							</Box>

							{/* Stats */}
							<Box
								sx={{
									display: "flex",
									gap: 4,
									pt: 3,
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
										{filteredMovies?.length || 0}
									</Typography>
									<Typography
										variant="body2"
										sx={{ color: glassColors.text.tertiary }}
									>
										{language === "fa" ? "فیلم" : "Movies"}
									</Typography>
								</Box>
							</Box>
						</Stack>
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
						{filteredMovies && filteredMovies.length > 0 ? (
							filteredMovies.map((movie) => (
								<MediaCard key={movie.id} item={movie} type="movie" />
							))
						) : (
							<Box sx={{ ...glassStyle, p: 8, textAlign: "center", gridColumn: "1 / -1" }}>
								<Typography sx={{ color: glassColors.text.tertiary, fontSize: "1.125rem" }}>
									{language === "fa" ? "فیلمی در این ژانر پیدا نشد" : "No movies found in this genre"}
								</Typography>
							</Box>
						)}
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}
