import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived',
}

export enum BlogCategory {
  NEWS = 'news',
  REVIEWS = 'reviews',
  INTERVIEWS = 'interviews',
  BEHIND_SCENES = 'behind_scenes',
  INDUSTRY = 'industry',
  TECHNOLOGY = 'technology',
  OPINION = 'opinion',
  TUTORIALS = 'tutorials',
}

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'cover_image', nullable: true })
  coverImage: string | null;

  @Column({
    type: 'enum',
    enum: BlogPostStatus,
    default: BlogPostStatus.DRAFT,
  })
  status: BlogPostStatus;

  @Column({
    type: 'enum',
    enum: BlogCategory,
  })
  category: BlogCategory;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @Column({ name: 'scheduled_at', type: 'timestamp', nullable: true })
  scheduledAt: Date | null;

  @Column({ name: 'views_count', type: 'int', default: 0 })
  viewsCount: number;

  @Column({ name: 'likes_count', type: 'int', default: 0 })
  likesCount: number;

  @Column({ name: 'comments_count', type: 'int', default: 0 })
  commentsCount: number;

  @Column({ name: 'reading_time', type: 'int', nullable: true })
  readingTime: number | null;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ name: 'meta_title', nullable: true })
  metaTitle: string | null;

  @Column({ name: 'meta_description', nullable: true })
  metaDescription: string | null;

  @Column({ name: 'meta_keywords', type: 'simple-array', nullable: true })
  metaKeywords: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
