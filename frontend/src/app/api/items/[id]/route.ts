import { NextResponse } from "next/server";

export type ItemSpecRow = { label: string; value: string };

// This is the shape the PremiumLiquidGlass item page expects.
export type ItemData = {
	id: string;
	title: string;
	subtitle?: string;
	description: string;
	price: number;
	currency: string;
	premium: boolean;
	rating?: number;
	reviewCount?: number;
	availability: "in-stock" | "preorder" | "out-of-stock";
	images: Array<{ src: string; alt: string }>;
	specs: ItemSpecRow[];
};

const BACKEND_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type TMDBDetails = {
	id: number;
	title?: string;
	name?: string;
	overview?: string;
	tagline?: string;
	poster_path?: string | null;
	backdrop_path?: string | null;
	vote_average?: number;
	vote_count?: number;
	release_date?: string;
	first_air_date?: string;
	status?: string;
	genres?: Array<{ id: number; name: string }>;
	production_countries?: Array<{ iso_3166_1: string; name: string }>;
};

function isTmdbDetails(value: unknown): value is TMDBDetails {
	return (
		typeof value === "object" &&
		value !== null &&
		"id" in value &&
		typeof (value as { id?: unknown }).id === "number"
	);
}

function tmdbImage(path?: string | null, size: "w500" | "original" = "w500") {
	if (!path) return "";
	const base =
		process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
	return `${base}/${size}${path}`;
}

function normalizeToItemData(source: TMDBDetails): ItemData {
	const title = source.title ?? source.name ?? `Item ${source.id}`;
	const subtitle = source.tagline || undefined;

	const poster = tmdbImage(source.poster_path, "w500");
	const backdrop = tmdbImage(source.backdrop_path, "original");
	const images = [
		...(backdrop
			? [{ src: backdrop, alt: `${title} backdrop` }]
			: []),
		...(poster ? [{ src: poster, alt: `${title} poster` }] : []),
	].slice(0, 6);

	const genres = (source.genres || []).slice(0, 4).map((g) => g.name);
	const release = source.release_date || source.first_air_date || "";
	const year = release ? new Date(release).getFullYear() : undefined;

	const specs: ItemSpecRow[] = [
		...(year ? [{ label: "Year", value: String(year) }] : []),
		...(genres.length ? [{ label: "Genres", value: genres.join(" • ") }] : []),
		...(source.status ? [{ label: "Status", value: source.status }] : []),
	];

	return {
		id: String(source.id),
		title,
		subtitle,
		description: source.overview || "No description available.",
		// Pricing is app-specific (not TMDB). Use a deterministic placeholder until you
		// store prices in DB.
		price: 0,
		currency: "USD",
		premium: true,
		rating:
			typeof source.vote_average === "number"
				? Math.round(source.vote_average * 10) / 10
				: undefined,
		reviewCount:
			typeof source.vote_count === "number" ? source.vote_count : undefined,
		availability: "in-stock",
		images: images.length
			? images
			: [{ src: "/images/movies/m_placeholder_1.jpg", alt: title }],
		specs,
	};
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	// 1) Prefer the Nest backend as the source of truth.
	//    We try both:
	//    - GET /content/:id (DB-backed content)
	//    - GET /content/tmdb/details/:id        (if your backend exposes it)
	//    - GET /content/tmdb/details/:type/:id  (if your backend exposes it)
	const backendCandidates = [
		`${BACKEND_BASE_URL}/content/${encodeURIComponent(id)}`,
		`${BACKEND_BASE_URL}/content/tmdb/details/${encodeURIComponent(id)}`,
		`${BACKEND_BASE_URL}/content/tmdb/details/movie/${encodeURIComponent(id)}`,
		`${BACKEND_BASE_URL}/content/tmdb/details/tv/${encodeURIComponent(id)}`,
	];

	for (const url of backendCandidates) {
		try {
			const res = await fetch(url, {
				method: "GET",
				headers: { Accept: "application/json" },
				cache: "no-store",
			});

			if (res.status === 404) continue;
			if (!res.ok) {
				// Backend is reachable but errored; don't loop forever.
				break;
			}

			const payload = (await res.json()) as unknown;

			// If backend already returns this shape, pass it through.
			if (
				typeof payload === "object" &&
				payload !== null &&
				"title" in payload &&
				"description" in payload
			) {
				return NextResponse.json(payload, {
					status: 200,
					headers: { "Cache-Control": "no-store" },
				});
			}

			// If backend returns a raw TMDB details object, normalize it.
			if (isTmdbDetails(payload)) {
				return NextResponse.json(normalizeToItemData(payload), {
					status: 200,
					headers: { "Cache-Control": "no-store" },
				});
			}
		} catch {
			// Ignore and try next candidate (backend down or URL not found)
		}
	}

	// 2) Fallback: Fetch directly from TMDB using the server-side environment.
	//    We try movie then tv. (This keeps working even if Nest is down.)
	const tmdbBase =
		process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";
	const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";

	if (tmdbApiKey) {
		const tmdbCandidates = [
			`${tmdbBase}/movie/${encodeURIComponent(id)}?api_key=${encodeURIComponent(tmdbApiKey)}&language=en-US`,
			`${tmdbBase}/tv/${encodeURIComponent(id)}?api_key=${encodeURIComponent(tmdbApiKey)}&language=en-US`,
		];

		for (const url of tmdbCandidates) {
			const res = await fetch(url, {
				method: "GET",
				headers: { Accept: "application/json" },
				cache: "no-store",
			});
			if (res.status === 404) continue;
			if (!res.ok) break;
			const payload = (await res.json()) as unknown;
			if (isTmdbDetails(payload)) {
				return NextResponse.json(normalizeToItemData(payload), {
					status: 200,
					headers: { "Cache-Control": "no-store" },
				});
			}
		}
	}

	return NextResponse.json(
		{ message: "Item not found" },
		{
			status: 404,
		},
	);
}
