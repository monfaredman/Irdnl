import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UperaController } from './upera.controller';
import { UperaService } from './upera.service';
import { UperaContent } from './entities/upera-content.entity';
import { Content } from '../content/entities/content.entity';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get<number>('UPERA_HTTP_TIMEOUT_MS', 15000),
        maxRedirects: 3,
      }),
    }),
    TypeOrmModule.forFeature([UperaContent, Content]),
    ContentModule,
  ],
  controllers: [UperaController],
  providers: [UperaService],
  exports: [UperaService],
})
export class UperaModule {}
