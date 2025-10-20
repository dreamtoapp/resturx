'use server';

import prisma from '@/lib/prisma';

export async function getAvailableTables(restaurantId: string) {
  try {
    const tables = await prisma.restaurantTable.findMany({
      where: {
        restaurantId,
        isActive: true
      },
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
      },
      orderBy: { tableNumber: 'asc' }
    });

    // Filter to show only available tables (no active orders)
    const availableTables = tables.filter(t => t._count.orders === 0);

    return availableTables;
  } catch (error) {
    console.error('Error fetching available tables:', error);
    return [];
  }
}

