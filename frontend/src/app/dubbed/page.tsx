"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { MediaCard } from "@/components/media/MediaCard";
import { movies } from "@/data/mockContent";
import { useLanguage } from "@/providers/language-provider";

export default function DubbedPage() {
	const { language } = useLanguage();
	
	// In a real app, this would filter for dubbed content
	// For now, we'll show all foreign movies as potential dubbed content
	const dubbedMovies = movies.filter((movie) => movie.origin === "foreign");

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
						{language === "fa" ? "دوبله فارسی" : "Persian Dubbed"}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 0.5 }}
					>
						{language === "fa"
							? "فیلم‌های خارجی با دوبله فارسی"
							: "Foreign movies with Persian dubbing"}
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
					{dubbedMovies.map((movie) => (
						<MediaCard key={movie.id} item={movie} type="movie" />
					))}
				</Box>
			</Stack>
		</Container>
	);
}
