'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteBlog() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول'
      };
    }

    // Get restaurant for this owner
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

    // Delete blog post
    await prisma.restaurantPost.deleteMany({
      where: { restaurantId: restaurant.id }
    });

    revalidatePath('/restaurant-portal/blog');
    revalidatePath(`/restaurant/${restaurant.slug}`);

    return {
      success: true,
      message: 'تم حذف المدونة بنجاح'
    };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء حذف المدونة'
    };
  }
}

