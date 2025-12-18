import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Content } from './content.entity';
import { Season } from './season.entity';

@Entity('series')
export class Series {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'content_id', unique: true })
  contentId: string;

  @OneToOne(() => Content, (content) => content.series)
  @JoinColumn({ name: 'content_id' })
  content: Content;

  @OneToMany(() => Season, (season) => season.series)
  seasons: Season[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
