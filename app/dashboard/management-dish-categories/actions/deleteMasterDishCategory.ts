'use server';

import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteMasterDishCategory(id: string) {
  try {
    // Check if category has dishes
    const category = await db.masterDishCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            dishes: true
          }
        }
      }
    });

    if (!category) {
      return {
        ok: false,
        msg: 'الصنف غير موجود',
      };
    }

    if (category._count.dishes > 0) {
      return {
        ok: false,
        msg: `لا يمكن حذف الصنف لأنه يحتوي على ${category._count.dishes} طبق`,
      };
    }

    await db.masterDishCategory.delete({
      where: { id },
    });

    revalidatePath('/dashboard/management-dish-categories');

    return {
      ok: true,
      msg: 'تم حذف الصنف بنجاح',
    };
  } catch (error) {
    console.error('deleteMasterDishCategory error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
    };
  }
}

