'use server';

import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function dbHealthCheck() {
  const start = Date.now();
  const session = await auth();
  const role = session?.user?.role;
  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false, message: 'UNAUTHORIZED' } as const;
  }

  try {
    // Minimal query that works across providers (Mongo: findFirst)
    await db.user.findFirst({ select: { id: true } });
    const latencyMs = Date.now() - start;
    // Parse DB name from DATABASE_URL
    const raw = process.env.DATABASE_URL || '';
    let dbName: string | null = null;
    let host: string | null = null;
    // Stats removed for now per request
    let dataSizeBytes: number | null = null;
    let storageSizeBytes: number | null = null;
    let collections: number | null = null;
    const plan = process.env.MONGODB_ATLAS_TIER || process.env.MONGODB_PLAN || null;
    try {
      const u = new URL(raw);
      const name = u.pathname.replace(/^\//, '');
      dbName = name || null;
      host = u.hostname || null;
    } catch {
      const match = raw.match(/\/([^/?#]+)(?:\?|$)/);
      dbName = match?.[1] ?? null;
    }
    // MongoDB-only: try to fetch dbStats via Prisma's raw command
    return { ok: true, latencyMs, dbName, host, dataSizeBytes, storageSizeBytes, collections, plan } as const;
  } catch (error) {
    return { ok: false, message: 'DB_ERROR' } as const;
  }
}


