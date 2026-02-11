import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional, IsUrl } from 'class-validator';

export class CreateEpisodeDto {
  @ApiProperty({ example: 'season-uuid' })
  @IsString()
  seasonId: string;

  @ApiProperty({ example: 'Episode 1' })
  @IsString()
  title: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  number: number;

  @ApiPropertyOptional({ example: 'Episode description...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 3600, description: 'Duration in seconds' })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ example: 'https://example.com/thumb.jpg' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'video-asset-uuid' })
  @IsOptional()
  @IsString()
  videoAssetId?: string;

  @ApiPropertyOptional({ example: 'https://player.example.com/watch/ep1', description: 'External third-party player URL for this episode' })
  @IsOptional()
  @IsString()
  externalPlayerUrl?: string;
}

export class UpdateEpisodeDto {
  @ApiPropertyOptional({ example: 'Episode 1' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  number?: number;

  @ApiPropertyOptional({ example: 'Episode description...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 3600 })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ example: 'https://example.com/thumb.jpg' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'video-asset-uuid' })
  @IsOptional()
  @IsString()
  videoAssetId?: string;

  @ApiPropertyOptional({ example: 'https://player.example.com/watch/ep1' })
  @IsOptional()
  @IsString()
  externalPlayerUrl?: string;
}
