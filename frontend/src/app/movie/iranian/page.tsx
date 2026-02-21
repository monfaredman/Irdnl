"use client";

import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs } from "@/config/categoryConfigs";

export default function IranianMoviesPage() {
	const config = categoryConfigs["iranian"] || categoryConfigs["movies-iranian"];
	const breadcrumbs = generateBreadcrumbs("iranian");
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			basePath="/movie/iranian" 
		/>
	);
}
