import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistsService } from './playlists.service';
import {
  UserPlaylistsController,
  PublicPlaylistsController,
  AdminPlaylistsController,
} from './playlists.controller';
import { Playlist, PlaylistItem, PlaylistLike } from './entities/playlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, PlaylistItem, PlaylistLike])],
  controllers: [UserPlaylistsController, PublicPlaylistsController, AdminPlaylistsController],
  providers: [PlaylistsService],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
