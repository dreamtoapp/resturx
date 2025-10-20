'use server';

import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteMasterService(id: string) {
  try {
    // Check if service is used by any restaurants
    const service = await db.masterService.findUnique({
      where: { id },
      include: {
        _count: {
          select: { restaurants: true }
        }
      }
    });

    if (!service) {
      return {
        ok: false,
        msg: 'الخدمة غير موجودة',
      };
    }

    if (service._count.restaurants > 0) {
      return {
        ok: false,
        msg: `لا يمكن حذف الخدمة لأنها مستخدمة في ${service._count.restaurants} مطعم`,
      };
    }

    await db.masterService.delete({
      where: { id },
    });

    revalidatePath('/dashboard/management-services');

    return {
      ok: true,
      msg: 'تم حذف الخدمة بنجاح',
    };
  } catch (error) {
    console.error('deleteMasterService error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ أثناء حذف الخدمة',
    };
  }
}




