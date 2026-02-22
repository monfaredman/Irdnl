"use client";

import {
	ArrowRight,
	CheckCircle,
	Copy,
	Edit2,
	ExternalLink,
	Eye,
	Film,
	Globe,
	Monitor,
	Plus,
	Save,
	Trash2,
	Upload,
	Video,
	X,
	XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/admin/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { contentApi, episodesApi, seasonsApi, videosApi, tmdbApi, categoriesApi as adminCategoriesApi } from "@/lib/api/admin";
import type { TMDBSeasonSummary, TMDBEpisode } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";
import { getCountryFlag } from "@/lib/country-flags";
import {
	Snackbar,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button as MuiButton,
	FormControl,
	InputLabel,
	Select as MuiSelect,
	MenuItem as MuiMenuItem,
	Checkbox,
	ListItemText,
	OutlinedInput,
	Chip,
	Box,
} from "@mui/material";

interface EpisodeFormData {
	title: string;
	number: string;
	description: string;
	duration: string;
	thumbnailUrl: string;
	externalPlayerUrl: string;
	videoAssetId: string;
	seasonId: string;
}

const defaultEpisodeForm: EpisodeFormData = {
	title: "",
	number: "",
	description: "",
	duration: "",
	thumbnailUrl: "",
	externalPlayerUrl: "",
	videoAssetId: "",
	seasonId: "",
};

export default function ContentDetailPage() {
	const { t } = useTranslation();
	const params = useParams();
	const router = useRouter();
	const id = params.id as string;

	const [content, setContent] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [seasons, setSeasons] = useState<any[]>([]);
	const [activeSeasonId, setActiveSeasonId] = useState<string | null>(null);

	// Season form
	const [showSeasonForm, setShowSeasonForm] = useState(false);
	const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null);
	const [seasonForm, setSeasonForm] = useState({ number: "", title: "" });

	// Episode form
	const [showEpisodeForm, setShowEpisodeForm] = useState(false);
	const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);
	const [episodeForm, setEpisodeForm] =
		useState<EpisodeFormData>(defaultEpisodeForm);
	const [episodeMediaType, setEpisodeMediaType] = useState<
		"external" | "internal" | "none"
	>("none");

	// Content edit mode
	const [editMode, setEditMode] = useState(false);
	const [editForm, setEditForm] = useState<Record<string, any>>({});
	const [savingEdit, setSavingEdit] = useState(false);
	const [copiedId, setCopiedId] = useState(false);

	// Feedback
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	// Confirmation dialog
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
	}>({
		open: false,
		title: "",
		message: "",
		onConfirm: () => {},
	});

	// Status change
	const [updatingStatus, setUpdatingStatus] = useState(false);

	// Categories for multi-select
	const [availableCategories, setAvailableCategories] = useState<any[]>([]);

	// TMDB season/episode auto-fill
	const [tmdbSeasons, setTmdbSeasons] = useState<TMDBSeasonSummary[]>([]);
	const [showTmdbSeasons, setShowTmdbSeasons] = useState(false);
	const [loadingTmdbSeasons, setLoadingTmdbSeasons] = useState(false);
	const [tmdbEpisodes, setTmdbEpisodes] = useState<TMDBEpisode[]>([]);
	const [showTmdbEpisodes, setShowTmdbEpisodes] = useState(false);
	const [loadingTmdbEpisodes, setLoadingTmdbEpisodes] = useState(false);
	const [importingSeasons, setImportingSeasons] = useState(false);
	const [importingEpisodes, setImportingEpisodes] = useState(false);

	const handleStatusChange = async (newStatus: "draft" | "published") => {
		if (updatingStatus || newStatus === content?.status) return;
		setUpdatingStatus(true);
		try {
			await contentApi.update(id, { status: newStatus });
			showFeedback("success", newStatus === "published" ? t("admin.content.detail.publishSuccess") : t("admin.content.detail.unpublishSuccess"));
			await refreshContent();
		} catch (error) {
			console.error("Failed to update status:", error);
			showFeedback("error", t("admin.content.detail.statusChangeFailed"));
		} finally {
			setUpdatingStatus(false);
		}
	};

	const showFeedback = (type: "success" | "error", message: string) => {
		setFeedback({ type, message });
	};

	const showConfirm = (
		title: string,
		message: string,
		onConfirm: () => void,
	) => {
		setConfirmDialog({
			open: true,
			title,
			message,
			onConfirm,
		});
	};

	const handleConfirmClose = (confirmed: boolean) => {
		if (confirmed) {
			confirmDialog.onConfirm();
		}
		setConfirmDialog({
			open: false,
			title: "",
			message: "",
			onConfirm: () => {},
		});
	};

	// Content edit mode handlers
	const openEditMode = () => {
		setEditForm({
			title: content?.title || "",
			originalTitle: content?.originalTitle || "",
			description: content?.description || "",
			year: content?.year || "",
			duration: content?.duration || "",
			rating: content?.rating || "",
			ratings: content?.ratings || {},
			genres: (content?.genres || []).join(", "),
			tags: (content?.tags || []).join(", "),
			languages: (content?.languages || []).join(", "),
			originalLanguage: content?.originalLanguage || "",
			ageRating: content?.ageRating || "",
			director: content?.director || "",
			writer: content?.writer || "",
			producer: content?.producer || "",
			productionCompany: content?.productionCompany || "",
			country: content?.country || "",
			posterUrl: content?.posterUrl || "",
			bannerUrl: content?.bannerUrl || "",
			backdropUrl: content?.backdropUrl || "",
			imdbId: content?.imdbId || "",
			tmdbId: content?.tmdbId || "",
			externalPlayerUrl: content?.externalPlayerUrl || "",
			categoryIds: content?.categoryIds || [],
			isKids: content?.isKids || false,
			isDubbed: content?.isDubbed || false,
			isComingSoon: content?.isComingSoon || false,
			featured: content?.featured || false,
			accessType: content?.accessType || "free",
			priority: content?.priority || 0,
			cast: content?.cast || [],
			dubbingCast: (content as any)?.dubbingCast || [],
			productionTeam: (content as any)?.productionTeam || [],
		});
		setEditMode(true);
	};

	const handleSaveEdit = async () => {
		setSavingEdit(true);
		try {
			const payload: any = {
				title: editForm.title,
				originalTitle: editForm.originalTitle || undefined,
				description: editForm.description || undefined,
				year: editForm.year ? parseInt(editForm.year) : undefined,
				duration: editForm.duration ? parseInt(editForm.duration) : undefined,
				rating: editForm.rating ? parseFloat(editForm.rating) : undefined,
				ratings: editForm.ratings && Object.keys(editForm.ratings).length > 0 ? editForm.ratings : undefined,
				genres: editForm.genres ? editForm.genres.split(",").map((g: string) => g.trim()).filter(Boolean) : undefined,
				tags: editForm.tags ? editForm.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : undefined,
				languages: editForm.languages ? editForm.languages.split(",").map((l: string) => l.trim()).filter(Boolean) : undefined,
				originalLanguage: editForm.originalLanguage || undefined,
				ageRating: editForm.ageRating || undefined,
				director: editForm.director || undefined,
				writer: editForm.writer || undefined,
				producer: editForm.producer || undefined,
				productionCompany: editForm.productionCompany || undefined,
				country: editForm.country || undefined,
				posterUrl: editForm.posterUrl || undefined,
				bannerUrl: editForm.bannerUrl || undefined,
				backdropUrl: editForm.backdropUrl || undefined,
				imdbId: editForm.imdbId || undefined,
				tmdbId: editForm.tmdbId || undefined,
				categoryIds: editForm.categoryIds || [],
				isKids: editForm.isKids ?? false,
				isDubbed: editForm.isDubbed ?? false,
				isComingSoon: editForm.isComingSoon ?? false,
				featured: editForm.featured ?? false,
				accessType: editForm.accessType || "free",
				priority: editForm.priority != null ? Number(editForm.priority) : 0,
				cast: editForm.cast?.length > 0 ? editForm.cast : undefined,
				dubbingCast: editForm.dubbingCast?.length > 0 ? editForm.dubbingCast : undefined,
				productionTeam: editForm.productionTeam?.length > 0 ? editForm.productionTeam : undefined,
			};
			if (content?.type === "series") {
				payload.externalPlayerUrl = editForm.externalPlayerUrl || undefined;
			}
			await contentApi.update(id, payload);
			showFeedback("success", t("admin.content.detail.updateSuccess"));
			setEditMode(false);
			await refreshContent();
		} catch (error) {
			console.error("Failed to update content:", error);
			showFeedback("error", t("admin.content.detail.updateFailed"));
		} finally {
			setSavingEdit(false);
		}
	};

	const handleCopyId = () => {
		navigator.clipboard.writeText(id);
		setCopiedId(true);
		setTimeout(() => setCopiedId(false), 2000);
	};

	// Episode video upload
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadingEpisodeId, setUploadingEpisodeId] = useState<string | null>(
		null,
	);

	// Movie video upload
	const movieFileInputRef = useRef<HTMLInputElement>(null);
	const [uploadingMovie, setUploadingMovie] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<string>("");
	const [editingExternalUrl, setEditingExternalUrl] = useState(false);
	const [externalUrlInput, setExternalUrlInput] = useState("");
	const [mediaType, setMediaType] = useState<"external" | "internal" | null>(null);

	const handleEpisodeVideoUpload = async (
		episodeId: string,
		file: File,
	) => {
		setUploadingEpisodeId(episodeId);
		try {
			await videosApi.uploadForEpisode(file, id, episodeId, "1080p");
			showFeedback("success", t("admin.content.episodes.uploadSuccess"));
			await refreshContent();
		} catch (error) {
			console.error("Failed to upload episode video:", error);
			showFeedback("error", t("admin.content.episodes.uploadFailed"));
		} finally {
			setUploadingEpisodeId(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const triggerEpisodeUpload = (episodeId: string) => {
		if (fileInputRef.current) {
			fileInputRef.current.dataset.episodeId = episodeId;
			fileInputRef.current.click();
		}
	};

	// Movie video upload handler
	const handleMovieVideoUpload = async (file: File) => {
		setUploadingMovie(true);
		setUploadProgress(t("admin.content.detail.videoUploadProgress"));
		try {
			await videosApi.upload(file, id, "1080p");
			showFeedback("success", t("admin.content.detail.videoUploadSuccess"));
			await refreshContent();
		} catch (error) {
			console.error("Failed to upload movie video:", error);
			showFeedback("error", t("admin.content.detail.videoUploadFailed"));
		} finally {
			setUploadingMovie(false);
			setUploadProgress("");
			if (movieFileInputRef.current) {
				movieFileInputRef.current.value = "";
			}
		}
	};

	// Mark video asset as ready
	const handleMarkAssetReady = async (asset: any) => {
		try {
			const hlsUrl = asset.hlsUrl || `/storage/${id}/${asset.quality}/${asset.contentId || id}`;
			await videosApi.markTranscoded(asset.id, {
				hlsUrl,
				duration: asset.duration || 0,
				status: "ready",
			});
			showFeedback("success", t("admin.content.detail.videoStatusSuccess"));
			await refreshContent();
		} catch (error) {
			console.error("Failed to mark asset as ready:", error);
			showFeedback("error", t("admin.content.detail.videoStatusFailed"));
		}
	};

	// External URL save handler
	const handleSaveExternalUrl = async () => {
		try {
			await contentApi.update(id, { externalPlayerUrl: externalUrlInput || null });
			showFeedback("success", t("admin.content.detail.externalUrlSaveSuccess"));
			setEditingExternalUrl(false);
			await refreshContent();
		} catch (error) {
			console.error("Failed to save external URL:", error);
			showFeedback("error", t("admin.content.detail.externalUrlSaveFailed"));
		}
	};

	// Remove external URL
	const handleRemoveExternalUrl = async () => {
		try {
			await contentApi.update(id, { externalPlayerUrl: null });
			showFeedback("success", t("admin.content.detail.externalUrlRemoveSuccess"));
			await refreshContent();
		} catch (error) {
			console.error("Failed to remove external URL:", error);
			showFeedback("error", t("admin.content.detail.externalUrlRemoveFailed"));
		}
	};

	const refreshContent = async () => {
		try {
			const data = await contentApi.get(id);
			setContent(data);
			if (data.series?.seasons) {
				setSeasons(data.series.seasons);
				if (
					!activeSeasonId ||
					!data.series.seasons.find((s: any) => s.id === activeSeasonId)
				) {
					setActiveSeasonId(data.series.seasons[0]?.id || null);
				}
			}
		} catch (error) {
			console.error("Failed to fetch content:", error);
		}
	};

	useEffect(() => {
		const fetchContent = async () => {
			try {
				const data = await contentApi.get(id);
				setContent(data);
				if (data.series?.seasons) {
					setSeasons(data.series.seasons);
					setActiveSeasonId(data.series.seasons[0]?.id || null);
				}
			} catch (error) {
				console.error("Failed to fetch content:", error);
			} finally {
				setLoading(false);
			}
		};
		if (id) fetchContent();
	}, [id]);

	// Fetch categories for multi-select
	useEffect(() => {
		adminCategoriesApi.list().then((res) => {
			setAvailableCategories((res as any).data || []);
		}).catch(console.error);
	}, []);

	// ── Season Handlers ──

	const openSeasonForm = (season?: any) => {
		if (season) {
			setEditingSeasonId(season.id);
			setSeasonForm({
				number: String(season.number),
				title: season.title || "",
			});
		} else {
			setEditingSeasonId(null);
			setSeasonForm({
				number: String((seasons.length || 0) + 1),
				title: "",
			});
		}
		setShowSeasonForm(true);
	};

	const handleSeasonSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (editingSeasonId) {
				await seasonsApi.update(editingSeasonId, {
					number: parseInt(seasonForm.number),
					title: seasonForm.title || undefined,
				});
				showFeedback("success", t("admin.content.seasons.updateSuccess"));
			} else {
				if (!content?.series?.id) {
					showFeedback("error", t("admin.content.seasons.notSeries"));
					return;
				}
				await seasonsApi.create({
					seriesId: content.series.id,
					number: parseInt(seasonForm.number),
					title: seasonForm.title || undefined,
				});
				showFeedback("success", t("admin.content.seasons.createSuccess"));
			}
			setShowSeasonForm(false);
			setEditingSeasonId(null);
			await refreshContent();
		} catch (error) {
			showFeedback(
				"error",
				editingSeasonId
					? t("admin.content.seasons.updateFailed")
					: t("admin.content.seasons.createFailed"),
			);
		}
	};

	const handleDeleteSeason = async (seasonId: string) => {
		showConfirm(
			t("admin.content.seasons.title"),
			t("admin.content.seasons.deleteConfirm"),
			async () => {
				try {
					await seasonsApi.delete(seasonId);
					showFeedback("success", t("admin.content.seasons.deleteSuccess"));
					if (activeSeasonId === seasonId) setActiveSeasonId(null);
					await refreshContent();
				} catch (error) {
					showFeedback("error", t("admin.content.seasons.deleteFailed"));
				}
			},
		);
	};

	// ── Episode Handlers ──

	const openEpisodeForm = (seasonId: string, episode?: any) => {
		if (episode) {
			setEditingEpisodeId(episode.id);
			const mediaType = episode.externalPlayerUrl
				? "external"
				: episode.videoAssetId
					? "internal"
					: "none";
			setEpisodeMediaType(mediaType);
			setEpisodeForm({
				title: episode.title || "",
				number: String(episode.number),
				description: episode.description || "",
				duration: episode.duration ? String(episode.duration) : "",
				thumbnailUrl: episode.thumbnailUrl || "",
				externalPlayerUrl: episode.externalPlayerUrl || "",
				videoAssetId: episode.videoAssetId || "",
				seasonId,
			});
		} else {
			setEditingEpisodeId(null);
			setEpisodeMediaType("none");
			const activeSeason = seasons.find((s) => s.id === seasonId);
			const nextNum = (activeSeason?.episodes?.length || 0) + 1;
			setEpisodeForm({
				...defaultEpisodeForm,
				seasonId,
				number: String(nextNum),
			});
		}
		setShowEpisodeForm(true);
	};

	const handleEpisodeSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const payload: any = {
				title: episodeForm.title,
				number: parseInt(episodeForm.number),
				description: episodeForm.description || undefined,
				duration: episodeForm.duration
					? parseInt(episodeForm.duration)
					: undefined,
				thumbnailUrl: episodeForm.thumbnailUrl || undefined,
			};

			if (episodeMediaType === "external") {
				payload.externalPlayerUrl = episodeForm.externalPlayerUrl || undefined;
				payload.videoAssetId = null;
			} else if (episodeMediaType === "internal") {
				payload.videoAssetId = episodeForm.videoAssetId || undefined;
				payload.externalPlayerUrl = null;
			} else {
				payload.externalPlayerUrl = null;
				payload.videoAssetId = null;
			}

			if (editingEpisodeId) {
				await episodesApi.update(editingEpisodeId, payload);
				showFeedback("success", t("admin.content.episodes.updateSuccess"));
			} else {
				payload.seasonId = episodeForm.seasonId;
				await episodesApi.create(payload);
				showFeedback("success", t("admin.content.episodes.createSuccess"));
			}
			setShowEpisodeForm(false);
			setEditingEpisodeId(null);
			setEpisodeForm(defaultEpisodeForm);
			await refreshContent();
		} catch (error) {
			showFeedback(
				"error",
				editingEpisodeId
					? t("admin.content.episodes.updateFailed")
					: t("admin.content.episodes.createFailed"),
			);
		}
	};

	const handleDeleteEpisode = async (episodeId: string) => {
		showConfirm(
			t("admin.content.episodes.title"),
			t("admin.content.episodes.deleteConfirm"),
			async () => {
				try {
					await episodesApi.delete(episodeId);
					showFeedback("success", t("admin.content.episodes.deleteSuccess"));
					await refreshContent();
				} catch (error) {
					showFeedback("error", t("admin.content.episodes.deleteFailed"));
				}
			},
		);
	};

	// ── TMDB Auto-fill Handlers ──

	const handleFetchTmdbSeasons = async () => {
		const tmdbId = content?.tmdbId;
		if (!tmdbId) {
			showFeedback("error", "TMDB ID برای این محتوا تنظیم نشده است");
			return;
		}
		setLoadingTmdbSeasons(true);
		try {
			const details = await tmdbApi.getTVDetails(tmdbId);
			const seasonList = (details.seasons || []).filter(
				(s) => s.seasonNumber > 0, // exclude specials (season 0)
			);
			setTmdbSeasons(seasonList);
			setShowTmdbSeasons(true);
		} catch (error) {
			console.error("Failed to fetch TMDB seasons:", error);
			showFeedback("error", t("admin.content.detail.tmdbSeasonsFetchFailed"));
		} finally {
			setLoadingTmdbSeasons(false);
		}
	};

	const handleImportTmdbSeasons = async () => {
		if (!content?.series?.id || tmdbSeasons.length === 0) return;
		setImportingSeasons(true);
		try {
			let created = 0;
			for (const ts of tmdbSeasons) {
				// Skip if season number already exists locally
				const exists = seasons.find((s) => s.number === ts.seasonNumber);
				if (exists) continue;

				await seasonsApi.create({
					seriesId: content.series.id,
					number: ts.seasonNumber,
					title: ts.name || `فصل ${ts.seasonNumber}`,
				});
				created++;
			}
			showFeedback(
				"success",
				created > 0
					? `${created} فصل با موفقیت از TMDB وارد شد`
					: t("admin.content.detail.tmdbSeasonsAllExist"),
			);
			setShowTmdbSeasons(false);
			setTmdbSeasons([]);
			await refreshContent();
		} catch (error) {
			console.error("Failed to import TMDB seasons:", error);
			showFeedback("error", t("admin.content.detail.tmdbSeasonsImportFailed"));
		} finally {
			setImportingSeasons(false);
		}
	};

	const handleFetchTmdbEpisodes = async () => {
		const tmdbId = content?.tmdbId;
		if (!tmdbId) {
			showFeedback("error", "TMDB ID برای این محتوا تنظیم نشده است");
			return;
		}
		if (!activeSeason) {
			showFeedback("error", t("admin.content.detail.tmdbSelectSeasonFirst"));
			return;
		}
		setLoadingTmdbEpisodes(true);
		try {
			const seasonData = await tmdbApi.getTVSeasonEpisodes(
				tmdbId,
				activeSeason.number,
			);
			setTmdbEpisodes(seasonData.episodes || []);
			setShowTmdbEpisodes(true);
		} catch (error) {
			console.error("Failed to fetch TMDB episodes:", error);
			showFeedback("error", t("admin.content.detail.tmdbEpisodesFetchFailed"));
		} finally {
			setLoadingTmdbEpisodes(false);
		}
	};

	const handleImportTmdbEpisodes = async () => {
		if (!activeSeason || tmdbEpisodes.length === 0) return;
		setImportingEpisodes(true);
		try {
			let created = 0;
			for (const ep of tmdbEpisodes) {
				// Skip if episode number already exists locally
				const exists = activeEpisodes.find(
					(e: any) => e.number === ep.episodeNumber,
				);
				if (exists) continue;

				await episodesApi.create({
					seasonId: activeSeason.id,
					title: ep.name || `قسمت ${ep.episodeNumber}`,
					number: ep.episodeNumber,
					description: ep.overview || undefined,
					duration: ep.runtime ? ep.runtime * 60 : undefined, // minutes to seconds
					thumbnailUrl: ep.stillUrl || undefined,
				});
				created++;
			}
			showFeedback(
				"success",
				created > 0
					? `${created} قسمت با موفقیت از TMDB وارد شد`
					: t("admin.content.detail.tmdbEpisodesAllExist"),
			);
			setShowTmdbEpisodes(false);
			setTmdbEpisodes([]);
			await refreshContent();
		} catch (error) {
			console.error("Failed to import TMDB episodes:", error);
			showFeedback("error", t("admin.content.detail.tmdbEpisodesImportFailed"));
		} finally {
			setImportingEpisodes(false);
		}
	};

	// ── Helpers ──

	const activeSeason = seasons.find((s) => s.id === activeSeasonId);
	const activeEpisodes = activeSeason?.episodes || [];

	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		return `${mins} دقیقه`;
	};

	const getMediaBadge = (episode: any) => {
		if (episode.externalPlayerUrl) {
			return (
				<span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
					<Globe className="h-3 w-3" />
					{t("admin.content.episodes.externalPlayer")}
				</span>
			);
		}
		if (episode.videoAssetId || episode.videoAsset) {
			const status = episode.videoAsset?.status;
			const statusColor =
				status === "READY"
					? "bg-green-100 text-green-700"
					: status === "PROCESSING"
						? "bg-yellow-100 text-yellow-700"
						: status === "ERROR"
							? "bg-red-100 text-red-700"
							: "bg-purple-100 text-purple-700";
			return (
				<span
					className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${statusColor}`}
				>
					<Video className="h-3 w-3" />
					{t("admin.content.episodes.internalVideo")}
					{status && ` (${status})`}
				</span>
			);
		}
		return (
			<span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
				{t("admin.content.episodes.noMedia")}
			</span>
		);
	};

	// ── Render ──

	if (loading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="text-lg text-gray-500">
					{t("admin.content.detail.loading")}
				</div>
			</div>
		);
	}

	if (!content) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="text-lg text-gray-500">
					{t("admin.content.detail.notFound")}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6" dir="rtl">
			{/* Hidden File Input for Episode Video Upload */}
			<input
				ref={fileInputRef}
				type="file"
				accept="video/*"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0];
					const episodeId = e.target.dataset.episodeId;
					if (file && episodeId) {
						handleEpisodeVideoUpload(episodeId, file);
					}
				}}
			/>

			{/* Feedback Toast */}
			{feedback && (
				<div
					className={`fixed left-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
						feedback.type === "success"
							? "bg-green-500 text-white"
							: "bg-red-500 text-white"
					}`}
				>
					{feedback.message}
				</div>
			)}

			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					{content.posterUrl && (
						<img
							src={content.posterUrl}
							alt={content.title}
							className="h-20 w-14 rounded-lg object-cover shadow-md"
						/>
					)}
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							{content.title}
						</h1>
						<div className="mt-1 flex items-center gap-3">
							<span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
								<Film className="h-3 w-3" />
								{content.type === "series"
									? t("admin.content.series")
									: t("admin.content.movie")}
							</span>
							<span
								className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
									content.status === "published"
										? "bg-green-100 text-green-700"
										: content.status === "draft"
											? "bg-yellow-100 text-yellow-700"
											: "bg-gray-100 text-gray-600"
								}`}
							>
								{t(`admin.content.status.${content.status}`) || content.status}
							</span>
							{content.year && (
								<span className="text-sm text-gray-500">{content.year}</span>
							)}
							{/* Copy Content ID */}
							<button
								type="button"
								onClick={handleCopyId}
								className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 hover:bg-gray-200 transition-colors"
								title={`ID: ${id}`}
							>
								<Copy className="h-3 w-3" />
								{copiedId ? t("admin.content.detail.idCopied") : t("admin.content.detail.copyId")}
							</button>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{/* Edit Button */}
					{!editMode && (
						<Button
							variant="outline"
							onClick={openEditMode}
							className="flex items-center gap-2"
						>
							<Edit2 className="h-4 w-4" />
							{t("admin.content.detail.edit")}
						</Button>
					)}
					{/* Status Toggle */}
					{content.status === "draft" ? (
						<Button
							onClick={() => handleStatusChange("published")}
							disabled={updatingStatus}
							className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
						>
							{updatingStatus ? (
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
							) : (
								<CheckCircle className="h-4 w-4" />
							)}
							{t("admin.content.detail.publish")}
						</Button>
					) : (
						<Button
							variant="outline"
							onClick={() => handleStatusChange("draft")}
							disabled={updatingStatus}
							className="flex items-center gap-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 disabled:opacity-50"
						>
							{updatingStatus ? (
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent" />
							) : (
								<XCircle className="h-4 w-4" />
							)}
							{t("admin.content.detail.unpublish")}
						</Button>
					)}
					{/* View on site */}
					{content.status === "published" && (
						<a
							href={`/item/${content.id}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button
								variant="outline"
								className="flex items-center gap-2"
							>
								<Eye className="h-4 w-4" />
								{t("admin.content.detail.viewOnSite")}
							</Button>
						</a>
					)}
					<Button
						variant="outline"
						onClick={() => router.push("/admin/content")}
						className="flex items-center gap-2"
					>
						{t("admin.content.detail.backToList")}
						<ArrowRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Content Info Card / Edit Form */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>{editMode ? t("admin.content.detail.editContent") : t("admin.content.detail.contentInfo")}</CardTitle>
					{editMode && (
						<div className="flex gap-2">
							<Button size="sm" onClick={handleSaveEdit} disabled={savingEdit} className="flex items-center gap-1 bg-green-600 text-white hover:bg-green-700">
								{savingEdit ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
								{t("admin.form.save")}
							</Button>
							<Button size="sm" variant="outline" onClick={() => setEditMode(false)} disabled={savingEdit}>
								{t("admin.form.cancel")}
							</Button>
						</div>
					)}
				</CardHeader>
				<CardContent>
					{editMode ? (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<div className="space-y-1 sm:col-span-2">
								<Label className="text-sm">عنوان *</Label>
								<Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">عنوان اصلی</Label>
								<Input value={editForm.originalTitle} onChange={(e) => setEditForm({ ...editForm, originalTitle: e.target.value })} placeholder="Original Title" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">سال تولید</Label>
								<Input type="number" value={editForm.year} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">مدت زمان (ثانیه)</Label>
								<Input type="number" value={editForm.duration} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">امتیاز (0-10)</Label>
								<Input type="number" step="0.1" min="0" max="10" value={editForm.rating} onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })} />
							</div>
							{/* Multi-source Ratings */}
							<div className="space-y-1">
								<Label className="text-sm">🎬 IMDb Score (0-10)</Label>
								<Input type="number" step="0.1" min="0" max="10" value={editForm.ratings?.imdb?.score || ""} onChange={(e) => setEditForm({ ...editForm, ratings: { ...editForm.ratings, imdb: { ...editForm.ratings?.imdb, score: e.target.value ? parseFloat(e.target.value) : undefined } } })} placeholder="8.5" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">🎬 IMDb Votes</Label>
								<Input type="number" min="0" value={editForm.ratings?.imdb?.votes || ""} onChange={(e) => setEditForm({ ...editForm, ratings: { ...editForm.ratings, imdb: { ...editForm.ratings?.imdb, votes: e.target.value ? parseInt(e.target.value) : undefined } } })} placeholder="120000" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">🍅 Rotten Tomatoes (0-100)</Label>
								<Input type="number" min="0" max="100" value={editForm.ratings?.rottenTomatoes?.tomatometer || ""} onChange={(e) => setEditForm({ ...editForm, ratings: { ...editForm.ratings, rottenTomatoes: { ...editForm.ratings?.rottenTomatoes, tomatometer: e.target.value ? parseInt(e.target.value) : undefined } } })} placeholder="92" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">🍅 RT Audience (0-100)</Label>
								<Input type="number" min="0" max="100" value={editForm.ratings?.rottenTomatoes?.audience || ""} onChange={(e) => setEditForm({ ...editForm, ratings: { ...editForm.ratings, rottenTomatoes: { ...editForm.ratings?.rottenTomatoes, audience: e.target.value ? parseInt(e.target.value) : undefined } } })} placeholder="88" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">Ⓜ️ Metacritic (0-100)</Label>
								<Input type="number" min="0" max="100" value={editForm.ratings?.metacritic?.score || ""} onChange={(e) => setEditForm({ ...editForm, ratings: { ...editForm.ratings, metacritic: { score: e.target.value ? parseInt(e.target.value) : undefined } } })} placeholder="78" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">⭐ Fandango (0-5)</Label>
								<Input type="number" step="0.1" min="0" max="5" value={editForm.ratings?.fandango?.score || ""} onChange={(e) => setEditForm({ ...editForm, ratings: { ...editForm.ratings, fandango: { score: e.target.value ? parseFloat(e.target.value) : undefined } } })} placeholder="4.2" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">📝 Letterboxd (0-5)</Label>
								<Input type="number" step="0.1" min="0" max="5" value={editForm.ratings?.letterboxd?.score || ""} onChange={(e) => setEditForm({ ...editForm, ratings: { ...editForm.ratings, letterboxd: { score: e.target.value ? parseFloat(e.target.value) : undefined } } })} placeholder="3.8" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">📺 MyAnimeList (0-10)</Label>
								<Input type="number" step="0.1" min="0" max="10" value={editForm.ratings?.myAnimeList?.score || ""} onChange={(e) => setEditForm({ ...editForm, ratings: { ...editForm.ratings, myAnimeList: { score: e.target.value ? parseFloat(e.target.value) : undefined } } })} placeholder="8.1" />
							</div>
							<div className="space-y-1 sm:col-span-2 lg:col-span-3">
								<Label className="text-sm">توضیحات</Label>
								<textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" rows={3} />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">ژانرها (با کاما جدا)</Label>
								<Input value={editForm.genres} onChange={(e) => setEditForm({ ...editForm, genres: e.target.value })} placeholder="drama, action, comedy" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">برچسب‌ها (با کاما جدا)</Label>
								<Input value={editForm.tags} onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })} placeholder="new, popular" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">زبان‌ها (با کاما جدا)</Label>
								<Input value={editForm.languages} onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })} placeholder="fa, en" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">زبان اصلی</Label>
								<Input value={editForm.originalLanguage} onChange={(e) => setEditForm({ ...editForm, originalLanguage: e.target.value })} placeholder="fa" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">رده سنی</Label>
								<Input value={editForm.ageRating} onChange={(e) => setEditForm({ ...editForm, ageRating: e.target.value })} placeholder="PG-13" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">کارگردان</Label>
								<Input value={editForm.director} onChange={(e) => setEditForm({ ...editForm, director: e.target.value })} />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">نویسنده</Label>
								<Input value={editForm.writer} onChange={(e) => setEditForm({ ...editForm, writer: e.target.value })} />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">تهیه‌کننده</Label>
								<Input value={editForm.producer} onChange={(e) => setEditForm({ ...editForm, producer: e.target.value })} />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">شرکت تولیدکننده</Label>
								<Input value={editForm.productionCompany} onChange={(e) => setEditForm({ ...editForm, productionCompany: e.target.value })} />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">کشور</Label>
								<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
									<Input value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} placeholder="IR" style={{ flex: 1 }} />
									{editForm.country && getCountryFlag(editForm.country) && (
										<span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{getCountryFlag(editForm.country)}</span>
									)}
								</div>
							</div>
							<div className="space-y-1">
								<Label className="text-sm">لینک پوستر</Label>
								<Input value={editForm.posterUrl} onChange={(e) => setEditForm({ ...editForm, posterUrl: e.target.value })} placeholder="https://..." />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">لینک بنر</Label>
								<Input value={editForm.bannerUrl} onChange={(e) => setEditForm({ ...editForm, bannerUrl: e.target.value })} placeholder="https://..." />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">لینک پس‌زمینه</Label>
								<Input value={editForm.backdropUrl} onChange={(e) => setEditForm({ ...editForm, backdropUrl: e.target.value })} placeholder="https://..." />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">شناسه IMDb</Label>
								<Input value={editForm.imdbId} onChange={(e) => setEditForm({ ...editForm, imdbId: e.target.value })} placeholder="tt1234567" />
							</div>
							<div className="space-y-1">
								<Label className="text-sm">شناسه TMDB</Label>
								<Input value={editForm.tmdbId} onChange={(e) => setEditForm({ ...editForm, tmdbId: e.target.value })} placeholder="12345" />
							</div>
							<div className="space-y-1 sm:col-span-2 lg:col-span-3">
								<Label className="text-sm">دسته‌بندی‌ها</Label>
								<FormControl fullWidth size="small">
									<MuiSelect
										multiple
										value={editForm.categoryIds || []}
										onChange={(e) => {
											const val = e.target.value;
											setEditForm({ ...editForm, categoryIds: typeof val === "string" ? val.split(",") : val });
										}}
										input={<OutlinedInput />}
										renderValue={(selected) => (
											<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
												{(selected as string[]).map((cid: string) => {
													const cat = availableCategories.find((c: any) => c.id === cid);
													return <Chip key={cid} label={cat?.nameFa || cid} size="small" />;
												})}
											</Box>
										)}
									>
										{availableCategories.map((cat: any) => (
											<MuiMenuItem key={cat.id} value={cat.id}>
												<Checkbox checked={(editForm.categoryIds || []).includes(cat.id)} />
												<ListItemText primary={cat.nameFa} secondary={cat.nameEn} />
											</MuiMenuItem>
										))}
									</MuiSelect>
								</FormControl>
							</div>

							{/* Boolean flags */}
							<div className="space-y-1">
								<Label className="text-sm">نوع دسترسی</Label>
								<select
									value={editForm.accessType || "free"}
									onChange={(e) => setEditForm({ ...editForm, accessType: e.target.value })}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
								>
									<option value="free">رایگان (Free)</option>
									<option value="subscription">اشتراکی (Subscription)</option>
									<option value="single_purchase">خرید تکی (Single Purchase)</option>
									<option value="traffic">ترافیکی (Traffic)</option>
								</select>
							</div>
							<div className="space-y-1">
								<Label className="text-sm">اولویت نمایش</Label>
								<Input type="number" value={editForm.priority ?? 0} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })} placeholder="0" />
							</div>
							<div className="flex items-center gap-4 sm:col-span-2 lg:col-span-3">
								<label className="flex items-center gap-2 cursor-pointer">
									<input type="checkbox" checked={editForm.isKids || false} onChange={(e) => setEditForm({ ...editForm, isKids: e.target.checked })} className="rounded" />
									<span className="text-sm">کودکان (Kids)</span>
								</label>
								<label className="flex items-center gap-2 cursor-pointer">
									<input type="checkbox" checked={editForm.isDubbed || false} onChange={(e) => setEditForm({ ...editForm, isDubbed: e.target.checked })} className="rounded" />
									<span className="text-sm">دوبله شده (Dubbed)</span>
								</label>
								<label className="flex items-center gap-2 cursor-pointer">
									<input type="checkbox" checked={editForm.isComingSoon || false} onChange={(e) => setEditForm({ ...editForm, isComingSoon: e.target.checked })} className="rounded" />
									<span className="text-sm">به زودی (Coming Soon)</span>
								</label>
								<label className="flex items-center gap-2 cursor-pointer">
									<input type="checkbox" checked={editForm.featured || false} onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} className="rounded" />
									<span className="text-sm">ویژه (Featured)</span>
								</label>
							</div>

							{content.type === "series" && (
								<div className="space-y-1 sm:col-span-2 lg:col-span-3">
									<Label className="text-sm">{t("admin.content.detail.externalPlayerUrl")}</Label>
									<Input value={editForm.externalPlayerUrl} onChange={(e) => setEditForm({ ...editForm, externalPlayerUrl: e.target.value })} placeholder="https://player.example.com/..." />
								</div>
							)}

							{/* ──── Cast (بازیگران) ──── */}
							<div className="sm:col-span-2 lg:col-span-3 border-t pt-4 mt-2">
								<div className="flex items-center justify-between mb-3">
									<Label className="text-base font-bold">🎭 بازیگران (Cast)</Label>
									<button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium"
										onClick={() => setEditForm({ ...editForm, cast: [...(editForm.cast || []), { name: "", character: "", role: "Actor", imageUrl: "" }] })}>
										+ افزودن بازیگر
									</button>
								</div>
								{(editForm.cast || []).map((member: any, idx: number) => (
									<div key={idx} className="flex gap-2 items-center mb-2">
										<Input placeholder="نام" value={member.name} className="flex-1"
											onChange={(e) => { const arr = [...(editForm.cast || [])]; arr[idx] = { ...arr[idx], name: e.target.value }; setEditForm({ ...editForm, cast: arr }); }} />
										<Input placeholder="نقش (کاراکتر)" value={member.character || ""} className="flex-1"
											onChange={(e) => { const arr = [...(editForm.cast || [])]; arr[idx] = { ...arr[idx], character: e.target.value }; setEditForm({ ...editForm, cast: arr }); }} />
										<Input placeholder="URL تصویر" value={member.imageUrl || ""} className="w-48"
											onChange={(e) => { const arr = [...(editForm.cast || [])]; arr[idx] = { ...arr[idx], imageUrl: e.target.value }; setEditForm({ ...editForm, cast: arr }); }} />
										<button type="button" className="text-red-500 hover:text-red-700 px-2"
											onClick={() => { const arr = [...(editForm.cast || [])]; arr.splice(idx, 1); setEditForm({ ...editForm, cast: arr }); }}>✕</button>
									</div>
								))}
							</div>

							{/* ──── Dubbing Cast (گویندگان دوبله) ──── */}
							<div className="sm:col-span-2 lg:col-span-3 border-t pt-4 mt-2">
								<div className="flex items-center justify-between mb-3">
									<Label className="text-base font-bold">🎙️ گویندگان دوبله (Dubbing Cast)</Label>
									<button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium"
										onClick={() => setEditForm({ ...editForm, dubbingCast: [...(editForm.dubbingCast || []), { name: "", character: "", language: "فارسی", imageUrl: "" }] })}>
										+ افزودن گوینده
									</button>
								</div>
								{(editForm.dubbingCast || []).map((member: any, idx: number) => (
									<div key={idx} className="flex gap-2 items-center mb-2">
										<Input placeholder="نام گوینده" value={member.name} className="flex-1"
											onChange={(e) => { const arr = [...(editForm.dubbingCast || [])]; arr[idx] = { ...arr[idx], name: e.target.value }; setEditForm({ ...editForm, dubbingCast: arr }); }} />
										<Input placeholder="نقش (کاراکتر)" value={member.character || ""} className="flex-1"
											onChange={(e) => { const arr = [...(editForm.dubbingCast || [])]; arr[idx] = { ...arr[idx], character: e.target.value }; setEditForm({ ...editForm, dubbingCast: arr }); }} />
										<Input placeholder="زبان" value={member.language || ""} className="w-28"
											onChange={(e) => { const arr = [...(editForm.dubbingCast || [])]; arr[idx] = { ...arr[idx], language: e.target.value }; setEditForm({ ...editForm, dubbingCast: arr }); }} />
										<Input placeholder="URL تصویر" value={member.imageUrl || ""} className="w-40"
											onChange={(e) => { const arr = [...(editForm.dubbingCast || [])]; arr[idx] = { ...arr[idx], imageUrl: e.target.value }; setEditForm({ ...editForm, dubbingCast: arr }); }} />
										<button type="button" className="text-red-500 hover:text-red-700 px-2"
											onClick={() => { const arr = [...(editForm.dubbingCast || [])]; arr.splice(idx, 1); setEditForm({ ...editForm, dubbingCast: arr }); }}>✕</button>
									</div>
								))}
							</div>

							{/* ──── Production Team (عوامل سازنده) ──── */}
							<div className="sm:col-span-2 lg:col-span-3 border-t pt-4 mt-2">
								<div className="flex items-center justify-between mb-3">
									<Label className="text-base font-bold">🎬 عوامل سازنده (Production Team)</Label>
									<button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium"
										onClick={() => setEditForm({ ...editForm, productionTeam: [...(editForm.productionTeam || []), { name: "", role: "", department: "", imageUrl: "" }] })}>
										+ افزودن عضو
									</button>
								</div>
								{(editForm.productionTeam || []).map((member: any, idx: number) => (
									<div key={idx} className="flex gap-2 items-center mb-2">
										<Input placeholder="نام" value={member.name} className="flex-1"
											onChange={(e) => { const arr = [...(editForm.productionTeam || [])]; arr[idx] = { ...arr[idx], name: e.target.value }; setEditForm({ ...editForm, productionTeam: arr }); }} />
										<Input placeholder="سِمَت (مثلاً: مدیر فیلمبرداری)" value={member.role || ""} className="flex-1"
											onChange={(e) => { const arr = [...(editForm.productionTeam || [])]; arr[idx] = { ...arr[idx], role: e.target.value }; setEditForm({ ...editForm, productionTeam: arr }); }} />
										<Input placeholder="بخش" value={member.department || ""} className="w-32"
											onChange={(e) => { const arr = [...(editForm.productionTeam || [])]; arr[idx] = { ...arr[idx], department: e.target.value }; setEditForm({ ...editForm, productionTeam: arr }); }} />
										<Input placeholder="URL تصویر" value={member.imageUrl || ""} className="w-40"
											onChange={(e) => { const arr = [...(editForm.productionTeam || [])]; arr[idx] = { ...arr[idx], imageUrl: e.target.value }; setEditForm({ ...editForm, productionTeam: arr }); }} />
										<button type="button" className="text-red-500 hover:text-red-700 px-2"
											onClick={() => { const arr = [...(editForm.productionTeam || [])]; arr.splice(idx, 1); setEditForm({ ...editForm, productionTeam: arr }); }}>✕</button>
									</div>
								))}
							</div>
						</div>
					) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<div>
							<span className="text-sm font-medium text-gray-500">
								{t("admin.content.detail.type")}
							</span>
							<p className="mt-1 text-gray-900">
								{content.type === "series"
									? t("admin.content.series")
									: t("admin.content.movie")}
							</p>
						</div>
						<div>
							<span className="text-sm font-medium text-gray-500">
								{t("admin.content.detail.status")}
							</span>
							<div className="mt-1">
								<select
									key={content.status}
									value={content.status}
									onChange={(e) => {
										const val = e.target.value as "draft" | "published";
										if (val !== content.status) {
											handleStatusChange(val);
										}
									}}
									disabled={updatingStatus}
									className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
										content.status === "published"
											? "border-green-300 bg-green-50 text-green-700"
											: "border-yellow-300 bg-yellow-50 text-yellow-700"
									}`}
								>
									<option value="draft">{t("admin.content.status.draft")}</option>
									<option value="published">{t("admin.content.status.published")}</option>
								</select>
							</div>
						</div>
						{content.year && (
							<div>
								<span className="text-sm font-medium text-gray-500">
									{t("admin.content.detail.year")}
								</span>
								<p className="mt-1 text-gray-900">{content.year}</p>
							</div>
						)}
						{content.rating != null && content.rating > 0 && (
							<div>
								<span className="text-sm font-medium text-gray-500">امتیاز</span>
								<p className="mt-1 text-gray-900">⭐ {content.rating}/10</p>
							</div>
						)}
						{content.ratings && Object.keys(content.ratings).length > 0 && (
							<div className="sm:col-span-2 lg:col-span-3">
								<span className="text-sm font-medium text-gray-500">امتیازات سایت‌ها</span>
								<div className="mt-1 flex flex-wrap gap-3">
									{content.ratings.imdb?.score != null && (
										<span className="inline-flex items-center gap-1 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-1 text-sm font-medium text-yellow-800">
											🎬 IMDb: {content.ratings.imdb.score}/10
											{content.ratings.imdb.votes ? ` (${content.ratings.imdb.votes.toLocaleString()} votes)` : ''}
										</span>
									)}
									{content.ratings.rottenTomatoes?.tomatometer != null && (
										<span className="inline-flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-3 py-1 text-sm font-medium text-red-800">
											🍅 RT: {content.ratings.rottenTomatoes.tomatometer}%
											{content.ratings.rottenTomatoes.audience ? ` | Audience: ${content.ratings.rottenTomatoes.audience}%` : ''}
										</span>
									)}
									{content.ratings.metacritic?.score != null && (
										<span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-sm font-medium text-blue-800">
											Ⓜ️ Metacritic: {content.ratings.metacritic.score}/100
										</span>
									)}
									{content.ratings.fandango?.score != null && (
										<span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 border border-purple-200 px-3 py-1 text-sm font-medium text-purple-800">
											⭐ Fandango: {content.ratings.fandango.score}/5
										</span>
									)}
									{content.ratings.letterboxd?.score != null && (
										<span className="inline-flex items-center gap-1 rounded-lg bg-green-50 border border-green-200 px-3 py-1 text-sm font-medium text-green-800">
											📝 Letterboxd: {content.ratings.letterboxd.score}/5
										</span>
									)}
									{content.ratings.myAnimeList?.score != null && (
										<span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1 text-sm font-medium text-indigo-800">
											📺 MAL: {content.ratings.myAnimeList.score}/10
										</span>
									)}
								</div>
							</div>
						)}
						{content.duration && (
							<div>
								<span className="text-sm font-medium text-gray-500">مدت زمان</span>
								<p className="mt-1 text-gray-900">{Math.floor(content.duration / 60)} دقیقه</p>
							</div>
						)}
						{content.genres && content.genres.length > 0 && (
							<div>
								<span className="text-sm font-medium text-gray-500">ژانرها</span>
								<div className="mt-1 flex flex-wrap gap-1">
									{content.genres.map((g: string) => (
										<span key={g} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">{g}</span>
									))}
								</div>
							</div>
						)}
						{content.director && (
							<div>
								<span className="text-sm font-medium text-gray-500">کارگردان</span>
								<p className="mt-1 text-gray-900">{content.director}</p>
							</div>
						)}
						{content.country && (
							<div>
								<span className="text-sm font-medium text-gray-500">کشور</span>
								<p className="mt-1 text-gray-900" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
									{getCountryFlag(content.country) && (
										<span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{getCountryFlag(content.country)}</span>
									)}
									{content.country}
								</p>
							</div>
						)}
						{content.originalLanguage && (
							<div>
								<span className="text-sm font-medium text-gray-500">زبان اصلی</span>
								<p className="mt-1 text-gray-900">{content.originalLanguage}</p>
							</div>
						)}
						{content.imdbId && (
							<div>
								<span className="text-sm font-medium text-gray-500">IMDb</span>
								<a href={`https://www.imdb.com/title/${content.imdbId}`} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:underline">
									<ExternalLink className="h-3 w-3" />
									{content.imdbId}
								</a>
							</div>
						)}
						{/* Show external URL info inline only for series; for movies it's in the Media Source Card */}
						{content.type === "series" && (
							<div className="sm:col-span-2 lg:col-span-3">
								<span className="text-sm font-medium text-gray-500">
									{t("admin.content.detail.externalPlayerUrl")}
								</span>
								{content.externalPlayerUrl ? (
									<a
										href={content.externalPlayerUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:underline"
									>
										<ExternalLink className="h-3 w-3" />
										{content.externalPlayerUrl}
									</a>
								) : (
									<p className="mt-1 text-sm text-gray-400">
										{t("admin.content.detail.notSet")}
									</p>
								)}
							</div>
						)}
						{content.description && (
							<div className="sm:col-span-2 lg:col-span-3">
								<span className="text-sm font-medium text-gray-500">
									{t("admin.content.detail.description")}
								</span>
								<p className="mt-1 text-sm leading-relaxed text-gray-700">
									{content.description}
								</p>
							</div>
						)}
					</div>
					)}
				</CardContent>
			</Card>

			{/* ── Media Source Card (for movies) ── */}
			{content.type === "movie" && (
				<Card>
					<CardHeader className="flex flex-row items-center justify-between border-b pb-4">
						<CardTitle className="flex items-center gap-2">
							<Video className="h-5 w-5 text-purple-500" />
							منبع پخش ویدیو
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-4">
						{/* Show current media state */}
						{content.externalPlayerUrl && !editingExternalUrl && (
							<div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Globe className="h-5 w-5 text-blue-600" />
										<span className="text-sm font-semibold text-blue-700">
											پخش‌کننده خارجی
										</span>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												setExternalUrlInput(content.externalPlayerUrl || "");
												setEditingExternalUrl(true);
											}}
											className="text-xs"
										>
											<Edit2 className="ml-1 h-3 w-3" />
											ویرایش
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={handleRemoveExternalUrl}
											className="text-xs"
										>
											<Trash2 className="ml-1 h-3 w-3" />
											حذف
										</Button>
									</div>
								</div>
								<a
									href={content.externalPlayerUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:underline"
								>
									<ExternalLink className="h-3 w-3" />
									{content.externalPlayerUrl}
								</a>
							</div>
						)}

						{/* Show uploaded video assets */}
						{content.videoAssets && content.videoAssets.length > 0 && !content.externalPlayerUrl && (
							<div className="rounded-lg border border-green-200 bg-green-50/50 p-4">
								<div className="flex items-center gap-2 mb-3">
									<Video className="h-5 w-5 text-green-600" />
									<span className="text-sm font-semibold text-green-700">
										ویدیوهای آپلود شده
									</span>
								</div>
								<div className="space-y-2">
									{content.videoAssets.map((asset: any) => (
										<div
											key={asset.id}
											className="flex items-center justify-between rounded-md border border-green-200 bg-white px-3 py-2"
										>
											<div className="flex items-center gap-3">
												<span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
													{asset.quality}
												</span>
												<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
													asset.status === "ready"
														? "bg-green-100 text-green-700"
														: asset.status === "processing"
															? "bg-yellow-100 text-yellow-700"
															: asset.status === "error"
																? "bg-red-100 text-red-700"
																: "bg-gray-100 text-gray-600"
												}`}>
													{asset.status === "ready" ? t("admin.content.detail.videoStatusReady") :
													 asset.status === "processing" ? t("admin.content.detail.videoStatusProcessing") :
													 asset.status === "error" ? t("admin.content.detail.videoStatusError") :
													 asset.status === "uploaded" ? t("admin.content.detail.videoStatusUploaded") : asset.status}
												</span>
												{asset.hlsUrl && (
													<span className="text-xs text-gray-500 truncate max-w-[300px]">
														{asset.hlsUrl}
													</span>
												)}
											</div>
											<div className="flex items-center gap-2">
												{asset.filesize && (
													<span className="text-xs text-gray-400">
														{(asset.filesize / 1024 / 1024).toFixed(1)} MB
													</span>
												)}
												{asset.status !== "ready" && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleMarkAssetReady(asset)}
														className="text-xs border-green-300 text-green-700 hover:bg-green-50"
													>
														<CheckCircle className="ml-1 h-3 w-3" />
														آماده‌سازی
													</Button>
												)}
											</div>
										</div>
									))}
								</div>
								{/* Upload another quality */}
								<div className="mt-3">
									<input
										ref={movieFileInputRef}
										type="file"
										accept="video/*"
										className="hidden"
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) handleMovieVideoUpload(file);
										}}
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={() => movieFileInputRef.current?.click()}
										disabled={uploadingMovie}
										className="flex items-center gap-2"
									>
										{uploadingMovie ? (
											<>
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
												{uploadProgress}
											</>
										) : (
											<>
												<Upload className="h-4 w-4" />
												آپلود کیفیت دیگر
											</>
										)}
									</Button>
								</div>
							</div>
						)}

						{/* Editing external URL form */}
						{editingExternalUrl && (
							<div className="rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/50 p-4">
								<Label className="mb-2 block text-sm font-semibold text-blue-700">
									لینک پخش‌کننده خارجی
								</Label>
								<div className="flex gap-2">
									<Input
										placeholder="https://player.example.com/..."
										value={externalUrlInput}
										onChange={(e) => setExternalUrlInput(e.target.value)}
										className="flex-1"
									/>
									<Button
										size="sm"
										onClick={handleSaveExternalUrl}
										className="bg-blue-600 text-white hover:bg-blue-700"
									>
										ذخیره
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setEditingExternalUrl(false)}
									>
										انصراف
									</Button>
								</div>
							</div>
						)}

						{/* No media source set — show options */}
						{!content.externalPlayerUrl && (!content.videoAssets || content.videoAssets.length === 0) && !editingExternalUrl && (
							<div className="space-y-4">
								<p className="text-sm text-gray-500">
									هیچ منبع پخشی تنظیم نشده. یکی از روش‌های زیر را انتخاب کنید:
								</p>
								<div className="grid gap-4 sm:grid-cols-2">
									{/* Option A: External URL */}
									<button
										type="button"
										onClick={() => {
											setExternalUrlInput("");
											setEditingExternalUrl(true);
										}}
										className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/30 p-6 transition-all hover:border-blue-500 hover:bg-blue-50"
									>
										<Globe className="h-8 w-8 text-blue-500" />
										<span className="text-sm font-semibold text-blue-700">
											پخش‌کننده خارجی
										</span>
										<span className="text-xs text-gray-500 text-center">
											لینک پخش از سایت دیگر
										</span>
									</button>

									{/* Option B: Upload Video */}
									<div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/30 p-6 transition-all hover:border-purple-500 hover:bg-purple-50">
										<input
											ref={movieFileInputRef}
											type="file"
											accept="video/*"
											className="hidden"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) handleMovieVideoUpload(file);
											}}
										/>
										{uploadingMovie ? (
											<>
												<div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-500 border-t-transparent" />
												<span className="text-sm font-semibold text-purple-700">
													{uploadProgress}
												</span>
											</>
										) : (
											<button
												type="button"
												onClick={() => movieFileInputRef.current?.click()}
												className="flex flex-col items-center gap-3"
											>
												<Upload className="h-8 w-8 text-purple-500" />
												<span className="text-sm font-semibold text-purple-700">
													آپلود ویدیو
												</span>
												<span className="text-xs text-gray-500 text-center">
													آپلود فایل ویدیویی از سیستم شما
												</span>
											</button>
										)}
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* ── Series Management ── */}
			{content.type === "series" && (
				<>
					{/* Seasons Header + Tabs */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between border-b pb-4">
							<CardTitle className="flex items-center gap-2">
								<Monitor className="h-5 w-5 text-indigo-500" />
								{t("admin.content.seasons.title")}
							</CardTitle>
							<div className="flex items-center gap-2">
								{content.tmdbId && (
									<Button
										size="sm"
										variant="outline"
										onClick={handleFetchTmdbSeasons}
										disabled={loadingTmdbSeasons}
										className="flex items-center gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
									>
										{loadingTmdbSeasons ? (
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
										) : (
											<Film className="h-4 w-4" />
										)}
										دریافت از TMDB
									</Button>
								)}
								<Button
									size="sm"
									onClick={() => openSeasonForm()}
									className="flex items-center gap-1"
								>
									<Plus className="h-4 w-4" />
									{t("admin.content.seasons.addSeason")}
								</Button>
							</div>
						</CardHeader>

						<CardContent className="pt-4">
							{/* TMDB Seasons Import Panel */}
							{showTmdbSeasons && tmdbSeasons.length > 0 && (
								<div className="mb-6 rounded-lg border-2 border-amber-200 bg-amber-50/50 p-4">
									<div className="mb-3 flex items-center justify-between">
										<h3 className="text-sm font-semibold text-amber-800">
											فصل‌های TMDB ({tmdbSeasons.length} فصل)
										</h3>
										<button
											type="button"
											onClick={() => {
												setShowTmdbSeasons(false);
												setTmdbSeasons([]);
											}}
											className="text-gray-400 hover:text-gray-600"
										>
											<X className="h-4 w-4" />
										</button>
									</div>
									<div className="mb-3 max-h-60 space-y-2 overflow-y-auto">
										{tmdbSeasons.map((ts) => {
											const existsLocally = seasons.find(
												(s) => s.number === ts.seasonNumber,
											);
											return (
												<div
													key={ts.seasonNumber}
													className={`flex items-center gap-3 rounded-lg border p-3 ${
														existsLocally
															? "border-green-200 bg-green-50/50"
															: "border-gray-200 bg-white"
													}`}
												>
													{ts.posterUrl && (
														<img
															src={ts.posterUrl}
															alt={ts.name}
															className="h-12 w-9 rounded object-cover"
														/>
													)}
													<div className="min-w-0 flex-1">
														<div className="flex items-center gap-2">
															<span className="text-sm font-medium">
																فصل {ts.seasonNumber}
															</span>
															{ts.name && (
																<span className="text-xs text-gray-500">
																	- {ts.name}
																</span>
															)}
														</div>
														<span className="text-xs text-gray-500">
															{ts.episodeCount} قسمت
															{ts.airDate && ` · ${ts.airDate.slice(0, 4)}`}
														</span>
													</div>
													{existsLocally && (
														<span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
															موجود
														</span>
													)}
												</div>
											);
										})}
									</div>
									<div className="flex gap-2">
										<Button
											size="sm"
											onClick={handleImportTmdbSeasons}
											disabled={importingSeasons}
											className="bg-amber-600 text-white hover:bg-amber-700"
										>
											{importingSeasons ? (
												<div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
											) : null}
											وارد کردن فصل‌های جدید
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => {
												setShowTmdbSeasons(false);
												setTmdbSeasons([]);
											}}
										>
											انصراف
										</Button>
									</div>
								</div>
							)}

							{/* Season Form (inline) */}
							{showSeasonForm && (
								<form
									onSubmit={handleSeasonSubmit}
									className="mb-6 rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-4"
								>
									<h3 className="mb-3 text-sm font-semibold text-indigo-700">
										{editingSeasonId
											? t("admin.content.seasons.editSeason")
											: t("admin.content.seasons.addSeason")}
									</h3>
									<div className="grid gap-3 sm:grid-cols-2">
										<div className="space-y-1">
											<Label className="text-sm">
												{t("admin.content.seasons.seasonNumber")} *
											</Label>
											<Input
												type="number"
												min={1}
												value={seasonForm.number}
												onChange={(e) =>
													setSeasonForm({
														...seasonForm,
														number: e.target.value,
													})
												}
												required
											/>
										</div>
										<div className="space-y-1">
											<Label className="text-sm">
												{t("admin.content.seasons.seasonTitle")}
											</Label>
											<Input
												placeholder={t(
													"admin.content.seasons.seasonTitlePlaceholder",
												)}
												value={seasonForm.title}
												onChange={(e) =>
													setSeasonForm({
														...seasonForm,
														title: e.target.value,
													})
												}
											/>
										</div>
									</div>
									<div className="mt-3 flex gap-2">
										<Button type="submit" size="sm">
											{editingSeasonId
												? t("admin.form.update")
												: t("admin.form.submit")}
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => {
												setShowSeasonForm(false);
												setEditingSeasonId(null);
											}}
										>
											{t("admin.form.cancel")}
										</Button>
									</div>
								</form>
							)}

							{/* Season Tabs */}
							{seasons.length === 0 ? (
								<div className="py-8 text-center text-gray-500">
									{t("admin.content.seasons.noSeasons")}
								</div>
							) : (
								<div className="flex flex-wrap gap-2">
									{seasons.map((season) => (
										<div key={season.id} className="group relative">
											<button
												type="button"
												onClick={() => setActiveSeasonId(season.id)}
												className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
													activeSeasonId === season.id
														? "border-indigo-500 bg-indigo-500 text-white shadow-md"
														: "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
												}`}
											>
												<span>
													{t("admin.content.episodes.season")}{" "}
													{season.number}
												</span>
												{season.title && (
													<span className="mr-1 text-xs opacity-75">
														{" "}
														- {season.title}
													</span>
												)}
												<span
													className={`mr-2 rounded-full px-1.5 text-xs ${
														activeSeasonId === season.id
															? "bg-indigo-400/50"
															: "bg-gray-100"
													}`}
												>
													{season.episodes?.length || 0}
												</span>
											</button>
											{/* Season actions on hover */}
											<div className="absolute -left-1 -top-1 hidden gap-0.5 group-hover:flex">
												<button
													type="button"
													onClick={() => openSeasonForm(season)}
													className="rounded-full bg-blue-500 p-1 text-white shadow-sm hover:bg-blue-600"
													title={t("admin.content.seasons.editSeason")}
												>
													<Edit2 className="h-2.5 w-2.5" />
												</button>
												<button
													type="button"
													onClick={() => handleDeleteSeason(season.id)}
													className="rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600"
													title={t("admin.form.delete")}
												>
													<Trash2 className="h-2.5 w-2.5" />
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Episodes for Active Season */}
					{activeSeason && (
						<Card>
							<CardHeader className="flex flex-row items-center justify-between border-b pb-4">
								<CardTitle className="flex items-center gap-2">
									<Video className="h-5 w-5 text-purple-500" />
									{t("admin.content.episodes.title")} —{" "}
									{t("admin.content.episodes.season")} {activeSeason.number}
									{activeSeason.title && ` (${activeSeason.title})`}
								</CardTitle>
								<div className="flex items-center gap-2">
									{content.tmdbId && (
										<Button
											size="sm"
											variant="outline"
											onClick={handleFetchTmdbEpisodes}
											disabled={loadingTmdbEpisodes}
											className="flex items-center gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
										>
											{loadingTmdbEpisodes ? (
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
											) : (
												<Film className="h-4 w-4" />
											)}
											دریافت قسمت‌ها از TMDB
										</Button>
									)}
									<Button
										size="sm"
										onClick={() => openEpisodeForm(activeSeason.id)}
										className="flex items-center gap-1"
									>
										<Plus className="h-4 w-4" />
										{t("admin.content.episodes.addEpisode")}
									</Button>
								</div>
							</CardHeader>

							<CardContent className="pt-4">
								{/* TMDB Episodes Import Panel */}
								{showTmdbEpisodes && tmdbEpisodes.length > 0 && (
									<div className="mb-6 rounded-lg border-2 border-amber-200 bg-amber-50/50 p-4">
										<div className="mb-3 flex items-center justify-between">
											<h3 className="text-sm font-semibold text-amber-800">
												قسمت‌های TMDB — فصل {activeSeason.number} ({tmdbEpisodes.length} قسمت)
											</h3>
											<button
												type="button"
												onClick={() => {
													setShowTmdbEpisodes(false);
													setTmdbEpisodes([]);
												}}
												className="text-gray-400 hover:text-gray-600"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
										<div className="mb-3 max-h-72 space-y-2 overflow-y-auto">
											{tmdbEpisodes.map((ep) => {
												const existsLocally = activeEpisodes.find(
													(e: any) => e.number === ep.episodeNumber,
												);
												return (
													<div
														key={ep.episodeNumber}
														className={`flex items-center gap-3 rounded-lg border p-3 ${
															existsLocally
																? "border-green-200 bg-green-50/50"
																: "border-gray-200 bg-white"
														}`}
													>
														{ep.stillUrl && (
															<img
																src={ep.stillUrl}
																alt={ep.name}
																className="h-12 w-20 rounded object-cover"
															/>
														)}
														<div className="min-w-0 flex-1">
															<div className="flex items-center gap-2">
																<span className="text-xs font-medium text-purple-600">
																	E{ep.episodeNumber}
																</span>
																<span className="text-sm font-medium">
																	{ep.name}
																</span>
															</div>
															<p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
																{ep.overview}
															</p>
															<div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
																{ep.runtime && (
																	<span>{ep.runtime} دقیقه</span>
																)}
																{ep.airDate && (
																	<span>{ep.airDate}</span>
																)}
															</div>
														</div>
														{existsLocally && (
															<span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
																موجود
															</span>
														)}
													</div>
												);
											})}
										</div>
										<div className="flex gap-2">
											<Button
												size="sm"
												onClick={handleImportTmdbEpisodes}
												disabled={importingEpisodes}
												className="bg-amber-600 text-white hover:bg-amber-700"
											>
												{importingEpisodes ? (
													<div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
												) : null}
												وارد کردن قسمت‌های جدید
											</Button>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => {
													setShowTmdbEpisodes(false);
													setTmdbEpisodes([]);
												}}
											>
												انصراف
											</Button>
										</div>
									</div>
								)}

								{/* Episode Form */}
								{showEpisodeForm && (
									<form
										onSubmit={handleEpisodeSubmit}
										className="mb-6 rounded-lg border-2 border-dashed border-purple-200 bg-purple-50/50 p-4"
									>
										<div className="mb-4 flex items-center justify-between">
											<h3 className="text-sm font-semibold text-purple-700">
												{editingEpisodeId
													? t("admin.content.episodes.editEpisode")
													: t("admin.content.episodes.addEpisode")}
											</h3>
											<button
												type="button"
												onClick={() => {
													setShowEpisodeForm(false);
													setEditingEpisodeId(null);
													setEpisodeForm(defaultEpisodeForm);
												}}
												className="text-gray-400 hover:text-gray-600"
											>
												<X className="h-4 w-4" />
											</button>
										</div>

										{/* Basic Info */}
										<div className="grid gap-3 sm:grid-cols-3">
											<div className="space-y-1 sm:col-span-2">
												<Label className="text-sm">
													{t("admin.content.episodes.episodeTitle")} *
												</Label>
												<Input
													value={episodeForm.title}
													onChange={(e) =>
														setEpisodeForm({
															...episodeForm,
															title: e.target.value,
														})
													}
													required
												/>
											</div>
											<div className="space-y-1">
												<Label className="text-sm">
													{t("admin.content.episodes.episodeNumber")} *
												</Label>
												<Input
													type="number"
													min={1}
													value={episodeForm.number}
													onChange={(e) =>
														setEpisodeForm({
															...episodeForm,
															number: e.target.value,
														})
													}
													required
												/>
											</div>
										</div>

										<div className="mt-3 space-y-1">
											<Label className="text-sm">
												{t("admin.content.episodes.description")}
											</Label>
											<textarea
												value={episodeForm.description}
												onChange={(e) =>
													setEpisodeForm({
														...episodeForm,
														description: e.target.value,
													})
												}
												className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
												rows={2}
											/>
										</div>

										<div className="mt-3 grid gap-3 sm:grid-cols-2">
											<div className="space-y-1">
												<Label className="text-sm">
													{t("admin.content.episodes.duration")}
												</Label>
												<Input
													type="number"
													min={0}
													placeholder="3600"
													value={episodeForm.duration}
													onChange={(e) =>
														setEpisodeForm({
															...episodeForm,
															duration: e.target.value,
														})
													}
												/>
											</div>
											<div className="space-y-1">
												<Label className="text-sm">
													{t("admin.content.episodes.thumbnailUrl")}
												</Label>
												<Input
													placeholder="https://..."
													value={episodeForm.thumbnailUrl}
													onChange={(e) =>
														setEpisodeForm({
															...episodeForm,
															thumbnailUrl: e.target.value,
														})
													}
												/>
											</div>
										</div>

										{/* Media Type Selection */}
										<div className="mt-4 border-t border-purple-200 pt-4">
											<Label className="mb-2 block text-sm font-semibold text-purple-700">
												{t("admin.content.episodes.mediaType")}
											</Label>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => setEpisodeMediaType("external")}
													className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
														episodeMediaType === "external"
															? "border-blue-500 bg-blue-50 text-blue-700"
															: "border-gray-200 text-gray-600 hover:border-blue-300"
													}`}
												>
													<Globe className="h-4 w-4" />
													{t("admin.content.episodes.externalPlayer")}
												</button>
												<button
													type="button"
													onClick={() => setEpisodeMediaType("internal")}
													className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
														episodeMediaType === "internal"
															? "border-purple-500 bg-purple-50 text-purple-700"
															: "border-gray-200 text-gray-600 hover:border-purple-300"
													}`}
												>
													<Video className="h-4 w-4" />
													{t("admin.content.episodes.internalVideo")}
												</button>
												<button
													type="button"
													onClick={() => setEpisodeMediaType("none")}
													className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
														episodeMediaType === "none"
															? "border-gray-500 bg-gray-50 text-gray-700"
															: "border-gray-200 text-gray-600 hover:border-gray-300"
													}`}
												>
													{t("admin.content.episodes.noMedia")}
												</button>
											</div>

											{episodeMediaType === "external" && (
												<div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3">
													<Label className="text-sm">
														{t("admin.content.episodes.externalPlayerUrl")}
													</Label>
													<Input
														className="mt-1"
														placeholder={t(
															"admin.content.episodes.externalPlayerUrlPlaceholder",
														)}
														value={episodeForm.externalPlayerUrl}
														onChange={(e) =>
															setEpisodeForm({
																...episodeForm,
																externalPlayerUrl: e.target.value,
															})
														}
													/>
												</div>
											)}

											{episodeMediaType === "internal" && (
												<div className="mt-3 rounded-lg border border-purple-200 bg-purple-50/50 p-3">
													<Label className="text-sm">
														{t("admin.content.episodes.videoAssetId")}
													</Label>
													<Input
														className="mt-1"
														placeholder={t(
															"admin.content.episodes.videoAssetIdPlaceholder",
														)}
														value={episodeForm.videoAssetId}
														onChange={(e) =>
															setEpisodeForm({
																...episodeForm,
																videoAssetId: e.target.value,
															})
														}
													/>
												</div>
											)}
										</div>

										<div className="mt-4 flex gap-2">
											<Button type="submit" size="sm">
												{editingEpisodeId
													? t("admin.form.update")
													: t("admin.form.submit")}
											</Button>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => {
													setShowEpisodeForm(false);
													setEditingEpisodeId(null);
													setEpisodeForm(defaultEpisodeForm);
												}}
											>
												{t("admin.form.cancel")}
											</Button>
										</div>
									</form>
								)}

								{/* Episodes List */}
								{activeEpisodes.length === 0 ? (
									<div className="py-8 text-center text-gray-500">
										{t("admin.content.episodes.noEpisodes")}
									</div>
								) : (
									<div className="space-y-2">
										{activeEpisodes.map((episode: any) => (
											<div
												key={episode.id}
												className="group flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/30"
											>
												{/* Episode Thumbnail / Number */}
												<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-100 to-purple-100 text-lg font-bold text-indigo-600">
													{episode.thumbnailUrl ? (
														<img
															src={episode.thumbnailUrl}
															alt={episode.title}
															className="h-full w-full rounded-lg object-cover"
														/>
													) : (
														<span>E{episode.number}</span>
													)}
												</div>

												{/* Episode Info */}
												<div className="min-w-0 flex-1">
													<div className="flex items-center gap-2">
														<span className="text-xs font-medium text-indigo-500">
															{t("admin.content.episode")} {episode.number}
														</span>
														{getMediaBadge(episode)}
														{episode.duration && (
															<span className="text-xs text-gray-500">
																{formatDuration(episode.duration)}
															</span>
														)}
													</div>
													<h4 className="mt-0.5 font-semibold text-gray-900">
														{episode.title}
													</h4>
													{episode.description && (
														<p className="mt-0.5 line-clamp-1 text-sm text-gray-500">
															{episode.description}
														</p>
													)}
													{episode.externalPlayerUrl && (
														<a
															href={episode.externalPlayerUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
														>
															<ExternalLink className="h-3 w-3" />
															{episode.externalPlayerUrl.length > 50
																? `${episode.externalPlayerUrl.substring(0, 50)}...`
																: episode.externalPlayerUrl}
														</a>
													)}
												</div>

												{/* Episode Actions */}
												<div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
													<button
														type="button"
														onClick={() => triggerEpisodeUpload(episode.id)}
														disabled={uploadingEpisodeId === episode.id}
														className="rounded-lg p-2 text-gray-400 hover:bg-green-100 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-50"
														title={t("admin.content.episodes.uploadVideo")}
													>
														{uploadingEpisodeId === episode.id ? (
															<div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
														) : (
															<Upload className="h-4 w-4" />
														)}
													</button>
													<button
														type="button"
														onClick={() =>
															openEpisodeForm(activeSeason.id, episode)
														}
														className="rounded-lg p-2 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
														title={t("admin.content.episodes.editEpisode")}
													>
														<Edit2 className="h-4 w-4" />
													</button>
													<button
														type="button"
														onClick={() => handleDeleteEpisode(episode.id)}
														className="rounded-lg p-2 text-gray-400 hover:bg-red-100 hover:text-red-600"
														title={t("admin.form.delete")}
													>
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</>
			)}

			{/* Confirmation Dialog */}
			<Dialog
				open={confirmDialog.open}
				onClose={() => handleConfirmClose(false)}
				dir="rtl"
			>
				<DialogTitle>{confirmDialog.title}</DialogTitle>
				<DialogContent>
					<DialogContentText>{confirmDialog.message}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<MuiButton onClick={() => handleConfirmClose(false)} color="inherit">
						{t("admin.form.cancel")}
					</MuiButton>
					<MuiButton
						onClick={() => handleConfirmClose(true)}
						color="error"
						variant="contained"
					>
						{t("admin.form.delete")}
					</MuiButton>
				</DialogActions>
			</Dialog>

			{/* Toast Notification */}
			<Snackbar
				open={!!feedback}
				autoHideDuration={3000}
				onClose={() => setFeedback(null)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setFeedback(null)}
					severity={feedback?.type === "success" ? "success" : "error"}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{feedback?.message}
				</Alert>
			</Snackbar>
		</div>
	);
}
