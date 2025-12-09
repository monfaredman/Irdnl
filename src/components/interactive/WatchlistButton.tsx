"use client";

import { Button, useTheme } from "@mui/material";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import CheckIcon from "@mui/icons-material/Check";
import { useContentStore, type WatchlistItem } from "@/hooks/useContentStore";

interface WatchlistButtonProps {
  mediaId: string;
  payload: WatchlistItem;
}

export const WatchlistButton = ({ mediaId, payload }: WatchlistButtonProps) => {
  const watchlist = useContentStore((state) => state.watchlist);
  const toggleWatchlist = useContentStore((state) => state.toggleWatchlist);
  const isSaved = watchlist.some((item) => item.id === mediaId);
  const theme = useTheme();

  const glassStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.3)'}`,
  };

  const savedStyle = {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}30, ${theme.palette.secondary.main}30)`,
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    border: `1px solid ${theme.palette.primary.light}80`,
    boxShadow: `0 0 15px rgba(0, 212, 255, 0.5)`,
    color: theme.palette.primary.light,
  };

  return (
    <Button
      onClick={() => toggleWatchlist(payload)}
      startIcon={isSaved ? <CheckIcon sx={{ fontSize: 14 }} /> : <BookmarkAddIcon sx={{ fontSize: 14 }} />}
      sx={{
        ...(isSaved ? savedStyle : glassStyle),
        borderRadius: '24px',
        px: 1.75,
        py: 0.75,
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: isSaved ? theme.palette.primary.light : 'rgba(255, 255, 255, 0.8)',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          ...(isSaved ? {} : {
            borderColor: 'rgba(255, 255, 255, 0.5)',
            color: '#fff',
            transform: 'scale(1.1)',
          }),
        },
        '&::before': !isSaved ? {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)',
          transform: 'translateX(-100%)',
          transition: 'transform 0.5s',
        } : {},
        '&:hover::before': !isSaved ? {
          transform: 'translateX(100%)',
        } : {},
      }}
      aria-pressed={isSaved}
    >
      {isSaved ? "Saved" : "Watchlist"}
    </Button>
  );
};
