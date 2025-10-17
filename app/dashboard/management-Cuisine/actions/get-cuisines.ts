'use server';
import db from '@/lib/prisma';

export async function getCuisines() {
  try {
    const cuisines = await db.country.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        description: true,
        article: true,
        articleTitle: true,
        metaDescription: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        translations: true,
        restaurants: {
          select: {
            id: true,
          }
        },
        popularDishes: {
          select: {
            id: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    // Add counts to each cuisine
    const cuisinesWithCount = cuisines.map(cuisine => ({
      ...cuisine,
      restaurantCount: cuisine.restaurants.length,
      popularDishesCount: cuisine.popularDishes.length
    }));

    return cuisinesWithCount;
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    throw new Error('Failed to fetch cuisines.');
  }
}

