import { Injectable } from '@nestjs/common';
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
}

