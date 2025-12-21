"use client";

import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs } from "@/config/categoryConfigs";

export default function IranianMoviesPage() {
	const config = categoryConfigs["movies-iranian"];
	const breadcrumbs = generateBreadcrumbs("movies-iranian");
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			basePath="/movies/iranian" 
		/>
	);
}
