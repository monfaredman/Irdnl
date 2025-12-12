import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ example: 'New Content Available' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Check out our latest movie!' })
  @IsString()
  message: string;

  @ApiProperty({ enum: NotificationType, example: 'push' })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

