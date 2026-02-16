"use client";

/**
 * Collections Page - مجموعه‌ها
 * 
 * Premium Liquid Glass design showcasing curated movie collections
 * Connected to backend collections API
 */

import CollectionsIcon from "@mui/icons-material/Collections";
import MovieIcon from "@mui/icons-material/Movie";
import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collectionsApi, type Collection } from "@/lib/api/public";
import { useLanguage } from "@/providers/language-provider";
import {
  glassBlur,
  glassBorderRadius,
  glassColors,
} from "@/theme/glass-design-system";

const translations = {
  en: {
    title: "Special Collections",
    subtitle: "Organized by franchise, theme, and cinematic universes",
    allCollections: "All Collections",
    movies: "movies",
    empty: "No collections available yet.",
    loading: "Loading collections...",
  },
  fa: {
    title: "مجموعه‌های ویژه",
    subtitle: "دسته‌بندی شده بر اساس فرنچایز، تم و دنیاها",
    allCollections: "همه مجموعه‌ها",
    movies: "فیلم",
    empty: "هنوز مجموعه‌ای موجود نیست.",
    loading: "در حال بارگذاری...",
  },
};

// Fallback colors for collection cards
const cardColors = ["#E23636", "#0476F2", "#FFE81F", "#7F0909", "#D4AF37", "#FF6B00", "#00C853", "#AA00FF"];

export default function CollectionsPage() {
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const t = translations[language];

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await collectionsApi.list();
        if (!cancelled) setCollections(res.data || []);
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${glassColors.deepMidnight} 0%, 
          #1a1a2e 50%, 
          ${glassColors.deepMidnight} 100%)`,
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Hero Section */}
        <Box
          sx={{
            mb: 6,
            p: { xs: 4, sm: 6 },
            borderRadius: glassBorderRadius.xxl,
            background: `linear-gradient(135deg, ${glassColors.gold.lighter}, ${glassColors.glass.mid})`,
            backdropFilter: glassBlur.strong,
            border: `1px solid ${glassColors.glass.border}`,
            position: "relative",
            overflow: "hidden",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <CollectionsIcon
                sx={{
                  fontSize: 48,
                  color: glassColors.persianGold,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.white})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.title}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: glassColors.text.secondary,
                maxWidth: 800,
              }}
            >
              {t.subtitle}
            </Typography>
          </Box>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: glassColors.persianGold }} />
          </Box>
        )}

        {/* Empty state */}
        {!loading && collections.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 3,
              borderRadius: glassBorderRadius.lg,
              background: glassColors.glass.mid,
              backdropFilter: glassBlur.medium,
              border: `1px solid ${glassColors.glass.border}`,
            }}
          >
            <Typography sx={{ color: glassColors.text.secondary, direction: isRTL ? "rtl" : "ltr" }}>
              {t.empty}
            </Typography>
          </Box>
        )}

        {/* Collections Grid */}
        {!loading && collections.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                fontWeight: 800,
                color: glassColors.text.primary,
                direction: isRTL ? "rtl" : "ltr",
              }}
            >
              {t.allCollections}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {collections.map((collection, idx) => {
                const color = cardColors[idx % cardColors.length];
                return (
                  <Link
                    key={collection.id}
                    href={`/category/collections/${collection.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        borderRadius: glassBorderRadius.xl,
                        overflow: "hidden",
                        height: 280,
                        background: collection.backdropUrl
                          ? "none"
                          : `linear-gradient(135deg, ${color}20, ${color}10)`,
                        backdropFilter: glassBlur.medium,
                        border: `1px solid ${color}40`,
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: `0 20px 40px ${color}30`,
                          border: `1px solid ${color}60`,
                        },
                      }}
                    >
                      {/* Backdrop image */}
                      {collection.backdropUrl && (
                        <Image
                          src={collection.backdropUrl}
                          alt={isRTL ? collection.titleFa || collection.title : collection.title}
                          fill
                          style={{ objectFit: "cover", opacity: 0.4 }}
                        />
                      )}

                      {/* Content */}
                      <Box
                        sx={{
                          position: "relative",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: 3,
                          zIndex: 1,
                        }}
                      >
                        {/* Icon */}
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: glassColors.glass.mid,
                            backdropFilter: glassBlur.medium,
                            border: `1px solid ${glassColors.glass.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          <CollectionsIcon sx={{ color, fontSize: 24 }} />
                        </Box>

                        {/* Title */}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 800,
                              color: glassColors.text.primary,
                              mb: 1,
                              direction: isRTL ? "rtl" : "ltr",
                            }}
                          >
                            {isRTL ? collection.titleFa || collection.title : collection.title}
                          </Typography>

                          {collection.contentIds?.length > 0 && (
                            <Chip
                              icon={<MovieIcon />}
                              label={`${collection.contentIds.length} ${t.movies}`}
                              size="small"
                              sx={{
                                background: glassColors.glass.mid,
                                backdropFilter: glassBlur.medium,
                                border: `1px solid ${glassColors.glass.border}`,
                                color: glassColors.text.primary,
                                "& .MuiChip-icon": { color },
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Link>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
