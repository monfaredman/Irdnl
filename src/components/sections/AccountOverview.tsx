"use client";

import Link from "next/link";
import { Box, Card, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useContentStore } from "@/hooks/useContentStore";
import { QualitySelector } from "@/components/interactive/QualitySelector";
import { SubtitleSelector } from "@/components/interactive/SubtitleSelector";
import { movies, series } from "@/data/mockContent";

const findName = (mediaId: string) =>
  movies.find((movie) => movie.id === mediaId)?.title ||
  series.find((entry) => entry.id === mediaId)?.title ||
  mediaId;

export const AccountOverview = () => {
  const watchlist = useContentStore((state) => state.watchlist);
  const favorites = useContentStore((state) => state.favorites);
  const history = useContentStore((state) => state.viewingHistory);
  const theme = useTheme();

  const glassStrongStyle = {
    background: theme.palette.glass?.strong || 'rgba(255, 255, 255, 0.14)',
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.borderStrong || 'rgba(255, 255, 255, 0.18)'}`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
  };

  const glassSubtleStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.12)'}`,
  };

  const glassStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.12)'}`,
  };

  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Card sx={{ ...glassStrongStyle, borderRadius: 4, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
          Watchlist
        </Typography>
        {watchlist.length ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 1.5,
            }}
          >
            {watchlist.map((item) => (
              <Card
                key={item.id}
                component={Link}
                href={`/${item.type === "movie" ? "movies" : "series"}/${item.slug}`}
                sx={{
                  ...glassSubtleStyle,
                  borderRadius: 3,
                  px: 2,
                  py: 1.5,
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  '&:hover': {
                    ...glassStyle,
                    transform: 'scale(1.02)',
                    '& .title': {
                      color: theme.palette.primary.light,
                    },
                  },
                }}
              >
                <Typography
                  className="title"
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    transition: 'color 0.3s',
                  }}
                >
                  {item.title}
                </Typography>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Save a title to curate your personal list.
          </Typography>
        )}
      </Card>

      <Card sx={{ ...glassStrongStyle, borderRadius: 4, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
          Favorites
        </Typography>
        {favorites.length ? (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {favorites.map((favorite) => (
              <Chip
                key={favorite}
                label={findName(favorite)}
                sx={{
                  ...glassStyle,
                  borderRadius: '24px',
                  px: 1.5,
                  py: 0.75,
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: `${theme.palette.primary.light}80`,
                    color: theme.palette.primary.light,
                    transform: 'scale(1.05)',
                  },
                }}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Tap the heart icon on any title to favorite it.
          </Typography>
        )}
      </Card>

      <Card sx={{ ...glassStrongStyle, borderRadius: 4, p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                color: 'rgba(255, 255, 255, 0.6)',
                mb: 1.5,
                display: 'block',
              }}
            >
              Playback quality
            </Typography>
            <QualitySelector />
          </Box>
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                color: 'rgba(255, 255, 255, 0.6)',
                mb: 1.5,
                display: 'block',
              }}
            >
              Subtitle default
            </Typography>
            <SubtitleSelector />
          </Box>
        </Stack>
      </Card>

      <Card sx={{ ...glassStrongStyle, borderRadius: 4, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
          Watch history
        </Typography>
        {history.length ? (
          <Stack spacing={1}>
            {history.map((entry) => {
              const percent = entry.duration ? Math.round((entry.progress / entry.duration) * 100) : 0;
              return (
                <Card
                  key={`${entry.mediaId}-${entry.episodeId ?? "movie"}`}
                  sx={{
                    ...glassSubtleStyle,
                    borderRadius: 3,
                    px: 2,
                    py: 1.5,
                    transition: 'all 0.3s',
                    '&:hover': {
                      ...glassStyle,
                      '& .title': {
                        color: '#fff',
                      },
                    },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography
                      className="title"
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        transition: 'color 0.3s',
                      }}
                    >
                      {findName(entry.mediaId)}
                    </Typography>
                    <Chip
                      label={`${percent}%`}
                      size="small"
                      sx={{
                        ...glassSubtleStyle,
                        borderRadius: '24px',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: theme.palette.primary.light,
                      }}
                    />
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Play anything to begin tracking.
          </Typography>
        )}
      </Card>
    </Box>
  );
};
