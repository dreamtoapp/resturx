'use server';

import prisma from '@/lib/prisma';

export async function getRestaurantProfile(slug: string) {
  try {
    // Decode URL-encoded slug (handles Arabic characters in URLs)
    const decodedSlug = decodeURIComponent(slug);

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: decodedSlug },
      include: {
        country: true,
        services: {
          where: { isActive: true },
          include: { masterService: true },
          orderBy: { displayOrder: 'asc' }
        },
        features: {
          where: { isActive: true },
          include: { masterFeature: true },
          orderBy: { displayOrder: 'asc' }
        },
        images: {
          orderBy: { order: 'asc' }
        },
        videos: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            videoId: true,
            title: true,
            description: true,
            thumbnailUrl: true,
          }
        },
        dishes: {
          where: { published: true, outOfStock: false },
          take: 12,
          orderBy: { createdAt: 'desc' },
          include: {
            dishCategory: true
          }
        },
        post: true, // One-to-one relation, filter in component
        reviews: {
          where: { isApproved: true },
          select: { rating: true }
        },
        _count: {
          select: {
            reviews: {
              where: { isApproved: true } // Count only approved reviews
            },
            dishes: {
              where: { published: true, outOfStock: false }
            },
            images: true,
            videos: true
          }
        }
      },
    });

    if (!restaurant) {
      return null;
    }

    // Calculate real average rating from approved reviews
    const totalRating = restaurant.reviews.reduce((sum, review) => sum + review.rating, 0);
    const calculatedRating = restaurant.reviews.length > 0
      ? Math.round((totalRating / restaurant.reviews.length) * 10) / 10
      : null;

    // Return restaurant with REAL calculated rating
    const { reviews, _count, ...restaurantData } = restaurant;
    return {
      ...restaurantData,
      rating: calculatedRating, // ✅ REAL calculated rating
      reviewCount: _count.reviews, // ✅ REAL count from database
      dishesCount: _count.dishes, // ✅ Total dishes count
      imagesCount: _count.images, // ✅ Total images count
      videosCount: _count.videos // ✅ Total videos count
    };
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
}

