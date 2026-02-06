import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Content, ContentStatus, ContentType } from './entities/content.entity';
import { Series } from './entities/series.entity';
import { Season } from './entities/season.entity';
import { Episode } from './entities/episode.entity';
import { VideoAsset, VideoAssetStatus } from '../video-assets/entities/video-asset.entity';
import { ContentQueryDto } from './dto/content-query.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    @InjectRepository(Series)
    private seriesRepository: Repository<Series>,
    @InjectRepository(Season)
    private seasonRepository: Repository<Season>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
    @InjectRepository(VideoAsset)
    private videoAssetRepository: Repository<VideoAsset>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: ContentQueryDto, isAdmin: boolean = false) {
    const { type, genre, q, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.contentRepository.createQueryBuilder('content');

    if (!isAdmin) {
      queryBuilder.where('content.status = :status', {
        status: ContentStatus.PUBLISHED,
      });
    }

    if (type) {
      queryBuilder.andWhere('content.type = :type', { type });
    }

    if (q) {
      queryBuilder.andWhere('(content.title ILIKE :q OR content.description ILIKE :q)', {
        q: `%${q}%`,
      });
    }

    // TODO: Add genre filtering when genres table is implemented
    // For now, we can filter by genre in license_info or seo

    const [items, total] = await queryBuilder
      .orderBy('content.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, isAdmin: boolean = false): Promise<Content> {
    const cacheKey = `content:${id}`;
    const cached = await this.cacheManager.get<Content>(cacheKey);
    if (cached) {
      return cached;
    }

    const content = await this.contentRepository.findOne({
      where: { id },
      relations: ['videoAssets'],
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    if (!isAdmin && content.status !== ContentStatus.PUBLISHED) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    // Load series data if it's a series
    if (content.type === ContentType.SERIES) {
      const series = await this.seriesRepository.findOne({
        where: { contentId: content.id },
        relations: ['seasons', 'seasons.episodes', 'seasons.episodes.videoAsset'],
      });
      (content as any).series = series;
    }

    // Cache for 60 seconds
    await this.cacheManager.set(cacheKey, content, 60);

    return content;
  }

  async getEpisodes(contentId: string): Promise<Episode[]> {
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
    });

    if (!content || content.type !== ContentType.SERIES) {
      throw new NotFoundException('Series not found');
    }

    const series = await this.seriesRepository.findOne({
      where: { contentId },
      relations: ['seasons', 'seasons.episodes', 'seasons.episodes.videoAsset'],
    });

    if (!series) {
      return [];
    }

    const episodes: Episode[] = [];
    for (const season of series.seasons) {
      episodes.push(...season.episodes);
    }

    return episodes.sort((a, b) => {
      if (a.season.number !== b.season.number) {
        return a.season.number - b.season.number;
      }
      return a.number - b.number;
    });
  }

  async getStreamInfo(
    contentId: string,
    isAdmin: boolean = false,
  ): Promise<Array<{ quality: string; hls_url: string; signed: boolean }>> {
    const content = await this.findOne(contentId, isAdmin);

    const videoAssets = await this.videoAssetRepository.find({
      where: {
        contentId: content.id,
        status: VideoAssetStatus.READY,
      },
      order: {
        quality: 'DESC',
      },
    });

    return videoAssets.map((asset) => ({
      quality: asset.quality,
      hls_url: asset.hlsUrl || '',
      signed: false, // TODO: Implement signed URL generation
    }));
  }

  async getExternalPlayerUrl(
    contentId: string,
    isAdmin: boolean = false,
  ): Promise<{ externalPlayerUrl: string | null; contentId: string; title: string }> {
    const content = await this.findOne(contentId, isAdmin);
    return {
      externalPlayerUrl: content.externalPlayerUrl,
      contentId: content.id,
      title: content.title,
    };
  }

  async getTrending(limit: number = 10): Promise<Content[]> {
    // Simple popularity metric based on watch history count
    // In production, this would use a more sophisticated algorithm
    const cacheKey = 'content:trending';
    const cached = await this.cacheManager.get<Content[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const content = await this.contentRepository
      .createQueryBuilder('content')
      .leftJoin('content.watchHistory', 'watchHistory')
      .where('content.status = :status', { status: ContentStatus.PUBLISHED })
      .groupBy('content.id')
      .orderBy('COUNT(watchHistory.id)', 'DESC')
      .addOrderBy('content.rating', 'DESC')
      .limit(limit)
      .getMany();

    await this.cacheManager.set(cacheKey, content, 300); // Cache for 5 minutes

    return content;
  }

  async invalidateCache(contentId: string): Promise<void> {
    await this.cacheManager.del(`content:${contentId}`);
    await this.cacheManager.del('content:trending');
  }
}
