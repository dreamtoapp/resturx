'use server';

import prisma from '@/lib/prisma';

export async function getDishCategories() {
  try {
    const categories = await prisma.masterDishCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        nameEn: true,
      }
    });

    return categories;
  } catch (error) {
    console.error('Error fetching dish categories:', error);
    return [];
  }
}

