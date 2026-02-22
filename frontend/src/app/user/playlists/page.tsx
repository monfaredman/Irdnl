"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import MovieIcon from "@mui/icons-material/Movie";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import PublicIcon from "@mui/icons-material/Public";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import StarIcon from "@mui/icons-material/Star";
import TvIcon from "@mui/icons-material/Tv";
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Collapse,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Snackbar,
	Switch,
	TextField,
	Typography,
	FormControlLabel,
} from "@mui/material";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/providers/language-provider";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";
import {
	userApi,
	type PlaylistData,
	type PlaylistItemData,
} from "@/lib/api/user";

const translations = {
	en: {
		playlists: "My Playlists",
		empty: "No playlists yet",
		emptyDesc: "Create your first playlist to organize your favorite content",
		createPlaylist: "New Playlist",
		editPlaylist: "Edit Playlist",
		deletePlaylist: "Delete Playlist",
		deleteConfirm: "Are you sure you want to delete this playlist?",
		title: "Title",
		description: "Description",
		public: "Public",
		private: "Private",
		save: "Save",
		cancel: "Cancel",
		delete: "Delete",
		items: "items",
		likes: "likes",
		shares: "shares",
		created: "Created",
		createSuccess: "Playlist created",
		updateSuccess: "Playlist updated",
		deleteSuccess: "Playlist deleted",
		removeSuccess: "Removed from playlist",
		makePublic: "Public playlist",
		noItems: "No items in this playlist yet",
		noItemsDesc: "Add content from any movie or series page",
		remove: "Remove",
		movie: "Movie",
		series: "Series",
	},
	fa: {
		playlists: "لیست‌های پخش من",
		empty: "لیست پخشی وجود ندارد",
		emptyDesc: "اولین لیست پخش خود را بسازید",
		createPlaylist: "لیست جدید",
		editPlaylist: "ویرایش لیست",
		deletePlaylist: "حذف لیست",
		deleteConfirm: "آیا مطمئنید که می‌خواهید این لیست پخش را حذف کنید؟",
		title: "عنوان",
		description: "توضیحات",
		public: "عمومی",
		private: "خصوصی",
		save: "ذخیره",
		cancel: "انصراف",
		delete: "حذف",
		items: "مورد",
		likes: "لایک",
		shares: "اشتراک",
		created: "ساخته شده",
		createSuccess: "لیست پخش ایجاد شد",
		updateSuccess: "لیست پخش بروزرسانی شد",
		deleteSuccess: "لیست پخش حذف شد",
		removeSuccess: "از لیست پخش حذف شد",
		makePublic: "لیست عمومی",
		noItems: "محتوایی در این لیست وجود ندارد",
		noItemsDesc: "از صفحه فیلم‌ها و سریال‌ها محتوا اضافه کنید",
		remove: "حذف",
		movie: "فیلم",
		series: "سریال",
	},
};

