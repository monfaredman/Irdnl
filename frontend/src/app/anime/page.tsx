"use client";

import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import { MediaCard } from "@/components/media/MediaCard";
import { series } from "@/data/mockContent";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

export default function AnimePage() {
	const { language } = useLanguage();
	
	// Filter for anime content (would be a specific tag or category in real data)
	const animeSeries = series.filter((show) => 
		show.genres?.some(g => g.toLowerCase() === "animation") && 
		show.origin === "foreign"
	);

	// Extract unique genres
	const allGenres = Array.from(
		new Set(animeSeries.flatMap((s) => s.genres || []))
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
								{language === "fa" ? "انیمه" : "Anime"}
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
									? "بهترین انیمه‌های ژاپنی با زیرنویس فارسی"
									: "Best Japanese anime with Persian subtitles"}
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
									{animeSeries.length}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: glassColors.text.tertiary }}
								>
									{language === "fa" ? "انیمه" : "Anime"}
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
									{allGenres.length}
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

					{/* Anime Grid */}
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
						{animeSeries.map((show) => (
							<MediaCard key={show.id} item={show} type="series" />
						))}
					</Box>

					{/* Empty State */}
					{animeSeries.length === 0 && (
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
									? "انیمه‌ای پیدا نشد"
									: "No anime found"}
							</Typography>
						</Box>
					)}
				</Stack>
			</Container>
		</Box>
	);
}
