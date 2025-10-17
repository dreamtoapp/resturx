'use server';

import db from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';

interface SocialMediaData {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  snapchat?: string;
}

export async function saveSocialMedia(data: SocialMediaData) {
  const session = await auth();
  const role = session?.user?.role as string | undefined;

  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false as const, message: 'UNAUTHORIZED' };
  }

  try {
    const company = await db.company.findFirst({ select: { id: true } });

    if (!company) {
      return { ok: false as const, message: 'NO_COMPANY' };
    }

    // Sanitize data - convert empty strings to empty string (not null)
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value && value.trim() !== '' ? value.trim() : ''
      ])
    );

    await db.company.update({
      where: { id: company.id },
      data: sanitizedData,
    });

    // Revalidate cache to update the footer
    revalidateTag('company');

    return { ok: true as const };
  } catch (error) {
    console.error('Error saving social media data:', error);
    return { ok: false as const, message: 'DATABASE_ERROR' };
  }
}

