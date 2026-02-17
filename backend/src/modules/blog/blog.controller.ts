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
} from '@nestjs/common';
import { BlogService } from './blog.service';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
  ListBlogPostsDto,
} from './dto/blog-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('admin/blog')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER, UserRole.VIEWER)
export class BlogAdminController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  create(@Body() createBlogPostDto: CreateBlogPostDto, @Request() req) {
    return this.blogService.create(createBlogPostDto, req.user.id);
  }

  @Get()
  findAll(@Query() query: ListBlogPostsDto) {
    return this.blogService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.blogService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogService.update(id, updateBlogPostDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}

@Controller('blog')
export class BlogPublicController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findPublished(@Query() query: ListBlogPostsDto) {
    // Only return published posts for public
    return this.blogService.findAll({ ...query, status: 'published' as any });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Post(':slug/like')
  likePost(@Param('slug') slug: string) {
    return this.blogService.toggleLike(slug);
  }
}
