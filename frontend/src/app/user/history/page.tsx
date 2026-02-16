"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HistoryIcon from "@mui/icons-material/History";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Grid, LinearProgress, Skeleton, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/providers/language-provider";
import {
	glassAnimations,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import { userApi, type WatchHistoryItem } from "@/lib/api/user";

const translations = {
	en: {
		history: "Watch History",
		continueWatching: "Continue Watching",
		recentlyWatched: "Recently Watched",
		progress: "watched",
		empty: "No watch history yet",
		startWatching: "Start watching to see your history here",
	},
	fa: {
		history: "تاریخچه تماشا",
		continueWatching: "ادامه تماشا",
		recentlyWatched: "تماشا شده اخیر",
		progress: "تماشا شده",
		empty: "تاریخچه تماشایی موجود نیست",
		startWatching: "شروع به تماشا کنید تا تاریخچه شما اینجا نمایش داده شود",
	},
};

// Mock progress data - deterministic based on index
const getProgress = (index: number) => {
	const progressValues = [
		35, 62, 48, 75, 100, 100, 100, 100, 100, 100, 100, 100,
	];
	return progressValues[index] || 100;
};

const getWatchedDate = (index: number, locale: string) => {
	// Static dates to avoid impure functions
	const dates = [
		"2024-12-10",
		"2024-12-09",
		"2024-12-08",
		"2024-12-07",
		"2024-12-06",
		"2024-12-05",
		"2024-12-04",
		"2024-12-03",
		"2024-12-02",
		"2024-12-01",
		"2024-11-30",
		"2024-11-29",
	];
	return new Date(dates[index] || dates[0]).toLocaleDateString(locale);
};

export default function HistoryPage() {
	const { language } = useLanguage();
	const t = translations[language] || translations.en;

	const [historyData, setHistoryData] = useState<WatchHistoryItem[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchHistory = useCallback(async () => {
		try {
			setLoading(true);
			const items = await userApi.getWatchHistory();
			setHistoryData(Array.isArray(items) ? items : []);
		} catch {
			setHistoryData([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchHistory();
	}, [fetchHistory]);

	// Map backend data to display format
	const historyItems = historyData.map((entry) => {
		const duration = entry.content?.duration || 120; // default 120 min
		const progress = duration > 0 ? Math.min(100, Math.round((entry.progressSeconds / 60 / duration) * 100)) : 100;
		return {
			id: entry.content?.id || entry.contentId,
			title: entry.content?.titleFa || entry.content?.title || "---",
			poster: entry.content?.posterUrl || "/images/placeholder.jpg",
			year: entry.content?.year,
			rating: entry.content?.rating,
			progress,
			watchedAt: new Date(entry.updatedAt || entry.createdAt).toLocaleDateString(
				language === "fa" ? "fa-IR" : "en-US"
			),
		};
	});

	const continueWatching = historyItems.filter((item) => item.progress < 100);
	const completed = historyItems.filter((item) => item.progress === 100);

	if (loading) {
		return (
			<Box sx={{ maxWidth: 1200, mx: "auto" }}>
				<Skeleton
					variant="text"
					width={200}
					height={40}
					sx={{ bgcolor: glassColors.glass.base, mb: 3 }}
				/>
				<Grid container spacing={2}>
					{[...Array(4)].map((_, i) => (
						<Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
							<Skeleton
								variant="rounded"
								height={200}
								sx={{
									bgcolor: glassColors.glass.base,
									borderRadius: glassBorderRadius.lg,
								}}
							/>
						</Grid>
					))}
				</Grid>
			</Box>
		);
	}

	return (
		<Box sx={{ maxWidth: 1200, mx: "auto" }}>
			{/* Header */}
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
				<HistoryIcon
					sx={{ color: glassColors.persianGold, fontSize: "2rem" }}
				/>
				<Typography
					variant="h4"
					sx={{ color: glassColors.text.primary, fontWeight: 700 }}
				>
					{t.history}
				</Typography>
			</Box>

			{historyItems.length === 0 ? (
				<Box
					sx={{
						textAlign: "center",
						py: 10,
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						borderRadius: glassBorderRadius.xl,
						border: `1px solid ${glassColors.glass.border}`,
					}}
				>
					<HistoryIcon
						sx={{ fontSize: 80, color: glassColors.text.tertiary, mb: 2 }}
					/>
					<Typography
						variant="h5"
						sx={{ color: glassColors.text.primary, mb: 1 }}
					>
						{t.empty}
					</Typography>
					<Typography sx={{ color: glassColors.text.tertiary }}>
						{t.startWatching}
					</Typography>
				</Box>
			) : (
				<>
					{/* Continue Watching */}
					{continueWatching.length > 0 && (
						<Box sx={{ mb: 5 }}>
							<Typography
								variant="h6"
								sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 3 }}
							>
								{t.continueWatching}
							</Typography>
							<Grid container spacing={2}>
								{continueWatching.map((item) => (
									<Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
										<Link
											href={`/item/${item.id}`}
											style={{ textDecoration: "none" }}
										>
											<Box
												sx={{
													position: "relative",
													borderRadius: glassBorderRadius.lg,
													overflow: "hidden",
													background: glassColors.glass.base,
													border: `1px solid ${glassColors.glass.border}`,
													transition: glassAnimations.transition.spring,
													"&:hover": {
														transform: "translateY(-4px)",
														boxShadow: `0 16px 48px rgba(0, 0, 0, 0.4)`,
														"& .play-overlay": { opacity: 1 },
													},
												}}
											>
												<Box sx={{ position: "relative", aspectRatio: "16/9" }}>
													<Image
														src={item.poster}
														alt={item.title}
														fill
														style={{ objectFit: "cover" }}
														sizes="(max-width: 600px) 100vw, 25vw"
													/>

													{/* Play Overlay */}
													<Box
														className="play-overlay"
														sx={{
															position: "absolute",
															inset: 0,
															background: "rgba(0,0,0,0.5)",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															opacity: 0,
															transition: glassAnimations.transition.smooth,
														}}
													>
														<Box
															sx={{
																width: 50,
																height: 50,
																borderRadius: "50%",
																background: glassColors.persianGold,
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
															}}
														>
															<PlayArrowIcon
																sx={{
																	color: glassColors.black,
																	fontSize: "2rem",
																}}
															/>
														</Box>
													</Box>

													{/* Progress Bar */}
													<LinearProgress
														variant="determinate"
														value={item.progress}
														sx={{
															position: "absolute",
															bottom: 0,
															left: 0,
															right: 0,
															height: 4,
															background: "rgba(255,255,255,0.2)",
															"& .MuiLinearProgress-bar": {
																background: glassColors.persianGold,
															},
														}}
													/>
												</Box>

												<Box sx={{ p: 2 }}>
													<Typography
														sx={{
															color: glassColors.text.primary,
															fontWeight: 600,
															fontSize: "0.9rem",
															overflow: "hidden",
															textOverflow: "ellipsis",
															whiteSpace: "nowrap",
															mb: 0.5,
														}}
													>
														{item.title}
													</Typography>
													<Typography
														sx={{
															color: glassColors.text.tertiary,
															fontSize: "0.75rem",
														}}
													>
														{item.progress}% {t.progress}
													</Typography>
												</Box>
											</Box>
										</Link>
									</Grid>
								))}
							</Grid>
						</Box>
					)}

					{/* Recently Watched */}
					{completed.length > 0 && (
						<Box>
							<Typography
								variant="h6"
								sx={{ color: glassColors.text.primary, fontWeight: 600, mb: 3 }}
							>
								{t.recentlyWatched}
							</Typography>
							<Grid container spacing={2}>
								{completed.map((item) => (
									<Grid size={{ xs: 6, sm: 4, md: 2 }} key={item.id}>
										<Link
											href={`/item/${item.id}`}
											style={{ textDecoration: "none" }}
										>
											<Box
												sx={{
													position: "relative",
													borderRadius: glassBorderRadius.lg,
													overflow: "hidden",
													background: glassColors.glass.base,
													border: `1px solid ${glassColors.glass.border}`,
													transition: glassAnimations.transition.spring,
													"&:hover": {
														transform: "translateY(-4px) scale(1.02)",
													},
												}}
											>
												<Box sx={{ position: "relative", aspectRatio: "2/3" }}>
													<Image
														src={item.poster}
														alt={item.title}
														fill
														style={{ objectFit: "cover" }}
														sizes="(max-width: 600px) 50vw, 16vw"
													/>
												</Box>
												<Box sx={{ p: 1.5 }}>
													<Typography
														sx={{
															color: glassColors.text.primary,
															fontWeight: 500,
															fontSize: "0.8rem",
															overflow: "hidden",
															textOverflow: "ellipsis",
															whiteSpace: "nowrap",
														}}
													>
														{item.title}
													</Typography>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 0.5,
															mt: 0.5,
														}}
													>
														<AccessTimeIcon
															sx={{
																fontSize: "0.75rem",
																color: glassColors.text.tertiary,
															}}
														/>
														<Typography
															sx={{
																color: glassColors.text.tertiary,
																fontSize: "0.7rem",
															}}
														>
															{item.watchedAt}
														</Typography>
													</Box>
												</Box>
											</Box>
										</Link>
									</Grid>
								))}
							</Grid>
						</Box>
					)}
				</>
			)}
		</Box>
	);
}
