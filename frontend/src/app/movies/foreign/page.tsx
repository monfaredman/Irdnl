"use client";

import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs } from "@/config/categoryConfigs";

export default function ForeignMoviesPage() {
	const config = categoryConfigs["movies-foreign"];
	const breadcrumbs = generateBreadcrumbs("movies-foreign");
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			basePath="/movies/foreign" 
		/>
	);
}
