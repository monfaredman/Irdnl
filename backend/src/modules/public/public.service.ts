import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../content/entities/category.entity';
import { Genre } from '../content/entities/genre.entity';
import { Slider } from '../content/entities/slider.entity';
import { Offer } from '../content/entities/offer.entity';
import { Pin } from '../content/entities/pin.entity';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Slider)
    private readonly sliderRepository: Repository<Slider>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Pin)
    private readonly pinRepository: Repository<Pin>,
  ) {}

  // ========================================================================
  // CATEGORIES
  // ========================================================================

  async listActiveCategories() {
    const data = await this.categoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return { data, total: data.length };
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug, isActive: true },
    });
    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
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

    return { data, total: data.length };
  }

  // ========================================================================
  // OFFERS
  // ========================================================================

  async listActiveOffers() {
    const now = new Date();
    
    const data = await this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.content', 'content')
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
}
