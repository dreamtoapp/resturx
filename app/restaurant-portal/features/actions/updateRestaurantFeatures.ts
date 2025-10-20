'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateRestaurantFeatures(featureIds: string[]) {
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
      // Delete all existing features for this restaurant
      await tx.restaurantFeature.deleteMany({
        where: { restaurantId: restaurant.id }
      });

      // Create new feature selections
      if (featureIds.length > 0) {
        await tx.restaurantFeature.createMany({
          data: featureIds.map((masterFeatureId, index) => ({
            restaurantId: restaurant.id,
            masterFeatureId,
            isActive: true,
            displayOrder: index,
          }))
        });
      }
    });

    revalidatePath('/restaurant-portal/features');
    revalidatePath(`/restaurant/${restaurant.slug}`);
    revalidatePath('/restaurant-portal');

    return {
      success: true,
      message: 'تم تحديث المميزات بنجاح ✅'
    };
  } catch (error) {
    console.error('Error updating restaurant features:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء تحديث المميزات'
    };
  }
}




