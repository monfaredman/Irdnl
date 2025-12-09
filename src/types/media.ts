export type MediaType = "movie" | "series" | "episode";

export type Genre =
  | "action"
  | "drama"
  | "comedy"
  | "romance"
  | "thriller"
  | "sci-fi"
  | "fantasy"
  | "animation"
  | "documentary"
  | "adventure"
  | "historical";

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
  format: "HLS" | "DASH";
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
  title: string;
  synopsis: string;
  duration: number;
  releaseDate: string;
  thumbnail: string;
  sources: StreamSource[];
  subtitles: SubtitleTrack[];
  downloads: DownloadLink[];
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
}

export interface Movie extends MediaBase {
  duration: number;
  sources: StreamSource[];
  downloads: DownloadLink[];
  subtitles: SubtitleTrack[];
  featured?: boolean;
}

export interface Series extends MediaBase {
  seasons: Season[];
  ongoing: boolean;
  featured?: boolean;
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
