'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deletePopularDish(dishId: string, cuisineId: string) {
  try {
    await db.popularDish.delete({
      where: { id: dishId },
    });

    revalidatePath(`/dashboard/management-Cuisine/popular-dishes/${cuisineId}`);

    return { success: true, message: 'تم حذف الطبق بنجاح.' };
  } catch (error: unknown) {
    console.error('Error deleting popular dish:', error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'حدث خطأ غير متوقع أثناء حذف الطبق.' };
  }
}

