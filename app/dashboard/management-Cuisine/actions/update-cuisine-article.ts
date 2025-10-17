'use server';

import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

export async function updateCuisineArticle(data: {
  cuisineId: string;
  article?: string;
  articleTitle?: string;
  metaDescription?: string;
  publish?: boolean;
}) {
  try {
    const { cuisineId, article, articleTitle, metaDescription, publish } = data;

    const updateData: any = {
      article: article || null,
      articleTitle: articleTitle || null,
      metaDescription: metaDescription || null,
    };

    // Set publishedAt if publish flag is true and article exists
    if (publish && article && article.length > 500) {
      updateData.publishedAt = new Date();
    } else if (!publish) {
      updateData.publishedAt = null;
    }

    await db.country.update({
      where: { id: cuisineId },
      data: updateData,
    });

    // Revalidate related pages
    revalidateTag('cuisines');
    revalidatePath('/dashboard/management-Cuisine');

    // Get cuisine slug for revalidation
    const cuisine = await db.country.findUnique({
      where: { id: cuisineId },
      select: { slug: true },
    });

    if (cuisine?.slug) {
      revalidatePath(`/cuisine/${cuisine.slug}`);
      revalidatePath(`/categories/${cuisine.slug}`);
    }

    return {
      success: true,
      message: 'تم حفظ المقالة بنجاح',
      published: !!updateData.publishedAt
    };
  } catch (error) {
    console.error('Error updating cuisine article:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء حفظ المقالة. يرجى المحاولة مرة أخرى.'
    };
  }
}

export async function getCuisineArticle(cuisineId: string) {
  try {
    const cuisine = await db.country.findUnique({
      where: { id: cuisineId },
      select: {
        id: true,
        name: true,
        slug: true,
        article: true,
        articleTitle: true,
        metaDescription: true,
        publishedAt: true,
      },
    });

    return cuisine;
  } catch (error) {
    console.error('Error fetching cuisine article:', error);
    return null;
  }
}

