'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface ReorderVideosResult {
  success: boolean;
  message: string;
}

export async function reorderVideos(
  videoIds: string[]
): Promise<ReorderVideosResult> {
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

    // Verify all videos belong to this restaurant
    const videos = await prisma.restaurantVideo.findMany({
      where: {
        id: { in: videoIds },
        restaurantId: restaurant.id
      },
      select: { id: true }
    });

    if (videos.length !== videoIds.length) {
      return {
        success: false,
        message: 'بعض الفيديوهات غير موجودة أو لا تملك صلاحية تعديلها'
      };
    }

    // Update order for all videos in a transaction
    await prisma.$transaction(
      videoIds.map((id, index) =>
        prisma.restaurantVideo.update({
          where: { id },
          data: { order: index }
        })
      )
    );

    revalidatePath('/restaurant-portal/videos');
    revalidatePath(`/restaurant/${restaurant.slug}`);

    return {
      success: true,
      message: 'تم إعادة ترتيب الفيديوهات بنجاح ✅'
    };
  } catch (error) {
    console.error('Error reordering videos:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إعادة ترتيب الفيديوهات'
    };
  }
}


