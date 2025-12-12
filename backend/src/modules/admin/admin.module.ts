import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Content } from '../content/entities/content.entity';
import { Series } from '../content/entities/series.entity';
import { Season } from '../content/entities/season.entity';
import { Episode } from '../content/entities/episode.entity';
import { VideoAsset } from '../video-assets/entities/video-asset.entity';
import { Job } from '../jobs/entities/job.entity';
import { ContentModule } from '../content/content.module';
import { VideoAssetsModule } from '../video-assets/video-assets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content, Series, Season, Episode, VideoAsset, Job]),
    ContentModule,
    VideoAssetsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

