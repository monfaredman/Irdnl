import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api';

  // Security – relax cross-origin policies so the frontend on :3000
  // can load video/image assets served from :3001/storage
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: false,          // disable CSP for dev
  }));
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Serve uploaded files (videos, images) from ./storage at /storage
  const storagePath = configService.get<string>('STORAGE_LOCAL_PATH') || './storage';
  app.useStaticAssets(join(process.cwd(), storagePath), {
    prefix: '/storage/',
  });

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('irdnl API')
    .setDescription('irdnl streaming platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('content', 'Content browsing')
    .addTag('admin', 'Admin/CMS operations')
    .addTag('watch-history', 'Watch history management')
    .addTag('watchlist', 'Watchlist management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'irdnl API Docs',
  });

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
