"use client";

import { useParams, notFound } from "next/navigation";
import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs, getSubGenre } from "@/config/categoryConfigs";
import type { CategoryConfig, CategoryType } from "@/types/category";

export default function DubbedGenrePage() {
	const params = useParams();
	const genre = params.genre as string;
	
	// Validate genre - prevent nested routes and invalid genres
	if (!genre || genre.includes("/")) {
		notFound();
	}
	
	// Get base config and sub-genre info
	const baseConfig = categoryConfigs["dubbed"];
	const subGenreInfo = getSubGenre("dubbed", genre);
	
	// If genre is not in valid sub-genres list, return 404
	if (!subGenreInfo) {
		notFound();
	}
	
	// Create modified config for this specific genre
	const config: CategoryConfig = {
		...baseConfig,
		id: "dubbed" as CategoryType,
		titleFa: subGenreInfo.nameFa,
		titleEn: subGenreInfo.nameEn,
		descriptionFa: `فیلم‌های ${subGenreInfo.nameFa} با دوبله فارسی`,
		descriptionEn: `${subGenreInfo.nameEn} movies with Persian dubbing`,
		tmdbParams: {
			...baseConfig.tmdbParams,
			with_genres: subGenreInfo.tmdbGenreId,
		},
	};
	
	const breadcrumbs = generateBreadcrumbs("dubbed", genre);
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			basePath={`/dubbed/${genre}`}
		/>
	);
}
