'use server';

import prisma from '@/lib/prisma';

export async function getRestaurantReviews(restaurantSlug: string) {
  try {
    // Decode URL-encoded slug (handles Arabic characters in URLs)
    const decodedSlug = decodeURIComponent(restaurantSlug);
    
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: decodedSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        reviews: {
          where: { isApproved: true },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return restaurant;
  } catch (error) {
    console.error('Error fetching restaurant reviews:', error);
    return null;
  }
}

