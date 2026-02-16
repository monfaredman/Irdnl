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

	/** Convert raw Upera CDN URLs to thumb proxy URLs for proper display */
	const uperaThumb = (src: string | undefined, w = 142, h = 212, mode = 'c') => {
		if (!src) return undefined;
		// Already a thumb URL
		if (src.includes('thumb.upera.tv/thumb')) return src;
		// Convert cdn.upera.tv or thumb.upera.tv/s3 paths
		return `https://thumb.upera.tv/thumb?w=${w}&h=${h}&q=100&a=${mode}&src=${encodeURIComponent(src)}`;
	};

	const renderResult = () => {
		if (!result) return null;

		switch (activeSection) {
			case "discover":
				return renderDiscoverResult();
			case "sliders":
				return renderSlidersResult();
			case "offers":
				return renderOffersResult();
			case "genres":
				return renderGenresResult();
			case "plans":
				return renderPlansResult();
			default:
				return renderRawJSON();
		}
	};

	const renderDiscoverResult = () => {
		// discover response: { data: { data: [ { title, link, data: [...items] }, ... ] } }
		const lists = result?.data?.data || result?.data || [];
		if (!Array.isArray(lists) || lists.length === 0) return renderRawJSON();

		return (
			<div className="mt-4 space-y-6">
				{lists.map((list: any, listIdx: number) => (
					<div key={list?.id || listIdx} className="space-y-2">
						{list?.title && (
							<h4 className="text-base font-semibold text-white border-b border-gray-700 pb-1">
								{list.title}
							</h4>
						)}
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
							{(list?.data || []).map((item: any, idx: number) => {
								const posterUrl = item?.cdn?.poster || item?.poster || item?.cover || item?.image;
								return (
									<div
										key={item?.id || item?.movie_id || idx}
										className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors"
									>
										{posterUrl && (
											<img
												src={uperaThumb(posterUrl, 142, 212, 'c')}
												alt={item?.title_fa || item?.title || ""}
												className="w-full aspect-2/3 object-cover"
												loading="lazy"
											/>
										)}
										<div className="p-2">
											<p className="text-sm font-medium text-white truncate">
												{item?.title_fa || item?.title || item?.name || `#${idx + 1}`}
											</p>
											{item?.title_en && (
												<p className="text-xs text-gray-400 truncate">{item.title_en}</p>
											)}
											<div className="flex flex-wrap gap-1 mt-1">
												{item?.year && (
													<Chip label={item.year} size="small" variant="outlined" sx={{ color: '#aaa', borderColor: '#555' }} />
												)}
												{item?.imdb_rate && (
													<Chip label={`IMDb ${item.imdb_rate}`} size="small" color="warning" variant="outlined" />
												)}
												{item?.type && (
													<Chip label={item.type === 'series' ? 'سریال' : 'فیلم'} size="small" color="info" variant="outlined" />
												)}
												{item?.hd === 1 && (
													<Chip label="HD" size="small" color="success" variant="outlined" />
												)}
												{item?.dubbed === 1 && (
													<Chip label="دوبله" size="small" color="secondary" variant="outlined" />
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		);
	};

	const renderSlidersResult = () => {
		// sliders response: { data: { sliders: [ { id, name, image, genre, link, ... } ] } }
		const sliders = result?.data?.sliders || result?.sliders || [];
		if (!Array.isArray(sliders) || sliders.length === 0) return renderRawJSON();

		return (
			<div className="mt-4 space-y-3">
				<p className="text-sm text-gray-400">
					تعداد اسلایدر: {sliders.length}
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{sliders.map((slider: any, idx: number) => (
						<div
							key={slider?.id || idx}
							className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors"
						>
							{slider?.image && (
								<img
									src={uperaThumb(slider.image, 764, 400, 'r')}
									alt={slider?.name || ""}
									className="w-full aspect-video object-cover"
									loading="lazy"
								/>
							)}
							<div className="p-3">
								<p className="text-sm font-semibold text-white">
									{slider?.name || `اسلایدر #${idx + 1}`}
								</p>
							<div className="flex flex-wrap gap-1 mt-2">
								{slider?.genre && (
									typeof slider.genre === 'object'
										? Object.keys(slider.genre).map((g) => (
											<Chip key={g} label={g} size="small" color="secondary" variant="outlined" />
										))
										: <Chip label={String(slider.genre)} size="small" color="secondary" variant="outlined" />
								)}
									{slider?.media_type && (
										<Chip label={slider.media_type === 'series' ? 'سریال' : 'فیلم'} size="small" color="info" variant="outlined" />
									)}
									{slider?.badge_text && (
										<Chip label={slider.badge_text} size="small" color="warning" />
									)}
								</div>
								{slider?.link && (
									<a href={slider.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-1 inline-block">
										مشاهده لینک
									</a>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderOffersResult = () => {
		// offers response: { data: [ { id, name, series_name, episode_number, cdn: { poster }, ... } ] }
		const offers = result?.data || [];
		if (!Array.isArray(offers) || offers.length === 0) return renderRawJSON();

		return (
			<div className="mt-4 space-y-3">
				<p className="text-sm text-gray-400">
					تعداد آفرها: {offers.length}
				</p>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
					{offers.map((item: any, idx: number) => {
						const posterUrl = item?.cdn?.poster || item?.poster || item?.cover;
						return (
							<div
								key={item?.id || idx}
								className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-orange-500 transition-colors"
							>
								{posterUrl && (
									<img
										src={uperaThumb(posterUrl, 142, 212, 'c')}
										alt={item?.name || ""}
										className="w-full aspect-2/3 object-cover"
										loading="lazy"
									/>
								)}
								<div className="p-2">
									<p className="text-sm font-medium text-white truncate">
										{item?.name || item?.title_fa || `#${idx + 1}`}
									</p>
									{item?.series_name && (
										<p className="text-xs text-gray-400 truncate">
											{item.series_name}
										</p>
									)}
									<div className="flex flex-wrap gap-1 mt-1">
										{item?.episode_number !== undefined && (
											<Chip label={`قسمت ${item.episode_number}`} size="small" color="primary" variant="outlined" />
										)}
										{item?.type && (
											<Chip label={item.type === 'series' ? 'سریال' : 'فیلم'} size="small" color="info" variant="outlined" />
										)}
										{item?.year && (
											<Chip label={item.year} size="small" variant="outlined" sx={{ color: '#aaa', borderColor: '#555' }} />
										)}
										{item?.imdb_rate && (
											<Chip label={`IMDb ${item.imdb_rate}`} size="small" color="warning" variant="outlined" />
										)}
										{item?.offer_percent > 0 && (
											<Chip label={`${item.offer_percent}% تخفیف`} size="small" color="error" />
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	const renderGenresResult = () => {
		// genres response: { genres: [ { id, fa, en, slug, cover, ... } ] }
		const genres = result?.genres || result?.data?.genres || [];
		if (!Array.isArray(genres) || genres.length === 0) return renderRawJSON();

		return (
			<div className="mt-4 space-y-3">
				<p className="text-sm text-gray-400">
					تعداد ژانرها: {genres.length}
				</p>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
					{genres.map((genre: any, idx: number) => (
						<div
							key={genre?.id || genre?.slug || idx}
							className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-green-500 transition-colors"
						>
							{genre?.cover && (
								<img
									src={uperaThumb(genre.cover, 764, 400, 'r')}
									alt={genre?.fa || genre?.en || ""}
									className="w-full aspect-video object-cover"
									loading="lazy"
								/>
							)}
							<div className="p-3 text-center">
								<p className="text-sm font-semibold text-white">
									{genre?.fa || genre?.name || `ژانر #${idx + 1}`}
								</p>
								{genre?.en && (
									<p className="text-xs text-gray-400 mt-0.5">{genre.en}</p>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderPlansResult = () => {
		// plans response: { data: { plan_key: { id, amount, duration_type, discount, title, ... }, ... } }
		const plansData = result?.data || result;
		if (!plansData || typeof plansData !== "object") return renderRawJSON();

		// Collect plan entries (could be object or array)
		const planEntries: any[] = Array.isArray(plansData)
			? plansData
			: Object.entries(plansData)
					.filter(([key]) => key !== "status" && key !== "message")
					.map(([key, val]) => ({ planKey: key, ...(typeof val === 'object' && val !== null ? val : {}) }));

		if (planEntries.length === 0) return renderRawJSON();

		return (
			<div className="mt-4 space-y-3">
				<p className="text-sm text-gray-400">
					تعداد پلن‌ها: {planEntries.length}
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{planEntries.map((plan: any, idx: number) => {
						const amount = plan?.toman || plan?.amount || plan?.price || 0;
						const discountObj = plan?.discount;
						const discountPercent = typeof discountObj === 'object' && discountObj !== null
							? (discountObj.discount_percent || 0)
							: (typeof discountObj === 'number' ? discountObj : 0);
						const discountPrice = typeof discountObj === 'object' && discountObj !== null
							? discountObj.discount_price
							: null;
						const finalPrice = discountPrice != null
							? discountPrice
							: (discountPercent > 0 ? amount - (amount * discountPercent / 100) : amount);
						const planName = plan?.name_fa || plan?.name || plan?.title || plan?.planKey || `پلن #${idx + 1}`;
						const days = plan?.days || plan?.duration_days;
						return (
							<div
								key={plan?.id || plan?.planKey || idx}
								className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-yellow-500 transition-colors"
							>
								<div className="flex items-center justify-between mb-3">
									<h4 className="text-base font-bold text-white">
										{planName}
									</h4>
									{plan?.is_popular && (
										<Chip label="محبوب" size="small" color="warning" />
									)}
								</div>

								<div className="space-y-2">
									<div className="flex items-baseline gap-2">
										<span className="text-2xl font-bold text-emerald-400">
											{finalPrice?.toLocaleString?.() || "0"}
										</span>
										<span className="text-xs text-gray-400">تومان</span>
									</div>

									{discountPercent > 0 && (
										<div className="flex items-center gap-2">
											<span className="text-sm text-gray-500 line-through">
												{amount?.toLocaleString?.()}
											</span>
											<Chip label={`${discountPercent}% تخفیف`} size="small" color="error" />
										</div>
									)}

									{days && (
										<p className="text-xs text-gray-400">
											مدت: {days} روز
										</p>
									)}

									{plan?.duration_type && (
										<p className="text-xs text-gray-400">
											نوع: {plan.duration_type === 'monthly' ? 'ماهانه' : plan.duration_type === 'yearly' ? 'سالانه' : plan.duration_type}
										</p>
									)}

									{plan?.dollar && (
										<p className="text-xs text-gray-400">
											قیمت دلاری: ${plan.dollar}
										</p>
									)}

									{plan?.description && (
										<p className="text-xs text-gray-300 mt-2">{plan.description}</p>
									)}

									<div className="flex flex-wrap gap-1 mt-2">
										{plan?.max_quality && (
											<Chip label={`کیفیت: ${plan.max_quality}`} size="small" variant="outlined" sx={{ color: '#aaa', borderColor: '#555' }} />
										)}
										{plan?.simultaneous_streams && (
											<Chip label={`${plan.simultaneous_streams} دستگاه`} size="small" variant="outlined" sx={{ color: '#aaa', borderColor: '#555' }} />
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	const renderRawJSON = () => (
		<div className="mt-4">
			<pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-[500px] whitespace-pre-wrap" dir="ltr">
				{JSON.stringify(result, null, 2)}
			</pre>
		</div>
	);

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
