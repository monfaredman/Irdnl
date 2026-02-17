import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { UperaContent, UperaContentType, UperaImportStatus } from './entities/upera-content.entity';
import { Content, ContentType, ContentStatus } from '../content/entities/content.entity';
import {
  SearchUperaContentDto,
  GetAffiliateLinkDto,
  BuyContentDto,
  PaymentCallbackDto,
  GetLinkDto,
  HomeScreeningBuyDto,
  WatchMovieHlsDto,
  EkranTokenDto,
  DiscoverQueryDto,
  SliderQueryDto,
  OfferQueryDto,
  GenresQueryDto,
  ImportDiscoverItemDto,
  ImportDiscoverBulkDto,
} from './dto/upera.dto';

@Injectable()
export class UperaService {
  private readonly logger = new Logger(UperaService.name);
  private seekoBaseUrl: string = 'https://seeko.film/api/v1/ghost';
  private homeScreenBaseUrl: string = 'https://homescreen.ovpa.ir/api/v1/ghost';
  private uperaApiBaseUrl: string = 'https://api.upera.tv/api/v1';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(UperaContent)
    private readonly uperaContentRepository: Repository<UperaContent>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {
    const customBase = this.configService.get<string>('UPERA_SEEKO_BASE_URL');
    if (customBase) {
      this.seekoBaseUrl = customBase;
    }
    const customHomeScreen = this.configService.get<string>('UPERA_HOMESCREEN_BASE_URL');
    if (customHomeScreen) {
      this.homeScreenBaseUrl = customHomeScreen;
    }
    const customUperaApi = this.configService.get<string>('UPERA_API_BASE_URL');
    if (customUperaApi) {
      this.uperaApiBaseUrl = customUperaApi;
    }
  }

  // ==========================================
  // FREE MOVIES & SERIES
  // ==========================================

  async searchMovies(dto: SearchUperaContentDto): Promise<any> {
    try {
      const token = this.configService.get<string>('UPERA_TOKEN', '');
      const params = new URLSearchParams({
        trending: String(dto.trending ?? 1),
        genre: dto.genre ?? 'all',
        free: String(dto.free ?? 1),
        country: String(dto.country ?? 0),
        persian: String(dto.persian ?? 0),
        affiliate: '1',
        ...(token ? { token } : {}),
      });

      if (dto.query) params.append('query', dto.query);
      if (dto.page) params.append('page', String(dto.page));

      const url = `${this.seekoBaseUrl}/get/movie/sort?${params.toString()}`;
      this.logger.log(`Fetching Upera movies: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch Upera movies: ${error.message}`);
      throw new BadRequestException(`Failed to fetch movies from Upera: ${error.message}`);
    }
  }

  async searchSeries(dto: SearchUperaContentDto): Promise<any> {
    try {
      const token = this.configService.get<string>('UPERA_TOKEN', '');
      const params = new URLSearchParams({
        trending: String(dto.trending ?? 1),
        genre: dto.genre ?? 'all',
        free: String(dto.free ?? 1),
        country: String(dto.country ?? 0),
        persian: String(dto.persian ?? 0),
        affiliate: '1',
        ...(token ? { token } : {}),
      });

      if (dto.query) params.append('query', dto.query);
      if (dto.page) params.append('page', String(dto.page));

      const url = `${this.seekoBaseUrl}/get/series/sort?${params.toString()}`;
      this.logger.log(`Fetching Upera series: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch Upera series: ${error.message}`);
      throw new BadRequestException(`Failed to fetch series from Upera: ${error.message}`);
    }
  }

  async getSeriesEpisodes(seriesId: string): Promise<any> {
    try {
      const url = `${this.seekoBaseUrl}/get/series/${seriesId}?affiliate=1`;
      this.logger.log(`Fetching series episodes: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch series episodes: ${error.message}`);
      throw new BadRequestException(`Failed to fetch series episodes from Upera: ${error.message}`);
    }
  }

  // ==========================================
  // AFFILIATE LINKS
  // ==========================================

