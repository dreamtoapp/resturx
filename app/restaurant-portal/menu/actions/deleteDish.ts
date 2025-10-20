'use server';

import { auth } from '@/auth';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteDish(dishId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        ok: false,
        msg: 'يجب تسجيل الدخول أولاً',
      };
    }

    // Get restaurant
    const restaurant = await db.restaurant.findFirst({
      where: { userId: session.user.id }
    });

    if (!restaurant) {
      return {
        ok: false,
        msg: 'لا يوجد مطعم مسجل لهذا الحساب',
      };
    }

    // Verify ownership
    const dish = await db.dish.findFirst({
      where: {
        id: dishId,
        supplierId: restaurant.id
      }
    });

    if (!dish) {
      return {
        ok: false,
        msg: 'الطبق غير موجود أو ليس لديك صلاحية لحذفه',
      };
    }

    await db.dish.delete({
      where: { id: dishId }
    });

    revalidatePath('/restaurant-portal/menu');
    revalidatePath('/restaurant-portal');
    return {
      ok: true,
      msg: 'تم حذف الطبق بنجاح',
    };
  } catch (error) {
    console.error('deleteDish error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
    };
  }
}

