/**
 * useTMDBDetails - Fetch detailed movie/series information including images
 */

import { useEffect, useState } from "react";

interface TMDBImage {
	file_path: string;
	width: number;
	height: number;
	aspect_ratio: number;
	vote_average: number;
}

interface TMDBCastMember {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
	order: number;
}

interface TMDBCrewMember {
	id: number;
	name: string;
	job: string;
	department: string;
	profile_path: string | null;
}

interface TMDBMovieDetails {
	id: number;
	title: string;
	original_title: string;
	tagline: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	runtime: number;
	vote_average: number;
	vote_count: number;
	genres: Array<{ id: number; name: string }>;
	production_countries: Array<{ iso_3166_1: string; name: string }>;
	spoken_languages: Array<{ iso_639_1: string; name: string }>;
	budget: number;
	revenue: number;
}

interface TMDBTVDetails {
	id: number;
	name: string;
	original_name: string;
	tagline: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	first_air_date: string;
	last_air_date: string;
	number_of_seasons: number;
	number_of_episodes: number;
	episode_run_time: number[];
	vote_average: number;
	vote_count: number;
	genres: Array<{ id: number; name: string }>;
	production_countries: Array<{ iso_3166_1: string; name: string }>;
	spoken_languages: Array<{ iso_639_1: string; name: string }>;
}

interface TMDBImagesResponse {
	backdrops: TMDBImage[];
	posters: TMDBImage[];
	logos: TMDBImage[];
}

interface TMDBCreditsResponse {
	cast: TMDBCastMember[];
	crew: TMDBCrewMember[];
}

interface TMDBRecommendationsResponse {
	results: Array<{
		id: number;
		title?: string;
		name?: string;
		poster_path: string | null;
		backdrop_path: string | null;
		vote_average: number;
		media_type: string;
	}>;
}

const TMDB_CONFIG = {
	apiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
	baseUrl: "https://api.themoviedb.org/3",
	imageBaseUrl: "https://image.tmdb.org/t/p",
};

function getImageUrl(path: string | null, size = "original"): string {
	if (!path) return "/images/placeholder.jpg";
	return `${TMDB_CONFIG.imageBaseUrl}/${size}${path}`;
}

async function fetchTMDB<T>(endpoint: string): Promise<T> {
	const url = `${TMDB_CONFIG.baseUrl}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${TMDB_CONFIG.apiKey}`;
	const response = await fetch(url);
	if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);
	return response.json();
}

const DEFAULT_LANGUAGE = "fa-IR";

// ============================================================================
// MOVIE DETAILS
// ============================================================================

export function useTMDBMovieDetails(tmdbId: number | null) {
	const [details, setDetails] = useState<TMDBMovieDetails | null>(null);
	const [images, setImages] = useState<TMDBImagesResponse | null>(null);
	const [credits, setCredits] = useState<TMDBCreditsResponse | null>(null);
	const [recommendations, setRecommendations] =
		useState<TMDBRecommendationsResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!tmdbId) return;

		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				const [detailsData, imagesData, creditsData, recommendationsData] =
					await Promise.all([
						fetchTMDB<TMDBMovieDetails>(`/movie/${tmdbId}?language=${DEFAULT_LANGUAGE}`),
						fetchTMDB<TMDBImagesResponse>(
							`/movie/${tmdbId}/images?include_image_language=${DEFAULT_LANGUAGE},en,null`,
						),
						fetchTMDB<TMDBCreditsResponse>(`/movie/${tmdbId}/credits`),
						fetchTMDB<TMDBRecommendationsResponse>(
							`/movie/${tmdbId}/recommendations?language=${DEFAULT_LANGUAGE}`,
						),
					]);

				setDetails(detailsData);
				setImages(imagesData);
				setCredits(creditsData);
				setRecommendations(recommendationsData);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to fetch movie details"),
				);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [tmdbId]);

	return {
		details,
		images,
		credits,
		recommendations,
		loading,
		error,
		getImageUrl,
	};
}

// ============================================================================
// TV DETAILS
// ============================================================================

export function useTMDBTVDetails(tmdbId: number | null) {
	const [details, setDetails] = useState<TMDBTVDetails | null>(null);
	const [images, setImages] = useState<TMDBImagesResponse | null>(null);
	const [credits, setCredits] = useState<TMDBCreditsResponse | null>(null);
	const [recommendations, setRecommendations] =
		useState<TMDBRecommendationsResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!tmdbId) return;

		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				const [detailsData, imagesData, creditsData, recommendationsData] =
					await Promise.all([
						fetchTMDB<TMDBTVDetails>(`/tv/${tmdbId}?language=${DEFAULT_LANGUAGE}`),
						fetchTMDB<TMDBImagesResponse>(
							`/tv/${tmdbId}/images?include_image_language=${DEFAULT_LANGUAGE},en,null`,
						),
						fetchTMDB<TMDBCreditsResponse>(`/tv/${tmdbId}/credits`),
						fetchTMDB<TMDBRecommendationsResponse>(
							`/tv/${tmdbId}/recommendations?language=${DEFAULT_LANGUAGE}`,
						),
					]);

				setDetails(detailsData);
				setImages(imagesData);
				setCredits(creditsData);
				setRecommendations(recommendationsData);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to fetch TV details"),
				);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [tmdbId]);

	return {
		details,
		images,
		credits,
		recommendations,
		loading,
		error,
		getImageUrl,
	};
}
