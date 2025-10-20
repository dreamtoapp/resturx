'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface UpdateImageCaptionResult {
  success: boolean;
  message: string;
}

export async function updateImageCaption(
  imageId: string,
  caption: string
): Promise<UpdateImageCaptionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول'
      };
    }

    // Get restaurant
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

    // Verify the image belongs to this restaurant
    const image = await prisma.restaurantImage.findUnique({
      where: { id: imageId },
      select: { restaurantId: true }
    });

    if (!image || image.restaurantId !== restaurant.id) {
      return {
        success: false,
        message: 'الصورة غير موجودة أو لا تملك صلاحية تعديلها'
      };
    }

    // Update caption
    await prisma.restaurantImage.update({
      where: { id: imageId },
      data: { caption: caption.trim() || null }
    });

    revalidatePath('/restaurant-portal/gallery');
    revalidatePath(`/restaurant/${restaurant.slug}`);

    return {
      success: true,
      message: 'تم تحديث التعليق بنجاح ✅'
    };
  } catch (error) {
    console.error('Error updating image caption:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء تحديث التعليق'
    };
  }
}


