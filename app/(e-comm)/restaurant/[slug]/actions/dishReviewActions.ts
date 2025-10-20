'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

/**
 * Check if user has reviewed a dish
 */
export async function hasDishBeenReviewed(dishId: string): Promise<{ reviewed: boolean; reviewId?: string; rating?: number; comment?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { reviewed: false };
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: dishId,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
      },
    });

    if (existingReview) {
      return {
        reviewed: true,
        reviewId: existingReview.id,
        rating: existingReview.rating,
        comment: existingReview.comment,
      };
    }

    return { reviewed: false };
  } catch (error) {
    console.error('Error checking dish review:', error);
    return { reviewed: false };
  }
}

/**
 * Submit or update a dish review
 */
export async function submitDishReview(
  dishId: string,
  rating: number,
  comment: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإضافة تقييم',
      };
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return {
        success: false,
        message: 'التقييم يجب أن يكون بين 1 و 5 نجوم',
      };
    }

    // Validate comment
    if (!comment || comment.trim().length < 3) {
      return {
        success: false,
        message: 'الرجاء كتابة تعليق (3 أحرف على الأقل)',
      };
    }

    // Check if dish exists
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      select: {
        id: true,
        name: true,
        supplierId: true,
        supplier: {
          select: {
            slug: true
          }
        }
      },
    });

    if (!dish) {
      return {
        success: false,
        message: 'الطبق غير موجود',
      };
    }

    // Check if user already reviewed this dish
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: dishId,
      },
    });

    if (existingReview) {
      // Update existing review (latest replaces previous)
      await prisma.$transaction(async (tx) => {
        await tx.review.update({
          where: { id: existingReview.id },
          data: {
            rating,
            comment: comment.trim(),
            updatedAt: new Date(),
          },
        });

        // Recalculate dish average rating
        await updateDishAverageRating(dishId, tx);
      });

      // Revalidate restaurant pages
      if (dish.supplier?.slug) {
        revalidatePath(`/restaurant/${dish.supplier.slug}`);
        revalidatePath(`/restaurant/${dish.supplier.slug}/orders`);
      }

      return {
        success: true,
        message: 'تم تحديث تقييمك بنجاح ✅',
      };
    } else {
      // Create new review
      await prisma.$transaction(async (tx) => {
        await tx.review.create({
          data: {
            userId: session.user.id!,
            productId: dishId,
            rating,
            comment: comment.trim(),
            isVerified: false,
          },
        });

        // Recalculate dish average rating
        await updateDishAverageRating(dishId, tx);
      });

      // Revalidate restaurant pages
      if (dish.supplier?.slug) {
        revalidatePath(`/restaurant/${dish.supplier.slug}`);
        revalidatePath(`/restaurant/${dish.supplier.slug}/orders`);
      }

      return {
        success: true,
        message: 'تم نشر تقييمك بنجاح ✅',
      };
    }
  } catch (error) {
    console.error('Error submitting dish review:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إرسال التقييم',
    };
  }
}

/**
 * Update dish average rating based on all reviews
 */
async function updateDishAverageRating(dishId: string, tx: any) {
  const reviews = await tx.review.findMany({
    where: { productId: dishId },
    select: { rating: true },
  });

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await tx.dish.update({
      where: { id: dishId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount: reviews.length,
      },
    });
  }
}

