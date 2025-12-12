import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordProgressDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  content_id: string;

  @ApiProperty({ example: 3600 })
  @IsInt()
  @Min(0)
  progress_seconds: number;
}

