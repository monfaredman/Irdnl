"use client";

/**
 * CategoryFilterBar Component
 * 
 * Premium Liquid Glass filter bar for category pages
 * Features: Sort options, filter chips, search, view toggle, save presets
 */

import { useState, useCallback } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Popover,
  Slider,
  Collapse,
  Button,
  Tooltip,
} from "@mui/material";
import { useLanguage } from "@/providers/language-provider";
import {
  glassBlur,
  glassBorderRadius,
  glassColors,
  glassAnimations,
  glassStyles,
} from "@/theme/glass-design-system";
import type {
  FilterState,
  SortOption,
  QualityFilter,
  ViewMode,
  sortOptions,
  qualityOptions,
  yearOptions,
} from "@/types/category";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HighQualityIcon from "@mui/icons-material/HighQuality";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SortIcon from "@mui/icons-material/Sort";

interface CategoryFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  availableGenres?: { slug: string; nameEn: string; nameFa: string }[];
  onSavePreset?: () => void;
  accentColor?: string;
}

// Sort options data
const SORT_OPTIONS: { value: SortOption; labelEn: string; labelFa: string }[] = [
  { value: "newest", labelEn: "Newest", labelFa: "جدیدترین" },
  { value: "popular", labelEn: "Most Popular", labelFa: "محبوب‌ترین" },
  { value: "rating", labelEn: "Highest Rated", labelFa: "بهترین امتیاز" },
  { value: "alphabetical", labelEn: "A-Z", labelFa: "الفبایی" },
];

// Quality options data
const QUALITY_OPTIONS: { value: QualityFilter; labelEn: string; labelFa: string }[] = [
  { value: "all", labelEn: "All", labelFa: "همه" },
  { value: "4k", labelEn: "4K", labelFa: "۴K" },
  { value: "hd", labelEn: "HD", labelFa: "HD" },
  { value: "sd", labelEn: "SD", labelFa: "SD" },
];

// Year presets
const YEAR_PRESETS = [
  { label: "2024-Now", labelFa: "۲۰۲۴ تا کنون", range: [2024, 2025] as [number, number] },
  { label: "2020-2024", labelFa: "۲۰۲۰-۲۰۲۴", range: [2020, 2024] as [number, number] },
  { label: "2010-2020", labelFa: "۲۰۱۰-۲۰۲۰", range: [2010, 2020] as [number, number] },
  { label: "2000-2010", labelFa: "۲۰۰۰-۲۰۱۰", range: [2000, 2010] as [number, number] },
  { label: "Classic", labelFa: "کلاسیک", range: [1970, 2000] as [number, number] },
];

