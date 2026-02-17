import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { ElasticsearchService } from './elasticsearch.service';
import { Content } from '../content/entities/content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
  ],
  controllers: [SearchController],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class SearchModule {}
