import { NextRequest, NextResponse } from "next/server";
import type { Movie, Series, Season, Episode } from "@/types/media";

const BACKEND_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Check if ID is a TMDB ID (numeric)
function isTMDBId(id: string): boolean {
	return /^\d+$/.test(id);
}

// Transform TMDB data to Movie/Series format
function transformTMDBContent(data: any, mediaType: "movie" | "tv"): Movie | Series {
	const base = {
		id: String(data.id),
		slug: String(data.id),
		title: data.title || data.name || "Unknown Title",
		description: data.overview || "No description available",
		year: data.release_date
			? new Date(data.release_date).getFullYear()
			: data.first_air_date
			? new Date(data.first_air_date).getFullYear()
			: 2023,
		poster: data.poster_path
			? `https://image.tmdb.org/t/p/w500${data.poster_path}`
			: "/images/movies/m_placeholder_1.jpg",
		backdrop: data.backdrop_path
			? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
			: "/images/movies/m_placeholder_1.jpg",
		rating: data.vote_average || 0,
		genres: (data.genres || [])
			.map((g: any) => g.name.toLowerCase().replace(/\s+/g, '-'))
			.filter((g: string) => ["action", "drama", "comedy", "romance", "thriller", "mystery", "horror", "sci-fi", "fantasy", "animation", "documentary", "adventure", "historical", "family"].includes(g))
			.slice(0, 3),
		languages: ["en" as const],
		cast: [],
		tags: [],
		origin: "foreign" as const,
	};

	if (mediaType === "tv") {
		const series: Series = {
			...base,
			seasons: [],
			ongoing: data.status === "Returning Series",
			featured: false,
		};
		return series;
	} else {
		const movie: Movie = {
			...base,
			duration: data.runtime || 120,
			sources: [],
			downloads: [],
			subtitles: [],
			featured: false,
		};
		return movie;
	}
}

// Transform backend content to Movie/Series format
function transformBackendContent(data: any): Movie | Series {
	const base = {
		id: data.id,
		slug: data.id,
		title: data.title,
		description: data.description,
		year: data.year,
		poster: data.posterUrl || "/images/movies/m_placeholder_1.jpg",
		backdrop: data.bannerUrl || data.posterUrl || "/images/movies/m_placeholder_1.jpg",
		rating: parseFloat(data.rating) || 0,
		genres: [],
		languages: ["fa" as const],
		cast: [],
		tags: [],
		origin: "iranian" as const,
	};

	if (data.type === "series") {
		// Transform to Series
		const series: Series = {
			...base,
			seasons: [],
			ongoing: data.status === "published",
			featured: false,
		};
		return series;
	} else {
		// Transform to Movie
		const movie: Movie = {
			...base,
			duration: data.videoAssets?.[0]?.duration || 120,
			sources: [],
			downloads: [],
			subtitles: [],
			featured: false,
		};
		return movie;
	}
}

export async function GET(
	request: NextRequest,
	context: { params: Promise<{ id: string }> },
) {
	try {
		const params = await context.params;
		const { id } = params;

		// Validate ID
		if (!id || id === "undefined") {
			return NextResponse.json(
				{ error: "Invalid ID", id },
				{ status: 400 },
			);
		}

		console.log(`[API] Fetching content for ID: ${id}`);

		// Check if this is a TMDB ID (numeric)
		if (isTMDBId(id)) {
			console.log(`[API] Detected TMDB ID: ${id}, fetching from TMDB...`);
			
			// Try movie first
			try {
				const movieUrl = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`;
				console.log(`[API] Trying TMDB movie endpoint...`);
				const movieResponse = await fetch(movieUrl, {
					method: "GET",
					headers: { Accept: "application/json" },
					cache: "no-store",
					signal: AbortSignal.timeout(5000), // 5 second timeout
				});

				if (movieResponse.ok) {
					const movieData = await movieResponse.json();
					const transformed = transformTMDBContent(movieData, "movie");
					console.log(`[API] Successfully fetched movie: ${transformed.title}`);
					return NextResponse.json(transformed, { status: 200 });
				}
			} catch (e) {
				console.log(`[API] TMDB movie request failed:`, e instanceof Error ? e.message : 'Unknown error');
			}

			// Try TV series
			try {
				const tvUrl = `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`;
				console.log(`[API] Trying TMDB TV endpoint...`);
				const tvResponse = await fetch(tvUrl, {
					method: "GET",
					headers: { Accept: "application/json" },
					cache: "no-store",
					signal: AbortSignal.timeout(5000), // 5 second timeout
				});

				if (tvResponse.ok) {
					const tvData = await tvResponse.json();
					const transformed = transformTMDBContent(tvData, "tv");
					console.log(`[API] Successfully fetched TV series: ${transformed.title}`);
					return NextResponse.json(transformed, { status: 200 });
				}
			} catch (e) {
				console.log(`[API] TMDB TV request failed:`, e instanceof Error ? e.message : 'Unknown error');
			}

			// If TMDB ID but not found or network error, return mock data
			console.log(`[API] TMDB ID ${id} not found or network error, returning mock data`);
			
			// Create mock data for TMDB ID
			const mockMovie: Movie = {
				id: id,
				slug: id,
				title: `TMDB Movie #${id}`,
				description: `This is mock data for TMDB ID ${id}. TMDB API is currently unavailable or the content doesn't exist. Please check your network connection or try a different ID.`,
				year: 2024,
				poster: "/images/movies/m_placeholder_1.jpg",
				backdrop: "/images/movies/m_placeholder_1.jpg",
				rating: 7.5,
				genres: ["drama"],
				languages: ["en"],
				cast: [],
				tags: ["tmdb", "placeholder"],
				origin: "foreign",
				duration: 120,
				sources: [],
				downloads: [],
				subtitles: [],
				featured: false,
			};
			
			return NextResponse.json(mockMovie, { status: 200 });
		}

		// Try to fetch from backend (UUID format)
		console.log(`[API] Detected UUID/backend ID: ${id}, fetching from backend...`);
		const backendUrl = `${BACKEND_BASE_URL}/content/${id}`;
		const response = await fetch(backendUrl, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			cache: "no-store",
		});

		if (!response.ok) {
			// If backend doesn't have it, return 404
			return NextResponse.json(
				{ error: "Content not found", id },
				{ status: 404 },
			);
		}

		const data = await response.json();
		const transformed = transformBackendContent(data);

		return NextResponse.json(transformed, { status: 200 });
	} catch (error) {
		console.error("Error fetching content:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch content",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
