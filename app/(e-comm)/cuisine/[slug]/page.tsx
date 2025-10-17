import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import db from '@/lib/prisma';
import { PageProps } from '@/types/commonTypes';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { buildMetadata } from '@/helpers/seo/metadata';
import { buildCanonical } from '@/helpers/seo/canonical';

export const revalidate = 3600; // Revalidate every hour

async function getCuisine(slug: string) {
  return await db.country.findUnique({
    where: { slug },
    include: {
      restaurants: {
        where: { status: 'ACTIVE', isVerified: true },
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
          rating: true,
          reviewCount: true,
          deliveryTime: true,
          minOrder: true,
        },
        take: 6,
        orderBy: { rating: 'desc' },
      },
    },
  });
}

async function getPopularDishes(slug: string) {
  const cuisine = await db.country.findUnique({
    where: { slug },
    include: {
      restaurants: {
        select: { id: true },
      },
    },
  });

  if (!cuisine) return [];

  const restaurantIds = cuisine.restaurants.map((r) => r.id);

  return await db.dish.findMany({
    where: {
      supplierId: { in: restaurantIds },
      published: true,
      outOfStock: false,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      price: true,
      compareAtPrice: true,
      rating: true,
    },
    take: 8,
    orderBy: { rating: 'desc' },
  });
}

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const cuisine = await getCuisine(slug);

  if (!cuisine) {
    return { title: 'Cuisine Not Found' };
  }

  const title = cuisine.articleTitle || `${cuisine.name} - دليل شامل`;
  const description = cuisine.metaDescription || cuisine.description || `اكتشف أشهر الأطباق والمطاعم من ${cuisine.name}`;

  return buildMetadata({
    title,
    description,
    canonicalPath: `/cuisine/${slug}`
  });
}

export default async function CuisinePage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const [cuisine, dishes] = await Promise.all([
    getCuisine(slug),
    getPopularDishes(slug),
  ]);

  if (!cuisine) {
    notFound();
  }

  const canonical = await buildCanonical(`/cuisine/${slug}`);

  // Article JSON-LD structured data
  const articleJsonLd = cuisine.article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cuisine.articleTitle || cuisine.name,
    description: cuisine.metaDescription || cuisine.description,
    image: cuisine.logo,
    datePublished: cuisine.publishedAt?.toISOString() || cuisine.createdAt.toISOString(),
    dateModified: cuisine.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'ResturX',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ResturX',
      logo: {
        '@type': 'ImageObject',
        url: canonical.replace(/\/cuisine\/.*/, '') + '/icons/icon-512x512.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
  } : null;

  return (
    <>
      {/* Structured Data */}
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}

      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">الرئيسية</Link>
          <Icon name="ChevronLeft" className="h-4 w-4" />
          <Link href="/categories" className="hover:text-foreground">المطابخ</Link>
          <Icon name="ChevronLeft" className="h-4 w-4" />
          <span className="text-foreground">{cuisine.name}</span>
        </nav>

        {/* Hero Header */}
        <header className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl">
          {cuisine.logo && (
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={cuisine.logo}
                alt={`${cuisine.name} flag`}
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
          <div className="flex-1 text-center md:text-right space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              {cuisine.articleTitle || cuisine.name}
            </h1>
            {cuisine.description && (
              <p className="text-lg text-muted-foreground">{cuisine.description}</p>
            )}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Badge variant="secondary" className="text-sm">
                <Icon name="Store" className="h-4 w-4 ml-1" />
                {cuisine.restaurants.length} مطعم
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Icon name="UtensilsCrossed" className="h-4 w-4 ml-1" />
                {dishes.length}+ طبق
              </Badge>
            </div>
          </div>
        </header>

        {/* Article Content */}
        {cuisine.article && (
          <article className="prose prose-lg max-w-none bg-card p-8 rounded-xl border">
            <div
              dangerouslySetInnerHTML={{ __html: cuisine.article }}
              className="text-foreground leading-relaxed space-y-6"
            />
            {cuisine.publishedAt && (
              <p className="text-sm text-muted-foreground mt-8 pt-4 border-t">
                آخر تحديث: {new Date(cuisine.publishedAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </article>
        )}

        {/* Popular Dishes Section */}
        {dishes.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon name="UtensilsCrossed" className="h-6 w-6 text-primary" />
              أشهر الأطباق
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dishes.map((dish) => (
                <Link
                  key={dish.id}
                  href={`/product/${dish.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    {dish.imageUrl && (
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={dish.imageUrl}
                          alt={dish.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-3 space-y-1">
                      <h3 className="font-semibold text-sm line-clamp-1">{dish.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-bold">{dish.price} ر.س</span>
                        {dish.rating && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Icon name="Star" className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {dish.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Restaurants Section */}
        {cuisine.restaurants.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon name="Store" className="h-6 w-6 text-primary" />
              مطاعم مميزة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cuisine.restaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurant/${restaurant.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    {restaurant.imageUrl && (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {restaurant.rating && (
                          <div className="flex items-center gap-1">
                            <Icon name="Star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {restaurant.rating.toFixed(1)}
                            <span className="text-xs">({restaurant.reviewCount})</span>
                          </div>
                        )}
                        {restaurant.deliveryTime && (
                          <div className="flex items-center gap-1">
                            <Icon name="Clock" className="h-4 w-4" />
                            {restaurant.deliveryTime}
                          </div>
                        )}
                      </div>
                      {restaurant.minOrder && (
                        <p className="text-xs text-muted-foreground">
                          الحد الأدنى: {restaurant.minOrder} ر.س
                        </p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <div className="text-center py-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="ChefHat" className="h-5 w-5" />
            استكشف جميع أنواع المطابخ
          </Link>
        </div>
      </div>
    </>
  );
}



