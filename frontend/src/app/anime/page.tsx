"use client";

import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs } from "@/config/categoryConfigs";

export default function AnimePage() {
	const config = categoryConfigs["anime"];
	const breadcrumbs = generateBreadcrumbs("anime");
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			basePath="/anime" 
		/>
	);
}
