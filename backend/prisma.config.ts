import path from 'node:path';
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

const DB_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_h5e7OFSdguIi@ep-patient-mouse-axayr62k-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

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
