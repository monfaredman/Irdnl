"use client";

import { useParams, notFound } from "next/navigation";
import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs, getSubGenre } from "@/config/categoryConfigs";
import type { CategoryConfig, CategoryType } from "@/types/category";

export default function AnimeGenrePage() {
	const params = useParams();
	const genre = params.genre as string;
	
	// Validate genre - prevent nested routes and invalid genres
	if (!genre || genre.includes("/")) {
		notFound();
	}
	
	// Get base config and sub-genre info
	const baseConfig = categoryConfigs["anime"];
	const subGenreInfo = getSubGenre("anime", genre);
	
	// If genre is not in valid sub-genres list, return 404
	if (!subGenreInfo) {
		notFound();
	}
	
	// Create modified config for this specific genre
	const config: CategoryConfig = {
		...baseConfig,
		id: "anime" as CategoryType,
		titleFa: subGenreInfo.nameFa,
		titleEn: subGenreInfo.nameEn,
		descriptionFa: `انیمه‌های ${subGenreInfo.nameFa} با زیرنویس فارسی`,
		descriptionEn: `${subGenreInfo.nameEn} anime with Persian subtitles`,
		tmdbParams: {
			...baseConfig.tmdbParams,
			with_genres: subGenreInfo.tmdbGenreId,
		},
	};
	
	const breadcrumbs = generateBreadcrumbs("anime", genre);
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			currentSubGenre={{ slug: genre, nameEn: subGenreInfo.nameEn, nameFa: subGenreInfo.nameFa }}
			basePath={`/anime/${genre}`}
			genreBasePath="/anime"
		/>
	);
}
