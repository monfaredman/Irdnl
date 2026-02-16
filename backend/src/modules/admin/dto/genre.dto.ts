import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({ example: 'action' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Action' })
  @IsString()
  nameEn: string;

  @ApiProperty({ example: 'اکشن' })
  @IsString()
  nameFa: string;

  @ApiPropertyOptional({ example: '28' })
  @IsOptional()
  @IsString()
  tmdbGenreId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  categorySlugs?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backdropUrl?: string;

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

export class UpdateGenreDto {
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
  tmdbGenreId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  categorySlugs?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backdropUrl?: string;

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
