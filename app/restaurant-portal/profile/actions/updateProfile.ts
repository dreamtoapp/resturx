'use server';

import db from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

export async function updateRestaurantProfile(
  restaurantId: string,
  data: {
    name: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    workingHours?: string;
    deliveryTime?: string;
    minOrder?: number;
    deliveryFee?: number;
    hasOwnDelivery?: boolean;
    bio?: string;
  }
) {
  try {
    await db.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: data.name,
        description: data.description || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        workingHours: data.workingHours || null,
        deliveryTime: data.deliveryTime || null,
        minOrder: data.minOrder || null,
        deliveryFee: data.deliveryFee || null,
        hasOwnDelivery: data.hasOwnDelivery || false,
        bio: data.bio || null,
      },
    });

    revalidateTag('restaurants');

    return {
      success: true,
      message: 'تم تحديث البيانات بنجاح',
    };
  } catch (error) {
    console.error('Error updating restaurant profile:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء التحديث',
    };
  }
}




