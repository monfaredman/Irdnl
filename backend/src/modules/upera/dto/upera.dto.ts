import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum TrendingSort {
  LAST_UPDATED = 1,
  PRODUCT_YEAR = 2,
  IMDB_RATE = 3,
  LIKES = 4,
  LAST_CREATED = 6,
}

export enum FreeFilter {
  ALL = 0,
  FREE = 1,
  NON_FREE = 2,
}

export enum CountryFilter {
  ALL = 0,
  IRAN = 2,
  NON_IRAN = 3,
}

export enum PersianFilter {
  ALL = 0,
  DUBBED_OR_IRANIAN = 1,
}

export class SearchUperaContentDto {
  @ApiPropertyOptional({ enum: TrendingSort, default: TrendingSort.LAST_UPDATED })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  trending?: number = 1;

  @ApiPropertyOptional({
    default: 'all',
    description: 'Genre filter: all,action,adventure,animation,biography,comedy,crime,documentary,drama,family,fantasy,history,horror,music,mystery,romance,sci-fi,sport,thriller,war,iranian,foreign',
  })
  @IsOptional()
  @IsString()
  genre?: string = 'all';

  @ApiPropertyOptional({ enum: FreeFilter, default: FreeFilter.FREE })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  free?: number = 1;

  @ApiPropertyOptional({ enum: CountryFilter, default: CountryFilter.ALL })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  country?: number = 0;

  @ApiPropertyOptional({ enum: PersianFilter, default: PersianFilter.ALL })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  persian?: number = 0;

