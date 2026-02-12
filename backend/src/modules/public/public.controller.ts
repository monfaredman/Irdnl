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
}
