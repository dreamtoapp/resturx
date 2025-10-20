'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function getAvailableFeatures() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return null;
    }

    // Get restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId: session.user.id },
      select: { id: true }
    });

    if (!restaurant) {
      return null;
    }

    // Get all active master features
    const masterFeatures = await prisma.masterFeature.findMany({
      where: { isActive: true },
      orderBy: [
        { displayOrder: 'asc' },
        { title: 'asc' }
      ]
    });

    // Get restaurant's selected features
    const selectedFeatures = await prisma.restaurantFeature.findMany({
      where: { restaurantId: restaurant.id },
      select: { masterFeatureId: true }
    });

    const selectedFeatureIds = selectedFeatures.map(f => f.masterFeatureId);

    return {
      restaurant,
      masterFeatures,
      selectedFeatureIds,
    };
  } catch (error) {
    console.error('Error fetching available features:', error);
    return null;
  }
}




