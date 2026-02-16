"use client";

/**
 * Dubbed Page (Persian Dubbed)
 * 
 * Unified category page for dubbed movies and series
 * Premium Liquid Glass design system — same style as animation/anime pages
 */

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
      genreBasePath="/dubbed"
    />
  );
}
