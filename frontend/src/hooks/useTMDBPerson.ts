/**
 * useTMDBPerson - Fetch detailed person/cast information from TMDB
 */

import { useEffect, useState } from "react";

interface TMDBPersonDetails {
	id: number;
	name: string;
	biography: string;
	birthday: string | null;
	deathday: string | null;
	place_of_birth: string | null;
	profile_path: string | null;
	known_for_department: string;
	popularity: number;
	also_known_as: string[];
	homepage: string | null;
	external_ids?: {
		imdb_id: string | null;
		facebook_id: string | null;
		instagram_id: string | null;
		twitter_id: string | null;
	};
}

interface TMDBCombinedCredits {
	cast: Array<{
		id: number;
		title?: string;
		name?: string;
		original_title?: string;
		original_name?: string;
		character?: string;
		poster_path: string | null;
		backdrop_path: string | null;
		vote_average: number;
		vote_count: number;
		release_date?: string;
		first_air_date?: string;
		media_type: "movie" | "tv";
		genre_ids: number[];
	}>;
	crew: Array<{
		id: number;
		title?: string;
		name?: string;
		original_title?: string;
		original_name?: string;
		department: string;
		job: string;
		poster_path: string | null;
		backdrop_path: string | null;
		vote_average: number;
		vote_count: number;
		release_date?: string;
		first_air_date?: string;
		media_type: "movie" | "tv";
		genre_ids: number[];
	}>;
}

interface TMDBPersonImages {
	profiles: Array<{
		file_path: string;
		width: number;
		height: number;
		aspect_ratio: number;
		vote_average: number;
		vote_count: number;
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
// PERSON DETAILS HOOK
// ============================================================================

export function useTMDBPerson(personId: number | null) {
	const [details, setDetails] = useState<TMDBPersonDetails | null>(null);
	const [credits, setCredits] = useState<TMDBCombinedCredits | null>(null);
	const [images, setImages] = useState<TMDBPersonImages | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!personId) return;

		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				// Fetch person details with external IDs
				const [detailsData, creditsData, imagesData] = await Promise.all([
					fetchTMDB<TMDBPersonDetails>(
						`/person/${personId}?language=${DEFAULT_LANGUAGE}&append_to_response=external_ids`,
					),
					fetchTMDB<TMDBCombinedCredits>(
						`/person/${personId}/combined_credits?language=${DEFAULT_LANGUAGE}`,
					),
					fetchTMDB<TMDBPersonImages>(`/person/${personId}/images`),
				]);

				setDetails(detailsData);
				setCredits(creditsData);
				setImages(imagesData);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to fetch person details"),
				);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [personId]);

	// Helper: Get top N most popular works
	const getKnownFor = (count = 6) => {
		if (!credits) return [];
		
		const allWorks = [...credits.cast, ...credits.crew.map(c => ({
			...c,
			character: c.job,
		}))];

		return allWorks
			.sort((a, b) => b.vote_count - a.vote_count)
			.slice(0, count);
	};

	// Helper: Get filmography sorted by date
	const getFilmography = (mediaType?: "movie" | "tv", department?: string) => {
		if (!credits) return [];

		let works = [...credits.cast];
		if (department) {
			works = [...works, ...credits.crew.filter(c => c.department === department)];
		}

		if (mediaType) {
			works = works.filter(w => w.media_type === mediaType);
		}

		return works.sort((a, b) => {
			const dateA = a.release_date || a.first_air_date || "0";
			const dateB = b.release_date || b.first_air_date || "0";
			return dateB.localeCompare(dateA);
		});
	};

	// Helper: Calculate age
	const getAge = () => {
		if (!details?.birthday) return null;
		const endDate = details.deathday ? new Date(details.deathday) : new Date();
		const birthDate = new Date(details.birthday);
		let age = endDate.getFullYear() - birthDate.getFullYear();
		const monthDiff = endDate.getMonth() - birthDate.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	return {
		details,
		credits,
		images,
		loading,
		error,
		getImageUrl,
		getKnownFor,
		getFilmography,
		getAge,
	};
}
