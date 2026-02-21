import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'name_en' })
  nameEn: string;

  @Column({ name: 'name_fa' })
  nameFa: string;

  @Column({ name: 'content_type', default: 'mixed' })
  contentType: string; // 'movie' | 'series' | 'mixed' | 'other'

  @Column({ name: 'description_en', type: 'text', nullable: true })
  descriptionEn: string | null;

  @Column({ name: 'description_fa', type: 'text', nullable: true })
  descriptionFa: string | null;

  @Column({ name: 'gradient_colors', type: 'jsonb', nullable: true, default: '[]' })
  gradientColors: string[];

  @Column({ nullable: true })
  icon: string | null;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string | null;

  @Column({ name: 'tmdb_params', type: 'jsonb', nullable: true, default: '{}' })
  tmdbParams: Record<string, any> | null;

  @Column({ name: 'show_episodes', type: 'boolean', default: false })
  showEpisodes: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'show_in_menu', type: 'boolean', default: true })
  showInMenu: boolean;

  @Column({ name: 'show_in_landing', type: 'boolean', default: false })
  showInLanding: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  // ========================================================================
  // PARENT-CHILD RELATIONSHIP (self-referencing tree)
  // ========================================================================

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string | null;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  // ========================================================================
  // URL / ROUTING
  // ========================================================================

  /** URL path segment for this category (e.g. "foreign", "action") */
  @Column({ name: 'url_path', nullable: true })
  urlPath: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
