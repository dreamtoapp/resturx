'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

/**
 * Check if a restaurant is in the user's favorites
 */
export async function isRestaurantInFavorites(restaurantId: string): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;

    const favorite = await prisma.restaurantFavorite.findUnique({
      where: {
        userId_restaurantId: {
          userId: session.user.id,
          restaurantId,
        },
      },
    });

    return !!favorite;
  } catch (error) {
    console.error('Error checking restaurant favorites:', error);
    return false;
  }
}

/**
 * Add a restaurant to the user's favorites
 */
export async function addRestaurantToFavorite(restaurantId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإضافة إلى المفضلة',
      };
    }

    // Check if the restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true, name: true, slug: true },
    });

    if (!restaurant) {
      return {
        success: false,
        message: 'المطعم غير موجود',
      };
    }

    // Check if already in favorites
    const existingFavorite = await prisma.restaurantFavorite.findUnique({
      where: {
        userId_restaurantId: {
          userId: session.user.id,
          restaurantId,
        },
      },
    });

    if (existingFavorite) {
      return {
        success: false,
        message: 'المطعم موجود بالفعل في المفضلة',
      };
    }

    // Add to favorites
    await prisma.restaurantFavorite.create({
      data: {
        userId: session.user.id,
        restaurantId,
      },
    });

    revalidatePath(`/restaurant/${restaurant.slug}`);
    revalidatePath(`/restaurant/${restaurant.slug}/orders`);

    return {
      success: true,
      message: 'تمت إضافة المطعم إلى المفضلة ✅',
    };
  } catch (error) {
    console.error('Error adding restaurant to favorites:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة المطعم',
    };
  }
}

/**
 * Remove a restaurant from the user's favorites
 */
export async function removeRestaurantFromFavorite(restaurantId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول',
      };
    }

    // Remove from favorites
    const deleted = await prisma.restaurantFavorite.deleteMany({
      where: {
        userId: session.user.id,
        restaurantId,
      },
    });

    if (deleted.count === 0) {
      return {
        success: false,
        message: 'المطعم غير موجود في المفضلة',
      };
    }

    // Get restaurant slug for revalidation
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { slug: true },
    });

    if (restaurant) {
      revalidatePath(`/restaurant/${restaurant.slug}`);
      revalidatePath(`/restaurant/${restaurant.slug}/orders`);
    }

    return {
      success: true,
      message: 'تمت إزالة المطعم من المفضلة',
    };
  } catch (error) {
    console.error('Error removing restaurant from favorites:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إزالة المطعم',
    };
  }
}

