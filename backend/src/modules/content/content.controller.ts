import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { ContentQueryDto } from './dto/content-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { ContentType } from './entities/content.entity';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List content with pagination and filters (from database)' })
  @ApiResponse({ status: 200, description: 'Content list retrieved' })
  async findAll(@Query() query: ContentQueryDto, @CurrentUser() user?: User) {
    const isAdmin = user?.role === UserRole.ADMIN;
    return this.contentService.findAll(query, isAdmin);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending content (from database)' })
  @ApiResponse({ status: 200, description: 'Trending content retrieved' })
  async getTrending(@Query('limit') limit?: number) {
    return this.contentService.getTrending(limit ? parseInt(limit.toString()) : 10);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular content sorted by priority and rating (from database)' })
  @ApiQuery({ name: 'type', enum: ContentType, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Popular content retrieved' })
  async getPopular(
    @Query('type') type?: ContentType,
    @Query('limit') limit?: number,
  ) {
    return this.contentService.getPopular(
      type,
      limit ? parseInt(limit.toString()) : 20,
    );
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured content (from database)' })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Featured content retrieved' })
  async getFeatured(@Query('limit') limit?: number) {
    return this.contentService.getFeatured(limit ? parseInt(limit.toString()) : 10);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search content in database' })
  @ApiQuery({ name: 'q', type: String, required: true })
  @ApiQuery({ name: 'type', enum: ContentType, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(
    @Query('q') q: string,
    @Query('type') type?: ContentType,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const trimmed = (q || '').trim();
    if (!trimmed) {
      return { items: [], total: 0, page: 1, limit: 0, totalPages: 0 };
    }
    return this.contentService.searchContent(
      trimmed,
      type,
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 20,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID (from database)' })
  @ApiResponse({ status: 200, description: 'Content retrieved' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user?: User) {
    const isAdmin = user?.role === UserRole.ADMIN;
    return this.contentService.findOne(id, isAdmin);
  }

  @Get(':id/episodes')
  @ApiOperation({ summary: 'Get episodes for a series' })
  @ApiResponse({ status: 200, description: 'Episodes retrieved' })
  @ApiResponse({ status: 404, description: 'Series not found' })
  async getEpisodes(@Param('id') id: string) {
    return this.contentService.getEpisodes(id);
  }

  @Get(':id/stream')
  @ApiOperation({ summary: 'Get streaming info for content' })
  @ApiResponse({ status: 200, description: 'Streaming info retrieved' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async getStreamInfo(@Param('id') id: string, @CurrentUser() user?: User) {
    const isAdmin = user?.role === UserRole.ADMIN;
    return this.contentService.getStreamInfo(id, isAdmin);
  }

  @Get(':id/external-player')
  @ApiOperation({ summary: 'Get external player URL for content (redirects to third-party provider)' })
  @ApiResponse({ status: 200, description: 'External player URL retrieved' })
  @ApiResponse({ status: 404, description: 'Content not found or no external URL configured' })
  async getExternalPlayerUrl(@Param('id') id: string, @CurrentUser() user?: User) {
    const isAdmin = user?.role === UserRole.ADMIN;
    return this.contentService.getExternalPlayerUrl(id, isAdmin);
  }
}
