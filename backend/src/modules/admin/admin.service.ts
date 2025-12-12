import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content, ContentType, ContentStatus } from '../content/entities/content.entity';
import { Series } from '../content/entities/series.entity';
import { Season } from '../content/entities/season.entity';
import { Episode } from '../content/entities/episode.entity';
import { VideoAsset, VideoAssetStatus } from '../video-assets/entities/video-asset.entity';
import { Job, JobType, JobStatus } from '../jobs/entities/job.entity';
import { ContentService } from '../content/content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
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
}

