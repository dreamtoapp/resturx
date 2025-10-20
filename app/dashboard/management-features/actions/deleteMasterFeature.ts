'use server';

import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteMasterFeature(id: string) {
  try {
    // Check if feature is used by any restaurants
    const feature = await db.masterFeature.findUnique({
      where: { id },
      include: {
        _count: {
          select: { restaurants: true }
        }
      }
    });

    if (!feature) {
      return {
        ok: false,
        msg: 'الميزة غير موجودة',
      };
    }

    if (feature._count.restaurants > 0) {
      return {
        ok: false,
        msg: `لا يمكن حذف الميزة لأنها مستخدمة في ${feature._count.restaurants} مطعم`,
      };
    }

    await db.masterFeature.delete({
      where: { id },
    });

    revalidatePath('/dashboard/management-features');

    return {
      ok: true,
      msg: 'تم حذف الميزة بنجاح',
    };
  } catch (error) {
    console.error('deleteMasterFeature error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ أثناء حذف الميزة',
    };
  }
}




