import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cookie parser (required for JWT HTTP-only cookie auth)
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS — allow frontend origin
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true, // required for cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Range', 'x-admin-key'],
    exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length', 'Content-Type'],
  });

  // API prefix for all routes
  app.setGlobalPrefix('api');

  /**
   * Static media serving — serves the root /media directory.
   * Mounted BEFORE the /api prefix so it's accessible at /media/*.
   * acceptRanges: true enables HTTP 206 Partial Content for audio seeking.
   *
   * The media root is resolved relative to the backend CWD (monorepo/backend/)
   * so it points at monorepo-root/media/.
   */
  const mediaRoot = process.env.MEDIA_ROOT
    || path.resolve(process.cwd(), '..', 'media');

  app.useStaticAssets(mediaRoot, {
    prefix: '/media',
    setHeaders: (res) => {
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Sonicly API running on http://localhost:${port}/api`);
  console.log(`📁 Media served at http://localhost:${port}/media (root: ${mediaRoot})`);
}

bootstrap();
