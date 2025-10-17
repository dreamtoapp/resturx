'use server';

import { z } from 'zod';
import db from '@/lib/prisma';

const heroSchema = z.object({
  heroTitle: z.string().min(2, 'العنوان الرئيسي مطلوب'),
  heroSubtitle: z.string().min(2, 'الوصف الرئيسي مطلوب'),
  heroImageUrl: z.union([z.string().url('رابط الصورة غير صالح'), z.literal('')]).optional(),
});

export type HeroFormValues = z.infer<typeof heroSchema>;

export async function updateAboutHero(data: HeroFormValues) {
  const parsed = heroSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }
  const input = parsed.data;

  try {
    const existing = await db.aboutPageContent.findFirst();
    let aboutPage;
    if (existing) {
      aboutPage = await db.aboutPageContent.update({
        where: { id: existing.id },
        data: {
          heroTitle: input.heroTitle,
          heroSubtitle: input.heroSubtitle,
          ...(input.heroImageUrl !== undefined ? { heroImageUrl: input.heroImageUrl } : {}),
        },
      });
    } else {
      aboutPage = await db.aboutPageContent.create({
        data: {
          heroTitle: input.heroTitle,
          heroSubtitle: input.heroSubtitle,
          heroImageUrl: input.heroImageUrl ?? '',
          // other fields default empty for first creation
          missionTitle: '',
          missionText: '',
          ctaTitle: '',
          ctaText: '',
          ctaButtonText: '',
          brandId: '',
          ctaButtonLink: '',
          contactLink: '',
        },
      });
    }
    return { success: true, aboutPage };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}


