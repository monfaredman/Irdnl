import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { TMDBAdminService } from './tmdb-admin.service';
import {
  TMDBSearchDto,
  TMDBDiscoverDto,
  TMDBPopularDto,
  TMDBTrendingDto,
  TMDBDetailsDto,
  TMDBSeasonDetailsDto,
  SaveTMDBContentDto,
  ImportTMDBToDBDto,
} from './dto/tmdb.dto';

@ApiTags('Admin - TMDB')
@Controller('admin/tmdb')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER, UserRole.VIEWER)
@ApiBearerAuth()
export class TMDBAdminController {
  constructor(private readonly tmdbAdminService: TMDBAdminService) {}

  // ==========================================
  // TMDB API ENDPOINTS
  // ==========================================

  @Get('search')
  @ApiOperation({ summary: 'Search TMDB for movies and TV shows' })
  @ApiResponse({ status: 200, description: 'Search results returned' })
  async search(@Query() dto: TMDBSearchDto) {
    return this.tmdbAdminService.search(dto);
  }

  @Get('discover')
  @ApiOperation({ summary: 'Discover movies or TV shows with filters' })
  @ApiResponse({ status: 200, description: 'Discover results returned' })
  async discover(@Query() dto: TMDBDiscoverDto) {
    return this.tmdbAdminService.discover(dto);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular movies or TV shows' })
  @ApiResponse({ status: 200, description: 'Popular content returned' })
  async getPopular(@Query() dto: TMDBPopularDto) {
    return this.tmdbAdminService.getPopular(dto);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending content' })
  @ApiResponse({ status: 200, description: 'Trending content returned' })
  async getTrending(@Query() dto: TMDBTrendingDto) {
    return this.tmdbAdminService.getTrending(dto);
  }

  @Get('details')
  @ApiOperation({ summary: 'Get full details for a movie or TV show' })
  @ApiResponse({ status: 200, description: 'Content details returned' })
  async getDetails(@Query() dto: TMDBDetailsDto) {
    return this.tmdbAdminService.getDetails(dto);
  }

  @Get('season-details')
  @ApiOperation({ summary: 'Get season details for a TV show' })
  @ApiResponse({ status: 200, description: 'Season details returned' })
  async getSeasonDetails(@Query() dto: TMDBSeasonDetailsDto) {
    return this.tmdbAdminService.getSeasonDetails(dto);
  }

  // ==========================================
  // LOCAL STORAGE ENDPOINTS
  // ==========================================

  @Post('saved')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save TMDB content locally for later import' })
  @ApiResponse({ status: 201, description: 'Content saved locally' })
  async saveContent(@Body() dto: SaveTMDBContentDto) {
    return this.tmdbAdminService.saveContent(dto);
  }

  @Post('saved/bulk')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save multiple TMDB content items locally' })
  @ApiResponse({ status: 201, description: 'Contents saved locally' })
  async saveBulkContent(@Body() items: SaveTMDBContentDto[]) {
    return this.tmdbAdminService.saveBulkContent(items);
  }

  @Get('saved')
  @ApiOperation({ summary: 'Get all saved TMDB content' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'mediaType', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Saved content list returned' })
  async getSavedContent(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('mediaType') mediaType?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.tmdbAdminService.getSavedContent({
      page,
      limit,
      mediaType,
      status,
      search,
    });
  }

  @Get('saved/:id')
  @ApiOperation({ summary: 'Get a single saved TMDB content by ID' })
  @ApiResponse({ status: 200, description: 'Saved content returned' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async getSavedContentById(@Param('id') id: string) {
    return this.tmdbAdminService.getSavedContentById(id);
  }

  @Post('saved/import')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Import saved TMDB content into the main database' })
  @ApiResponse({ status: 201, description: 'Content imported to database' })
  @ApiResponse({ status: 404, description: 'Saved content not found' })
  async importToDatabase(@Body() dto: ImportTMDBToDBDto) {
    return this.tmdbAdminService.importToDatabase(dto.savedContentId);
  }

  @Delete('saved/:id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete saved TMDB content' })
  @ApiResponse({ status: 204, description: 'Content deleted' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async deleteSavedContent(@Param('id') id: string) {
    return this.tmdbAdminService.deleteSavedContent(id);
  }
}
