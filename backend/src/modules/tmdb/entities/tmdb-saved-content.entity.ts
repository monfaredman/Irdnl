import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum TMDBMediaType {
  MOVIE = 'movie',
  TV = 'tv',
}

export enum TMDBImportStatus {
  PENDING = 'pending',
  IMPORTED = 'imported',
  FAILED = 'failed',
}

@Entity('tmdb_saved_content')
export class TMDBSavedContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tmdb_id' })
  @Index()
  tmdbId: string;

  @Column({
    name: 'media_type',
    type: 'enum',
    enum: TMDBMediaType,
  })
  @Index()
  mediaType: TMDBMediaType;

  @Column({ name: 'title', nullable: true })
  title: string;

  @Column({ name: 'original_title', nullable: true })
  originalTitle: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'poster_url', nullable: true })
  posterUrl: string;

  @Column({ name: 'backdrop_url', nullable: true })
  backdropUrl: string;

  @Column({ name: 'year', type: 'int', nullable: true })
  year: number;

  @Column({ name: 'rating', type: 'float', nullable: true, default: 0 })
  rating: number;

  @Column({ name: 'original_language', nullable: true })
  originalLanguage: string;

  @Column({ name: 'genre_ids', type: 'jsonb', nullable: true, default: '[]' })
  genreIds: number[];

  @Column({ name: 'origin_country', type: 'jsonb', nullable: true, default: '[]' })
  originCountry: string[];

  @Column({ name: 'raw_data', type: 'jsonb', nullable: true })
  rawData: Record<string, any>;

  @Column({
    name: 'import_status',
    type: 'enum',
    enum: TMDBImportStatus,
    default: TMDBImportStatus.PENDING,
  })
  @Index()
  importStatus: TMDBImportStatus;

  @Column({ name: 'imported_content_id', nullable: true })
  importedContentId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
