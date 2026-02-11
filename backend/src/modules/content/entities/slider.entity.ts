import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Content } from './content.entity';

@Entity('sliders')
export class Slider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'title_fa', nullable: true })
  titleFa: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'description_fa', type: 'text', nullable: true })
  descriptionFa: string | null;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string | null;

  @Column({ name: 'link_url', nullable: true })
  linkUrl: string | null;

  @Column({ name: 'content_id', type: 'uuid', nullable: true })
  contentId: string | null;

  @ManyToOne(() => Content, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'content_id' })
  content: Content | null;

  /** Where this slider appears: 'hero', 'banner1', 'banner2', 'promo' */
  @Column({ default: 'hero' })
  section: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
