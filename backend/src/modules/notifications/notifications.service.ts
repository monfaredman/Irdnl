import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ListNotificationsDto } from './dto/list-notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
    sentBy?: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      sentBy,
    });

    // TODO: Actually send notification (email/push service integration)
    // For now, mark as sent immediately
    notification.isSent = true;
    notification.sentAt = new Date();

    return this.notificationRepository.save(notification);
  }

  async findAll(
    listNotificationsDto: ListNotificationsDto,
  ): Promise<{ data: Notification[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, type } = listNotificationsDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.notificationRepository.createQueryBuilder('notification');

    if (type) {
      queryBuilder.where('notification.type = :type', { type });
    }

    const [data, total] = await queryBuilder
      .orderBy('notification.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Notification> {
    return this.notificationRepository.findOne({ where: { id } });
  }

  /**
   * Get notifications for a specific user (or broadcast notifications where userId is null)
   */
  async findForUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Notification[]; total: number; unreadCount: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.notificationRepository.createQueryBuilder('notification');
    queryBuilder.where(
      '(notification.user_id = :userId OR notification.user_id IS NULL)',
      { userId },
    );

    const [data, total] = await queryBuilder
      .orderBy('notification.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const unreadCount = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('(notification.user_id = :userId OR notification.user_id IS NULL)', { userId })
      .andWhere('notification.is_read = false')
      .getCount();

    return { data, total, unreadCount, page, limit };
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id, userId },
      { isRead: true },
    );
    // Also mark broadcast notifications as read for this user
    // For broadcast (userId IS NULL), we can't update per-user. 
    // A simple approach: update if it belongs to user or is broadcast
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('id = :id', { id })
      .andWhere('(user_id = :userId OR user_id IS NULL)', { userId })
      .execute();
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('(user_id = :userId OR user_id IS NULL)', { userId })
      .execute();
  }

  /**
   * Delete a notification (admin only).
   * This removes the notification from the database,
   * so it will no longer appear in any user's notification list.
   */
  async delete(id: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    await this.notificationRepository.remove(notification);
  }
}
