import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Content } from '../../content/entities/content.entity';

@Entity('watchlist')
@Index(['userId', 'contentId'], { unique: true })
export class Watchlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.watchlist)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'content_id' })
  contentId: string;

  @ManyToOne(() => Content, (content) => content.watchlist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id' })
  content: Content;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
