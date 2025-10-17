'use server';

import db from '@/lib/prisma';

export async function updateHeroImage(heroImageUrl: string) {
  try {
    const existing = await db.aboutPageContent.findFirst();
    let aboutPage;
    if (existing) {
      aboutPage = await db.aboutPageContent.update({
        where: { id: existing.id },
        data: { heroImageUrl },
      });
    } else {
      aboutPage = await db.aboutPageContent.create({
        data: {
          heroImageUrl,
          // Default values for required fields
          heroTitle: 'عنوان افتراضي',
          heroSubtitle: 'وصف افتراضي',
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














