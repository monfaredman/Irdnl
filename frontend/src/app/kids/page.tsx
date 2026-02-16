"use client";

import ChildCareIcon from "@mui/icons-material/ChildCare";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarIcon from "@mui/icons-material/Star";
import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import { glassBlur, glassBorderRadius } from "@/theme/glass-design-system";
import { EmblaCarousel } from "@/components/sections/EmblaCarousel";
import { contentApi } from "@/lib/api/content";
import type { Movie, Series } from "@/types/media";

const translations = {
	en: {
		title: "Kids Zone",
		subtitle: "Safe and fun content for children",
		featuredShows: "Featured Shows",
		movies: "Kids Movies",
		series: "Kids Series",
		all: "All Kids Content",
		watchNow: "Watch Now",
		noContent:
			"No kids content available yet. Add content with isKids enabled from admin panel.",
		loading: "Loading kids content...",
	},
	fa: {
		title: "بخش کودکان",
		subtitle: "محتوای امن و سرگرم‌کننده برای کودکان",
		featuredShows: "برنامه‌های ویژه",
		movies: "فیلم‌های کودکانه",
		series: "سریال‌های کودکانه",
		all: "همه محتوای کودکان",
		watchNow: "تماشا",
		noContent:
			"هنوز محتوای کودکانه‌ای اضافه نشده. از پنل مدیریت محتوا با گزینه «کودکان» اضافه کنید.",
		loading: "در حال بارگذاری محتوای کودکان...",
	},
};

