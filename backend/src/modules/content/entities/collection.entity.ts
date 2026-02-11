import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ name: 'title_fa', nullable: true })
  titleFa: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'description_fa', type: 'text', nullable: true })
  descriptionFa: string | null;

  @Column({ name: 'poster_url', nullable: true })
  posterUrl: string | null;

  @Column({ name: 'backdrop_url', nullable: true })
  backdropUrl: string | null;

  @Column({ name: 'content_ids', type: 'jsonb', default: '[]' })
  contentIds: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
