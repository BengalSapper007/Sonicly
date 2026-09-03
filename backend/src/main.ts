import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const isProd = process.env.NODE_ENV === 'production';

  // Trust first proxy hop (e.g. Cloudflare, Nginx, ALB) for accurate client IP detection in rate limiting
  app.set('trust proxy', 1);

  // Helmet HTTP security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows audio streaming and cover image fetching
      contentSecurityPolicy: false, // CSP is enforced at the frontend / edge reverse proxy
    }),
  );

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

  // CORS — allow frontend origin (strip trailing slashes, support comma-separated origins)
  const defaultOrigin = isProd ? '' : 'http://localhost:3000';
  const rawOrigins = process.env.CORS_ORIGIN || defaultOrigin;
  const allowedOrigins = rawOrigins
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser requests (server-to-server, mobile native, curl)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(cleanOrigin) || (!isProd && allowedOrigins.includes('*'))) {
        return callback(null, true);
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true, // required for cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Range', 'x-admin-key'],
    exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length', 'Content-Type'],
  });

  // API prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Sonicly API running on http://localhost:${port}/api`);
  console.log(`☁️  Media storage: Cloudflare R2 (bucket: ${process.env.R2_BUCKET_NAME ?? 'sonicly'})`);
}

bootstrap();
