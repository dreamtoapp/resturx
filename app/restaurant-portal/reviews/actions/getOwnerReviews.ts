'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function getOwnerReviews() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return null;
    }

    // Get restaurant for this owner
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId: session.user.id },
      include: {
        reviews: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return restaurant;
  } catch (error) {
    console.error('Error fetching owner reviews:', error);
    return null;
  }
}

