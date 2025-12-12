import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { Content } from '../modules/content/entities/content.entity';
import { Series } from '../modules/content/entities/series.entity';
import { Season } from '../modules/content/entities/season.entity';
import { Episode } from '../modules/content/entities/episode.entity';
import { VideoAsset } from '../modules/video-assets/entities/video-asset.entity';
import { WatchHistory } from '../modules/watch-history/entities/watch-history.entity';
import { Subscription } from '../modules/users/entities/subscription.entity';
import { Job } from '../modules/jobs/entities/job.entity';
import { Watchlist } from '../modules/watchlist/entities/watchlist.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    
    if (databaseUrl) {
      return {
        type: 'postgres',
        url: databaseUrl,
        entities: [
          User,
          Content,
          Series,
          Season,
          Episode,
          VideoAsset,
          WatchHistory,
          Subscription,
          Job,
          Watchlist,
        ],
        synchronize: this.configService.get<string>('NODE_ENV') === 'development',
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
        logging: this.configService.get<string>('NODE_ENV') === 'development',
      };
    }

    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME', 'persiaplay'),
      password: this.configService.get<string>('DB_PASSWORD', 'persiaplay123'),
      database: this.configService.get<string>('DB_DATABASE', 'persiaplay_db'),
      entities: [
        User,
        Content,
        Series,
        Season,
        Episode,
        VideoAsset,
        WatchHistory,
        Subscription,
        Job,
        Watchlist,
      ],
      synchronize: false, // Always use migrations
      migrations: ['src/migrations/*.ts'],
      migrationsRun: false, // Run migrations manually or via script
      logging: this.configService.get<string>('NODE_ENV') === 'development',
    };
  }
}

