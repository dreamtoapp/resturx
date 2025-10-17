'use server';

import { auth } from '@/auth';
import cloudinary from 'cloudinary';
import db from '@/lib/prisma';
import { initCloudinary } from '@/app/api/images/cloudinary/config';

type CloudinaryHealth = {
  ok: boolean;
  configured: boolean;
  source: 'db' | 'env' | null;
  missing: Array<'CLOUD_NAME' | 'API_KEY' | 'API_SECRET'>;
  message?: string;
};

export async function cloudinaryHealthCheck(): Promise<CloudinaryHealth> {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false, configured: false, source: null, missing: [], message: 'UNAUTHORIZED' };
  }

  const useDb = process.env.USE_DB_CLOUDINARY !== 'false'; // Default to true unless explicitly disabled

  let cloudName: string | undefined;
  let apiKey: string | undefined;
  let apiSecret: string | undefined;
  let source: 'db' | 'env' = 'env';

  try {
    if (useDb) {
      try {
        const company = await db.company.findFirst();
        cloudName = company?.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME;
        apiKey = company?.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY;
        apiSecret = company?.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET;
        source = 'db';
      } catch {
        cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        apiKey = process.env.CLOUDINARY_API_KEY;
        apiSecret = process.env.CLOUDINARY_API_SECRET;
        source = 'env';
      }
    } else {
      cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      apiKey = process.env.CLOUDINARY_API_KEY;
      apiSecret = process.env.CLOUDINARY_API_SECRET;
      source = 'env';
    }

    const missing: CloudinaryHealth['missing'] = [];
    if (!cloudName) missing.push('CLOUD_NAME');
    if (!apiKey) missing.push('API_KEY');
    if (!apiSecret) missing.push('API_SECRET');

    const configured = missing.length === 0;
    if (!configured) {
      return { ok: false, configured, source, missing, message: 'MISSING_KEYS' };
    }

    // Configure SDK and perform a lightweight admin ping
    const init = await initCloudinary();
    if (init.error) {
      return { ok: false, configured: false, source, missing, message: init.error };
    }

    try {
      // cloudinary.v2.api.ping throws if credentials are invalid
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const res = await cloudinary.v2.api.ping();
      if (res) {
        return { ok: true, configured: true, source, missing: [] };
      }
      return { ok: false, configured: true, source, missing: [], message: 'PING_FAILED' };
    } catch (err: any) {
      const msg: string = err?.message || 'PING_ERROR';
      // Map common error shapes
      const lower = msg.toLowerCase();
      if (lower.includes('unauthorized') || lower.includes('invalid') || lower.includes('signature')) {
        return { ok: false, configured: true, source, missing: [], message: 'UNAUTHORIZED' };
      }
      return { ok: false, configured: true, source, missing: [], message: 'REQUEST_FAILED' };
    }
  } catch {
    return { ok: false, configured: false, source: null, missing: [], message: 'UNEXPECTED_ERROR' };
  }
}


