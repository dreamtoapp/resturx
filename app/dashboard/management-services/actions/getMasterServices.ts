'use server';

import db from '@/lib/prisma';

export async function getMasterServices() {
  try {
    const services = await db.masterService.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: {
            restaurants: true
          }
        }
      }
    });

    return services;
  } catch (error) {
    console.error('Error fetching master services:', error);
    return [];
  }
}




