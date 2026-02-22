import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Category } from '../content/entities/category.entity';
import { Collection } from '../content/entities/collection.entity';
import { Content, ContentStatus } from '../content/entities/content.entity';
import { Genre } from '../content/entities/genre.entity';
import { Slider } from '../content/entities/slider.entity';
import { Offer } from '../content/entities/offer.entity';
import { Pin } from '../content/entities/pin.entity';
import { PlayTable } from '../content/entities/play-table.entity';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Slider)
    private readonly sliderRepository: Repository<Slider>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Pin)
    private readonly pinRepository: Repository<Pin>,
    @InjectRepository(PlayTable)
    private readonly playTableRepository: Repository<PlayTable>,
  ) {}

  // ========================================================================
  // CATEGORIES
  // ========================================================================

  async listActiveCategories() {
    const data = await this.categoryRepository.find({
      where: { isActive: true },
      relations: ['children'],
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { data, total: data.length };
  }

  async listMenuCategories() {
    // Fetch only top-level menu categories (parentId IS NULL) with their children
    const data = await this.categoryRepository.find({
      where: { isActive: true, showInMenu: true, parentId: IsNull() },
      relations: ['children'],
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    // Sort children and filter inactive ones
    for (const cat of data) {
      if (cat.children) {
        cat.children = cat.children
          .filter((child) => child.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      }
    }

    return { data, total: data.length };
  }

  async listLandingCategories() {
    const data = await this.categoryRepository.find({
      where: { isActive: true, showInLanding: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { data, total: data.length };
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug, isActive: true },
      relations: ['children', 'parent'],
    });
    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }
    return category;
  }

  async getCategoryByUrlPath(parentPath: string, childPath?: string): Promise<Category> {
    if (childPath) {
      // Find child category by matching parent urlPath + child urlPath
      const parent = await this.categoryRepository.findOne({
        where: { urlPath: parentPath, isActive: true, parentId: IsNull() },
      });
      if (!parent) {
        throw new NotFoundException(`Parent category with path "${parentPath}" not found`);
      }
      const child = await this.categoryRepository.findOne({
        where: { urlPath: childPath, parentId: parent.id, isActive: true },
        relations: ['parent'],
      });
      if (!child) {
        throw new NotFoundException(`Child category "${childPath}" not found under "${parentPath}"`);
      }
      return child;
    }

    // Find top-level category by urlPath
    const category = await this.categoryRepository.findOne({
      where: { urlPath: parentPath, isActive: true, parentId: IsNull() },
      relations: ['children'],
    });
    if (!category) {
      throw new NotFoundException(`Category with path "${parentPath}" not found`);
    }
    return category;
  }

  // ========================================================================
  // GENRES
  // ========================================================================

  async listActiveGenres(categorySlug?: string) {
    const where: any = { isActive: true };
    
    if (categorySlug) {
      // Filter by category slug using JSON contains
      const data = await this.genreRepository
        .createQueryBuilder('genre')
        .where('genre.isActive = :isActive', { isActive: true })
        .andWhere(`genre.category_slugs::jsonb @> :categorySlug::jsonb`, {
          categorySlug: JSON.stringify([categorySlug]),
        })
        .orderBy('genre.sortOrder', 'ASC')
        .addOrderBy('genre.createdAt', 'DESC')
        .getMany();
      return { data, total: data.length };
    }

    const data = await this.genreRepository.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { data, total: data.length };
  }

  async getGenreBySlug(slug: string): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { slug, isActive: true },
    });
    if (!genre) {
      throw new NotFoundException(`Genre with slug "${slug}" not found`);
    }
    return genre;
  }

  // ========================================================================
  // SLIDERS
  // ========================================================================

  async listActiveSliders(section?: string) {
    const where: any = { isActive: true };
    if (section) where.section = section;

    // Check if current date is within start/end range
    const now = new Date();
    
    const data = await this.sliderRepository
      .createQueryBuilder('slider')
      .leftJoinAndSelect('slider.content', 'content')
      .where('slider.isActive = :isActive', { isActive: true })
      .andWhere(
        '(slider.startDate IS NULL OR slider.startDate <= :now)',
        { now },
      )
      .andWhere(
        '(slider.endDate IS NULL OR slider.endDate >= :now)',
        { now },
      )
      .andWhere(section ? 'slider.section = :section' : '1=1', { section })
      .orderBy('slider.sortOrder', 'ASC')
      .addOrderBy('slider.createdAt', 'DESC')
      .getMany();

    // Enrich sliders that have no content association
    // Try to match by title or titleFa against content table
    const slidersWithoutContent = data.filter(
      (s) => !s.contentId && !s.linkUrl && !s.content,
    );

    if (slidersWithoutContent.length > 0) {
      const titles = slidersWithoutContent
        .map((s) => s.titleFa || s.title)
        .filter(Boolean);

      if (titles.length > 0) {
        const contents = await this.contentRepository
          .createQueryBuilder('content')
          .where('content.title IN (:...titles)', { titles })
          .orWhere('content.originalTitle IN (:...titles)', { titles })
          .select(['content.id', 'content.title', 'content.originalTitle'])
          .getMany();

        const titleToContentId = new Map<string, string>();
        for (const c of contents) {
          if (c.title) titleToContentId.set(c.title, c.id);
          if (c.originalTitle) titleToContentId.set(c.originalTitle, c.id);
        }

        for (const slider of slidersWithoutContent) {
          const matchTitle = slider.titleFa || slider.title;
          const contentId = titleToContentId.get(matchTitle);
          if (contentId) {
            (slider as any).contentId = contentId;
          }
        }
      }
    }

    return { data, total: data.length };
  }

  // ========================================================================
  // OFFERS
  // ========================================================================

  async listActiveOffers() {
    const now = new Date();
    
    const data = await this.offerRepository
      .createQueryBuilder('offer')
      .where('offer.isActive = :isActive', { isActive: true })
      .andWhere(
        '(offer.startDate IS NULL OR offer.startDate <= :now)',
        { now },
      )
      .andWhere(
        '(offer.endDate IS NULL OR offer.endDate >= :now)',
        { now },
      )
      .orderBy('offer.sortOrder', 'ASC')
      .addOrderBy('offer.createdAt', 'DESC')
      .getMany();

    // Enrich offers with content images when imageUrl is missing
    // Parse linkUrl like "/item/{uuid}" to extract content IDs
    const offersNeedingImages = data.filter(
      (o) => !o.imageUrl && o.linkUrl,
    );

    if (offersNeedingImages.length > 0) {
      const contentIdMap = new Map<string, string>();
      const uuidRegex = /\/item\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

      for (const offer of offersNeedingImages) {
        const match = offer.linkUrl?.match(uuidRegex);
        if (match) {
          contentIdMap.set(offer.id, match[1]);
        }
      }

      const contentIds = [...new Set(contentIdMap.values())];
      if (contentIds.length > 0) {
        const contents = await this.contentRepository.find({
          where: { id: In(contentIds) },
          select: ['id', 'posterUrl', 'backdropUrl'],
        });

        const contentMap = new Map(contents.map((c) => [c.id, c]));

        for (const offer of offersNeedingImages) {
          const contentId = contentIdMap.get(offer.id);
          if (contentId) {
            const content = contentMap.get(contentId);
            if (content) {
              (offer as any).imageUrl = content.posterUrl || content.backdropUrl || null;
              (offer as any).backdropUrl = content.backdropUrl || content.posterUrl || null;
            }
          }
        }
      }
    }

    return { data, total: data.length };
  }

  // ========================================================================
  // PINS
  // ========================================================================

  async listActivePins(section?: string) {
    const where: any = { isActive: true };
    if (section) where.section = section;

    const data = await this.pinRepository.find({
      where,
      relations: ['content'],
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    return { data, total: data.length };
  }

  // ========================================================================
  // COLLECTIONS
  // ========================================================================

  async listActiveCollections() {
    const data = await this.collectionRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { data, total: data.length };
  }

  async getCollectionBySlug(slug: string) {
    const collection = await this.collectionRepository.findOne({
      where: { slug, isActive: true },
    });
    if (!collection) {
      throw new NotFoundException(`Collection with slug "${slug}" not found`);
    }

    // Fetch the content items for this collection
    // 1. Items explicitly listed in contentIds
    // 2. Items that reference this collection via their collectionId field
    let contents: Content[] = [];

    const conditions: any[] = [];
    if (collection.contentIds && collection.contentIds.length > 0) {
      conditions.push({ id: In(collection.contentIds), status: ContentStatus.PUBLISHED });
    }
    // Also find content that has this collection's ID in its collectionId field
    conditions.push({ collectionId: collection.id, status: ContentStatus.PUBLISHED });

    if (conditions.length > 0) {
      contents = await this.contentRepository.find({
        where: conditions,
        relations: ['videoAssets'],
        order: { priority: 'DESC', createdAt: 'DESC' },
      });

      // Deduplicate by id (in case a content is both in contentIds AND has collectionId)
      const seen = new Set<string>();
      contents = contents.filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
    }

    return { ...collection, contents };
  }

  // ========================================================================
  // PLAY TABLES
  // ========================================================================

  async listActivePlayTables() {
    const now = new Date();
    const qb = this.playTableRepository.createQueryBuilder('pt')
      .where('pt.is_active = :active', { active: true })
      .andWhere('pt.status = :status', { status: 'active' })
      .andWhere(
        '(pt.start_time IS NULL OR pt.start_time <= :now)',
        { now },
      )
      .andWhere(
        '(pt.end_time IS NULL OR pt.end_time >= :now)',
        { now },
      )
      .orderBy('pt.sort_order', 'ASC')
      .addOrderBy('pt.start_time', 'ASC');

    const data = await qb.getMany();

    // Resolve content for each active play table
    const enriched = await Promise.all(
      data.map(async (pt) => {
        const contents = pt.contentIds.length
          ? await this.contentRepository.find({
              where: { id: In(pt.contentIds) },
              select: ['id', 'title', 'originalTitle', 'posterUrl', 'backdropUrl', 'bannerUrl', 'rating', 'year', 'type', 'genres'],
            })
          : [];
        return { ...pt, contents };
      }),
    );

    return { data: enriched, total: enriched.length };
  }
}
