import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicService } from './public.service';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  // ========================================================================
  // CATEGORIES
  // ========================================================================

  @Get('categories')
  @ApiOperation({ summary: 'List all active categories (public)' })
  @ApiResponse({ status: 200, description: 'Active categories list' })
  async listCategories() {
    return this.publicService.listActiveCategories();
  }

  @Get('categories/menu')
  @ApiOperation({ summary: 'List categories shown in menu (public)' })
  @ApiResponse({ status: 200, description: 'Menu categories list' })
  async listMenuCategories() {
    return this.publicService.listMenuCategories();
  }

  @Get('categories/landing')
  @ApiOperation({ summary: 'List categories shown on landing page (public)' })
  @ApiResponse({ status: 200, description: 'Landing categories list' })
  async listLandingCategories() {
    return this.publicService.listLandingCategories();
  }

  @Get('categories/path/:parent/:child')
  @ApiOperation({ summary: 'Get child category by URL path (public)' })
  @ApiParam({ name: 'parent', type: String })
  @ApiParam({ name: 'child', type: String })
  @ApiResponse({ status: 200, description: 'Child category details by path' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryByChildPath(
    @Param('parent') parent: string,
    @Param('child') child: string,
  ) {
    return this.publicService.getCategoryByUrlPath(parent, child);
  }

  @Get('categories/path/:parent')
  @ApiOperation({ summary: 'Get category by URL path (public)' })
  @ApiParam({ name: 'parent', type: String })
  @ApiResponse({ status: 200, description: 'Category details by path' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryByPath(@Param('parent') parent: string) {
    return this.publicService.getCategoryByUrlPath(parent);
  }

  @Get('categories/:slug')
  @ApiOperation({ summary: 'Get category by slug (public)' })
  @ApiParam({ name: 'slug', type: String })
  @ApiResponse({ status: 200, description: 'Category details' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategory(@Param('slug') slug: string) {
    return this.publicService.getCategoryBySlug(slug);
  }

  // ========================================================================
  // GENRES
  // ========================================================================

  @Get('genres')
  @ApiOperation({ summary: 'List all active genres (public)' })
  @ApiQuery({ name: 'categorySlug', required: false })
  @ApiResponse({ status: 200, description: 'Active genres list' })
  async listGenres(@Query('categorySlug') categorySlug?: string) {
    return this.publicService.listActiveGenres(categorySlug);
  }

  @Get('genres/:slug')
  @ApiOperation({ summary: 'Get genre by slug (public)' })
  @ApiParam({ name: 'slug', type: String })
  @ApiResponse({ status: 200, description: 'Genre details' })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  async getGenre(@Param('slug') slug: string) {
    return this.publicService.getGenreBySlug(slug);
  }

  // ========================================================================
  // SLIDERS
  // ========================================================================

  @Get('sliders')
  @ApiOperation({ summary: 'List active sliders (public)' })
  @ApiQuery({ name: 'section', required: false })
  @ApiResponse({ status: 200, description: 'Active sliders list' })
  async listSliders(@Query('section') section?: string) {
    return this.publicService.listActiveSliders(section);
  }

  // ========================================================================
  // OFFERS
  // ========================================================================

  @Get('offers')
  @ApiOperation({ summary: 'List active offers (public)' })
  @ApiResponse({ status: 200, description: 'Active offers list' })
  async listOffers() {
    return this.publicService.listActiveOffers();
  }

  // ========================================================================
  // PINS
  // ========================================================================

  @Get('pins')
  @ApiOperation({ summary: 'List active pins (public)' })
  @ApiQuery({ name: 'section', required: false })
  @ApiResponse({ status: 200, description: 'Active pins list' })
  async listPins(@Query('section') section?: string) {
    return this.publicService.listActivePins(section);
  }

  // ========================================================================
  // COLLECTIONS
  // ========================================================================

  @Get('collections')
  @ApiOperation({ summary: 'List active collections (public)' })
  @ApiResponse({ status: 200, description: 'Active collections list' })
  async listCollections() {
    return this.publicService.listActiveCollections();
  }

  @Get('collections/:slug')
  @ApiOperation({ summary: 'Get collection by slug with contents (public)' })
  @ApiParam({ name: 'slug', type: String })
  @ApiResponse({ status: 200, description: 'Collection details with contents' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async getCollection(@Param('slug') slug: string) {
    return this.publicService.getCollectionBySlug(slug);
  }

  // ========================================================================
  // PLAY TABLES
  // ========================================================================

  @Get('play-tables')
  @ApiOperation({ summary: 'List active play tables (public)' })
  @ApiResponse({ status: 200, description: 'Active play tables list with content' })
  async listPlayTables() {
    return this.publicService.listActivePlayTables();
  }
}
