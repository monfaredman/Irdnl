"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { MediaCard } from "@/components/media/MediaCard";
import { movies } from "@/data/mockContent";
import { useLanguage } from "@/providers/language-provider";

const genreMap: Record<string, { en: string; fa: string }> = {
	action: { en: "Action", fa: "اکشن" },
	comedy: { en: "Comedy", fa: "کمدی" },
	drama: { en: "Drama", fa: "درام" },
	thriller: { en: "Thriller", fa: "هیجان‌انگیز" },
	horror: { en: "Horror", fa: "ترسناک" },
	romance: { en: "Romance", fa: "عاشقانه" },
	crime: { en: "Crime", fa: "جنایی" },
	family: { en: "Family", fa: "خانوادگی" },
};

export default function IranianMovieGenrePage() {
	const params = useParams();
	const { language } = useLanguage();
	const genre = params.genre as string;
	
	const genreInfo = genreMap[genre] || { en: genre, fa: genre };
	
	// Filter for Iranian movies with specific genre
	const filteredMovies = movies.filter(
		(movie) => movie.origin === "iranian" && movie.genres?.some(g => g.toLowerCase() === genre)
	);

	return (
		<Container maxWidth="lg" sx={{ py: 6 }}>
			<Stack spacing={3}>
				<Box component="header">
					<Typography
						variant="overline"
						sx={{
							fontSize: "0.75rem",
							letterSpacing: "0.4em",
							color: "rgba(255, 255, 255, 0.6)",
						}}
					>
						{language === "fa" ? "فیلم ایرانی" : "Iranian Movies"}
					</Typography>
					<Typography
						variant="h3"
						sx={{
							fontSize: "1.875rem",
							fontWeight: 600,
							color: "#fff",
							mt: 0.5,
						}}
					>
						{language === "fa" ? genreInfo.fa : genreInfo.en}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 0.5 }}
					>
						{language === "fa"
							? `فیلم‌های ${genreInfo.fa} ایرانی`
							: `Iranian ${genreInfo.en} movies`}
					</Typography>
				</Box>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, 1fr)",
							xl: "repeat(3, 1fr)",
						},
						gap: 3,
					}}
				>
					{filteredMovies.length > 0 ? (
						filteredMovies.map((movie) => (
							<MediaCard key={movie.id} item={movie} type="movie" />
						))
					) : (
						<Typography sx={{ color: "rgba(255, 255, 255, 0.5)", gridColumn: "1/-1", textAlign: "center", py: 4 }}>
							{language === "fa"
								? "فیلمی در این ژانر پیدا نشد"
								: "No movies found in this genre"}
						</Typography>
					)}
				</Box>
			</Stack>
		</Container>
	);
}
