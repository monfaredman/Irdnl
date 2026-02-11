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
import { User } from '../users/entities/user.entity';
import { Category } from '../content/entities/category.entity';
import { Genre } from '../content/entities/genre.entity';
import { Slider } from '../content/entities/slider.entity';
import { Offer } from '../content/entities/offer.entity';
import { Pin } from '../content/entities/pin.entity';
import { Collection } from '../content/entities/collection.entity';
import { ContentModule } from '../content/content.module';
import { VideoAssetsModule } from '../video-assets/video-assets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Content, Series, Season, Episode, VideoAsset, Job, User,
      Category, Genre, Slider, Offer, Pin, Collection,
    ]),
    ContentModule,
    VideoAssetsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
