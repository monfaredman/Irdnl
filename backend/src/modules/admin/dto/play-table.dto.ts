import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
  IsArray,
  IsUUID,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PlayTableStatus } from '../../content/entities/play-table.entity';

export class CreatePlayTableDto {
  @ApiProperty({ example: 'Friday Night Movies' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'فیلم‌های جمعه شب' })
  @IsOptional()
  @IsString()
  titleFa?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionFa?: string;

  @ApiProperty({ description: 'Array of content UUIDs', example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  contentIds: string[];

  @ApiProperty({ example: '2025-01-01T20:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2025-01-01T23:00:00Z' })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({ enum: PlayTableStatus })
  @IsOptional()
  @IsEnum(PlayTableStatus)
  status?: PlayTableStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdatePlayTableDto extends PartialType(CreatePlayTableDto) {}
