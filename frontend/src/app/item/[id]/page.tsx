"use client";

import { ArrowBack } from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Snackbar,
	TextField,
	Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import {
	glassBorderRadius,
	glassColors,
	glassSpacing,
} from "@/theme/glass-design-system";
import type { Movie, Series } from "@/types/media";
import { ItemHeader } from "@/components/media/ItemHeader";
import { SeasonsEpisodes } from "@/components/media/SeasonsEpisodes";
import { SynopsisAbout } from "@/components/media/SynopsisAbout";
import { SimilarContent } from "@/components/media/SimilarContent";
import { Comments } from "@/components/media/Comments";
import { CinematicHero } from "@/components/media/CinematicHero";
import { VisualDetailsStrip } from "@/components/media/VisualDetailsStrip";
import { CastGallery } from "@/components/media/CastGallery";
import { VisualRatingsDisplay } from "@/components/media/VisualRatingsDisplay";
import { VisualSynopsisCard } from "@/components/media/VisualSynopsisCard";
import { VisualContentGrid } from "@/components/media/VisualContentGrid";
import { ShareDialog } from "@/components/modals/ShareDialog";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { getCountryFlag } from "@/lib/country-flags";
import { contentApi } from "@/lib/api/content";
import { userApi, type PlaylistData } from "@/lib/api/user";
import { useIsAuthenticated } from "@/store/auth";
import { useRouter } from "next/navigation";

// Mock data for development
import { movies, series } from "@/data/mockContent";