  async getAffiliateLinks(dto: GetAffiliateLinkDto): Promise<any> {
    try {
      const token = dto.token || this.configService.get<string>('UPERA_TOKEN', '');
      const params = new URLSearchParams({
        id: dto.id,
        type: dto.type,
        ref: String(dto.ref ?? 2),
        traffic: String(dto.traffic ?? 1),
        token,
      });

      const url = `${this.seekoBaseUrl}/get/getaffiliatelinks?${params.toString()}`;
      this.logger.log(`Fetching affiliate links: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch affiliate links: ${error.message}`);
      throw new BadRequestException(`Failed to fetch affiliate links from Upera: ${error.message}`);
    }
  }

  // ==========================================
  // BUY MOVIES & SERIES
  // ==========================================

  async getPaymentUrl(dto: BuyContentDto): Promise<any> {
    try {
      const token = dto.token || this.configService.get<string>('UPERA_TOKEN', '');
      const params = new URLSearchParams({
        'cart[][id]': String(dto.qualityId),
        'cart[][episode_id]': dto.episodeId || '',
        'cart[][movie_id]': dto.movieId || '',
        payment_method: dto.paymentMethod,
        mobile: dto.mobile,
        callback_url: dto.callbackUrl,
        refid: dto.refid || '',
        token,
        payment_id: dto.paymentId || '',
      });

      const url = `${this.seekoBaseUrl}/get/buy?${params.toString()}`;
      this.logger.log(`Getting payment URL: ${url}`);

      const response = await firstValueFrom(
        this.httpService.post(url),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get payment URL: ${error.message}`);
      throw new BadRequestException(`Failed to get payment URL from Upera: ${error.message}`);
    }
  }

  async handlePaymentCallback(dto: PaymentCallbackDto): Promise<any> {
    try {
      const token = dto.token || this.configService.get<string>('UPERA_TOKEN', '');
      const params = new URLSearchParams({
        payment_id: dto.paymentId,
        ref_num: dto.refNum,
        check_it_again: String(dto.checkItAgain ?? 0),
        token,
      });

      const url = `${this.seekoBaseUrl}/upera_callback?${params.toString()}`;
      this.logger.log(`Handling payment callback: ${url}`);

      const response = await firstValueFrom(
        this.httpService.post(url),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to handle payment callback: ${error.message}`);
      throw new BadRequestException(`Failed to process Upera payment callback: ${error.message}`);
    }
  }

  async getDownloadLink(dto: GetLinkDto): Promise<any> {
    try {
      const token = dto.token || this.configService.get<string>('UPERA_TOKEN', '');
      const params = new URLSearchParams({
        token,
        id: dto.id,
        type: dto.type,
        mobile: dto.mobile,
      });

      const url = `${this.seekoBaseUrl}/GetLink?${params.toString()}`;
      this.logger.log(`Getting download link: ${url}`);

      const response = await firstValueFrom(
        this.httpService.post(url),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get download link: ${error.message}`);
      throw new BadRequestException(`Failed to get download link from Upera: ${error.message}`);
    }
  }

  // ==========================================
  // HOME SCREENING
  // ==========================================

  async homeScreeningBuy(dto: HomeScreeningBuyDto): Promise<any> {
    try {
      const url = `${this.homeScreenBaseUrl}/get/buy`;
      this.logger.log(`Home screening buy: ${url}`);

      const body = {
        cart: dto.cart,
        payment_method: dto.paymentMethod,
        mobile: dto.mobile,
        token: dto.token || this.configService.get<string>('UPERA_TOKEN', ''),
        callback_url: dto.callbackUrl || null,
        ekran: dto.ekran,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed home screening buy: ${error.message}`);
      throw new BadRequestException(`Failed to process home screening purchase: ${error.message}`);
    }
  }

  async watchMovieHls(dto: WatchMovieHlsDto): Promise<any> {
    try {
      const token = dto.token || this.configService.get<string>('UPERA_TOKEN', '');
      const url = `${this.homeScreenBaseUrl}/get/watch/movie-hls/${dto.id}/1?mobile=${dto.mobile}&token=${token}&ip=${dto.ip || ''}`;
      this.logger.log(`Watch movie HLS: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get streaming link: ${error.message}`);
      throw new BadRequestException(`Failed to get streaming link from Upera: ${error.message}`);
    }
  }

  async getEkranToken(dto: EkranTokenDto): Promise<any> {
    try {
      const token = dto.token || this.configService.get<string>('UPERA_TOKEN', '');
      const url = `${this.homeScreenBaseUrl}/get/ekran_token/${dto.id}?mobile=${dto.mobile}&token=${token}`;
      this.logger.log(`Get ekran token: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get ekran token: ${error.message}`);
      throw new BadRequestException(`Failed to get screening info from Upera: ${error.message}`);
    }
  }

