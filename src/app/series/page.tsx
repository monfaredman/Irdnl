"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { series } from "@/data/mockContent";
import { MediaCard } from "@/components/media/MediaCard";

export default function SeriesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box component="header">
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.75rem',
              letterSpacing: '0.4em',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            Catalog
          </Typography>
          <Typography variant="h3" sx={{ fontSize: '1.875rem', fontWeight: 600, color: '#fff', mt: 0.5 }}>
            Series
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5 }}>
            Follow episodic adventures with seamless season switching and playback memory.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              xl: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {series.map((entry) => (
            <MediaCard key={entry.id} item={entry} type="series" />
          ))}
        </Box>
      </Stack>
    </Container>
  );
}
