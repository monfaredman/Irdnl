import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, CacheModuleOptions, CacheStore } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { redisStore } from 'cache-manager-redis-store';
import { TypeOrmConfigService } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ContentModule } from './modules/content/content.module';
import { AdminModule } from './modules/admin/admin.module';
import { VideoAssetsModule } from './modules/video-assets/video-assets.module';
import { WatchHistoryModule } from './modules/watch-history/watch-history.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { HealthModule } from './modules/health/health.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PublicModule } from './modules/public/public.module';
import { UperaModule } from './modules/upera/upera.module';
import { TMDBAdminModule } from './modules/tmdb/tmdb-admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<CacheModuleOptions> => {
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost');
        const redisPort = configService.get<number>('REDIS_PORT', 6379);
        const ttl = configService.get<number>('CACHE_TTL', 60);

        try {
          const store = (await redisStore({
            socket: {
              host: redisHost,
              port: redisPort,
            },
            ttl,
          })) as unknown as CacheStore;

          return {
            store,
            ttl,
          };
        } catch (error) {
          console.warn('Redis connection failed, falling back to in-memory cache:', error.message);
          return {
            ttl,
          };
        }
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<ThrottlerModuleOptions> => [
        {
          name: 'global',
          ttl: configService.get<number>('THROTTLE_TTL', 60),
          limit: configService.get<number>('THROTTLE_LIMIT', 10),
        },
      ],
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ContentModule,
    AdminModule,
    VideoAssetsModule,
    WatchHistoryModule,
    WatchlistModule,
    JobsModule,
    HealthModule,
    NotificationsModule,
    AnalyticsModule,
    PublicModule,
    UperaModule,
    TMDBAdminModule,
  ],
})
export class AppModule {}
