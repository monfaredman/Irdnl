import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WatchHistoryService } from './watch-history.service';
import { RecordProgressDto } from './dto/record-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('watch-history')
@Controller('user/history')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class WatchHistoryController {
  constructor(private readonly watchHistoryService: WatchHistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Record watch progress' })
  @ApiResponse({ status: 201, description: 'Progress recorded' })
  async recordProgress(
    @CurrentUser() user: User,
    @Body() recordProgressDto: RecordProgressDto,
  ) {
    return this.watchHistoryService.recordProgress(
      user.id,
      recordProgressDto.content_id,
      recordProgressDto.progress_seconds,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get user watch history' })
  @ApiResponse({ status: 200, description: 'Watch history retrieved' })
  async getHistory(@CurrentUser() user: User) {
    return this.watchHistoryService.getUserHistory(user.id);
  }
}

