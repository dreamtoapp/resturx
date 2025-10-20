'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function getAvailableServices() {
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

    // Get all active master services
    const masterServices = await prisma.masterService.findMany({
      where: { isActive: true },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    // Get restaurant's selected services
    const selectedServices = await prisma.restaurantService.findMany({
      where: { restaurantId: restaurant.id },
      select: { masterServiceId: true }
    });

    const selectedServiceIds = selectedServices.map(s => s.masterServiceId);

    return {
      restaurant,
      masterServices,
      selectedServiceIds,
    };
  } catch (error) {
    console.error('Error fetching available services:', error);
    return null;
  }
}




