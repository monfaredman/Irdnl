"use client";

/**
 * TMDB image helpers
 *
 * We already store full image URLs on our `Movie`/`Series` models as `poster` and `backdrop`.
 * This helper standardizes picking the right image for each widget slot and (when possible)
 * rewrites the TMDB size segment for better perf.
 */

export type TMDBImageKind = "poster" | "backdrop";

// A small subset of TMDB sizes we care about.
// Posters commonly: w342, w500, w780
// Backdrops commonly: w780, w1280, original
export type TMDBPosterSize = "w342" | "w500" | "w780" | "original";
export type TMDBBackdropSize = "w780" | "w1280" | "original";

const DEFAULT_PLACEHOLDER = "/images/placeholder.jpg";

function isTmdbUrl(url: string): boolean {
	return url.includes("image.tmdb.org/t/p/");
}

/**
 * Rewrite an existing TMDB image URL to a different size segment.
 *
 * Input example: https://image.tmdb.org/t/p/w500/abc.jpg
 * Output example: https://image.tmdb.org/t/p/w342/abc.jpg
 */
export function rewriteTmdbSize(url: string, size: string): string {
	if (!url || !isTmdbUrl(url)) return url;
	return url.replace(/(image\.tmdb\.org\/t\/p\/)([^/]+)(\/.*)$/i, `$1${size}$3`);
}

export interface PickWidgetImageInput {
	posterUrl?: string | null;
	backdropUrl?: string | null;
	kind: TMDBImageKind;
	size: TMDBPosterSize | TMDBBackdropSize;
}

export function pickWidgetImage({
	posterUrl,
	backdropUrl,
	kind,
	size,
}: PickWidgetImageInput): string {
	const raw = kind === "backdrop" ? backdropUrl : posterUrl;
	if (!raw) return DEFAULT_PLACEHOLDER;

	// If it's a TMDB URL, rewrite size for perf. Otherwise, return as-is.
	return isTmdbUrl(raw) ? rewriteTmdbSize(raw, size) : raw;
}
