import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppCacheService } from '../common/cache/app-cache.service';

@Injectable()
export class GenresService {
  constructor(
    private prisma: PrismaService,
    private cache: AppCacheService,
  ) {}

  findAll() {
    return this.cache.wrap(
      'genres:all',
      () => this.prisma.genre.findMany({ orderBy: { name: 'asc' } }),
      86400, // 24 hours
    );
  }
}