export default function KidsPage() {
	const { language } = useLanguage();
	const t = translations[language] || translations.en;

	const [kidsMovies, setKidsMovies] = useState<Movie[]>([]);
	const [kidsSeries, setKidsSeries] = useState<Series[]>([]);
	const [allKids, setAllKids] = useState<(Movie | Series)[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			try {
				const [moviesRes, seriesRes, allRes] = await Promise.all([
					contentApi
						.getContent({
							isKids: true,
							type: "movie",
							sort: "createdAt",
							order: "DESC",
							limit: 20,
						})
						.catch(() => ({ items: [] })),
					contentApi
						.getContent({
							isKids: true,
							type: "series",
							sort: "createdAt",
							order: "DESC",
							limit: 20,
						})
						.catch(() => ({ items: [] })),
					contentApi
						.getContent({
							isKids: true,
							sort: "rating",
							order: "DESC",
							limit: 30,
						})
						.catch(() => ({ items: [] })),
				]);
				if (cancelled) return;
				setKidsMovies(moviesRes.items as Movie[]);
				setKidsSeries(seriesRes.items as Series[]);
				setAllKids(allRes.items);
			} catch {
				// silently fail
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const kidsGlassCardSx = {
		background:
			"linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
		backdropFilter: glassBlur.medium,
		border: "2px solid rgba(255,255,255,0.2)",
		borderRadius: glassBorderRadius.xxl,
		overflow: "hidden",
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				py: 4,
				background:
					"linear-gradient(180deg, rgba(147, 51, 234, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(16, 185, 129, 0.2) 100%)",
			}}
		>
			{/* Header */}
			<Box
				sx={{
					...kidsGlassCardSx,
					p: 4,
					mb: 4,
					mx: { xs: 2, md: 4 },
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: 2,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
					<Box
						sx={{
							width: 72,
							height: 72,
							borderRadius: "50%",
							background: "linear-gradient(135deg, #FACC15, #F472B6)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 8px 32px rgba(250, 204, 21, 0.3)",
						}}
					>
						<ChildCareIcon sx={{ fontSize: "2.5rem", color: "#fff" }} />
					</Box>
					<Box>
						<Typography
							variant="h3"
							sx={{
								color: "#fff",
								fontWeight: 800,
								mb: 0.5,
								textShadow: "0 2px 8px rgba(0,0,0,0.2)",
							}}
						>
							{t.title}
						</Typography>
						<Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
							{t.subtitle}
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Loading */}
			{loading && (
				<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
					<CircularProgress sx={{ color: "#FACC15" }} size={48} />
				</Box>
			)}

			{/* No content */}
			{!loading && allKids.length === 0 && (
				<Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
					<Alert severity="info" sx={{ maxWidth: 600, mx: "auto" }}>
						{t.noContent}
					</Alert>
				</Box>
			)}

			{/* Kids Movies Carousel */}
			{kidsMovies.length > 0 && (
				<EmblaCarousel
					title={t.movies}
					items={kidsMovies}
					type="movie"
					viewAllHref="/search?isKids=true&type=movie"
				/>
			)}

			{/* Kids Series Carousel */}
			{kidsSeries.length > 0 && (
				<EmblaCarousel
					title={t.series}
					items={kidsSeries}
					type="series"
					viewAllHref="/search?isKids=true&type=series"
				/>
			)}

			{/* Featured Kids Content Grid */}
			{allKids.length > 0 && (
				<Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
					<Typography
						variant="h5"
						sx={{
							color: "#fff",
							fontWeight: 700,
							mb: 3,
							textShadow: "0 2px 8px rgba(0,0,0,0.2)",
						}}
					>
						{t.featuredShows}
					</Typography>
					<Grid container spacing={3}>
						{allKids.slice(0, 12).map((show) => {
							const colors = [
								"#60A5FA",
								"#34D399",
								"#F472B6",
								"#A78BFA",
								"#FACC15",
								"#06B6D4",
							];
							const color =
								colors[
									Math.abs(show.id?.charCodeAt(0) || 0) % colors.length
								];
							return (
								<Grid
									size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
									key={show.id}
								>
									<Link
										href={`/item/${show.id}`}
										style={{ textDecoration: "none" }}
									>
										<Box
											sx={{
												...kidsGlassCardSx,
												transition: "all 0.3s ease",
												"&:hover": {
													transform: "translateY(-8px) scale(1.02)",
													boxShadow: `0 12px 40px ${color}40`,
												},
											}}
										>
											<Box
												sx={{
													position: "relative",
													aspectRatio: "2/3",
													overflow: "hidden",
												}}
											>
												{show.poster ? (
													<Image
														src={show.poster}
														alt={show.title}
														fill
														style={{ objectFit: "cover" }}
													/>
												) : (
													<Box
														sx={{
															width: "100%",
															height: "100%",
															background: `linear-gradient(135deg, ${color}, ${color}99)`,
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
														}}
													>
														<ChildCareIcon
															sx={{ fontSize: "3rem", color: "#fff" }}
														/>
													</Box>
												)}
												{/* Play Button Overlay */}
												<Box
													sx={{
														position: "absolute",
														inset: 0,
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														background: `${color}60`,
														opacity: 0,
														transition: "opacity 0.3s ease",
														"&:hover": { opacity: 1 },
													}}
												>
													<Box
														sx={{
															width: 56,
															height: 56,
															borderRadius: "50%",
															background: "#fff",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
														}}
													>
														<PlayArrowIcon
															sx={{ fontSize: "2rem", color }}
														/>
													</Box>
												</Box>
												{/* Rating Badge */}
												{(Number(show.rating) || 0) > 0 && (
													<Box
														sx={{
															position: "absolute",
															top: 8,
															right: 8,
															background: "rgba(0,0,0,0.6)",
															borderRadius: glassBorderRadius.sm,
															px: 1,
															py: 0.25,
															display: "flex",
															alignItems: "center",
															gap: 0.5,
														}}
													>
														<StarIcon
															sx={{
																fontSize: "0.9rem",
																color: "#FACC15",
															}}
														/>
														<Typography
															sx={{
																color: "#fff",
																fontSize: "0.8rem",
																fontWeight: 600,
															}}
														>
															{(Number(show.rating) || 0).toFixed(1)}
														</Typography>
													</Box>
												)}
											</Box>

											{/* Info */}
											<Box sx={{ p: 2 }}>
												<Typography
													sx={{
														color: "#fff",
														fontWeight: 700,
														fontSize: "0.95rem",
														mb: 0.5,
														overflow: "hidden",
														textOverflow: "ellipsis",
														whiteSpace: "nowrap",
													}}
												>
													{show.title}
												</Typography>
												{show.year && (
													<Typography
														sx={{
															color: "rgba(255,255,255,0.6)",
															fontSize: "0.8rem",
														}}
													>
														{show.year}
													</Typography>
												)}
											</Box>
										</Box>
									</Link>
								</Grid>
							);
						})}
					</Grid>
				</Box>
			)}
		</Box>
	);
}
