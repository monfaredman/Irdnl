import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BlogPost, BlogPostStatus } from './entities/blog-post.entity';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
  ListBlogPostsDto,
  BlogStatsDto,
} from './dto/blog-post.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
  ) {}

  async create(
    createBlogPostDto: CreateBlogPostDto,
    authorId: string,
  ): Promise<BlogPost> {
    // Check if slug already exists
    const existing = await this.blogPostRepository.findOne({
      where: { slug: createBlogPostDto.slug },
    });

    if (existing) {
      throw new BadRequestException('A blog post with this slug already exists');
    }

    // Calculate reading time (roughly 200 words per minute)
    const wordCount = createBlogPostDto.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const blogPost = this.blogPostRepository.create({
      ...createBlogPostDto,
      authorId,
      readingTime,
      publishedAt:
        createBlogPostDto.status === BlogPostStatus.PUBLISHED
          ? new Date()
          : null,
    });

    return this.blogPostRepository.save(blogPost);
  }

  async findAll(query: ListBlogPostsDto): Promise<{
    posts: BlogPost[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      search,
      tag,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.blogPostRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author');

    if (status) {
      queryBuilder.andWhere('post.status = :status', { status });
    }

    if (category) {
      queryBuilder.andWhere('post.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.excerpt ILIKE :search OR post.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (tag) {
      queryBuilder.andWhere(':tag = ANY(post.tags)', { tag });
    }

    if (isFeatured !== undefined) {
      queryBuilder.andWhere('post.isFeatured = :isFeatured', { isFeatured });
    }

    queryBuilder.orderBy(`post.${sortBy}`, sortOrder);

    const total = await queryBuilder.getCount();
    const posts = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    return post;
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({
      where: { slug, status: BlogPostStatus.PUBLISHED },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    // Increment view count
    await this.blogPostRepository.increment({ id: post.id }, 'viewsCount', 1);

    return post;
  }

  async update(
    id: string,
    updateBlogPostDto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    const post = await this.findOne(id);

    // Check if slug is being changed and if it already exists
    if (updateBlogPostDto.slug && updateBlogPostDto.slug !== post.slug) {
      const existing = await this.blogPostRepository.findOne({
        where: { slug: updateBlogPostDto.slug },
      });

      if (existing) {
        throw new BadRequestException('A blog post with this slug already exists');
      }
    }

    // Recalculate reading time if content changed
    if (updateBlogPostDto.content) {
      const wordCount = updateBlogPostDto.content.split(/\s+/).length;
      updateBlogPostDto['readingTime'] = Math.ceil(wordCount / 200);
    }

    // Set publishedAt if status changed to published
    if (
      updateBlogPostDto.status === BlogPostStatus.PUBLISHED &&
      post.status !== BlogPostStatus.PUBLISHED
    ) {
      updateBlogPostDto['publishedAt'] = new Date();
    }

    Object.assign(post, updateBlogPostDto);
    return this.blogPostRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.blogPostRepository.remove(post);
  }

  async toggleLike(slug: string): Promise<{ likesCount: number }> {
    const post = await this.blogPostRepository.findOne({
      where: { slug, status: BlogPostStatus.PUBLISHED },
    });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    post.likesCount = (post.likesCount || 0) + 1;
    await this.blogPostRepository.save(post);
    return { likesCount: post.likesCount };
  }

  async getStats(): Promise<BlogStatsDto> {
    const [
      total,
      draft,
      published,
      scheduled,
      archived,
      byCategory,
      viewsData,
      likesData,
    ] = await Promise.all([
      this.blogPostRepository.count(),
      this.blogPostRepository.count({
        where: { status: BlogPostStatus.DRAFT },
      }),
      this.blogPostRepository.count({
        where: { status: BlogPostStatus.PUBLISHED },
      }),
      this.blogPostRepository.count({
        where: { status: BlogPostStatus.SCHEDULED },
      }),
      this.blogPostRepository.count({
        where: { status: BlogPostStatus.ARCHIVED },
      }),
      this.blogPostRepository
        .createQueryBuilder('post')
        .select('post.category', 'category')
        .addSelect('COUNT(*)', 'count')
        .groupBy('post.category')
        .getRawMany(),
      this.blogPostRepository
        .createQueryBuilder('post')
        .select('SUM(post.viewsCount)', 'total')
        .getRawOne(),
      this.blogPostRepository
        .createQueryBuilder('post')
        .select('SUM(post.likesCount)', 'total')
        .getRawOne(),
    ]);

    const byCategoryMap: Record<string, number> = {};
    byCategory.forEach((item) => {
      byCategoryMap[item.category] = parseInt(item.count);
    });

    return {
      total,
      draft,
      published,
      scheduled,
      archived,
      byCategory: byCategoryMap,
      totalViews: parseInt(viewsData?.total || '0'),
      totalLikes: parseInt(likesData?.total || '0'),
    };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledPublishing() {
    const now = new Date();
    const scheduledPosts = await this.blogPostRepository.find({
      where: {
        status: BlogPostStatus.SCHEDULED,
      },
    });

    for (const post of scheduledPosts) {
      if (post.scheduledAt && post.scheduledAt <= now) {
        post.status = BlogPostStatus.PUBLISHED;
        post.publishedAt = now;
        await this.blogPostRepository.save(post);
      }
    }
  }
}
