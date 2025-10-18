'use server';

import prisma from '@/lib/prisma';

export async function getRestaurantMenu(slug: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        country: true,
        dishes: {
          where: { published: true },
          orderBy: { createdAt: 'desc' }
        },
      },
    });

    return restaurant;
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    return null;
  }
}

