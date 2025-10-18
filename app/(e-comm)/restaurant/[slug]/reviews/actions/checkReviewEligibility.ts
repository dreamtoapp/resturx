'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function checkReviewEligibility(restaurantSlug: string) {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return {
        canReview: false,
        reason: 'يجب تسجيل الدخول لكتابة تقييم'
      };
    }

    // Decode URL-encoded slug (handles Arabic characters in URLs)
    const decodedSlug = decodeURIComponent(restaurantSlug);

    // Get restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: decodedSlug },
      select: { id: true }
    });

    if (!restaurant) {
      return {
        canReview: false,
        reason: 'المطعم غير موجود'
      };
    }

    // Check if user already reviewed this restaurant
    const existingReview = await prisma.restaurantReview.findUnique({
      where: {
        customerId_restaurantId: {
          customerId: session.user.id,
          restaurantId: restaurant.id
        }
      }
    });

    if (existingReview) {
      return {
        canReview: false,
        reason: 'لقد قمت بتقييم هذا المطعم من قبل'
      };
    }

    return {
      canReview: true,
      reason: 'يمكنك كتابة تقييم'
    };
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    return {
      canReview: false,
      reason: 'حدث خطأ أثناء التحقق'
    };
  }
}

