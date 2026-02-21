"use client";

import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs } from "@/config/categoryConfigs";

export default function ForeignSeriesPage() {
	const config = categoryConfigs["series-foreign"];
	const breadcrumbs = generateBreadcrumbs("series-foreign");
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			basePath="/movie/serie/foreign" 
		/>
	);
}
