'use server';
import db from '@/lib/prisma';

/**
 * Get data needed for restaurant form (countries and restaurant owners)
 */
export async function getRestaurantFormData() {
  try {
    const [countries, restaurantOwners] = await Promise.all([
      db.country.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      db.user.findMany({
        where: {
          role: 'RESTAURANT_OWNER',
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    return {
      countries,
      restaurantOwners,
    };
  } catch (error) {
    console.error('Error fetching form data:', error);
    return {
      countries: [],
      restaurantOwners: [],
    };
  }
}







