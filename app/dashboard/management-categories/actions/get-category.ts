'use server';
import db from '@/lib/prisma';

export async function getRestaurants() {
  try {
    const restaurants = await db.restaurant.findMany({
      include: {
        country: true,
        translations: true,
        services: true,
        features: true,
        images: true,
        _count: {
          select: {
            dishes: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw new Error('Failed to fetch restaurants.');
  }
}

// Backward compatibility
export async function getCategories() {
  return getRestaurants();
}
