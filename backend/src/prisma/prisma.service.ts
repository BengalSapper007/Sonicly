import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // SSL required for Neon
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
    });
    const adapter = new PrismaPg(pool);
    super({ adapter } as any);
  }

  async onModuleInit() {
    await this.$connect();
    await this.setupTrigramSearch();
  }

  private async setupTrigramSearch() {
    try {
      // 1. Enable pg_trgm extension
      await this.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

      // 2. Create GIN trigram indexes for fast fuzzy similarity queries
      await this.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS idx_songs_title_trgm ON songs USING gin (title gin_trgm_ops);`
      );
      await this.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS idx_artists_name_trgm ON artists USING gin (name gin_trgm_ops);`
      );
      await this.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS idx_albums_title_trgm ON albums USING gin (title gin_trgm_ops);`
      );
      this.logger.log('PostgreSQL pg_trgm extension & GIN indexes initialized successfully.');
    } catch (err: any) {
      this.logger.warn(`Could not initialize pg_trgm extension: ${err.message}`);
    }
  }
}
