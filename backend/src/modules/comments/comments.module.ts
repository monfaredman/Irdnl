import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import {
  CommentsAdminController,
  CommentsPublicController,
} from './comments.controller';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentsAdminController, CommentsPublicController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
