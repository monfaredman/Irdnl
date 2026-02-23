/**
 * Migrate local storage files to DigitalOcean Spaces.
 *
 * Recursively walks `backend/storage/` and uploads every file to
 * the configured Space under the `content/` prefix.
 *
 * Usage:
 *   # Set credentials first (or put them in .env.local)
 *   export DO_SPACES_KEY="..."
 *   export DO_SPACES_SECRET="..."
 *   npx ts-node scripts/migrate-storage-to-spaces.ts
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load env files in the same order as NestJS ConfigModule
config({ path: '.env' });
config({ path: '.env.local', override: true });

// ── S3 Client ──────────────────────────────────────────────────────────────

const s3Client = new S3Client({
  endpoint:
    process.env.DO_SPACES_ENDPOINT || 'https://sgp1.digitaloceanspaces.com',
  region: process.env.DO_SPACES_REGION || 'sgp1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET || '',
  },
  forcePathStyle: false,
});

const BUCKET = process.env.DO_SPACES_BUCKET || 'irdnl-storage';
const STORAGE_DIR = path.resolve(__dirname, '..', 'storage');

// ── MIME types ──────────────────────────────────────────────────────────────

const CONTENT_TYPES: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.srt': 'text/plain',
  '.vtt': 'text/vtt',
  '.json': 'application/json',
};

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}

function getCacheControl(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (['.mp4', '.webm', '.mkv', '.avi', '.mov'].includes(ext)) {
    return 'public, max-age=31536000'; // 1 year for videos
  }
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
    return 'public, max-age=2592000'; // 30 days for images
  }
  return 'public, max-age=86400'; // 1 day default
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function walkDir(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function objectExists(key: string): Promise<boolean> {
  try {
    await s3Client.send(
      new HeadObjectCommand({ Bucket: BUCKET, Key: key }),
    );
    return true;
  } catch {
    return false;
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function migrate() {
  // Validate credentials
  if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET) {
    console.error(
      '❌  Missing credentials. Set DO_SPACES_KEY and DO_SPACES_SECRET.',
    );
    process.exit(1);
  }

  if (!fs.existsSync(STORAGE_DIR)) {
    console.error(`❌  Storage directory not found: ${STORAGE_DIR}`);
    process.exit(1);
  }

  const files = walkDir(STORAGE_DIR);
  console.log(`📁 Found ${files.length} files in ${STORAGE_DIR}\n`);

  if (files.length === 0) {
    console.log('Nothing to migrate.');
    return;
  }

  const skipExisting = process.argv.includes('--skip-existing');
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  let totalBytes = 0;

  for (const filePath of files) {
    const relativePath = path.relative(STORAGE_DIR, filePath);
    const key = `content/${relativePath.replace(/\\/g, '/')}`;
    const stat = fs.statSync(filePath);

    // Optionally skip files already in Spaces
    if (skipExisting && (await objectExists(key))) {
      skipped++;
      continue;
    }

    try {
      const fileStream = fs.createReadStream(filePath);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: fileStream,
          ContentType: getContentType(filePath),
          ACL: 'public-read',
          CacheControl: getCacheControl(filePath),
        }),
      );
      uploaded++;
      totalBytes += stat.size;
      console.log(`  ✅ ${key}  (${formatBytes(stat.size)})`);
    } catch (error: any) {
      failed++;
      console.error(`  ❌ ${key}  — ${error.message}`);
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log(`  Uploaded : ${uploaded}`);
  console.log(`  Skipped  : ${skipped}`);
  console.log(`  Failed   : ${failed}`);
  console.log(`  Total    : ${formatBytes(totalBytes)}`);
  console.log('═══════════════════════════════════════════════');

  if (failed > 0) {
    console.log('\n⚠️  Some files failed. Re-run with --skip-existing to retry.');
    process.exit(1);
  } else {
    console.log('\n🎉 Migration complete!');
    console.log(
      `\nCDN base URL: ${process.env.DO_SPACES_CDN_ENDPOINT || `https://${BUCKET}.sgp1.cdn.digitaloceanspaces.com`}`,
    );
  }
}

migrate().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
