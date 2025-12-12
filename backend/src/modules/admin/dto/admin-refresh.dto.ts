import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminRefreshDto {
  @ApiProperty()
  @IsString()
  refresh_token: string;
}

