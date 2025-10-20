'use server';

import db from '@/lib/prisma';

export async function getMasterFeatures() {
  try {
    const features = await db.masterFeature.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { title: 'asc' }
      ],
      include: {
        _count: {
          select: {
            restaurants: true
          }
        }
      }
    });

    return features;
  } catch (error) {
    console.error('Error fetching master features:', error);
    return [];
  }
}




