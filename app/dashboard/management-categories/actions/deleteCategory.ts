'use server';

import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

import db from '@/lib/prisma';

export async function deleteRestaurant(restaurantId: string) {
  try {
    const restaurant = await db.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        dishes: {
          select: { id: true }
        }
      },
    });

    if (!restaurant) {
      return {
        success: false,
        message: 'المطعم غير موجود أو قد تم حذفه مسبقاً.',
      };
    }

    if (restaurant.dishes.length > 0) {
      throw new Error(
        'لا يمكن حذف المطعم لأنه مرتبط بأطباق حالية. يرجى حذف الأطباق أولاً أو إعادة تعيينها لمطعم آخر.'
      );
    }

    await db.restaurant.delete({
      where: { id: restaurantId },
    });
    revalidateTag('restaurants');
    revalidatePath('/dashboard/management-categories');

    return { success: true, message: 'تم حذف المطعم بنجاح.' };
  } catch (error: unknown) {
    console.error('Error deleting restaurant:', error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: 'حدث خطأ غير متوقع أثناء حذف المطعم.',
    };
  }
}

// Backward compatibility
export async function deleteCategory(categoryId: string) {
  return deleteRestaurant(categoryId);
}
