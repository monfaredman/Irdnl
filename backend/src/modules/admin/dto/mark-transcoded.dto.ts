import { IsString, IsEnum, IsOptional, IsInt, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VideoAssetStatus } from '../../video-assets/entities/video-asset.entity';

export class MarkTranscodedDto {
  @ApiProperty({ enum: VideoAssetStatus, example: 'ready' })
  @IsEnum(VideoAssetStatus)
  status: VideoAssetStatus;

  @ApiPropertyOptional({ example: 'http://localhost:9000/media/content1/1080p/playlist.m3u8' })
  @IsOptional()
  @IsString()
  hlsUrl?: string;

  @ApiPropertyOptional({ example: 3600 })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiPropertyOptional({ example: 1073741824 })
  @IsOptional()
  @IsNumber()
  filesize?: number;
}
