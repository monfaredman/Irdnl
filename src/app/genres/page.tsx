import type { Metadata } from "next";
import { Box, Button, Card, CardContent, Container, Grid, Link, Stack, Typography, useTheme } from "@mui/material";
import { popularGenres } from "@/data/mockContent";

export const metadata: Metadata = {
  title: "Genres | PersiaPlay",
};

export default function GenresPage() {
  const theme = useTheme();

  const glassStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.12)'}`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
  };

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
            Browse
          </Typography>
          <Typography variant="h3" sx={{ fontSize: '1.875rem', fontWeight: 600, color: '#fff', mt: 0.5 }}>
            Genres
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5 }}>
            Jump into curated categories handpicked for Persian audiences.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {popularGenres.map((genre) => (
            <Grid item xs={12} sm={6} lg={4} key={genre.id}>
              <Card
                sx={{
                  ...glassStyle,
                  borderRadius: 4,
                  p: 3,
                  height: '100%',
                  transition: 'all 0.4s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    borderColor: theme.palette.primary.light,
                    boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 0 60px rgba(0, 212, 255, 0.3)`,
                  },
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#fff' }}>
                    {genre.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    High quality {genre.label} titles updated weekly.
                  </Typography>
                  <Button
                    component={Link}
                    href={genre.href}
                    sx={{
                      mt: 2,
                      alignSelf: 'flex-start',
                      color: theme.palette.primary.light,
                      textTransform: 'none',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    View titles ↗
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
