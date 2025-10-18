'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface SubmitReviewInput {
  restaurantSlug: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
}

export async function submitReview(input: SubmitReviewInput) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول'
      };
    }

    const userId = session.user.id; // Type narrowing

    // Validate rating
    if (input.rating < 1 || input.rating > 5) {
      return {
        success: false,
        message: 'التقييم يجب أن يكون بين 1 و 5 نجوم'
      };
    }

    // Validate comment
    if (!input.comment || !input.comment.trim()) {
      return {
        success: false,
        message: 'الرجاء كتابة تعليق'
      };
    }

    // Decode URL-encoded slug (handles Arabic characters in URLs)
    const decodedSlug = decodeURIComponent(input.restaurantSlug);

    // Get restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: decodedSlug },
      select: { id: true }
    });

    if (!restaurant) {
      return {
        success: false,
        message: 'المطعم غير موجود'
      };
    }

    // Check if user already reviewed this restaurant
    const existingReview = await prisma.restaurantReview.findUnique({
      where: {
        customerId_restaurantId: {
          customerId: userId,
          restaurantId: restaurant.id
        }
      }
    });

    if (existingReview) {
      return {
        success: false,
        message: 'لقد قمت بتقييم هذا المطعم من قبل'
      };
    }

    // Create review and update restaurant rating
    await prisma.$transaction(async (tx) => {
      // Create the review
      await tx.restaurantReview.create({
        data: {
          restaurantId: restaurant.id,
          customerId: userId,
          rating: input.rating,
          title: input.title?.trim() || null,
          comment: input.comment.trim(),
          images: input.images || [],
          isApproved: true // Auto-publish
        }
      });

      // Calculate new average rating from all approved reviews
      const reviews = await tx.restaurantReview.findMany({
        where: {
          restaurantId: restaurant.id,
          isApproved: true
        },
        select: { rating: true }
      });

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

      // Update restaurant with new average rating and review count
      await tx.restaurant.update({
        where: { id: restaurant.id },
        data: {
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          reviewCount: reviews.length
        }
      });
    });

    revalidatePath(`/restaurant/${input.restaurantSlug}/reviews`);
    revalidatePath(`/restaurant/${input.restaurantSlug}`);

    return {
      success: true,
      message: 'تم نشر تقييمك بنجاح! ✅'
    };
  } catch (error) {
    console.error('Error submitting review:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إرسال التقييم'
    };
  }
}

