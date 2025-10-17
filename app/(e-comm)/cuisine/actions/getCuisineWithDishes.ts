'use server';

import db from '@/lib/prisma';

/**
 * Fetches cuisine data with popular dishes and featured restaurants
 * @param slug - The cuisine slug (will be decoded from URL encoding)
 * @returns Cuisine data with popular dishes and restaurants
 */
export async function getCuisineWithDishes(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const result = await db.country.findFirst({
    where: { slug: decodedSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      description: true,
      popularDishes: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      restaurants: {
        where: { status: 'ACTIVE', isVerified: true },
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
          rating: true,
          reviewCount: true,
        },
        take: 3,
        orderBy: { rating: 'desc' },
      },
    },
  });

  return result as typeof result & {
    popularDishes: Array<{
      id: string;
      name: string;
      description: string | null;
      imageUrl: string | null;
    }>;
    restaurants: Array<{
      id: string;
      name: string;
      slug: string;
      imageUrl: string | null;
      rating: number;
      reviewCount: number;
    }>;
  };
}

