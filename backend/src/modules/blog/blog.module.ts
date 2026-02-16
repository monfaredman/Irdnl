import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './blog.service';
import { BlogAdminController, BlogPublicController } from './blog.controller';
import { BlogPost } from './entities/blog-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost])],
  controllers: [BlogAdminController, BlogPublicController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
