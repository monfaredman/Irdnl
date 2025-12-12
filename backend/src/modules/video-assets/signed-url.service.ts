import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class SignedUrlService {
  private secret: string;
  private ttl: number;

  constructor(private configService: ConfigService) {
    this.secret = this.configService.get<string>(
      'SIGNED_URL_SECRET',
      'default-secret-key',
    );
    this.ttl = this.configService.get<number>('SIGNED_URL_TTL', 3600);
  }

  generate(url: string, expiresIn?: number): string {
    const expires = Math.floor(Date.now() / 1000) + (expiresIn || this.ttl);
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(`${url}${expires}`)
      .digest('hex');

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}expires=${expires}&signature=${signature}`;
  }

  verify(signedUrl: string): boolean {
    try {
      const url = new URL(signedUrl);
      const expires = parseInt(url.searchParams.get('expires') || '0', 10);
      const signature = url.searchParams.get('signature') || '';

      if (expires < Math.floor(Date.now() / 1000)) {
        return false; // Expired
      }

      // Remove signature and expires from URL for verification
      url.searchParams.delete('signature');
      url.searchParams.delete('expires');
      const baseUrl = url.toString();

      const expectedSignature = crypto
        .createHmac('sha256', this.secret)
        .update(`${baseUrl}${expires}`)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    } catch {
      return false;
    }
  }
}

