"use client";

import { useParams, notFound } from "next/navigation";
import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs, getSubGenre } from "@/config/categoryConfigs";
import type { CategoryConfig, CategoryType } from "@/types/category";

/**
 * Dynamic Series Page (/serie/korean, /serie/turkish, /serie/drama, etc.)
 * This route handles the singular form "/serie" URLs
 * It can handle both:
 * 1. Series category slugs (korean, turkish) - maps to series-korean, series-turkish configs
 * 2. Series genre slugs (drama, comedy, etc.) - uses series-foreign as base with genre filter
 */
export default function SeriePage() {
	const params = useParams();
	const slug = params.slug as string;
	
	// Validate slug - prevent nested routes and invalid slugs
	if (!slug || slug.includes("/")) {
		notFound();
	}
	
	// First, try to match as a direct category config (e.g., "korean" -> "series-korean")
	const directCategoryId = `series-${slug}` as CategoryType;
	const directConfig = categoryConfigs[directCategoryId];
	
	if (directConfig) {
		// Found a direct category match (korean, turkish, etc.)
		const breadcrumbs = [
			{ label: "Home", labelFa: "خانه", href: "/" },
			{ label: "Series", labelFa: "سریال", href: "/series" },
			{ label: directConfig.titleEn, labelFa: directConfig.titleFa, href: `/serie/${slug}` },
		];
		
		return (
			<UnifiedCategoryPage 
				config={directConfig} 
				breadcrumbs={breadcrumbs}
				basePath={`/serie/${slug}`}
				genreBasePath="/series"
			/>
		);
	}
	
	// Second, try to match as a sub-genre of series-foreign (e.g., "drama", "comedy")
	const subGenreInfo = getSubGenre("series-foreign", slug);
	
	if (subGenreInfo) {
		// Found a valid sub-genre
		const baseConfig = categoryConfigs["series-foreign"];
		
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
		
		const breadcrumbs = generateBreadcrumbs("series-foreign", slug);
		
		return (
			<UnifiedCategoryPage 
				config={config} 
				breadcrumbs={breadcrumbs} 
				currentSubGenre={{ slug, nameEn: subGenreInfo.nameEn, nameFa: subGenreInfo.nameFa }}
				basePath={`/serie/${slug}`}
				genreBasePath="/series"
			/>
		);
	}
	
	// Neither a category nor a valid sub-genre - return 404
	notFound();
}
