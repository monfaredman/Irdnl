import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlayTableStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

/**
 * A "Play Table" (جدول پخش) entry.
 *
 * Each row represents a single scheduled broadcast slot.
 * The admin creates rows specifying a time window + the content to show.
 * Active rows are displayed on the homepage inside the IOSWidgetGridSection.
 */
@Entity('play_tables')
export class PlayTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Persian or English title for this schedule entry */
  @Column()
  title: string;

  @Column({ name: 'title_fa', nullable: true })
  titleFa: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'description_fa', type: 'text', nullable: true })
  descriptionFa: string | null;

  /** Ordered list of content IDs to display in this play-table slot */
  @Column({ name: 'content_ids', type: 'jsonb', default: '[]' })
  contentIds: string[];

  /** When this play-table becomes visible */
  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  /** When this play-table stops being visible */
  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: PlayTableStatus,
    default: PlayTableStatus.DRAFT,
  })
  status: PlayTableStatus;

  /** Cover / banner image for the widget */
  @Column({ name: 'image_url', nullable: true })
  imageUrl: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