export function CategoryFilterBar({
  filters,
  onFilterChange,
  availableGenres = [],
  onSavePreset,
  accentColor = glassColors.persianGold,
}: CategoryFilterBarProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";

  // Popover states
  const [yearAnchor, setYearAnchor] = useState<HTMLElement | null>(null);
  const [qualityAnchor, setQualityAnchor] = useState<HTMLElement | null>(null);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  // Local search state for debouncing
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);

  // Handle search with debounce
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    const timer = setTimeout(() => {
      onFilterChange({ searchQuery: value, page: 1 });
    }, 300);
    return () => clearTimeout(timer);
  }, [onFilterChange]);

  // Clear search
  const handleClearSearch = () => {
    setLocalSearch("");
    onFilterChange({ searchQuery: "", page: 1 });
  };

  // Glass button style
  const glassButtonStyle = (isActive: boolean = false) => ({
    px: 2,
    py: 1,
    borderRadius: glassBorderRadius.pill,
    background: isActive
      ? `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`
      : glassColors.glass.base,
    backdropFilter: "blur(8px)",
    border: `1px solid ${isActive ? accentColor : glassColors.glass.border}`,
    color: isActive ? accentColor : glassColors.text.secondary,
    fontSize: "0.8rem",
    fontWeight: isActive ? 600 : 500,
    cursor: "pointer",
    transition: glassAnimations.transition.spring,
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    whiteSpace: "nowrap",
    "&:hover": {
      background: `linear-gradient(135deg, ${glassColors.glass.mid}, ${glassColors.glass.base})`,
      border: `1px solid ${accentColor}60`,
      transform: "translateY(-1px)",
    },
  });

  // Active filters count
  const activeFiltersCount = [
    filters.yearRange[0] !== 1970 || filters.yearRange[1] !== new Date().getFullYear() + 1,
    filters.quality !== "all",
    filters.genres.length > 0,
    filters.country,
    filters.language,
  ].filter(Boolean).length;

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
        backdropFilter: `blur(${glassBlur.medium})`,
        border: `1px solid ${glassColors.glass.border}`,
        borderRadius: glassBorderRadius.xl,
        p: { xs: 2, md: 3 },
      }}
    >
      <Stack spacing={2}>
        {/* Top Row: Search + View Toggle */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
          }}
        >
          {/* Search Input */}
          <Box sx={{ flex: 1, maxWidth: { md: 400 } }}>
            <TextField
              fullWidth
              size="small"
              placeholder={isRTL ? "جستجو در این دسته‌بندی..." : "Search in this category..."}
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: glassColors.text.tertiary, fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: localSearch && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <CloseIcon sx={{ color: glassColors.text.tertiary, fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: glassColors.glass.base,
                  backdropFilter: "blur(8px)",
                  borderRadius: glassBorderRadius.xl,
                  border: `1px solid ${glassColors.glass.border}`,
                  color: glassColors.text.primary,
                  transition: glassAnimations.transition.spring,
                  "& fieldset": { border: "none" },
                  "&:hover": {
                    border: `1px solid ${glassColors.gold.lighter}`,
                  },
                  "&.Mui-focused": {
                    border: `1px solid ${accentColor}`,
                    boxShadow: `0 0 20px ${accentColor}20`,
                  },
                },
                "& input::placeholder": {
                  color: glassColors.text.tertiary,
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* View Toggle + Save Preset */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* View Mode Toggle */}
            <Box
              sx={{
                display: "flex",
                p: 0.5,
                borderRadius: glassBorderRadius.pill,
                background: glassColors.glass.base,
                border: `1px solid ${glassColors.glass.border}`,
              }}
            >
              <Tooltip title={isRTL ? "نمای شبکه‌ای" : "Grid View"}>
                <IconButton
                  size="small"
                  onClick={() => onFilterChange({ viewMode: "grid" })}
                  sx={{
                    color: filters.viewMode === "grid" ? accentColor : glassColors.text.tertiary,
                    background: filters.viewMode === "grid" ? `${accentColor}20` : "transparent",
                    borderRadius: glassBorderRadius.md,
                    transition: glassAnimations.transition.spring,
                    "&:hover": {
                      background: `${accentColor}15`,
                    },
                  }}
                >
                  <GridViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={isRTL ? "نمای لیستی" : "List View"}>
                <IconButton
                  size="small"
                  onClick={() => onFilterChange({ viewMode: "list" })}
                  sx={{
                    color: filters.viewMode === "list" ? accentColor : glassColors.text.tertiary,
                    background: filters.viewMode === "list" ? `${accentColor}20` : "transparent",
                    borderRadius: glassBorderRadius.md,
                    transition: glassAnimations.transition.spring,
                    "&:hover": {
                      background: `${accentColor}15`,
                    },
                  }}
                >
                  <ViewListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Save Preset Button */}
            {onSavePreset && (
              <Tooltip title={isRTL ? "ذخیره فیلتر" : "Save Filter"}>
                <IconButton
                  size="small"
                  onClick={onSavePreset}
                  sx={{
                    color: glassColors.text.tertiary,
                    border: `1px solid ${glassColors.glass.border}`,
                    borderRadius: glassBorderRadius.md,
                    transition: glassAnimations.transition.spring,
                    "&:hover": {
                      background: `${accentColor}15`,
                      border: `1px solid ${accentColor}40`,
                      color: accentColor,
                    },
                  }}
                >
                  <BookmarkAddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Filter Row: Sort + Filters */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            alignItems: { xs: "stretch", sm: "center" },
            flexWrap: "wrap",
          }}
        >
          {/* Sort Options */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1 }}>
              <SortIcon sx={{ fontSize: 16, color: glassColors.text.tertiary }} />
              <Typography sx={{ fontSize: "0.75rem", color: glassColors.text.tertiary }}>
                {isRTL ? "مرتب‌سازی:" : "Sort:"}
              </Typography>
            </Box>
            {SORT_OPTIONS.map((option) => (
              <Box
                key={option.value}
                onClick={() => onFilterChange({ sort: option.value, page: 1 })}
                sx={glassButtonStyle(filters.sort === option.value)}
              >
                {isRTL ? option.labelFa : option.labelEn}
              </Box>
            ))}
          </Box>

          {/* Divider (Desktop) */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: 1,
              height: 24,
              background: glassColors.glass.border,
              mx: 1,
            }}
          />

          {/* Filter Chips */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            {/* Year Range Filter */}
            <Box
              onClick={(e) => setYearAnchor(e.currentTarget)}
              sx={glassButtonStyle(
                filters.yearRange[0] !== 1970 || filters.yearRange[1] !== new Date().getFullYear() + 1
              )}
            >
              <CalendarTodayIcon sx={{ fontSize: 16 }} />
              {filters.yearRange[0] === 1970 && filters.yearRange[1] === new Date().getFullYear() + 1
                ? (isRTL ? "سال" : "Year")
                : `${filters.yearRange[0]}-${filters.yearRange[1]}`
              }
              <ExpandMoreIcon sx={{ fontSize: 16, ml: 0.5 }} />
            </Box>

            {/* Quality Filter */}
            <Box
              onClick={(e) => setQualityAnchor(e.currentTarget)}
              sx={glassButtonStyle(filters.quality !== "all")}
            >
              <HighQualityIcon sx={{ fontSize: 16 }} />
              {filters.quality === "all"
                ? (isRTL ? "کیفیت" : "Quality")
                : QUALITY_OPTIONS.find(q => q.value === filters.quality)?.[isRTL ? "labelFa" : "labelEn"]
              }
              <ExpandMoreIcon sx={{ fontSize: 16, ml: 0.5 }} />
            </Box>

            {/* More Filters Toggle */}
            <Box
              onClick={() => setMoreFiltersOpen(!moreFiltersOpen)}
              sx={{
                ...glassButtonStyle(activeFiltersCount > 0),
                ...(activeFiltersCount > 0 && {
                  "&::after": {
                    content: `"${activeFiltersCount}"`,
                    position: "absolute",
                    top: -8,
                    right: isRTL ? "auto" : -8,
                    left: isRTL ? -8 : "auto",
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: accentColor,
                    color: glassColors.deepMidnight,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }),
                position: "relative",
              }}
            >
              <TuneIcon sx={{ fontSize: 16 }} />
              {isRTL ? "فیلترهای بیشتر" : "More Filters"}
              <ExpandMoreIcon
                sx={{
                  fontSize: 16,
                  ml: 0.5,
                  transform: moreFiltersOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: glassAnimations.transition.spring,
                }}
              />
            </Box>

            {/* Clear All Filters */}
            {activeFiltersCount > 0 && (
              <Box
                onClick={() => onFilterChange({
                  yearRange: [1970, new Date().getFullYear() + 1],
                  quality: "all",
                  genres: [],
                  country: null,
                  language: null,
                  page: 1,
                })}
                sx={{
                  ...glassButtonStyle(false),
                  color: "#EF4444",
                  borderColor: "#EF444440",
                  "&:hover": {
                    background: "#EF444420",
                    borderColor: "#EF4444",
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
                {isRTL ? "پاک کردن" : "Clear"}
              </Box>
            )}
          </Box>
        </Box>

        {/* Expanded Filters Section */}
        <Collapse in={moreFiltersOpen}>
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${glassColors.glass.border}`,
            }}
          >
            <Stack spacing={2}>
              {/* Genre Filter */}
              {availableGenres.length > 0 && (
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: glassColors.text.tertiary,
                      mb: 1,
                    }}
                  >
                    {isRTL ? "ژانرها" : "Genres"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {availableGenres.map((genre) => {
                      const isActive = filters.genres.includes(genre.slug);
                      return (
                        <Box
                          key={genre.slug}
                          onClick={() => {
                            const newGenres = isActive
                              ? filters.genres.filter(g => g !== genre.slug)
                              : [...filters.genres, genre.slug];
                            onFilterChange({ genres: newGenres, page: 1 });
                          }}
                          sx={glassButtonStyle(isActive)}
                        >
                          {isRTL ? genre.nameFa : genre.nameEn}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Stack>
          </Box>
        </Collapse>
      </Stack>

      {/* Year Range Popover */}
      <Popover
        open={Boolean(yearAnchor)}
        anchorEl={yearAnchor}
        onClose={() => setYearAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 1,
            background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
            backdropFilter: `blur(${glassBlur.strong})`,
            border: `1px solid ${glassColors.glass.border}`,
            borderRadius: glassBorderRadius.lg,
            p: 2.5,
            minWidth: 280,
          },
        }}
      >
        <Typography sx={{ color: glassColors.text.secondary, fontSize: "0.875rem", mb: 2 }}>
          {isRTL ? "بازه سال انتشار" : "Release Year Range"}
        </Typography>
        
        {/* Year Presets */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          {YEAR_PRESETS.map((preset) => {
            const isActive = 
              filters.yearRange[0] === preset.range[0] && 
              filters.yearRange[1] === preset.range[1];
            return (
              <Box
                key={preset.label}
                onClick={() => {
                  onFilterChange({ yearRange: preset.range, page: 1 });
                  setYearAnchor(null);
                }}
                sx={{
                  ...glassButtonStyle(isActive),
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.75rem",
                }}
              >
                {isRTL ? preset.labelFa : preset.label}
              </Box>
            );
          })}
        </Box>

        {/* Custom Range Slider */}
        <Box sx={{ px: 1 }}>
          <Slider
            value={filters.yearRange}
            onChange={(_, value) => onFilterChange({ yearRange: value as [number, number] })}
            onChangeCommitted={() => onFilterChange({ page: 1 })}
            min={1970}
            max={new Date().getFullYear() + 1}
            valueLabelDisplay="auto"
            sx={{
              color: accentColor,
              "& .MuiSlider-thumb": {
                background: accentColor,
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: `0 0 12px ${accentColor}60`,
                },
              },
              "& .MuiSlider-track": {
                background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`,
              },
              "& .MuiSlider-rail": {
                background: glassColors.glass.border,
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography sx={{ color: glassColors.text.tertiary, fontSize: "0.75rem" }}>
              {filters.yearRange[0]}
            </Typography>
            <Typography sx={{ color: glassColors.text.tertiary, fontSize: "0.75rem" }}>
              {filters.yearRange[1]}
            </Typography>
          </Box>
        </Box>
      </Popover>

      {/* Quality Popover */}
      <Popover
        open={Boolean(qualityAnchor)}
        anchorEl={qualityAnchor}
        onClose={() => setQualityAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 1,
            background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
            backdropFilter: `blur(${glassBlur.strong})`,
            border: `1px solid ${glassColors.glass.border}`,
            borderRadius: glassBorderRadius.lg,
            p: 1.5,
          },
        }}
      >
        <Stack spacing={0.5}>
          {QUALITY_OPTIONS.map((option) => {
            const isActive = filters.quality === option.value;
            return (
              <Box
                key={option.value}
                onClick={() => {
                  onFilterChange({ quality: option.value, page: 1 });
                  setQualityAnchor(null);
                }}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: glassBorderRadius.md,
                  background: isActive ? `${accentColor}20` : "transparent",
                  color: isActive ? accentColor : glassColors.text.secondary,
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  transition: glassAnimations.transition.spring,
                  "&:hover": {
                    background: glassColors.glass.mid,
                  },
                }}
              >
                {isRTL ? option.labelFa : option.labelEn}
              </Box>
            );
          })}
        </Stack>
      </Popover>
    </Box>
  );
}

export default CategoryFilterBar;
