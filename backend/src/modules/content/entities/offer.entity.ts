import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('offers')
export class Offer {
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

  @Column({ name: 'discount_percent', type: 'int', nullable: true })
  discountPercent: number | null;

  @Column({ name: 'discount_code', nullable: true })
  discountCode: string | null;

  @Column({ name: 'original_price', type: 'numeric', precision: 12, scale: 0, nullable: true })
  originalPrice: number | null;

  @Column({ name: 'offer_price', type: 'numeric', precision: 12, scale: 0, nullable: true })
  offerPrice: number | null;

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
