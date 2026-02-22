import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { Category } from '../content/entities/category.entity';
import { Collection } from '../content/entities/collection.entity';
import { Content } from '../content/entities/content.entity';
import { Genre } from '../content/entities/genre.entity';
import { Slider } from '../content/entities/slider.entity';
import { Offer } from '../content/entities/offer.entity';
import { Pin } from '../content/entities/pin.entity';
import { PlayTable } from '../content/entities/play-table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Collection, Content, Genre, Slider, Offer, Pin, PlayTable]),
  ],
  controllers: [PublicController],
  providers: [PublicService],
  exports: [PublicService],
})
export class PublicModule {}
