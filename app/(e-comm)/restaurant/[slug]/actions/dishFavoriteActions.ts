'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

/**
 * Check if a dish is in the user's favorites
 */
export async function isDishInFavorites(dishId: string): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: dishId,
        },
      },
    });

    return !!wishlistItem;
  } catch (error) {
    console.error('Error checking dish favorites:', error);
    return false;
  }
}

/**
 * Add a dish to the user's favorites
 */
export async function addDishToFavorite(dishId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإضافة إلى المفضلة',
      };
    }

    // Check if the dish exists
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

    // Check if already in favorites
    const existingFavorite = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: dishId,
        },
      },
    });

    if (existingFavorite) {
      return {
        success: false,
        message: 'الطبق موجود بالفعل في المفضلة',
      };
    }

    // Add to favorites
    await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId: dishId,
      },
    });

    // Revalidate restaurant pages
    if (dish.supplier?.slug) {
      revalidatePath(`/restaurant/${dish.supplier.slug}`);
      revalidatePath(`/restaurant/${dish.supplier.slug}/orders`);
    }

    return {
      success: true,
      message: 'تمت إضافة الطبق إلى المفضلة ✅',
    };
  } catch (error) {
    console.error('Error adding dish to favorites:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة الطبق',
    };
  }
}

/**
 * Remove a dish from the user's favorites
 */
export async function removeDishFromFavorite(dishId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول',
      };
    }

    // Remove from favorites
    const deleted = await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
        productId: dishId,
      },
    });

    if (deleted.count === 0) {
      return {
        success: false,
        message: 'الطبق غير موجود في المفضلة',
      };
    }

    // Get dish and restaurant for revalidation
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      select: {
        supplierId: true,
        supplier: {
          select: {
            slug: true
          }
        }
      },
    });

    if (dish?.supplier?.slug) {
      revalidatePath(`/restaurant/${dish.supplier.slug}`);
      revalidatePath(`/restaurant/${dish.supplier.slug}/orders`);
    }

    return {
      success: true,
      message: 'تمت إزالة الطبق من المفضلة',
    };
  } catch (error) {
    console.error('Error removing dish from favorites:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إزالة الطبق',
    };
  }
}

