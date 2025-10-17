'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { auth } from '@/auth';

export async function refreshAllCaches() {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false, message: 'UNAUTHORIZED' } as const;
  }

  try {
    // Revalidate key data tags
    revalidateTag('products');
    revalidateTag('company');
    revalidateTag('categories');
    revalidateTag('promotions');
    // Home and core paths
    revalidatePath('/');
    // Optionally refresh dashboard overview pages (safe, non-breaking)
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/management-dashboard');

    return { ok: true } as const;
  } catch (error) {
    console.error('[refreshAllCaches] error:', error);
    return { ok: false, message: 'FAILED' } as const;
  }
}


