'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface ReorderImagesResult {
  success: boolean;
  message: string;
}

export async function reorderImages(
  imageIds: string[]
): Promise<ReorderImagesResult> {
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

    // Verify all images belong to this restaurant
    const images = await prisma.restaurantImage.findMany({
      where: {
        id: { in: imageIds },
        restaurantId: restaurant.id
      },
      select: { id: true }
    });

    if (images.length !== imageIds.length) {
      return {
        success: false,
        message: 'بعض الصور غير موجودة أو لا تملك صلاحية تعديلها'
      };
    }

    // Update order for all images in a transaction
    await prisma.$transaction(
      imageIds.map((id, index) =>
        prisma.restaurantImage.update({
          where: { id },
          data: { order: index }
        })
      )
    );

    revalidatePath('/restaurant-portal/gallery');
    revalidatePath(`/restaurant/${restaurant.slug}`);

    return {
      success: true,
      message: 'تم إعادة ترتيب الصور بنجاح ✅'
    };
  } catch (error) {
    console.error('Error reordering images:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إعادة ترتيب الصور'
    };
  }
}


