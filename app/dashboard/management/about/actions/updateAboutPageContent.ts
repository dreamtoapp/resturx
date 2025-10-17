'use server';
import { z } from 'zod';
import db from '@/lib/prisma';

// Accept partial updates: each field optional; tabs can send only their fields
const aboutSchema = z.object({
  heroTitle: z.string().min(2).optional(),
  heroSubtitle: z.string().min(2).optional(),
  // Allow initial save without image; accept empty string or valid URL
  heroImageUrl: z.union([z.string().url(), z.literal('')]).optional(),
  missionTitle: z.string().min(2).optional(),
  missionText: z.string().min(2).optional(),
  ctaTitle: z.string().min(2).optional(),
  ctaText: z.string().min(2).optional(),
  ctaButtonText: z.string().min(2).optional(),
  brandId: z.string().optional(),
  ctaButtonLink: z.string().optional(),
  contactLink: z.string().optional(),
});

export type AboutFormValues = z.infer<typeof aboutSchema>;

export async function updateAboutPageContent(data: AboutFormValues) {
  const parsed = aboutSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }
  const input = parsed.data;
  try {
    // Only one AboutPageContent should exist
    const existing = await db.aboutPageContent.findFirst();
    let aboutPage;
    if (existing) {
      aboutPage = await db.aboutPageContent.update({
        where: { id: existing.id },
        data: { ...input },
      });
    } else {
      aboutPage = await db.aboutPageContent.create({
        data: {
          heroTitle: input.heroTitle ?? '',
          heroSubtitle: input.heroSubtitle ?? '',
          heroImageUrl: input.heroImageUrl ?? '',
          missionTitle: input.missionTitle ?? '',
          missionText: input.missionText ?? '',
          ctaTitle: input.ctaTitle ?? '',
          ctaText: input.ctaText ?? '',
          ctaButtonText: input.ctaButtonText ?? '',
          brandId: input.brandId || '',
          ctaButtonLink: input.ctaButtonLink || '',
          contactLink: input.contactLink || '',
        },
      });
    }
    return { success: true, aboutPage };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 