"use client";

import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs } from "@/config/categoryConfigs";

export default function SeriesPage() {
	// Use foreign series config as default for main series page
	const config = categoryConfigs["series-foreign"];
	const breadcrumbs = generateBreadcrumbs("series-foreign");
	
	return (
		<UnifiedCategoryPage 
			config={{
				...config,
				titleFa: "سریال‌ها",
				titleEn: "Series",
				descriptionFa: "تمام سریال‌ها با کیفیت بالا و زیرنویس فارسی",
				descriptionEn: "All series with high quality and Persian subtitles",
			}} 
			breadcrumbs={[
				{ label: "Home", labelFa: "خانه", href: "/", isActive: false },
				{ label: "Series", labelFa: "سریال‌ها", href: "/series", isActive: true },
			]} 
			basePath="/series" 
		/>
	);
}
