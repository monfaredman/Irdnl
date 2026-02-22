import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Series } from './series.entity';
import { VideoAsset } from '../../video-assets/entities/video-asset.entity';
import { WatchHistory } from '../../watch-history/entities/watch-history.entity';
import { Watchlist } from '../../watchlist/entities/watchlist.entity';

export enum ContentType {
  MOVIE = 'movie',
  SERIES = 'series',
}

export enum ContentStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
}

/**
 * Access types for video content:
 * - FREE: Free content played in-site with our own player
 * - SUBSCRIPTION: Upera subscription-based content (redirect to Upera player/gateway)
 * - SINGLE_PURCHASE: Upera single-purchase content (redirect to Upera payment)
 * - TRAFFIC: Upera traffic-based content (redirect to Upera player/gateway)
 */
export enum AccessType {
  FREE = 'free',
  SUBSCRIPTION = 'subscription',
  SINGLE_PURCHASE = 'single_purchase',
  TRAFFIC = 'traffic',
}

@Entity('content')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'original_title', nullable: true })
  originalTitle: string | null;

  @Column({ nullable: true })
  tagline: string | null;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  type: ContentType;

  @Column({ type: 'int', nullable: true })
  year: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription: string | null;

  @Column({ type: 'int', nullable: true })
  duration: number | null; // Duration in seconds

  @Column({ name: 'poster_url', nullable: true })
  posterUrl: string | null;

  @Column({ name: 'banner_url', nullable: true })
  bannerUrl: string | null;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'backdrop_url', nullable: true })
  backdropUrl: string | null;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string | null;

  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true })
  rating: number | null;

  @Column({ type: 'jsonb', nullable: true, default: '{}' })
  ratings: {
    imdb?: { score: number; votes?: number };
    rottenTomatoes?: { tomatometer: number; audience?: number };
    metacritic?: { score: number };
    fandango?: { score: number };
    letterboxd?: { score: number };
    myAnimeList?: { score: number };
  } | null;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  genres: string[];

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  languages: string[];

  @Column({ name: 'original_language', nullable: true })
  originalLanguage: string | null;

  @Column({ name: 'age_rating', nullable: true })
  ageRating: string | null;

  @Column({ name: 'content_warnings', type: 'jsonb', nullable: true, default: '[]' })
  contentWarnings: string[];

  // Cast and Crew
  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  cast: Array<{ name: string; character?: string; role?: string; imageUrl?: string }>;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  crew: Array<{ name: string; role: string; department?: string }>;

  // Dubbing cast (voice actors for dubbed versions)
  @Column({ name: 'dubbing_cast', type: 'jsonb', nullable: true, default: '[]' })
  dubbingCast: Array<{ name: string; character?: string; language?: string; imageUrl?: string }>;

  // Production team / Builders' agents
  @Column({ name: 'production_team', type: 'jsonb', nullable: true, default: '[]' })
  productionTeam: Array<{ name: string; role: string; department?: string; imageUrl?: string }>;

  @Column({ nullable: true })
  director: string | null;

  @Column({ nullable: true })
  writer: string | null;

  @Column({ nullable: true })
  producer: string | null;

  @Column({ name: 'production_company', nullable: true })
  productionCompany: string | null;

  @Column({ nullable: true })
  country: string | null;

  // External IDs
  @Column({ name: 'imdb_id', nullable: true })
  imdbId: string | null;

  @Column({ name: 'tmdb_id', nullable: true })
  tmdbId: string | null;

  // Media Assets
  @Column({ name: 'video_qualities', type: 'jsonb', nullable: true, default: '{}' })
  videoQualities: {
    sd?: { url: string; bitrate?: string; size?: string };
    hd?: { url: string; bitrate?: string; size?: string };
    fullHd?: { url: string; bitrate?: string; size?: string };
    uhd4k?: { url: string; bitrate?: string; size?: string };
    uhd8k?: { url: string; bitrate?: string; size?: string };
    hdr?: { url: string; bitrate?: string; size?: string };
    dolbyVision?: { url: string; bitrate?: string; size?: string };
  } | null;

  @Column({ name: 'audio_tracks', type: 'jsonb', nullable: true, default: '[]' })
  audioTracks: Array<{
    language: string;
    url: string;
    codec?: string;
    channels?: string;
    label?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  subtitles: Array<{
    language: string;
    url: string;
    format?: string;
    label?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  trailers: Array<{
    title: string;
    url: string;
    type?: string;
    quality?: string;
  }>;

  // Technical Specifications
  @Column({ name: 'technical_specs', type: 'jsonb', nullable: true, default: '{}' })
  technicalSpecs: {
    codec?: string;
    resolution?: string;
    frameRate?: string;
    aspectRatio?: string;
    audioCodec?: string;
    audioChannels?: string;
  } | null;

  @Column({ name: 'drm_settings', type: 'jsonb', nullable: true, default: '{}' })
  drmSettings: {
    enabled?: boolean;
    provider?: string;
    licenseUrl?: string;
    certificateUrl?: string;
  } | null;

  // Scheduling and Availability
  @Column({ name: 'publish_date', type: 'timestamp', nullable: true })
  publishDate: Date | null;

  @Column({ name: 'availability_start', type: 'timestamp', nullable: true })
  availabilityStart: Date | null;

  @Column({ name: 'availability_end', type: 'timestamp', nullable: true })
  availabilityEnd: Date | null;

  @Column({ name: 'geo_restrictions', type: 'jsonb', nullable: true, default: '[]' })
  geoRestrictions: string[];

  @Column({ name: 'device_restrictions', type: 'jsonb', nullable: true, default: '[]' })
  deviceRestrictions: string[];

  // Monetization
  @Column({ type: 'jsonb', nullable: true, default: '{}' })
  monetization: {
    price?: number;
    rentalFee?: number;
    subscriptionTier?: string;
    isFree?: boolean;
    adInsertionPoints?: number[];
  } | null;

  // Rights and Licensing
  @Column({ name: 'rights_info', type: 'jsonb', nullable: true, default: '{}' })
  rightsInfo: {
    rightsHolder?: string;
    licenseExpiration?: string;
    distributionTerritories?: string[];
    exclusivity?: boolean;
  } | null;

  // Discovery and SEO
  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_kids' })
  isKids: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_coming_soon' })
  isComingSoon: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_dubbed' })
  isDubbed: boolean;

  @Column({ name: 'collection_id', nullable: true })
  collectionId: string | null;

  @Column({ name: 'category_ids', type: 'jsonb', nullable: true, default: '[]' })
  categoryIds: string[];

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ name: 'localized_content', type: 'jsonb', nullable: true, default: '{}' })
  localizedContent: Record<string, {
    title?: string;
    description?: string;
    shortDescription?: string;
  }> | null;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({ name: 'external_player_url', nullable: true })
  externalPlayerUrl: string | null;

  @Column({
    name: 'access_type',
    type: 'enum',
    enum: AccessType,
    default: AccessType.FREE,
  })
  accessType: AccessType;

  @Column({ name: 'license_info', type: 'jsonb', nullable: true })
  licenseInfo: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  } | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Series, (series) => series.content)
  series: Series;

  @OneToMany(() => VideoAsset, (videoAsset) => videoAsset.content)
  videoAssets: VideoAsset[];

  @OneToMany(() => WatchHistory, (watchHistory) => watchHistory.content)
  watchHistory: WatchHistory[];

  @OneToMany(() => Watchlist, (watchlist) => watchlist.content)
  watchlist: Watchlist[];
}
