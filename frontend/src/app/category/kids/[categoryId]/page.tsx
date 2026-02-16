"use client";

/**
 * Kids Category Detail Page
 * Shows content for a specific kids category (animals, educational, etc.)
 */

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import StarIcon from "@mui/icons-material/Star";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/providers/language-provider";
import {
  glassBlur,
  glassBorderRadius,
  glassColors,
} from "@/theme/glass-design-system";
import {
  useKidsCategoryContent,
  KIDS_CATEGORIES,
} from "@/hooks/useKidsContent";

export default function KidsCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const categoryId = params.categoryId as string;

  const category = KIDS_CATEGORIES.find((c) => c.id === categoryId);
  const { movies, series, loading } = useKidsCategoryContent(categoryId);

  const allItems = [...movies, ...series];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${glassColors.deepMidnight} 0%, #1a1a2e 50%, ${glassColors.deepMidnight} 100%)`,
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: glassBorderRadius.xxl,
            background: `linear-gradient(135deg, ${category?.color || glassColors.persianGold}30, ${glassColors.glass.mid})`,
            backdropFilter: glassBlur.strong,
            border: `1px solid ${category?.color || glassColors.persianGold}40`,
            position: "relative",
            overflow: "hidden",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <IconButton
            onClick={() => router.push("/category/kids")}
            sx={{
              position: "absolute",
              top: 16,
              [isRTL ? "right" : "left"]: 16,
              background: glassColors.glass.mid,
              color: glassColors.text.primary,
              "&:hover": { background: glassColors.glass.strong },
            }}
          >
            <ArrowBackIcon sx={{ transform: isRTL ? "scaleX(-1)" : "none" }} />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, mt: 2 }}>
            <Typography sx={{ fontSize: "2.5rem" }}>
              {category?.icon || "🎬"}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: glassColors.text.primary,
              }}
            >
              {isRTL ? category?.nameFa || categoryId : category?.nameEn || categoryId}
            </Typography>
          </Box>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: category?.color || glassColors.persianGold }} />
          </Box>
        )}

        {/* Empty */}
        {!loading && allItems.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              borderRadius: glassBorderRadius.lg,
              background: glassColors.glass.mid,
              border: `1px solid ${glassColors.glass.border}`,
            }}
          >
            <ChildCareIcon sx={{ fontSize: 64, color: glassColors.text.tertiary, mb: 2 }} />
            <Typography sx={{ color: glassColors.text.secondary }}>
              {isRTL ? "محتوایی در این دسته‌بندی موجود نیست" : "No content in this category"}
            </Typography>
          </Box>
        )}

        {/* Content Grid */}
        {!loading && allItems.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 2.5,
            }}
          >
            {allItems.map((item: any) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    borderRadius: glassBorderRadius.lg,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.08)",
                    border: `2px solid rgba(255,255,255,0.15)`,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-6px) scale(1.02)",
                      boxShadow: `0 12px 30px ${category?.color || "#F59E0B"}30`,
                      borderColor: category?.color || glassColors.persianGold,
                    },
                  }}
                >
                  {/* Poster */}
                  <Box sx={{ position: "relative", aspectRatio: "2/3" }}>
                    <Image
                      src={item.poster || item.posterUrl || item.backdrop || item.backdropUrl || "/images/placeholder.jpg"}
                      alt={item.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    {item.rating && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          background: "rgba(0,0,0,0.7)",
                          borderRadius: "8px",
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <StarIcon sx={{ color: "#F59E0B", fontSize: 14 }} />
                        <Typography sx={{ color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}>
                          {Number(item.rating).toFixed(1)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Info */}
                  <Box sx={{ p: 1.5 }}>
                    <Typography
                      sx={{
                        color: glassColors.text.primary,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        direction: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: glassColors.text.tertiary,
                        fontSize: "0.75rem",
                      }}
                    >
                      {item.year} • {item.type === "series" ? (isRTL ? "سریال" : "Series") : (isRTL ? "فیلم" : "Movie")}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
