"use client";

import GroupIcon from "@mui/icons-material/Group";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
	Box,
	Button,
	Chip,
	IconButton,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/providers/language-provider";

export const PersianHero = () => {
	const theme = useTheme();
	const { language } = useLanguage();
	const isRTL = language === "fa";

	// Mock Dune Part Two data - in real app, this would come from props or API
	const heroMovie = {
		title: "DUNE PART TWO",
		titlePersian: "تل ماسه",
		subtitle: "قسمت دوم",
		genres: ["درام", "اکشن", "ماجراجویی"],
		rating: 8.4,
		year: 2024,
		backdrop: "/images/movies/desert-sonata-wide.svg", // Using existing image as placeholder
		slug: "dune-part-two",
	};

	return (
		<Box
			component="section"
			sx={{
				position: "relative",
				width: "100%",
				height: { xs: "60vh", md: "80vh" },
				minHeight: 500,
				borderRadius: 4,
				overflow: "hidden",
				mb: 4,
			}}
		>
			{/* Background Image */}
			<Box
				sx={{
					position: "absolute",
					inset: 0,
					"&::after": {
						content: '""',
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)",
						zIndex: 1,
					},
				}}
			>
				<Image
					src={heroMovie.backdrop}
					alt={heroMovie.title}
					fill
					style={{
						objectFit: "cover",
					}}
					priority
				/>
			</Box>

			{/* Content */}
			<Box
				sx={{
					position: "relative",
					zIndex: 2,
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-end",
					p: { xs: 3, md: 6 },
				}}
			>
				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={4}
					sx={{
						width: "100%",
						maxWidth: 1200,
						mx: "auto",
					}}
				>
					{/* Left: English Title */}
					<Box sx={{ flex: 1 }}>
						<Typography
							variant="h1"
							sx={{
								fontSize: { xs: "2rem", md: "4rem" },
								fontWeight: 700,
								color: "#fff",
								mb: 2,
								textShadow: "0 2px 20px rgba(0,0,0,0.8)",
								lineHeight: 1.1,
							}}
						>
							{heroMovie.title}
						</Typography>
					</Box>

					{/* Right: Persian Title + Details + Buttons */}
					<Box
						sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}
					>
						<Box>
							<Typography
								variant="h2"
								sx={{
									fontSize: { xs: "1.75rem", md: "2.5rem" },
									fontWeight: 700,
									color: "#fff",
									mb: 1,
									textShadow: "0 2px 20px rgba(0,0,0,0.8)",
								}}
							>
								{heroMovie.titlePersian}
							</Typography>
							<Typography
								variant="h3"
								sx={{
									fontSize: { xs: "1.25rem", md: "1.75rem" },
									fontWeight: 600,
									color: "rgba(255, 255, 255, 0.9)",
									mb: 2,
									textShadow: "0 2px 20px rgba(0,0,0,0.8)",
								}}
							>
								{heroMovie.subtitle}
							</Typography>
						</Box>

						<Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 1 }}>
							{heroMovie.genres.map((genre, index) => (
								<Chip
									key={index}
									label={genre}
									size="small"
									sx={{
										background: "rgba(255, 255, 255, 0.15)",
										backdropFilter: "blur(10px)",
										border: "1px solid rgba(255, 255, 255, 0.2)",
										color: "#fff",
										fontSize: "0.875rem",
										fontWeight: 500,
									}}
								/>
							))}
							<Chip
								label={`⭐ ${heroMovie.rating}`}
								size="small"
								sx={{
									background: "rgba(255, 255, 255, 0.15)",
									backdropFilter: "blur(10px)",
									border: "1px solid rgba(255, 255, 255, 0.2)",
									color: "#fff",
									fontSize: "0.875rem",
									fontWeight: 600,
								}}
							/>
							<Chip
								label={heroMovie.year}
								size="small"
								sx={{
									background: "rgba(255, 255, 255, 0.15)",
									backdropFilter: "blur(10px)",
									border: "1px solid rgba(255, 255, 255, 0.2)",
									color: "#fff",
									fontSize: "0.875rem",
									fontWeight: 500,
								}}
							/>
						</Stack>

						<Stack direction="column" spacing={2}>
							<Button
								component={Link}
								href={`/movies/${heroMovie.slug}`}
								variant="contained"
								startIcon={<PlayArrowIcon />}
								sx={{
									borderRadius: 2,
									px: 4,
									py: 1.5,
									fontSize: "1rem",
									fontWeight: 600,
									textTransform: "none",
									background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.tertiary?.main || theme.palette.secondary.main} 100%)`,
									boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 30px rgba(147, 51, 234, 0.4)`,
									"&:hover": {
										background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.tertiary?.light || theme.palette.secondary.light} 100%)`,
										boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 50px rgba(147, 51, 234, 0.6)`,
										transform: "scale(1.02)",
									},
									transition: "all 0.3s",
								}}
							>
								{language === "fa" ? "تماشا کنید" : "Watch Now"}
							</Button>
							<Button
								component={Link}
								// Disabled: route doesn't exist yet (would 404)
								href="#"
								onClick={(e) => e.preventDefault()}
								variant="outlined"
								startIcon={<GroupIcon />}
								sx={{
									pointerEvents: "none",
									opacity: 0.6,
									borderRadius: 2,
									px: 4,
									py: 1.5,
									fontSize: "1rem",
									fontWeight: 600,
									textTransform: "none",
									borderColor: "rgba(255, 255, 255, 0.3)",
									color: "#fff",
									background: "rgba(255, 255, 255, 0.1)",
									backdropFilter: "blur(10px)",
									"&:hover": {
										borderColor: theme.palette.primary.light,
										background: "rgba(255, 255, 255, 0.15)",
										transform: "scale(1.02)",
									},
									transition: "all 0.3s",
								}}
							>
								{language === "fa" ? "فیلم پارتی" : "Movie Party"}
							</Button>
						</Stack>
					</Box>
				</Stack>

				{/* Carousel Dots */}
				<Stack
					direction="row"
					spacing={1}
					justifyContent="center"
					sx={{
						mt: 4,
						position: "absolute",
						bottom: { xs: 20, md: 30 },
						left: "50%",
						transform: "translateX(-50%)",
						zIndex: 3,
					}}
				>
					{[1, 2, 3, 4, 5].map((dot, index) => (
						<Box
							key={index}
							sx={{
								width: index === 0 ? 24 : 8,
								height: 8,
								borderRadius: 4,
								background:
									index === 0
										? theme.palette.secondary.main
										: "rgba(255, 255, 255, 0.3)",
								transition: "all 0.3s",
								cursor: "pointer",
								"&:hover": {
									background:
										index === 0
											? theme.palette.secondary.light
											: "rgba(255, 255, 255, 0.5)",
								},
							}}
						/>
					))}
				</Stack>
			</Box>
		</Box>
	);
};
