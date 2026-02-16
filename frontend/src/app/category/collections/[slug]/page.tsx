"use client";

/**
 * Collection Detail Page
 * Shows all content items within a specific collection
 */

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CollectionsIcon from "@mui/icons-material/Collections";
import StarIcon from "@mui/icons-material/Star";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collectionsApi, type Collection } from "@/lib/api/public";
import { useLanguage } from "@/providers/language-provider";
import {
  glassBlur,
  glassBorderRadius,
  glassColors,
} from "@/theme/glass-design-system";

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const slug = params.slug as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await collectionsApi.getBySlug(slug);
        if (!cancelled) setCollection(res);
      } catch {
        // not found
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: glassColors.persianGold }} />
      </Box>
    );
  }

  if (!collection) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ color: glassColors.text.secondary }}>
          {isRTL ? "مجموعه یافت نشد" : "Collection not found"}
        </Typography>
      </Box>
    );
  }

  const contents = collection.contents || [];

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
            background: `linear-gradient(135deg, ${glassColors.gold.lighter}, ${glassColors.glass.mid})`,
            backdropFilter: glassBlur.strong,
            border: `1px solid ${glassColors.glass.border}`,
            position: "relative",
            overflow: "hidden",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          {/* Back button */}
          <IconButton
            onClick={() => router.push("/category/collections")}
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, mt: 2 }}>
            <CollectionsIcon sx={{ fontSize: 40, color: glassColors.persianGold }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                background: `linear-gradient(135deg, ${glassColors.persianGold}, ${glassColors.white})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {isRTL ? collection.titleFa || collection.title : collection.title}
            </Typography>
          </Box>
          {(collection.description || collection.descriptionFa) && (
            <Typography sx={{ color: glassColors.text.secondary, maxWidth: 800 }}>
              {isRTL ? collection.descriptionFa || collection.description : collection.description}
            </Typography>
          )}
          <Typography sx={{ color: glassColors.text.tertiary, mt: 1 }}>
            {contents.length} {isRTL ? "محتوا" : "items"}
          </Typography>
        </Box>

        {/* Content Grid */}
        {contents.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              borderRadius: glassBorderRadius.lg,
              background: glassColors.glass.mid,
              border: `1px solid ${glassColors.glass.border}`,
            }}
          >
            <Typography sx={{ color: glassColors.text.secondary }}>
              {isRTL ? "محتوایی در این مجموعه موجود نیست" : "No content in this collection"}
            </Typography>
          </Box>
        ) : (
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
            {contents.map((item: any) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    borderRadius: glassBorderRadius.lg,
                    overflow: "hidden",
                    background: glassColors.glass.mid,
                    border: `1px solid ${glassColors.glass.border}`,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: `0 12px 30px rgba(245,158,11,0.15)`,
                      borderColor: glassColors.persianGold,
                    },
                  }}
                >
                  {/* Poster */}
                  <Box sx={{ position: "relative", aspectRatio: "2/3" }}>
                    <Image
                      src={item.posterUrl || item.backdropUrl || "/images/placeholder.jpg"}
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
