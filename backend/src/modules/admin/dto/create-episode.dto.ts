import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional } from 'class-validator';

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

  @ApiPropertyOptional({ example: 'video-asset-uuid' })
  @IsOptional()
  @IsString()
  videoAssetId?: string;

  @ApiPropertyOptional({ example: 'https://player.example.com/watch/ep1', description: 'External third-party player URL for this episode' })
  @IsOptional()
  @IsString()
  externalPlayerUrl?: string;
}
