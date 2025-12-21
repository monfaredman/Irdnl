"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
	Box,
	Card,
	CircularProgress,
	FormControl,
	InputAdornment,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { MediaCard } from "@/components/media/MediaCard";
import { movies, series } from "@/data/mockContent";
import { contentApi } from "@/lib/api/content";
import { useLanguage } from "@/providers/language-provider";
import type { Movie, Series } from "@/types/media";
import type { Genre } from "@/types/media";

const uniqueGenres = Array.from(
	new Set([...movies, ...series].flatMap((item) => item.genres)),
);
const years = Array.from(
	new Set([...movies, ...series].map((item) => item.year)),
).sort((a, b) => b - a);

export const SearchExperience = () => {
	const [query, setQuery] = useState("");
	const [genre, setGenre] = useState<Genre | "all">("all");
	const [year, setYear] = useState<number | "all">("all");
	const { language } = useLanguage();
	const [moviesResult, setMoviesResult] = useState<Movie[]>([]);
	const [seriesResult, setSeriesResult] = useState<Series[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Backend multi-search results (TMDB). We still keep the genre/year dropdowns
	// for now by filtering the returned items client-side.
	useEffect(() => {
		const trimmed = query.trim();
		if (!trimmed) {
			setMoviesResult([]);
			setSeriesResult([]);
			setError(null);
			setLoading(false);
			return;
		}

		let cancelled = false;
		const handle = setTimeout(async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await contentApi.search({
					q: trimmed,
					language: language === "fa" ? "fa" : "en",
					page: 1,
				});
				if (cancelled) return;
				setMoviesResult(response.movies);
				setSeriesResult(response.series);
			} catch (err) {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : "Search failed");
				setMoviesResult([]);
				setSeriesResult([]);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}, 450);

		return () => {
			cancelled = true;
			clearTimeout(handle);
		};
	}, [query, language]);

	const results = useMemo(() => {
		const filterByGenre = <T extends Movie | Series>(items: T[]) =>
			genre === "all" ? items : items.filter((item) => item.genres.includes(genre));

		const filterByYear = <T extends Movie | Series>(items: T[]) =>
			year === "all" ? items : items.filter((item) => item.year === year);

		return {
			movies: filterByYear(filterByGenre(moviesResult)),
			series: filterByYear(filterByGenre(seriesResult)),
		};
	}, [moviesResult, seriesResult, genre, year]);
	const theme = useTheme();

	const glassStyle = {
		background: theme.palette.glass?.light || "rgba(255, 255, 255, 0.06)",
		backdropFilter: "blur(20px) saturate(180%)",
		WebkitBackdropFilter: "blur(20px) saturate(180%)",
		border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.12)"}`,
	};

	const glassStrongStyle = {
		background: theme.palette.glass?.strong || "rgba(255, 255, 255, 0.14)",
		backdropFilter: "blur(30px) saturate(180%)",
		WebkitBackdropFilter: "blur(30px) saturate(180%)",
		border: `1px solid ${theme.palette.primary.light}80`,
		boxShadow: `0 0 20px rgba(0, 212, 255, 0.4)`,
	};

	const glassSubtleStyle = {
		background: theme.palette.glass?.light || "rgba(255, 255, 255, 0.03)",
		backdropFilter: "blur(10px) saturate(180%)",
		WebkitBackdropFilter: "blur(10px) saturate(180%)",
		border: `1px solid ${theme.palette.glass?.border || "rgba(255, 255, 255, 0.12)"}`,
	};

	return (
		<Box
			component="section"
			sx={{ display: "flex", flexDirection: "column", gap: 4 }}
		>
			<Stack direction="row" spacing={2} flexWrap="wrap">
				<TextField
					fullWidth
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Search by title, actor, or tag"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon sx={{ color: "rgba(255, 255, 255, 0.6)" }} />
							</InputAdornment>
						),
					}}
					sx={{
						flex: 1,
						minWidth: 200,
						"& .MuiOutlinedInput-root": {
							...glassStyle,
							borderRadius: 3,
							color: "#fff",
							"&:hover": {
								...glassStrongStyle,
							},
							"&.Mui-focused": {
								...glassStrongStyle,
							},
							"& fieldset": {
								border: "none",
							},
							"& input::placeholder": {
								color: "rgba(255, 255, 255, 0.4)",
							},
						},
					}}
				/>
				<FormControl
					sx={{
						minWidth: 150,
						"& .MuiOutlinedInput-root": {
							...glassStyle,
							borderRadius: 3,
							color: "#fff",
							"&:hover": {
								...glassStrongStyle,
							},
							"&.Mui-focused": {
								...glassStrongStyle,
							},
							"& fieldset": {
								border: "none",
							},
						},
						"& .MuiSelect-icon": {
							color: "rgba(255, 255, 255, 0.6)",
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
									backdropFilter: "blur(20px)",
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
						"& .MuiOutlinedInput-root": {
							...glassStyle,
							borderRadius: 3,
							color: "#fff",
							"&:hover": {
								...glassStrongStyle,
							},
							"&.Mui-focused": {
								...glassStrongStyle,
							},
							"& fieldset": {
								border: "none",
							},
							"& .MuiSelect-icon": {
								color: "rgba(255, 255, 255, 0.6)",
							},
						},
					}}
				>
					<Select
						value={year}
						onChange={(event) =>
							setYear(
								event.target.value === "all"
									? "all"
									: Number(event.target.value),
							)
						}
						displayEmpty
						aria-label="Filter by year"
						MenuProps={{
							PaperProps: {
								sx: {
									background: theme.palette.background.paper,
									backdropFilter: "blur(20px)",
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
				{error && (
					<Card
						sx={{
							...glassSubtleStyle,
							borderRadius: 3,
							p: 2,
							textAlign: "center",
						}}
					>
						<Typography variant="body2" sx={{ color: "rgba(255, 100, 100, 0.9)" }}>
							{error}
						</Typography>
					</Card>
				)}
				{loading && query.trim() && (
					<Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
						<CircularProgress size={22} />
					</Box>
				)}
				<Box>
					<Typography
						variant="h5"
						sx={{ fontWeight: 600, color: "#fff", mb: 2 }}
					>
						Movies
					</Typography>
					{results.movies.length ? (
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: {
									xs: "1fr",
									sm: "repeat(2, 1fr)",
									md: "repeat(3, 1fr)",
								},
								gap: 3,
							}}
						>
							{results.movies.map((movie) => (
								<MediaCard key={movie.id} item={movie} type="movie" />
							))}
						</Box>
					) : (
						<Card
							sx={{
								...glassSubtleStyle,
								borderRadius: 3,
								p: 2,
								textAlign: "center",
							}}
						>
							<Typography
								variant="body2"
								sx={{ color: "rgba(255, 255, 255, 0.7)" }}
							>
								No movies match &ldquo;{query}&rdquo;.
							</Typography>
						</Card>
					)}
				</Box>
				<Box>
					<Typography
						variant="h5"
						sx={{ fontWeight: 600, color: "#fff", mb: 2 }}
					>
						Series
					</Typography>
					{results.series.length ? (
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: {
									xs: "1fr",
									sm: "repeat(2, 1fr)",
									md: "repeat(3, 1fr)",
								},
								gap: 3,
							}}
						>
							{results.series.map((entry) => (
								<MediaCard key={entry.id} item={entry} type="series" />
							))}
						</Box>
					) : (
						<Card
							sx={{
								...glassSubtleStyle,
								borderRadius: 3,
								p: 2,
								textAlign: "center",
							}}
						>
							<Typography
								variant="body2"
								sx={{ color: "rgba(255, 255, 255, 0.7)" }}
							>
								No series match &ldquo;{query}&rdquo;.
							</Typography>
						</Card>
					)}
				</Box>
			</Stack>
		</Box>
	);
};
