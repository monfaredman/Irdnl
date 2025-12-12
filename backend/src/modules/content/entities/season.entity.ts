import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Series } from './series.entity';
import { Episode } from './episode.entity';

@Entity('seasons')
export class Season {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'series_id' })
  seriesId: string;

  @ManyToOne(() => Series, (series) => series.seasons)
  @JoinColumn({ name: 'series_id' })
  series: Series;

  @Column({ type: 'int' })
  number: number;

  @Column({ nullable: true })
  title: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Episode, (episode) => episode.season)
  episodes: Episode[];
}

