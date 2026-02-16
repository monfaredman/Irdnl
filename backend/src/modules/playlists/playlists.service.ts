import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Playlist, PlaylistItem, PlaylistLike } from './entities/playlist.entity';
import { CreatePlaylistDto, UpdatePlaylistDto, AddPlaylistItemDto } from './dto/playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(PlaylistItem)
    private playlistItemRepository: Repository<PlaylistItem>,
    @InjectRepository(PlaylistLike)
    private playlistLikeRepository: Repository<PlaylistLike>,
  ) {}

  // ─── User's own playlists ─────────────────────────────────

  async createPlaylist(userId: string, dto: CreatePlaylistDto): Promise<Playlist> {
    const playlist = this.playlistRepository.create({
      ...dto,
      userId,
    });
    return this.playlistRepository.save(playlist);
  }

  async getMyPlaylists(userId: string): Promise<Playlist[]> {
    return this.playlistRepository.find({
      where: { userId },
      relations: ['items', 'items.content'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getPlaylistById(id: string, userId?: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: ['items', 'items.content', 'user'],
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    // If not public and not the owner, deny
    if (!playlist.isPublic && playlist.userId !== userId) {
      throw new ForbiddenException('This playlist is private');
    }

    return playlist;
  }

  async updatePlaylist(id: string, userId: string, dto: UpdatePlaylistDto): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({ where: { id, userId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    Object.assign(playlist, dto);
    return this.playlistRepository.save(playlist);
  }

  async deletePlaylist(id: string, userId: string): Promise<void> {
    const playlist = await this.playlistRepository.findOne({ where: { id, userId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    await this.playlistRepository.remove(playlist);
  }

  // ─── Playlist Items ───────────────────────────────────────

  async addItem(playlistId: string, userId: string, dto: AddPlaylistItemDto): Promise<PlaylistItem> {
    const playlist = await this.playlistRepository.findOne({ where: { id: playlistId, userId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    // Check if already in playlist
    const existing = await this.playlistItemRepository.findOne({
      where: { playlistId, contentId: dto.contentId },
    });
    if (existing) {
      throw new BadRequestException('Content already in playlist');
    }

    // Get max sort order
    const maxOrder = await this.playlistItemRepository
      .createQueryBuilder('item')
      .select('MAX(item.sort_order)', 'max')
      .where('item.playlist_id = :playlistId', { playlistId })
      .getRawOne();

    const item = this.playlistItemRepository.create({
      playlistId,
      contentId: dto.contentId,
      note: dto.note,
      sortOrder: dto.sortOrder ?? (maxOrder?.max ?? 0) + 1,
    });

    return this.playlistItemRepository.save(item);
  }

  async removeItem(playlistId: string, userId: string, itemId: string): Promise<void> {
    const playlist = await this.playlistRepository.findOne({ where: { id: playlistId, userId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const item = await this.playlistItemRepository.findOne({ where: { id: itemId, playlistId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await this.playlistItemRepository.remove(item);
  }

  async reorderItems(playlistId: string, userId: string, itemIds: string[]): Promise<void> {
    const playlist = await this.playlistRepository.findOne({ where: { id: playlistId, userId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    // Update sort_order for each item
    for (let i = 0; i < itemIds.length; i++) {
      await this.playlistItemRepository.update(
        { id: itemIds[i], playlistId },
        { sortOrder: i },
      );
    }
  }

  // ─── Likes ────────────────────────────────────────────────

  async toggleLike(playlistId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    const playlist = await this.playlistRepository.findOne({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const existingLike = await this.playlistLikeRepository.findOne({
      where: { playlistId, userId },
    });

    if (existingLike) {
      await this.playlistLikeRepository.remove(existingLike);
      playlist.likeCount = Math.max(0, playlist.likeCount - 1);
      await this.playlistRepository.save(playlist);
      return { liked: false, likeCount: playlist.likeCount };
    }

    const like = this.playlistLikeRepository.create({ playlistId, userId });
    await this.playlistLikeRepository.save(like);
    playlist.likeCount += 1;
    await this.playlistRepository.save(playlist);
    return { liked: true, likeCount: playlist.likeCount };
  }

  async isLiked(playlistId: string, userId: string): Promise<boolean> {
    const like = await this.playlistLikeRepository.findOne({
      where: { playlistId, userId },
    });
    return !!like;
  }

  // ─── Share count ──────────────────────────────────────────

  async incrementShareCount(playlistId: string): Promise<number> {
    const playlist = await this.playlistRepository.findOne({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    playlist.shareCount += 1;
    await this.playlistRepository.save(playlist);
    return playlist.shareCount;
  }

  // ─── Public playlists (browsing) ──────────────────────────

  async getPublicPlaylists(page = 1, limit = 20): Promise<{ data: Playlist[]; total: number }> {
    const [data, total] = await this.playlistRepository.findAndCount({
      where: { isPublic: true },
      relations: ['items', 'items.content', 'user'],
      order: { likeCount: 'DESC', updatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  // ─── Admin: all playlists ─────────────────────────────────

  async getAllPlaylists(page = 1, limit = 20): Promise<{ data: Playlist[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.playlistRepository.findAndCount({
      relations: ['items', 'items.content', 'user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async adminDeletePlaylist(id: string): Promise<void> {
    const playlist = await this.playlistRepository.findOne({ where: { id } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    await this.playlistRepository.remove(playlist);
  }
}
