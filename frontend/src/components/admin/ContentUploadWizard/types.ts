export interface CastMember {
  name: string;
  character?: string;
  role?: string;
  imageUrl?: string;
}

export interface CrewMember {
  name: string;
  role: string;
  department?: string;
}

export interface VideoQuality {
  url: string;
  bitrate?: string;
  size?: string;
}

export interface AudioTrack {
  language: string;
  url: string;
  codec?: string;
  channels?: string;
  label?: string;
}

export interface Subtitle {
  language: string;
  url: string;
  format?: string;
  label?: string;
}

export interface Trailer {
  title: string;
  url: string;
  type?: string;
  quality?: string;
}

export interface TechnicalSpecs {
  codec?: string;
  resolution?: string;
  frameRate?: string;
  aspectRatio?: string;
  audioCodec?: string;
  audioChannels?: string;
}

export interface DRMSettings {
  enabled?: boolean;
  provider?: string;
  licenseUrl?: string;
  certificateUrl?: string;
}

export interface Monetization {
  price?: number;
  rentalFee?: number;
  subscriptionTier?: string;
  isFree?: boolean;
  adInsertionPoints?: number[];
}

export interface RightsInfo {
  rightsHolder?: string;
  licenseExpiration?: string;
  distributionTerritories?: string[];
  exclusivity?: boolean;
}

export interface LocalizedContent {
  title?: string;
  description?: string;
  shortDescription?: string;
}

export interface ContentFormData {
  // Basic Info
  title: string;
  originalTitle?: string;
  tagline?: string;
  type: "movie" | "series";
  year?: number;
  description?: string;
  shortDescription?: string;
  duration?: number;
  status: "draft" | "scheduled" | "published" | "unpublished";
  isKids?: boolean;
  isComingSoon?: boolean;
  collectionId?: string;

  // Visual Assets
  posterUrl?: string;
  bannerUrl?: string;
  thumbnailUrl?: string;
  backdropUrl?: string;
  logoUrl?: string;
  externalPlayerUrl?: string;

  // Metadata
  rating?: number;
  genres?: string[];
  tags?: string[];
  languages?: string[];
  originalLanguage?: string;
  ageRating?: string;
  contentWarnings?: string[];
  cast?: CastMember[];
  crew?: CrewMember[];
  director?: string;
  writer?: string;
  producer?: string;
  productionCompany?: string;
  country?: string;
  imdbId?: string;
  tmdbId?: string;

  // Media Assets
  videoQualities?: {
    sd?: VideoQuality;
    hd?: VideoQuality;
    fullHd?: VideoQuality;
    uhd4k?: VideoQuality;
    uhd8k?: VideoQuality;
    hdr?: VideoQuality;
    dolbyVision?: VideoQuality;
  };
  audioTracks?: AudioTrack[];
  subtitles?: Subtitle[];
  trailers?: Trailer[];
  isDubbed?: boolean;

  // Technical
  technicalSpecs?: TechnicalSpecs;
  drmSettings?: DRMSettings;

  // Scheduling
  publishDate?: Date | null;
  availabilityStart?: Date | null;
  availabilityEnd?: Date | null;
  geoRestrictions?: string[];
  deviceRestrictions?: string[];

  // Monetization
  monetization?: Monetization;

  // Rights
  rightsInfo?: RightsInfo;

  // SEO
  featured?: boolean;
  priority?: number;
  localizedContent?: Record<string, LocalizedContent>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}
