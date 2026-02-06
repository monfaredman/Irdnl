import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Series } from './series.entity';
import { VideoAsset } from '../../video-assets/entities/video-asset.entity';
import { WatchHistory } from '../../watch-history/entities/watch-history.entity';
import { Watchlist } from '../../watchlist/entities/watchlist.entity';

export enum ContentType {
  MOVIE = 'movie',
  SERIES = 'series',
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('content')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  type: ContentType;

  @Column({ type: 'int', nullable: true })
  year: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'poster_url', nullable: true })
  posterUrl: string | null;

  @Column({ name: 'banner_url', nullable: true })
  bannerUrl: string | null;

  @Column({ type: 'numeric', precision: 3, scale: 1, nullable: true })
  rating: number | null;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({ name: 'external_player_url', nullable: true })
  externalPlayerUrl: string | null;

  @Column({ name: 'license_info', type: 'jsonb', nullable: true })
  licenseInfo: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  } | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Series, (series) => series.content)
  series: Series;

  @OneToMany(() => VideoAsset, (videoAsset) => videoAsset.content)
  videoAssets: VideoAsset[];

  @OneToMany(() => WatchHistory, (watchHistory) => watchHistory.content)
  watchHistory: WatchHistory[];

  @OneToMany(() => Watchlist, (watchlist) => watchlist.content)
  watchlist: Watchlist[];
}
