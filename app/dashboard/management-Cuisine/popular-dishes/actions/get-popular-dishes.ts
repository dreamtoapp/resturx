'use server';
import db from '@/lib/prisma';

export async function getPopularDishesByCuisine(cuisineId: string) {
  try {
    const popularDishes = await db.popularDish.findMany({
      where: {
        countryId: cuisineId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return popularDishes;
  } catch (error) {
    console.error('Error fetching popular dishes:', error);
    throw new Error('Failed to fetch popular dishes.');
  }
}

// Also get cuisine info for page header
export async function getCuisineById(cuisineId: string) {
  try {
    const cuisine = await db.country.findUnique({
      where: {
        id: cuisineId,
      },
      select: {
        id: true,
        name: true,
        logo: true,
      },
    });

    if (!cuisine) {
      throw new Error('Cuisine not found.');
    }

    return cuisine;
  } catch (error) {
    console.error('Error fetching cuisine:', error);
    throw new Error('Failed to fetch cuisine.');
  }
}

