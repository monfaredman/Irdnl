import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TMDBAdminController } from './tmdb-admin.controller';
import { TMDBAdminService } from './tmdb-admin.service';
import { TMDBSavedContent } from './entities/tmdb-saved-content.entity';
import { ContentModule } from '../content/content.module';
import { Content } from '../content/entities/content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TMDBSavedContent, Content]),
    ContentModule,
  ],
  controllers: [TMDBAdminController],
  providers: [TMDBAdminService],
  exports: [TMDBAdminService],
})
export class TMDBAdminModule {}
