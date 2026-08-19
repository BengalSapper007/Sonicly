import path from 'node:path';
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

const DB_URL = process.env.DATABASE_URL;

export default defineConfig({
  // @ts-ignore — earlyAccess is valid in Prisma 7 but not typed yet
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: DB_URL,
  },
  migrate: {
    async adapter() {
      const { PrismaPg } = await import('@prisma/adapter-pg');
      const { Pool } = await import('pg');
      const pool = new Pool({ connectionString: DB_URL });
      return new PrismaPg(pool);
    },
  },
});
