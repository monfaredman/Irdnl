"use client";

import { useParams } from "next/navigation";
import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs, getSubGenre } from "@/config/categoryConfigs";
import type { CategoryConfig, CategoryType } from "@/types/category";

export default function ForeignMovieGenrePage() {
	const params = useParams();
	const genre = params.genre as string;
	
	// Get base config and sub-genre info
	const baseConfig = categoryConfigs["movies-foreign"];
	const subGenreInfo = getSubGenre("movies-foreign", genre);
	
	// Create modified config for this specific genre
	const config: CategoryConfig = {
		...baseConfig,
		id: "movies-foreign" as CategoryType, // Keep parent category type
		titleFa: subGenreInfo?.nameFa || genre,
		titleEn: subGenreInfo?.nameEn || genre,
		descriptionFa: `فیلم‌های ${subGenreInfo?.nameFa || genre} خارجی با کیفیت بالا`,
		descriptionEn: `High-quality foreign ${subGenreInfo?.nameEn || genre} movies`,
		tmdbParams: {
			...baseConfig.tmdbParams,
			with_genres: subGenreInfo?.tmdbGenreId,
		},
	};
	
	const breadcrumbs = generateBreadcrumbs("movies-foreign", genre);
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			basePath={`/movies/foreign/${genre}`}
		/>
	);
}
