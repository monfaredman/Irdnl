import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  IsObject,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'movies-foreign' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Foreign Movies' })
  @IsString()
  nameEn: string;

  @ApiProperty({ example: 'فیلم‌های خارجی' })
  @IsString()
  nameFa: string;

  @ApiPropertyOptional({ example: 'movie' })
  @IsOptional()
  @IsString()
  contentType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionFa?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  gradientColors?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  tmdbParams?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showEpisodes?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nameFa?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contentType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionFa?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  gradientColors?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  tmdbParams?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showEpisodes?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
