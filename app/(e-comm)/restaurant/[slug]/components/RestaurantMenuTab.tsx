import Image from 'next/image';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface RestaurantMenuTabProps {
  dishes: Array<{
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    price: number;
    outOfStock: boolean;
  }>;
  restaurantSlug: string;
}

export default function RestaurantMenuTab({ dishes, restaurantSlug }: RestaurantMenuTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">القائمة</h2>
        <Link href={`/restaurant/${restaurantSlug}/menu`}>
          <button className="text-sm text-primary hover:underline">
            عرض القائمة الكاملة ←
          </button>
        </Link>
      </div>

      {dishes && dishes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 bg-muted">
                <Image
                  src={dish.imageUrl || '/placeholder.svg'}
                  alt={dish.name}
                  fill
                  className="object-cover"
                />
                {dish.outOfStock && (
                  <Badge className="absolute top-2 right-2" variant="destructive">
                    نفذ
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{dish.name}</h3>
                {dish.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {dish.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{dish.price} ريال</span>
                  <Link href={`/product/${dish.slug}`}>
                    <button className="text-sm text-primary hover:underline">
                      التفاصيل →
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">لا توجد أطباق متاحة حالياً</p>
        </Card>
      )}
    </div>
  );
}

