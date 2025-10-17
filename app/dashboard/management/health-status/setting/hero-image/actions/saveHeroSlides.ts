'use server';

import { z } from 'zod';
import db from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

const SlidesSchema = z.array(z.object({
  url: z.string().url(),
  publicId: z.string().optional(),
}));

export async function saveHeroSlides(formData: FormData) {
  const companyId = (formData.get('companyId') as string | null) || undefined;
  const slidesJson = (formData.get('slidesJson') as string | null) || '[]';
  const useHeroSlider = (formData.get('useHeroSlider') as string | null) === 'true';

  let slides: Array<{ url: string; publicId?: string }>;
  try {
    slides = SlidesSchema.parse(JSON.parse(slidesJson));
  } catch {
    return { success: false, message: 'Invalid slides data' } as const;
  }

  try {
    const existing = companyId
      ? await db.company.findUnique({ where: { id: companyId } })
      : await db.company.findFirst();

    if (!existing) {
      // Create singleton if missing
      await db.company.create({
        data: {
          heroSlides: slides as any,
          heroImages: slides.map(s => s.url),
          useHeroSlider,
        },
      });
    } else {
      await db.company.update({
        where: { id: existing.id },
        data: {
          heroSlides: slides as any,
          heroImages: slides.map(s => s.url), // keep legacy in sync
          useHeroSlider,
        },
      });
    }

    revalidateTag('company');
    revalidatePath('/');
    revalidatePath('/dashboard/management/health-status/setting/hero-image');

    return { success: true } as const;
  } catch (err) {
    return { success: false, message: 'Failed to save slides' } as const;
  }
}