export default function PlaylistsPage() {
	const { language } = useLanguage();
	const isRTL = language === "fa";
	const t = translations[language] || translations.en;

	const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
	const [loading, setLoading] = useState(true);
	const [snackbar, setSnackbar] = useState<string | null>(null);
	const [expandedId, setExpandedId] = useState<string | null>(null);

	// Dialog state
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingPlaylist, setEditingPlaylist] = useState<PlaylistData | null>(null);
	const [formTitle, setFormTitle] = useState("");
	const [formDescription, setFormDescription] = useState("");
	const [formIsPublic, setFormIsPublic] = useState(true);

	// Delete confirmation
	const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
		open: false,
		id: null,
	});

	const fetchPlaylists = useCallback(async () => {
		try {
			setLoading(true);
			const data = await userApi.getMyPlaylists();
			setPlaylists(Array.isArray(data) ? data : []);
		} catch {
			setPlaylists([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPlaylists();
	}, [fetchPlaylists]);

	const openCreateDialog = () => {
		setEditingPlaylist(null);
		setFormTitle("");
		setFormDescription("");
		setFormIsPublic(true);
		setDialogOpen(true);
	};

	const openEditDialog = (playlist: PlaylistData) => {
		setEditingPlaylist(playlist);
		setFormTitle(playlist.title);
		setFormDescription(playlist.description || "");
		setFormIsPublic(playlist.isPublic);
		setDialogOpen(true);
	};

	const handleSave = async () => {
		if (!formTitle.trim()) return;
		try {
			if (editingPlaylist) {
				await userApi.updatePlaylist(editingPlaylist.id, {
					title: formTitle,
					description: formDescription || undefined,
					isPublic: formIsPublic,
				});
				setSnackbar(t.updateSuccess);
			} else {
				await userApi.createPlaylist({
					title: formTitle,
					description: formDescription || undefined,
					isPublic: formIsPublic,
				});
				setSnackbar(t.createSuccess);
			}
			setDialogOpen(false);
			fetchPlaylists();
		} catch {
			/* ignore */
		}
	};

	const handleDelete = async () => {
		if (!deleteDialog.id) return;
		try {
			await userApi.deletePlaylist(deleteDialog.id);
			setDeleteDialog({ open: false, id: null });
			setSnackbar(t.deleteSuccess);
			fetchPlaylists();
		} catch {
			/* ignore */
		}
	};

	const handleRemoveItem = async (playlistId: string, itemId: string) => {
		try {
			await userApi.removeFromPlaylist(playlistId, itemId);
			setSnackbar(t.removeSuccess);
			fetchPlaylists();
		} catch {
			/* ignore */
		}
	};

	const toggleExpand = (playlistId: string) => {
		setExpandedId((prev) => (prev === playlistId ? null : playlistId));
	};

	const formatDate = (dateStr: string) => {
		return new Intl.DateTimeFormat(isRTL ? "fa-IR" : "en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(new Date(dateStr));
	};

	return (
		<Box dir={isRTL ? "rtl" : "ltr"}>
			{/* Header */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<Typography
					variant="h4"
					sx={{ fontWeight: 700, color: glassColors.text.primary }}
				>
					{t.playlists}
				</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={openCreateDialog}
					sx={{
						bgcolor: glassColors.gold.solid,
						color: "#000",
						fontWeight: 600,
						textTransform: "none",
						borderRadius: glassBorderRadius.md,
						"&:hover": { bgcolor: "#D97706" },
					}}
				>
					{t.createPlaylist}
				</Button>
			</Box>

			{/* Loading */}
			{loading && (
				<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
					<CircularProgress sx={{ color: glassColors.gold.solid }} />
				</Box>
			)}

			{/* Empty */}
			{!loading && playlists.length === 0 && (
				<Box
					sx={{
						textAlign: "center",
						py: 10,
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: `blur(${glassBlur.medium})`,
						borderRadius: glassBorderRadius.lg,
						border: `1px solid ${glassColors.glass.border}`,
					}}
				>
					<PlaylistPlayIcon
						sx={{ fontSize: 64, color: glassColors.text.muted, mb: 2 }}
					/>
					<Typography
						variant="h6"
						sx={{ color: glassColors.text.primary, mb: 1 }}
					>
						{t.empty}
					</Typography>
					<Typography sx={{ color: glassColors.text.secondary, mb: 3 }}>
						{t.emptyDesc}
					</Typography>
					<Button
						variant="outlined"
						startIcon={<AddIcon />}
						onClick={openCreateDialog}
						sx={{
							borderColor: glassColors.gold.solid,
							color: glassColors.gold.solid,
							textTransform: "none",
						}}
					>
						{t.createPlaylist}
					</Button>
				</Box>
			)}

			{/* Playlists - Expandable Cards */}
			{!loading && playlists.length > 0 && (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					{playlists.map((playlist) => {
						const isExpanded = expandedId === playlist.id;
						const items = playlist.items || [];

						return (
							<Box
								key={playlist.id}
								sx={{
									background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
									backdropFilter: `blur(${glassBlur.medium})`,
									borderRadius: glassBorderRadius.lg,
									border: `1px solid ${isExpanded ? glassColors.gold.light : glassColors.glass.border}`,
									overflow: "hidden",
									transition: glassAnimations.transition.smooth,
								}}
							>
								{/* Playlist Header - Clickable to expand */}
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 2,
										p: 2.5,
										cursor: "pointer",
										"&:hover": { background: `${glassColors.glass.base}40` },
									}}
									onClick={() => toggleExpand(playlist.id)}
								>
									{/* Icon */}
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: glassBorderRadius.md,
											background: `linear-gradient(135deg, ${glassColors.gold.lighter}, ${glassColors.glass.strong})`,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexShrink: 0,
										}}
									>
										<PlaylistPlayIcon sx={{ color: glassColors.gold.solid, fontSize: 28 }} />
									</Box>

									{/* Title + meta */}
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
											<Typography
												sx={{
													fontWeight: 700,
													color: glassColors.text.primary,
													fontSize: "1rem",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												}}
											>
												{playlist.title}
											</Typography>
											<Chip
												icon={
													playlist.isPublic ? (
														<PublicIcon sx={{ fontSize: 12 }} />
													) : (
														<LockIcon sx={{ fontSize: 12 }} />
													)
												}
												label={playlist.isPublic ? t.public : t.private}
												size="small"
												sx={{
													height: 20,
													fontSize: "0.65rem",
													bgcolor: `${glassColors.text.muted}15`,
													color: glassColors.text.muted,
												}}
											/>
										</Box>
										<Box
											sx={{
												display: "flex",
												gap: 2,
												fontSize: "0.8rem",
												color: glassColors.text.muted,
											}}
										>
											<span>{items.length} {t.items}</span>
											<span>{playlist.likeCount} {t.likes}</span>
											<span>{t.created}: {formatDate(playlist.createdAt)}</span>
										</Box>
									</Box>

									{/* Actions */}
									<Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
										<IconButton
											size="small"
											onClick={() => openEditDialog(playlist)}
											sx={{ color: glassColors.text.secondary }}
										>
											<EditIcon fontSize="small" />
										</IconButton>
										<IconButton
											size="small"
											onClick={() => setDeleteDialog({ open: true, id: playlist.id })}
											sx={{ color: "#ef4444" }}
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</Box>

									{/* Expand icon */}
									<IconButton size="small" sx={{ color: glassColors.text.muted }}>
										{isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
									</IconButton>
								</Box>

								{/* Expanded Content Items */}
								<Collapse in={isExpanded}>
									<Box
										sx={{
											borderTop: `1px solid ${glassColors.glass.border}`,
											p: 2,
										}}
									>
										{items.length === 0 ? (
											<Box sx={{ textAlign: "center", py: 4 }}>
												<Typography sx={{ color: glassColors.text.muted, fontSize: "0.9rem", mb: 0.5 }}>
													{t.noItems}
												</Typography>
												<Typography sx={{ color: glassColors.text.muted, fontSize: "0.8rem", opacity: 0.7 }}>
													{t.noItemsDesc}
												</Typography>
											</Box>
										) : (
											<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
												{items.map((item: PlaylistItemData, index: number) => {
													const content = item.content;
													const title = content?.title || item.contentId;
													const poster = content?.posterUrl;
													const year = content?.year;
													const rating = content?.rating;
													const contentType = content?.type;
													const genres = content?.genres || [];

													return (
														<Box
															key={item.id}
															sx={{
																display: "flex",
																alignItems: "center",
																gap: 2,
																p: 1.5,
																borderRadius: glassBorderRadius.md,
																background: glassColors.glass.base,
																border: `1px solid ${glassColors.glass.border}`,
																transition: "all 0.2s",
																"&:hover": {
																	background: `${glassColors.glass.mid}`,
																	border: `1px solid ${glassColors.gold.lighter}`,
																},
															}}
														>
															{/* Index */}
															<Typography
																sx={{
																	color: glassColors.text.muted,
																	fontSize: "0.8rem",
																	fontWeight: 600,
																	width: 24,
																	textAlign: "center",
																	flexShrink: 0,
																}}
															>
																{index + 1}
															</Typography>

															{/* Poster */}
															<Link href={`/item/${content?.id || item.contentId}`} style={{ textDecoration: "none", flexShrink: 0 }}>
																<Box
																	sx={{
																		width: 50,
																		height: 70,
																		borderRadius: glassBorderRadius.sm,
																		overflow: "hidden",
																		background: glassColors.glass.strong,
																		flexShrink: 0,
																	}}
																>
																	{poster ? (
																		<img
																			src={poster}
																			alt={title}
																			style={{
																				width: "100%",
																				height: "100%",
																				objectFit: "cover",
																			}}
																		/>
																	) : (
																		<Box
																			sx={{
																				width: "100%",
																				height: "100%",
																				display: "flex",
																				alignItems: "center",
																				justifyContent: "center",
																			}}
																		>
																			{contentType === "series" ? (
																				<TvIcon sx={{ color: glassColors.text.muted, fontSize: 20 }} />
																			) : (
																				<MovieIcon sx={{ color: glassColors.text.muted, fontSize: 20 }} />
																			)}
																		</Box>
																	)}
																</Box>
															</Link>

															{/* Content Info */}
															<Box sx={{ flex: 1, minWidth: 0 }}>
																<Link href={`/item/${content?.id || item.contentId}`} style={{ textDecoration: "none" }}>
																	<Typography
																		sx={{
																			color: glassColors.text.primary,
																			fontWeight: 600,
																			fontSize: "0.9rem",
																			overflow: "hidden",
																			textOverflow: "ellipsis",
																			whiteSpace: "nowrap",
																			"&:hover": { color: glassColors.gold.solid },
																		}}
																	>
																		{title}
																	</Typography>
																</Link>
																<Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
																	{contentType && (
																		<Chip
																			label={contentType === "series" ? t.series : t.movie}
																			size="small"
																			sx={{
																				height: 18,
																				fontSize: "0.65rem",
																				bgcolor: contentType === "series" ? "#3B82F620" : "#8B5CF620",
																				color: contentType === "series" ? "#60A5FA" : "#A78BFA",
																			}}
																		/>
																	)}
																	{year && (
																		<Typography sx={{ color: glassColors.text.muted, fontSize: "0.75rem" }}>
																			{year}
																		</Typography>
																	)}
																	{rating && (
																		<Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
																			<StarIcon sx={{ fontSize: 12, color: glassColors.gold.solid }} />
																			<Typography sx={{ color: glassColors.gold.solid, fontSize: "0.75rem", fontWeight: 600 }}>
																				{Number(rating).toFixed(1)}
																			</Typography>
																		</Box>
																	)}
																	{genres.slice(0, 2).map((genre) => (
																		<Typography
																			key={genre}
																			sx={{
																				color: glassColors.text.muted,
																				fontSize: "0.7rem",
																				opacity: 0.8,
																			}}
																		>
																			{genre}
																		</Typography>
																	))}
																</Box>
															</Box>

															{/* Remove button */}
															<IconButton
																size="small"
																onClick={() => handleRemoveItem(playlist.id, item.id)}
																sx={{
																	color: glassColors.text.muted,
																	"&:hover": { color: "#ef4444" },
																}}
															>
																<RemoveCircleOutlineIcon fontSize="small" />
															</IconButton>
														</Box>
													);
												})}
											</Box>
										)}
									</Box>
								</Collapse>
							</Box>
						);
					})}
				</Box>
			)}

			{/* Create/Edit Dialog */}
			<Dialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						bgcolor: glassColors.deepMidnight,
						color: glassColors.text.primary,
						borderRadius: glassBorderRadius.lg,
						border: `1px solid ${glassColors.glass.border}`,
					},
				}}
			>
				<DialogTitle>
					{editingPlaylist ? t.editPlaylist : t.createPlaylist}
				</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						fullWidth
						label={t.title}
						value={formTitle}
						onChange={(e) => setFormTitle(e.target.value)}
						sx={{
							mt: 1,
							mb: 1,
							"& .MuiInputBase-root": { color: glassColors.text.primary },
							"& .MuiInputLabel-root": { color: glassColors.text.muted },
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: glassColors.glass.border,
							},
						}}
					/>
					<Box sx={{ mb: 2 }}>
						<EmojiPicker onEmojiSelect={(emoji) => setFormTitle((prev) => prev + emoji)} />
					</Box>
					<TextField
						fullWidth
						multiline
						rows={3}
						label={t.description}
						value={formDescription}
						onChange={(e) => setFormDescription(e.target.value)}
						sx={{
							mb: 2,
							"& .MuiInputBase-root": { color: glassColors.text.primary },
							"& .MuiInputLabel-root": { color: glassColors.text.muted },
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: glassColors.glass.border,
							},
						}}
					/>
					<FormControlLabel
						control={
							<Switch
								checked={formIsPublic}
								onChange={(e) => setFormIsPublic(e.target.checked)}
								sx={{
									"& .Mui-checked": { color: glassColors.gold.solid },
									"& .Mui-checked + .MuiSwitch-track": {
										bgcolor: glassColors.gold.light,
									},
								}}
							/>
						}
						label={t.makePublic}
						sx={{ color: glassColors.text.secondary }}
					/>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button
						onClick={() => setDialogOpen(false)}
						sx={{ color: glassColors.text.muted }}
					>
						{t.cancel}
					</Button>
					<Button
						onClick={handleSave}
						variant="contained"
						disabled={!formTitle.trim()}
						sx={{
							bgcolor: glassColors.gold.solid,
							color: "#000",
							"&:hover": { bgcolor: "#D97706" },
						}}
					>
						{t.save}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Confirmation */}
			<Dialog
				open={deleteDialog.open}
				onClose={() => setDeleteDialog({ open: false, id: null })}
				PaperProps={{
					sx: {
						bgcolor: glassColors.deepMidnight,
						color: glassColors.text.primary,
						borderRadius: glassBorderRadius.lg,
						border: `1px solid ${glassColors.glass.border}`,
					},
				}}
			>
				<DialogTitle>{t.deletePlaylist}</DialogTitle>
				<DialogContent>
					<Typography sx={{ color: glassColors.text.secondary }}>
						{t.deleteConfirm}
					</Typography>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button
						onClick={() => setDeleteDialog({ open: false, id: null })}
						sx={{ color: glassColors.text.muted }}
					>
						{t.cancel}
					</Button>
					<Button
						onClick={handleDelete}
						variant="contained"
						sx={{
							bgcolor: "#ef4444",
							"&:hover": { bgcolor: "#dc2626" },
						}}
					>
						{t.delete}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar */}
			<Snackbar
				open={!!snackbar}
				autoHideDuration={3000}
				onClose={() => setSnackbar(null)}
				message={snackbar}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: isRTL ? "left" : "right",
				}}
			/>
		</Box>
	);
}
