'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface DeleteVideoResult {
  success: boolean;
  message: string;
}

export async function deleteVideo(
  videoId: string
): Promise<DeleteVideoResult> {
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

    // Verify the video belongs to this restaurant
    const video = await prisma.restaurantVideo.findUnique({
      where: { id: videoId },
      select: { restaurantId: true }
    });

    if (!video || video.restaurantId !== restaurant.id) {
      return {
        success: false,
        message: 'الفيديو غير موجود أو لا تملك صلاحية حذفه'
      };
    }

    // Delete the video
    await prisma.restaurantVideo.delete({
      where: { id: videoId }
    });

    revalidatePath('/restaurant-portal/videos');
    revalidatePath(`/restaurant/${restaurant.slug}`);
    revalidatePath('/restaurant-portal');

    return {
      success: true,
      message: 'تم حذف الفيديو بنجاح ✅'
    };
  } catch (error) {
    console.error('Error deleting video:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء حذف الفيديو'
    };
  }
}


