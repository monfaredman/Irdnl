import type { Metadata } from "next";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { series } from "@/data/mockContent";
import { MediaCard } from "@/components/media/MediaCard";

export const metadata: Metadata = {
  title: "Series | PersiaPlay",
};

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
        <Grid container spacing={3}>
          {series.map((entry) => (
            <Grid item xs={12} sm={6} xl={4} key={entry.id}>
              <MediaCard item={entry} type="series" />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