  @ApiPropertyOptional({ description: 'Search query in Persian title' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Content type: movie or series', enum: ['movie', 'series'] })
  @IsOptional()
  @IsString()
  type?: string;
}

export class GetSeriesEpisodesDto {
  @ApiProperty({ description: 'Upera series ID' })
  @IsString()
  id: string;
}

export class GetAffiliateLinkDto {
  @ApiProperty({ description: 'Content ID from Upera' })
  @IsString()
  id: string;

  @ApiProperty({ enum: ['movie', 'episode'], description: 'Type of content' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ default: 2 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ref?: number = 2;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  traffic?: number = 1;

  @ApiPropertyOptional({ description: 'Third-party publisher token' })
  @IsOptional()
  @IsString()
  token?: string;
}

export class BuyContentDto {
  @ApiProperty({ description: 'ID of specific quality' })
  @IsNumber()
  @Type(() => Number)
  qualityId: number;

  @ApiPropertyOptional({ description: 'ID of specific episode' })
  @IsOptional()
  @IsString()
  episodeId?: string;

  @ApiPropertyOptional({ description: 'ID of specific movie' })
  @IsOptional()
  @IsString()
  movieId?: string;

  @ApiProperty({ description: 'Payment method (e.g. saman)' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ description: 'User mobile number' })
  @IsString()
  mobile: string;

  @ApiProperty({ description: 'Callback URL after payment' })
  @IsString()
  callbackUrl: string;

  @ApiPropertyOptional({ description: 'Ref ID from Upera site' })
  @IsOptional()
  @IsString()
  refid?: string;

  @ApiPropertyOptional({ description: 'Third-party publisher token' })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiPropertyOptional({ description: 'Payment ID for third-party publishers' })
  @IsOptional()
  @IsString()
  paymentId?: string;
}

export class PaymentCallbackDto {
  @ApiProperty({ description: 'Payment ID from callback URL' })
  @IsString()
  paymentId: string;

  @ApiProperty({ description: 'Reference number from callback URL' })
  @IsString()
  refNum: string;

  @ApiPropertyOptional({
    description: '0 = first time, 1 = re-check payment',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  checkItAgain?: number = 0;

  @ApiPropertyOptional({ description: 'Third-party publisher token' })
  @IsOptional()
  @IsString()
  token?: string;
}

export class GetLinkDto {
  @ApiProperty({ description: 'Content ID' })
  @IsString()
  id: string;

  @ApiProperty({ enum: ['movie', 'episode'], description: 'Type of content' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'User mobile number' })
  @IsString()
  mobile: string;

  @ApiPropertyOptional({ description: 'Third-party publisher token' })
  @IsOptional()
  @IsString()
  token?: string;
}

// Home Screening DTOs
export class HomeScreeningBuyDto {
  @ApiProperty({ description: 'Array of items to buy', type: 'array' })
  cart: Array<{ id: string }>;

  @ApiProperty({ description: 'Payment method', default: 'saman3' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ description: 'User mobile number' })
  @IsNumber()
  @Type(() => Number)
  mobile: number;

  @ApiPropertyOptional({ description: 'Third-party publisher token' })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiPropertyOptional({ description: 'Callback URL' })
  @IsOptional()
  @IsString()
  callbackUrl?: string;

  @ApiProperty({ description: 'Enable home screening', default: true })
  @IsBoolean()
  ekran: boolean;
}

export class WatchMovieHlsDto {
  @ApiProperty({ description: 'Movie ID from Tornado' })
  @IsString()
  id: string;

  @ApiPropertyOptional({ description: 'Third-party publisher token' })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({ description: 'User mobile number' })
  @IsNumber()
  @Type(() => Number)
  mobile: number;

  @ApiPropertyOptional({ description: 'User IP to restrict streaming' })
  @IsOptional()
  @IsString()
  ip?: string;
}

export class EkranTokenDto {
  @ApiProperty({ description: 'Movie ID from Tornado' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'User mobile number' })
  @IsString()
  mobile: string;

  @ApiPropertyOptional({ description: 'Third-party publisher token' })
  @IsOptional()
  @IsString()
  token?: string;
}

export class ImportToLocalDto {
  @ApiProperty({ description: 'Upera content ID to import' })
  @IsString()
  uperaContentId: string;
}

// ==========================================
// UPERA SITE CONTENT (api.upera.tv)
// ==========================================

export class DiscoverQueryDto {
  @ApiPropertyOptional({
    description: 'Age rating filter',
    enum: ['0', 'G', 'PG', 'PG-13', 'R', 'X', 'TO-3', 'TO-6', 'TO-10', 'TO-14', 'TO-18'],
    default: '0',
  })
  @IsOptional()
  @IsString()
  age?: string;

  @ApiPropertyOptional({
    description: 'Country filter',
    enum: ['0', 'IR', 'noIR'],
    default: '0',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Discover page number' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discover_page?: number;

  @ApiPropertyOptional({
    description: 'Content type filter',
    enum: ['0', 'movie', 'series'],
    default: '0',
  })
  @IsOptional()
  @IsString()
  f_type?: string;

  @ApiPropertyOptional({
    description: 'Kids content filter (0=off, 1=on)',
    enum: [0, 1],
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  kids?: number;

  @ApiPropertyOptional({
    description: 'Language filter',
    enum: ['0', 'persian', 'nopersian'],
    default: '0',
  })
  @IsOptional()
  @IsString()
  lang?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['created', 'oldest', 'imdb'],
    default: 'created',
  })
  @IsOptional()
  @IsString()
  sortby?: string;
}

export class SliderQueryDto {
  @ApiPropertyOptional({
    description: 'Age rating filter',
    enum: ['0', 'G', 'PG', 'PG-13', 'R', 'X', 'TO-3', 'TO-6', 'TO-10', 'TO-14', 'TO-18'],
    default: '0',
  })
  @IsOptional()
  @IsString()
  age?: string;

  @ApiPropertyOptional({
    description: 'Media type filter',
    enum: ['0', 'movie', 'series'],
    default: '0',
  })
  @IsOptional()
  @IsString()
  media_type?: string;

  @ApiPropertyOptional({ description: 'Slider location identifier' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Reference identifier' })
  @IsOptional()
  @IsString()
  ref?: string;
}

export class OfferQueryDto {
  @ApiPropertyOptional({
    description: 'Age rating filter',
    enum: ['0', 'G', 'PG', 'PG-13', 'R', 'X', 'TO-3', 'TO-6', 'TO-10', 'TO-14', 'TO-18'],
    default: '0',
  })
  @IsOptional()
  @IsString()
  age?: string;

  @ApiPropertyOptional({
    description: 'Media type filter',
    enum: ['0', 'movie', 'series'],
    default: '0',
  })
  @IsOptional()
  @IsString()
  media_type?: string;
}

export class GenresQueryDto {
  @ApiPropertyOptional({
    description: 'Age rating filter',
    enum: ['0', 'G', 'PG', 'PG-13', 'R', 'X', 'TO-3', 'TO-6', 'TO-10', 'TO-14', 'TO-18'],
    default: '0',
  })
  @IsOptional()
  @IsString()
  age?: string;
}
