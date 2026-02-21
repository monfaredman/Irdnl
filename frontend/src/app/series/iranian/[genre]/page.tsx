"use client";

import { useParams } from "next/navigation";
import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs, getSubGenre } from "@/config/categoryConfigs";
import type { CategoryConfig, CategoryType } from "@/types/category";

export default function IranianSeriesGenrePage() {
	const params = useParams();
	const genre = params.genre as string;
	
	// Get base config and sub-genre info
	const baseConfig = categoryConfigs["series-iranian"];
	const subGenreInfo = getSubGenre("series-iranian", genre);
	
	// Create modified config for this specific genre
	const config: CategoryConfig = {
		...baseConfig,
		id: "series-iranian" as CategoryType, // Keep parent category type
		titleFa: subGenreInfo?.nameFa || genre,
		titleEn: subGenreInfo?.nameEn || genre,
		descriptionFa: `سریال‌های ${subGenreInfo?.nameFa || genre} ایرانی`,
		descriptionEn: `Iranian ${subGenreInfo?.nameEn || genre} series`,
		tmdbParams: {
			...baseConfig.tmdbParams,
			with_genres: subGenreInfo?.tmdbGenreId,
		},
	};
	
	const breadcrumbs = generateBreadcrumbs("series-iranian", genre);
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			currentSubGenre={{ slug: genre, nameEn: subGenreInfo?.nameEn || genre, nameFa: subGenreInfo?.nameFa || genre }}
			basePath={`/serie/iranian/${genre}`}
			genreBasePath="/serie/iranian"
		/>
	);
}
