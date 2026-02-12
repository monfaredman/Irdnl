import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Content } from '../../content/entities/content.entity';
import { User } from '../../users/entities/user.entity';

export enum CommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SPAM = 'spam',
}

export enum CommentType {
  COMMENT = 'comment',
  SUPPORT = 'support',
  REPORT = 'report',
  FEEDBACK = 'feedback',
}

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({
    type: 'enum',
    enum: CommentType,
    default: CommentType.COMMENT,
  })
  type: CommentType;

  @Column({
    type: 'enum',
    enum: CommentStatus,
    default: CommentStatus.PENDING,
  })
  status: CommentStatus;

  @Column({ name: 'user_id', nullable: true })
  userId: string | null;

  @Column({ name: 'content_id', nullable: true })
  contentId: string | null;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string | null;

  @Column({ name: 'user_name', nullable: true })
  userName: string | null;

  @Column({ name: 'user_email', nullable: true })
  userEmail: string | null;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @Column({ name: 'admin_reply', type: 'text', nullable: true })
  adminReply: string | null;

  @Column({ name: 'admin_id', nullable: true })
  adminId: string | null;

  @Column({ name: 'replied_at', type: 'timestamp', nullable: true })
  repliedAt: Date | null;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ type: 'boolean', default: false, name: 'is_pinned' })
  isPinned: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_spoiler' })
  isSpoiler: boolean;

  @Column({ type: 'int', default: 0, name: 'likes_count' })
  likesCount: number;

  @Column({ type: 'int', default: 0, name: 'dislikes_count' })
  dislikesCount: number;

  @Column({ type: 'jsonb', nullable: true, default: '{}' })
  metadata: {
    device?: string;
    platform?: string;
    browserVersion?: string;
    tags?: string[];
  } | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @ManyToOne(() => Content, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id' })
  content: Content | null;

  @ManyToOne(() => Comment, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment | null;
}
