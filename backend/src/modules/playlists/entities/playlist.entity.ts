import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Content } from '../../content/entities/content.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string | null;

  @Column({ name: 'cover_url', nullable: true })
  coverUrl: string | null;

  @Column({ name: 'is_public', default: true })
  isPublic: boolean;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'share_count', default: 0 })
  shareCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PlaylistItem, (item) => item.playlist, { cascade: true })
  items: PlaylistItem[];
}

@Entity('playlist_items')
export class PlaylistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'playlist_id' })
  playlistId: string;

  @ManyToOne(() => Playlist, (playlist) => playlist.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist;

  @Column({ name: 'content_id' })
  contentId: string;

  @ManyToOne(() => Content, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'content_id' })
  content: Content;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('playlist_likes')
export class PlaylistLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'playlist_id' })
  playlistId: string;

  @ManyToOne(() => Playlist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
