import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';

async function exportOpenAPI() {
  const app = await NestFactory.create(AppModule);

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

  // Export as JSON
  fs.writeFileSync(
    './openapi.json',
    JSON.stringify(document, null, 2),
  );

  // Export as YAML (requires js-yaml package)
  // const yaml = require('js-yaml');
  // fs.writeFileSync('./openapi.yaml', yaml.dump(document));

  console.log('OpenAPI spec exported to openapi.json');
  await app.close();
}

exportOpenAPI();

