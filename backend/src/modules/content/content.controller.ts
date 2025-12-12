import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { ContentQueryDto } from './dto/content-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'List content with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Content list retrieved' })
  async findAll(
    @Query() query: ContentQueryDto,
    @CurrentUser() user?: User,
  ) {
    const isAdmin = user?.role === UserRole.ADMIN;
    return this.contentService.findAll(query, isAdmin);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending content' })
  @ApiResponse({ status: 200, description: 'Trending content retrieved' })
  async getTrending(@Query('limit') limit?: number) {
    return this.contentService.getTrending(limit ? parseInt(limit.toString()) : 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiResponse({ status: 200, description: 'Content retrieved' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user?: User,
  ) {
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
  async getStreamInfo(
    @Param('id') id: string,
    @CurrentUser() user?: User,
  ) {
    const isAdmin = user?.role === UserRole.ADMIN;
    return this.contentService.getStreamInfo(id, isAdmin);
  }
}

