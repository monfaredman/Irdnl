import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateSeasonDto {
  @ApiProperty({ example: 'series-uuid' })
  @IsString()
  seriesId: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  number: number;

  @ApiPropertyOptional({ example: 'Season 1' })
  @IsOptional()
  @IsString()
  title?: string;
}
