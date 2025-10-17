'use server';

import prisma from '@/lib/prisma';

/**
 * Fetches all countries (cuisines) with restaurant counts
 * @returns An array of countries with restaurant counts
 */
export async function getCountries() {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        logo: true,
        article: true,
        publishedAt: true,
        restaurants: {
          where: {
            status: 'ACTIVE', // Only show active restaurants
          },
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
    });

    // Transform to include restaurant count, article status, and popular dishes count
    const transformedCountries = countries.map(country => ({
      id: country.id,
      name: country.name,
      description: country.description,
      slug: country.slug,
      imageUrl: country.logo, // logo is the cuisine icon
      restaurantCount: country.restaurants.length,
      hasArticle: !!country.publishedAt && !!country.article,
      popularDishesCount: country.popularDishes.length,
    }));

    return transformedCountries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

/**
 * Backward compatibility: getCategories now returns countries
 */
export async function getCategories() {
  return getCountries();
} 