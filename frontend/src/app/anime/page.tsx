"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { MediaCard } from "@/components/media/MediaCard";
import { series } from "@/data/mockContent";
import { useLanguage } from "@/providers/language-provider";

export default function AnimePage() {
	const { language } = useLanguage();
	
	// Filter for anime content (would be a specific tag or category in real data)
	const animeSeries = series.filter((show) => 
		show.genres?.some(g => g.toLowerCase() === "animation") && 
		show.origin === "foreign"
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
						{language === "fa" ? "انیمه" : "Anime"}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 0.5 }}
					>
						{language === "fa"
							? "بهترین انیمه‌های ژاپنی با زیرنویس فارسی"
							: "Best Japanese anime with Persian subtitles"}
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
					{animeSeries.length > 0 ? (
						animeSeries.map((show) => (
							<MediaCard key={show.id} item={show} type="series" />
						))
					) : (
						<Typography sx={{ color: "rgba(255, 255, 255, 0.5)", gridColumn: "1/-1", textAlign: "center", py: 4 }}>
							{language === "fa"
								? "انیمه‌ای پیدا نشد"
								: "No anime found"}
						</Typography>
					)}
				</Box>
			</Stack>
		</Container>
	);
}
