import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  Max,
  IsObject,
  ValidateNested,
  IsArray,
  IsBoolean,
  IsDateString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType, ContentStatus } from '../../content/entities/content.entity';

class SeoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  keywords?: string[];
}

class CastMemberDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  character?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

class CrewMemberDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;
}

class VideoQualityDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bitrate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  size?: string;
}

class AudioTrackDto {
  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  codec?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  channels?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;
}

class SubtitleDto {
  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;
}

class TrailerDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  quality?: string;
}

class TechnicalSpecsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  codec?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  frameRate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aspectRatio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  audioCodec?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  audioChannels?: string;
}

class DRMSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  licenseUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  certificateUrl?: string;
}

class MonetizationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rentalFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subscriptionTier?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  adInsertionPoints?: number[];
}

class RightsInfoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rightsHolder?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  licenseExpiration?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  distributionTerritories?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  exclusivity?: boolean;
}

class LocalizedContentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortDescription?: string;
}

export class CreateContentDto {
  // Basic Information
  @ApiProperty({ example: 'Tehran Rhapsody' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Tehran Rhapsody' })
  @IsOptional()
  @IsString()
  originalTitle?: string;

  @ApiPropertyOptional({ example: 'A story of love and loss' })
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiProperty({ enum: ContentType, example: 'movie' })
  @IsEnum(ContentType)
  type: ContentType;

  @ApiPropertyOptional({ example: 2023 })
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ example: 'A captivating story...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Short description' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 7200, description: 'Duration in seconds' })
  @IsOptional()
  @IsInt()
  duration?: number;

  // Visual Assets
  @ApiPropertyOptional({ example: 'https://example.com/poster.jpg' })
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/banner.jpg' })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/thumbnail.jpg' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/backdrop.jpg' })
  @IsOptional()
  @IsString()
  backdropUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://player.example.com/watch/12345' })
  @IsOptional()
  @ValidateIf((o) => o.externalPlayerUrl !== '' && o.externalPlayerUrl !== null)
  @IsUrl()
  externalPlayerUrl?: string;

  // Metadata
  @ApiPropertyOptional({ example: 8.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;

  @ApiPropertyOptional({ type: [String], example: ['Drama', 'Romance'] })
  @IsOptional()
  @IsArray()
  genres?: string[];

  @ApiPropertyOptional({ type: [String], example: ['love', 'family'] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ type: [String], example: ['en', 'fa'] })
  @IsOptional()
  @IsArray()
  languages?: string[];

  @ApiPropertyOptional({ example: 'fa' })
  @IsOptional()
  @IsString()
  originalLanguage?: string;

  @ApiPropertyOptional({ example: 'PG-13' })
  @IsOptional()
  @IsString()
  ageRating?: string;

  @ApiPropertyOptional({ type: [String], example: ['violence', 'language'] })
  @IsOptional()
  @IsArray()
  contentWarnings?: string[];

  // Cast and Crew
  @ApiPropertyOptional({ type: [CastMemberDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CastMemberDto)
  cast?: CastMemberDto[];

  @ApiPropertyOptional({ type: [CrewMemberDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrewMemberDto)
  crew?: CrewMemberDto[];

  @ApiPropertyOptional({ example: 'John Director' })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({ example: 'Jane Writer' })
  @IsOptional()
  @IsString()
  writer?: string;

  @ApiPropertyOptional({ example: 'Bob Producer' })
  @IsOptional()
  @IsString()
  producer?: string;

  @ApiPropertyOptional({ example: 'ABC Films' })
  @IsOptional()
  @IsString()
  productionCompany?: string;

  @ApiPropertyOptional({ example: 'Iran' })
  @IsOptional()
  @IsString()
  country?: string;

  // External IDs
  @ApiPropertyOptional({ example: 'tt1234567' })
  @IsOptional()
  @IsString()
  imdbId?: string;

  @ApiPropertyOptional({ example: '12345' })
  @IsOptional()
  @IsString()
  tmdbId?: string;

  // Media Assets
  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  videoQualities?: {
    sd?: VideoQualityDto;
    hd?: VideoQualityDto;
    fullHd?: VideoQualityDto;
    uhd4k?: VideoQualityDto;
    uhd8k?: VideoQualityDto;
    hdr?: VideoQualityDto;
    dolbyVision?: VideoQualityDto;
  };

  @ApiPropertyOptional({ type: [AudioTrackDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AudioTrackDto)
  audioTracks?: AudioTrackDto[];

  @ApiPropertyOptional({ type: [SubtitleDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubtitleDto)
  subtitles?: SubtitleDto[];

  @ApiPropertyOptional({ type: [TrailerDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrailerDto)
  trailers?: TrailerDto[];

  // Technical Specifications
  @ApiPropertyOptional({ type: TechnicalSpecsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TechnicalSpecsDto)
  technicalSpecs?: TechnicalSpecsDto;

  @ApiPropertyOptional({ type: DRMSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DRMSettingsDto)
  drmSettings?: DRMSettingsDto;

  // Scheduling and Availability
  @ApiPropertyOptional({ example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  publishDate?: Date;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  availabilityStart?: Date;

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  availabilityEnd?: Date;

  @ApiPropertyOptional({ type: [String], example: ['US', 'CA', 'IR'] })
  @IsOptional()
  @IsArray()
  geoRestrictions?: string[];

  @ApiPropertyOptional({ type: [String], example: ['mobile', 'desktop'] })
  @IsOptional()
  @IsArray()
  deviceRestrictions?: string[];

  // Monetization
  @ApiPropertyOptional({ type: MonetizationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MonetizationDto)
  monetization?: MonetizationDto;

  // Rights and Licensing
  @ApiPropertyOptional({ type: RightsInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RightsInfoDto)
  rightsInfo?: RightsInfoDto;

  // Discovery and SEO
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  priority?: number;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  localizedContent?: Record<string, LocalizedContentDto>;

  @ApiPropertyOptional({ enum: ContentStatus, default: 'draft' })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ example: { distributor: 'ABC Films', licenseDate: '2023-01-01' } })
  @IsOptional()
  @IsObject()
  licenseInfo?: Record<string, any>;

  @ApiPropertyOptional({ type: SeoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SeoDto)
  seo?: SeoDto;
}