  // ==========================================
  // LOCAL STORAGE & IMPORT
  // ==========================================

  async saveToLocal(rawData: any, type: UperaContentType): Promise<UperaContent> {
    const existing = await this.uperaContentRepository.findOne({
      where: { uperaId: rawData.id || rawData.uuid },
    });

    if (existing) {
      existing.rawData = rawData;
      existing.titleFa = rawData.title_fa || rawData.fa_title || existing.titleFa;
      existing.titleEn = rawData.title_en || rawData.en_title || existing.titleEn;
      existing.posterUrl = rawData.poster || rawData.pic || existing.posterUrl;
      existing.imdbRating = rawData.imdb_rate ? parseFloat(rawData.imdb_rate) : existing.imdbRating;
      existing.year = rawData.year ? parseInt(rawData.year, 10) : existing.year;
      existing.isFree = rawData.is_free === 1 || rawData.is_free === true;
      return this.uperaContentRepository.save(existing);
    }

    const uperaContent = this.uperaContentRepository.create({
      uperaId: rawData.id || rawData.uuid,
      titleFa: rawData.title_fa || rawData.fa_title || null,
      titleEn: rawData.title_en || rawData.en_title || null,
      type,
      year: rawData.year ? parseInt(rawData.year, 10) : null,
      description: rawData.description || rawData.story || null,
      posterUrl: rawData.poster || rawData.pic || null,
      bannerUrl: rawData.banner || null,
      imdbRating: rawData.imdb_rate ? parseFloat(rawData.imdb_rate) : null,
      genres: rawData.genre ? (Array.isArray(rawData.genre) ? rawData.genre : [rawData.genre]) : [],
      isFree: rawData.is_free === 1 || rawData.is_free === true,
      isDubbed: rawData.is_dubbed === 1 || rawData.is_dubbed === true,
      country: rawData.country || null,
      qualities: rawData.qualities || null,
      rawData,
      importStatus: UperaImportStatus.PENDING,
    });

    return this.uperaContentRepository.save(uperaContent);
  }

  async saveBulkToLocal(items: any[], type: UperaContentType): Promise<UperaContent[]> {
    const results: UperaContent[] = [];
    for (const item of items) {
      try {
        const saved = await this.saveToLocal(item, type);
        results.push(saved);
      } catch (error) {
        this.logger.error(`Failed to save item ${item.id || item.uuid}: ${error.message}`);
      }
    }
    return results;
  }

  async importToDatabase(uperaContentId: string): Promise<Content> {
    const uperaContent = await this.uperaContentRepository.findOne({
      where: { id: uperaContentId },
    });

    if (!uperaContent) {
      throw new NotFoundException(`Upera content with ID ${uperaContentId} not found`);
    }

    try {
      // Create content in our local database
      const content = this.contentRepository.create({
        title: uperaContent.titleFa || uperaContent.titleEn || 'Untitled',
        originalTitle: uperaContent.titleEn,
        type: uperaContent.type === UperaContentType.MOVIE ? ContentType.MOVIE : ContentType.SERIES,
        year: uperaContent.year,
        description: uperaContent.description,
        posterUrl: uperaContent.posterUrl,
        bannerUrl: uperaContent.bannerUrl,
        rating: uperaContent.imdbRating,
        genres: uperaContent.genres,
        country: uperaContent.country,
        status: ContentStatus.DRAFT,
        monetization: {
          isFree: uperaContent.isFree,
        },
        isDubbed: uperaContent.isDubbed,
        localizedContent: {
          fa: {
            title: uperaContent.titleFa || undefined,
            description: uperaContent.description || undefined,
          },
        },
        licenseInfo: {
          source: 'upera',
          uperaId: uperaContent.uperaId,
          importedAt: new Date().toISOString(),
        },
      });

      const savedContent = await this.contentRepository.save(content);

      // Update upera content status
      uperaContent.importStatus = UperaImportStatus.IMPORTED;
      uperaContent.importedContentId = savedContent.id;
      await this.uperaContentRepository.save(uperaContent);

      return savedContent;
    } catch (error) {
      uperaContent.importStatus = UperaImportStatus.FAILED;
      await this.uperaContentRepository.save(uperaContent);
      this.logger.error(`Failed to import content: ${error.message}`);
      throw new BadRequestException(`Failed to import content to database: ${error.message}`);
    }
  }

