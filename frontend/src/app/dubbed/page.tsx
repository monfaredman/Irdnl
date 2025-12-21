"use client";

import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs } from "@/config/categoryConfigs";

export default function DubbedPage() {
	const config = categoryConfigs["dubbed"];
	const breadcrumbs = generateBreadcrumbs("dubbed");
	
	return (
		<UnifiedCategoryPage 
			config={config} 
			breadcrumbs={breadcrumbs} 
			basePath="/dubbed" 
		/>
	);
}
