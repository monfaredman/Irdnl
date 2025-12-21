"use client";

/**
 * Animation Page
 * 
 * Unified category page for animated movies and series
 * Premium Liquid Glass design system
 */

import { UnifiedCategoryPage } from "@/components/category";
import { categoryConfigs, generateBreadcrumbs } from "@/config/categoryConfigs";

export default function AnimationPage() {
  const config = categoryConfigs["animation"];
  const breadcrumbs = generateBreadcrumbs("animation");

  return (
    <UnifiedCategoryPage
      config={config}
      breadcrumbs={breadcrumbs}
      basePath="/animation"
    />
  );
}
