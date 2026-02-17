import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from '../../content/entities/content.entity';

export class SearchQueryDto {
  @ApiProperty({ example: 'تهران', description: 'Search query string' })
  @IsString()
  q: string;

  @ApiPropertyOptional({ enum: ContentType, description: 'Filter by content type' })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiPropertyOptional({ example: 'drama', description: 'Filter by genre' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ example: 2024, description: 'Filter by release year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ example: 'IR', description: 'Filter by country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'fa', description: 'Language preference for results' })
  @IsOptional()
  @IsString()
  lang?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    example: 'relevance',
    description: 'Sort field',
    enum: ['relevance', 'rating', 'year', 'newest'],
  })
  @IsOptional()
  @IsString()
  sort?: 'relevance' | 'rating' | 'year' | 'newest' = 'relevance';
}

export class SuggestQueryDto {
  @ApiProperty({ example: 'تهر', description: 'Autocomplete query string' })
  @IsString()
  q: string;

  @ApiPropertyOptional({ example: 8, minimum: 1, maximum: 15, default: 8 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(15)
  limit?: number = 8;
}

// Response interfaces
export interface SearchResultItem {
  id: string;
  title: string;
  originalTitle: string | null;
  description: string | null;
  shortDescription: string | null;
  type: ContentType;
  year: number | null;
  rating: number | null;
  posterUrl: string | null;
  thumbnailUrl: string | null;
  backdropUrl: string | null;
  genres: string[];
  tags: string[];
  director: string | null;
  country: string | null;
  duration: number | null;
  accessType: string;
  featured: boolean;
  isDubbed: boolean;
  localizedContent: Record<string, { title?: string; description?: string; shortDescription?: string }> | null;
  highlights?: Record<string, string[]>;
  score?: number;
}

export interface SearchResponse {
  items: SearchResultItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  took: number; // milliseconds
  query: string;
}

export interface SuggestItem {
  id: string;
  title: string;
  originalTitle: string | null;
  type: ContentType;
  year: number | null;
  rating: number | null;
  posterUrl: string | null;
  thumbnailUrl: string | null;
  genres: string[];
  accessType: string;
  highlight?: string;
}

export interface SuggestResponse {
  items: SuggestItem[];
  total: number;
  took: number;
  query: string;
}
