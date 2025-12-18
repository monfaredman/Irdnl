import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus, JobType } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(type: JobType, payload: Record<string, any>): Promise<Job> {
    const job = this.jobRepository.create({
      type,
      payload,
      status: JobStatus.PENDING,
    });
    return this.jobRepository.save(job);
  }

  async findPending(): Promise<Job[]> {
    return this.jobRepository.find({
      where: { status: JobStatus.PENDING },
      order: { createdAt: 'ASC' },
      take: 10,
    });
  }

  async updateStatus(id: string, status: JobStatus, error?: string): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id } });
    if (!job) {
      throw new Error(`Job ${id} not found`);
    }

    job.status = status;
    if (error) {
      job.error = error;
    }

    return this.jobRepository.save(job);
  }
}
