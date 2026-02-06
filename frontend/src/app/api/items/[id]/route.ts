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

/**
 * Transform backend DB content to the ItemData shape the item page expects.
 * All data comes from our database - no TMDB dependency.
 */
function normalizeBackendContent(data: any): ItemData {
	const title = data.title || `Item ${data.id}`;
	const subtitle = data.tagline || data.originalTitle || undefined;

	const poster = data.posterUrl || "";
	const backdrop = data.backdropUrl || data.bannerUrl || "";
	const images = [
		...(backdrop ? [{ src: backdrop, alt: `${title} backdrop` }] : []),
		...(poster ? [{ src: poster, alt: `${title} poster` }] : []),
	].slice(0, 6);

	const genres = (data.genres || []).slice(0, 4);
	const year = data.year;

	const specs: ItemSpecRow[] = [
		...(year ? [{ label: "Year", value: String(year) }] : []),
		...(genres.length ? [{ label: "Genres", value: genres.join(" • ") }] : []),
		...(data.status ? [{ label: "Status", value: data.status }] : []),
		...(data.director ? [{ label: "Director", value: data.director }] : []),
		...(data.country ? [{ label: "Country", value: data.country }] : []),
		...(data.duration ? [{ label: "Duration", value: `${Math.round(data.duration / 60)} min` }] : []),
	];

	return {
		id: String(data.id),
		title,
		subtitle,
		description: (data.description || "").trim() || "",
		price: data.monetization?.price || 0,
		currency: "USD",
		premium: true,
		rating:
			typeof data.rating === "number" || typeof data.rating === "string"
				? Math.round(parseFloat(data.rating) * 10) / 10
				: undefined,
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

	// Fetch from backend database only
	const backendUrl = `${BACKEND_BASE_URL}/content/${encodeURIComponent(id)}`;

	try {
		const res = await fetch(backendUrl, {
			method: "GET",
			headers: { Accept: "application/json" },
			cache: "no-store",
		});

		if (!res.ok) {
			return NextResponse.json(
				{ message: "Item not found" },
				{ status: 404 },
			);
		}

		const payload = await res.json();
		return NextResponse.json(normalizeBackendContent(payload), {
			status: 200,
			headers: { "Cache-Control": "no-store" },
		});
	} catch {
		return NextResponse.json(
			{ message: "Item not found" },
			{ status: 404 },
		);
	}
}
