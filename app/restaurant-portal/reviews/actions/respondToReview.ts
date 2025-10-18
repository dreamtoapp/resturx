'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function respondToReview(reviewId: string, response: string) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول'
      };
    }

    if (!response.trim()) {
      return {
        success: false,
        message: 'الرجاء كتابة رد'
      };
    }

    // Get review and verify ownership
    const review = await prisma.restaurantReview.findUnique({
      where: { id: reviewId },
      include: {
        restaurant: {
          select: { userId: true, slug: true }
        }
      }
    });

    if (!review) {
      return {
        success: false,
        message: 'التقييم غير موجود'
      };
    }

    if (review.restaurant.userId !== session.user.id) {
      return {
        success: false,
        message: 'غير مصرح لك بالرد على هذا التقييم'
      };
    }

    // Update review with response
    await prisma.restaurantReview.update({
      where: { id: reviewId },
      data: {
        ownerResponse: response.trim(),
        respondedAt: new Date()
      }
    });

    revalidatePath('/restaurant-portal/reviews');
    revalidatePath(`/restaurant/${review.restaurant.slug}/reviews`);

    return {
      success: true,
      message: 'تم إرسال الرد بنجاح'
    };
  } catch (error) {
    console.error('Error responding to review:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إرسال الرد'
    };
  }
}

