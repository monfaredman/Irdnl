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
import { Category } from '../content/entities/category.entity';
import { Genre } from '../content/entities/genre.entity';
import { Slider } from '../content/entities/slider.entity';
import { Offer } from '../content/entities/offer.entity';
import { Pin } from '../content/entities/pin.entity';
import { Collection } from '../content/entities/collection.entity';
import { ContentService } from '../content/content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ListContentDto } from './dto/list-content.dto';
import { CreateSeasonDto, UpdateSeasonDto } from './dto/create-season.dto';
import { CreateEpisodeDto, UpdateEpisodeDto } from './dto/create-episode.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateGenreDto, UpdateGenreDto } from './dto/genre.dto';
import { CreateSliderDto, UpdateSliderDto } from './dto/slider.dto';
import { CreateOfferDto, UpdateOfferDto } from './dto/offer.dto';
import { CreatePinDto, UpdatePinDto } from './dto/pin.dto';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collection.dto';
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
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Pin)
    private pinRepository: Repository<Pin>,
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    private contentService: ContentService,
    private storageService: StorageService,
  ) {}

  async createContent(createContentDto: CreateContentDto): Promise<Content> {
    // Normalize empty strings to null for optional URL fields
    if (createContentDto.externalPlayerUrl === '') {
      createContentDto.externalPlayerUrl = null as any;
    }
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

    // Load full series hierarchy for series content
    if (content.type === ContentType.SERIES && content.series) {
      try {
        const series = await this.seriesRepository.findOne({
          where: { id: content.series.id },
          relations: ['seasons', 'seasons.episodes'],
        });
        if (series) {
          // Sort seasons by number, episodes by number
          series.seasons = (series.seasons || []).sort((a, b) => a.number - b.number);
          for (const season of series.seasons) {
            season.episodes = (season.episodes || []).sort((a, b) => a.number - b.number);
            // Manually load video assets for each episode (avoids FK crash)
            for (const episode of season.episodes) {
              if (episode.videoAssetId) {
                try {
                  const va = await this.videoAssetRepository.findOne({
                    where: { id: episode.videoAssetId },
                  });
                  episode.videoAsset = va || null;
                } catch {
                  episode.videoAsset = null;
                }
              }
            }
          }
          content.series = series;
        }
      } catch (error) {
        console.error('Error loading series hierarchy:', error?.message || error);
        // Return content without full hierarchy rather than 500
      }
    }

    return content;
  }

  async updateContent(id: string, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    // Normalize empty strings to null for optional URL fields
    if (updateContentDto.externalPlayerUrl === '') {
      (updateContentDto as any).externalPlayerUrl = null;
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
    episodeId?: string,
  ): Promise<VideoAsset> {
    // Validate contentId (always required for storage path)
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
    });
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    // If episodeId provided, validate it and auto-link
    let episode = null;
    if (episodeId) {
      episode = await this.episodeRepository.findOne({
        where: { id: episodeId },
      });
      if (!episode) {
        throw new NotFoundException(`Episode with ID ${episodeId} not found`);
      }
    }

    // Store file using storage service
    const filePath = await this.storageService.upload(file, contentId, quality);

    // Build the serving URL path for the video
    const hlsUrl = `/storage/${contentId}/${quality}/${file.originalname}`;

    // Create video asset — auto-mark as READY for direct MP4 playback
    const videoAsset = this.videoAssetRepository.create({
      contentId,
      episodeId: episodeId || null,
      quality,
      status: VideoAssetStatus.READY,
      hlsUrl,
      filesize: file.size,
    });
    const savedAsset = await this.videoAssetRepository.save(videoAsset);

    // Auto-link to episode if episodeId provided
    if (episode) {
      episode.videoAssetId = savedAsset.id;
      await this.episodeRepository.save(episode);
    }

    // Create transcoding job
    const job = this.jobRepository.create({
      type: JobType.TRANSCODE,
      payload: {
        videoAssetId: savedAsset.id,
        filePath,
        quality,
        contentId,
        episodeId: episodeId || null,
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

  async updateSeason(id: string, updateSeasonDto: UpdateSeasonDto): Promise<Season> {
    const season = await this.seasonRepository.findOne({ where: { id } });
    if (!season) {
      throw new NotFoundException(`Season with ID ${id} not found`);
    }
    Object.assign(season, updateSeasonDto);
    return this.seasonRepository.save(season);
  }

  async deleteSeason(id: string): Promise<void> {
    const season = await this.seasonRepository.findOne({
      where: { id },
      relations: ['episodes'],
    });
    if (!season) {
      throw new NotFoundException(`Season with ID ${id} not found`);
    }
    await this.seasonRepository.remove(season);
  }

  async updateEpisode(id: string, updateEpisodeDto: UpdateEpisodeDto): Promise<Episode> {
    const episode = await this.episodeRepository.findOne({ where: { id } });
    if (!episode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }
    Object.assign(episode, updateEpisodeDto);
    return this.episodeRepository.save(episode);
  }

  async deleteEpisode(id: string): Promise<void> {
    const episode = await this.episodeRepository.findOne({ where: { id } });
    if (!episode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }
    await this.episodeRepository.remove(episode);
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

  async deleteVideoAsset(id: string): Promise<void> {
    const asset = await this.videoAssetRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Video asset with ID ${id} not found`);
    }
    await this.videoAssetRepository.remove(asset);
  }

  // ========================================================================
  // CATEGORIES CRUD
  // ========================================================================

  async listCategories() {
    const data = await this.categoryRepository.find({
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { data, total: data.length };
  }

  async getCategory(id: string): Promise<Category> {
    const cat = await this.categoryRepository.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Category with ID ${id} not found`);
    return cat;
  }

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const cat = this.categoryRepository.create(dto);
    return this.categoryRepository.save(cat);
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const cat = await this.categoryRepository.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Category with ID ${id} not found`);
    Object.assign(cat, dto);
    return this.categoryRepository.save(cat);
  }

  async deleteCategory(id: string): Promise<void> {
    const cat = await this.categoryRepository.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Category with ID ${id} not found`);
    await this.categoryRepository.remove(cat);
  }

  // ========================================================================
  // GENRES CRUD
  // ========================================================================

  async listGenres(categorySlug?: string) {
    const qb = this.genreRepository.createQueryBuilder('genre');
    if (categorySlug) {
      qb.where(`genre.category_slugs @> :slug`, { slug: JSON.stringify([categorySlug]) });
    }
    qb.orderBy('genre.sortOrder', 'ASC').addOrderBy('genre.createdAt', 'DESC');
    const data = await qb.getMany();
    return { data, total: data.length };
  }

  async getGenre(id: string): Promise<Genre> {
    const genre = await this.genreRepository.findOne({ where: { id } });
    if (!genre) throw new NotFoundException(`Genre with ID ${id} not found`);
    return genre;
  }

  async createGenre(dto: CreateGenreDto): Promise<Genre> {
    const genre = this.genreRepository.create(dto);
    return this.genreRepository.save(genre);
  }

  async updateGenre(id: string, dto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.genreRepository.findOne({ where: { id } });
    if (!genre) throw new NotFoundException(`Genre with ID ${id} not found`);
    Object.assign(genre, dto);
    return this.genreRepository.save(genre);
  }

  async deleteGenre(id: string): Promise<void> {
    const genre = await this.genreRepository.findOne({ where: { id } });
    if (!genre) throw new NotFoundException(`Genre with ID ${id} not found`);
    await this.genreRepository.remove(genre);
  }

  // ========================================================================
  // SLIDERS CRUD
  // ========================================================================

  async listSliders(section?: string) {
    const where: any = {};
    if (section) where.section = section;
    const data = await this.sliderRepository.find({
      where,
      relations: ['content'],
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { data, total: data.length };
  }

  async getSlider(id: string): Promise<Slider> {
    const slider = await this.sliderRepository.findOne({ where: { id }, relations: ['content'] });
    if (!slider) throw new NotFoundException(`Slider with ID ${id} not found`);
    return slider;
  }

  async createSlider(dto: CreateSliderDto): Promise<Slider> {
    const slider = this.sliderRepository.create(dto);
    return this.sliderRepository.save(slider);
  }

  async updateSlider(id: string, dto: UpdateSliderDto): Promise<Slider> {
    const slider = await this.sliderRepository.findOne({ where: { id } });
    if (!slider) throw new NotFoundException(`Slider with ID ${id} not found`);
    Object.assign(slider, dto);
    return this.sliderRepository.save(slider);
  }

  async deleteSlider(id: string): Promise<void> {
    const slider = await this.sliderRepository.findOne({ where: { id } });
    if (!slider) throw new NotFoundException(`Slider with ID ${id} not found`);
    await this.sliderRepository.remove(slider);
  }

  // ========================================================================
  // OFFERS CRUD
  // ========================================================================

  async listOffers() {
    const data = await this.offerRepository.find({
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { data, total: data.length };
  }

  async getOffer(id: string): Promise<Offer> {
    const offer = await this.offerRepository.findOne({ where: { id } });
    if (!offer) throw new NotFoundException(`Offer with ID ${id} not found`);
    return offer;
  }

  async createOffer(dto: CreateOfferDto): Promise<Offer> {
    const offer = this.offerRepository.create(dto);
    return this.offerRepository.save(offer);
  }

  async updateOffer(id: string, dto: UpdateOfferDto): Promise<Offer> {
    const offer = await this.offerRepository.findOne({ where: { id } });
    if (!offer) throw new NotFoundException(`Offer with ID ${id} not found`);
    Object.assign(offer, dto);
    return this.offerRepository.save(offer);
  }

  async deleteOffer(id: string): Promise<void> {
    const offer = await this.offerRepository.findOne({ where: { id } });
    if (!offer) throw new NotFoundException(`Offer with ID ${id} not found`);
    await this.offerRepository.remove(offer);
  }

  // ========================================================================
  // PINS CRUD
  // ========================================================================

  async listPins(section?: string) {
    const where: any = {};
    if (section) where.section = section;
    const data = await this.pinRepository.find({
      where,
      relations: ['content'],
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { data, total: data.length };
  }

  async getPin(id: string): Promise<Pin> {
    const pin = await this.pinRepository.findOne({ where: { id }, relations: ['content'] });
    if (!pin) throw new NotFoundException(`Pin with ID ${id} not found`);
    return pin;
  }

  async createPin(dto: CreatePinDto): Promise<Pin> {
    // Validate content exists
    const content = await this.contentRepository.findOne({ where: { id: dto.contentId } });
    if (!content) throw new NotFoundException(`Content with ID ${dto.contentId} not found`);
    const pin = this.pinRepository.create(dto);
    return this.pinRepository.save(pin);
  }

  async updatePin(id: string, dto: UpdatePinDto): Promise<Pin> {
    const pin = await this.pinRepository.findOne({ where: { id } });
    if (!pin) throw new NotFoundException(`Pin with ID ${id} not found`);
    if (dto.contentId) {
      const content = await this.contentRepository.findOne({ where: { id: dto.contentId } });
      if (!content) throw new NotFoundException(`Content with ID ${dto.contentId} not found`);
    }
    Object.assign(pin, dto);
    return this.pinRepository.save(pin);
  }

  async deletePin(id: string): Promise<void> {
    const pin = await this.pinRepository.findOne({ where: { id } });
    if (!pin) throw new NotFoundException(`Pin with ID ${id} not found`);
    await this.pinRepository.remove(pin);
  }

  // Collections CRUD
  async listCollections(
    page = 1,
    limit = 20,
  ): Promise<{ collections: Collection[]; total: number }> {
    const skip = (page - 1) * limit;
    const [collections, total] = await this.collectionRepository.findAndCount({
      skip,
      take: limit,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { collections, total };
  }

  async getCollection(id: string): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: { id },
    });
    if (!collection)
      throw new NotFoundException(`Collection with ID ${id} not found`);
    return collection;
  }

  async createCollection(dto: CreateCollectionDto): Promise<Collection> {
    const collection = this.collectionRepository.create(dto);
    return await this.collectionRepository.save(collection);
  }

  async updateCollection(
    id: string,
    dto: UpdateCollectionDto,
  ): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: { id },
    });
    if (!collection)
      throw new NotFoundException(`Collection with ID ${id} not found`);
    this.collectionRepository.merge(collection, dto);
    return await this.collectionRepository.save(collection);
  }

  async deleteCollection(id: string): Promise<void> {
    const collection = await this.collectionRepository.findOne({
      where: { id },
    });
    if (!collection)
      throw new NotFoundException(`Collection with ID ${id} not found`);
    await this.collectionRepository.remove(collection);
  }
}
