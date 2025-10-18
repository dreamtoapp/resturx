'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface UpdateSocialMediaInput {
  facebook?: string;
  instagram?: string;
  snapchat?: string;
  tiktok?: string;
  twitter?: string;
}

// URL validation helper
function isValidUrl(url: string): boolean {
  if (!url.trim()) return true; // Empty is valid (optional field)
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function updateSocialMedia(input: UpdateSocialMediaInput) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول'
      };
    }

    // Get restaurant for this owner
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId: session.user.id },
      select: { id: true, slug: true }
    });

    if (!restaurant) {
      return {
        success: false,
        message: 'لم يتم العثور على المطعم'
      };
    }

    // Validate URLs
    const socialMediaUrls = {
      facebook: input.facebook?.trim() || null,
      instagram: input.instagram?.trim() || null,
      snapchat: input.snapchat?.trim() || null,
      tiktok: input.tiktok?.trim() || null,
      twitter: input.twitter?.trim() || null,
    };

    // Validate each URL
    for (const [platform, url] of Object.entries(socialMediaUrls)) {
      if (url && !isValidUrl(url)) {
        return {
          success: false,
          message: `رابط ${platform} غير صحيح`
        };
      }
    }

    // Update restaurant
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: socialMediaUrls
    });

    // Revalidate paths
    revalidatePath('/restaurant-portal/social-media');
    revalidatePath(`/restaurant/${restaurant.slug}`);

    return {
      success: true,
      message: 'تم حفظ روابط وسائل التواصل بنجاح'
    };
  } catch (error) {
    console.error('Error updating social media:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء حفظ البيانات'
    };
  }
}