export default function ItemDetailPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const isAuthenticated = useIsAuthenticated();

	const [data, setData] = useState<Movie | Series | null>(null);
	const [type, setType] = useState<"movie" | "series" | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [shareDialogOpen, setShareDialogOpen] = useState(false);
	const [snackbar, setSnackbar] = useState<string | null>(null);

	// Bookmark, Playlist, Clap state (persisted in localStorage + backend for authenticated users)
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [isInPlaylist, setIsInPlaylist] = useState(false);
	const [isClapped, setIsClapped] = useState(false);
	const [clapCount, setClapCount] = useState(0);

	// Add-to-playlist dialog state
	const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
	const [userPlaylists, setUserPlaylists] = useState<PlaylistData[]>([]);
	const [playlistsLoading, setPlaylistsLoading] = useState(false);
	const [newPlaylistTitle, setNewPlaylistTitle] = useState("");

	// Load saved states from localStorage and backend
	useEffect(() => {
		if (!id) return;
		try {
			const bookmarks: string[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
			setIsBookmarked(bookmarks.includes(id));
			const claps: Record<string, boolean> = JSON.parse(localStorage.getItem("claps") || "{}");
			setIsClapped(!!claps[id]);
		} catch { /* ignore */ }

		// If authenticated, check backend watchlist and playlists
		if (isAuthenticated) {
			userApi.getWatchlist().then((items) => {
				const inWatchlist = items.some((item) => item.contentId === id || item.content?.id === id);
				if (inWatchlist) {
					setIsBookmarked(true);
				}
			}).catch(() => { /* ignore */ });

			// Check if this content is in any playlist
			userApi.getMyPlaylists().then((playlists) => {
				const inAny = playlists.some((pl) =>
					pl.items?.some((item) => item.contentId === id)
				);
				setIsInPlaylist(inAny);
			}).catch(() => { /* ignore */ });
		}
	}, [id, isAuthenticated]);

	const toggleBookmark = async () => {
		if (!id) return;
		if (!isAuthenticated) {
			setSnackbar("برای نشان‌گذاری ابتدا وارد حساب کاربری شوید");
			setTimeout(() => router.push("/auth/login"), 1500);
			return;
		}
		try {
			const bookmarks: string[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
			let updated: string[];
			if (bookmarks.includes(id)) {
				updated = bookmarks.filter((b) => b !== id);
				setIsBookmarked(false);
				setSnackbar("از نشان‌ها حذف شد");
				userApi.removeFromWatchlist(id).catch(() => {});
			} else {
				updated = [...bookmarks, id];
				setIsBookmarked(true);
				setSnackbar("به نشان‌ها اضافه شد");
				userApi.addToWatchlist(id).catch(() => {});
			}
			localStorage.setItem("bookmarks", JSON.stringify(updated));
		} catch { /* ignore */ }
	};

	const togglePlaylist = async () => {
		if (!id) return;
		if (!isAuthenticated) {
			setSnackbar("برای افزودن به لیست پخش ابتدا وارد حساب کاربری شوید");
			setTimeout(() => router.push("/auth/login"), 1500);
			return;
		}
		// Open playlist selection dialog
		setPlaylistDialogOpen(true);
		setPlaylistsLoading(true);
		try {
			const playlists = await userApi.getMyPlaylists();
			setUserPlaylists(Array.isArray(playlists) ? playlists : []);
		} catch {
			setUserPlaylists([]);
		} finally {
			setPlaylistsLoading(false);
		}
	};

	const handleAddToPlaylist = async (playlistId: string) => {
		if (!id) return;
		const playlist = userPlaylists.find((p) => p.id === playlistId);
		const alreadyIn = playlist?.items?.some((item) => item.contentId === id);

		try {
			if (alreadyIn) {
				// Remove from this playlist
				const itemToRemove = playlist?.items?.find((item) => item.contentId === id);
				if (itemToRemove) {
					await userApi.removeFromPlaylist(playlistId, itemToRemove.id);
					setSnackbar("از لیست پخش حذف شد");
				}
			} else {
				await userApi.addToPlaylist(playlistId, id);
				setSnackbar("به لیست پخش اضافه شد");
			}
			// Refresh playlists in dialog
			const updated = await userApi.getMyPlaylists();
			setUserPlaylists(Array.isArray(updated) ? updated : []);
			// Update isInPlaylist state
			const inAny = updated.some((pl) =>
				pl.items?.some((item) => item.contentId === id)
			);
			setIsInPlaylist(inAny);
		} catch {
			setSnackbar("خطا در عملیات");
		}
	};

	const handleCreateAndAdd = async () => {
		if (!id || !newPlaylistTitle.trim()) return;
		try {
			const newPlaylist = await userApi.createPlaylist({ title: newPlaylistTitle.trim() });
			await userApi.addToPlaylist(newPlaylist.id, id);
			setNewPlaylistTitle("");
			setSnackbar("لیست جدید ساخته شد و محتوا اضافه شد");
			// Refresh playlists
			const updated = await userApi.getMyPlaylists();
			setUserPlaylists(Array.isArray(updated) ? updated : []);
			setIsInPlaylist(true);
		} catch {
			setSnackbar("خطا در ساخت لیست");
		}
	};

	const toggleClap = () => {
		if (!id) return;
		if (!isAuthenticated) {
			setSnackbar("برای لایک کردن ابتدا وارد حساب کاربری شوید");
			setTimeout(() => router.push("/auth/login"), 1500);
			return;
		}
		try {
			const claps: Record<string, boolean> = JSON.parse(localStorage.getItem("claps") || "{}");
			if (claps[id]) {
				delete claps[id];
				setIsClapped(false);
				setClapCount((c) => Math.max(0, c - 1));
				setSnackbar("لایک برداشته شد");
			} else {
				claps[id] = true;
				setIsClapped(true);
				setClapCount((c) => c + 1);
				setSnackbar("لایک شد! 👏");
			}
			localStorage.setItem("claps", JSON.stringify(claps));
		} catch { /* ignore */ }
	};

	const fetchItem = useCallback(async () => {
		// Guard against undefined id
		if (!id) {
			setError("Invalid item ID");
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			// Fetch from API (backend at port 3001)
			const content = await contentApi.getContentById(id);

			if (!content) {
				throw new Error("Content not found");
			}

			// Detect type based on data structure
			if ("seasons" in content) {
				setData(content as Series);
				setType("series");
			} else {
				setData(content as Movie);
				setType("movie");
			}
		} catch (e) {
			// Fallback: try mock data
			const movie = movies.find((m) => m.id === id);
			if (movie) {
				setData(movie);
				setType("movie");
				setLoading(false);
				return;
			}

			const seriesItem = series.find((s) => s.id === id);
			if (seriesItem) {
				setData(seriesItem);
				setType("series");
				setLoading(false);
				return;
			}

			setError(e instanceof Error ? e.message : "Failed to load content");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchItem();
	}, [fetchItem]);

	// Prepare visual data from database content
	const visualImages = useMemo(() => {
		if (!data) return [];
		// Use backdrop image if available
		const images: Array<{ url: string; caption: string; aspectRatio: number }> = [];
		if (data.backdrop) {
			images.push({ url: data.backdrop, caption: "Scene 1", aspectRatio: 1.78 });
		}
		if ((data as any).bannerUrl) {
			images.push({ url: (data as any).bannerUrl, caption: "Banner", aspectRatio: 1.78 });
		}
		return images;
	}, [data]);

	const castMembers = useMemo(() => {
		if (!data) return [];
		// Use cast from database content
		const cast = (data as any).cast;
		if (!Array.isArray(cast)) return [];
		return cast.slice(0, 15).map((member: any, idx: number) => ({
			id: member.id || idx,
			name: member.name || member,
			character: member.character || "",
			profileUrl: member.imageUrl || member.profileUrl || member.profile_path || "/images/placeholder.jpg",
		}));
	}, [data]);

	const dubbingCastMembers = useMemo(() => {
		if (!data) return [];
		const dubbingCast = (data as any).dubbingCast;
		if (!Array.isArray(dubbingCast) || dubbingCast.length === 0) return [];
		return dubbingCast.slice(0, 15).map((member: any, idx: number) => ({
			id: member.id || idx + 1000,
			name: member.name || "",
			character: member.character ? `${member.character}${member.language ? ` (${member.language})` : ""}` : member.language || "دوبله",
			profileUrl: member.imageUrl || "/images/placeholder.jpg",
		}));
	}, [data]);

	const productionTeamMembers = useMemo(() => {
		if (!data) return [];
		const team = (data as any).productionTeam;
		if (!Array.isArray(team) || team.length === 0) return [];
		return team.slice(0, 15).map((member: any, idx: number) => ({
			id: member.id || idx + 2000,
			name: member.name || "",
			character: member.role ? `${member.role}${member.department ? ` - ${member.department}` : ""}` : member.department || "",
			profileUrl: member.imageUrl || "/images/placeholder.jpg",
		}));
	}, [data]);

	const [relatedContent, setRelatedContent] = useState<Array<{ id: string; title: string; backdropUrl: string; rating: number; year?: number }>>([]);

	// Fetch related content from API based on genres
	useEffect(() => {
		if (!data || !type || !id) return;
		const genres = data.genres || [];
		const fetchRelated = async () => {
			try {
				// Fetch content matching the first genre of this item
				const genre = genres.length > 0 ? genres[0] : undefined;
				const res = await contentApi.getContent({
					type,
					genre: genre?.toLowerCase(),
					limit: 14,
					sort: "rating",
					order: "DESC",
				});
				const items = res.items
					.filter((item) => item.id !== id) // exclude current item
					.slice(0, 12)
					.map((item) => ({
						id: item.id,
						title: item.title,
						backdropUrl: item.backdrop || item.poster || "",
						rating: item.rating || 0,
						year: item.year,
					}));
				setRelatedContent(items);
			} catch {
				// Fallback to mock data if API fails
				const fallback =
					type === "movie"
						? movies.filter((m) => m.id !== id).slice(0, 12)
						: series.filter((s) => s.id !== id).slice(0, 12);
				setRelatedContent(
					fallback.map((item) => ({
						id: item.id,
						title: item.title,
						backdropUrl: item.backdrop,
						rating: item.rating,
						year: item.year,
					})),
				);
			}
		};
		fetchRelated();
	}, [data, type, id]);

	// Get similar content
	const similarContent =
		type === "movie"
			? movies.filter((m) => m.id !== id).slice(0, 8)
			: series.filter((s) => s.id !== id).slice(0, 8);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				position: "relative",
				background: glassColors.deepMidnight,
			}}
		>
			{/* Breadcrumb - Floating on top */}
			{/* <Box
				sx={{
					position: "absolute",
					top: { xs: 80, md: 100 },
					right: { xs: 16, md: 32 },
					zIndex: 10,
					display: "flex",
					alignItems: "center",
					gap: 1,
				}}
			>
				<IconButton
					component={Link}
					href="/"
					aria-label="Back to home"
					sx={{
						color: glassColors.text.primary,
						background: `${glassColors.glass.strong}`,
						backdropFilter: "blur(10px)",
						border: `1px solid ${glassColors.glass.border}`,
						"&:hover": {
							background: glassColors.glass.mid,
							border: `1px solid ${glassColors.gold.solid}`,
							transform: "scale(1.05)",
						},
					}}
				>
					<ArrowBack />
				</IconButton>
				<Typography
					sx={{
						color: glassColors.text.secondary,
						fontSize: "0.875rem",
						background: glassColors.glass.strong,
						backdropFilter: "blur(10px)",
						px: 2,
						py: 0.75,
						borderRadius: glassBorderRadius.pill,
						border: `1px solid ${glassColors.glass.border}`,
					}}
					dir="rtl"
				>
					خانه / {type === "movie" ? "فیلم" : "سریال"}
				</Typography>
			</Box> */}

			{/* Error State */}
			{error && (
				<Container maxWidth="lg" sx={{ pt: 20 }}>
					<Alert
						severity="error"
						sx={{
							mb: 3,
							borderRadius: glassBorderRadius.lg,
							background: "rgba(239,68,68,0.12)",
							border: "1px solid rgba(239,68,68,0.25)",
							color: glassColors.text.primary,
						}}
						action={
							<Button
								onClick={fetchItem}
								color="inherit"
								size="small"
								sx={{ textTransform: "none" }}
							>
								تلاش مجدد
							</Button>
						}
					>
						{error}
					</Alert>
				</Container>
			)}

			{/* Loading State */}
			{loading && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "100vh",
					}}
				>
					<CircularProgress
						size={60}
						sx={{
							color: glassColors.persianGold,
						}}
					/>
				</Box>
			)}

			{/* Content */}
			{!loading && data && type && (
				<>
					{/* A. Cinematic Hero Section */}
					<CinematicHero
						backdropUrl={data.backdrop}
						title={data.title}
						englishTitle={(data as any).originalTitle || undefined}
						tagline={(data as any).tagline || undefined}
						year={data.year}
						rating={data.rating}
						duration={
							type === "movie"
								? (data as Movie).duration
								: "Series"
						}
						genres={data.genres || []}
						externalPlayerUrl={data.externalPlayerUrl}
						accessType={(data as any).accessType || "free"}
						sources={type === "movie" ? (data as Movie).sources : undefined}
						contentId={id}
						onPlay={() => {
							// Internal video sources — external URLs are handled by CinematicHero directly
							const movie = data as Movie;
							if (movie.sources && movie.sources.length > 0) {
								window.location.href = `/watch/${id}`;
							}
						}}
						onAddToList={togglePlaylist}
						onShare={() => setShareDialogOpen(true)}
						isBookmarked={isBookmarked}
						onToggleBookmark={toggleBookmark}
						isInPlaylist={isInPlaylist}
						onTogglePlaylist={togglePlaylist}
						isClapped={isClapped}
						clapCount={clapCount}
						onToggleClap={toggleClap}
					/>					<Container maxWidth="lg" sx={{ pb: 8 }}>
						{/* B. Visual Details Strip */}
						{visualImages.length > 0 && (
							<VisualDetailsStrip images={visualImages} />
						)}

						{/* Item Details - Director, Country, Duration etc. (only if data exists) */}
						{((data as any).director || (data as any).country || (data as any).imdbId || data.year) && (
							<Box
								sx={{
									display: "flex",
									flexWrap: "wrap",
									gap: 2,
									py: 3,
									px: 2,
									mb: 3,
									borderRadius: glassBorderRadius.lg,
									background: glassColors.glass.base,
									border: `1px solid ${glassColors.glass.border}`,
									backdropFilter: "blur(10px)",
								}}
								dir="rtl"
							>
								{(data as any).director && (
									<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
										<Typography sx={{ color: glassColors.text.muted, fontSize: "0.85rem" }}>کارگردان:</Typography>
										<Typography sx={{ color: glassColors.text.primary, fontSize: "0.85rem", fontWeight: 600 }}>
											{(data as any).director}
										</Typography>
									</Box>
								)}
								{(data as any).country && (
									<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
										<Typography sx={{ color: glassColors.text.muted, fontSize: "0.85rem" }}>کشور:</Typography>
										<Typography
											sx={{
												color: glassColors.text.primary,
												fontSize: "0.85rem",
												fontWeight: 600,
												display: "flex",
												alignItems: "center",
												gap: 0.75,
											}}
										>
											{getCountryFlag((data as any).country) && (
												<Box
													component="span"
													sx={{
														fontSize: "1.35rem",
														lineHeight: 1,
														filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
													}}
												>
													{getCountryFlag((data as any).country)}
												</Box>
											)}
											{(data as any).country}
										</Typography>
									</Box>
								)}
								{data.year > 0 && (
									<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
										<Typography sx={{ color: glassColors.text.muted, fontSize: "0.85rem" }}>سال:</Typography>
										<Typography sx={{ color: glassColors.text.primary, fontSize: "0.85rem", fontWeight: 600 }}>
											{data.year}
										</Typography>
									</Box>
								)}
								{type === "movie" && (data as Movie).duration && (
									<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
										<Typography sx={{ color: glassColors.text.muted, fontSize: "0.85rem" }}>مدت:</Typography>
										<Typography sx={{ color: glassColors.text.primary, fontSize: "0.85rem", fontWeight: 600 }}>
											{typeof (data as Movie).duration === "number" 
												? `${Math.floor(((data as Movie).duration as number) / 60)} دقیقه` 
												: (data as Movie).duration}
										</Typography>
									</Box>
								)}
								{(data as any).imdbId && (
									<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
										<Typography sx={{ color: glassColors.text.muted, fontSize: "0.85rem" }}>IMDb:</Typography>
										<Typography
											component="a"
											href={`https://www.imdb.com/title/${(data as any).imdbId}`}
											target="_blank"
											rel="noopener noreferrer"
											sx={{
												color: glassColors.persianGold,
												fontSize: "0.85rem",
												fontWeight: 600,
												textDecoration: "none",
												"&:hover": { textDecoration: "underline" },
											}}
										>
											{(data as any).imdbId}
										</Typography>
									</Box>
								)}
							</Box>
						)}

						{/* C. Visual Synopsis Card */}
						{data.description && (
							<VisualSynopsisCard
								synopsis={data.description}
								backgroundImage={visualImages[1]?.url || data.backdrop}
							/>
						)}

						{/* D. Visual Ratings Display */}
						{(data.rating > 0 || (data as any).ratings) && (
							<VisualRatingsDisplay
								userScore={data.rating}
								voteCount={(data as any).voteCount || 1000}
								criticsScore={data.rating > 0 ? Math.round((data.rating / 10) * 100) : undefined}
								ratings={(data as any).ratings}
							/>
						)}

						{/* E. Cast & Crew Gallery */}
						{castMembers.length > 0 && <CastGallery cast={castMembers} />}

						{/* E2. Dubbing Cast Gallery */}
						{dubbingCastMembers.length > 0 && (
							<CastGallery cast={dubbingCastMembers} title="گویندگان دوبله" />
						)}

						{/* E3. Production Team Gallery */}
						{productionTeamMembers.length > 0 && (
							<CastGallery cast={productionTeamMembers} title="عوامل سازنده" />
						)}

						{/* F. Season & Episodes (Series Only) */}
						{type === "series" && <SeasonsEpisodes series={data as Series} />}

						{/* G. Visual Content Grid - Similar Content */}
						{relatedContent.length > 0 && (
							<VisualContentGrid
								items={relatedContent}
								title={type === "movie" ? "فیلم‌های مرتبط" : "سریال‌های مرتبط"}
							/>
						)}

						{/* H. Comments with Visual Context */}
						<Comments itemId={id} />
					</Container>

					{/* Share Dialog */}
					<ShareDialog
						open={shareDialogOpen}
						onClose={() => setShareDialogOpen(false)}
						title={data.title}
					/>

					{/* Add to Playlist Dialog */}
					<Dialog
						open={playlistDialogOpen}
						onClose={() => setPlaylistDialogOpen(false)}
						maxWidth="xs"
						fullWidth
						PaperProps={{
							sx: {
								bgcolor: "#0F172A",
								color: glassColors.text.primary,
								borderRadius: glassBorderRadius.lg,
								border: `1px solid ${glassColors.glass.border}`,
								backdropFilter: "blur(20px)",
							},
						}}
					>
						<DialogTitle sx={{ fontFamily: "Vazirmatn", fontWeight: 700, pb: 1 }}>
							افزودن به لیست پخش
						</DialogTitle>
						<DialogContent sx={{ px: 2, pb: 1 }}>
							{playlistsLoading ? (
								<Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
									<CircularProgress size={32} sx={{ color: glassColors.gold.solid }} />
								</Box>
							) : (
								<>
									{userPlaylists.length > 0 ? (
										<List sx={{ py: 0 }}>
											{userPlaylists.map((pl) => {
												const isContentIn = pl.items?.some((item) => item.contentId === id);
												return (
													<ListItemButton
														key={pl.id}
														onClick={() => handleAddToPlaylist(pl.id)}
														sx={{
															borderRadius: glassBorderRadius.md,
															mb: 0.5,
															"&:hover": { bgcolor: `${glassColors.glass.mid}` },
														}}
													>
														<ListItemIcon sx={{ minWidth: 36 }}>
															{isContentIn ? (
																<CheckCircleIcon sx={{ color: glassColors.gold.solid }} />
															) : (
																<RadioButtonUncheckedIcon sx={{ color: glassColors.text.muted }} />
															)}
														</ListItemIcon>
														<ListItemText
															primary={pl.title}
															secondary={`${pl.items?.length || 0} مورد`}
															primaryTypographyProps={{
																sx: {
																	fontFamily: "Vazirmatn",
																	fontWeight: 600,
																	color: isContentIn ? glassColors.gold.solid : glassColors.text.primary,
																	fontSize: "0.9rem",
																},
															}}
															secondaryTypographyProps={{
																sx: {
																	fontFamily: "Vazirmatn",
																	color: glassColors.text.muted,
																	fontSize: "0.75rem",
																},
															}}
														/>
													</ListItemButton>
												);
											})}
										</List>
									) : (
										<Typography sx={{ color: glassColors.text.muted, py: 2, textAlign: "center", fontFamily: "Vazirmatn", fontSize: "0.9rem" }}>
											هنوز لیست پخشی ندارید
										</Typography>
									)}

									{/* Quick create new playlist */}
									<Box sx={{ display: "flex", gap: 1, mt: 1.5, alignItems: "center" }}>
										<TextField
											size="small"
											placeholder="نام لیست جدید..."
											value={newPlaylistTitle}
											onChange={(e) => setNewPlaylistTitle(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") handleCreateAndAdd();
											}}
											fullWidth
											sx={{
												"& .MuiInputBase-root": {
													color: glassColors.text.primary,
													fontSize: "0.85rem",
													fontFamily: "Vazirmatn",
												},
												"& .MuiOutlinedInput-notchedOutline": {
													borderColor: glassColors.glass.border,
												},
												"& .MuiInputBase-input::placeholder": {
													fontFamily: "Vazirmatn",
												},
											}}
										/>
										<EmojiPicker onEmojiSelect={(emoji) => setNewPlaylistTitle((prev) => prev + emoji)} />
										<IconButton
											onClick={handleCreateAndAdd}
											disabled={!newPlaylistTitle.trim()}
											sx={{
												color: glassColors.gold.solid,
												"&.Mui-disabled": { color: glassColors.text.muted },
											}}
										>
											<AddIcon />
										</IconButton>
									</Box>
								</>
							)}
						</DialogContent>
						<DialogActions sx={{ px: 3, pb: 2 }}>
							<Button
								onClick={() => setPlaylistDialogOpen(false)}
								sx={{ color: glassColors.text.muted, fontFamily: "Vazirmatn" }}
							>
								بستن
							</Button>
						</DialogActions>
					</Dialog>
				</>
			)}

			{/* Snackbar for actions feedback */}
			<Snackbar
				open={!!snackbar}
				autoHideDuration={2000}
				onClose={() => setSnackbar(null)}
				message={snackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				sx={{
					"& .MuiSnackbarContent-root": {
						background: `${glassColors.glass.strong}`,
						backdropFilter: "blur(20px)",
						border: `1px solid ${glassColors.glass.border}`,
						fontFamily: "Vazirmatn",
						borderRadius: glassBorderRadius.md,
					},
				}}
			/>
		</Box>
	);
}
