'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

export async function deleteCuisine(cuisineId: string) {
  try {
    // Check if the cuisine has any associated restaurants
    const relatedRestaurants = await db.restaurant.findFirst({
      where: { countryId: cuisineId },
    });

    if (relatedRestaurants) {
      throw new Error('لا يمكن حذف نوع المطبخ لأنه مرتبط بمطاعم حالية. يرجى حذف المطاعم أولاً أو إعادة تعيينها لمطبخ آخر.');
    }

    // If no related restaurants, proceed with deletion
    await db.country.delete({
      where: { id: cuisineId },
    });

    revalidateTag('countries');
    revalidatePath('/dashboard/management-Cuisine');

    return { success: true, message: 'تم حذف نوع المطبخ بنجاح.' };
  } catch (error: unknown) {
    console.error('Error deleting cuisine:', error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'حدث خطأ غير متوقع أثناء حذف نوع المطبخ.' };
  }
}
