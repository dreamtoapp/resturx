'use server';

import db from '@/lib/prisma';

/**
 * Fetches cuisine article data by slug
 * @param slug - The cuisine slug (will be decoded from URL encoding)
 * @returns Cuisine data with article information
 */
export async function getCuisineArticle(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  return await db.country.findFirst({
    where: { slug: decodedSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      description: true,
      article: true,
      articleTitle: true,
      metaDescription: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

