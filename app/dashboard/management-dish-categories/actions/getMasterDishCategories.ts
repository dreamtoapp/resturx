'use server';

import db from '@/lib/prisma';

export async function getMasterDishCategories() {
  try {
    const categories = await db.masterDishCategory.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: {
            dishes: true
          }
        }
      }
    });

    return categories;
  } catch (error) {
    console.error('Error fetching master dish categories:', error);
    return [];
  }
}

