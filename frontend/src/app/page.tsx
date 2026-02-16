"use client";

import { Alert, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { EmblaCarousel } from "@/components/sections/EmblaCarousel";
import { IOSWidgetGridSection } from "@/components/sections/IOSWidgetGridSection";
import { LiquidGlassSlider } from "@/components/sections/LiquidGlassSlider";
import { MainPageSkeleton } from "@/components/layout/SkeletonLoader";
import { useLanguage } from "@/providers/language-provider";
import { contentApi } from "@/lib/api/content";
import { slidersApi, offersApi, categoriesApi, type Slider, type Offer, type Category } from "@/lib/api/public";
import type { Movie, Series } from "@/types/media";

/**
 * Apple-Inspired Liquid Glass Homepage
 *
 * Data Source: Backend Database (all content uploaded via admin panel)
 * API calls: menu (header), sliders, offers, landing categories + content per category
 */
export default function Home() {
	const { language } = useLanguage();

	// Dynamic landing categories from DB
	const [landingCategories, setLandingCategories] = useState<Category[]>([]);
	const [landingCategoryContent, setLandingCategoryContent] = useState<Record<string, (Movie | Series)[]>>({});

	// Sliders & Offers from admin panel
	const [sliders, setSliders] = useState<Slider[]>([]);
	const [offers, setOffers] = useState<Offer[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch sliders, offers, and landing categories in one effect
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const [slidersRes, offersRes, landingRes] = await Promise.all([
					slidersApi.list().catch(() => ({ data: [] })),
					offersApi.list().catch(() => ({ data: [] })),
					categoriesApi.listLanding().catch(() => ({ data: [] })),
				]);
				if (cancelled) return;

				setSliders(slidersRes.data || []);
				setOffers(offersRes.data || []);

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
			{/* Premium Hero Slider - Shows admin panel sliders only */}
			{sliders.length > 0 && (
				<LiquidGlassSlider
					items={sliders.map((s) => ({
						id: s.contentId || s.id,
						title: language === "fa" ? s.titleFa || s.title : s.title,
						backdrop: s.imageUrl || "",
						poster: s.imageUrl || "",
						rating: 0,
						year: new Date().getFullYear(),
						genres: [] as string[],
						description: language === "fa" ? s.descriptionFa || s.description || "" : s.description || "",
						slug: s.contentId || s.id,
						linkUrl: s.contentId ? `/item/${s.contentId}` : (s.linkUrl || `/item/${s.id}`),
					})) as any}
					type="movie"
					autoplayDelay={5000}
				/>
			)}

			{/* iOS-Style Widget Grid - Shows offers from admin panel */}
			{offers.length > 0 && (
				<IOSWidgetGridSection offers={offers} />
			)}

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
