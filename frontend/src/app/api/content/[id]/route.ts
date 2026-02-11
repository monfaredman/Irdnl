import { NextRequest, NextResponse } from "next/server";
import type { Movie, Series } from "@/types/media";

const BACKEND_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Transform backend DB content to the Movie/Series format the UI expects.
 * All data comes from our database - no TMDB dependency.
 */
function transformBackendContent(data: any): Movie | Series {
	const base = {
		id: data.id,
		slug: data.id,
		title: data.title || "بدون عنوان",
		description: data.description || "",
		year: data.year || new Date().getFullYear(),
		poster: data.posterUrl || "/images/movies/m_placeholder_1.jpg",
		backdrop: data.bannerUrl || data.backdropUrl || data.posterUrl || "/images/movies/m_placeholder_1.jpg",
		rating: parseFloat(data.rating) || 0,
		genres: data.genres || [],
		languages: data.languages || ["fa"],
		cast: data.cast || [],
		tags: data.tags || [],
		origin: (data.originalLanguage === "fa" || data.country === "IR") ? "iranian" as const : "foreign" as const,
	};

	if (data.type === "series") {
		// Transform backend series.seasons data into the frontend Season[] format
		const rawSeasons = data.series?.seasons || [];
		const transformedSeasons = rawSeasons
			.sort((a: any, b: any) => (a.number || 0) - (b.number || 0))
			.map((season: any) => ({
				id: season.id,
				title: season.title || `فصل ${season.number}`,
				seasonNumber: season.number || 1,
				episodes: (season.episodes || [])
					.sort((a: any, b: any) => (a.number || 0) - (b.number || 0))
					.map((ep: any) => ({
						id: ep.id,
						number: ep.number || undefined,
						title: ep.title || `قسمت ${ep.number}`,
						synopsis: ep.description || "",
						duration: ep.duration ? Math.floor(ep.duration / 60) : 0,
						releaseDate: ep.createdAt || "",
						thumbnail: ep.thumbnailUrl || "/images/movies/m_placeholder_1.jpg",
						sources: [],
						subtitles: [],
						downloads: [],
						externalPlayerUrl: ep.externalPlayerUrl || undefined,
					})),
			}));

		const series: Series = {
			...base,
			seasons: transformedSeasons,
			ongoing: data.status === "published",
			featured: data.featured || false,
			externalPlayerUrl: data.externalPlayerUrl || undefined,
		};
		return series;
	} else {
		const movie: Movie = {
			...base,
			duration: data.duration || 120,
			sources: data.sources || [],
			downloads: data.downloads || [],
			subtitles: (data.subtitles || []).map((s: any, i: number) => ({
				id: `sub-${i}`,
				language: s.language || "fa",
				label: s.label || s.language || "زیرنویس",
				url: s.url || "#",
			})),
			featured: data.featured || false,
			externalPlayerUrl: data.externalPlayerUrl || undefined,
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

		console.log(`[API] Fetching content for ID: ${id} from backend database`);

		// Fetch from backend database only
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
			return NextResponse.json(
				{ error: "Content not found", id },
				{ status: 404 },
			);
		}

		const data = await response.json();
		const transformed = transformBackendContent(data);

		// Rewrite absolute backend URLs to same-origin proxy paths
		// e.g. http://localhost:3001/storage/... → /storage/...
		if ('sources' in transformed && Array.isArray((transformed as any).sources)) {
			(transformed as any).sources = (transformed as any).sources.map((s: any) => ({
				...s,
				url: s.url ? s.url.replace(/^https?:\/\/[^/]+\/storage\//, '/storage/') : s.url,
			}));
		}

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
