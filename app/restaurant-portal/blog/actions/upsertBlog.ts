'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface UpsertBlogInput {
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  isPublished: boolean;
}

export async function upsertBlog(input: UpsertBlogInput) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول'
      };
    }

    // Get restaurant for this owner
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

    // Upsert blog post (create or update)
    await prisma.restaurantPost.upsert({
      where: { restaurantId: restaurant.id },
      create: {
        restaurantId: restaurant.id,
        title: input.title,
        content: input.content,
        excerpt: input.excerpt || null,
        imageUrl: input.imageUrl || null,
        isPublished: input.isPublished,
        publishedAt: input.isPublished ? new Date() : null
      },
      update: {
        title: input.title,
        content: input.content,
        excerpt: input.excerpt || null,
        imageUrl: input.imageUrl || null,
        isPublished: input.isPublished,
        publishedAt: input.isPublished ? new Date() : null
      }
    });

    revalidatePath('/restaurant-portal/blog');
    revalidatePath(`/restaurant/${restaurant.slug}`);
    revalidatePath(`/restaurant/${restaurant.slug}/blog`);

    return {
      success: true,
      message: input.isPublished ? 'تم نشر المدونة بنجاح' : 'تم حفظ المدونة كمسودة'
    };
  } catch (error) {
    console.error('Error upserting blog:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء حفظ المدونة'
    };
  }
}

