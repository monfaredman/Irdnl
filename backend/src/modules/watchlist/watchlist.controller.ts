import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';
import { WatchlistDto } from './dto/watchlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('watchlist')
@Controller('user/watchlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add content to watchlist' })
  @ApiResponse({ status: 201, description: 'Added to watchlist' })
  async addToWatchlist(
    @CurrentUser() user: User,
    @Body() watchlistDto: WatchlistDto,
  ) {
    return this.watchlistService.addToWatchlist(
      user.id,
      watchlistDto.content_id,
    );
  }

  @Delete(':contentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove content from watchlist' })
  @ApiResponse({ status: 204, description: 'Removed from watchlist' })
  async removeFromWatchlist(
    @CurrentUser() user: User,
    @Param('contentId') contentId: string,
  ) {
    await this.watchlistService.removeFromWatchlist(user.id, contentId);
  }

  @Get()
  @ApiOperation({ summary: 'Get user watchlist' })
  @ApiResponse({ status: 200, description: 'Watchlist retrieved' })
  async getWatchlist(@CurrentUser() user: User) {
    return this.watchlistService.getUserWatchlist(user.id);
  }
}

