"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { MediaCard } from "@/components/media/MediaCard";
import { series } from "@/data/mockContent";
import { useLanguage } from "@/providers/language-provider";

export default function ForeignSeriesPage() {
	const { language } = useLanguage();
	
	// Filter for foreign series
	const foreignSeries = series.filter((show) => show.origin === "foreign");

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
						{language === "fa" ? "سریال" : "Series"}
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
						{language === "fa" ? "سریال خارجی" : "Foreign Series"}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 0.5 }}
					>
						{language === "fa"
							? "سریال‌های خارجی با کیفیت بالا و زیرنویس فارسی"
							: "High-quality foreign series with Persian subtitles"}
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
					{foreignSeries.map((show) => (
						<MediaCard key={show.id} item={show} type="series" />
					))}
				</Box>
			</Stack>
		</Container>
	);
}
