'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface CheckoutItem {
  dishId: string;
  dishName: string;
  dishImage?: string;
  quantity: number;
  price: number;
  notes: string;
}

export async function createDineInOrderAction(
  restaurantId: string,
  tableNumber: string,
  items: CheckoutItem[]
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'غير مصرح' };
    }

    if (items.length === 0) {
      return { success: false, message: 'السلة فارغة' };
    }

    // Look up the table to get its ID (if it exists)
    const table = await prisma.restaurantTable.findFirst({
      where: {
        restaurantId,
        tableNumber,
        isActive: true
      }
    });

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotal * 0.15;
    const total = subtotal + taxAmount;
    const orderNumber = `TBL${tableNumber}-${Date.now().toString().slice(-6)}`;

    const order = await prisma.dineInOrder.create({
      data: {
        orderNumber,
        restaurantId,
        customerId: session.user.id,
        tableNumber,
        tableId: table?.id, // Link to table if found
        orderType: 'DINE_IN',
        subtotal,
        taxRate: 0.15,
        taxAmount,
        total,
        items: {
          create: items.map(item => ({
            dishId: item.dishId,
            dishName: item.dishName,
            dishImage: item.dishImage,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes || ''
          }))
        }
      }
    });

    revalidatePath('/restaurant-portal/orders');
    revalidatePath('/restaurant-portal/tables');
    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: 'حدث خطأ أثناء إنشاء الطلب' };
  }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  await prisma.dineInOrder.update({
    where: { id: orderId },
    data: {
      status: status as any,
      ...(status === 'COMPLETED' ? { completedAt: new Date() } : {})
    }
  });

  revalidatePath('/restaurant-portal/orders');
  return { success: true };
}

