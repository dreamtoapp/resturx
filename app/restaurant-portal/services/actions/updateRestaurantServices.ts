'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateRestaurantServices(serviceIds: string[]) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول'
      };
    }

    // Get restaurant
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

    // Use transaction to delete old selections and create new ones
    await prisma.$transaction(async (tx) => {
      // Delete all existing services for this restaurant
      await tx.restaurantService.deleteMany({
        where: { restaurantId: restaurant.id }
      });

      // Create new service selections
      if (serviceIds.length > 0) {
        await tx.restaurantService.createMany({
          data: serviceIds.map((masterServiceId, index) => ({
            restaurantId: restaurant.id,
            masterServiceId,
            isActive: true,
            displayOrder: index,
          }))
        });
      }
    });

    revalidatePath('/restaurant-portal/services');
    revalidatePath(`/restaurant/${restaurant.slug}`);
    revalidatePath('/restaurant-portal');

    return {
      success: true,
      message: 'تم تحديث الخدمات بنجاح ✅'
    };
  } catch (error) {
    console.error('Error updating restaurant services:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء تحديث الخدمات'
    };
  }
}




