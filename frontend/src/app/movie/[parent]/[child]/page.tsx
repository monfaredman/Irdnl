"use client";

/**
 * Dynamic Child Category Page
 * 
 * Handles URLs like:
 * - /movies/foreign/action → فیلم خارجی > اکشن
 * - /movies/foreign/horror → فیلم خارجی > ترسناک
 * - /movies/series/turkish → سریال > سریال ترکی
 * - /movies/other/top-250 → سایر > 250 فیلم برتر IMDb
 * 
 * The child is a sub-category of the parent, both stored in the DB
 * with a parent-child relationship.
 */

import { useParams } from "next/navigation";
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
		contentType: (cat.contentType || "mixed") as "movie" | "series" | "mixed" | "other",
		titleFa: cat.nameFa,
		titleEn: cat.nameEn,
		descriptionFa: cat.descriptionFa || "",
		descriptionEn: cat.descriptionEn || "",
		gradientColors: (cat.gradientColors as [string, string]) || ["#3B82F6", "#1D4ED8"],
		tmdbParams: cat.tmdbParams || {},
		showEpisodes: cat.showEpisodes,
	};
}

export default function ChildCategoryPage() {
	const params = useParams();
	const { language } = useLanguage();

	const parentSlug = params.parent as string;
	const childSlug = params.child as string;

	const [parentCategory, setParentCategory] = useState<Category | null>(null);
	const [childCategory, setChildCategory] = useState<Category | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);

		(async () => {
			try {
				// Fetch child category by parent/child path
				const child = await categoriesApi.getByPath(parentSlug, childSlug);
				if (!cancelled) {
					setChildCategory(child);
					// The parent info may come from the child's parent relation
					if (child.parent) {
						setParentCategory(child.parent);
					} else {
						// Fetch parent separately if not included
						try {
							const parent = await categoriesApi.getByPath(parentSlug);
							setParentCategory(parent);
						} catch {
							// Parent lookup optional
						}
					}
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
	}, [parentSlug, childSlug]);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
				<CircularProgress sx={{ color: "#F59E0B" }} />
			</Box>
		);
	}

	if (error || !childCategory) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
				<Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
					{language === "fa" ? "دسته‌بندی یافت نشد" : "Category not found"}
				</Typography>
			</Box>
		);
	}

	const config = categoryToConfig(childCategory);
	const breadcrumbs: BreadcrumbItem[] = [
		{ label: "Home", labelFa: "خانه", href: "/", isActive: false },
		{
			label: parentCategory?.nameEn || parentSlug,
			labelFa: parentCategory?.nameFa || parentSlug,
			href: `/movie/${parentSlug}`,
			isActive: false,
		},
		{
			label: childCategory.nameEn,
			labelFa: childCategory.nameFa,
			href: `/movie/${parentSlug}/${childSlug}`,
			isActive: true,
		},
	];

	return (
		<UnifiedCategoryPage
			config={config}
			breadcrumbs={breadcrumbs}
			basePath={`/movie/${parentSlug}/${childSlug}`}
		/>
	);
}
