'use server';

import prisma from '@/lib/prisma';

/**
 * Get country details with its restaurants
 */
export async function getCountryWithRestaurants(slug: string) {
  try {
    const country = await prisma.country.findFirst({
      where: { slug },
      include: {
        restaurants: {
          where: {
            status: 'ACTIVE', // Only show active restaurants
          },
          include: {
            services: true,
            _count: {
              select: {
                dishes: true,
              }
            }
          },
          orderBy: {
            isPopular: 'desc', // Popular restaurants first
          }
        },
        translations: true,
      },
    });

    if (!country) {
      return null;
    }

    return {
      country: {
        id: country.id,
        name: country.name,
        description: country.description,
        slug: country.slug,
        logo: country.logo,
      },
      restaurants: country.restaurants,
    };
  } catch (error) {
    console.error('Error fetching country with restaurants:', error);
    return null;
  }
}

