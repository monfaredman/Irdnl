import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { Readable } from 'stream';

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION || 'sgp1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET || '',
  },
  forcePathStyle: false,
});

const BUCKET = process.env.DO_SPACES_BUCKET || 'irdnl-storage';

interface OptimizeRequest {
  key: string;
  sizes: number[];
  format?: 'webp' | 'avif' | 'jpeg';
  quality?: number;
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function optimizeImage(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log('📸 Image optimization triggered');

  try {
    const body = (await request.json()) as OptimizeRequest;
    const { key, sizes = [320, 640, 1280], format = 'webp', quality = 80 } = body;

    // 1. Download original image from Spaces
    const getResponse = await s3Client.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    );
    const imageBuffer = await streamToBuffer(getResponse.Body as Readable);
    context.log(
      `Downloaded original: ${key} (${(imageBuffer.length / 1024).toFixed(0)} KB)`,
    );

    // 2. Generate optimized versions
    const results: Array<{ size: number; key: string; savedBytes: number }> = [];

    for (const width of sizes) {
      const optimized = await sharp(imageBuffer)
        .resize(width, null, { fit: 'inside', withoutEnlargement: true })
        .toFormat(format, { quality })
        .toBuffer();

      const ext = `.${format}`;
      const optimizedKey = key.replace(/\.[^.]+$/, `_${width}w${ext}`);

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: optimizedKey,
          Body: optimized,
          ContentType: `image/${format}`,
          ACL: 'public-read',
          CacheControl: 'max-age=31536000',
        }),
      );

      results.push({
        size: width,
        key: optimizedKey,
        savedBytes: imageBuffer.length - optimized.length,
      });

      context.log(
        `✅ Generated ${width}w: ${(optimized.length / 1024).toFixed(0)} KB`,
      );
    }

    return {
      status: 200,
      jsonBody: {
        original: key,
        optimized: results,
        totalSaved: results.reduce((sum, r) => sum + r.savedBytes, 0),
      },
    };
  } catch (error: any) {
    context.error('Image optimization failed:', error);
    return {
      status: 500,
      jsonBody: { error: error.message },
    };
  }
}

app.http('optimize-image', {
  methods: ['POST'],
  authLevel: 'function',
  handler: optimizeImage,
});
