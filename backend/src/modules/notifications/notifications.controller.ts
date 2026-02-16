import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ListNotificationsDto } from './dto/list-notifications.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

// ========================================================================
// Admin Notifications Controller
// ========================================================================
@ApiTags('admin/notifications')
@Controller('admin/notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send notification (admin only)' })
  @ApiResponse({ status: 201, description: 'Notification sent' })
  async create(@Body() createNotificationDto: CreateNotificationDto, @CurrentUser() user: User) {
    return this.notificationsService.create(createNotificationDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List notifications (admin only)' })
  @ApiResponse({ status: 200, description: 'Notifications list' })
  async findAll(@Query() listNotificationsDto: ListNotificationsDto) {
    return this.notificationsService.findAll(listNotificationsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Notification details' })
  async findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }
}

// ========================================================================
// User Notifications Controller
// ========================================================================
@ApiTags('user/notifications')
@Controller('user/notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserNotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  @ApiResponse({ status: 200, description: 'User notifications list' })
  async getMyNotifications(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.notificationsService.findForUser(
      user.id,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Put('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@CurrentUser() user: User) {
    await this.notificationsService.markAllAsRead(user.id);
    return { success: true };
  }

  @Put(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markAsRead(@CurrentUser() user: User, @Param('id') id: string) {
    await this.notificationsService.markAsRead(id, user.id);
    return { success: true };
  }
}
