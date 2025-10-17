'use server';

import db from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

/**
 * Fetches all active restaurants with their details
 */
async function fetchRestaurants() {
  try {
    const restaurants = await db.restaurant.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        country: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            dishes: true,
          },
        },
      },
      orderBy: [
        { isPopular: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return restaurants.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description,
      imageUrl: restaurant.imageUrl,
      country: restaurant.country,
      rating: restaurant.rating,
      isVerified: restaurant.isVerified,
      isPopular: restaurant.isPopular,
      deliveryTime: restaurant.deliveryTime,
      minOrder: restaurant.minOrder,
      deliveryFee: restaurant.deliveryFee,
      _count: restaurant._count,
    }));
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
}

/**
 * Cached version for homepage
 */
export async function getRestaurants() {
  const cachedFetch = unstable_cache(
    () => fetchRestaurants(),
    ['homepage-restaurants'],
    {
      tags: ['restaurants'],
      revalidate: 3600, // 1 hour
    }
  );

  return cachedFetch();
}


