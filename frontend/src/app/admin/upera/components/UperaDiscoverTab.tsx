"use client";

import { useState, useCallback } from "react";
import {
	Compass,
	SlidersHorizontal,
	Tag,
	LayoutGrid,
	CreditCard,
} from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import {
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Alert,
	CircularProgress,
	Divider,
	Chip,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import { uperaApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

const AGE_OPTIONS = [
	{ value: "0", labelKey: "admin.upera.discover.ageOptions.all" },
	{ value: "G", labelKey: "admin.upera.discover.ageOptions.G" },
	{ value: "PG", labelKey: "admin.upera.discover.ageOptions.PG" },
	{ value: "PG-13", labelKey: "admin.upera.discover.ageOptions.PG-13" },
	{ value: "R", labelKey: "admin.upera.discover.ageOptions.R" },
	{ value: "X", labelKey: "admin.upera.discover.ageOptions.X" },
];

const COUNTRY_OPTIONS = [
	{ value: "0", labelKey: "admin.upera.discover.countryOptions.all" },
	{ value: "IR", labelKey: "admin.upera.discover.countryOptions.IR" },
	{ value: "noIR", labelKey: "admin.upera.discover.countryOptions.noIR" },
];

const TYPE_OPTIONS = [
	{ value: "0", labelKey: "admin.upera.discover.contentTypeOptions.all" },
	{ value: "movie", labelKey: "admin.upera.discover.contentTypeOptions.movie" },
	{ value: "series", labelKey: "admin.upera.discover.contentTypeOptions.series" },
];

const SORT_OPTIONS = [
	{ value: "created", labelKey: "admin.upera.discover.sortByOptions.created" },
	{ value: "oldest", labelKey: "admin.upera.discover.sortByOptions.oldest" },
	{ value: "imdb", labelKey: "admin.upera.discover.sortByOptions.imdb" },
];

const LANG_OPTIONS = [
	{ value: "0", labelKey: "admin.upera.discover.languageOptions.all" },
	{ value: "persian", labelKey: "admin.upera.discover.languageOptions.persian" },
	{ value: "nopersian", labelKey: "admin.upera.discover.languageOptions.nopersian" },
];

type SectionKey = "discover" | "sliders" | "offers" | "genres" | "plans";

export function UperaDiscoverTab() {
	const { t } = useTranslation();

	const [activeSection, setActiveSection] = useState<SectionKey>("discover");

	// Discover filters
	const [discoverFilters, setDiscoverFilters] = useState({
		age: "0",
		country: "0",
		discover_page: 1,
		f_type: "0",
		kids: 0,
		lang: "0",
		sortby: "created",
	});

	// Slider filters
	const [sliderFilters, setSliderFilters] = useState({
		age: "0",
		media_type: "0",
		location: "",
		ref: "",
	});

	// Offer filters
	const [offerFilters, setOfferFilters] = useState({
		age: "0",
		media_type: "0",
	});

	// Genre filters
	const [genreFilters, setGenreFilters] = useState({
		age: "0",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<any>(null);

	const handleFetchDiscover = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params: Record<string, any> = {};
			if (discoverFilters.age !== "0") params.age = discoverFilters.age;
			if (discoverFilters.country !== "0") params.country = discoverFilters.country;
			if (discoverFilters.discover_page > 1) params.discover_page = discoverFilters.discover_page;
			if (discoverFilters.f_type !== "0") params.f_type = discoverFilters.f_type;
			if (discoverFilters.kids === 1) params.kids = 1;
			if (discoverFilters.lang !== "0") params.lang = discoverFilters.lang;
			if (discoverFilters.sortby !== "created") params.sortby = discoverFilters.sortby;

			const data = await uperaApi.getDiscover(params);
			setResult(data);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
			setResult(null);
		} finally {
			setLoading(false);
		}
	}, [discoverFilters]);

	const handleFetchSliders = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params: Record<string, any> = {};
			if (sliderFilters.age !== "0") params.age = sliderFilters.age;
			if (sliderFilters.media_type !== "0") params.media_type = sliderFilters.media_type;
			if (sliderFilters.location) params.location = sliderFilters.location;
			if (sliderFilters.ref) params.ref = sliderFilters.ref;

			const data = await uperaApi.getSliders(params);
			setResult(data);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
			setResult(null);
		} finally {
			setLoading(false);
		}
	}, [sliderFilters]);

	const handleFetchOffers = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params: Record<string, any> = {};
			if (offerFilters.age !== "0") params.age = offerFilters.age;
			if (offerFilters.media_type !== "0") params.media_type = offerFilters.media_type;

			const data = await uperaApi.getOffers(params);
			setResult(data);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
			setResult(null);
		} finally {
			setLoading(false);
		}
	}, [offerFilters]);

	const handleFetchGenres = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params: Record<string, any> = {};
			if (genreFilters.age !== "0") params.age = genreFilters.age;

			const data = await uperaApi.getGenres(params);
			setResult(data);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
			setResult(null);
		} finally {
			setLoading(false);
		}
	}, [genreFilters]);

	const handleFetchPlans = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await uperaApi.getPlans();
			setResult(data);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message);
			setResult(null);
		} finally {
			setLoading(false);
		}
	}, []);

	const renderResult = () => {
		if (!result) return null;

		// Determine items to display
		const items = result?.data || result?.items || result?.results || result?.list;
		const isArray = Array.isArray(items);
		const isRawArray = Array.isArray(result);

		return (
			<div className="mt-4">
				{/* Summary */}
				{result?.total !== undefined && (
					<p className="text-sm text-gray-500 mb-2">
						{t("admin.upera.discover.totalItems")}: {result.total}
					</p>
				)}

				{/* Render content cards for arrays */}
				{(isArray || isRawArray) && (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
						{(isRawArray ? result : items).map((item: any, idx: number) => (
							<div
								key={item?.id || item?._id || idx}
								className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
							>
								{(item?.poster || item?.cover || item?.image || item?.banner) && (
									<img
										src={item.poster || item.cover || item.image || item.banner}
										alt={item?.title_fa || item?.title || item?.name || ""}
										className="w-full aspect-2/3 object-cover"
									/>
								)}
								<div className="p-2">
									<p className="text-sm font-medium text-white truncate">
										{item?.title_fa || item?.title || item?.name || item?.label || `#${idx + 1}`}
									</p>
									{item?.title_en && (
										<p className="text-xs text-gray-400 truncate">
											{item.title_en}
										</p>
									)}
									<div className="flex flex-wrap gap-1 mt-1">
										{item?.year && (
											<Chip label={item.year} size="small" variant="outlined" />
										)}
										{item?.imdb_rate && (
											<Chip label={`IMDb ${item.imdb_rate}`} size="small" color="warning" variant="outlined" />
										)}
										{item?.type && (
											<Chip label={item.type} size="small" color="info" variant="outlined" />
										)}
										{item?.price !== undefined && (
											<Chip
												label={item.price === 0 ? "رایگان" : `${item.price?.toLocaleString?.()} تومان`}
												size="small"
												color={item.price === 0 ? "success" : "default"}
												variant="outlined"
											/>
										)}
										{item?.duration && (
											<Chip label={item.duration} size="small" variant="outlined" />
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Raw JSON for non-array results */}
				{!isArray && !isRawArray && (
					<pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-[500px] whitespace-pre-wrap" dir="ltr">
						{JSON.stringify(result, null, 2)}
					</pre>
				)}
			</div>
		);
	};

	const renderAgeSelect = (value: string, onChange: (v: string) => void) => (
		<FormControl size="small" sx={{ minWidth: 140 }}>
			<InputLabel>{t("admin.upera.discover.age")}</InputLabel>
			<Select
				value={value}
				label={t("admin.upera.discover.age")}
				onChange={(e) => onChange(e.target.value)}
			>
				{AGE_OPTIONS.map((opt) => (
					<MenuItem key={opt.value} value={opt.value}>
						{t(opt.labelKey)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	const renderMediaTypeSelect = (value: string, onChange: (v: string) => void) => (
		<FormControl size="small" sx={{ minWidth: 140 }}>
			<InputLabel>{t("admin.upera.discover.mediaType")}</InputLabel>
			<Select
				value={value}
				label={t("admin.upera.discover.mediaType")}
				onChange={(e) => onChange(e.target.value)}
			>
				{TYPE_OPTIONS.map((opt) => (
					<MenuItem key={opt.value} value={opt.value}>
						{t(opt.labelKey)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	return (
		<div className="space-y-6">
			{/* Section title & description */}
			<div>
				<h3 className="text-lg font-semibold text-white flex items-center gap-2">
					<Compass className="w-5 h-5" />
					{t("admin.upera.discover.title")}
				</h3>
				<p className="text-sm text-gray-400 mt-1">
					{t("admin.upera.discover.description")}
				</p>
			</div>

			{/* Section toggles */}
			<ToggleButtonGroup
				value={activeSection}
				exclusive
				onChange={(_, v) => {
					if (v) {
						setActiveSection(v);
						setResult(null);
						setError(null);
					}
				}}
				size="small"
				fullWidth
			>
				<ToggleButton value="discover">
					<Compass className="w-4 h-4 ml-1" />
					{t("admin.upera.discover.sections.discover")}
				</ToggleButton>
				<ToggleButton value="sliders">
					<SlidersHorizontal className="w-4 h-4 ml-1" />
					{t("admin.upera.discover.sections.sliders")}
				</ToggleButton>
				<ToggleButton value="offers">
					<Tag className="w-4 h-4 ml-1" />
					{t("admin.upera.discover.sections.offers")}
				</ToggleButton>
				<ToggleButton value="genres">
					<LayoutGrid className="w-4 h-4 ml-1" />
					{t("admin.upera.discover.sections.genres")}
				</ToggleButton>
				<ToggleButton value="plans">
					<CreditCard className="w-4 h-4 ml-1" />
					{t("admin.upera.discover.sections.plans")}
				</ToggleButton>
			</ToggleButtonGroup>

			<Divider />

			{error && (
				<Alert severity="error" onClose={() => setError(null)}>
					{error}
				</Alert>
			)}

			{/* ====== DISCOVER SECTION ====== */}
			{activeSection === "discover" && (
				<div className="space-y-4">
					<div className="flex flex-wrap gap-3 items-end">
						{renderAgeSelect(discoverFilters.age, (v) =>
							setDiscoverFilters((prev) => ({ ...prev, age: v }))
						)}

						<FormControl size="small" sx={{ minWidth: 140 }}>
							<InputLabel>{t("admin.upera.discover.country")}</InputLabel>
							<Select
								value={discoverFilters.country}
								label={t("admin.upera.discover.country")}
								onChange={(e) =>
									setDiscoverFilters((prev) => ({
										...prev,
										country: e.target.value,
									}))
								}
							>
								{COUNTRY_OPTIONS.map((opt) => (
									<MenuItem key={opt.value} value={opt.value}>
										{t(opt.labelKey)}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl size="small" sx={{ minWidth: 140 }}>
							<InputLabel>{t("admin.upera.discover.contentType")}</InputLabel>
							<Select
								value={discoverFilters.f_type}
								label={t("admin.upera.discover.contentType")}
								onChange={(e) =>
									setDiscoverFilters((prev) => ({
										...prev,
										f_type: e.target.value,
									}))
								}
							>
								{TYPE_OPTIONS.map((opt) => (
									<MenuItem key={opt.value} value={opt.value}>
										{t(opt.labelKey)}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl size="small" sx={{ minWidth: 140 }}>
							<InputLabel>{t("admin.upera.discover.language")}</InputLabel>
							<Select
								value={discoverFilters.lang}
								label={t("admin.upera.discover.language")}
								onChange={(e) =>
									setDiscoverFilters((prev) => ({
										...prev,
										lang: e.target.value,
									}))
								}
							>
								{LANG_OPTIONS.map((opt) => (
									<MenuItem key={opt.value} value={opt.value}>
										{t(opt.labelKey)}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl size="small" sx={{ minWidth: 140 }}>
							<InputLabel>{t("admin.upera.discover.sortBy")}</InputLabel>
							<Select
								value={discoverFilters.sortby}
								label={t("admin.upera.discover.sortBy")}
								onChange={(e) =>
									setDiscoverFilters((prev) => ({
										...prev,
										sortby: e.target.value,
									}))
								}
							>
								{SORT_OPTIONS.map((opt) => (
									<MenuItem key={opt.value} value={opt.value}>
										{t(opt.labelKey)}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl size="small" sx={{ minWidth: 120 }}>
							<InputLabel>{t("admin.upera.discover.kids")}</InputLabel>
							<Select
								value={discoverFilters.kids}
								label={t("admin.upera.discover.kids")}
								onChange={(e) =>
									setDiscoverFilters((prev) => ({
										...prev,
										kids: Number(e.target.value),
									}))
								}
							>
								<MenuItem value={0}>{t("admin.upera.discover.kidsOptions.off")}</MenuItem>
								<MenuItem value={1}>{t("admin.upera.discover.kidsOptions.on")}</MenuItem>
							</Select>
						</FormControl>

						<TextField
							size="small"
							type="number"
							label={t("admin.upera.discover.page")}
							value={discoverFilters.discover_page}
							onChange={(e) =>
								setDiscoverFilters((prev) => ({
									...prev,
									discover_page: Number(e.target.value) || 1,
								}))
							}
							sx={{ width: 100 }}
							slotProps={{ htmlInput: { min: 1 } }}
						/>
					</div>

					<Button
						onClick={handleFetchDiscover}
						disabled={loading}
					>
						{loading ? (
							<CircularProgress size={18} sx={{ mr: 1 }} />
						) : (
							<Compass className="w-4 h-4 ml-1" />
						)}
						{loading
							? t("admin.upera.discover.fetching")
							: t("admin.upera.discover.fetch")}
					</Button>

					{renderResult()}
				</div>
			)}

			{/* ====== SLIDERS SECTION ====== */}
			{activeSection === "sliders" && (
				<div className="space-y-4">
					<div className="flex flex-wrap gap-3 items-end">
						{renderAgeSelect(sliderFilters.age, (v) =>
							setSliderFilters((prev) => ({ ...prev, age: v }))
						)}

						{renderMediaTypeSelect(sliderFilters.media_type, (v) =>
							setSliderFilters((prev) => ({ ...prev, media_type: v }))
						)}

						<TextField
							size="small"
							label={t("admin.upera.discover.location")}
							value={sliderFilters.location}
							onChange={(e) =>
								setSliderFilters((prev) => ({
									...prev,
									location: e.target.value,
								}))
							}
							sx={{ minWidth: 140 }}
						/>

						<TextField
							size="small"
							label={t("admin.upera.discover.ref")}
							value={sliderFilters.ref}
							onChange={(e) =>
								setSliderFilters((prev) => ({
									...prev,
									ref: e.target.value,
								}))
							}
							sx={{ minWidth: 140 }}
						/>
					</div>

					<Button
						onClick={handleFetchSliders}
						disabled={loading}
					>
						{loading ? (
							<CircularProgress size={18} sx={{ mr: 1 }} />
						) : (
							<SlidersHorizontal className="w-4 h-4 ml-1" />
						)}
						{loading
							? t("admin.upera.discover.fetching")
							: t("admin.upera.discover.fetch")}
					</Button>

					{renderResult()}
				</div>
			)}

			{/* ====== OFFERS SECTION ====== */}
			{activeSection === "offers" && (
				<div className="space-y-4">
					<div className="flex flex-wrap gap-3 items-end">
						{renderAgeSelect(offerFilters.age, (v) =>
							setOfferFilters((prev) => ({ ...prev, age: v }))
						)}

						{renderMediaTypeSelect(offerFilters.media_type, (v) =>
							setOfferFilters((prev) => ({ ...prev, media_type: v }))
						)}
					</div>

					<Button
						onClick={handleFetchOffers}
						disabled={loading}
					>
						{loading ? (
							<CircularProgress size={18} sx={{ mr: 1 }} />
						) : (
							<Tag className="w-4 h-4 ml-1" />
						)}
						{loading
							? t("admin.upera.discover.fetching")
							: t("admin.upera.discover.fetch")}
					</Button>

					{renderResult()}
				</div>
			)}

			{/* ====== GENRES SECTION ====== */}
			{activeSection === "genres" && (
				<div className="space-y-4">
					<div className="flex flex-wrap gap-3 items-end">
						{renderAgeSelect(genreFilters.age, (v) =>
							setGenreFilters((prev) => ({ ...prev, age: v }))
						)}
					</div>

					<Button
						onClick={handleFetchGenres}
						disabled={loading}
					>
						{loading ? (
							<CircularProgress size={18} sx={{ mr: 1 }} />
						) : (
							<LayoutGrid className="w-4 h-4 ml-1" />
						)}
						{loading
							? t("admin.upera.discover.fetching")
							: t("admin.upera.discover.fetch")}
					</Button>

					{renderResult()}
				</div>
			)}

			{/* ====== PLANS SECTION ====== */}
			{activeSection === "plans" && (
				<div className="space-y-4">
					<Button
						onClick={handleFetchPlans}
						disabled={loading}
					>
						{loading ? (
							<CircularProgress size={18} sx={{ mr: 1 }} />
						) : (
							<CreditCard className="w-4 h-4 ml-1" />
						)}
						{loading
							? t("admin.upera.discover.fetching")
							: t("admin.upera.discover.fetch")}
					</Button>

					{renderResult()}
				</div>
			)}
		</div>
	);
}
