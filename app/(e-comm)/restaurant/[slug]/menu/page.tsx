export const revalidate = 60;
import { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/link';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types/commonTypes';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import prisma from '@/lib/prisma';
import AddToCart from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/AddToCart';

async function getRestaurantMenu(slug: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        country: true,
        dishes: {
          where: { published: true },
          orderBy: { createdAt: 'desc' }
        },
      },
    });

    return restaurant;
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantMenu(slug);

  if (!restaurant) {
    return {
      title: 'Restaurant Not Found',
    };
  }

  return {
    title: `قائمة ${restaurant.name}`,
    description: `تصفح قائمة طعام ${restaurant.name} واطلب أشهى الأطباق`,
  };
}

export default async function RestaurantMenuPage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const restaurant = await getRestaurantMenu(slug);

  if (!restaurant || restaurant.status !== 'ACTIVE') {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      {/* Restaurant Header (Compact) */}
      <div className="flex items-center gap-4 mb-8 pb-4 border-b">
        {restaurant.imageUrl && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <Link href={`/restaurant/${restaurant.slug}`} className="hover:underline">
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          </Link>
          {restaurant.country && (
            <p className="text-sm text-muted-foreground">{restaurant.country.name}</p>
          )}
        </div>
        <div className="flex gap-2">
          {restaurant.deliveryTime && (
            <Badge variant="secondary">
              <Icon name="Clock" className="h-3 w-3 mr-1" />
              {restaurant.deliveryTime}
            </Badge>
          )}
          {restaurant.minOrder && (
            <Badge variant="outline">
              الحد الأدنى {restaurant.minOrder} ريال
            </Badge>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">القائمة الكاملة</h2>

      {/* Dishes Grid */}
      {restaurant.dishes && restaurant.dishes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurant.dishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <Link href={`/product/${dish.slug}`}>
                <div className="relative h-48 bg-muted">
                  <Image
                    src={dish.imageUrl || '/placeholder.svg'}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {dish.outOfStock && (
                    <Badge className="absolute top-2 right-2" variant="destructive">
                      نفذ
                    </Badge>
                  )}
                </div>
              </Link>

              <CardContent className="p-4 space-y-3">
                <div>
                  <Link href={`/product/${dish.slug}`} className="hover:text-primary">
                    <h3 className="font-semibold">{dish.name}</h3>
                  </Link>
                  {dish.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {dish.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">{dish.price} ريال</span>
                    {dish.compareAtPrice && dish.compareAtPrice > dish.price && (
                      <span className="text-sm line-through text-muted-foreground mr-2">
                        {dish.compareAtPrice} ريال
                      </span>
                    )}
                  </div>
                  {dish.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Icon name="Star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{dish.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {!dish.outOfStock && (
                  <AddToCart
                    product={{
                      id: dish.id,
                      name: dish.name,
                      price: dish.price,
                      imageUrl: dish.imageUrl || '',
                    } as any}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Icon name="UtensilsCrossed" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد أطباق متاحة</h3>
          <p className="text-muted-foreground">
            القائمة قيد التحديث. تحقق مرة أخرى قريباً!
          </p>
        </Card>
      )}
    </div>
  );
}

