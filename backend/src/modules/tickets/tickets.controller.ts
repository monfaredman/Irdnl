import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, AdminReplyTicketDto, UpdateTicketStatusDto } from './dto/ticket.dto';
import { TicketStatus } from './entities/ticket.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

// ============ User Tickets Controller ============
@ApiTags('user-tickets')
@Controller('user/tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserTicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created' })
  async createTicket(@CurrentUser() user: User, @Body() dto: CreateTicketDto) {
    return this.ticketsService.createTicket(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets for current user' })
  @ApiResponse({ status: 200, description: 'User tickets retrieved' })
  async getMyTickets(@CurrentUser() user: User) {
    return this.ticketsService.getUserTickets(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific ticket' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved' })
  async getTicket(@CurrentUser() user: User, @Param('id') id: string) {
    return this.ticketsService.getUserTicket(user.id, id);
  }
}

// ============ Admin Tickets Controller ============
@ApiTags('admin-tickets')
@Controller('admin/tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER, UserRole.VIEWER)
export class AdminTicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tickets (admin)' })
  @ApiResponse({ status: 200, description: 'All tickets retrieved' })
  @ApiQuery({ name: 'status', required: false, enum: TicketStatus })
  async getAllTickets(@Query('status') status?: TicketStatus) {
    return this.ticketsService.getAllTickets(status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get ticket statistics' })
  @ApiResponse({ status: 200, description: 'Ticket stats retrieved' })
  async getStats() {
    return this.ticketsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific ticket (admin)' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved' })
  async getTicket(@Param('id') id: string) {
    return this.ticketsService.getTicketById(id);
  }

  @Put(':id/reply')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @ApiOperation({ summary: 'Reply to a ticket' })
  @ApiResponse({ status: 200, description: 'Reply sent' })
  async replyToTicket(@Param('id') id: string, @Body() dto: AdminReplyTicketDto) {
    return this.ticketsService.adminReply(id, dto);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @ApiOperation({ summary: 'Update ticket status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateTicketStatusDto) {
    return this.ticketsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a ticket' })
  @ApiResponse({ status: 204, description: 'Ticket deleted' })
  async deleteTicket(@Param('id') id: string) {
    await this.ticketsService.deleteTicket(id);
  }
}
