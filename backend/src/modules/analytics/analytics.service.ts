import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Content, ContentStatus } from '../content/entities/content.entity';
import { Subscription, SubscriptionStatus } from '../users/entities/subscription.entity';
import { WatchHistory } from '../watch-history/entities/watch-history.entity';
import { VideoAsset } from '../video-assets/entities/video-asset.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(WatchHistory)
    private watchHistoryRepository: Repository<WatchHistory>,
    @InjectRepository(VideoAsset)
    private videoAssetRepository: Repository<VideoAsset>,
  ) {}

  async getDashboard() {
    const [
      totalUsers,
      activeUsers,
      totalContent,
      publishedContent,
      totalSubscriptions,
      activeSubscriptions,
      totalWatchHistory,
      totalBandwidth,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.contentRepository.count(),
      this.contentRepository.count({ where: { status: ContentStatus.PUBLISHED } }),
      this.subscriptionRepository.count(),
      this.subscriptionRepository.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      this.watchHistoryRepository.count(),
      this.getTotalBandwidth(),
    ]);

    // Daily active users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyActiveUsers = await this.watchHistoryRepository
      .createQueryBuilder('wh')
      .select('DATE(wh.created_at)', 'date')
      .addSelect('COUNT(DISTINCT wh.user_id)', 'count')
      .where('wh.created_at >= :date', { date: thirtyDaysAgo })
      .groupBy('DATE(wh.created_at)')
      .orderBy('DATE(wh.created_at)', 'DESC')
      .getRawMany();

    // Top performing content
    const topContent = await this.watchHistoryRepository
      .createQueryBuilder('wh')
      .select('wh.content_id', 'contentId')
      .addSelect('COUNT(*)', 'views')
      .groupBy('wh.content_id')
      .orderBy('views', 'DESC')
      .limit(10)
      .getRawMany();

    const contentIds = topContent.map((item) => item.contentId);
    const contentDetails =
      contentIds.length > 0 ? await this.contentRepository.findBy({ id: contentIds as any }) : [];

    const topPerformingContent = topContent.map((item) => {
      const content = contentDetails.find((c) => c.id === item.contentId);
      return {
        contentId: item.contentId,
        title: content?.title || 'Unknown',
        views: parseInt(item.views, 10),
      };
    });

    // Monthly growth
    const monthlyGrowth = await this.getMonthlyGrowth();

    // Subscription revenue (mock - replace with actual payment data)
    const subscriptionRevenue = await this.getSubscriptionRevenue();

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        dailyActive: dailyActiveUsers,
      },
      content: {
        total: totalContent,
        published: publishedContent,
        topPerforming: topPerformingContent,
      },
      subscriptions: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        revenue: subscriptionRevenue,
      },
      bandwidth: {
        total: totalBandwidth,
        unit: 'GB',
      },
      watchHistory: {
        totalEntries: totalWatchHistory,
      },
      growth: monthlyGrowth,
    };
  }

  private async getTotalBandwidth(): Promise<number> {
    const result = await this.videoAssetRepository
      .createQueryBuilder('va')
      .select('SUM(va.filesize)', 'total')
      .getRawOne();

    // Convert bytes to GB
    return result?.total ? Math.round((result.total / (1024 * 1024 * 1024)) * 100) / 100 : 0;
  }

  private async getMonthlyGrowth() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await this.userRepository
      .createQueryBuilder('user')
      .select("TO_CHAR(user.created_at, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('user.created_at >= :date', { date: sixMonthsAgo })
      .groupBy("TO_CHAR(user.created_at, 'YYYY-MM')")
      .orderBy("TO_CHAR(user.created_at, 'YYYY-MM')", 'ASC')
      .getRawMany();

    const contentGrowth = await this.contentRepository
      .createQueryBuilder('content')
      .select("TO_CHAR(content.created_at, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('content.created_at >= :date', { date: sixMonthsAgo })
      .groupBy("TO_CHAR(content.created_at, 'YYYY-MM')")
      .orderBy("TO_CHAR(content.created_at, 'YYYY-MM')", 'ASC')
      .getRawMany();

    return {
      users: userGrowth,
      content: contentGrowth,
    };
  }

  private async getSubscriptionRevenue(): Promise<number> {
    // Mock revenue calculation - replace with actual payment integration
    const activeSubs = await this.subscriptionRepository.find({
      where: { status: SubscriptionStatus.ACTIVE },
    });

    // Assuming average subscription price of $9.99/month
    return activeSubs.length * 9.99;
  }
}

