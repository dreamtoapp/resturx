'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface UpdateVideoResult {
  success: boolean;
  message: string;
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

export async function updateVideo(
  videoId: string,
  youtubeUrl: string,
  title: string,
  description?: string
): Promise<UpdateVideoResult> {
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

    // Verify the video belongs to this restaurant
    const video = await prisma.restaurantVideo.findUnique({
      where: { id: videoId },
      select: { restaurantId: true }
    });

    if (!video || video.restaurantId !== restaurant.id) {
      return {
        success: false,
        message: 'الفيديو غير موجود أو لا تملك صلاحية تعديله'
      };
    }

    // Extract YouTube video ID
    const extractedVideoId = extractYouTubeId(youtubeUrl);

    if (!extractedVideoId) {
      return {
        success: false,
        message: 'رابط YouTube غير صالح'
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
    const thumbnailUrl = `https://img.youtube.com/vi/${extractedVideoId}/hqdefault.jpg`;

    // Update video
    await prisma.restaurantVideo.update({
      where: { id: videoId },
      data: {
        youtubeUrl,
        videoId: extractedVideoId,
        title: title.trim(),
        description: description?.trim() || null,
        thumbnailUrl,
      }
    });

    revalidatePath('/restaurant-portal/videos');
    revalidatePath(`/restaurant/${restaurant.slug}`);

    return {
      success: true,
      message: 'تم تحديث الفيديو بنجاح ✅'
    };
  } catch (error) {
    console.error('Error updating video:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء تحديث الفيديو'
    };
  }
}

