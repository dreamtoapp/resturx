import { MetadataRoute } from 'next';
import { getCanonicalBase } from '@/helpers/seo/canonical';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const BASE_URL = await getCanonicalBase();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // User/account pages
          '/account',
          '/account/',
          '/account/*',
          '/profile',
          '/user',
          '/login',
          '/logout',
          '/register',
          '/settings',

          // Cart/checkout
          '/cart',
          '/cart/*',
          '/checkout',
          '/checkout/*',

          // Admin/back-office
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',

          // API endpoints
          '/api',
          '/api/*',

          // Internal search and query params
          '/search',
          '/search?',
          '/*?q=',
          '/*?s=',
          '/*?page=',
          '/*&page=',
          '/*?sort=',
          '/*?filter=',
          '/*?category=',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
