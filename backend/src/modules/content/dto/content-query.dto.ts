import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from '../entities/content.entity';

export class ContentQueryDto {
  @ApiPropertyOptional({ enum: ContentType, example: 'movie' })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiPropertyOptional({ example: 'drama' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ example: 'tehran' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

