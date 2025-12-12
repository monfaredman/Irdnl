import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}

