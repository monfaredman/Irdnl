"use client";

import { Alert, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { EmblaCarousel } from "@/components/sections/EmblaCarousel";
import { IOSWidgetGridSection } from "@/components/sections/IOSWidgetGridSection";
import { PlayTableWidgetSection } from "@/components/sections/PlayTableWidgetSection";
import { LiquidGlassSlider } from "@/components/sections/LiquidGlassSlider";
import { MainPageSkeleton } from "@/components/layout/SkeletonLoader";
import { useLanguage } from "@/providers/language-provider";
import { contentApi } from "@/lib/api/content";
import { slidersApi, offersApi, categoriesApi, pinsApi, playTablesApi, type Slider, type Offer, type Category, type Pin, type PlayTablePublic } from "@/lib/api/public";
import type { Movie, Series } from "@/types/media";

/**
 * Apple-Inspired Liquid Glass Homepage
 *
 * Data Source: Backend Database (all content uploaded via admin panel)
 * API calls: menu (header), sliders, offers, pins, landing categories + content per category
 */
export default function Home() {
	const { language } = useLanguage();

	// Dynamic landing categories from DB
	const [landingCategories, setLandingCategories] = useState<Category[]>([]);
	const [landingCategoryContent, setLandingCategoryContent] = useState<Record<string, (Movie | Series)[]>>({});

	// Sliders, Pins & Offers from admin panel
	const [sliders, setSliders] = useState<Slider[]>([]);
	const [pins, setPins] = useState<Pin[]>([]);
	const [offers, setOffers] = useState<Offer[]>([]);
	const [playTables, setPlayTables] = useState<PlayTablePublic[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch sliders, pins, offers, and landing categories in one effect
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const [slidersRes, pinsRes, offersRes, landingRes, playTablesRes] = await Promise.all([
					slidersApi.list().catch(() => ({ data: [] })),
					pinsApi.list().catch(() => ({ data: [] })),
					offersApi.list().catch(() => ({ data: [] })),
					categoriesApi.listLanding().catch(() => ({ data: [] })),
					playTablesApi.list().catch(() => ({ data: [] })),
				]);
				if (cancelled) return;

				setSliders(slidersRes.data || []);
				setPins(pinsRes.data || []);
				setOffers(offersRes.data || []);
				setPlayTables(playTablesRes.data || []);

				const cats = landingRes.data || [];
				setLandingCategories(cats);

				// Fetch content for each landing category
				if (cats.length > 0) {
					const contentMap: Record<string, (Movie | Series)[]> = {};
					await Promise.all(
						cats.map(async (cat) => {
							try {
								const contentRes = await contentApi.getContent({
									categoryId: cat.id,
									sort: "createdAt",
									order: "DESC",
									limit: 20,
								});
								contentMap[cat.id] = contentRes.items;
							} catch {
								contentMap[cat.id] = [];
							}
						})
					);
					if (!cancelled) {
						setLandingCategoryContent(contentMap);
					}
				}
			} catch {
				// silently fail - sections just won't show
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => { cancelled = true; };
	}, []);

	// Loading state
	if (loading) {
		return <MainPageSkeleton />;
	}

	return (
		<Box
			sx={{
				minHeight: "100vh",
			}}
		>
			{/* Premium Hero Slider - Shows admin panel sliders + hero-pinned content */}
		{(() => {
				// Build items from sliders
				const sliderItems = sliders.map((s) => ({
					id: s.contentId || s.id,
					title: language === "fa" ? s.titleFa || s.title : s.title,
					backdrop: s.content?.backdropUrl || s.content?.bannerUrl || "",
					poster: s.imageUrl || s.content?.posterUrl || "",
					rating: 0,
					year: s.content?.year || new Date().getFullYear(),
					genres: s.content?.genres || [] as string[],
					description: language === "fa" ? s.descriptionFa || s.description || s.content?.description || "" : s.description || s.content?.description || "",
					slug: s.contentId || s.id,
					linkUrl: s.contentId ? `/item/${s.contentId}` : (s.linkUrl || `/item/${s.id}`),
				}));

				// Build items from hero pins
				const heroPins = pins.filter((p) => p.section === "hero" && p.content);
				const pinItems = heroPins.map((p) => {
					const c = p.content;
					return {
						id: c?.id || p.id,
						title: language === "fa" ? p.labelFa || c?.title || "" : p.label || c?.title || "",
						backdrop: c?.backdropUrl || c?.bannerUrl || "",
						poster: c?.posterUrl || "",
						rating: 0,
						year: c?.year || new Date().getFullYear(),
						genres: c?.genres || [] as string[],
						description: language === "fa" ? c?.descriptionFa || c?.description || "" : c?.description || "",
						slug: c?.id || p.id,
						linkUrl: c?.id ? `/item/${c.id}` : `#`,
					};
				});

				// Merge: pins first (priority), then sliders that aren't already pinned
				const pinnedContentIds = new Set(heroPins.map((p) => p.contentId).filter(Boolean));
				const nonDupSliders = sliderItems.filter((s) => !pinnedContentIds.has(s.id));
				const heroItems = [...pinItems, ...nonDupSliders];
				if (heroItems.length === 0) return null;

				return (
					<LiquidGlassSlider
						items={heroItems as any}
						type="movie"
						autoplayDelay={5000}
					/>
				);
			})()}

			{/* iOS-Style Widget Grid - Shows offers from admin panel */}
			{offers.length > 0 && (
				<IOSWidgetGridSection offers={offers} />
			)}

			{/* Play Table Schedule Section */}
			{playTables.length > 0 && (
				<PlayTableWidgetSection playTables={playTables} />
			)}

			{/* Pinned Content Sections - Organized by section */}
			{pins.length > 0 && (() => {
				// Group pins by section
				const pinsBySection = pins.reduce((acc, pin) => {
					if (!acc[pin.section]) acc[pin.section] = [];
					acc[pin.section].push(pin);
					return acc;
				}, {} as Record<string, Pin[]>);

				// Section labels
				const sectionLabels: Record<string, { en: string; fa: string }> = {
					"new-movies": { en: "New Movies", fa: "فیلم‌های جدید" },
					"foreign-series": { en: "Foreign Series", fa: "سریال خارجی" },
					"iranian-series": { en: "Iranian Series", fa: "سریال ایرانی" },
					"dubbed": { en: "Dubbed", fa: "دوبله فارسی" },
					"animation": { en: "Animation", fa: "انیمیشن" },
					"trending": { en: "Trending", fa: "پرطرفدار" },
				};

				return Object.entries(pinsBySection).map(([section, sectionPins]) => {
					// Skip hero section (already shown in main slider)
					if (section === "hero" || section === "widget-grid") return null;

					const label = sectionLabels[section];
					if (!label) return null;

					return (
						<EmblaCarousel
							key={`pins-${section}`}
							title={language === "fa" ? label.fa : label.en}
							items={sectionPins.map((pin) => {
								const content = pin.content;
								return {
									id: content?.id || pin.id,
									title: content?.title || "",
									poster: content?.posterUrl || "",
									backdrop: content?.backdropUrl || "",
									rating: content?.rating ? parseFloat(content.rating) : 0,
									year: content?.year || new Date().getFullYear(),
									genres: content?.genres || [],
									description: content?.description || "",
									slug: content?.id || pin.id,
								} as Movie;
							})}
							type="movie"
							viewAllHref="#"
						/>
					);
				});
			})()}

			{/* Dynamic Landing Categories from DB (showInLanding=true, sorted by sortOrder) */}
			{landingCategories.map((cat) => {
				const items = landingCategoryContent[cat.id] || [];
				if (items.length === 0) return null;

				return (
					<EmblaCarousel
						key={cat.id}
						title={language === "fa" ? cat.nameFa : cat.nameEn}
						items={items}
						type={cat.contentType === "series" ? "series" : "movie"}
						viewAllHref={`/category/${cat.slug}`}
					/>
				);
			})}

			{/* Fallback if no content */}
			{sliders.length === 0 &&
				offers.length === 0 &&
				landingCategories.length === 0 && (
					<Box sx={{ p: 8, textAlign: "center" }}>
						<Alert severity="info" sx={{ maxWidth: 600, mx: "auto" }}>
							{language === "fa"
								? "در حال بارگذاری محتوا..."
								: "Loading content..."}
						</Alert>
					</Box>
				)}
		</Box>
	);
}
