"use client";

/**
 * Dynamic Category + Genre Page
 * 
 * Handles URLs like:
 * - /category/action/comedy → shows comedy content in action category
 * - /category/drama/thriller → shows thriller content in drama category
 * 
 * This provides genre-filtered views within any category.
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

export default function CategoryGenrePage() {
	const params = useParams();
	const { language } = useLanguage();

	const categorySlug = params.slug as string;
	const genreSlug = params.genre as string;

	const [category, setCategory] = useState<Category | null>(null);
	const [categoryGenres, setCategoryGenres] = useState<SubGenre[]>([]);
	const [currentGenre, setCurrentGenre] = useState<SubGenre | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);

		(async () => {
			try {
				// Fetch category first
				const cat = await categoriesApi.getBySlug(categorySlug);
				
				if (!cancelled) {
					setCategory(cat);
					
					// Try to fetch genres, but don't fail if it doesn't work
					let subGenres: SubGenre[] = [];
					try {
						const genresRes = await genresApi.list(categorySlug);
						const genres = genresRes.data || [];
						subGenres = genres.map((g: Genre) => ({
							slug: g.slug,
							nameEn: g.nameEn,
							nameFa: g.nameFa,
						}));
					} catch (genreError) {
						// Genres API failed, continue with empty genres
						console.warn("Failed to fetch genres:", genreError);
					}
					
					setCategoryGenres(subGenres);

					// Find the current genre from the list
					// If genres list is empty, create a fallback genre from the slug
					const foundGenre = subGenres.find(g => g.slug === genreSlug);
					if (foundGenre) {
						setCurrentGenre(foundGenre);
					} else if (subGenres.length === 0) {
						// No genres available, create a fallback from slug
						setCurrentGenre({
							slug: genreSlug,
							nameEn: genreSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
							nameFa: genreSlug,
						});
					} else {
						// Genre not found in this category - redirect to category page
						if (typeof window !== 'undefined') {
							window.location.href = `/category/${categorySlug}`;
						}
					}
				}
			} catch (e: any) {
				if (!cancelled) {
					// Category not found - redirect to home
					if (typeof window !== 'undefined') {
						window.location.href = '/';
					}
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => { cancelled = true; };
	}, [categorySlug, genreSlug]);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
				<CircularProgress sx={{ color: "#F59E0B" }} />
			</Box>
		);
	}

	if (error || !category || !currentGenre) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
				<Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
					{language === "fa" ? "دسته‌بندی یا ژانر یافت نشد" : "Category or genre not found"}
				</Typography>
			</Box>
		);
	}

	const config: CategoryConfig = {
		...categoryToConfig(category, categoryGenres),
		// Override title/description to show genre-specific info
		titleFa: `${currentGenre.nameFa} - ${category.nameFa}`,
		titleEn: `${currentGenre.nameEn} - ${category.nameEn}`,
		descriptionFa: `${category.contentType === 'movie' ? 'فیلم‌های' : category.contentType === 'series' ? 'سریال‌های' : 'محتوای'} ${currentGenre.nameFa} در ${category.nameFa}`,
		descriptionEn: `${currentGenre.nameEn} ${category.contentType === 'movie' ? 'movies' : category.contentType === 'series' ? 'series' : 'content'} in ${category.nameEn}`,
	};

	const breadcrumbs: BreadcrumbItem[] = [
		{ label: "Home", labelFa: "خانه", href: "/", isActive: false },
		{
			label: category.nameEn,
			labelFa: category.nameFa,
			href: `/category/${categorySlug}`,
			isActive: false,
		},
		{
			label: currentGenre.nameEn,
			labelFa: currentGenre.nameFa,
			href: `/category/${categorySlug}/${genreSlug}`,
			isActive: true,
		},
	];

	return (
		<UnifiedCategoryPage
			config={config}
			breadcrumbs={breadcrumbs}
			currentSubGenre={currentGenre}
			basePath={`/category/${categorySlug}/${genreSlug}`}
			genreBasePath={`/category/${categorySlug}`}
		/>
	);
}
