'use server';

import { z } from 'zod';
import db from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

const missionSchema = z.object({
  missionTitle: z.string().min(2, 'عنوان الرسالة مطلوب'),
  missionText: z.string().min(2, 'نص الرسالة مطلوب'),
});

export type MissionFormValues = z.infer<typeof missionSchema>;

export async function updateAboutMission(data: MissionFormValues) {
  const parsed = missionSchema.safeParse(data);
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
          missionTitle: input.missionTitle,
          missionText: input.missionText,
        },
      });
    } else {
      aboutPage = await db.aboutPageContent.create({
        data: {
          missionTitle: input.missionTitle,
          missionText: input.missionText,
          heroTitle: '',
          heroSubtitle: '',
          heroImageUrl: '',
          ctaTitle: '',
          ctaText: '',
          ctaButtonText: '',
          brandId: '',
          ctaButtonLink: '',
          contactLink: '',
        },
      });
    }

    // Revalidate public about page and company tag if used
    revalidatePath('/about');
    revalidateTag('company');

    return { success: true, aboutPage };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}


