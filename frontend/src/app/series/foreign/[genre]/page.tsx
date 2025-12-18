"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { MediaCard } from "@/components/media/MediaCard";
import { series } from "@/data/mockContent";
import { useLanguage } from "@/providers/language-provider";

const genreMap: Record<string, { en: string; fa: string }> = {
	action: { en: "Action", fa: "اکشن" },
	comedy: { en: "Comedy", fa: "کمدی" },
	drama: { en: "Drama", fa: "درام" },
	thriller: { en: "Thriller", fa: "هیجان‌انگیز" },
	horror: { en: "Horror", fa: "ترسناک" },
	scifi: { en: "Sci-Fi", fa: "علمی‌تخیلی" },
	romance: { en: "Romance", fa: "عاشقانه" },
	crime: { en: "Crime", fa: "جنایی" },
	fantasy: { en: "Fantasy", fa: "فانتزی" },
	mystery: { en: "Mystery", fa: "معمایی" },
};

export default function ForeignSeriesGenrePage() {
	const params = useParams();
	const { language } = useLanguage();
	const genre = params.genre as string;
	
	const genreInfo = genreMap[genre] || { en: genre, fa: genre };
	
	// Filter for foreign series with specific genre
	const filteredSeries = series.filter(
		(show) => show.origin === "foreign" && show.genres?.some(g => g.toLowerCase() === genre)
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
						{language === "fa" ? "سریال خارجی" : "Foreign Series"}
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
							? `سریال‌های ${genreInfo.fa} خارجی با کیفیت بالا`
							: `High-quality foreign ${genreInfo.en} series`}
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
					{filteredSeries.length > 0 ? (
						filteredSeries.map((show) => (
							<MediaCard key={show.id} item={show} type="series" />
						))
					) : (
						<Typography sx={{ color: "rgba(255, 255, 255, 0.5)", gridColumn: "1/-1", textAlign: "center", py: 4 }}>
							{language === "fa"
								? "سریالی در این ژانر پیدا نشد"
								: "No series found in this genre"}
						</Typography>
					)}
				</Box>
			</Stack>
		</Container>
	);
}
