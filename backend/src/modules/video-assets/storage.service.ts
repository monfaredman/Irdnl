import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface StorageAdapter {
  upload(file: Express.Multer.File, contentId: string, quality: string): Promise<string>;
  delete(filePath: string): Promise<void>;
  getUrl(filePath: string): Promise<string>;
}

@Injectable()
export class LocalStorageAdapter implements StorageAdapter {
  constructor(private configService: ConfigService) {}

  async upload(
    file: Express.Multer.File,
    contentId: string,
    quality: string,
  ): Promise<string> {
    const storagePath =
      this.configService.get<string>('STORAGE_LOCAL_PATH') || './storage';
    const uploadDir = path.join(storagePath, contentId, quality);

    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = file.originalname;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    return filePath;
  }

  async delete(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, ignore
    }
  }

  async getUrl(filePath: string): Promise<string> {
    // For local storage, return a relative path or full URL
    // In production, this would be a CDN URL
    return `/media/${filePath}`;
  }
}

// TODO: Implement S3StorageAdapter for production
@Injectable()
export class S3StorageAdapter implements StorageAdapter {
  async upload(
    file: Express.Multer.File,
    contentId: string,
    quality: string,
  ): Promise<string> {
    // TODO: Implement S3 upload
    throw new Error('S3 storage not implemented yet');
  }

  async delete(filePath: string): Promise<void> {
    // TODO: Implement S3 delete
    throw new Error('S3 storage not implemented yet');
  }

  async getUrl(filePath: string): Promise<string> {
    // TODO: Implement S3 URL generation
    throw new Error('S3 storage not implemented yet');
  }
}

@Injectable()
export class StorageService {
  private adapter: StorageAdapter;

  constructor(private configService: ConfigService) {
    const storageType = this.configService.get<string>('STORAGE_TYPE', 'local');
    if (storageType === 's3') {
      this.adapter = new S3StorageAdapter();
    } else {
      this.adapter = new LocalStorageAdapter(configService);
    }
  }

  async upload(
    file: Express.Multer.File,
    contentId: string,
    quality: string,
  ): Promise<string> {
    return this.adapter.upload(file, contentId, quality);
  }

  async delete(filePath: string): Promise<void> {
    return this.adapter.delete(filePath);
  }

  async getUrl(filePath: string): Promise<string> {
    return this.adapter.getUrl(filePath);
  }
}

