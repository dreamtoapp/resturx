'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface DeleteGalleryImageResult {
  success: boolean;
  message: string;
}

export async function deleteGalleryImage(
  imageId: string
): Promise<DeleteGalleryImageResult> {
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
        message: 'الصورة غير موجودة أو لا تملك صلاحية حذفها'
      };
    }

    // Delete the image
    await prisma.restaurantImage.delete({
      where: { id: imageId }
    });

    revalidatePath('/restaurant-portal/gallery');
    revalidatePath(`/restaurant/${restaurant.slug}`);
    revalidatePath('/restaurant-portal');

    return {
      success: true,
      message: 'تم حذف الصورة بنجاح ✅'
    };
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء حذف الصورة'
    };
  }
}


