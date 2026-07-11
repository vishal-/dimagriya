import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getPostgresUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    return url;
  }
  if (url.startsWith('prisma+postgres://')) {
    try {
      const parsedUrl = new URL(url);
      const apiKey = parsedUrl.searchParams.get('api_key');
      if (apiKey) {
        const decoded = Buffer.from(apiKey, 'base64').toString('utf-8');
        const parsedJson = JSON.parse(decoded);
        if (parsedJson && typeof parsedJson.databaseUrl === 'string') {
          return parsedJson.databaseUrl;
        }
      }
    } catch (e) {
      // Silently ignore or handle parsing error
    }
  }
  return undefined;
}

const resolvedUrl = getPostgresUrl(process.env.DATABASE_URL);

let prismaInstance: PrismaClient;

if (!globalForPrisma.prisma) {
  // The generated PrismaClient constructor in this project requires either `adapter` or `accelerateUrl`.
  // We use `@prisma/adapter-pg` driver adapter with a PostgreSQL connection pool.
  const pool = new Pool({
    connectionString: resolvedUrl || 'postgres://postgres:postgres@localhost:5432/postgres',
  });
  const adapter = new PrismaPg(pool);
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

prismaInstance = globalForPrisma.prisma;

export const prisma = prismaInstance;
export default prisma;
