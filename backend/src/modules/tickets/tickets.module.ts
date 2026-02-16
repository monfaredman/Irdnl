import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { UserTicketsController, AdminTicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  controllers: [UserTicketsController, AdminTicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
