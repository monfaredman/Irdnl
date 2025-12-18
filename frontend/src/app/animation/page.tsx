"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { MediaCard } from "@/components/media/MediaCard";
import { movies, series } from "@/data/mockContent";
import { useLanguage } from "@/providers/language-provider";

export default function AnimationPage() {
	const { language } = useLanguage();
	
	// Filter for animation content
	const animationMovies = movies.filter((movie) => 
		movie.genres?.some(g => g.toLowerCase() === "animation")
	);
	const animationSeries = series.filter((show) => 
		show.genres?.some(g => g.toLowerCase() === "animation")
	);

	const allAnimation = [
		...animationMovies.map(item => ({ ...item, type: "movie" as const })),
		...animationSeries.map(item => ({ ...item, type: "series" as const })),
	];

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
						{language === "fa" ? "دسته‌بندی" : "Category"}
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
						{language === "fa" ? "انیمیشن" : "Animation"}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 0.5 }}
					>
						{language === "fa"
							? "بهترین انیمیشن‌های سینمایی و سریالی"
							: "Best animated movies and series"}
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
					{allAnimation.length > 0 ? (
						allAnimation.map((item) => (
							<MediaCard key={item.id} item={item} type={item.type} />
						))
					) : (
						<Typography sx={{ color: "rgba(255, 255, 255, 0.5)", gridColumn: "1/-1", textAlign: "center", py: 4 }}>
							{language === "fa"
								? "محتوایی پیدا نشد"
								: "No content found"}
						</Typography>
					)}
				</Box>
			</Stack>
		</Container>
	);
}
