"use client";

import { useMemo, useState } from "react";
import { Box, Card, FormControl, Grid, InputAdornment, MenuItem, Select, Stack, TextField, Typography, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { searchContent } from "@/lib/content";
import { MediaCard } from "@/components/media/MediaCard";
import { movies, series } from "@/data/mockContent";
import type { Genre } from "@/types/media";

const uniqueGenres = Array.from(new Set([...movies, ...series].flatMap((item) => item.genres)));
const years = Array.from(new Set([...movies, ...series].map((item) => item.year))).sort((a, b) => b - a);

export const SearchExperience = () => {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<Genre | "all">("all");
  const [year, setYear] = useState<number | "all">("all");
  const results = useMemo(() => searchContent({ keyword: query, genre, year }), [query, genre, year]);
  const theme = useTheme();

  const glassStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.12)'}`,
  };

  const glassStrongStyle = {
    background: theme.palette.glass?.strong || 'rgba(255, 255, 255, 0.14)',
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    border: `1px solid ${theme.palette.primary.light}80`,
    boxShadow: `0 0 20px rgba(0, 212, 255, 0.4)`,
  };

  const glassSubtleStyle = {
    background: theme.palette.glass?.light || 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    border: `1px solid ${theme.palette.glass?.border || 'rgba(255, 255, 255, 0.12)'}`,
  };

  return (
    <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <TextField
          fullWidth
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, actor, or tag"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              ...glassStyle,
              borderRadius: 3,
              color: '#fff',
              '&:hover': {
                ...glassStrongStyle,
              },
              '&.Mui-focused': {
                ...glassStrongStyle,
              },
              '& fieldset': {
                border: 'none',
              },
              '& input::placeholder': {
                color: 'rgba(255, 255, 255, 0.4)',
              },
            },
          }}
        />
        <FormControl
          sx={{
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              ...glassStyle,
              borderRadius: 3,
              color: '#fff',
              '&:hover': {
                ...glassStrongStyle,
              },
              '&.Mui-focused': {
                ...glassStrongStyle,
              },
              '& fieldset': {
                border: 'none',
              },
            },
            '& .MuiSelect-icon': {
              color: 'rgba(255, 255, 255, 0.6)',
            },
          }}
        >
          <Select
            value={genre}
            onChange={(event) => setGenre(event.target.value as typeof genre)}
            displayEmpty
            aria-label="Filter by genre"
            MenuProps={{
              PaperProps: {
                sx: {
                  background: theme.palette.background.paper,
                  backdropFilter: 'blur(20px)',
                },
              },
            }}
          >
            <MenuItem value="all">All genres</MenuItem>
            {uniqueGenres.map((entry) => (
              <MenuItem key={entry} value={entry}>
                {entry}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              ...glassStyle,
              borderRadius: 3,
              color: '#fff',
              '&:hover': {
                ...glassStrongStyle,
              },
              '&.Mui-focused': {
                ...glassStrongStyle,
              },
              '& fieldset': {
                border: 'none',
              },
              '& .MuiSelect-icon': {
                color: 'rgba(255, 255, 255, 0.6)',
              },
            },
          }}
        >
          <Select
            value={year}
            onChange={(event) => setYear(event.target.value === "all" ? "all" : Number(event.target.value))}
            displayEmpty
            aria-label="Filter by year"
            MenuProps={{
              PaperProps: {
                sx: {
                  background: theme.palette.background.paper,
                  backdropFilter: 'blur(20px)',
                },
              },
            }}
          >
            <MenuItem value="all">All years</MenuItem>
            {years.map((entry) => (
              <MenuItem key={entry} value={entry}>
                {entry}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Stack spacing={6}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
            Movies
          </Typography>
          {results.movies.length ? (
            <Grid container spacing={3}>
              {results.movies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} key={movie.id}>
                  <MediaCard item={movie} type="movie" />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card
              sx={{
                ...glassSubtleStyle,
                borderRadius: 3,
                p: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                No movies match "{query}".
              </Typography>
            </Card>
          )}
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
            Series
          </Typography>
          {results.series.length ? (
            <Grid container spacing={3}>
              {results.series.map((entry) => (
                <Grid item xs={12} sm={6} md={4} key={entry.id}>
                  <MediaCard item={entry} type="series" />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card
              sx={{
                ...glassSubtleStyle,
                borderRadius: 3,
                p: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                No series match "{query}".
              </Typography>
            </Card>
          )}
        </Box>
      </Stack>
    </Box>
  );
};
