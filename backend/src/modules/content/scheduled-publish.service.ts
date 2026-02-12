import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Content, ContentStatus } from './entities/content.entity';

@Injectable()
export class ScheduledPublishService {
  private readonly logger = new Logger(ScheduledPublishService.name);

  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  /**
   * Check for scheduled content every minute and publish if the time has come
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledPublishing() {
    try {
      const now = new Date();
      
      // Find all scheduled content where publish date has passed
      const contentToPublish = await this.contentRepository.find({
        where: {
          status: ContentStatus.SCHEDULED,
          publishDate: LessThanOrEqual(now),
        },
      });

      if (contentToPublish.length === 0) {
        return;
      }

      this.logger.log(
        `Found ${contentToPublish.length} content item(s) ready to publish`,
      );

      // Publish all content that's due
      for (const content of contentToPublish) {
        try {
          content.status = ContentStatus.PUBLISHED;
          await this.contentRepository.save(content);
          
          this.logger.log(
            `Published content: ${content.title} (ID: ${content.id})`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to publish content ${content.id}: ${error.message}`,
            error.stack,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error in scheduled publishing: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Check for content that should be unpublished (availability_end has passed)
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleScheduledUnpublishing() {
    try {
      const now = new Date();
      
      // Find all published content where availability_end has passed
      const contentToUnpublish = await this.contentRepository.find({
        where: {
          status: ContentStatus.PUBLISHED,
          availabilityEnd: LessThanOrEqual(now),
        },
      });

      if (contentToUnpublish.length === 0) {
        return;
      }

      this.logger.log(
        `Found ${contentToUnpublish.length} content item(s) to unpublish`,
      );

      // Unpublish all content that's expired
      for (const content of contentToUnpublish) {
        try {
          content.status = ContentStatus.UNPUBLISHED;
          await this.contentRepository.save(content);
          
          this.logger.log(
            `Unpublished content: ${content.title} (ID: ${content.id})`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to unpublish content ${content.id}: ${error.message}`,
            error.stack,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error in scheduled unpublishing: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Manually trigger publishing check (useful for testing)
   */
  async triggerPublishCheck() {
    await this.handleScheduledPublishing();
  }

  /**
   * Get upcoming scheduled content
   */
  async getUpcomingScheduled(limit = 10): Promise<Content[]> {
    return this.contentRepository.find({
      where: {
        status: ContentStatus.SCHEDULED,
      },
      order: {
        publishDate: 'ASC',
      },
      take: limit,
    });
  }
}
