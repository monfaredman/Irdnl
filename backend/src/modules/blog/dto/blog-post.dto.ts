import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BlogPostStatus, BlogCategory } from '../entities/blog-post.entity';

export class CreateBlogPostDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  slug: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  excerpt: string;

  @IsString()
  @MinLength(50)
  content: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsEnum(BlogPostStatus)
  status: BlogPostStatus;

  @IsEnum(BlogCategory)
  category: BlogCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  metaDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaKeywords?: string[];
}

export class UpdateBlogPostDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  slug?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  excerpt?: string;

  @IsOptional()
  @IsString()
  @MinLength(50)
  content?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsEnum(BlogPostStatus)
  status?: BlogPostStatus;

  @IsOptional()
  @IsEnum(BlogCategory)
  category?: BlogCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  metaDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaKeywords?: string[];
}

export class ListBlogPostsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(BlogPostStatus)
  status?: BlogPostStatus;

  @IsOptional()
  @IsEnum(BlogCategory)
  category?: BlogCategory;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class BlogStatsDto {
  total: number;
  draft: number;
  published: number;
  scheduled: number;
  archived: number;
  byCategory: Record<string, number>;
  totalViews: number;
  totalLikes: number;
}
