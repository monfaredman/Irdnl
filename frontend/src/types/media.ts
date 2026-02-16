export type MediaType = "movie" | "series" | "episode";

/**
 * Access types for video content:
 * - free: Free content played in-site with our own player
 * - subscription: Upera subscription-based content (اشتراکی)
 * - single_purchase: Upera single-purchase content (تک فروشی)
 * - traffic: Upera traffic-based content (ترافیک)
 */
export type AccessType = "free" | "subscription" | "single_purchase" | "traffic";

export type Genre =
	| "action"
	| "drama"
	| "comedy"
	| "romance"
	| "thriller"
	| "mystery"
	| "horror"
	| "sci-fi"
	| "fantasy"
	| "animation"
	| "documentary"
	| "adventure"
	| "historical"
	| "family";

export type LanguageCode = "fa" | "en";

export interface SubtitleTrack {
	id: string;
	language: LanguageCode;
	label: string;
	url: string;
}

export interface StreamSource {
	quality: string;
	url: string;
	format?: "HLS" | "DASH" | "MP4";
	type?: "hls" | "dash" | "mp4";
	drm?: "widevine" | "fairplay" | "playready";
}

export interface DownloadLink {
	quality: string;
	size: string;
	url: string;
	premium?: boolean;
}

export interface MediaPerson {
	id: string;
	name: string;
	role: "actor" | "director" | "writer";
}

export interface Episode {
	id: string;
	number?: number;
	title: string;
	synopsis: string;
	duration: number;
	releaseDate: string;
	thumbnail: string;
	sources: StreamSource[];
	subtitles: SubtitleTrack[];
	downloads: DownloadLink[];
	externalPlayerUrl?: string;
}

export interface Season {
	id: string;
	title: string;
	seasonNumber: number;
	episodes: Episode[];
}

export interface MediaBase {
	id: string;
	slug: string;
	title: string;
	description: string;
	year: number;
	rating: number;
	poster: string;
	backdrop: string;
	genres: Genre[];
	languages: LanguageCode[];
	cast: MediaPerson[];
	tags: string[];
	origin?: "iranian" | "foreign";
	accessType?: AccessType;
}

export interface Movie extends MediaBase {
	duration: number;
	sources: StreamSource[];
	downloads: DownloadLink[];
	subtitles: SubtitleTrack[];
	featured?: boolean;
	externalPlayerUrl?: string;
}

export interface Series extends MediaBase {
	seasons: Season[];
	ongoing: boolean;
	featured?: boolean;
	externalPlayerUrl?: string;
}

export interface TrendingItem {
	id: string;
	type: MediaType;
	title: string;
	poster: string;
	heat: number;
	slug: string;
}

export interface SidebarHighlight {
	id: string;
	title: string;
	poster: string;
	category: "popular" | "trending" | "new";
	href: string;
}

export interface SubscriptionPlan {
	id: string;
	name: string;
	price: number;
	currency: string;
	description: string;
	benefits: string[];
	featured?: boolean;
}

export interface Coupon {
	code: string;
	label: string;
	discountPercent: number;
	expiresAt: string;
}

export interface BillingHistoryItem {
	id: string;
	date: string;
	amount: number;
	plan: string;
	status: "paid" | "due" | "failed";
}
