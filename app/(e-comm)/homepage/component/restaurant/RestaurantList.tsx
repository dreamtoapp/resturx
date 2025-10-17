import Image from 'next/image';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Icon } from '@/components/icons/Icon';
import { getRestaurants } from '../../actions/getRestaurants';

// Restaurant Header Component
function RestaurantHeader({ restaurantCount }: { restaurantCount: number }) {
  return (
    <header className="flex items-center justify-between pb-1">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">المطاعم المميزة</h2>
          <Badge variant="outline">
            {restaurantCount}
          </Badge>
        </div>
        <p className="hidden md:block text-sm text-muted-foreground">اكتشف أفضل المطاعم واستمتع بأشهى الأطباق</p>
      </div>
      {restaurantCount > 0 && (
        <Link href="/categories" className="flex items-center text-sm font-medium text-primary hover:underline">
          عرض الكل
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="M19 12H5"></path>
            <path d="m12 19-7-7 7-7"></path>
          </svg>
        </Link>
      )}
    </header>
  );
}

// Restaurant Card Component
function RestaurantCard({ restaurant, index }: { restaurant: any; index: number }) {
  return (
    <li key={restaurant.id} className="min-w-[16rem] md:min-w-[20rem] border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/restaurant/${restaurant.slug}`} className="group cursor-pointer flex flex-col h-full">
        {/* Restaurant Image */}
        <div className="relative h-32 md:h-40 w-full overflow-hidden bg-gray-100">
          {restaurant.imageUrl ? (
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={index < 6}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <Icon name="Store" className="w-12 h-12 text-slate-400" />
            </div>
          )}
          {restaurant.isVerified && (
            <Badge className="absolute top-2 right-2 bg-primary/90 text-white">
              <Icon name="BadgeCheck" className="w-3 h-3 mr-1" />
              موثق
            </Badge>
          )}
        </div>

        {/* Restaurant Info */}
        <div className="p-3 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground line-clamp-1">{restaurant.name}</h3>
              {restaurant.country && (
                <p className="text-xs text-muted-foreground">{restaurant.country.name}</p>
              )}
            </div>
            {restaurant.rating && (
              <Badge variant="secondary" className="flex items-center gap-1 ml-2">
                <Icon name="Star" className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{restaurant.rating.toFixed(1)}</span>
              </Badge>
            )}
          </div>

          {restaurant.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{restaurant.description}</p>
          )}

          <div className="mt-auto pt-2 flex items-center gap-3 text-xs text-muted-foreground border-t">
            {restaurant.deliveryTime && (
              <div className="flex items-center gap-1">
                <Icon name="Clock" className="w-3 h-3" />
                <span>{restaurant.deliveryTime}</span>
              </div>
            )}
            {restaurant.minOrder && (
              <div className="flex items-center gap-1">
                <Icon name="DollarSign" className="w-3 h-3" />
                <span>الحد الأدنى {restaurant.minOrder} ر.س</span>
              </div>
            )}
            {restaurant._count?.dishes > 0 && (
              <div className="flex items-center gap-1 mr-auto">
                <Icon name="UtensilsCrossed" className="w-3 h-3" />
                <span>{restaurant._count.dishes} طبق</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

// Empty State Component (currently unused - kept for future use)
// function EmptyState() {
//   return (
//     <div className="py-12 px-6 text-center">
//       <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
//         <Icon name="Store" className="w-12 h-12 text-primary/60" />
//       </div>
//       <h3 className="text-lg font-semibold text-foreground mb-3">
//         لا توجد مطاعم متاحة حالياً
//       </h3>
//       <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
//         نحن نعمل على إضافة مطاعم متنوعة. ستعود قريباً مع تشكيلة واسعة من المطاعم المميزة.
//       </p>
//     </div>
//   );
// }

// Main Restaurant List Component
export default async function RestaurantList() {
  const restaurants = await getRestaurants();

  // Show only first 10 restaurants on homepage
  const featuredRestaurants = restaurants.slice(0, 10);

  if (featuredRestaurants.length === 0) {
    return null; // Don't show section if no restaurants
  }

  return (
    <section className="mx-auto w-full bg-transparent shadow-sm" aria-label="Featured restaurants">
      <RestaurantHeader restaurantCount={restaurants.length} />
      <Card>
        <CardContent className="px-4 py-2">
          <ScrollArea className="w-full py-1">
            <nav aria-label="قائمة المطاعم">
              <ul className="flex gap-4 pb-1">
                {featuredRestaurants.map((restaurant, idx) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} index={idx} />
                ))}
              </ul>
            </nav>
            <ScrollBar orientation="horizontal" className="h-2 [&>div]:bg-primary/30" />
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
}


