import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Content } from '../../content/entities/content.entity';

@Entity('watch_history')
@Index(['userId', 'contentId'], { unique: true })
export class WatchHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.watchHistory)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'content_id' })
  contentId: string;

  @ManyToOne(() => Content, (content) => content.watchHistory)
  @JoinColumn({ name: 'content_id' })
  content: Content;

  @Column({ name: 'progress_seconds', type: 'int', default: 0 })
  progressSeconds: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

