'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface AddVideoResult {
  success: boolean;
  message: string;
  videoId?: string;
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\?\/]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export async function addVideo(
  youtubeUrl: string,
  title: string,
  description?: string
): Promise<AddVideoResult> {
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

    // Extract YouTube video ID
    const videoId = extractYouTubeId(youtubeUrl);

    if (!videoId) {
      return {
        success: false,
        message: 'رابط YouTube غير صالح'
      };
    }

    // Check video limit (max 5 videos)
    const videoCount = await prisma.restaurantVideo.count({
      where: { restaurantId: restaurant.id }
    });

    if (videoCount >= 5) {
      return {
        success: false,
        message: 'لقد وصلت للحد الأقصى من الفيديوهات (5 فيديوهات)'
      };
    }

    // Validate title length
    if (title.length > 200) {
      return {
        success: false,
        message: 'العنوان طويل جداً (الحد الأقصى 200 حرف)'
      };
    }

    // Validate description length
    if (description && description.length > 500) {
      return {
        success: false,
        message: 'الوصف طويل جداً (الحد الأقصى 500 حرف)'
      };
    }

    // Generate thumbnail URL
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    // Get the next order number
    const lastVideo = await prisma.restaurantVideo.findFirst({
      where: { restaurantId: restaurant.id },
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    const nextOrder = (lastVideo?.order ?? -1) + 1;

    // Create the new video
    const newVideo = await prisma.restaurantVideo.create({
      data: {
        restaurantId: restaurant.id,
        youtubeUrl,
        videoId,
        title: title.trim(),
        description: description?.trim() || null,
        thumbnailUrl,
        order: nextOrder,
      }
    });

    revalidatePath('/restaurant-portal/videos');
    revalidatePath(`/restaurant/${restaurant.slug}`);
    revalidatePath('/restaurant-portal');

    return {
      success: true,
      message: 'تمت إضافة الفيديو بنجاح ✅',
      videoId: newVideo.id
    };
  } catch (error) {
    console.error('Error adding video:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة الفيديو'
    };
  }
}

