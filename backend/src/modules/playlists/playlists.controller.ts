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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlaylistsService } from './playlists.service';
import {
  CreatePlaylistDto,
  UpdatePlaylistDto,
  AddPlaylistItemDto,
  ReorderPlaylistItemsDto,
} from './dto/playlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

// ========================================================================
// User Playlists Controller
// ========================================================================
@ApiTags('user/playlists')
@Controller('user/playlists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserPlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new playlist' })
  async create(@CurrentUser() user: User, @Body() dto: CreatePlaylistDto) {
    return this.playlistsService.createPlaylist(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my playlists' })
  async getMyPlaylists(@CurrentUser() user: User) {
    return this.playlistsService.getMyPlaylists(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get playlist by ID' })
  async getPlaylist(@CurrentUser() user: User, @Param('id') id: string) {
    return this.playlistsService.getPlaylistById(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update playlist' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.updatePlaylist(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete playlist' })
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
    await this.playlistsService.deletePlaylist(id, user.id);
  }

  // ─── Items ──────────────────────────────────────────────

  @Post(':id/items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add content to playlist' })
  async addItem(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: AddPlaylistItemDto,
  ) {
    return this.playlistsService.addItem(id, user.id, dto);
  }

  @Delete(':id/items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove item from playlist' })
  async removeItem(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    await this.playlistsService.removeItem(id, user.id, itemId);
  }

  @Put(':id/reorder')
  @ApiOperation({ summary: 'Reorder playlist items' })
  async reorder(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: ReorderPlaylistItemsDto,
  ) {
    await this.playlistsService.reorderItems(id, user.id, dto.itemIds);
    return { success: true };
  }

  // ─── Like & Share ─────────────────────────────────────────

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on playlist' })
  async toggleLike(@CurrentUser() user: User, @Param('id') id: string) {
    return this.playlistsService.toggleLike(id, user.id);
  }

  @Post(':id/share')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record a share for playlist' })
  async share(@Param('id') id: string) {
    const shareCount = await this.playlistsService.incrementShareCount(id);
    return { shareCount };
  }
}

// ========================================================================
// Public Playlists (no auth required for browsing)
// ========================================================================
@ApiTags('playlists')
@Controller('playlists')
export class PublicPlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  @ApiOperation({ summary: 'Browse public playlists' })
  async getPublicPlaylists(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.playlistsService.getPublicPlaylists(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public playlist by ID' })
  async getPlaylist(@Param('id') id: string) {
    return this.playlistsService.getPlaylistById(id);
  }
}

// ========================================================================
// Admin Playlists Controller
// ========================================================================
@ApiTags('admin/playlists')
@Controller('admin/playlists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  @ApiOperation({ summary: 'List all playlists (admin)' })
  async getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.playlistsService.getAllPlaylists(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete playlist (admin)' })
  async delete(@Param('id') id: string) {
    await this.playlistsService.adminDeletePlaylist(id);
  }
}
