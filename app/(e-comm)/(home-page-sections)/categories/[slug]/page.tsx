export const revalidate = 60;
import { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/link';
import { notFound } from 'next/navigation';
import { getCountryWithRestaurants } from '../action/getCountryRestaurants';
import { PageProps } from '@/types/commonTypes';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCountryWithRestaurants(slug);

  if (!result) {
    return {
      title: 'Country Not Found',
    };
  }

  return {
    title: `${result.country.name} - مطاعم`,
    description: result.country.description || `اكتشف أفضل المطاعم من ${result.country.name}`,
  };
}

export default async function CountryRestaurantsPage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const result = await getCountryWithRestaurants(slug);

  if (!result) {
    notFound();
  }

  const { country, restaurants } = result;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Country Header */}
      <div className="flex items-center gap-4">
        {country.logo && (
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
            <Image
              src={country.logo}
              alt={country.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{country.name}</h1>
          {country.description && (
            <p className="text-muted-foreground">{country.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">
              {restaurants.length} مطعم
            </Badge>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      {restaurants.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant: any) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                <Image
                  src={restaurant.imageUrl || restaurant.coverImage || '/placeholder.svg'}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
                {restaurant.isVerified && (
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                    <Icon name="BadgeCheck" className="h-3 w-3 mr-1" />
                    موثق
                  </Badge>
                )}
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                  {restaurant.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {restaurant.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {restaurant.deliveryTime && (
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" className="h-4 w-4" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                  )}
                  {restaurant.minOrder && (
                    <div className="flex items-center gap-1">
                      <Icon name="DollarSign" className="h-4 w-4" />
                      <span>الحد الأدنى {restaurant.minOrder} ريال</span>
                    </div>
                  )}
                  {restaurant.rating && (
                    <div className="flex items-center gap-1">
                      <Icon name="Star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{restaurant.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {restaurant._count.dishes} طبق
                  </Badge>
                  {restaurant.hasOwnDelivery && (
                    <Badge variant="outline" className="text-xs">
                      <Icon name="Truck" className="h-3 w-3 mr-1" />
                      توصيل خاص
                    </Badge>
                  )}
                </div>

                {restaurant.services && restaurant.services.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t">
                    {restaurant.services.slice(0, 4).map((service: any) => (
                      <span key={service.id} className="text-xs text-muted-foreground">
                        • {service.name}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/restaurant/${restaurant.slug}`}
                  className="block w-full"
                >
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition">
                    عرض القائمة
                  </button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Icon name="UtensilsCrossed" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد مطاعم متاحة</h3>
          <p className="text-muted-foreground">
            لا توجد مطاعم مسجلة في هذا التصنيف حالياً. تحقق مرة أخرى قريباً!
          </p>
        </Card>
      )}
    </div>
  );
}




