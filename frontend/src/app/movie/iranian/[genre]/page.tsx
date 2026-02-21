"use client";

import { useParams } from "next/navigation";
import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs, getSubGenre } from "@/config/categoryConfigs";
import type { CategoryConfig, CategoryType } from "@/types/category";

export default function IranianMovieGenrePage() {
	const params = useParams();
	const genre = params.genre as string;
	
	// Get base config and sub-genre info
	const baseConfig = categoryConfigs["iranian"] || categoryConfigs["movies-iranian"];
	const subGenreInfo = getSubGenre("iranian", genre) || getSubGenre("movies-iranian", genre);
	
	// Create modified config for this specific genre
	const config: CategoryConfig = {
		...baseConfig,
		id: "iranian" as CategoryType,
		titleFa: subGenreInfo?.nameFa || genre,
		titleEn: subGenreInfo?.nameEn || genre,
		descriptionFa: `فیلم‌های ${subGenreInfo?.nameFa || genre} ایرانی`,
		descriptionEn: `Iranian ${subGenreInfo?.nameEn || genre} movies`,
		tmdbParams: {
			...baseConfig.tmdbParams,
			with_genres: subGenreInfo?.tmdbGenreId,
		},
	};
	
	const breadcrumbs = generateBreadcrumbs("iranian", genre);
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			currentSubGenre={{ slug: genre, nameEn: subGenreInfo?.nameEn || genre, nameFa: subGenreInfo?.nameFa || genre }}
			basePath={`/movie/iranian/${genre}`}
			genreBasePath="/movie/iranian"
		/>
	);
}
