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
