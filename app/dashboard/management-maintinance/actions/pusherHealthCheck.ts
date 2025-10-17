'use server';

import { auth } from '@/auth';

export async function pusherHealthCheck() {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false, message: 'UNAUTHORIZED' } as const;
  }

  // Do not emit events; just validate presence of env keys
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
  const hasKeys = !!(appId && key && secret && cluster);

  const missing: string[] = [];
  if (!appId) missing.push('PUSHER_APP_ID');
  if (!key) missing.push('NEXT_PUBLIC_PUSHER_KEY');
  if (!secret) missing.push('PUSHER_SECRET');
  if (!cluster) missing.push('NEXT_PUBLIC_PUSHER_CLUSTER');

  return { ok: hasKeys, configured: hasKeys, missing } as const;
}


