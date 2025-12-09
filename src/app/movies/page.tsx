import type { Metadata } from "next";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { movies } from "@/data/mockContent";
import { MediaCard } from "@/components/media/MediaCard";

export const metadata: Metadata = {
  title: "Movies | PersiaPlay",
};

export default function MoviesPage() {
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
            Movies
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5 }}>
            Browse high-quality Persian cinema with DRM-ready streaming and instant downloads.
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} xl={4} key={movie.id}>
              <MediaCard item={movie} type="movie" />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
