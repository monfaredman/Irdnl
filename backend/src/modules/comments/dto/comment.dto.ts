import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsUUID,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommentStatus, CommentType } from '../entities/comment.entity';

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment text' })
  @IsString()
  text: string;

  @ApiPropertyOptional({
    description: 'Comment type',
    enum: CommentType,
    default: CommentType.COMMENT,
  })
  @IsOptional()
  @IsEnum(CommentType)
  type?: CommentType;

  @ApiPropertyOptional({ description: 'Content ID' })
  @IsOptional()
  @IsUUID()
  contentId?: string;

  @ApiPropertyOptional({ description: 'Parent comment ID for replies' })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Rating (1-5 stars)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating?: number;

  @ApiPropertyOptional({ description: 'User name (for anonymous comments)' })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional({ description: 'User email (for anonymous comments)' })
  @IsOptional()
  @IsString()
  userEmail?: string;

  @ApiPropertyOptional({ description: 'Is spoiler' })
  @IsOptional()
  @IsBoolean()
  isSpoiler?: boolean;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({ description: 'Comment text' })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    description: 'Comment status',
    enum: CommentStatus,
  })
  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;

  @ApiPropertyOptional({ description: 'Admin reply' })
  @IsOptional()
  @IsString()
  adminReply?: string;

  @ApiPropertyOptional({ description: 'Is pinned' })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiPropertyOptional({ description: 'Rating (1-5 stars)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating?: number;
}

export class ListCommentsDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by status', enum: CommentStatus })
  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;

  @ApiPropertyOptional({ description: 'Filter by type', enum: CommentType })
  @IsOptional()
  @IsEnum(CommentType)
  type?: CommentType;

  @ApiPropertyOptional({ description: 'Filter by content ID' })
  @IsOptional()
  @IsUUID()
  contentId?: string;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Search in text' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort by field', default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}

export class BulkActionDto {
  @ApiProperty({ description: 'Comment IDs', type: [String] })
  @IsUUID('4', { each: true })
  ids: string[];

  @ApiProperty({
    description: 'Action to perform',
    enum: ['approve', 'reject', 'delete', 'spam'],
  })
  @IsEnum(['approve', 'reject', 'delete', 'spam'])
  action: 'approve' | 'reject' | 'delete' | 'spam';
}
