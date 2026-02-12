import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Comment, CommentStatus, CommentType } from './entities/comment.entity';
import {
  CreateCommentDto,
  UpdateCommentDto,
  ListCommentsDto,
  BulkActionDto,
} from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      userId,
      ipAddress,
      userAgent,
      status: CommentStatus.PENDING, // All comments start as pending
    });

    return this.commentRepository.save(comment);
  }

  async findAll(listCommentsDto: ListCommentsDto): Promise<{
    comments: Comment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      contentId,
      userId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = listCommentsDto;

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.content', 'content')
      .leftJoinAndSelect('comment.parent', 'parent');

    // Filters
    if (status) {
      queryBuilder.andWhere('comment.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('comment.type = :type', { type });
    }

    if (contentId) {
      queryBuilder.andWhere('comment.contentId = :contentId', { contentId });
    }

    if (userId) {
      queryBuilder.andWhere('comment.userId = :userId', { userId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(comment.text ILIKE :search OR comment.userName ILIKE :search OR comment.userEmail ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sorting
    queryBuilder.orderBy(`comment.${sortBy}`, sortOrder);

    // Pagination
    const total = await queryBuilder.getCount();
    const comments = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      comments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'content', 'parent'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    adminId?: string,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    Object.assign(comment, updateCommentDto);

    // If admin is replying, set admin info
    if (updateCommentDto.adminReply && adminId) {
      comment.adminId = adminId;
      comment.repliedAt = new Date();
    }

    return this.commentRepository.save(comment);
  }

  async remove(id: string): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentRepository.remove(comment);
  }

  async approve(id: string, adminId?: string): Promise<Comment> {
    return this.update(id, { status: CommentStatus.APPROVED }, adminId);
  }

  async reject(id: string, adminId?: string): Promise<Comment> {
    return this.update(id, { status: CommentStatus.REJECTED }, adminId);
  }

  async markAsSpam(id: string, adminId?: string): Promise<Comment> {
    return this.update(id, { status: CommentStatus.SPAM }, adminId);
  }

  async bulkAction(bulkActionDto: BulkActionDto, adminId?: string): Promise<{
    success: number;
    failed: number;
  }> {
    const { ids, action } = bulkActionDto;
    let success = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        switch (action) {
          case 'approve':
            await this.approve(id, adminId);
            break;
          case 'reject':
            await this.reject(id, adminId);
            break;
          case 'spam':
            await this.markAsSpam(id, adminId);
            break;
          case 'delete':
            await this.remove(id);
            break;
        }
        success++;
      } catch (error) {
        failed++;
      }
    }

    return { success, failed };
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    spam: number;
    byType: Record<CommentType, number>;
  }> {
    const [
      total,
      pending,
      approved,
      rejected,
      spam,
      comments,
      support,
      report,
      feedback,
    ] = await Promise.all([
      this.commentRepository.count(),
      this.commentRepository.count({ where: { status: CommentStatus.PENDING } }),
      this.commentRepository.count({ where: { status: CommentStatus.APPROVED } }),
      this.commentRepository.count({ where: { status: CommentStatus.REJECTED } }),
      this.commentRepository.count({ where: { status: CommentStatus.SPAM } }),
      this.commentRepository.count({ where: { type: CommentType.COMMENT } }),
      this.commentRepository.count({ where: { type: CommentType.SUPPORT } }),
      this.commentRepository.count({ where: { type: CommentType.REPORT } }),
      this.commentRepository.count({ where: { type: CommentType.FEEDBACK } }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      spam,
      byType: {
        [CommentType.COMMENT]: comments,
        [CommentType.SUPPORT]: support,
        [CommentType.REPORT]: report,
        [CommentType.FEEDBACK]: feedback,
      },
    };
  }
}
