import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { TMDBService } from './tmdb.service';
import { ContentQueryDto } from './dto/content-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly tmdbService: TMDBService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List content with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Content list retrieved' })
  async findAll(@Query() query: ContentQueryDto, @CurrentUser() user?: User) {
    const isAdmin = user?.role === UserRole.ADMIN;
    return this.contentService.findAll(query, isAdmin);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending content' })
  @ApiResponse({ status: 200, description: 'Trending content retrieved' })
  async getTrending(@Query('limit') limit?: number) {
    return this.contentService.getTrending(limit ? parseInt(limit.toString()) : 10);
  }

  // TMDB Integration Endpoints
  @Get('tmdb/popular/movies')
  @ApiOperation({ summary: 'Get popular movies from TMDB' })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Popular movies retrieved from TMDB' })
  async getPopularMovies(
    @Query('language') language: 'en' | 'fa' = 'en',
    @Query('page') page: number = 1,
  ) {
    const response = await this.tmdbService.getPopularMovies(language, page);
    const items = response.results.map((movie) => this.tmdbService.transformMovie(movie));
    return {
      items,
      total: response.total_results,
      page: response.page,
      limit: response.results.length,
      totalPages: response.total_pages,
    };
  }

  @Get('tmdb/trending/movies')
  @ApiOperation({ summary: 'Get trending movies from TMDB' })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiResponse({ status: 200, description: 'Trending movies retrieved from TMDB' })
  async getTrendingMovies(@Query('language') language: 'en' | 'fa' = 'en') {
    const response = await this.tmdbService.getTrendingMovies(language);
    const items = response.results.map((movie) => this.tmdbService.transformMovie(movie));
    return {
      items,
      total: response.total_results,
      page: response.page,
      limit: response.results.length,
      totalPages: response.total_pages,
    };
  }

  @Get('tmdb/popular/tv')
  @ApiOperation({ summary: 'Get popular TV shows from TMDB' })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Popular TV shows retrieved from TMDB' })
  async getPopularTVShows(
    @Query('language') language: 'en' | 'fa' = 'en',
    @Query('page') page: number = 1,
  ) {
    const response = await this.tmdbService.getPopularTVShows(language, page);
    const items = response.results.map((show) => this.tmdbService.transformTVShow(show));
    return {
      items,
      total: response.total_results,
      page: response.page,
      limit: response.results.length,
      totalPages: response.total_pages,
    };
  }

  @Get('tmdb/search/movies')
  @ApiOperation({ summary: 'Search movies on TMDB' })
  @ApiQuery({ name: 'q', type: String, required: true })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiResponse({ status: 200, description: 'Movie search results from TMDB' })
  async searchMovies(@Query('q') query: string, @Query('language') language: 'en' | 'fa' = 'en') {
    const response = await this.tmdbService.searchMovies(query, language);
    const items = response.results.map((movie) => this.tmdbService.transformMovie(movie));
    return {
      items,
      total: response.total_results,
      page: response.page,
      limit: response.results.length,
      totalPages: response.total_pages,
    };
  }

  @Get('tmdb/search/tv')
  @ApiOperation({ summary: 'Search TV shows on TMDB' })
  @ApiQuery({ name: 'q', type: String, required: true })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiResponse({ status: 200, description: 'TV show search results from TMDB' })
  async searchTVShows(@Query('q') query: string, @Query('language') language: 'en' | 'fa' = 'en') {
    const response = await this.tmdbService.searchTVShows(query, language);
    const items = response.results.map((show) => this.tmdbService.transformTVShow(show));
    return {
      items,
      total: response.total_results,
      page: response.page,
      limit: response.results.length,
      totalPages: response.total_pages,
    };
  }

  @Get('tmdb/search')
  @ApiOperation({ summary: 'Search across movies and TV shows on TMDB (multi-search)' })
  @ApiQuery({ name: 'q', type: String, required: true })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Multi search results from TMDB' })
  async search(
    @Query('q') query: string,
    @Query('language') language: 'en' | 'fa' = 'en',
    @Query('page') page: number = 1,
  ) {
    const trimmed = (query || '').trim();
    if (!trimmed) {
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 0,
        totalPages: 0,
      };
    }

    const response = await this.tmdbService.searchMulti(trimmed, {
      language,
      page: page ? parseInt(page.toString()) : 1,
    });

    const items = response.results
      .map((result: any) => {
        if (result?.media_type === 'movie') {
          return { type: 'movie', item: this.tmdbService.transformMovie(result) };
        }
        if (result?.media_type === 'tv') {
          return { type: 'series', item: this.tmdbService.transformTVShow(result) };
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

  @Get('tmdb/discover/movies')
  @ApiOperation({ summary: 'Discover movies on TMDB with filters' })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiQuery({ name: 'genre', type: String, required: false })
  @ApiQuery({ name: 'year', type: Number, required: false })
  @ApiQuery({ name: 'certification', type: String, required: false })
  @ApiQuery({ name: 'country', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Discovered movies from TMDB' })
  async discoverMovies(
    @Query('language') language: 'en' | 'fa' = 'en',
    @Query('genre') genre?: string,
    @Query('year') year?: number,
    @Query('certification') certification?: string,
    @Query('country') country?: string,
    @Query('page') page?: number,
  ) {
    const response = await this.tmdbService.discoverMovies(language, {
      genre,
      year: year ? parseInt(year.toString()) : undefined,
      certification,
      country,
      page: page ? parseInt(page.toString()) : 1,
    });
    const items = response.results.map((movie) => this.tmdbService.transformMovie(movie));
    return {
      items,
      total: response.total_results,
      page: response.page,
      limit: response.results.length,
      totalPages: response.total_pages,
    };
  }

  @Get('tmdb/discover/tv')
  @ApiOperation({ summary: 'Discover TV shows on TMDB with filters' })
  @ApiQuery({ name: 'language', enum: ['en', 'fa'], required: false })
  @ApiQuery({ name: 'genre', type: String, required: false })
  @ApiQuery({ name: 'year', type: Number, required: false })
  @ApiQuery({ name: 'certification', type: String, required: false })
  @ApiQuery({ name: 'country', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Discovered TV shows from TMDB' })
  async discoverTVShows(
    @Query('language') language: 'en' | 'fa' = 'en',
    @Query('genre') genre?: string,
    @Query('year') year?: number,
    @Query('certification') certification?: string,
    @Query('country') country?: string,
    @Query('page') page?: number,
  ) {
    const response = await this.tmdbService.discoverTVShows(language, {
      genre,
      year: year ? parseInt(year.toString()) : undefined,
      certification,
      country,
      page: page ? parseInt(page.toString()) : 1,
    });
    const items = response.results.map((show) => this.tmdbService.transformTVShow(show));
    return {
      items,
      total: response.total_results,
      page: response.page,
      limit: response.results.length,
      totalPages: response.total_pages,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID' })
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
}
