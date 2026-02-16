import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'name_en' })
  nameEn: string;

  @Column({ name: 'name_fa' })
  nameFa: string;

  @Column({ name: 'tmdb_genre_id', nullable: true })
  tmdbGenreId: string | null;

  /** Comma-separated category slugs this genre belongs to, e.g. "movies-foreign,series-foreign" */
  @Column({ name: 'category_slugs', type: 'jsonb', nullable: true, default: '[]' })
  categorySlugs: string[];

  @Column({ name: 'poster_url', nullable: true })
  posterUrl: string | null;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string | null;

  @Column({ name: 'backdrop_url', nullable: true })
  backdropUrl: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
