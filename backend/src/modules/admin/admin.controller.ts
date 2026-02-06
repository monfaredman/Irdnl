import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { TMDBService } from '../content/tmdb.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ListContentDto } from './dto/list-content.dto';
import { CreateSeasonDto } from './dto/create-season.dto';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MarkTranscodedDto } from './dto/mark-transcoded.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly tmdbService: TMDBService,
  ) {}

  @Post('content')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create content (admin only)' })
  @ApiResponse({ status: 201, description: 'Content created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createContent(@Body() createContentDto: CreateContentDto) {
    return this.adminService.createContent(createContentDto);
  }

  @Put('content/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update content (admin only)' })
  @ApiResponse({ status: 200, description: 'Content updated' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async updateContent(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.adminService.updateContent(id, updateContentDto);
  }

  @Delete('content/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete content (admin only)' })
  @ApiResponse({ status: 204, description: 'Content deleted' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async deleteContent(@Param('id') id: string) {
    await this.adminService.deleteContent(id);
  }

  @Post('videos/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload video file (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        contentId: {
          type: 'string',
        },
        quality: {
          type: 'string',
          example: '1080p',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Video uploaded' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('contentId') contentId: string,
    @Body('quality') quality: string,
  ) {
    return this.adminService.uploadVideo(contentId, file, quality);
  }

  @Get('content')
  @ApiOperation({ summary: 'List content with pagination (admin only)' })
  @ApiResponse({ status: 200, description: 'Content list' })
  async listContent(@Query() listContentDto: ListContentDto) {
    return this.adminService.listContent(listContentDto);
  }

  @Get('content/:id')
  @ApiOperation({ summary: 'Get content by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Content details' })
  async getContent(@Param('id') id: string) {
    return this.adminService.getContent(id);
  }

  @Post('videos/:assetId/mark-transcoded')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark video asset as transcoded (admin only)' })
  @ApiResponse({ status: 200, description: 'Video asset updated' })
  @ApiResponse({ status: 404, description: 'Video asset not found' })
  async markTranscoded(
    @Param('assetId') assetId: string,
    @Body() markTranscodedDto: MarkTranscodedDto,
  ) {
    return this.adminService.markTranscoded(assetId, markTranscodedDto);
  }

  @Get('videos')
  @ApiOperation({ summary: 'List video assets (admin only)' })
  @ApiResponse({ status: 200, description: 'Video assets list' })
  async listVideoAssets(@Query('contentId') contentId?: string) {
    return this.adminService.listVideoAssets(contentId);
  }

  @Get('videos/:id')
  @ApiOperation({ summary: 'Get video asset by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Video asset details' })
  async getVideoAsset(@Param('id') id: string) {
    return this.adminService.getVideoAsset(id);
  }

  @Post('seasons')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create season (admin only)' })
  @ApiResponse({ status: 201, description: 'Season created' })
  async createSeason(@Body() createSeasonDto: CreateSeasonDto) {
    return this.adminService.createSeason(createSeasonDto);
  }

  @Post('episodes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create episode (admin only)' })
  @ApiResponse({ status: 201, description: 'Episode created' })
  async createEpisode(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.adminService.createEpisode(createEpisodeDto);
  }

  @Get('users')
  @ApiOperation({ summary: 'List users with pagination (admin only)' })
  @ApiResponse({ status: 200, description: 'Users list' })
  async listUsers(@Query() listUsersDto: ListUsersDto) {
    return this.adminService.listUsers(listUsersDto);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'User details' })
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user (admin only)' })
  @ApiResponse({ status: 200, description: 'User updated' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  async deleteUser(@Param('id') id: string) {
    await this.adminService.deleteUser(id);
  }

  @Post('images/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload image (poster/banner) (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['poster', 'banner'],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: 'poster' | 'banner',
  ) {
    return this.adminService.uploadImage(file, type);
  }

  // ========================================================================
  // TMDB Helper Endpoints (Admin Only) - Used for auto-fill in content wizard
  // ========================================================================

  @Get('tmdb/search')
  @ApiOperation({ summary: 'Search TMDB for movies and TV shows (admin helper for auto-fill)' })
  @ApiQuery({ name: 'q', type: String, required: true })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'TMDB search results for admin auto-fill' })
  async tmdbSearch(
    @Query('q') query: string,
    @Query('language') language: 'en' | 'fa' = 'fa',
    @Query('page') page: number = 1,
  ) {
    const trimmed = (query || '').trim();
    if (!trimmed) {
      return { items: [], total: 0, page: 1, limit: 0, totalPages: 0 };
    }

    const response = await this.tmdbService.searchMulti(trimmed, {
      language,
      page: page ? parseInt(page.toString()) : 1,
    });

    const items = response.results
      .map((result: any) => {
        if (result?.media_type === 'movie') {
          return {
            tmdbId: String(result.id),
            mediaType: 'movie',
            title: result.title || '',
            originalTitle: result.original_title || '',
            description: result.overview || '',
            year: result.release_date ? new Date(result.release_date).getFullYear() : null,
            posterUrl: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '',
            backdropUrl: result.backdrop_path ? `https://image.tmdb.org/t/p/original${result.backdrop_path}` : '',
            rating: typeof result.vote_average === 'number' ? Math.round(result.vote_average * 10) / 10 : 0,
            originalLanguage: result.original_language || '',
            genreIds: result.genre_ids || [],
          };
        }
        if (result?.media_type === 'tv') {
          return {
            tmdbId: String(result.id),
            mediaType: 'tv',
            title: result.name || '',
            originalTitle: result.original_name || '',
            description: result.overview || '',
            year: result.first_air_date ? new Date(result.first_air_date).getFullYear() : null,
            posterUrl: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '',
            backdropUrl: result.backdrop_path ? `https://image.tmdb.org/t/p/original${result.backdrop_path}` : '',
            rating: typeof result.vote_average === 'number' ? Math.round(result.vote_average * 10) / 10 : 0,
            originalLanguage: result.original_language || '',
            genreIds: result.genre_ids || [],
            originCountry: result.origin_country || [],
          };
        }
        return null;
      })
      .filter(Boolean);

    return {
      items,
      total: response.total_results,
      page: response.page,
      limit: response.results.length,
      totalPages: response.total_pages,
    };
  }

  @Get('tmdb/details/movie/:id')
  @ApiOperation({ summary: 'Get full movie details from TMDB for admin auto-fill' })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiResponse({ status: 200, description: 'TMDB movie details for auto-fill' })
  async tmdbMovieDetails(
    @Param('id') id: string,
    @Query('language') language: 'en' | 'fa' = 'fa',
  ) {
    const data = await this.tmdbService.getMovieDetails(id, language);
    return this.transformTMDBDetailsForAdmin(data, 'movie');
  }

  @Get('tmdb/details/tv/:id')
  @ApiOperation({ summary: 'Get full TV show details from TMDB for admin auto-fill' })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiResponse({ status: 200, description: 'TMDB TV show details for auto-fill' })
  async tmdbTVDetails(
    @Param('id') id: string,
    @Query('language') language: 'en' | 'fa' = 'fa',
  ) {
    const data = await this.tmdbService.getTVDetails(id, language);
    return this.transformTMDBDetailsForAdmin(data, 'tv');
  }

  /**
   * Transform raw TMDB details response into our ContentFormData shape
   * so the admin wizard can directly populate fields.
   */
  private transformTMDBDetailsForAdmin(data: any, mediaType: 'movie' | 'tv') {
    const genres = (data.genres || []).map((g: any) => g.name?.toLowerCase().replace(/\s+/g, '-') || '');
    const cast = (data.credits?.cast || []).slice(0, 20).map((c: any) => ({
      name: c.name || '',
      character: c.character || '',
      imageUrl: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : '',
    }));
    const crew = (data.credits?.crew || []).slice(0, 10).map((c: any) => ({
      name: c.name || '',
      role: c.job || '',
      department: c.department || '',
    }));
    const director = (data.credits?.crew || []).find((c: any) => c.job === 'Director')?.name || '';
    const writer = (data.credits?.crew || []).find((c: any) => c.job === 'Writer' || c.job === 'Screenplay')?.name || '';
    const producer = (data.credits?.crew || []).find((c: any) => c.job === 'Producer')?.name || '';
    const productionCompany = (data.production_companies || [])[0]?.name || '';
    const country = (data.production_countries || [])[0]?.iso_3166_1 || '';

    return {
      title: data.title || data.name || '',
      originalTitle: data.original_title || data.original_name || '',
      tagline: data.tagline || '',
      type: mediaType === 'movie' ? 'movie' : 'series',
      year: mediaType === 'movie'
        ? (data.release_date ? new Date(data.release_date).getFullYear() : null)
        : (data.first_air_date ? new Date(data.first_air_date).getFullYear() : null),
      description: data.overview || '',
      duration: data.runtime ? data.runtime * 60 : null, // Convert minutes to seconds
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '',
      bannerUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : '',
      backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : '',
      rating: typeof data.vote_average === 'number' ? Math.round(data.vote_average * 10) / 10 : 0,
      genres,
      originalLanguage: data.original_language || '',
      languages: data.spoken_languages ? data.spoken_languages.map((l: any) => l.iso_639_1) : [],
      cast,
      crew,
      director,
      writer,
      producer,
      productionCompany,
      country,
      tmdbId: String(data.id),
      imdbId: data.imdb_id || '',
      // TV-specific
      ...(mediaType === 'tv' && data.number_of_seasons ? { numberOfSeasons: data.number_of_seasons } : {}),
      ...(mediaType === 'tv' && data.number_of_episodes ? { numberOfEpisodes: data.number_of_episodes } : {}),
    };
  }
}
