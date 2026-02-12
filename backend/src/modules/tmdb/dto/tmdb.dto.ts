import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TMDBSearchDto {
  @ApiProperty({ description: 'Search query' })
  @IsString()
  query: string;

  @ApiPropertyOptional({
    description: 'Language',
    enum: ['en', 'fa'],
    default: 'fa',
  })
  @IsOptional()
  @IsEnum(['en', 'fa'])
  language?: 'en' | 'fa';

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Include adult content',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeAdult?: boolean;
}

export class TMDBDiscoverDto {
  @ApiPropertyOptional({
    description: 'Content type',
    enum: ['movie', 'tv'],
    default: 'movie',
  })
  @IsOptional()
  @IsEnum(['movie', 'tv'])
  type?: 'movie' | 'tv';

  @ApiPropertyOptional({
    description: 'Language',
    enum: ['en', 'fa'],
    default: 'fa',
  })
  @IsOptional()
  @IsEnum(['en', 'fa'])
  language?: 'en' | 'fa';

  @ApiPropertyOptional({ description: 'Genre (name or ID)' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ description: 'Genre IDs comma-separated' })
  @IsOptional()
  @IsString()
  withGenres?: string;

  @ApiPropertyOptional({ description: 'Release/first air year' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @ApiPropertyOptional({ description: 'Age certification (g, pg, pg13, r)' })
  @IsOptional()
  @IsString()
  certification?: string;

  @ApiPropertyOptional({ description: 'Country code (us, ir, uk, etc)' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;
}

export class TMDBPopularDto {
  @ApiPropertyOptional({
    description: 'Content type',
    enum: ['movie', 'tv'],
    default: 'movie',
  })
  @IsOptional()
  @IsEnum(['movie', 'tv'])
  type?: 'movie' | 'tv';

  @ApiPropertyOptional({
    description: 'Language',
    enum: ['en', 'fa'],
    default: 'fa',
  })
  @IsOptional()
  @IsEnum(['en', 'fa'])
  language?: 'en' | 'fa';

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;
}

export class TMDBTrendingDto {
  @ApiPropertyOptional({
    description: 'Language',
    enum: ['en', 'fa'],
    default: 'en',
  })
  @IsOptional()
  @IsEnum(['en', 'fa'])
  language?: 'en' | 'fa';

  @ApiPropertyOptional({
    description: 'Media type',
    enum: ['all', 'movie', 'tv'],
    default: 'all',
  })
  @IsOptional()
  @IsEnum(['all', 'movie', 'tv'])
  mediaType?: 'all' | 'movie' | 'tv';

  @ApiPropertyOptional({
    description: 'Time window',
    enum: ['day', 'week'],
    default: 'week',
  })
  @IsOptional()
  @IsEnum(['day', 'week'])
  timeWindow?: 'day' | 'week';

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;
}

export class TMDBDetailsDto {
  @ApiProperty({ description: 'TMDB ID' })
  @IsString()
  id: string;

  @ApiPropertyOptional({
    description: 'Content type',
    enum: ['movie', 'tv'],
    default: 'movie',
  })
  @IsOptional()
  @IsEnum(['movie', 'tv'])
  type?: 'movie' | 'tv';

  @ApiPropertyOptional({
    description: 'Language',
    enum: ['en', 'fa'],
    default: 'fa',
  })
  @IsOptional()
  @IsEnum(['en', 'fa'])
  language?: 'en' | 'fa';
}

export class TMDBSeasonDetailsDto {
  @ApiProperty({ description: 'TMDB TV Show ID' })
  @IsString()
  tvId: string;

  @ApiProperty({ description: 'Season number' })
  @IsNumber()
  @Type(() => Number)
  seasonNumber: number;

  @ApiPropertyOptional({
    description: 'Language',
    enum: ['en', 'fa'],
    default: 'fa',
  })
  @IsOptional()
  @IsEnum(['en', 'fa'])
  language?: 'en' | 'fa';
}

export class SaveTMDBContentDto {
  @ApiProperty({ description: 'TMDB ID' })
  @IsString()
  tmdbId: string;

  @ApiProperty({
    description: 'Media type',
    enum: ['movie', 'tv'],
  })
  @IsEnum(['movie', 'tv'])
  mediaType: 'movie' | 'tv';

  @ApiPropertyOptional({ description: 'Additional metadata as JSON' })
  @IsOptional()
  rawData?: any;
}

export class ImportTMDBToDBDto {
  @ApiProperty({ description: 'Saved TMDB content ID to import' })
  @IsString()
  savedContentId: string;
}
