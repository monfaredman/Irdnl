import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Content } from '../../content/entities/content.entity';
import { Episode } from '../../content/entities/episode.entity';

export enum VideoAssetStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error',
}

@Entity('video_assets')
export class VideoAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'content_id' })
  contentId: string;

  @ManyToOne(() => Content, (content) => content.videoAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id' })
  content: Content;

  @Column({ name: 'episode_id', nullable: true })
  episodeId: string | null;

  @ManyToOne(() => Episode, { nullable: true })
  @JoinColumn({ name: 'episode_id' })
  episode: Episode | null;

  @Column()
  quality: string; // '1080p', '720p', '480p', etc.

  @Column({
    type: 'enum',
    enum: VideoAssetStatus,
    default: VideoAssetStatus.UPLOADED,
  })
  status: VideoAssetStatus;

  @Column({ name: 'hls_url', nullable: true })
  hlsUrl: string | null;

  @Column({ type: 'int', nullable: true })
  duration: number | null; // in seconds

  @Column({ type: 'bigint', nullable: true })
  filesize: number | null; // in bytes

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
