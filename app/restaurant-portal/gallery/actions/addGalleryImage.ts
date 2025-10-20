'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface AddGalleryImageResult {
  success: boolean;
  message: string;
  imageId?: string;
}

export async function addGalleryImage(
  imageUrl: string,
  caption?: string
): Promise<AddGalleryImageResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول'
      };
    }

    // Get restaurant
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId: session.user.id },
      select: { id: true, slug: true }
    });

    if (!restaurant) {
      return {
        success: false,
        message: 'لم يتم العثور على المطعم'
      };
    }

    // Check gallery limit (max 20 images)
    const imageCount = await prisma.restaurantImage.count({
      where: { restaurantId: restaurant.id }
    });

    if (imageCount >= 20) {
      return {
        success: false,
        message: 'لقد وصلت للحد الأقصى من الصور (20 صورة)'
      };
    }

    // Get the next order number
    const lastImage = await prisma.restaurantImage.findFirst({
      where: { restaurantId: restaurant.id },
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    const nextOrder = (lastImage?.order ?? -1) + 1;

    // Create the new gallery image
    const newImage = await prisma.restaurantImage.create({
      data: {
        restaurantId: restaurant.id,
        imageUrl,
        caption: caption || null,
        order: nextOrder,
      }
    });

    revalidatePath('/restaurant-portal/gallery');
    revalidatePath(`/restaurant/${restaurant.slug}`);
    revalidatePath('/restaurant-portal');

    return {
      success: true,
      message: 'تمت إضافة الصورة بنجاح ✅',
      imageId: newImage.id
    };
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة الصورة'
    };
  }
}


