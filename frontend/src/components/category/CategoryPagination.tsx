"use client";

/**
 * CategoryPagination Component
 * 
 * Premium Liquid Glass pagination for category pages
 * Features: Glass number buttons, result count in Persian, shimmer load more
 */

import { Box, Typography, IconButton, Button } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";
import {
  glassBorderRadius,
  glassColors,
  glassAnimations,
} from "@/theme/glass-design-system";
import type { PaginationInfo } from "@/types/category";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface CategoryPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLoadMore?: () => void;
  mode?: "traditional" | "infinite";
  loading?: boolean;
  accentColor?: string;
}

export function CategoryPagination({
  pagination,
  onPageChange,
  onLoadMore,
  mode = "traditional",
  loading = false,
  accentColor = glassColors.persianGold,
}: CategoryPaginationProps) {
  const { language } = useLanguage();
  const isRTL = language === "fa";

  const { currentPage, totalPages, totalItems, itemsPerPage, hasNextPage, hasPrevPage } = pagination;
  
  // Calculate display range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if near start or end
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      // Add ellipsis and middle pages
      if (start > 2) pages.push("ellipsis");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push("ellipsis");
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Format number for Persian
  const formatNumber = (num: number) => {
    return isRTL ? num.toLocaleString("fa-IR") : num.toLocaleString();
  };

  // Result count text
  const resultText = isRTL
    ? `نمایش ${formatNumber(startItem)}-${formatNumber(endItem)} از ${formatNumber(totalItems)} نتیجه`
    : `Showing ${formatNumber(startItem)}-${formatNumber(endItem)} of ${formatNumber(totalItems)} results`;

  // Page button style
  const pageButtonStyle = (isActive: boolean = false) => ({
    minWidth: 40,
    height: 40,
    borderRadius: glassBorderRadius.md,
    background: isActive
      ? `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`
      : glassColors.glass.base,
    border: `1px solid ${isActive ? accentColor : glassColors.glass.border}`,
    color: isActive ? accentColor : glassColors.text.secondary,
    fontSize: "0.875rem",
    fontWeight: isActive ? 600 : 500,
    transition: glassAnimations.transition.spring,
    "&:hover": {
      background: isActive
        ? `linear-gradient(135deg, ${accentColor}50, ${accentColor}30)`
        : glassColors.glass.mid,
      border: `1px solid ${isActive ? accentColor : glassColors.glass.border}`,
      transform: "translateY(-2px)",
    },
    "&:disabled": {
      opacity: 0.3,
      transform: "none",
    },
  });

  // Infinite scroll mode
  if (mode === "infinite") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 4,
        }}
      >
        {/* Result Count */}
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: glassColors.text.tertiary,
          }}
        >
          {resultText}
        </Typography>

        {/* Load More Button */}
        {hasNextPage && (
          <Button
            onClick={onLoadMore}
            disabled={loading}
            endIcon={loading ? null : <ExpandMoreIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: glassBorderRadius.pill,
              background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
              border: `1px solid ${glassColors.glass.border}`,
              color: glassColors.text.primary,
              fontSize: "0.9rem",
              fontWeight: 500,
              textTransform: "none",
              position: "relative",
              overflow: "hidden",
              transition: glassAnimations.transition.spring,
              "&:hover": {
                background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
                border: `1px solid ${accentColor}60`,
                transform: "translateY(-2px)",
              },
              "&::before": loading
                ? {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "200%",
                    height: "100%",
                    background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)`,
                    animation: "shimmer 1.5s infinite",
                  }
                : {},
              "@keyframes shimmer": {
                "0%": { left: "-100%" },
                "100%": { left: "100%" },
              },
            }}
          >
            {loading
              ? (isRTL ? "در حال بارگذاری..." : "Loading...")
              : (isRTL ? "نمایش بیشتر" : "Load More")
            }
          </Button>
        )}

        {/* End of results message */}
        {!hasNextPage && totalItems > 0 && (
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: glassColors.text.muted,
              fontStyle: "italic",
            }}
          >
            {isRTL ? "پایان نتایج" : "End of results"}
          </Typography>
        )}
      </Box>
    );
  }

  // Traditional pagination mode
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        mt: 4,
        p: 3,
        borderRadius: glassBorderRadius.xl,
        background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
        border: `1px solid ${glassColors.glass.border}`,
      }}
    >
      {/* Result Count */}
      <Typography
        sx={{
          fontSize: "0.875rem",
          color: glassColors.text.secondary,
          order: { xs: 2, sm: 1 },
        }}
      >
        {resultText}
      </Typography>

      {/* Page Numbers */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          order: { xs: 1, sm: 2 },
        }}
      >
        {/* First Page */}
        <IconButton
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          sx={pageButtonStyle()}
          aria-label={isRTL ? "صفحه اول" : "First page"}
        >
          {isRTL ? <LastPageIcon fontSize="small" /> : <FirstPageIcon fontSize="small" />}
        </IconButton>

        {/* Previous Page */}
        <IconButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          sx={pageButtonStyle()}
          aria-label={isRTL ? "صفحه قبل" : "Previous page"}
        >
          {isRTL ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) =>
          page === "ellipsis" ? (
            <Box
              key={`ellipsis-${index}`}
              sx={{
                width: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: glassColors.text.muted,
              }}
            >
              ...
            </Box>
          ) : (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              sx={pageButtonStyle(page === currentPage)}
              aria-label={isRTL ? `صفحه ${page}` : `Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {formatNumber(page)}
            </Button>
          )
        )}

        {/* Next Page */}
        <IconButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          sx={pageButtonStyle()}
          aria-label={isRTL ? "صفحه بعد" : "Next page"}
        >
          {isRTL ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
        </IconButton>

        {/* Last Page */}
        <IconButton
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          sx={pageButtonStyle()}
          aria-label={isRTL ? "صفحه آخر" : "Last page"}
        >
          {isRTL ? <FirstPageIcon fontSize="small" /> : <LastPageIcon fontSize="small" />}
        </IconButton>
      </Box>
    </Box>
  );
}

export default CategoryPagination;
