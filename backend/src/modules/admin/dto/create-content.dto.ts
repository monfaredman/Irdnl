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

export class CreateContentDto {
  @ApiProperty({ example: 'Tehran Rhapsody' })
  @IsString()
  title: string;

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

  @ApiPropertyOptional({ example: 'https://example.com/poster.jpg' })
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/banner.jpg' })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({ example: 8.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;

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
