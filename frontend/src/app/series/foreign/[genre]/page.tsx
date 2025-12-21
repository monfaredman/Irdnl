"use client";

import { useParams } from "next/navigation";
import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs, getSubGenre } from "@/config/categoryConfigs";
import type { CategoryConfig, CategoryType } from "@/types/category";

export default function ForeignSeriesGenrePage() {
	const params = useParams();
	const genre = params.genre as string;
	
	// Get base config and sub-genre info
	const baseConfig = categoryConfigs["series-foreign"];
	const subGenreInfo = getSubGenre("series-foreign", genre);
	
	// Create modified config for this specific genre
	const config: CategoryConfig = {
		...baseConfig,
		id: "series-foreign" as CategoryType, // Keep parent category type
		titleFa: subGenreInfo?.nameFa || genre,
		titleEn: subGenreInfo?.nameEn || genre,
		descriptionFa: `سریال‌های ${subGenreInfo?.nameFa || genre} خارجی با کیفیت بالا`,
		descriptionEn: `High-quality foreign ${subGenreInfo?.nameEn || genre} series`,
		tmdbParams: {
			...baseConfig.tmdbParams,
			with_genres: subGenreInfo?.tmdbGenreId,
		},
	};
	
	const breadcrumbs = generateBreadcrumbs("series-foreign", genre);
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			basePath={`/series/foreign/${genre}`}
		/>
	);
}
