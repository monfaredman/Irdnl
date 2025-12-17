import type { Metadata } from "next";
import { Box, Container, Stack, Typography } from "@mui/material";
import { SearchExperience } from "@/components/sections/SearchExperience";

export const metadata: Metadata = {
  title: "Search | irdnl",
  description: "Search across irdnl's Persian movies and series catalog with filters for genre and year.",
};

export default function SearchPage() {
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
            Discover
          </Typography>
          <Typography variant="h3" sx={{ fontSize: '1.875rem', fontWeight: 600, color: '#fff', mt: 0.5 }}>
            Search the library
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5 }}>
            Keyword search with real-time filters for genre, release year, and tags. Prefetch kicks in when browsing episodes.
          </Typography>
        </Box>
        <SearchExperience />
      </Stack>
    </Container>
  );
}
