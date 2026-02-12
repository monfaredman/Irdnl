import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TMDBService } from '../content/tmdb.service';
import { Content, ContentType, ContentStatus } from '../content/entities/content.entity';
import {
  TMDBSavedContent,
  TMDBMediaType,
  TMDBImportStatus,
} from './entities/tmdb-saved-content.entity';
import {
  TMDBSearchDto,
  TMDBDiscoverDto,
  TMDBPopularDto,
  TMDBTrendingDto,
  TMDBDetailsDto,
  TMDBSeasonDetailsDto,
  SaveTMDBContentDto,
} from './dto/tmdb.dto';

@Injectable()
export class TMDBAdminService {
  private readonly logger = new Logger(TMDBAdminService.name);

  constructor(
    private readonly tmdbService: TMDBService,
    @InjectRepository(TMDBSavedContent)
    private readonly savedContentRepository: Repository<TMDBSavedContent>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  // ==========================================
  // TMDB API GATEWAY METHODS
  // ==========================================

  async search(dto: TMDBSearchDto): Promise<any> {
    const { query, language = 'fa', page = 1, includeAdult = false } = dto;
    
    const response = await this.tmdbService.searchMulti(query, {
      language,
      page,
      includeAdult,
    });

    return {
      results: response.results,
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  async discover(dto: TMDBDiscoverDto) {
    const {
      type = 'movie',
      language = 'fa',
      genre,
      withGenres,
      year,
      certification,
      country,
      page = 1,
    } = dto;

    const options = {
      genre,
      withGenres,
      year,
      certification,
      country,
      page,
    };

    let response: any;
    if (type === 'movie') {
      response = await this.tmdbService.discoverMovies(language, options);
    } else {
      response = await this.tmdbService.discoverTVShows(language, options);
    }

    return {
      results: response.results,
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  async getPopular(dto: TMDBPopularDto) {
    const { type = 'movie', language = 'fa', page = 1 } = dto;

    let response: any;
    if (type === 'movie') {
      response = await this.tmdbService.getPopularMovies(language, page);
    } else {
      response = await this.tmdbService.getPopularTVShows(language, page);
    }

    return {
      results: response.results,
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  }

  async getTrending(dto: TMDBTrendingDto): Promise<any> {
    const { language = 'en', mediaType = 'all', timeWindow = 'week', page = 1 } = dto;

    // Use the existing trending endpoint
    const response = await this.tmdbService.getTrendingMovies(language);

    return {
      results: response.results,
      page: response.page || 1,
      totalPages: response.total_pages || 1,
      totalResults: response.total_results || response.results.length,
    };
  }

  async getDetails(dto: TMDBDetailsDto) {
    const { id, type = 'movie', language = 'fa' } = dto;

    let data: any;
    if (type === 'movie') {
      data = await this.tmdbService.getMovieDetails(id, language);
    } else {
      data = await this.tmdbService.getTVDetails(id, language);
    }

    return data;
  }

  async getSeasonDetails(dto: TMDBSeasonDetailsDto) {
    const { tvId, seasonNumber, language = 'fa' } = dto;
    return this.tmdbService.getTVSeasonDetails(tvId, seasonNumber, language);
  }

  // ==========================================
  // LOCAL STORAGE METHODS
  // ==========================================

  async saveContent(dto: SaveTMDBContentDto): Promise<TMDBSavedContent> {
    const { tmdbId, mediaType, rawData } = dto;

    // Check if already saved
    const existing = await this.savedContentRepository.findOne({
      where: { tmdbId, mediaType: mediaType as TMDBMediaType },
    });

    if (existing) {
      this.logger.log(`TMDB content ${tmdbId} already saved`);
      return existing;
    }

    // Fetch details from TMDB
    let details: any;
    try {
      if (mediaType === 'movie') {
        details = await this.tmdbService.getMovieDetails(tmdbId, 'fa');
      } else {
        details = await this.tmdbService.getTVDetails(tmdbId, 'fa');
      }
    } catch (error) {
      this.logger.error(`Failed to fetch TMDB details for ${tmdbId}`, error);
      throw new BadRequestException('Failed to fetch content details from TMDB');
    }

    // Create saved content
    const saved = this.savedContentRepository.create({
      tmdbId,
      mediaType: mediaType as TMDBMediaType,
      title: details.title || details.name || '',
      originalTitle: details.original_title || details.original_name || '',
      description: details.overview || '',
      posterUrl: details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : null,
      backdropUrl: details.backdrop_path
        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
        : null,
      year: details.release_date
        ? new Date(details.release_date).getFullYear()
        : details.first_air_date
        ? new Date(details.first_air_date).getFullYear()
        : null,
      rating: details.vote_average || 0,
      originalLanguage: details.original_language || '',
      genreIds: details.genres?.map((g: any) => g.id) || [],
      originCountry: details.production_countries?.map((c: any) => c.iso_3166_1) || details.origin_country || [],
      rawData: rawData || details,
      importStatus: TMDBImportStatus.PENDING,
    });

    return this.savedContentRepository.save(saved);
  }

  async saveBulkContent(items: SaveTMDBContentDto[]): Promise<TMDBSavedContent[]> {
    const results: TMDBSavedContent[] = [];
    for (const item of items) {
      try {
        const saved = await this.saveContent(item);
        results.push(saved);
      } catch (error) {
        this.logger.error(`Failed to save ${item.tmdbId}:`, error);
      }
    }
    return results;
  }

  async getSavedContent(params: {
    page?: number;
    limit?: number;
    mediaType?: string;
    status?: string;
    search?: string;
  }) {
    const { page = 1, limit = 20, mediaType, status, search } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.savedContentRepository.createQueryBuilder('tmdb');

    if (mediaType && mediaType !== 'all') {
      queryBuilder.andWhere('tmdb.mediaType = :mediaType', { mediaType });
    }

    if (status && status !== 'all') {
      queryBuilder.andWhere('tmdb.importStatus = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(tmdb.title ILIKE :search OR tmdb.originalTitle ILIKE :search OR tmdb.tmdbId ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('tmdb.createdAt', 'DESC');
    queryBuilder.skip(skip);
    queryBuilder.take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async getSavedContentById(id: string): Promise<TMDBSavedContent> {
    const content = await this.savedContentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Saved TMDB content with ID ${id} not found`);
    }
    return content;
  }

  async deleteSavedContent(id: string): Promise<void> {
    const content = await this.savedContentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Saved TMDB content with ID ${id} not found`);
    }
    await this.savedContentRepository.remove(content);
  }

  async importToDatabase(savedContentId: string): Promise<Content> {
    const saved = await this.getSavedContentById(savedContentId);

    if (saved.importStatus === TMDBImportStatus.IMPORTED && saved.importedContentId) {
      // Check if still exists
      const existing = await this.contentRepository.findOne({
        where: { id: saved.importedContentId },
      });
      if (existing) {
        return existing;
      }
    }

    try {
      // Create content from saved TMDB data
      const content = new Content();
      content.type = saved.mediaType === TMDBMediaType.MOVIE ? ContentType.MOVIE : ContentType.SERIES;
      content.title = saved.title || saved.originalTitle || 'Untitled';
      content.originalTitle = saved.originalTitle || saved.title;
      content.description = saved.description || '';
      content.posterUrl = saved.posterUrl || '';
      content.bannerUrl = saved.backdropUrl || '';
      content.year = saved.year || new Date().getFullYear();
      content.rating = saved.rating || 0;
      content.status = ContentStatus.DRAFT;
      content.tmdbId = saved.tmdbId;
      content.genres = [];
      content.tags = [];
      content.languages = saved.originalLanguage ? [saved.originalLanguage] : [];
      content.originalLanguage = saved.originalLanguage || null;

      const savedContent = await this.contentRepository.save(content);

      // Update saved record
      saved.importStatus = TMDBImportStatus.IMPORTED;
      saved.importedContentId = savedContent.id;
      await this.savedContentRepository.save(saved);

      this.logger.log(`Imported TMDB content ${saved.tmdbId} to database as ${savedContent.id}`);
      return savedContent;
    } catch (error) {
      this.logger.error(`Failed to import TMDB content ${saved.tmdbId}`, error);
      saved.importStatus = TMDBImportStatus.FAILED;
      await this.savedContentRepository.save(saved);
      throw new BadRequestException('Failed to import content to database');
    }
  }
}
