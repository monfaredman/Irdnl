"use client";

import { useState, useCallback } from "react";
import { Search, Download, TrendingUp, Star, Filter } from "lucide-react";
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
	Tabs,
	Tab,
	Box,
} from "@mui/material";
import { tmdbApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

type BrowseMode = "search" | "discover" | "popular" | "trending";

export function TMDBBrowseTab() {
	const { t } = useTranslation();
	
	const [mode, setMode] = useState<BrowseMode>("search");
	const [language, setLanguage] = useState<"en" | "fa">("fa");
	
	// Search state
	const [searchQuery, setSearchQuery] = useState("");
	const [searchPage, setSearchPage] = useState(1);
	
	// Discover state
	const [discoverType, setDiscoverType] = useState<"movie" | "tv">("movie");
	const [discoverGenre, setDiscoverGenre] = useState("");
	const [discoverYear, setDiscoverYear] = useState<number | "">("");
	const [discoverCertification, setDiscoverCertification] = useState("all");
	const [discoverCountry, setDiscoverCountry] = useState("all");
	const [discoverPage, setDiscoverPage] = useState(1);
	
	// Popular state
	const [popularType, setPopularType] = useState<"movie" | "tv">("movie");
	const [popularPage, setPopularPage] = useState(1);
	
	// Trending state
	const [trendingTimeWindow, setTrendingTimeWindow] = useState<"day" | "week">("week");
	const [trendingMediaType, setTrendingMediaType] = useState<"all" | "movie" | "tv">("all");
	
	const [results, setResults] = useState<any[]>([]);
	const [totalResults, setTotalResults] = useState(0);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSearch = useCallback(async () => {
		if (!searchQuery.trim()) return;
		
		setLoading(true);
		setError(null);
		try {
			const data = await tmdbApi.search(searchQuery, language, searchPage);
			setResults(data.items || []);
			setTotalResults(data.total || 0);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
			setResults([]);
		} finally {
			setLoading(false);
		}
	}, [searchQuery, language, searchPage]);

	const handleDiscover = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params: any = {
				type: discoverType,
				language,
				page: discoverPage,
			};
			if (discoverGenre) params.genre = discoverGenre;
			if (discoverYear) params.year = discoverYear;
			if (discoverCertification !== "all") params.certification = discoverCertification;
			if (discoverCountry !== "all") params.country = discoverCountry;
			
			const data = await tmdbApi.discover(params);
			setResults(data.results || []);
			setTotalResults(data.totalResults || 0);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
			setResults([]);
		} finally {
			setLoading(false);
		}
	}, [discoverType, language, discoverGenre, discoverYear, discoverCertification, discoverCountry, discoverPage]);

	const handleGetPopular = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await tmdbApi.getPopular({
				type: popularType,
				language,
				page: popularPage,
			});
			setResults(data.results || []);
			setTotalResults(data.totalResults || 0);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
			setResults([]);
		} finally {
			setLoading(false);
		}
	}, [popularType, language, popularPage]);

	const handleGetTrending = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await tmdbApi.getTrending({
				language,
				mediaType: trendingMediaType,
				timeWindow: trendingTimeWindow,
			});
			setResults(data.results || []);
			setTotalResults(data.totalResults || 0);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
			setResults([]);
		} finally {
			setLoading(false);
		}
	}, [language, trendingMediaType, trendingTimeWindow]);

	const handleSaveItem = useCallback(async (item: any) => {
		setSaving(true);
		setError(null);
		try {
			const mediaType = item.media_type || (item.title ? "movie" : "tv");
			await tmdbApi.saveContent({
				tmdbId: String(item.id),
				mediaType,
				rawData: item,
			});
			setSuccess(t("admin.tmdb.browse.savedSuccess"));
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setSaving(false);
		}
	}, [t]);

	const handleSaveAll = useCallback(async () => {
		if (results.length === 0) return;
		
		setSaving(true);
		setError(null);
		try {
			const items = results.map((item) => ({
				tmdbId: String(item.id),
				mediaType: (item.media_type || (item.title ? "movie" : "tv")) as "movie" | "tv",
				rawData: item,
			}));
			await tmdbApi.saveBulkContent(items);
			setSuccess(t("admin.tmdb.browse.savedSuccess"));
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
		} finally {
			setSaving(false);
		}
	}, [results, t]);

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-white flex items-center gap-2">
					<Search className="w-5 h-5" />
					{t("admin.tmdb.browse.title")}
				</h3>
			</div>

			{/* Mode Selection */}
			<Tabs
				value={mode}
				onChange={(_, v) => {
					setMode(v);
					setResults([]);
					setError(null);
				}}
				variant="fullWidth"
			>
				<Tab value="search" label={t("admin.tmdb.browse.search")} />
				<Tab value="discover" label={t("admin.tmdb.browse.discover")} />
				<Tab value="popular" label={t("admin.tmdb.browse.popular")} />
				<Tab value="trending" label={t("admin.tmdb.browse.trending")} />
			</Tabs>

			{/* Language Selector */}
			<FormControl size="small" sx={{ minWidth: 140 }}>
				<InputLabel>{t("admin.tmdb.browse.language")}</InputLabel>
				<Select
					value={language}
					label={t("admin.tmdb.browse.language")}
					onChange={(e) => setLanguage(e.target.value as "en" | "fa")}
				>
					<MenuItem value="fa">{t("admin.tmdb.browse.languageOptions.fa")}</MenuItem>
					<MenuItem value="en">{t("admin.tmdb.browse.languageOptions.en")}</MenuItem>
				</Select>
			</FormControl>

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

			{/* SEARCH MODE */}
			{mode === "search" && (
				<div className="space-y-4">
					<div className="flex gap-3">
						<TextField
							size="small"
							fullWidth
							placeholder={t("admin.tmdb.browse.searchPlaceholder")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && handleSearch()}
						/>
						<Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
							{loading ? (
								<CircularProgress size={18} sx={{ mr: 1 }} />
							) : (
								<Search className="w-4 h-4 ml-1" />
							)}
							{loading ? t("admin.tmdb.browse.searching") : t("admin.tmdb.browse.searchButton")}
						</Button>
					</div>
				</div>
			)}

			{/* DISCOVER MODE */}
			{mode === "discover" && (
				<div className="space-y-4">
					<div className="flex flex-wrap gap-3">
						<FormControl size="small" sx={{ minWidth: 120 }}>
							<InputLabel>{t("admin.tmdb.browse.type")}</InputLabel>
							<Select
								value={discoverType}
								label={t("admin.tmdb.browse.type")}
								onChange={(e) => setDiscoverType(e.target.value as "movie" | "tv")}
							>
								<MenuItem value="movie">{t("admin.tmdb.browse.typeOptions.movie")}</MenuItem>
								<MenuItem value="tv">{t("admin.tmdb.browse.typeOptions.tv")}</MenuItem>
							</Select>
						</FormControl>

						<TextField
							size="small"
							label={t("admin.tmdb.browse.year")}
							type="number"
							value={discoverYear}
							onChange={(e) => setDiscoverYear(e.target.value ? Number(e.target.value) : "")}
							sx={{ width: 120 }}
						/>

						<FormControl size="small" sx={{ minWidth: 140 }}>
							<InputLabel>{t("admin.tmdb.browse.certification")}</InputLabel>
							<Select
								value={discoverCertification}
								label={t("admin.tmdb.browse.certification")}
								onChange={(e) => setDiscoverCertification(e.target.value)}
							>
								<MenuItem value="all">{t("admin.tmdb.browse.certificationOptions.all")}</MenuItem>
								<MenuItem value="g">{t("admin.tmdb.browse.certificationOptions.g")}</MenuItem>
								<MenuItem value="pg">{t("admin.tmdb.browse.certificationOptions.pg")}</MenuItem>
								<MenuItem value="pg13">{t("admin.tmdb.browse.certificationOptions.pg13")}</MenuItem>
								<MenuItem value="r">{t("admin.tmdb.browse.certificationOptions.r")}</MenuItem>
							</Select>
						</FormControl>

						<FormControl size="small" sx={{ minWidth: 140 }}>
							<InputLabel>{t("admin.tmdb.browse.country")}</InputLabel>
							<Select
								value={discoverCountry}
								label={t("admin.tmdb.browse.country")}
								onChange={(e) => setDiscoverCountry(e.target.value)}
							>
								<MenuItem value="all">{t("admin.tmdb.browse.countryOptions.all")}</MenuItem>
								<MenuItem value="us">{t("admin.tmdb.browse.countryOptions.us")}</MenuItem>
								<MenuItem value="uk">{t("admin.tmdb.browse.countryOptions.uk")}</MenuItem>
								<MenuItem value="ir">{t("admin.tmdb.browse.countryOptions.ir")}</MenuItem>
								<MenuItem value="fr">{t("admin.tmdb.browse.countryOptions.fr")}</MenuItem>
								<MenuItem value="de">{t("admin.tmdb.browse.countryOptions.de")}</MenuItem>
								<MenuItem value="jp">{t("admin.tmdb.browse.countryOptions.jp")}</MenuItem>
								<MenuItem value="kr">{t("admin.tmdb.browse.countryOptions.kr")}</MenuItem>
							</Select>
						</FormControl>
					</div>

					<Button onClick={handleDiscover} disabled={loading}>
						{loading ? (
							<CircularProgress size={18} sx={{ mr: 1 }} />
						) : (
							<Filter className="w-4 h-4 ml-1" />
						)}
						{loading ? t("admin.tmdb.browse.discovering") : t("admin.tmdb.browse.discoverButton")}
					</Button>
				</div>
			)}

			{/* POPULAR MODE */}
			{mode === "popular" && (
				<div className="space-y-4">
					<div className="flex gap-3">
						<FormControl size="small" sx={{ minWidth: 120 }}>
							<InputLabel>{t("admin.tmdb.browse.type")}</InputLabel>
							<Select
								value={popularType}
								label={t("admin.tmdb.browse.type")}
								onChange={(e) => setPopularType(e.target.value as "movie" | "tv")}
							>
								<MenuItem value="movie">{t("admin.tmdb.browse.typeOptions.movie")}</MenuItem>
								<MenuItem value="tv">{t("admin.tmdb.browse.typeOptions.tv")}</MenuItem>
							</Select>
						</FormControl>

						<Button onClick={handleGetPopular} disabled={loading}>
							{loading ? (
								<CircularProgress size={18} sx={{ mr: 1 }} />
							) : (
								<Star className="w-4 h-4 ml-1" />
							)}
							{loading ? t("admin.tmdb.browse.loading") : t("admin.tmdb.browse.popularButton")}
						</Button>
					</div>
				</div>
			)}

			{/* TRENDING MODE */}
			{mode === "trending" && (
				<div className="space-y-4">
					<div className="flex gap-3">
						<FormControl size="small" sx={{ minWidth: 140 }}>
							<InputLabel>{t("admin.tmdb.browse.mediaType")}</InputLabel>
							<Select
								value={trendingMediaType}
								label={t("admin.tmdb.browse.mediaType")}
								onChange={(e) => setTrendingMediaType(e.target.value as any)}
							>
								<MenuItem value="all">{t("admin.tmdb.browse.mediaTypeOptions.all")}</MenuItem>
								<MenuItem value="movie">{t("admin.tmdb.browse.mediaTypeOptions.movie")}</MenuItem>
								<MenuItem value="tv">{t("admin.tmdb.browse.mediaTypeOptions.tv")}</MenuItem>
							</Select>
						</FormControl>

						<FormControl size="small" sx={{ minWidth: 120 }}>
							<InputLabel>{t("admin.tmdb.browse.timeWindow")}</InputLabel>
							<Select
								value={trendingTimeWindow}
								label={t("admin.tmdb.browse.timeWindow")}
								onChange={(e) => setTrendingTimeWindow(e.target.value as "day" | "week")}
							>
								<MenuItem value="day">{t("admin.tmdb.browse.timeWindowOptions.day")}</MenuItem>
								<MenuItem value="week">{t("admin.tmdb.browse.timeWindowOptions.week")}</MenuItem>
							</Select>
						</FormControl>

						<Button onClick={handleGetTrending} disabled={loading}>
							{loading ? (
								<CircularProgress size={18} sx={{ mr: 1 }} />
							) : (
								<TrendingUp className="w-4 h-4 ml-1" />
							)}
							{loading ? t("admin.tmdb.browse.loading") : t("admin.tmdb.browse.trendingButton")}
						</Button>
					</div>
				</div>
			)}

			{/* Results */}
			{results.length > 0 && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-400">
							{totalResults} {t("admin.tmdb.browse.results")}
						</p>
						<Button
							onClick={handleSaveAll}
							disabled={saving}
							variant="outline"
							size="sm"
						>
							{saving ? (
								<CircularProgress size={16} sx={{ mr: 1 }} />
							) : (
								<Download className="w-4 h-4 ml-1" />
							)}
							{saving ? t("admin.tmdb.browse.saving") : t("admin.tmdb.browse.saveAll")}
						</Button>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
						{results.map((item: any) => {
							const title = item.title || item.name || "";
							const posterPath = item.poster_path;
							const year = item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4);
							const rating = item.vote_average;
							const mediaType = item.media_type || (item.title ? "movie" : "tv");

							return (
								<div
									key={item.id}
									className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors"
								>
									{posterPath && (
										<img
											src={`https://image.tmdb.org/t/p/w500${posterPath}`}
											alt={title}
											className="w-full aspect-2/3 object-cover"
										/>
									)}
									<div className="p-2">
										<p className="text-sm font-medium text-white truncate" title={title}>
											{title}
										</p>
										<div className="flex items-center gap-1 mt-1">
											{year && (
												<Chip label={year} size="small" variant="outlined" />
											)}
											{rating > 0 && (
												<Chip
													label={`⭐ ${rating.toFixed(1)}`}
													size="small"
													color="warning"
													variant="outlined"
												/>
											)}
										</div>
										<Chip
											label={mediaType === "movie" ? "فیلم" : "سریال"}
											size="small"
											color="info"
											variant="outlined"
											sx={{ mt: 1 }}
										/>
										<Button
											onClick={() => handleSaveItem(item)}
											disabled={saving}
											size="sm"
											className="w-full mt-2"
										>
											<Download className="w-3 h-3 ml-1" />
											{t("admin.tmdb.browse.saveToLocal")}
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{!loading && results.length === 0 && (
				<div className="text-center text-gray-400 py-8">
					{t("admin.tmdb.browse.noResults")}
				</div>
			)}
		</div>
	);
}
