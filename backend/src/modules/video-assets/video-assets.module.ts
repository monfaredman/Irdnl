import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoAsset } from './entities/video-asset.entity';
import { StorageService } from './storage.service';
import { SignedUrlService } from './signed-url.service';
import { LocalStorageAdapter } from './storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideoAsset])],
  providers: [StorageService, SignedUrlService, LocalStorageAdapter],
  exports: [StorageService, SignedUrlService],
})
export class VideoAssetsModule {}

