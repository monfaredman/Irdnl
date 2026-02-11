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

@Entity('pins')
export class Pin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'content_id', type: 'uuid' })
  contentId: string;

  @ManyToOne(() => Content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id' })
  content: Content;

  /** Section of the homepage: 'hero', 'new-movies', 'foreign-series', 'iranian-series', 'dubbed', 'animation', 'trending', 'widget-grid' */
  @Column()
  section: string;

  @Column({ nullable: true })
  label: string | null;

  @Column({ name: 'label_fa', nullable: true })
  labelFa: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
