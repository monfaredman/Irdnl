import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { TMDBService } from './tmdb.service';
import { Content } from './entities/content.entity';
import { Series } from './entities/series.entity';
import { Season } from './entities/season.entity';
import { Episode } from './entities/episode.entity';
import { VideoAsset } from '../video-assets/entities/video-asset.entity';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // TMDB-only proxy configuration
        // Default: http://127.0.0.1:12334
        const enabled = configService.get<string>('TMDB_PROXY_ENABLED', 'true') === 'true';
        const host = configService.get<string>('TMDB_PROXY_HOST', '127.0.0.1');
        const port = configService.get<number>('TMDB_PROXY_PORT', 12334);
        const protocol = configService.get<string>('TMDB_PROXY_PROTOCOL', 'http');
        const username = configService.get<string>('TMDB_PROXY_USERNAME');
        const password = configService.get<string>('TMDB_PROXY_PASSWORD');

        // Allow disabling in production unless explicitly enabled
        const nodeEnv = configService.get<string>('NODE_ENV', 'development');
        const allowInProd =
          configService.get<string>('TMDB_PROXY_ALLOW_IN_PROD', 'false') === 'true';
        const shouldUseProxy = enabled && (nodeEnv !== 'production' || allowInProd);

        return {
          timeout: configService.get<number>('TMDB_HTTP_TIMEOUT_MS', 10000),
          maxRedirects: 3,
          // Only affects requests made through this HttpService instance
          proxy: shouldUseProxy
            ? {
                protocol,
                host,
                port,
                auth:
                  username && password
                    ? {
                        username,
                        password,
                      }
                    : undefined,
              }
            : false,
        };
      },
    }),
    TypeOrmModule.forFeature([Content, Series, Season, Episode, VideoAsset]),
  ],
  controllers: [ContentController],
  providers: [ContentService, TMDBService],
  exports: [ContentService, TMDBService],
})
export class ContentModule {}
