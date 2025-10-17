'use server';

import db from '@/lib/prisma';
import { auth } from '@/auth';

export async function getSocialMedia() {
  const session = await auth();
  const role = session?.user?.role as string | undefined;

  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false as const, message: 'UNAUTHORIZED' };
  }

  try {
    const company = await db.company.findFirst({
      select: {
        website: true,
        facebook: true,
        instagram: true,
        twitter: true,
        linkedin: true,
        tiktok: true,
        snapchat: true,
      }
    });

    if (!company) {
      return { ok: false as const, message: 'NO_COMPANY' };
    }

    return {
      ok: true as const,
      data: {
        website: company.website || '',
        facebook: company.facebook || '',
        instagram: company.instagram || '',
        twitter: company.twitter || '',
        linkedin: company.linkedin || '',
        tiktok: company.tiktok || '',
        snapchat: company.snapchat || '',
      }
    };
  } catch (error) {
    console.error('Error fetching social media data:', error);
    return { ok: false as const, message: 'DATABASE_ERROR' };
  }
}

