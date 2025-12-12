import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content } from './entities/content.entity';
import { Series } from './entities/series.entity';
import { Season } from './entities/season.entity';
import { Episode } from './entities/episode.entity';
import { VideoAsset } from '../video-assets/entities/video-asset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content, Series, Season, Episode, VideoAsset]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}

