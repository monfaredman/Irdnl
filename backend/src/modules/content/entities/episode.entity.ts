import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Season } from './season.entity';
import { VideoAsset } from '../../video-assets/entities/video-asset.entity';

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'season_id' })
  seasonId: string;

  @ManyToOne(() => Season, (season) => season.episodes)
  @JoinColumn({ name: 'season_id' })
  season: Season;

  @Column()
  title: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'video_asset_id', nullable: true })
  videoAssetId: string | null;

  @OneToOne(() => VideoAsset)
  @JoinColumn({ name: 'video_asset_id' })
  videoAsset: VideoAsset | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

