import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types/commonTypes';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { buildMetadata } from '@/helpers/seo/metadata';
import { getCuisineWithDishes } from '../../actions/getCuisineWithDishes';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const cuisine = await getCuisineWithDishes(slug);

  if (!cuisine) {
    return { title: 'Cuisine Not Found' };
  }

  const title = `الأطباق المشهورة - ${cuisine.name}`;
  const description = `اكتشف أشهر ${cuisine.popularDishes.length}+ أطباق من ${cuisine.name}`;

  return buildMetadata({
    title,
    description,
    canonicalPath: `/cuisine/${decodedSlug}/popular-dishes`
  });
}

export default async function PopularDishesPage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const cuisine = await getCuisineWithDishes(slug);

  if (!cuisine) {
    notFound();
  }

  // ItemList JSON-LD for dishes
  const dishesJsonLd = cuisine.popularDishes.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `أشهر أطباق ${cuisine.name}`,
    description: `قائمة بأشهر الأطباق من ${cuisine.name}`,
    numberOfItems: cuisine.popularDishes.length,
    itemListElement: cuisine.popularDishes.map((dish: { id: string; name: string; description: string | null; imageUrl: string | null }, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Recipe',
        name: dish.name,
        description: dish.description,
        image: dish.imageUrl,
      },
    })),
  } : null;

  return (
    <>
      {/* Structured Data */}
      {dishesJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dishesJsonLd) }}
        />
      )}

      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">الرئيسية</Link>
          <Icon name="ChevronRight" className="h-4 w-4" />
          <Link href="/cuisines" className="hover:text-foreground">المطابخ</Link>
          <Icon name="ChevronRight" className="h-4 w-4" />
          <span className="text-foreground">{cuisine.name} - الأطباق المشهورة</span>
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
              أشهر أطباق {cuisine.name}
            </h1>
            {cuisine.description && (
              <p className="text-lg text-muted-foreground">{cuisine.description}</p>
            )}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Badge variant="secondary" className="text-sm">
                <Icon name="UtensilsCrossed" className="h-4 w-4 ml-1" />
                {cuisine.popularDishes.length} طبق
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Icon name="Store" className="h-4 w-4 ml-1" />
                {cuisine.restaurants.length}+ مطعم
              </Badge>
            </div>
          </div>
        </header>

        {/* Popular Dishes Section */}
        {cuisine.popularDishes.length > 0 ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Icon name="UtensilsCrossed" className="h-6 w-6 text-primary" />
                الأطباق المشهورة
              </h2>
              <Badge variant="outline">{cuisine.popularDishes.length} طبق</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cuisine.popularDishes.map((dish: { id: string; name: string; description: string | null; imageUrl: string | null }) => (
                <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {dish.imageUrl && (
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-sm line-clamp-1">{dish.name}</h3>
                    {dish.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {dish.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16">
            <Icon name="UtensilsCrossed" className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">لا توجد أطباق متاحة</h2>
            <p className="text-muted-foreground">لم يتم إضافة أطباق مشهورة لهذا المطبخ بعد</p>
          </div>
        )}

        {/* Featured Restaurants */}
        {cuisine.restaurants.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon name="Store" className="h-6 w-6 text-primary" />
              مطاعم {cuisine.name} المميزة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cuisine.restaurants.map((restaurant: { id: string; name: string; slug: string; imageUrl: string | null; rating: number; reviewCount: number }) => (
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
                      {restaurant.rating && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Icon name="Star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {restaurant.rating.toFixed(1)}
                          <span className="text-xs">({restaurant.reviewCount})</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link
                href={`/cuisines/${decodedSlug}`}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                عرض جميع المطاعم
                <Icon name="ArrowLeft" className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between pt-8 border-t">
          <Link
            href="/cuisines"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Icon name="ArrowRight" className="h-4 w-4" />
            العودة إلى المطابخ
          </Link>
          <Link
            href={`/cuisine/${decodedSlug}/article`}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Icon name="BookOpen" className="h-4 w-4" />
            قراءة المقالة
          </Link>
        </div>
      </div>
    </>
  );
}

