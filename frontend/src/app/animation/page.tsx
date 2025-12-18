"use client";

import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import { MediaCard } from "@/components/media/MediaCard";
import { movies, series } from "@/data/mockContent";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

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
									{animationMovies.length}
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
									{animationSeries.length}
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
						{allAnimation.map((item) => (
							<MediaCard key={item.id} item={item} type={item.type} />
						))}
					</Box>

					{/* Empty State */}
					{allAnimation.length === 0 && (
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
