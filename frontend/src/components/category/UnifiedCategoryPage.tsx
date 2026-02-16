"use client";

/**
 * UnifiedCategoryPage Component
 * 
 * Main unified page component for all genre/category pages
 * Combines: Hero, FilterBar, ContentGrid, Sidebar, Pagination, EmptyState
 */

import { useState, useCallback } from "react";
import { Box, Container, Stack, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";
import {
  glassBlur,
  glassBorderRadius,
  glassColors,
} from "@/theme/glass-design-system";
import type { CategoryConfig, BreadcrumbItem, SubGenre, FilterState } from "@/types/category";
import { useCategoryContent, useCategorySidebar } from "@/hooks/useCategoryContent";
import { CategoryHero } from "./CategoryHero";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { CategoryContentGrid } from "./CategoryContentGrid";
import { CategorySidebar } from "./CategorySidebar";
import { CategoryPagination } from "./CategoryPagination";
import { CategoryEmptyState } from "./CategoryEmptyState";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

interface UnifiedCategoryPageProps {
  config: CategoryConfig;
  breadcrumbs: BreadcrumbItem[];
  currentSubGenre?: SubGenre;
  basePath: string;
  /** Path used for genre pill links. Defaults to basePath if not provided. */
  genreBasePath?: string;
  initialFilters?: Partial<FilterState>;
  paginationMode?: "traditional" | "infinite";
}

export function UnifiedCategoryPage({
  config,
  breadcrumbs,
  currentSubGenre,
  basePath,
  genreBasePath,
  initialFilters,
  paginationMode = "traditional",
}: UnifiedCategoryPageProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // Mobile sidebar state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Fetch content
  const {
    items,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refetch,
  } = useCategoryContent(config, currentSubGenre?.slug, initialFilters);

  // Fetch sidebar data
  const { data: sidebarData, loading: sidebarLoading } = useCategorySidebar(
    config,
    currentSubGenre?.slug
  );

  // Available genres for filter
  const availableGenres = config.subGenres?.map((g) => ({
    slug: g.slug,
    nameEn: g.nameEn,
    nameFa: g.nameFa,
  })) || [];

  // The path used for genre pill links - always the parent category path (no genre suffix)
  const effectiveGenreBasePath = genreBasePath || basePath;

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    updateFilters({ page });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateFilters]);

  // Handle load more (infinite scroll)
  const handleLoadMore = useCallback(() => {
    updateFilters({ page: filters.page + 1 });
  }, [filters.page, updateFilters]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    updateFilters({
      yearRange: [1970, new Date().getFullYear() + 1],
      quality: "all",
      genres: [],
      country: null,
      language: null,
      searchQuery: "",
      page: 1,
    });
  }, [updateFilters]);

  // Check if filters are active
  const hasActiveFilters =
    filters.yearRange[0] !== 1970 ||
    filters.yearRange[1] !== new Date().getFullYear() + 1 ||
    filters.quality !== "all" ||
    filters.genres.length > 0 ||
    filters.searchQuery !== "";

  // Get accent color from config
  const accentColor = config.gradientColors[0];

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Hero Section */}
          <CategoryHero
            config={config}
            breadcrumbs={breadcrumbs}
            currentSubGenre={currentSubGenre}
            totalResults={pagination.totalItems}
            basePath={effectiveGenreBasePath}
          />

          {/* Main Content Area */}
          <Box
            sx={{
              display: "flex",
              gap: 4,
              alignItems: "flex-start",
            }}
          >
            {/* Left/Main Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack spacing={4}>
                {/* Filter Bar */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "stretch",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <CategoryFilterBar
                      filters={filters}
                      onFilterChange={updateFilters}
                      availableGenres={availableGenres}
                      accentColor={accentColor}
                    />
                  </Box>

                  {/* Mobile Sidebar Toggle */}
                  {isMobile && (
                    <Tooltip title={isRTL ? "فیلترهای بیشتر" : "More Filters"}>
                      <IconButton
                        onClick={() => setMobileSidebarOpen(true)}
                        sx={{
                          width: 56,
                          borderRadius: glassBorderRadius.xl,
                          background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
                          backdropFilter: `blur(${glassBlur.medium})`,
                          border: `1px solid ${glassColors.glass.border}`,
                          color: glassColors.text.secondary,
                          "&:hover": {
                            background: glassColors.glass.mid,
                            color: accentColor,
                          },
                        }}
                      >
                        <MenuOpenIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {/* Content Grid or Empty State */}
                {error ? (
                  <CategoryEmptyState
                    type="error"
                    basePath={effectiveGenreBasePath}
                    suggestedGenres={availableGenres.slice(0, 5)}
                    accentColor={accentColor}
                  />
                ) : items.length === 0 && !loading ? (
                  <CategoryEmptyState
                    type={hasActiveFilters ? "no-results" : "no-content"}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                    basePath={effectiveGenreBasePath}
                    suggestedGenres={availableGenres.slice(0, 5)}
                    accentColor={accentColor}
                  />
                ) : (
                  <CategoryContentGrid
                    items={items}
                    viewMode={filters.viewMode}
                    loading={loading}
                    accentColor={accentColor}
                  />
                )}

                {/* Pagination */}
                {items.length > 0 && (
                  <CategoryPagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onLoadMore={handleLoadMore}
                    mode={paginationMode}
                    loading={loading}
                    accentColor={accentColor}
                  />
                )}
              </Stack>
            </Box>

            {/* Sidebar (Desktop) */}
            <CategorySidebar
              data={sidebarData}
              loading={sidebarLoading}
              accentColor={accentColor}
              basePath={effectiveGenreBasePath}
              mobileOpen={mobileSidebarOpen}
              onMobileClose={() => setMobileSidebarOpen(false)}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default UnifiedCategoryPage;
