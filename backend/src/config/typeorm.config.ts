import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as loadEnvConfig } from 'dotenv';
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
import { Notification } from '../modules/notifications/entities/notification.entity';
import { Category } from '../modules/content/entities/category.entity';
import { Genre } from '../modules/content/entities/genre.entity';
import { Slider } from '../modules/content/entities/slider.entity';
import { Offer } from '../modules/content/entities/offer.entity';
import { Pin } from '../modules/content/entities/pin.entity';
import { Collection } from '../modules/content/entities/collection.entity';
import { UperaContent } from '../modules/upera/entities/upera-content.entity';

loadEnvConfig();
loadEnvConfig({ path: '.env.local', override: true });

const ENTITIES = [
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
  Notification,
  Category,
  Genre,
  Slider,
  Offer,
  Pin,
  Collection,
  UperaContent,
];

type ConfigLike = {
  get<T = any>(key: string, defaultValue?: T): T;
};

const parseNumber = (value: string | number | undefined, fallback: number): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

export const buildTypeOrmOptions = (config: ConfigLike): DataSourceOptions => {
  const databaseUrl = config.get<string | undefined>('DATABASE_URL');
  const nodeEnv = config.get<string | undefined>('NODE_ENV');
  const isDevelopment = nodeEnv === 'development';

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      entities: ENTITIES,
      synchronize: isDevelopment,
      migrations: ['dist/migrations/*.js'],
      migrationsRun: false,
      logging: isDevelopment,
    } satisfies DataSourceOptions;
  }

  const rawPort = config.get<string | number | undefined>('DB_PORT', 5432);
  const port = parseNumber(rawPort, 5432);

  return {
    type: 'postgres',
    host: config.get<string>('DB_HOST', 'localhost'),
    port,
    username: config.get<string>('DB_USERNAME', 'monfaredman_user'),
    password: config.get<string>('DB_PASSWORD', 'MonfaredMan@2024'),
    database: config.get<string>('DB_DATABASE', 'irdnl_db'),
    entities: ENTITIES,
    synchronize: false,
    migrations: isDevelopment ? [] : ['dist/migrations/*.js'],
    migrationsRun: false,
    logging: isDevelopment,
  } satisfies DataSourceOptions;
};

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return buildTypeOrmOptions(this.configService);
  }
}

const envConfig: ConfigLike = {
  get<T = any>(key: string, defaultValue?: T): T {
    const value = process.env[key];
    if (value === undefined || value === null) {
      return defaultValue as T;
    }
    return value as unknown as T;
  },
};

export const dataSourceOptions = buildTypeOrmOptions(envConfig);
export const appDataSource = new DataSource(dataSourceOptions);
