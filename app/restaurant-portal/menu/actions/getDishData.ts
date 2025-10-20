'use server';

import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function getDishData(dishId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const dish = await db.dish.findFirst({
      where: {
        id: dishId,
        supplier: {
          userId: session.user.id
        }
      },
      include: {
        dishCategory: true
      }
    });

    return dish;
  } catch (error) {
    console.error('Error fetching dish:', error);
    return null;
  }
}

