"use client";

import { useState, useCallback } from "react";
import { Search, Download, Eye, Film, Tv } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import {
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Chip,
	CircularProgress,
	Alert,
	ToggleButton,
	ToggleButtonGroup,
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { uperaApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

const GENRE_OPTIONS = [
	"all", "action", "adventure", "animation", "biography", "comedy",
	"crime", "documentary", "drama", "family", "fantasy", "history",
	"horror", "music", "mystery", "romance", "sci-fi", "sport",
	"thriller", "war", "iranian", "foreign",
];

const TRENDING_OPTIONS = [
	{ value: 1, labelKey: "admin.upera.browse.trendingOptions.lastUpdated" },
	{ value: 6, labelKey: "admin.upera.browse.trendingOptions.lastCreated" },
	{ value: 2, labelKey: "admin.upera.browse.trendingOptions.productYear" },
	{ value: 3, labelKey: "admin.upera.browse.trendingOptions.imdbRate" },
	{ value: 4, labelKey: "admin.upera.browse.trendingOptions.likes" },
];

export function UperaBrowseTab() {
	const { t } = useTranslation();
	const [contentType, setContentType] = useState<"movie" | "series">("movie");
	const [trending, setTrending] = useState(1);
	const [genre, setGenre] = useState("all");
	const [free, setFree] = useState(1);
	const [country, setCountry] = useState(0);
	const [persian, setPersian] = useState(0);
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [results, setResults] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [episodesDialog, setEpisodesDialog] = useState<{
		open: boolean;
		data: any;
		title: string;
	}>({ open: false, data: null, title: "" });
	const [affiliateDialog, setAffiliateDialog] = useState<{
		open: boolean;
		data: any;
	}>({ open: false, data: null });

	const fetchContent = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {
				trending,
				genre,
				free,
				country,
				persian,
				query: query || undefined,
				page,
			};

			let data: any;
			if (contentType === "movie") {
				data = await uperaApi.browseMovies(params);
			} else {
				data = await uperaApi.browseSeries(params);
			}

			// Handle various response structures from Upera
			const items = data?.data || data?.items || data?.results || (Array.isArray(data) ? data : []);
			setResults(items);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message || t("admin.messages.error"));
			setResults([]);
		} finally {
			setLoading(false);
		}
	}, [contentType, trending, genre, free, country, persian, query, page, t]);

	const saveAllToLocal = useCallback(async () => {
		if (results.length === 0) return;
		setSaving(true);
		setError(null);
		try {
			if (contentType === "movie") {
				await uperaApi.saveMoviesToLocal(results);
			} else {
				await uperaApi.saveSeriesToLocal(results);
			}
			setSuccess(t("admin.upera.browse.savedSuccess"));
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setSaving(false);
		}
	}, [results, contentType, t]);

	const saveSingleToLocal = useCallback(async (item: any) => {
		setSaving(true);
		try {
			if (contentType === "movie") {
				await uperaApi.saveMoviesToLocal([item]);
			} else {
				await uperaApi.saveSeriesToLocal([item]);
			}
			setSuccess(t("admin.upera.browse.savedSuccess"));
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setSaving(false);
		}
	}, [contentType, t]);

	const viewEpisodes = useCallback(async (seriesId: string, title: string) => {
		try {
			const data = await uperaApi.getSeriesEpisodes(seriesId);
			setEpisodesDialog({ open: true, data, title });
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		}
	}, []);

	const viewAffiliateLinks = useCallback(async (id: string, type: string) => {
		try {
			const data = await uperaApi.getAffiliateLinks({ id, type });
			setAffiliateDialog({ open: true, data });
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		}
	}, []);

	return (
		<div className="space-y-6">
			{/* Content Type Toggle */}
			<div className="flex items-center gap-4">
				<ToggleButtonGroup
					value={contentType}
					exclusive
					onChange={(_, val) => val && setContentType(val)}
					size="small"
				>
					<ToggleButton value="movie">
						<Film className="h-4 w-4 ml-1" />
						{t("admin.upera.browse.movies")}
					</ToggleButton>
					<ToggleButton value="series">
						<Tv className="h-4 w-4 ml-1" />
						{t("admin.upera.browse.series")}
					</ToggleButton>
				</ToggleButtonGroup>
			</div>

			{/* Filters */}
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
				<TextField
					size="small"
					label={t("admin.upera.browse.searchPlaceholder")}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					fullWidth
				/>

				<FormControl size="small" fullWidth>
					<InputLabel>{t("admin.upera.browse.trending")}</InputLabel>
					<Select
						value={trending}
						label={t("admin.upera.browse.trending")}
						onChange={(e) => setTrending(Number(e.target.value))}
					>
						{TRENDING_OPTIONS.map((opt) => (
							<MenuItem key={opt.value} value={opt.value}>
								{t(opt.labelKey)}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl size="small" fullWidth>
					<InputLabel>{t("admin.upera.browse.genre")}</InputLabel>
					<Select
						value={genre}
						label={t("admin.upera.browse.genre")}
						onChange={(e) => setGenre(e.target.value)}
					>
						{GENRE_OPTIONS.map((g) => (
							<MenuItem key={g} value={g}>
								{g === "all" ? t("admin.upera.browse.genreAll") : g}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl size="small" fullWidth>
					<InputLabel>{t("admin.upera.browse.freeFilter")}</InputLabel>
					<Select
						value={free}
						label={t("admin.upera.browse.freeFilter")}
						onChange={(e) => setFree(Number(e.target.value))}
					>
						<MenuItem value={0}>{t("admin.upera.browse.freeOptions.all")}</MenuItem>
						<MenuItem value={1}>{t("admin.upera.browse.freeOptions.free")}</MenuItem>
						<MenuItem value={2}>{t("admin.upera.browse.freeOptions.nonFree")}</MenuItem>
					</Select>
				</FormControl>

				<FormControl size="small" fullWidth>
					<InputLabel>{t("admin.upera.browse.country")}</InputLabel>
					<Select
						value={country}
						label={t("admin.upera.browse.country")}
						onChange={(e) => setCountry(Number(e.target.value))}
					>
						<MenuItem value={0}>{t("admin.upera.browse.countryOptions.all")}</MenuItem>
						<MenuItem value={2}>{t("admin.upera.browse.countryOptions.iran")}</MenuItem>
						<MenuItem value={3}>{t("admin.upera.browse.countryOptions.nonIran")}</MenuItem>
					</Select>
				</FormControl>

				<FormControl size="small" fullWidth>
					<InputLabel>{t("admin.upera.browse.persian")}</InputLabel>
					<Select
						value={persian}
						label={t("admin.upera.browse.persian")}
						onChange={(e) => setPersian(Number(e.target.value))}
					>
						<MenuItem value={0}>{t("admin.upera.browse.persianOptions.all")}</MenuItem>
						<MenuItem value={1}>{t("admin.upera.browse.persianOptions.dubbed")}</MenuItem>
					</Select>
				</FormControl>
			</div>

			{/* Action Buttons */}
			<div className="flex items-center gap-3">
				<Button onClick={fetchContent} disabled={loading}>
					{loading ? (
						<>
							<CircularProgress size={16} className="ml-2" />
							{t("admin.upera.browse.fetching")}
						</>
					) : (
						<>
							<Search className="h-4 w-4 ml-2" />
							{t("admin.upera.browse.fetch")}
						</>
					)}
				</Button>

				{results.length > 0 && (
					<Button onClick={saveAllToLocal} disabled={saving} variant="outline">
						{saving ? (
							<>
								<CircularProgress size={16} className="ml-2" />
								{t("admin.upera.browse.savingToLocal")}
							</>
						) : (
							<>
								<Download className="h-4 w-4 ml-2" />
								{t("admin.upera.browse.saveAll")} ({results.length})
							</>
						)}
					</Button>
				)}
			</div>

			{/* Messages */}
			{error && (
				<Alert severity="error" onClose={() => setError(null)}>
					{error}
				</Alert>
			)}
			{success && (
				<Alert severity="success" onClose={() => setSuccess(null)}>
					{success}
				</Alert>
			)}

			{/* Results */}
			{results.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{results.map((item: any, index: number) => {
						const id = item.id || item.uuid || index;
						const title = item.title_fa || item.fa_title || item.title_en || item.en_title || "Untitled";
						const titleEn = item.title_en || item.en_title || "";
						const poster = item.poster || item.pic || null;
						const imdbRate = item.imdb_rate || item.imdb_rating || null;
						const year = item.year || null;
						const genres = item.genre || item.genres || [];

						return (
							<div
								key={id}
								className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
							>
								{/* Poster */}
								<div className="aspect-2/3 relative bg-gray-100">
									{poster ? (
										<img
											src={poster}
											alt={title}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="flex items-center justify-center h-full text-gray-400">
											<Film className="h-12 w-12" />
										</div>
									)}
									{item.is_free && (
										<Chip
											label="رایگان"
											size="small"
											color="success"
											className="absolute top-2 right-2"
										/>
									)}
								</div>

								{/* Info */}
								<div className="p-3 space-y-2">
									<h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
										{title}
									</h3>
									{titleEn && (
										<p className="text-xs text-gray-500 line-clamp-1">
											{titleEn}
										</p>
									)}
									<div className="flex items-center gap-2 text-xs text-gray-500">
										{year && <span>{year}</span>}
										{imdbRate && (
											<Chip label={`IMDb ${imdbRate}`} size="small" variant="outlined" />
										)}
									</div>
									{Array.isArray(genres) && genres.length > 0 && (
										<div className="flex flex-wrap gap-1">
											{(typeof genres[0] === "string" ? genres : [genres]).slice(0, 3).map((g: string, i: number) => (
												<Chip key={i} label={g} size="small" variant="outlined" />
											))}
										</div>
									)}

									{/* Actions */}
									<div className="flex flex-wrap gap-1 pt-2 border-t">
										<Button
											size="sm"
											variant="outline"
											onClick={() => saveSingleToLocal(item)}
											disabled={saving}
										>
											<Download className="h-3 w-3 ml-1" />
											{t("admin.upera.browse.saveToLocal")}
										</Button>
										{contentType === "series" && (
											<Button
												size="sm"
												variant="outline"
												onClick={() => viewEpisodes(id, title)}
											>
												<Eye className="h-3 w-3 ml-1" />
												{t("admin.upera.browse.viewEpisodes")}
											</Button>
										)}
										<Button
											size="sm"
											variant="outline"
											onClick={() => viewAffiliateLinks(id, contentType)}
										>
											{t("admin.upera.browse.affiliateLinks")}
										</Button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				!loading && (
					<div className="text-center py-12 text-gray-400">
						{t("admin.upera.browse.noResults")}
					</div>
				)
			)}

			{/* Pagination */}
			{results.length > 0 && (
				<div className="flex justify-center gap-2">
					<Button
						variant="outline"
						disabled={page <= 1}
						onClick={() => {
							setPage((p) => p - 1);
							fetchContent();
						}}
					>
						{t("admin.form.previous")}
					</Button>
					<span className="flex items-center px-4 text-sm text-gray-600">
						{t("admin.content.showing")} {page}
					</span>
					<Button
						variant="outline"
						onClick={() => {
							setPage((p) => p + 1);
							fetchContent();
						}}
					>
						{t("admin.form.next")}
					</Button>
				</div>
			)}

			{/* Episodes Dialog */}
			<Dialog
				open={episodesDialog.open}
				onClose={() => setEpisodesDialog({ open: false, data: null, title: "" })}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle className="flex items-center justify-between">
					<span>{episodesDialog.title} - {t("admin.upera.browse.viewEpisodes")}</span>
					<IconButton onClick={() => setEpisodesDialog({ open: false, data: null, title: "" })}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					{episodesDialog.data ? (
						<pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-96 direction-ltr" dir="ltr">
							{JSON.stringify(episodesDialog.data, null, 2)}
						</pre>
					) : (
						<p>{t("admin.messages.noData")}</p>
					)}
				</DialogContent>
			</Dialog>

			{/* Affiliate Links Dialog */}
			<Dialog
				open={affiliateDialog.open}
				onClose={() => setAffiliateDialog({ open: false, data: null })}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle className="flex items-center justify-between">
					<span>{t("admin.upera.browse.affiliateLinks")}</span>
					<IconButton onClick={() => setAffiliateDialog({ open: false, data: null })}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					{affiliateDialog.data ? (
						<pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-96 direction-ltr" dir="ltr">
							{JSON.stringify(affiliateDialog.data, null, 2)}
						</pre>
					) : (
						<p>{t("admin.messages.noData")}</p>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
