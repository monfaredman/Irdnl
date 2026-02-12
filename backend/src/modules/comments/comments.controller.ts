import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import {
  CreateCommentDto,
  UpdateCommentDto,
  ListCommentsDto,
  BulkActionDto,
} from './dto/comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Admin - Comments')
@Controller('admin/comments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class CommentsAdminController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all comments with filters' })
  async findAll(@Query() listCommentsDto: ListCommentsDto) {
    return this.commentsService.findAll(listCommentsDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get comments statistics' })
  async getStats() {
    return this.commentsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  async findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update comment' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.update(id, updateCommentDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete comment' })
  async remove(@Param('id') id: string) {
    await this.commentsService.remove(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve comment' })
  async approve(@Param('id') id: string, @Request() req) {
    return this.commentsService.approve(id, req.user.id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject comment' })
  async reject(@Param('id') id: string, @Request() req) {
    return this.commentsService.reject(id, req.user.id);
  }

  @Post(':id/spam')
  @ApiOperation({ summary: 'Mark comment as spam' })
  async markAsSpam(@Param('id') id: string, @Request() req) {
    return this.commentsService.markAsSpam(id, req.user.id);
  }

  @Post('bulk-action')
  @ApiOperation({ summary: 'Perform bulk action on comments' })
  async bulkAction(@Body() bulkActionDto: BulkActionDto, @Request() req) {
    return this.commentsService.bulkAction(bulkActionDto, req.user.id);
  }
}

@ApiTags('Comments - Public')
@Controller('comments')
export class CommentsPublicController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new comment (public)' })
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    return this.commentsService.create(
      createCommentDto,
      userId,
      ipAddress,
      userAgent,
    );
  }

  @Get('content/:contentId')
  @ApiOperation({ summary: 'Get approved comments for content' })
  async getContentComments(
    @Param('contentId') contentId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.commentsService.findAll({
      contentId,
      status: 'approved' as any,
      page: Number(page),
      limit: Number(limit),
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });
  }
}
