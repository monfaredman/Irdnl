"use client";

import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs } from "@/config/categoryConfigs";

export default function IranianSeriesPage() {
	const config = categoryConfigs["series-iranian"];
	const breadcrumbs = generateBreadcrumbs("series-iranian");
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			basePath="/series/iranian" 
		/>
	);
}
