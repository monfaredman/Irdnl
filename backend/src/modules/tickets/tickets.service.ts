import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { CreateTicketDto, AdminReplyTicketDto, UpdateTicketStatusDto } from './dto/ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  // User: create ticket
  async createTicket(userId: string, dto: CreateTicketDto): Promise<Ticket> {
    const ticket = this.ticketRepository.create({
      ...dto,
      userId,
      status: TicketStatus.OPEN,
    });
    return this.ticketRepository.save(ticket);
  }

  // User: get own tickets
  async getUserTickets(userId: string): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // User: get single ticket (must own it)
  async getUserTicket(userId: string, ticketId: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
    });
    if (!ticket) {
      throw new NotFoundException('تیکت یافت نشد');
    }
    if (ticket.userId !== userId) {
      throw new ForbiddenException('دسترسی غیرمجاز');
    }
    return ticket;
  }

  // Admin: get all tickets
  async getAllTickets(status?: TicketStatus): Promise<{ tickets: Ticket[]; total: number }> {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    const [tickets, total] = await this.ticketRepository.findAndCount({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return { tickets, total };
  }

  // Admin: get single ticket
  async getTicketById(ticketId: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['user'],
    });
    if (!ticket) {
      throw new NotFoundException('تیکت یافت نشد');
    }
    return ticket;
  }

  // Admin: reply to ticket
  async adminReply(ticketId: string, dto: AdminReplyTicketDto): Promise<Ticket> {
    const ticket = await this.getTicketById(ticketId);
    ticket.adminReply = dto.adminReply;
    ticket.adminReplyAt = new Date();
    ticket.status = dto.status || TicketStatus.ANSWERED;
    return this.ticketRepository.save(ticket);
  }

  // Admin: update ticket status
  async updateStatus(ticketId: string, dto: UpdateTicketStatusDto): Promise<Ticket> {
    const ticket = await this.getTicketById(ticketId);
    ticket.status = dto.status;
    return this.ticketRepository.save(ticket);
  }

  // Admin: delete ticket
  async deleteTicket(ticketId: string): Promise<void> {
    const ticket = await this.getTicketById(ticketId);
    await this.ticketRepository.remove(ticket);
  }

  // Admin: get ticket stats
  async getStats(): Promise<{
    total: number;
    open: number;
    inProgress: number;
    answered: number;
    closed: number;
  }> {
    const total = await this.ticketRepository.count();
    const open = await this.ticketRepository.count({ where: { status: TicketStatus.OPEN } });
    const inProgress = await this.ticketRepository.count({ where: { status: TicketStatus.IN_PROGRESS } });
    const answered = await this.ticketRepository.count({ where: { status: TicketStatus.ANSWERED } });
    const closed = await this.ticketRepository.count({ where: { status: TicketStatus.CLOSED } });
    return { total, open, inProgress, answered, closed };
  }
}
