import {
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketPriority, TicketCategory, TicketStatus } from '../entities/ticket.entity';

export class CreateTicketDto {
  @ApiProperty({ example: 'مشکل در پخش ویدیو' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  subject: string;

  @ApiProperty({ example: 'ویدیو بارگذاری نمی‌شود' })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message: string;

  @ApiPropertyOptional({ enum: TicketPriority })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({ enum: TicketCategory })
  @IsOptional()
  @IsEnum(TicketCategory)
  category?: TicketCategory;
}

export class AdminReplyTicketDto {
  @ApiProperty({ example: 'مشکل شما بررسی و رفع شد' })
  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  adminReply: string;

  @ApiPropertyOptional({ enum: TicketStatus })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}

export class UpdateTicketStatusDto {
  @ApiProperty({ enum: TicketStatus })
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
