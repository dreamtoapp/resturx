'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getRestaurantTables() {
  const session = await auth();
  if (!session?.user) return { success: false, message: 'غير مصرح' };

  const restaurant = await prisma.restaurant.findFirst({
    where: { userId: session.user.id },
    select: { id: true }
  });

  if (!restaurant) return { success: false, message: 'المطعم غير موجود' };

  const tables = await prisma.restaurantTable.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { tableNumber: 'asc' },
    include: {
      _count: {
        select: {
          orders: {
            where: {
              status: { in: ['NEW', 'PREPARING'] }
            }
          }
        }
      }
    }
  });

  return { success: true, tables };
}

export async function createTable(tableNumber: string, capacity: number) {
  const session = await auth();
  if (!session?.user) return { success: false, message: 'غير مصرح' };

  const restaurant = await prisma.restaurant.findFirst({
    where: { userId: session.user.id },
    select: { id: true }
  });

  if (!restaurant) return { success: false, message: 'المطعم غير موجود' };

  // Validate inputs
  if (!tableNumber || tableNumber.trim() === '') {
    return { success: false, message: 'يرجى إدخال رقم الطاولة' };
  }

  if (capacity < 1 || capacity > 50) {
    return { success: false, message: 'عدد المقاعد يجب أن يكون بين 1 و 50' };
  }

  try {
    await prisma.restaurantTable.create({
      data: {
        restaurantId: restaurant.id,
        tableNumber: tableNumber.trim(),
        capacity
      }
    });

    revalidatePath('/restaurant-portal/tables');
    revalidatePath('/restaurant-portal');
    return { success: true, message: 'تمت إضافة الطاولة بنجاح' };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, message: 'رقم الطاولة موجود مسبقاً' };
    }
    return { success: false, message: 'حدث خطأ' };
  }
}

export async function updateTable(id: string, tableNumber: string, capacity: number, isActive: boolean) {
  const session = await auth();
  if (!session?.user) return { success: false, message: 'غير مصرح' };

  // Validate inputs
  if (!tableNumber || tableNumber.trim() === '') {
    return { success: false, message: 'يرجى إدخال رقم الطاولة' };
  }

  if (capacity < 1 || capacity > 50) {
    return { success: false, message: 'عدد المقاعد يجب أن يكون بين 1 و 50' };
  }

  try {
    await prisma.restaurantTable.update({
      where: { id },
      data: {
        tableNumber: tableNumber.trim(),
        capacity,
        isActive
      }
    });

    revalidatePath('/restaurant-portal/tables');
    revalidatePath('/restaurant-portal');
    return { success: true, message: 'تم تحديث الطاولة بنجاح' };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, message: 'رقم الطاولة موجود مسبقاً' };
    }
    return { success: false, message: 'حدث خطأ' };
  }
}

export async function deleteTable(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, message: 'غير مصرح' };

  try {
    // Check if table has active orders
    const table = await prisma.restaurantTable.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: {
              where: {
                status: { in: ['NEW', 'PREPARING', 'READY'] }
              }
            }
          }
        }
      }
    });

    if (table && table._count.orders > 0) {
      return { success: false, message: 'لا يمكن حذف طاولة لها طلبات نشطة' };
    }

    await prisma.restaurantTable.delete({ where: { id } });
    revalidatePath('/restaurant-portal/tables');
    revalidatePath('/restaurant-portal');
    return { success: true, message: 'تم حذف الطاولة بنجاح' };
  } catch (error) {
    return { success: false, message: 'حدث خطأ' };
  }
}

