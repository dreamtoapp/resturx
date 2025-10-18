'use server';

import prisma from '@/lib/prisma';

export async function getRestaurantBlog(restaurantSlug: string) {
  try {
    const decodedSlug = decodeURIComponent(restaurantSlug);
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: decodedSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        post: true
      }
    });

    // Check if restaurant exists, has a post, and the post is published
    if (!restaurant || !restaurant.post || !restaurant.post.isPublished) {
      return null;
    }

    return restaurant;
  } catch (error) {
    console.error('Error fetching restaurant blog:', error);
    return null;
  }
}

