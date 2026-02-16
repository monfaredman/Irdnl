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
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
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
import { CreateSeasonDto, UpdateSeasonDto } from './dto/create-season.dto';
import { CreateEpisodeDto, UpdateEpisodeDto } from './dto/create-episode.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MarkTranscodedDto } from './dto/mark-transcoded.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateGenreDto, UpdateGenreDto } from './dto/genre.dto';
import { CreateSliderDto, UpdateSliderDto } from './dto/slider.dto';
import { CreateOfferDto, UpdateOfferDto } from './dto/offer.dto';
import { CreatePinDto, UpdatePinDto } from './dto/pin.dto';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collection.dto';
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
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload video file for content or episode (admin only)' })
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
          description: 'Content ID (required for movies, optional for series episodes)',
        },
        episodeId: {
          type: 'string',
          description: 'Episode ID (for series episodes)',
        },
        quality: {
          type: 'string',
          example: '1080p',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Video uploaded' })
  @ApiResponse({ status: 404, description: 'Content/Episode not found' })
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('contentId') contentId: string,
    @Body('episodeId') episodeId: string,
    @Body('quality') quality: string,
  ) {
    try {
      return await this.adminService.uploadVideo(contentId, file, quality, episodeId);
    } catch (error) {
      // Log full error for local debugging
      console.error('Error in admin.uploadVideo:', error);
      // Return a clearer server error response
      throw new InternalServerErrorException(
        'Video upload failed: ' + (error?.message || 'unknown error'),
      );
    }
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

  @Delete('videos/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete video asset (admin only)' })
  @ApiResponse({ status: 204, description: 'Video asset deleted' })
  @ApiResponse({ status: 404, description: 'Video asset not found' })
  async deleteVideoAsset(@Param('id') id: string) {
    await this.adminService.deleteVideoAsset(id);
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

  @Put('seasons/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update season (admin only)' })
  @ApiResponse({ status: 200, description: 'Season updated' })
  @ApiResponse({ status: 404, description: 'Season not found' })
  async updateSeason(@Param('id') id: string, @Body() updateSeasonDto: UpdateSeasonDto) {
    return this.adminService.updateSeason(id, updateSeasonDto);
  }

  @Delete('seasons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete season and its episodes (admin only)' })
  @ApiResponse({ status: 204, description: 'Season deleted' })
  @ApiResponse({ status: 404, description: 'Season not found' })
  async deleteSeason(@Param('id') id: string) {
    await this.adminService.deleteSeason(id);
  }

  @Put('episodes/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update episode (admin only)' })
  @ApiResponse({ status: 200, description: 'Episode updated' })
  @ApiResponse({ status: 404, description: 'Episode not found' })
  async updateEpisode(@Param('id') id: string, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    return this.adminService.updateEpisode(id, updateEpisodeDto);
  }

  @Delete('episodes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete episode (admin only)' })
  @ApiResponse({ status: 204, description: 'Episode deleted' })
  @ApiResponse({ status: 404, description: 'Episode not found' })
  async deleteEpisode(@Param('id') id: string) {
    await this.adminService.deleteEpisode(id);
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

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user (admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  async createUser(@Body() createUserDto: any) {
    return this.adminService.createUser(createUserDto);
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
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
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
  // CATEGORIES CRUD
  // ========================================================================

  @Get('categories')
  @ApiOperation({ summary: 'List all categories (admin only)' })
  @ApiResponse({ status: 200, description: 'Categories list' })
  async listCategories() {
    return this.adminService.listCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Category details' })
  async getCategory(@Param('id') id: string) {
    return this.adminService.getCategory(id);
  }

  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create category (admin only)' })
  @ApiResponse({ status: 201, description: 'Category created' })
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.adminService.createCategory(dto);
  }

  @Put('categories/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update category (admin only)' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.adminService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category (admin only)' })
  @ApiResponse({ status: 204, description: 'Category deleted' })
  async deleteCategory(@Param('id') id: string) {
    await this.adminService.deleteCategory(id);
  }

  // ========================================================================
  // GENRES CRUD
  // ========================================================================

  @Get('genres')
  @ApiOperation({ summary: 'List all genres (admin only)' })
  @ApiQuery({ name: 'categorySlug', required: false })
  @ApiResponse({ status: 200, description: 'Genres list' })
  async listGenres(@Query('categorySlug') categorySlug?: string) {
    return this.adminService.listGenres(categorySlug);
  }

  @Get('genres/:id')
  @ApiOperation({ summary: 'Get genre by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Genre details' })
  async getGenre(@Param('id') id: string) {
    return this.adminService.getGenre(id);
  }

  @Post('genres')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create genre (admin only)' })
  @ApiResponse({ status: 201, description: 'Genre created' })
  async createGenre(@Body() dto: CreateGenreDto) {
    return this.adminService.createGenre(dto);
  }

  @Put('genres/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update genre (admin only)' })
  @ApiResponse({ status: 200, description: 'Genre updated' })
  async updateGenre(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.adminService.updateGenre(id, dto);
  }

  @Delete('genres/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete genre (admin only)' })
  @ApiResponse({ status: 204, description: 'Genre deleted' })
  async deleteGenre(@Param('id') id: string) {
    await this.adminService.deleteGenre(id);
  }

  // ========================================================================
  // SLIDERS CRUD
  // ========================================================================

  @Get('sliders')
  @ApiOperation({ summary: 'List all sliders (admin only)' })
  @ApiQuery({ name: 'section', required: false })
  @ApiResponse({ status: 200, description: 'Sliders list' })
  async listSliders(@Query('section') section?: string) {
    return this.adminService.listSliders(section);
  }

  @Get('sliders/:id')
  @ApiOperation({ summary: 'Get slider by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Slider details' })
  async getSlider(@Param('id') id: string) {
    return this.adminService.getSlider(id);
  }

  @Post('sliders')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create slider (admin only)' })
  @ApiResponse({ status: 201, description: 'Slider created' })
  async createSlider(@Body() dto: CreateSliderDto) {
    return this.adminService.createSlider(dto);
  }

  @Put('sliders/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update slider (admin only)' })
  @ApiResponse({ status: 200, description: 'Slider updated' })
  async updateSlider(@Param('id') id: string, @Body() dto: UpdateSliderDto) {
    return this.adminService.updateSlider(id, dto);
  }

  @Delete('sliders/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete slider (admin only)' })
  @ApiResponse({ status: 204, description: 'Slider deleted' })
  async deleteSlider(@Param('id') id: string) {
    await this.adminService.deleteSlider(id);
  }

  // ========================================================================
  // OFFERS CRUD
  // ========================================================================

  @Get('offers')
  @ApiOperation({ summary: 'List all offers (admin only)' })
  @ApiResponse({ status: 200, description: 'Offers list' })
  async listOffers() {
    return this.adminService.listOffers();
  }

  @Get('offers/:id')
  @ApiOperation({ summary: 'Get offer by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Offer details' })
  async getOffer(@Param('id') id: string) {
    return this.adminService.getOffer(id);
  }

  @Post('offers')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create offer (admin only)' })
  @ApiResponse({ status: 201, description: 'Offer created' })
  async createOffer(@Body() dto: CreateOfferDto) {
    return this.adminService.createOffer(dto);
  }

  @Put('offers/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update offer (admin only)' })
  @ApiResponse({ status: 200, description: 'Offer updated' })
  async updateOffer(@Param('id') id: string, @Body() dto: UpdateOfferDto) {
    return this.adminService.updateOffer(id, dto);
  }

  @Delete('offers/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete offer (admin only)' })
  @ApiResponse({ status: 204, description: 'Offer deleted' })
  async deleteOffer(@Param('id') id: string) {
    await this.adminService.deleteOffer(id);
  }

  // ========================================================================
  // PINS CRUD
  // ========================================================================

  @Get('pins')
  @ApiOperation({ summary: 'List all pins (admin only)' })
  @ApiQuery({ name: 'section', required: false })
  @ApiResponse({ status: 200, description: 'Pins list' })
  async listPins(@Query('section') section?: string) {
    return this.adminService.listPins(section);
  }

  @Get('pins/:id')
  @ApiOperation({ summary: 'Get pin by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Pin details' })
  async getPin(@Param('id') id: string) {
    return this.adminService.getPin(id);
  }

  @Post('pins')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create pin (admin only)' })
  @ApiResponse({ status: 201, description: 'Pin created' })
  async createPin(@Body() dto: CreatePinDto) {
    return this.adminService.createPin(dto);
  }

  @Put('pins/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update pin (admin only)' })
  @ApiResponse({ status: 200, description: 'Pin updated' })
  async updatePin(@Param('id') id: string, @Body() dto: UpdatePinDto) {
    return this.adminService.updatePin(id, dto);
  }

  @Delete('pins/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete pin (admin only)' })
  @ApiResponse({ status: 204, description: 'Pin deleted' })
  async deletePin(@Param('id') id: string) {
    await this.adminService.deletePin(id);
  }

  // ========================================================================
  // Collections (Admin Only)
  // ========================================================================

  @Get('collections')
  @ApiOperation({ summary: 'List collections (admin only)' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Collections list' })
  async listCollections(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return await this.adminService.listCollections(page, limit);
  }

  @Get('collections/:id')
  @ApiOperation({ summary: 'Get collection by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Collection details' })
  async getCollection(@Param('id') id: string) {
    return await this.adminService.getCollection(id);
  }

  @Post('collections')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create collection (admin only)' })
  @ApiResponse({ status: 201, description: 'Collection created' })
  async createCollection(@Body() dto: CreateCollectionDto) {
    return await this.adminService.createCollection(dto);
  }

  @Put('collections/:id')
  @ApiOperation({ summary: 'Update collection (admin only)' })
  @ApiResponse({ status: 200, description: 'Collection updated' })
  async updateCollection(
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    return await this.adminService.updateCollection(id, dto);
  }

  @Delete('collections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete collection (admin only)' })
  @ApiResponse({ status: 204, description: 'Collection deleted' })
  async deleteCollection(@Param('id') id: string) {
    await this.adminService.deleteCollection(id);
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
            posterUrl: result.poster_path ? `https://image.tmdb.org/t/p/w780${result.poster_path}` : '',
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
            posterUrl: result.poster_path ? `https://image.tmdb.org/t/p/w780${result.poster_path}` : '',
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
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w780${data.poster_path}` : '',
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
      // Include raw seasons list for TV shows
      ...(mediaType === 'tv' && data.seasons ? {
        seasons: (data.seasons || []).map((s: any) => ({
          id: s.id,
          name: s.name || '',
          seasonNumber: s.season_number,
          episodeCount: s.episode_count || 0,
          overview: s.overview || '',
          posterUrl: s.poster_path ? `https://image.tmdb.org/t/p/w300${s.poster_path}` : '',
          airDate: s.air_date || '',
        })),
      } : {}),
    };
  }

  // ========================================================================
  // TMDB Season & Episode Endpoints (Admin Only) - Used for auto-fill
  // ========================================================================

  @Get('tmdb/tv/:id/season/:seasonNumber')
  @ApiOperation({ summary: 'Get episodes for a TV season from TMDB (admin auto-fill)' })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiResponse({ status: 200, description: 'TMDB season episodes for auto-fill' })
  async tmdbTVSeasonEpisodes(
    @Param('id') id: string,
    @Param('seasonNumber') seasonNumber: string,
    @Query('language') language: 'en' | 'fa' = 'fa',
  ) {
    const data = await this.tmdbService.getTVSeasonDetails(
      id,
      parseInt(seasonNumber),
      language,
    );

    const episodes = (data.episodes || []).map((ep: any) => ({
      episodeNumber: ep.episode_number,
      name: ep.name || '',
      overview: ep.overview || '',
      runtime: ep.runtime || null, // minutes
      stillUrl: ep.still_path ? `https://image.tmdb.org/t/p/w780${ep.still_path}` : '',
      airDate: ep.air_date || '',
      voteAverage: ep.vote_average || 0,
    }));

    return {
      seasonNumber: data.season_number,
      name: data.name || '',
      overview: data.overview || '',
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w300${data.poster_path}` : '',
      airDate: data.air_date || '',
      episodes,
    };
  }
}
