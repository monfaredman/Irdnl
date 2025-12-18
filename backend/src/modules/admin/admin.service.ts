import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Content, ContentType, ContentStatus } from '../content/entities/content.entity';
import { Series } from '../content/entities/series.entity';
import { Season } from '../content/entities/season.entity';
import { Episode } from '../content/entities/episode.entity';
import { VideoAsset, VideoAssetStatus } from '../video-assets/entities/video-asset.entity';
import { Job, JobType, JobStatus } from '../jobs/entities/job.entity';
import { User } from '../users/entities/user.entity';
import { ContentService } from '../content/content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ListContentDto } from './dto/list-content.dto';
import { CreateSeasonDto } from './dto/create-season.dto';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StorageService } from '../video-assets/storage.service';

@Injectable()
export class AdminService {
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
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private contentService: ContentService,
    private storageService: StorageService,
  ) {}

  async createContent(createContentDto: CreateContentDto): Promise<Content> {
    const content = this.contentRepository.create({
      ...createContentDto,
      status: createContentDto.status ?? ContentStatus.DRAFT,
    });
    const savedContent = await this.contentRepository.save(content);

    // If it's a series, create a series entry
    if (savedContent.type === ContentType.SERIES) {
      const series = this.seriesRepository.create({
        contentId: savedContent.id,
      });
      await this.seriesRepository.save(series);
    }

    return savedContent;
  }

  async getContent(id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id },
      relations: ['series', 'videoAssets'],
    });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  async updateContent(id: string, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    Object.assign(content, updateContentDto);
    const updated = await this.contentRepository.save(content);

    // Invalidate cache
    await this.contentService.invalidateCache(id);

    return updated;
  }

  async deleteContent(id: string): Promise<void> {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    await this.contentRepository.remove(content);
    await this.contentService.invalidateCache(id);
  }

  async uploadVideo(
    contentId: string,
    file: Express.Multer.File,
    quality: string,
  ): Promise<VideoAsset> {
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
    });
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    // Store file using storage service
    const filePath = await this.storageService.upload(file, contentId, quality);

    // Create video asset
    const videoAsset = this.videoAssetRepository.create({
      contentId,
      quality,
      status: VideoAssetStatus.UPLOADED,
      filesize: file.size,
    });
    const savedAsset = await this.videoAssetRepository.save(videoAsset);

    // Create transcoding job
    const job = this.jobRepository.create({
      type: JobType.TRANSCODE,
      payload: {
        videoAssetId: savedAsset.id,
        filePath,
        quality,
        contentId,
      },
      status: JobStatus.PENDING,
    });
    await this.jobRepository.save(job);

    return savedAsset;
  }

  async markTranscoded(assetId: string, markTranscodedDto: any): Promise<VideoAsset> {
    const asset = await this.videoAssetRepository.findOne({
      where: { id: assetId },
    });
    if (!asset) {
      throw new NotFoundException(`Video asset with ID ${assetId} not found`);
    }

    Object.assign(asset, markTranscodedDto);
    return this.videoAssetRepository.save(asset);
  }

  async listContent(listContentDto: ListContentDto) {
    const { page = 1, limit = 20, search, type, status } = listContentDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.contentRepository.createQueryBuilder('content');

    if (search) {
      queryBuilder.where('content.title ILIKE :search', { search: `%${search}%` });
    }

    if (type) {
      queryBuilder.andWhere('content.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('content.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .orderBy('content.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async createSeason(createSeasonDto: CreateSeasonDto): Promise<Season> {
    const series = await this.seriesRepository.findOne({
      where: { id: createSeasonDto.seriesId },
    });
    if (!series) {
      throw new NotFoundException(`Series with ID ${createSeasonDto.seriesId} not found`);
    }

    const season = this.seasonRepository.create(createSeasonDto);
    return this.seasonRepository.save(season);
  }

  async createEpisode(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    const season = await this.seasonRepository.findOne({
      where: { id: createEpisodeDto.seasonId },
    });
    if (!season) {
      throw new NotFoundException(`Season with ID ${createEpisodeDto.seasonId} not found`);
    }

    const episode = this.episodeRepository.create(createEpisodeDto);
    return this.episodeRepository.save(episode);
  }

  async listUsers(listUsersDto: ListUsersDto) {
    const { page = 1, limit = 20, search, role } = listUsersDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    const [data, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['subscriptions', 'watchHistory'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);
  }

  async uploadImage(
    file: Express.Multer.File,
    type: 'poster' | 'banner',
  ): Promise<{ url: string }> {
    // Store image file
    const filePath = await this.storageService.upload(file, 'images', type);
    const url = await this.storageService.getUrl(filePath);

    return { url };
  }

  async getVideoAsset(id: string): Promise<VideoAsset> {
    const asset = await this.videoAssetRepository.findOne({
      where: { id },
      relations: ['content'],
    });
    if (!asset) {
      throw new NotFoundException(`Video asset with ID ${id} not found`);
    }
    return asset;
  }

  async listVideoAssets(contentId?: string) {
    const queryBuilder = this.videoAssetRepository.createQueryBuilder('videoAsset');

    if (contentId) {
      queryBuilder.where('videoAsset.contentId = :contentId', { contentId });
    }

    const [data, total] = await queryBuilder
      .orderBy('videoAsset.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
    };
  }
}
