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
import { UperaService } from './upera.service';
import {
  SearchUperaContentDto,
  GetAffiliateLinkDto,
  BuyContentDto,
  PaymentCallbackDto,
  GetLinkDto,
  HomeScreeningBuyDto,
  WatchMovieHlsDto,
  EkranTokenDto,
  ImportToLocalDto,
  DiscoverQueryDto,
  SliderQueryDto,
  OfferQueryDto,
  GenresQueryDto,
} from './dto/upera.dto';
import { UperaContentType } from './entities/upera-content.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('admin/upera')
@Controller('admin/upera')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER, UserRole.VIEWER)
export class UperaController {
  constructor(private readonly uperaService: UperaService) {}

  // ==========================================
  // BROWSE UPERA CONTENT (GATEWAY CALLS)
  // ==========================================

  @Get('browse/movies')
  @ApiOperation({ summary: 'Search/browse movies from Upera (Seeko)' })
  @ApiResponse({ status: 200, description: 'Movies fetched from Upera' })
  async browseMovies(@Query() dto: SearchUperaContentDto) {
    return this.uperaService.searchMovies(dto);
  }

  @Get('browse/series')
  @ApiOperation({ summary: 'Search/browse series from Upera (Seeko)' })
  @ApiResponse({ status: 200, description: 'Series fetched from Upera' })
  async browseSeries(@Query() dto: SearchUperaContentDto) {
    return this.uperaService.searchSeries(dto);
  }

  @Get('browse/series/:id/episodes')
  @ApiOperation({ summary: 'Get episodes of a series from Upera' })
  @ApiResponse({ status: 200, description: 'Series episodes fetched' })
  async getSeriesEpisodes(@Param('id') id: string) {
    return this.uperaService.getSeriesEpisodes(id);
  }

  @Get('browse/affiliate-links')
  @ApiOperation({ summary: 'Get affiliate links for content from Upera' })
  @ApiResponse({ status: 200, description: 'Affiliate links fetched' })
  async getAffiliateLinks(@Query() dto: GetAffiliateLinkDto) {
    return this.uperaService.getAffiliateLinks(dto);
  }

  // ==========================================
  // PURCHASE / PAYMENT
  // ==========================================

  @Post('buy/payment-url')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get payment URL for buying content from Upera' })
  @ApiResponse({ status: 200, description: 'Payment URL received' })
  async getPaymentUrl(@Body() dto: BuyContentDto) {
    return this.uperaService.getPaymentUrl(dto);
  }

  @Post('buy/callback')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Upera payment callback' })
  @ApiResponse({ status: 200, description: 'Payment callback processed' })
  async paymentCallback(@Body() dto: PaymentCallbackDto) {
    return this.uperaService.handlePaymentCallback(dto);
  }

  @Post('buy/get-link')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get download/streaming link after purchase' })
  @ApiResponse({ status: 200, description: 'Link received' })
  async getLink(@Body() dto: GetLinkDto) {
    return this.uperaService.getDownloadLink(dto);
  }

  // ==========================================
  // HOME SCREENING
  // ==========================================

  @Post('screening/buy')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buy home screening from Upera' })
  @ApiResponse({ status: 200, description: 'Screening purchase initiated' })
  async homeScreeningBuy(@Body() dto: HomeScreeningBuyDto) {
    return this.uperaService.homeScreeningBuy(dto);
  }

  @Get('screening/watch/:id')
  @ApiOperation({ summary: 'Get HLS streaming link for home screening' })
  @ApiResponse({ status: 200, description: 'Streaming link received (8-hour screening starts)' })
  @ApiQuery({ name: 'mobile', required: true, type: Number })
  @ApiQuery({ name: 'token', required: false, type: String })
  @ApiQuery({ name: 'ip', required: false, type: String })
  async watchMovieHls(
    @Param('id') id: string,
    @Query('mobile') mobile: number,
    @Query('token') token?: string,
    @Query('ip') ip?: string,
  ) {
    return this.uperaService.watchMovieHls({ id, mobile, token, ip });
  }

