"use client";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import { Box, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Snackbar, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { contentApi } from "@/lib/api/content";
import { useLanguage } from "@/providers/language-provider";
import { useIsAuthenticated, useUser } from "@/store/auth";
import {
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import type { Movie } from "@/types/media";

const translations = {
	en: {
		title: "Coming Soon",
		subtitle: "Upcoming movies and series",
		releaseDate: "Release Date",
		watchTrailer: "Watch Trailer",
		notifyMe: "Notify Me",
		notified: "Notified",
		daysLeft: "days left",
		loading: "Loading upcoming content...",
		genres: "Genres",
	},
	fa: {
		title: "به‌زودی",
		subtitle: "فیلم‌ها و سریال‌های آینده",
		releaseDate: "تاریخ انتشار",
		watchTrailer: "تماشای تریلر",
		notifyMe: "اطلاع بده",
		notified: "اطلاع‌رسانی فعال",
		daysLeft: "روز مانده",
		loading: "در حال بارگذاری...",
		genres: "ژانرها",
	},
};

// Generate mock release dates
function getRandomFutureDate(seed: number): string {
	const today = new Date();
	const daysToAdd = 7 + ((seed * 13) % 180); // 7 to 187 days from now
	const futureDate = new Date(
		today.getTime() + daysToAdd * 24 * 60 * 60 * 1000,
	);
	return futureDate.toISOString().split("T")[0];
}

function getDaysUntil(dateString: string): number {
	const today = new Date();
	const targetDate = new Date(dateString);
	const diffTime = targetDate.getTime() - today.getTime();
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatDate(dateString: string, language: string): string {
	const date = new Date(dateString);
	if (language === "fa") {
		return new Intl.DateTimeFormat("fa-IR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	}
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

export default function ComingSoonPage() {
	const { language } = useLanguage();
	const t = translations[language] || translations.en;
	const isAuthenticated = useIsAuthenticated();
	const user = useUser();

	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [notifiedMovies, setNotifiedMovies] = useState<Set<string>>(new Set());
	const [snackbar, setSnackbar] = useState({ open: false, message: "" });
	const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

	// Fetch coming-soon content from backend
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				setLoading(true);
				const res = await contentApi.getContent({ isComingSoon: true, sort: "createdAt", order: "DESC", limit: 30 });
				if (!cancelled) setMovies(res.items as Movie[]);
			} catch {
				// silent
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => { cancelled = true; };
	}, []);

	const glassCardSx = {
		background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
		backdropFilter: `blur(${glassBlur.medium})`,
		border: `1px solid ${glassColors.glass.border}`,
		borderRadius: glassBorderRadius.xl,
		overflow: "hidden",
	};

	const toggleNotification = (movieId: string) => {
		if (!isAuthenticated || !user?.email) {
			setSnackbar({ open: true, message: language === "fa" ? "لطفاً ابتدا وارد حساب کاربری خود شوید" : "Please login first" });
			return;
		}
		setNotifiedMovies((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(movieId)) {
				newSet.delete(movieId);
				setSnackbar({ open: true, message: language === "fa" ? "اطلاع‌رسانی غیرفعال شد" : "Notification disabled" });
			} else {
				newSet.add(movieId);
				setSnackbar({ open: true, message: language === "fa" ? `اطلاع‌رسانی برای ${user.email} فعال شد` : `Notification enabled for ${user.email}` });
			}
			return newSet;
		});
	};

	const handleWatchTrailer = (movie: Movie) => {
		const trailer = (movie as any).trailers?.[0];
		if (trailer?.url) {
			setTrailerUrl(trailer.url);
		} else {
			setSnackbar({ open: true, message: language === "fa" ? "تریلری برای این محتوا موجود نیست" : "No trailer available" });
		}
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
					<UpcomingIcon sx={{ fontSize: "2rem", color: "#000" }} />
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

			{/* Content List */}
			{loading ? (
				<Box sx={{ ...glassCardSx, p: 4, textAlign: "center" }}>
					<Typography sx={{ color: glassColors.text.tertiary }}>
						{t.loading}
					</Typography>
				</Box>
			) : (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
					{movies?.map((movie: Movie, index: number) => {
						const releaseDate = (movie as any).publishDate
							? new Date((movie as any).publishDate).toISOString().split("T")[0]
							: getRandomFutureDate(index);
						const daysLeft = getDaysUntil(releaseDate);
						const isNotified = notifiedMovies.has(movie.id);

						return (
							<Box
								key={movie.id}
								sx={{
									...glassCardSx,
									display: "flex",
									flexDirection: { xs: "column", md: "row" },
									transition: "all 0.3s ease",
									"&:hover": {
										borderColor: glassColors.persianGold,
									},
								}}
							>
								{/* Backdrop Image */}
								<Box
									sx={{
										position: "relative",
										width: { xs: "100%", md: 400 },
										height: { xs: 200, md: 225 },
										flexShrink: 0,
									}}
								>
									<Image
										src={movie.backdrop || movie.poster}
										alt={movie.title}
										fill
										style={{ objectFit: "cover" }}
									/>
									{/* Countdown Badge */}
									<Box
										sx={{
											position: "absolute",
											top: 16,
											left: 16,
											background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.persianGold}CC)`,
											borderRadius: glassBorderRadius.lg,
											px: 2,
											py: 1,
										}}
									>
										<Typography
											sx={{
												color: "#000",
												fontWeight: 700,
												fontSize: "1.25rem",
												lineHeight: 1,
											}}
										>
											{daysLeft}
										</Typography>
										<Typography
											sx={{
												color: "rgba(0,0,0,0.7)",
												fontSize: "0.7rem",
												fontWeight: 500,
											}}
										>
											{t.daysLeft}
										</Typography>
									</Box>
									{/* Play Trailer Button */}
									<Box
										sx={{
											position: "absolute",
											inset: 0,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											background: "rgba(0,0,0,0.3)",
											opacity: 0,
											transition: "opacity 0.3s ease",
											cursor: "pointer",
											"&:hover": { opacity: 1 },
										}}
										onClick={() => handleWatchTrailer(movie)}
									>
										<IconButton
											sx={{
												width: 64,
												height: 64,
												background: `${glassColors.persianGold}CC`,
												"&:hover": { background: glassColors.persianGold },
											}}
										>
											<PlayArrowIcon sx={{ fontSize: "2rem", color: "#000" }} />
										</IconButton>
									</Box>
								</Box>

								{/* Content */}
								<Box
									sx={{
										flex: 1,
										p: 3,
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
									}}
								>
									<Box>
										<Typography
											variant="h5"
											sx={{
												color: glassColors.text.primary,
												fontWeight: 700,
												mb: 1,
											}}
										>
											{movie.title}
										</Typography>

										{/* Release Date */}
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
												mb: 2,
											}}
										>
											<CalendarMonthIcon
												sx={{
													color: glassColors.persianGold,
													fontSize: "1.25rem",
												}}
											/>
											<Typography sx={{ color: glassColors.text.secondary }}>
												{t.releaseDate}: {formatDate(releaseDate, language)}
											</Typography>
										</Box>

										{/* Description */}
										<Typography
											sx={{
												color: glassColors.text.tertiary,
												fontSize: "0.9rem",
												mb: 2,
												display: "-webkit-box",
												WebkitLineClamp: 2,
												WebkitBoxOrient: "vertical",
												overflow: "hidden",
											}}
										>
											{movie.description}
										</Typography>

										{/* Genres */}
										<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
											{movie.genres?.slice(0, 3).map((genre) => (
												<Chip
													key={genre}
													label={genre}
													size="small"
													sx={{
														background: glassColors.glass.base,
														color: glassColors.text.secondary,
														textTransform: "capitalize",
													}}
												/>
											))}
										</Box>
									</Box>

									{/* Actions */}
									<Box
										sx={{
											display: "flex",
											gap: 2,
											mt: 2,
											flexWrap: "wrap",
										}}
									>
										<Button
											startIcon={<PlayArrowIcon />}
											onClick={() => handleWatchTrailer(movie)}
											sx={{
												borderRadius: glassBorderRadius.lg,
												background: glassColors.glass.mid,
												border: `1px solid ${glassColors.glass.border}`,
												color: glassColors.text.primary,
												textTransform: "none",
												px: 3,
												"&:hover": {
													background: glassColors.glass.strong,
													borderColor: glassColors.persianGold,
												},
											}}
										>
											{t.watchTrailer}
										</Button>
										<Button
											startIcon={
												isNotified ? (
													<NotificationsActiveIcon />
												) : (
													<NotificationsIcon />
												)
											}
											onClick={() => toggleNotification(movie.id)}
											sx={{
												borderRadius: glassBorderRadius.lg,
												background: isNotified
													? `${glassColors.persianGold}20`
													: "transparent",
												border: `1px solid ${isNotified ? glassColors.persianGold : glassColors.glass.border}`,
												color: isNotified
													? glassColors.persianGold
													: glassColors.text.secondary,
												textTransform: "none",
												px: 3,
												"&:hover": {
													background: `${glassColors.persianGold}20`,
													borderColor: glassColors.persianGold,
												},
											}}
										>
											{isNotified ? t.notified : t.notifyMe}
										</Button>
									</Box>
								</Box>
							</Box>
						);
					})}
				</Box>
			)}

			{/* Trailer Dialog */}
			<Dialog
				open={!!trailerUrl}
				onClose={() => setTrailerUrl(null)}
				maxWidth="md"
				fullWidth
				PaperProps={{ sx: { background: "#000", borderRadius: "16px" } }}
			>
				<DialogTitle sx={{ color: "#fff", fontFamily: language === "fa" ? "Vazirmatn" : "inherit" }}>
					{t.watchTrailer}
				</DialogTitle>
				<DialogContent>
					{trailerUrl && (
						<Box
							component="video"
							src={trailerUrl}
							controls
							autoPlay
							sx={{ width: "100%", borderRadius: "8px" }}
						/>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setTrailerUrl(null)} sx={{ color: glassColors.persianGold }}>
						{language === "fa" ? "بستن" : "Close"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={() => setSnackbar({ open: false, message: "" })}
				message={snackbar.message}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			/>
		</Box>
	);
}
