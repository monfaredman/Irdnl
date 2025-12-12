"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Skeleton,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { useLanguage } from "@/providers/language-provider";
import {
  glassColors,
  glassBorderRadius,
  glassAnimations,
  glassBlur,
} from "@/theme/glass-design-system";
import { useTMDBPopularMovies } from "@/hooks/useTMDB";

const translations = {
  en: {
    watchlist: "Watchlist",
    empty: "Your watchlist is empty",
    addSome: "Start adding movies and series to watch later",
    browse: "Browse Content",
    remove: "Remove from list",
    watch: "Watch Now",
    items: "items",
  },
  fa: {
    watchlist: "لیست تماشا",
    empty: "لیست تماشای شما خالی است",
    addSome: "فیلم و سریال‌های مورد علاقه خود را اضافه کنید",
    browse: "مرور محتوا",
    remove: "حذف از لیست",
    watch: "تماشا",
    items: "مورد",
  },
};

export default function WatchlistPage() {
  const { language } = useLanguage();
  const isRTL = language === "fa";
  const t = translations[language] || translations.en;

  const { data: movies, loading } = useTMDBPopularMovies({ language });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Use first 8 movies as mock watchlist
  const watchlistItems = movies?.slice(0, 8) || [];

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Skeleton
          variant="text"
          width={200}
          height={40}
          sx={{ bgcolor: glassColors.glass.base, mb: 3 }}
        />
        <Grid container spacing={2}>
          {[...Array(8)].map((_, i) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
              <Skeleton
                variant="rounded"
                height={280}
                sx={{ bgcolor: glassColors.glass.base, borderRadius: glassBorderRadius.lg }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <BookmarkIcon sx={{ color: glassColors.persianGold, fontSize: "2rem" }} />
        <Typography
          variant="h4"
          sx={{ color: glassColors.text.primary, fontWeight: 700 }}
        >
          {t.watchlist}
        </Typography>
        <Chip
          label={`${watchlistItems.length} ${t.items}`}
          size="small"
          sx={{
            background: glassColors.glass.base,
            color: glassColors.text.secondary,
            border: `1px solid ${glassColors.glass.border}`,
          }}
        />
      </Box>

      {watchlistItems.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
            borderRadius: glassBorderRadius.xl,
            border: `1px solid ${glassColors.glass.border}`,
          }}
        >
          <BookmarkIcon sx={{ fontSize: 80, color: glassColors.text.tertiary, mb: 2 }} />
          <Typography variant="h5" sx={{ color: glassColors.text.primary, mb: 1 }}>
            {t.empty}
          </Typography>
          <Typography sx={{ color: glassColors.text.tertiary, mb: 3 }}>
            {t.addSome}
          </Typography>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Box
              component="span"
              sx={{
                display: "inline-block",
                px: 4,
                py: 1.5,
                borderRadius: glassBorderRadius.lg,
                background: `linear-gradient(135deg, ${glassColors.persianGold}, #D97706)`,
                color: glassColors.black,
                fontWeight: 600,
              }}
            >
              {t.browse}
            </Box>
          </Link>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {watchlistItems.map((item) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.id}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: glassBorderRadius.lg,
                  overflow: "hidden",
                  background: glassColors.glass.base,
                  border: `1px solid ${glassColors.glass.border}`,
                  transition: glassAnimations.transition.spring,
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: `0 16px 48px rgba(0, 0, 0, 0.4)`,
                    "& .overlay": { opacity: 1 },
                  },
                }}
              >
                {/* Image */}
                <Box sx={{ position: "relative", aspectRatio: "2/3" }}>
                  <Image
                    src={item.poster}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 600px) 50vw, 25vw"
                  />

                  {/* Overlay */}
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(to top, ${glassColors.deepMidnight}F0, transparent)`,
                      backdropFilter: `blur(${glassBlur.light})`,
                      opacity: 0,
                      transition: glassAnimations.transition.smooth,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      p: 2,
                    }}
                  >
                    <Link href={`/movies/${item.slug}`} style={{ textDecoration: "none" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          px: 2,
                          py: 1,
                          borderRadius: glassBorderRadius.lg,
                          background: glassColors.persianGold,
                          color: glassColors.black,
                          fontWeight: 600,
                          justifyContent: "center",
                        }}
                      >
                        <PlayArrowIcon />
                        {t.watch}
                      </Box>
                    </Link>
                  </Box>

                  {/* Menu Button */}
                  <IconButton
                    onClick={(e) => handleMenuOpen(e)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      [isRTL ? "left" : "right"]: 8,
                      background: glassColors.glass.strong,
                      backdropFilter: `blur(${glassBlur.light})`,
                      color: glassColors.text.primary,
                      "&:hover": { background: glassColors.glass.mid },
                    }}
                    size="small"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>

                  {/* Rating Badge */}
                  {item.rating && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        [isRTL ? "right" : "left"]: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1,
                        py: 0.5,
                        borderRadius: glassBorderRadius.sm,
                        background: glassColors.glass.strong,
                        backdropFilter: `blur(${glassBlur.light})`,
                      }}
                    >
                      <StarIcon sx={{ fontSize: "0.875rem", color: glassColors.persianGold }} />
                      <Typography sx={{ fontSize: "0.75rem", color: glassColors.text.primary, fontWeight: 600 }}>
                        {item.rating}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Info */}
                <Box sx={{ p: 2 }}>
                  <Typography
                    sx={{
                      color: glassColors.text.primary,
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: glassColors.text.tertiary, fontSize: "0.8rem" }}>
                    {item.year}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: glassColors.glass.strong,
            backdropFilter: `blur(${glassBlur.medium})`,
            border: `1px solid ${glassColors.glass.border}`,
            borderRadius: glassBorderRadius.lg,
          },
        }}
      >
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            color: "#EF4444",
            gap: 1,
            "&:hover": { background: "rgba(239, 68, 68, 0.1)" },
          }}
        >
          <DeleteIcon fontSize="small" />
          {t.remove}
        </MenuItem>
      </Menu>
    </Box>
  );
}
