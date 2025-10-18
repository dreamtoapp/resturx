import Image from 'next/image';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';

interface RestaurantMenuHeaderProps {
  restaurant: {
    slug: string;
    name: string;
    imageUrl?: string | null;
    country?: { name: string } | null;
    deliveryTime?: string | null;
    minOrder?: number | null;
  };
}

export default function RestaurantMenuHeader({ restaurant }: RestaurantMenuHeaderProps) {
  return (
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
  );
}