  async getLocalContent(params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
  }): Promise<{ data: UperaContent[]; total: number; page: number; limit: number }> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.uperaContentRepository.createQueryBuilder('upera');

    if (params.type) {
      queryBuilder.andWhere('upera.type = :type', { type: params.type });
    }

    if (params.status) {
      queryBuilder.andWhere('upera.importStatus = :status', { status: params.status });
    }

    if (params.search) {
      queryBuilder.andWhere(
        '(upera.titleFa ILIKE :search OR upera.titleEn ILIKE :search)',
        { search: `%${params.search}%` },
      );
    }

    queryBuilder.orderBy('upera.createdAt', 'DESC');
    queryBuilder.skip(skip);
    queryBuilder.take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async getLocalContentById(id: string): Promise<UperaContent> {
    const content = await this.uperaContentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Upera content with ID ${id} not found`);
    }
    return content;
  }

  async deleteLocalContent(id: string): Promise<void> {
    const content = await this.uperaContentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Upera content with ID ${id} not found`);
    }
    await this.uperaContentRepository.remove(content);
  }

  // ==========================================
  // DISCOVER DIRECT IMPORT
  // ==========================================

  /**
   * Import a single discover item directly into the Content table.
   * Also saves to UperaContent for tracking (importStatus = imported).
   */
  async importDiscoverItem(dto: ImportDiscoverItemDto): Promise<Content> {
    const rawItem = dto.rawItem;
    if (!rawItem) {
      throw new BadRequestException('rawItem is required');
    }

    const uperaId = String(rawItem.id || rawItem.movie_id || rawItem.uuid || '');
    if (!uperaId) {
      throw new BadRequestException('Item has no valid id');
    }

    // Check if already imported (by uperaId in licenseInfo)
    const existingContent = await this.contentRepository
      .createQueryBuilder('content')
      .where("content.license_info::text LIKE :pattern", { pattern: `%"uperaId":"${uperaId}"%` })
      .getOne();

    if (existingContent) {
      throw new BadRequestException(`This content has already been imported (Content ID: ${existingContent.id})`);
    }

    // Determine type
    const rawType = dto.type || rawItem.type || 'movie';
    const contentType = rawType === 'series' ? ContentType.SERIES : ContentType.MOVIE;
    const uperaContentType = rawType === 'series' ? UperaContentType.SERIES : UperaContentType.MOVIE;

    // Extract fields from discover item
    const titleFa = rawItem.title_fa || rawItem.fa_title || rawItem.title || null;
    const titleEn = rawItem.title_en || rawItem.en_title || null;
    const year = rawItem.year ? parseInt(String(rawItem.year), 10) : null;
    const imdbRating = rawItem.imdb_rate ? parseFloat(String(rawItem.imdb_rate)) : null;
    const description = rawItem.description || rawItem.story || null;
    const posterUrl = rawItem.cdn?.poster || rawItem.poster || rawItem.pic || null;
    const bannerUrl = rawItem.cdn?.backdrop || rawItem.backdrop || rawItem.cover || rawItem.banner || null;
    const isDubbed = rawItem.dubbed === 1 || rawItem.is_dubbed === 1 || rawItem.dubbed === true;
    const isFree = rawItem.is_free === 1 || rawItem.is_free === true || rawItem.free === 1;
    const country = rawItem.country || null;

    // Parse genres
    let genres: string[] = [];
    if (rawItem.genre) {
      if (typeof rawItem.genre === 'string') {
        genres = rawItem.genre.split(',').map((g: string) => g.trim()).filter(Boolean);
      } else if (typeof rawItem.genre === 'object') {
        genres = Object.keys(rawItem.genre);
      } else if (Array.isArray(rawItem.genre)) {
        genres = rawItem.genre;
      }
    }

    try {
      // 1. Save to UperaContent for tracking
      let uperaContent = await this.uperaContentRepository.findOne({
        where: { uperaId },
      });

      if (!uperaContent) {
        uperaContent = this.uperaContentRepository.create({
          uperaId,
          titleFa,
          titleEn,
          type: uperaContentType,
          year,
          description,
          posterUrl,
          bannerUrl,
          imdbRating,
          genres,
          isFree,
          isDubbed,
          country,
          rawData: rawItem,
          importStatus: UperaImportStatus.PENDING,
        });
        uperaContent = await this.uperaContentRepository.save(uperaContent);
      }

      // 2. Create Content entity
      const content = this.contentRepository.create({
        title: titleFa || titleEn || 'Untitled',
        originalTitle: titleEn,
        type: contentType,
        year,
        description,
        posterUrl,
        bannerUrl,
        rating: imdbRating,
        genres,
        country,
        status: ContentStatus.DRAFT,
        monetization: { isFree },
        isDubbed,
        localizedContent: {
          fa: {
            title: titleFa || undefined,
            description: description || undefined,
          },
        },
        licenseInfo: {
          source: 'upera',
          uperaId,
          importedAt: new Date().toISOString(),
        },
      });

      const savedContent = await this.contentRepository.save(content);

      // 3. Update UperaContent tracking
      uperaContent.importStatus = UperaImportStatus.IMPORTED;
      uperaContent.importedContentId = savedContent.id;
      await this.uperaContentRepository.save(uperaContent);

      this.logger.log(`Imported discover item "${titleFa || titleEn}" (uperaId=${uperaId}) → Content ID: ${savedContent.id}`);
      return savedContent;
    } catch (error) {
      this.logger.error(`Failed to import discover item (uperaId=${uperaId}): ${error.message}`);
      throw new BadRequestException(`Failed to import discover item: ${error.message}`);
    }
  }

  /**
   * Import multiple discover items at once.
   * Returns success/failure results for each item.
   */
  async importDiscoverBulk(dto: ImportDiscoverBulkDto): Promise<{
    imported: Array<{ uperaId: string; contentId: string; title: string }>;
    failed: Array<{ uperaId: string; title: string; error: string }>;
    total: number;
    successCount: number;
    failCount: number;
  }> {
    const items = dto.items || [];
    if (!items.length) {
      throw new BadRequestException('No items provided for import');
    }

    const imported: Array<{ uperaId: string; contentId: string; title: string }> = [];
    const failed: Array<{ uperaId: string; title: string; error: string }> = [];

    for (const rawItem of items) {
      const uperaId = String(rawItem.id || rawItem.movie_id || rawItem.uuid || '');
      const title = rawItem.title_fa || rawItem.fa_title || rawItem.title_en || rawItem.en_title || '';

      try {
        const content = await this.importDiscoverItem({
          rawItem,
          type: dto.type || rawItem.type,
        });
        imported.push({ uperaId, contentId: content.id, title });
      } catch (error) {
        failed.push({ uperaId, title, error: error.message });
      }
    }

    return {
      imported,
      failed,
      total: items.length,
      successCount: imported.length,
      failCount: failed.length,
    };
  }

  /**
   * Check which discover items are already imported by their uperaIds.
   */
  async checkImportedItems(uperaIds: string[]): Promise<Record<string, string>> {
    if (!uperaIds.length) return {};

    const result: Record<string, string> = {};

    // Check in upera_content table
    const imported = await this.uperaContentRepository
      .createQueryBuilder('uc')
      .where('uc.uperaId IN (:...ids)', { ids: uperaIds })
      .andWhere('uc.importStatus = :status', { status: UperaImportStatus.IMPORTED })
      .select(['uc.uperaId', 'uc.importedContentId'])
      .getMany();

    for (const item of imported) {
      result[item.uperaId] = item.importedContentId;
    }

    return result;
  }

  // ==========================================
  // UPERA SITE CONTENT (api.upera.tv)
  // ==========================================

  /**
   * Transform image URLs by prepending CDN base URLs to image filenames
   */
  private transformImageUrls(data: any[], cdn: any): void {
    if (!data || !cdn) return;

    data.forEach((section) => {
      if (section.data && Array.isArray(section.data)) {
        section.data.forEach((item) => {
          // Transform poster
          if (item.poster && !item.poster.startsWith('http')) {
            item.poster = `${cdn.poster}${item.poster}`;
          }
          // Transform backdrop
          if (item.backdrop && !item.backdrop.startsWith('http')) {
            item.backdrop = `${cdn.backdrop}${item.backdrop}`;
          }
          // Transform back_teaser if exists
          if (item.back_teaser && !item.back_teaser.startsWith('http')) {
            item.back_teaser = `${cdn.backdrop}${item.back_teaser}`;
          }
        });
      }
    });
  }

  async getDiscover(dto: DiscoverQueryDto): Promise<any> {
    try {
      const params: Record<string, string> = {};
      if (dto.age) params.age = dto.age;
      if (dto.country) params.country = dto.country;
      if (dto.discover_page !== undefined) params.discover_page = String(dto.discover_page);
      if (dto.f_type) params.f_type = dto.f_type;
      if (dto.kids !== undefined) params.kids = String(dto.kids);
      if (dto.lang) params.lang = dto.lang;
      if (dto.sortby) params.sortby = dto.sortby;

      const response = await firstValueFrom(
        this.httpService.get(`${this.uperaApiBaseUrl}/getV2/discover`, { params }),
      );
      
      // Transform image URLs using CDN
      const data = response.data;
      if (data?.data?.cdn && data?.data?.data) {
        this.transformImageUrls(data.data.data, data.data.cdn);
      }
      
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch discover content', error?.message);
      throw new BadRequestException('Failed to fetch discover content from Upera');
    }
  }

  async getSliders(dto: SliderQueryDto): Promise<any> {
    try {
      const params: Record<string, string> = {};
      if (dto.age) params.age = dto.age;
      if (dto.media_type) params.media_type = dto.media_type;
      if (dto.location) params.location = dto.location;
      if (dto.ref) params.ref = dto.ref;

      const response = await firstValueFrom(
        this.httpService.get(`${this.uperaApiBaseUrl}/get/slider`, { params }),
      );
      
      // Transform image URLs using CDN
      const data = response.data;
      if (data?.data?.cdn && data?.data?.data) {
        // Sliders have a different structure - direct array
        if (Array.isArray(data.data.data)) {
          data.data.data.forEach((item) => {
            if (item.poster && !item.poster.startsWith('http')) {
              item.poster = `${data.data.cdn.poster}${item.poster}`;
            }
            if (item.backdrop && !item.backdrop.startsWith('http')) {
              item.backdrop = `${data.data.cdn.backdrop}${item.backdrop}`;
            }
            if (item.back_teaser && !item.back_teaser.startsWith('http')) {
              item.back_teaser = `${data.data.cdn.backdrop}${item.back_teaser}`;
            }
          });
        }
      }
      
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch sliders', error?.message);
      throw new BadRequestException('Failed to fetch sliders from Upera');
    }
  }

  async getOffers(dto: OfferQueryDto): Promise<any> {
    try {
      const params: Record<string, string> = {};
      if (dto.age) params.age = dto.age;
      if (dto.media_type) params.media_type = dto.media_type;

      const response = await firstValueFrom(
        this.httpService.get(`${this.uperaApiBaseUrl}/get/offer`, { params }),
      );
      
      // Transform image URLs using CDN
      const data = response.data;
      if (data?.data?.cdn && data?.data?.data) {
        // Offers have a different structure - direct array
        if (Array.isArray(data.data.data)) {
          data.data.data.forEach((item) => {
            if (item.poster && !item.poster.startsWith('http')) {
              item.poster = `${data.data.cdn.poster}${item.poster}`;
            }
            if (item.backdrop && !item.backdrop.startsWith('http')) {
              item.backdrop = `${data.data.cdn.backdrop}${item.backdrop}`;
            }
            if (item.back_teaser && !item.back_teaser.startsWith('http')) {
              item.back_teaser = `${data.data.cdn.backdrop}${item.back_teaser}`;
            }
          });
        }
      }
      
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch offers', error?.message);
      throw new BadRequestException('Failed to fetch offers from Upera');
    }
  }

  async getGenres(dto: GenresQueryDto): Promise<any> {
    try {
      const params: Record<string, string> = {};
      if (dto.age) params.age = dto.age;

      const response = await firstValueFrom(
        this.httpService.get(`${this.uperaApiBaseUrl}/new_genres`, { params }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch genres', error?.message);
      throw new BadRequestException('Failed to fetch genres from Upera');
    }
  }

  async getPlans(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.uperaApiBaseUrl}/get/app/plans`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch plans', error?.message);
      throw new BadRequestException('Failed to fetch plans from Upera');
    }
  }
}
