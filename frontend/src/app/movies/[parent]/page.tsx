"use client";

/**
 * Dynamic Parent Category Page
 * 
 * Handles URLs like:
 * - /movies/foreign → فیلم خارجی (parent with children - shows all content)
 * - /movies/iranian → فیلم ایرانی (parent without children)
 * - /movies/animation → انیمیشن
 * - /movies/dubbed → دوبله فارسی
 * - /movies/anime → انیمه
 * - /movies/series → سریال
 * - /movies/other → سایر
 * 
 * When genre query param is present (e.g. /movies/iranian?genre=action),
 * it applies genre filters.
 */

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { UnifiedCategoryPage } from "@/components/category";
import { categoriesApi, type Category } from "@/lib/api/public";
import { useLanguage } from "@/providers/language-provider";
import type { CategoryConfig, BreadcrumbItem, CategoryType } from "@/types/category";

function categoryToConfig(cat: Category): CategoryConfig {
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
	};
}

export default function ParentCategoryPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const { language } = useLanguage();

	const parentSlug = params.parent as string;
	const genreFilter = searchParams.get("genre");

	const [category, setCategory] = useState<Category | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);

		(async () => {
			try {
				const cat = await categoriesApi.getByPath(parentSlug);
				if (!cancelled) {
					setCategory(cat);
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
	}, [parentSlug]);

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

	const config = categoryToConfig(category);
	const breadcrumbs: BreadcrumbItem[] = [
		{ label: "Home", labelFa: "خانه", href: "/", isActive: false },
		{
			label: category.nameEn,
			labelFa: category.nameFa,
			href: `/movies/${parentSlug}`,
			isActive: !genreFilter,
		},
	];

	// If genre filter is present, add it to breadcrumbs and config
	if (genreFilter) {
		breadcrumbs.push({
			label: genreFilter,
			labelFa: genreFilter,
			href: `/movies/${parentSlug}?genre=${genreFilter}`,
			isActive: true,
		});
	}

	return (
		<UnifiedCategoryPage
			config={config}
			breadcrumbs={breadcrumbs}
			basePath={`/movies/${parentSlug}`}
			initialFilters={genreFilter ? { genres: [genreFilter] } : undefined}
		/>
	);
}
