"use client";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import { Box, Chip, Skeleton, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useBackendTrendingMovies } from "@/hooks/useBackendContent";
import { useLanguage } from "@/providers/language-provider";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import type { Movie } from "@/types/media";

const translations = {
	en: {
		title: "IMDB Top 250",
		subtitle: "The best movies of all time, as voted by IMDB users",
		rank: "Rank",
		rating: "Rating",
		year: "Year",
		votes: "votes",
		loading: "Loading top movies...",
		error: "Failed to load movies",
	},
	fa: {
		title: "۲۵۰ فیلم برتر IMDB",
		subtitle: "بهترین فیلم‌های تمام دوران به رای کاربران IMDB",
		rank: "رتبه",
		rating: "امتیاز",
		year: "سال",
		votes: "رای",
		loading: "در حال بارگذاری فیلم‌های برتر...",
		error: "خطا در بارگذاری فیلم‌ها",
	},
};

function MovieSkeleton({ index }: { index: number }) {
	return (
		<Box
			sx={{
				display: "flex",
				gap: 2,
				p: 2,
				background: `linear-gradient(135deg, ${glassColors.glass.base}, ${glassColors.glass.mid})`,
				borderRadius: glassBorderRadius.xl,
				opacity: 1 - index * 0.1,
			}}
		>
			<Skeleton
				variant="text"
				width={40}
				sx={{ bgcolor: glassColors.glass.mid }}
			/>
			<Skeleton
				variant="rectangular"
				width={80}
				height={120}
				sx={{
					borderRadius: glassBorderRadius.lg,
					bgcolor: glassColors.glass.mid,
				}}
			/>
			<Box sx={{ flex: 1 }}>
				<Skeleton
					variant="text"
					width="60%"
					sx={{ bgcolor: glassColors.glass.mid }}
				/>
				<Skeleton
					variant="text"
					width="30%"
					sx={{ bgcolor: glassColors.glass.mid }}
				/>
			</Box>
		</Box>
	);
}

export default function Top250Page() {
	const { language } = useLanguage();
	const t = translations[language] || translations.en;

	const { data: movies, loading: isLoading, error } = useBackendTrendingMovies();

	const glassCardSx = {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: `blur(${glassBlur.medium})`,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.xl,
		overflow: "hidden",
	};

	return (
		<Box sx={{ minHeight: "100vh", py: 4 }}>
			{/* Header */}
			<Box
				sx={{
					...glassCardSx,
					p: 4,
					mb: 4,
					display: "flex",
					alignItems: "center",
					gap: 3,
				}}
			>
				<Box
					sx={{
						width: 64,
						height: 64,
						borderRadius: glassBorderRadius.lg,
						background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}80)`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<EmojiEventsIcon sx={{ fontSize: "2rem", color: "#000" }} />
				</Box>
				<Box>
					<Typography
						variant="h3"
						sx={{
							color: glassColors.text.primary,
							fontWeight: 800,
							mb: 0.5,
						}}
					>
						{t.title}
					</Typography>
					<Typography sx={{ color: glassColors.text.tertiary }}>
						{t.subtitle}
					</Typography>
				</Box>
			</Box>

			{/* Movie List */}
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				{isLoading ? (
					// Skeleton loading
					Array.from({ length: 10 }).map((_, index) => (
						<MovieSkeleton key={index} index={index} />
					))
				) : error ? (
					<Box sx={{ ...glassCardSx, p: 4, textAlign: "center" }}>
						<Typography sx={{ color: glassColors.text.tertiary }}>
							{t.error}
						</Typography>
					</Box>
				) : (
					movies?.slice(0, 250).map((movie: Movie, index: number) => (
						<Link
							key={movie.id}
							href={`/movies/${movie.slug}`}
							style={{ textDecoration: "none" }}
						>
							<Box
								sx={{
									...glassCardSx,
									display: "flex",
									alignItems: "center",
									gap: { xs: 2, md: 3 },
									p: 2,
									transition: "all 0.3s ease",
									"&:hover": {
										borderColor: glassColors.persianGold,
										transform: "translateX(8px)",
										background: `linear-gradient(135deg, ${glassColors.glass.strong}80, ${glassColors.glass.mid})`,
									},
								}}
							>
								{/* Rank */}
								<Box
									sx={{
										width: 50,
										textAlign: "center",
										flexShrink: 0,
									}}
								>
									<Typography
										sx={{
											fontSize: index < 3 ? "1.75rem" : "1.25rem",
											fontWeight: 800,
											color:
												index < 3
													? glassColors.persianGold
													: glassColors.text.primary,
										}}
									>
										{index + 1}
									</Typography>
								</Box>

								{/* Poster */}
								<Box
									sx={{
										position: "relative",
										width: 80,
										height: 120,
										borderRadius: glassBorderRadius.lg,
										overflow: "hidden",
										flexShrink: 0,
									}}
								>
									<Image
										src={movie.poster || "/images/placeholder.jpg"}
										alt={movie.title}
										fill
										style={{ objectFit: "cover" }}
									/>
									{index < 10 && (
										<Box
											sx={{
												position: "absolute",
												top: 4,
												left: 4,
												background: glassColors.persianGold,
												borderRadius: glassBorderRadius.sm,
												px: 0.5,
											}}
										>
											<StarIcon sx={{ fontSize: "0.75rem", color: "#000" }} />
										</Box>
									)}
								</Box>

								{/* Info */}
								<Box sx={{ flex: 1, minWidth: 0 }}>
									<Typography
										sx={{
											color: glassColors.text.primary,
											fontWeight: 600,
											fontSize: { xs: "1rem", md: "1.125rem" },
											mb: 0.5,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{movie.title}
									</Typography>
									<Box
										sx={{
											display: "flex",
											flexWrap: "wrap",
											gap: 1,
											alignItems: "center",
										}}
									>
										<Chip
											label={movie.year || "N/A"}
											size="small"
											sx={{
												background: glassColors.glass.base,
												color: glassColors.text.secondary,
												height: 24,
											}}
										/>
										<Typography
											sx={{
												color: glassColors.text.tertiary,
												fontSize: "0.875rem",
												display: { xs: "none", sm: "block" },
											}}
										>
											{movie.description?.substring(0, 80)}
											{(movie.description?.length || 0) > 80 ? "..." : ""}
										</Typography>
									</Box>
								</Box>

								{/* Rating */}
								<Box
									sx={{
										textAlign: "center",
										flexShrink: 0,
										display: { xs: "none", md: "block" },
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 0.5,
											justifyContent: "center",
										}}
									>
										<StarIcon
											sx={{
												color: glassColors.persianGold,
												fontSize: "1.25rem",
											}}
										/>
										<Typography
											sx={{
												color: glassColors.text.primary,
												fontWeight: 700,
												fontSize: "1.25rem",
											}}
										>
											{movie.rating?.toFixed(1)}
										</Typography>
									</Box>
									<Typography
										sx={{
											color: glassColors.text.tertiary,
											fontSize: "0.75rem",
										}}
									>
										{t.votes}
									</Typography>
								</Box>

								{/* Mobile Rating */}
								<Box
									sx={{
										display: { xs: "flex", md: "none" },
										alignItems: "center",
										gap: 0.5,
									}}
								>
									<StarIcon
										sx={{ color: glassColors.persianGold, fontSize: "1rem" }}
									/>
									<Typography
										sx={{
											color: glassColors.text.primary,
											fontWeight: 700,
										}}
									>
										{movie.rating?.toFixed(1)}
									</Typography>
								</Box>
							</Box>
						</Link>
					))
				)}
			</Box>
		</Box>
	);
}
