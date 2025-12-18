import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchHistory } from './entities/watch-history.entity';
import { User } from '../users/entities/user.entity';
import { Content } from '../content/entities/content.entity';

@Injectable()
export class WatchHistoryService {
  constructor(
    @InjectRepository(WatchHistory)
    private watchHistoryRepository: Repository<WatchHistory>,
  ) {}

  async recordProgress(
    userId: string,
    contentId: string,
    progressSeconds: number,
  ): Promise<WatchHistory> {
    let watchHistory = await this.watchHistoryRepository.findOne({
      where: { userId, contentId },
    });

    if (watchHistory) {
      watchHistory.progressSeconds = progressSeconds;
    } else {
      watchHistory = this.watchHistoryRepository.create({
        userId,
        contentId,
        progressSeconds,
      });
    }

    return this.watchHistoryRepository.save(watchHistory);
  }

  async getUserHistory(userId: string): Promise<WatchHistory[]> {
    return this.watchHistoryRepository.find({
      where: { userId },
      relations: ['content'],
      order: { updatedAt: 'DESC' },
    });
  }
}
