import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { User } from '../users/entities/user.entity';
import { Content } from '../content/entities/content.entity';
import { Subscription } from '../users/entities/subscription.entity';
import { WatchHistory } from '../watch-history/entities/watch-history.entity';
import { VideoAsset } from '../video-assets/entities/video-asset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Content,
      Subscription,
      WatchHistory,
      VideoAsset,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

