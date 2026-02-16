"use client";

import { useParams } from "next/navigation";
import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs, getSubGenre } from "@/config/categoryConfigs";
import type { CategoryConfig, CategoryType } from "@/types/category";

export default function ForeignMovieGenrePage() {
	const params = useParams();
	const genre = params.genre as string;
	
	// Get base config and sub-genre info
	const baseConfig = categoryConfigs["foreign"] || categoryConfigs["movies-foreign"];
	const subGenreInfo = getSubGenre("foreign", genre) || getSubGenre("movies-foreign", genre);
	
	// Create modified config for this specific genre
	const config: CategoryConfig = {
		...baseConfig,
		id: "foreign" as CategoryType,
		titleFa: subGenreInfo?.nameFa || genre,
		titleEn: subGenreInfo?.nameEn || genre,
		descriptionFa: `فیلم‌های ${subGenreInfo?.nameFa || genre} خارجی با کیفیت بالا`,
		descriptionEn: `High-quality foreign ${subGenreInfo?.nameEn || genre} movies`,
		tmdbParams: {
			...baseConfig.tmdbParams,
			with_genres: subGenreInfo?.tmdbGenreId,
		},
	};
	
	const breadcrumbs = generateBreadcrumbs("foreign", genre);
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			currentSubGenre={{ slug: genre, nameEn: subGenreInfo?.nameEn || genre, nameFa: subGenreInfo?.nameFa || genre }}
			basePath={`/movies/foreign/${genre}`}
			genreBasePath="/movies/foreign"
		/>
	);
}
