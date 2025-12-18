import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from './entities/watchlist.entity';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private watchlistRepository: Repository<Watchlist>,
  ) {}

  async addToWatchlist(userId: string, contentId: string): Promise<Watchlist> {
    const existing = await this.watchlistRepository.findOne({
      where: { userId, contentId },
    });

    if (existing) {
      return existing;
    }

    const watchlist = this.watchlistRepository.create({
      userId,
      contentId,
    });

    return this.watchlistRepository.save(watchlist);
  }

  async removeFromWatchlist(userId: string, contentId: string): Promise<void> {
    const watchlist = await this.watchlistRepository.findOne({
      where: { userId, contentId },
    });

    if (!watchlist) {
      throw new NotFoundException('Item not in watchlist');
    }

    await this.watchlistRepository.remove(watchlist);
  }

  async getUserWatchlist(userId: string): Promise<Watchlist[]> {
    return this.watchlistRepository.find({
      where: { userId },
      relations: ['content'],
      order: { createdAt: 'DESC' },
    });
  }
}