  @Get('screening/ekran/:id')
  @ApiOperation({ summary: 'Get screening info (remaining time, etc.)' })
  @ApiResponse({ status: 200, description: 'Screening info received' })
  @ApiQuery({ name: 'mobile', required: true, type: String })
  @ApiQuery({ name: 'token', required: false, type: String })
  async getEkranToken(
    @Param('id') id: string,
    @Query('mobile') mobile: string,
    @Query('token') token?: string,
  ) {
    return this.uperaService.getEkranToken({ id, mobile, token });
  }

  // ==========================================
  // LOCAL STORAGE & IMPORT
  // ==========================================

  @Post('local/save-movies')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save fetched Upera movies to local storage' })
  @ApiResponse({ status: 201, description: 'Movies saved locally' })
  async saveMoviesToLocal(@Body() body: { items: any[] }) {
    return this.uperaService.saveBulkToLocal(body.items, UperaContentType.MOVIE);
  }

  @Post('local/save-series')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save fetched Upera series to local storage' })
  @ApiResponse({ status: 201, description: 'Series saved locally' })
  async saveSeriesToLocal(@Body() body: { items: any[] }) {
    return this.uperaService.saveBulkToLocal(body.items, UperaContentType.SERIES);
  }

  @Get('local')
  @ApiOperation({ summary: 'List locally saved Upera content' })
  @ApiResponse({ status: 200, description: 'Local Upera content listed' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: ['movie', 'series'] })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'imported', 'failed'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getLocalContent(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.uperaService.getLocalContent({ page, limit, type, status, search });
  }

  @Get('local/:id')
  @ApiOperation({ summary: 'Get locally saved Upera content by ID' })
  @ApiResponse({ status: 200, description: 'Content found' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async getLocalContentById(@Param('id') id: string) {
    return this.uperaService.getLocalContentById(id);
  }

  @Post('local/import')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Import Upera content into the local database as Content' })
  @ApiResponse({ status: 201, description: 'Content imported to database' })
  @ApiResponse({ status: 404, description: 'Upera content not found' })
  async importToDatabase(@Body() dto: ImportToLocalDto) {
    return this.uperaService.importToDatabase(dto.uperaContentId);
  }

  @Delete('local/:id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete locally saved Upera content' })
  @ApiResponse({ status: 204, description: 'Content deleted' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async deleteLocalContent(@Param('id') id: string) {
    return this.uperaService.deleteLocalContent(id);
  }

  // ==========================================
  // UPERA SITE CONTENT (api.upera.tv)
  // ==========================================

  @Get('site/discover')
  @ApiOperation({ summary: 'Get discover/home page content from Upera site' })
  @ApiResponse({ status: 200, description: 'Discover content retrieved' })
  async getDiscover(@Query() dto: DiscoverQueryDto) {
    return this.uperaService.getDiscover(dto);
  }

  @Get('site/sliders')
  @ApiOperation({ summary: 'Get slider data from Upera site' })
  @ApiResponse({ status: 200, description: 'Slider data retrieved' })
  async getSliders(@Query() dto: SliderQueryDto) {
    return this.uperaService.getSliders(dto);
  }

  @Get('site/offers')
  @ApiOperation({ summary: 'Get promotional offers from Upera site' })
  @ApiResponse({ status: 200, description: 'Offers retrieved' })
  async getOffers(@Query() dto: OfferQueryDto) {
    return this.uperaService.getOffers(dto);
  }

  @Get('site/genres')
  @ApiOperation({ summary: 'Get genres list from Upera site' })
  @ApiResponse({ status: 200, description: 'Genres list retrieved' })
  async getGenres(@Query() dto: GenresQueryDto) {
    return this.uperaService.getGenres(dto);
  }

  @Get('site/plans')
  @ApiOperation({ summary: 'Get subscription plans from Upera site' })
  @ApiResponse({ status: 200, description: 'Plans retrieved' })
  async getPlans() {
    return this.uperaService.getPlans();
  }
}
