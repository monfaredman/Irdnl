"use client";

import { useParams, notFound } from "next/navigation";
import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs, getSubGenre } from "@/config/categoryConfigs";
import type { CategoryConfig, CategoryType } from "@/types/category";

export default function SeriesGenrePage() {
	const params = useParams();
	const genre = params.genre as string;
	
	// Validate genre - prevent nested routes and invalid genres
	if (!genre || genre.includes("/")) {
		notFound();
	}
	
	// Get base config - use series-foreign as base for root series genres
	const baseConfig = categoryConfigs["series-foreign"];
	const subGenreInfo = getSubGenre("series-foreign", genre);
	
	// If genre is not in valid sub-genres list, return 404
	if (!subGenreInfo) {
		notFound();
	}
	
	// Create modified config for this specific genre
	const config: CategoryConfig = {
		...baseConfig,
		id: "series-foreign" as CategoryType,
		titleFa: `سریال‌های ${subGenreInfo.nameFa}`,
		titleEn: `${subGenreInfo.nameEn} Series`,
		descriptionFa: `بهترین سریال‌های ${subGenreInfo.nameFa} از سراسر جهان`,
		descriptionEn: `Best ${subGenreInfo.nameEn} series from around the world`,
		tmdbParams: {
			...baseConfig.tmdbParams,
			with_genres: subGenreInfo.tmdbGenreId,
		},
	};
	
	const breadcrumbs = generateBreadcrumbs("series-foreign", genre);
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			currentSubGenre={{ slug: genre, nameEn: subGenreInfo.nameEn, nameFa: subGenreInfo.nameFa }}
			basePath={`/series/${genre}`}
			genreBasePath="/series"
		/>
	);
}
