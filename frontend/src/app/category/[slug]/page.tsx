"use client";

/**
 * Dynamic Category Page by slug
 * 
 * Handles URLs like:
 * - /category/action → shows all content in the "action" category
 * - /category/comedy → shows all content in the "comedy" category
 * 
 * Uses the same UnifiedCategoryPage layout as /movies/[genre] pages.
 * This route is used by "Show All" links in EmblaCarousel on the landing page.
 */

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { UnifiedCategoryPage } from "@/components/category";
import { categoriesApi, genresApi, type Category, type Genre } from "@/lib/api/public";
import { useLanguage } from "@/providers/language-provider";
import type { CategoryConfig, BreadcrumbItem, CategoryType, SubGenre } from "@/types/category";

function categoryToConfig(cat: Category, subGenres?: SubGenre[]): CategoryConfig {
	return {
		id: (cat.slug || "unknown") as CategoryType,
		categoryId: cat.id,
		contentType: (cat.contentType || "mixed") as "movie" | "series" | "mixed",
		titleFa: cat.nameFa,
		titleEn: cat.nameEn,
		descriptionFa: cat.descriptionFa || "",
		descriptionEn: cat.descriptionEn || "",
		gradientColors: (cat.gradientColors as [string, string]) || ["#3B82F6", "#1D4ED8"],
		tmdbParams: cat.tmdbParams || {},
		showEpisodes: cat.showEpisodes,
		subGenres,
	};
}

export default function CategorySlugPage() {
	const params = useParams();
	const { language } = useLanguage();

	const slug = params.slug as string;

	const [category, setCategory] = useState<Category | null>(null);
	const [categoryGenres, setCategoryGenres] = useState<SubGenre[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);

		(async () => {
			try {
				const [cat, genresRes] = await Promise.all([
					categoriesApi.getBySlug(slug),
					genresApi.list(slug),
				]);
				if (!cancelled) {
					setCategory(cat);
					const genres = genresRes.data || [];
					setCategoryGenres(
						genres.map((g: Genre) => ({
							slug: g.slug,
							nameEn: g.nameEn,
							nameFa: g.nameFa,
						}))
					);
				}
			} catch (e: any) {
				if (!cancelled) {
					setError(e?.response?.data?.message || "Category not found");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => { cancelled = true; };
	}, [slug]);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
				<CircularProgress sx={{ color: "#F59E0B" }} />
			</Box>
		);
	}

	if (error || !category) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
				<Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
					{language === "fa" ? "دسته‌بندی یافت نشد" : "Category not found"}
				</Typography>
			</Box>
		);
	}

	const config = categoryToConfig(category, categoryGenres);
	const breadcrumbs: BreadcrumbItem[] = [
		{ label: "Home", labelFa: "خانه", href: "/", isActive: false },
		{
			label: category.nameEn,
			labelFa: category.nameFa,
			href: `/category/${slug}`,
			isActive: true,
		},
	];

	return (
		<UnifiedCategoryPage
			config={config}
			breadcrumbs={breadcrumbs}
			basePath={`/category/${slug}`}
		/>
	);
}
