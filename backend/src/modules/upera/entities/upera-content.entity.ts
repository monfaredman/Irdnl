import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum UperaContentType {
  MOVIE = 'movie',
  SERIES = 'series',
}

export enum UperaImportStatus {
  PENDING = 'pending',
  IMPORTED = 'imported',
  FAILED = 'failed',
}

@Entity('upera_content')
export class UperaContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'upera_id' })
  @Index()
  uperaId: string;

  @Column({ name: 'title_fa', nullable: true })
  titleFa: string | null;

  @Column({ name: 'title_en', nullable: true })
  titleEn: string | null;

  @Column({
    type: 'enum',
    enum: UperaContentType,
  })
  type: UperaContentType;

  @Column({ nullable: true })
  year: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'poster_url', nullable: true })
  posterUrl: string | null;

  @Column({ name: 'banner_url', nullable: true })
  bannerUrl: string | null;

  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true })
  rating: number | null;

  @Column({ name: 'imdb_rating', type: 'numeric', precision: 3, scale: 1, nullable: true })
  imdbRating: number | null;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  genres: string[];

  @Column({ name: 'is_free', type: 'boolean', default: false })
  isFree: boolean;

  @Column({ name: 'is_dubbed', type: 'boolean', default: false })
  isDubbed: boolean;

  @Column({ nullable: true })
  country: string | null;

  @Column({ type: 'jsonb', nullable: true })
  qualities: Array<{
    id: number;
    quality: string;
    size: string;
    price: number;
  }> | null;

  @Column({ type: 'jsonb', nullable: true })
  seasons: Array<{
    id: string;
    number: number;
    episodes: Array<{
      id: string;
      title: string;
      number: number;
    }>;
  }> | null;

  @Column({ name: 'affiliate_link', nullable: true })
  affiliateLink: string | null;

  @Column({
    name: 'import_status',
    type: 'enum',
    enum: UperaImportStatus,
    default: UperaImportStatus.PENDING,
  })
  importStatus: UperaImportStatus;

  @Column({ name: 'imported_content_id', nullable: true })
  importedContentId: string | null;

  @Column({ name: 'raw_data', type: 'jsonb', nullable: true })
  rawData: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
